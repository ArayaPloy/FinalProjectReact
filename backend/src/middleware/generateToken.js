const jwt = require('jsonwebtoken');
// const User = require('../model/user.model');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET_KEY;

// Example function to generate JWT token
const generateToken = async (userId) => {
    try {
        // const user = await User.findById(userId); // Fetch user details
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { role: true }
        });

        if (!user) {
            throw new Error('User not found');
        }
        // console.log(user)
        const token = jwt.sign({ userId: user.id, role: user.role.roleName  }, JWT_SECRET, { expiresIn: '24h' });
        return token;
    } catch (error) {
        console.error('Error generating token:', error);
        throw error;
    }
};

module.exports = generateToken;
