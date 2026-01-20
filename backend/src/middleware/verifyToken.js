const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET_KEY;

const verifyToken = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: 'Token not found' });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        if (!decoded.userId) {
            return res.status(401).json({ message: 'User ID not found in token' });
        }

        // Verify user exists and is not deleted
        const user = await prisma.users.findUnique({
            where: { 
                id: decoded.userId
            }
        });

        if (!user || user.isDeleted) {
            return res.status(401).json({ message: 'User not found or deleted' });
        }

        req.userId = decoded.userId;
        req.user = {
            id: decoded.userId,
            email: decoded.email,
            username: decoded.username,
            role: decoded.role,
            roleId: decoded.roleId
        };
        
        next();
    } catch (error) {
        console.error('Error verifying token:', error);
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired' });
        }
        res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports = verifyToken;
