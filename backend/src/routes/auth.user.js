const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const generateToken = require('../middleware/generateToken');
require('dotenv').config();

const prisma = new PrismaClient();

// Register endpoint
router.post('/register', async (req, res) => {
    try {
        const { email, password, username, roleId = 5 } = req.body; // default to 'user' role (id: 5)
        
        // Check if user already exists
        const existingUser = await prisma.users.findFirst({
            where: {
                OR: [
                    { email: email },
                    { username: username }
                ]
            }
        });

        if (existingUser) {
            return res.status(400).send({ message: 'User with this email or username already exists' });
        }

        // Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create user with default profile image
        const user = await prisma.users.create({
            data: {
                email,
                password: hashedPassword,
                username,
                roleId: parseInt(roleId),
                profileImage: '/default-avatar.jpg', // ⭐ Default avatar
                phone: null, // Optional field
                lastLogin: null // Will be updated on first login
            },
            include: {
                userroles: true
            }
        });

        res.status(201).send({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error registering user:', error);
        if (error.code === 'P2002') {
            return res.status(400).send({ message: 'Email or username already exists' });
        }
        res.status(500).send({ message: 'Registration failed' });
    }
});

// Login endpoint
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const user = await prisma.users.findUnique({
            where: { email },
            include: {
                userroles: true
            }
        });

        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }

        // Check if user is deleted
        if (user.isDeleted) {
            return res.status(401).send({ message: 'Account is deactivated' });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).send({ message: 'Invalid credentials' });
        }

        const token = await generateToken(user.id); // Generate token with user ID
        
        res.cookie('token', token, { 
            httpOnly: false,
            secure: false, // Ensure this is true for HTTPS
            sameSite: 'None'
        });

        // Return user data without password
        const { password: _, ...userWithoutPassword } = user;
        
        res.status(200).send({ 
            message: 'Logged in successfully', 
            token, 
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                role: user.userroles.roleName,
                roleId: user.roleId
            }
        });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).send({ message: 'Login failed' });
    }
});

// Logout endpoint
router.post('/logout', (req, res) => {
    res.clearCookie('token'); 
    res.status(200).send({ message: 'Logged out successfully' });
});

// Get all users
router.get('/users', async (req, res) => {
    try {
        const users = await prisma.users.findMany({
            where: {
                isDeleted: false
            },
            select: {
                id: true,
                email: true,
                username: true,
                roleId: true,
                userroles: {
                    select: {
                        roleName: true
                    }
                },
                createdAt: true,
                updatedAt: true
            }
        });

        // Map users to include role as string
        const formattedUsers = users.map(user => ({
            id: user.id,
            email: user.email,
            username: user.username,
            roleId: user.roleId,
            role: user.userroles?.roleName || 'user',
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        }));

        res.status(200).send(formattedUsers);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send({ message: 'Failed to fetch users' });
    }
});

// Soft delete a user
router.delete('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const userId = parseInt(id);

        const user = await prisma.users.findUnique({
            where: { id: userId }
        });

        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }

        if (user.isDeleted) {
            return res.status(400).send({ message: 'User is already deleted' });
        }

        // Soft delete the user
        await prisma.users.update({
            where: { id: userId },
            data: {
                isDeleted: true,
                deletedAt: new Date()
            }
        });

        res.status(200).send({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).send({ message: 'Failed to delete user' });
    }
});

// Update user role and username
router.put('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { roleId, username } = req.body;
        const userId = parseInt(id);

        // Validate at least one field to update
        if (!roleId && !username) {
            return res.status(400).send({ message: 'No fields to update' });
        }

        // Validate roleId if provided
        if (roleId) {
            if (isNaN(parseInt(roleId))) {
                return res.status(400).send({ message: 'Invalid role ID' });
            }

            // Check if role exists
            const role = await prisma.userroles.findUnique({
                where: { id: parseInt(roleId) }
            });

            if (!role) {
                return res.status(400).send({ message: 'Role not found' });
            }
        }

        // Check if user exists
        const existingUser = await prisma.users.findUnique({
            where: { id: userId }
        });

        if (!existingUser) {
            return res.status(404).send({ message: 'User not found' });
        }

        if (existingUser.isDeleted) {
            return res.status(400).send({ message: 'Cannot update deleted user' });
        }

        // Check if username is already taken (if username is being updated)
        if (username && username !== existingUser.username) {
            const usernameExists = await prisma.users.findFirst({
                where: {
                    username: username,
                    id: { not: userId },
                    isDeleted: false
                }
            });

            if (usernameExists) {
                return res.status(400).send({ message: 'Username already taken' });
            }
        }

        // Prepare update data
        const updateData = {
            updatedAt: new Date()
        };

        if (roleId) {
            updateData.roleId = parseInt(roleId);
        }

        if (username) {
            updateData.username = username.trim();
        }

        // Update user
        const user = await prisma.users.update({
            where: { id: userId },
            data: updateData,
            include: {
                userroles: true
            }
        });

        res.status(200).send({ 
            message: 'User role updated successfully', 
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                roleId: user.roleId,
                role: user.userroles.roleName
            }
        });
    } catch (error) {
        console.error('Error updating user role:', error);
        res.status(500).send({ message: 'Failed to update user role' });
    }
});

// Get user by ID
router.get('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const userId = parseInt(id);

        const user = await prisma.users.findUnique({
            where: { id: userId },
            include: {
                userroles: true,
                students_students_updatedByTousers: true,
                teachers_teachers_teacherIdTousers: {
                    include: {
                        departments_teachers_departmentIdTodepartments: true,
                        genders: true
                    }
                },
                superadmin: {
                    include: {
                        genders: true
                    }
                }
            }
        });

        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }

        if (user.isDeleted) {
            return res.status(404).send({ message: 'User not found' });
        }

        // Remove password from response
        const { password, ...userWithoutPassword } = user;

        res.status(200).send(userWithoutPassword);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).send({ message: 'Failed to fetch user' });
    }
});

// Restore deleted user
router.patch('/users/:id/restore', async (req, res) => {
    try {
        const { id } = req.params;
        const userId = parseInt(id);

        const user = await prisma.users.findUnique({
            where: { id: userId }
        });

        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }

        if (!user.isDeleted) {
            return res.status(400).send({ message: 'User is not deleted' });
        }

        // Restore the user
        await prisma.users.update({
            where: { id: userId },
            data: {
                isDeleted: false,
                deletedAt: null // Set to null instead of default date
            }
        });

        res.status(200).send({ message: 'User restored successfully' });
    } catch (error) {
        console.error('Error restoring user:', error);
        res.status(500).send({ message: 'Failed to restore user' });
    }
});

module.exports = router;