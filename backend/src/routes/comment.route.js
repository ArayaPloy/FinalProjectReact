// routes/comment.route.js

const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const verifyToken = require('../middleware/verifyToken');

const prisma = new PrismaClient();

// Post comment (protected route)
router.post('/post-comment', verifyToken, async (req, res) => {
    try {
        const { comment, postId } = req.body;
        const userId = req.userId; // จาก middleware verifyToken

        // ตรวจสอบว่า postId เป็นตัวเลขและ blog post มีอยู่จริง
        const postIdInt = parseInt(postId);
        if (isNaN(postIdInt)) {
            return res.status(400).json({ message: 'Invalid post ID' });
        }

        // ตรวจสอบว่า blog post มีอยู่และไม่ถูกลบ
        const existingPost = await prisma.blog.findFirst({
            where: {
                id: postIdInt,
                isDeleted: false
            }
        });

        if (!existingPost) {
            return res.status(404).json({ message: 'Blog post not found' });
        }

        // สร้าง comment ใหม่
        const newComment = await prisma.comment.create({
            data: {
                comment,
                userId,
                postId: postIdInt
            },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        email: true
                    }
                },
                post: {
                    select: {
                        id: true,
                        title: true
                    }
                }
            }
        });

        res.status(201).json({ 
            message: 'Comment posted successfully', 
            comment: newComment 
        });
    } catch (error) {
        console.error('Error posting comment:', error);
        res.status(500).json({ message: 'Failed to post comment' });
    }
});

// Get total comments count
router.get('/total-comments', async (req, res) => {
    try {
        const totalComments = await prisma.comment.count({
            where: {
                deletedAt: null // เฉพาะ comment ที่ไม่ถูกลบ
            }
        });
        
        res.status(200).json({ totalComments });
    } catch (error) {
        console.error('Error fetching total comments:', error);
        res.status(500).json({ message: 'Failed to fetch total comments' });
    }
});

// Get comments for a specific post
router.get('/post/:postId', async (req, res) => {
    try {
        const postId = parseInt(req.params.postId);

        if (isNaN(postId)) {
            return res.status(400).json({ message: 'Invalid post ID' });
        }

        const comments = await prisma.comment.findMany({
            where: {
                postId: postId,
                deletedAt: null
            },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        email: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        res.status(200).json(comments);
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ message: 'Failed to fetch comments' });
    }
});

// Update comment (protected route - only comment owner can update)
router.patch('/update/:commentId', verifyToken, async (req, res) => {
    try {
        const commentId = parseInt(req.params.commentId);
        const { comment } = req.body;
        const userId = req.userId;

        if (isNaN(commentId)) {
            return res.status(400).json({ message: 'Invalid comment ID' });
        }

        // ตรวจสอบว่า comment มีอยู่และเป็นของ user คนนี้
        const existingComment = await prisma.comment.findFirst({
            where: {
                id: commentId,
                userId: userId,
                deletedAt: null
            }
        });

        if (!existingComment) {
            return res.status(404).json({ message: 'Comment not found or you do not have permission to update this comment' });
        }

        const updatedComment = await prisma.comment.update({
            where: {
                id: commentId
            },
            data: {
                comment
            },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        email: true
                    }
                }
            }
        });

        res.status(200).json({
            message: 'Comment updated successfully',
            comment: updatedComment
        });
    } catch (error) {
        console.error('Error updating comment:', error);
        res.status(500).json({ message: 'Failed to update comment' });
    }
});

// Delete comment (protected route - only comment owner can delete)
router.delete('/delete/:commentId', verifyToken, async (req, res) => {
    try {
        const commentId = parseInt(req.params.commentId);
        const userId = req.userId;

        if (isNaN(commentId)) {
            return res.status(400).json({ message: 'Invalid comment ID' });
        }

        // ตรวจสอบว่า comment มีอยู่และเป็นของ user คนนี้
        const existingComment = await prisma.comment.findFirst({
            where: {
                id: commentId,
                userId: userId,
                deletedAt: null
            }
        });

        if (!existingComment) {
            return res.status(404).json({ message: 'Comment not found or you do not have permission to delete this comment' });
        }

        // Soft delete
        await prisma.comment.update({
            where: {
                id: commentId
            },
            data: {
                deletedAt: new Date()
            }
        });

        res.status(200).json({
            message: 'Comment deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting comment:', error);
        res.status(500).json({ message: 'Failed to delete comment' });
    }
});

// Get comments by user (protected route)
router.get('/user/my-comments', verifyToken, async (req, res) => {
    try {
        const userId = req.userId;
        const { page = 1, limit = 10 } = req.query;

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const [comments, totalComments] = await Promise.all([
            prisma.comment.findMany({
                where: {
                    userId: userId,
                    deletedAt: null
                },
                include: {
                    post: {
                        select: {
                            id: true,
                            title: true,
                            category: true
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                },
                skip,
                take: parseInt(limit)
            }),
            prisma.comment.count({
                where: {
                    userId: userId,
                    deletedAt: null
                }
            })
        ]);

        res.status(200).json({
            comments,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(totalComments / parseInt(limit)),
                totalComments,
                hasNext: skip + comments.length < totalComments,
                hasPrev: parseInt(page) > 1
            }
        });
    } catch (error) {
        console.error('Error fetching user comments:', error);
        res.status(500).json({ message: 'Failed to fetch user comments' });
    }
});

module.exports = router;