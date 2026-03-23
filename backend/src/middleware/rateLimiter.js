const rateLimit = require('express-rate-limit');
const logger = require('./logger');

// Rate limiter เฉพาะ Login endpoint
// นับเฉพาะ request ที่ล้มเหลว (status >= 400) skipSuccessfulRequests: true
const loginRateLimiter = rateLimit({
    windowMs: 30 * 60 * 1000, // หน้าต่างเวลา 30 นาที
    max: 5,                    // สูงสุด 5 ครั้งที่ล้มเหลวต่อ 30 นาที
    skipSuccessfulRequests: true, // Login สำเร็จไม่นับ
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    // handler จะถูกเรียกเมื่อ limit ครบแล้ว (ครั้งที่ 6+)
    handler: (req, res) => {
        const resetTime = req.rateLimit.resetTime;
        const minutesLeft = Math.ceil((resetTime - Date.now()) / 60000);
        const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip;

        logger.warn('LOGIN_RATE_LIMITED', {
            event: 'LOGIN_RATE_LIMITED',
            ip,
            email: req.body?.email || 'unknown',
            retryAfterMinutes: minutesLeft
        });

        res.status(429).json({
            message: `เข้าสู่ระบบล้มเหลวเกินกำหนด กรุณารอ ${minutesLeft} นาทีแล้วลองใหม่`,
            rateLimited: true,
            retryAfter: minutesLeft
        });
    }
});

module.exports = { loginRateLimiter };
