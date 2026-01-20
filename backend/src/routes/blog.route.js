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

// Create post (protected route)
router.post('/create-post', verifyToken, isAdmin, async (req, res) => {
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

        const newPost = await prisma.blogs.create({
            data: {
                title,
                description,
                content: JSON.stringify(content), // convert object เป็น string
                categoryId: categoryId ? parseInt(categoryId) : null,
                coverImg,
                author: req.userId, // จาก middleware verifyToken
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
                }
            }
        });

        res.status(201).json({
            message: 'สร้างโพสต์สำเร็จ',
            post: newPost
        });
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ message: 'สร้างโพสต์ไม่สำเร็จ' });
    }
});

// @route   GET /api/blogs
router.get("/", async (req, res) => {
    try {
        const { search, category, location, page = 1, limit = 10 } = req.query;

        let whereClause = {
            isDeleted: false,
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

// Update a post (protected route)
router.patch('/update-post/:id', verifyToken, isAdmin, async (req, res) => {
    try {
        const postId = parseInt(req.params.id);
        const { title, description, content, categoryId, coverImg } = req.body;

        if (isNaN(postId)) {
            return res.status(400).json({ message: 'Invalid post ID' });
        }

        // ตรวจสอบว่าโพสต์มีอยู่และไม่ถูกลบ
        const existingPost = await prisma.blogs.findFirst({
            where: {
                id: postId,
                isDeleted: false
            }
        });

        if (!existingPost) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // ตรวจสอบว่า categoryId มีอยู่จริง (ถ้ามีการส่งมา)
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

        const updatedPost = await prisma.blogs.update({
            where: {
                id: postId
            },
            data: {
                title,
                description,
                content: JSON.stringify(content), //  convert object -> string 
                categoryId: categoryId ? parseInt(categoryId) : null,
                coverImg,
                updatedBy: req.userId
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
                }
            }
        });

        res.status(200).json({
            message: 'Post updated successfully',
            post: updatedPost
        });
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

// Get all categories (public route) - DEPRECATED: Now using /categories endpoint with blog_categories table
// router.get('/categories/all', async (req, res) => {
//     try {
//         const categories = await prisma.blogs.groupBy({
//             by: ['category'],
//             where: {
//                 isDeleted: false,
//                 category: {
//                     not: null
//                 }
//             },
//             _count: {
//                 category: true
//             },
//             orderBy: {
//                 _count: {
//                     category: 'desc'
//                 }
//             }
//         });

//         res.status(200).json(categories);
//     } catch (error) {
//         console.error('Error fetching categories:', error);
//         res.status(500).json({ message: 'Failed to fetch categories' });
//     }
// });


module.exports = router;