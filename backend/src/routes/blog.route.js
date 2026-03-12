// routes/blog.route.js

const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const verifyToken = require('../middleware/verifyToken');
const isAdmin = require('../middleware/admin');

const prisma = new PrismaClient();

// Get all blog categories (public route)
router.get('/categories', async (req, res) => {
    try {
        const categories = await prisma.blog_categories.findMany({
            where: {
                isDeleted: false
            },
            orderBy: {
                sortOrder: 'asc'
            },
            select: {
                id: true,
                name: true,
                slug: true,
                description: true,
                icon: true,
                sortOrder: true
            }
        });

        res.status(200).json(categories);
    } catch (error) {
        console.error('Error fetching blog categories:', error);
        res.status(500).json({ message: 'ไม่สามารถดึงข้อมูลหมวดหมู่ได้' });
    }
});

// Create post (protected route — admin = published immediately, others = pending approval)
router.post('/create-post', verifyToken, async (req, res) => {
    try {
        const { title, description, content, categoryId, coverImg } = req.body;

        // ตรวจสอบว่า categoryId มีอยู่จริง
        if (categoryId) {
            const categoryExists = await prisma.blog_categories.findFirst({
                where: {
                    id: parseInt(categoryId),
                    isDeleted: false
                }
            });

            if (!categoryExists) {
                return res.status(400).json({ message: 'ไม่พบหมวดหมู่ที่เลือก' });
            }
        }

        const role = req.user?.role || 'user';
        const isAdminUser = role === 'admin' || role === 'super_admin';
        const postStatus = isAdminUser ? 'published' : 'pending';

        const newPost = await prisma.blogs.create({
            data: {
                title,
                description,
                content: JSON.stringify(content),
                categoryId: categoryId ? parseInt(categoryId) : null,
                coverImg,
                author: req.userId,
                status: postStatus,
            },
            include: {
                users_blogs_authorTousers: {
                    select: { id: true, username: true, email: true }
                },
                blog_categories: {
                    select: { id: true, name: true, slug: true, icon: true }
                }
            }
        });

        if (isAdminUser) {
            res.status(201).json({ message: 'สร้างโพสต์สำเร็จ', post: newPost });
        } else {
            res.status(201).json({
                message: 'ส่งคำขอสร้างบทความสำเร็จ กรุณารอการอนุญาตจากแอดมิน',
                pending: true,
                post: newPost
            });
        }
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ message: 'สร้างโพสต์ไม่สำเร็จ' });
    }
});

// GET pending blog posts (admin only)
router.get('/pending', verifyToken, isAdmin, async (req, res) => {
    try {
        const pendingPosts = await prisma.blogs.findMany({
            where: {
                status: 'pending',
                isDeleted: false
            },
            include: {
                users_blogs_authorTousers: {
                    select: { id: true, username: true, email: true }
                },
                blog_categories: {
                    select: { id: true, name: true, slug: true, icon: true }
                }
            },
            orderBy: { createdAt: 'asc' }
        });
        res.status(200).json(pendingPosts);
    } catch (error) {
        console.error('Error fetching pending posts:', error);
        res.status(500).json({ message: 'ไม่สามารถดึงข้อมูลคำขอได้' });
    }
});

// APPROVE a pending post (admin only)
router.patch('/approve/:id', verifyToken, isAdmin, async (req, res) => {
    try {
        const postId = parseInt(req.params.id);
        if (isNaN(postId)) return res.status(400).json({ message: 'Invalid post ID' });

        const pendingPost = await prisma.blogs.findFirst({
            where: { id: postId, status: 'pending', isDeleted: false }
        });
        if (!pendingPost) return res.status(404).json({ message: 'ไม่พบคำขอที่รอดำเนินการ' });

        if (pendingPost.pendingUpdateForId) {
            // This is a pending UPDATE request — copy content to the original post, then soft-delete this draft
            const originalId = pendingPost.pendingUpdateForId;
            await prisma.$transaction(async (tx) => {
                await tx.blogs.update({
                    where: { id: originalId },
                    data: {
                        title: pendingPost.title,
                        description: pendingPost.description,
                        content: pendingPost.content,
                        coverImg: pendingPost.coverImg,
                        categoryId: pendingPost.categoryId,
                        updatedBy: req.userId,
                        updatedAt: new Date(),
                    }
                });
                await tx.blogs.update({
                    where: { id: postId },
                    data: { isDeleted: true, deletedAt: new Date() }
                });
            });
            try {
                await prisma.audit_logs.create({
                    data: {
                        userId: req.userId || null,
                        tableName: 'blogs',
                        recordId: originalId,
                        action: 'UPDATE',
                        oldValues: JSON.stringify({ status: 'pending', pendingUpdateForId: postId }),
                        newValues: JSON.stringify({ status: 'merged' }),
                        ipAddress: req.ip || req.connection?.remoteAddress || null,
                        userAgent: req.get('user-agent') || null
                    }
                });
            } catch (auditError) {
                console.error('Error creating audit log:', auditError);
            }
            return res.status(200).json({ message: 'อนุมัติการแก้ไขบทความสำเร็จ' });
        } else {
            // New post — just publish it
            await prisma.blogs.update({
                where: { id: postId },
                data: { status: 'published', updatedBy: req.userId, updatedAt: new Date() }
            });
            try {
                await prisma.audit_logs.create({
                    data: {
                        userId: req.userId || null,
                        tableName: 'blogs',
                        recordId: postId,
                        action: 'UPDATE',
                        oldValues: JSON.stringify({ status: 'pending' }),
                        newValues: JSON.stringify({ status: 'published' }),
                        ipAddress: req.ip || req.connection?.remoteAddress || null,
                        userAgent: req.get('user-agent') || null
                    }
                });
            } catch (auditError) {
                console.error('Error creating audit log:', auditError);
            }
            return res.status(200).json({ message: 'อนุมัติบทความสำเร็จ' });
        }
    } catch (error) {
        console.error('Error approving post:', error);
        res.status(500).json({ message: 'ไม่สามารถอนุมัติบทความได้' });
    }
});

// REJECT a pending post (admin only)
router.patch('/reject/:id', verifyToken, isAdmin, async (req, res) => {
    try {
        const postId = parseInt(req.params.id);
        if (isNaN(postId)) return res.status(400).json({ message: 'Invalid post ID' });

        const pendingPost = await prisma.blogs.findFirst({
            where: { id: postId, status: 'pending', isDeleted: false }
        });
        if (!pendingPost) return res.status(404).json({ message: 'ไม่พบคำขอที่รอดำเนินการ' });

        await prisma.blogs.update({
            where: { id: postId },
            data: { status: 'rejected', isDeleted: true, deletedAt: new Date() }
        });
        try {
            await prisma.audit_logs.create({
                data: {
                    userId: req.userId || null,
                    tableName: 'blogs',
                    recordId: postId,
                    action: 'UPDATE',
                    oldValues: JSON.stringify({ status: 'pending' }),
                    newValues: JSON.stringify({ status: 'rejected' }),
                    ipAddress: req.ip || req.connection?.remoteAddress || null,
                    userAgent: req.get('user-agent') || null
                }
            });
        } catch (auditError) {
            console.error('Error creating audit log:', auditError);
        }
        res.status(200).json({ message: 'ปฏิเสธคำขอบทความแล้ว' });
    } catch (error) {
        console.error('Error rejecting post:', error);
        res.status(500).json({ message: 'ไม่สามารถปฏิเสธคำขอได้' });
    }
});

// @route   GET /api/blogs
router.get("/", async (req, res) => {
    try {
        const { search, category, location, page = 1, limit = 10 } = req.query;

        let whereClause = {
            isDeleted: false,
            status: 'published',
        };

        if (search) {
            // ใช้ contains แทน search (ไม่ต้องมี fulltext index)
            whereClause.OR = [
                { title: { contains: search } },
                { description: { contains: search } }
            ];
        }
        if (category) {
            whereClause.category = category;
        }
        if (location) {
            whereClause.location = location;
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const posts = await prisma.blogs.findMany({
            where: whereClause,
            include: {
                users_blogs_authorTousers: {
                    select: { id: true, username: true, email: true }
                },
                blog_categories: {
                    select: { id: true, name: true, slug: true, icon: true }
                },
                _count: {
                    select: { comments: true }
                }
            },
            orderBy: { createdAt: 'desc' },
            skip,
            take: parseInt(limit)
        });

        res.status(200).json(posts);
    } catch (error) {
        console.error('Detailed error:', error);
        res.status(500).json({ message: 'Failed to fetch posts' });
    }
});

// Get a single post (public route)
router.get('/:id', async (req, res) => {
    try {
        const postId = parseInt(req.params.id);

        if (isNaN(postId)) {
            return res.status(400).json({ message: 'Invalid post ID' });
        }

        const post = await prisma.blogs.findFirst({
            where: {
                id: postId,
                isDeleted: false
            },
            include: {
                users_blogs_authorTousers: {
                    select: {
                        id: true,
                        username: true,
                        email: true
                    }
                },
                blog_categories: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                        icon: true
                    }
                },
                comments: {
                    where: {
                        deletedAt: null
                    },
                    include: {
                        users: {
                            select: {
                                id: true,
                                username: true,
                                email: true,
                                profileImage: true  // เพิ่ม profileImage
                            }
                        }
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                }
            }
        });

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        res.status(200).json({
            post,
            comments: post.comments
        });
    } catch (error) {
        console.error('Error fetching post:', error);
        res.status(500).json({ message: 'Failed to fetch post' });
    }
});

// Update a post (admin = immediate, non-admin = pending update request)
router.patch('/update-post/:id', verifyToken, async (req, res) => {
    try {
        const postId = parseInt(req.params.id);
        const { title, description, content, categoryId, coverImg } = req.body;

        if (isNaN(postId)) {
            return res.status(400).json({ message: 'Invalid post ID' });
        }

        // ตรวจสอบว่าโพสต์มีอยู่และไม่ถูกลบ
        const existingPost = await prisma.blogs.findFirst({
            where: { id: postId, isDeleted: false, status: 'published' }
        });

        if (!existingPost) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // ตรวจสอบว่า categoryId มีอยู่จริง (ถ้ามีการส่งมา)
        if (categoryId) {
            const categoryExists = await prisma.blog_categories.findFirst({
                where: { id: parseInt(categoryId), isDeleted: false }
            });
            if (!categoryExists) {
                return res.status(400).json({ message: 'ไม่พบหมวดหมู่ที่เลือก' });
            }
        }

        const role = req.user?.role || 'user';
        const isAdminUser = role === 'admin' || role === 'super_admin';

        if (isAdminUser) {
            // แอดมิน — อัปเดตทันที
            const updatedPost = await prisma.blogs.update({
                where: { id: postId },
                data: {
                    title,
                    description,
                    content: JSON.stringify(content),
                    categoryId: categoryId ? parseInt(categoryId) : null,
                    coverImg,
                    updatedBy: req.userId
                },
                include: {
                    users_blogs_authorTousers: { select: { id: true, username: true, email: true } },
                    blog_categories: { select: { id: true, name: true, slug: true, icon: true } }
                }
            });
            return res.status(200).json({ message: 'แก้ไขบทความสำเร็จ', post: updatedPost });
        } else {
            // ไม่ใช่แอดมิน — สร้าง draft pending update แนบ originalPostId
            const draft = await prisma.blogs.create({
                data: {
                    title,
                    description,
                    content: JSON.stringify(content),
                    categoryId: categoryId ? parseInt(categoryId) : null,
                    coverImg,
                    author: req.userId,
                    status: 'pending',
                    pendingUpdateForId: postId,
                }
            });
            return res.status(201).json({
                message: 'ส่งคำขอแก้ไขบทความสำเร็จ กรุณารอการอนุญาตจากแอดมิน',
                pending: true,
                post: draft
            });
        }
    } catch (error) {
        console.error('Error updating post:', error);
        res.status(500).json({ message: 'Failed to update post' });
    }
});

// Delete a post with related comments (soft delete)
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
    try {
        const postId = parseInt(req.params.id);

        if (isNaN(postId)) {
            return res.status(400).json({ message: 'Invalid post ID' });
        }

        // ตรวจสอบว่าโพสต์มีอยู่
        const existingPost = await prisma.blogs.findFirst({
            where: {
                id: postId,
                isDeleted: false
            }
        });

        if (!existingPost) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // ใช้ transaction เพื่อลบโพสต์และคอมเมนต์พร้อมกัน
        await prisma.$transaction(async (tx) => {
            // Soft delete comments
            await tx.comments.updateMany({
                where: {
                    postId: postId
                },
                data: {
                    deletedAt: new Date()
                }
            });

            // Soft delete blog post
            await tx.blogs.update({
                where: {
                    id: postId
                },
                data: {
                    isDeleted: true,
                    deletedAt: new Date()
                }
            });
        });

        try {
            await prisma.audit_logs.create({
                data: {
                    userId: req.userId || null,
                    tableName: 'blogs',
                    recordId: postId,
                    action: 'DELETE',
                    oldValues: JSON.stringify({ title: existingPost.title, status: existingPost.status }),
                    newValues: null,
                    ipAddress: req.ip || req.connection?.remoteAddress || null,
                    userAgent: req.get('user-agent') || null
                }
            });
        } catch (auditError) {
            console.error('Error creating audit log:', auditError);
        }

        res.status(200).json({
            message: 'Post and associated comments deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).json({ message: 'Failed to delete post' });
    }
});

// Get related blog posts
router.get('/related/:id', async (req, res) => {
    try {
        const postId = parseInt(req.params.id);

        if (isNaN(postId)) {
            return res.status(400).json({ message: 'Invalid blog ID' });
        }

        // ดึงข้อมูลบล็อกปัจจุบัน
        const blog = await prisma.blogs.findFirst({
            where: {
                id: postId,
                isDeleted: false
            }
        });

        if (!blog) {
            return res.status(404).json({ message: 'Blog post not found' });
        }

        // ดึงบล็อกที่มี categoryId เหมือนกัน (ยกเว้นบล็อกปัจจุบัน)
        const relatedPosts = await prisma.blogs.findMany({
            where: {
                id: {
                    not: postId // ไม่รวมบล็อกปัจจุบัน
                },
                categoryId: blog.categoryId, // ดึงบล็อกที่มี categoryId เหมือนกัน
                isDeleted: false // เฉพาะโพสต์ที่ไม่ถูกลบ
            },
            include: {
                users_blogs_authorTousers: {
                    select: {
                        id: true,
                        username: true,
                        email: true
                    }
                },
                blog_categories: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                        icon: true
                    }
                },
                _count: {
                    select: {
                        comments: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: 5 // จำกัดจำนวนผลลัพธ์ 5 บล็อก
        });

        res.status(200).json(relatedPosts);
    } catch (error) {
        console.error('Error fetching related posts:', error);
        res.status(500).json({ message: 'Failed to fetch related posts' });
    }
});


module.exports = router;