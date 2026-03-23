const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const safeStringify = require('safe-stable-stringify');
const path = require('path');
const fs = require('fs');

// สร้าง logs directory ถ้ายังไม่มี
const logDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
}

// Level จาก env — dev = debug, prod = info
const logLevel = process.env.NODE_ENV === 'production' ? 'info' : 'debug';

// Safe JSON format — ป้องกัน crash จาก circular object
const safeJsonFormat = winston.format((info) => {
    try {
        // stringify แล้ว parse กลับเพื่อให้ winston จัดการต่อได้ปกติ
        const safe = JSON.parse(safeStringify(info));
        return Object.assign(info, safe);
    } catch {
        return info;
    }
})();

// Base format สำหรับไฟล์ (JSON)
const fileFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    safeJsonFormat,
    winston.format.json()
);

// Console format — มี timestamp + color
const consoleFormat = winston.format.combine(
    winston.format.timestamp({ format: 'HH:mm:ss' }),  // 1. เพิ่ม timestamp
    winston.format.colorize(),
    winston.format.printf(({ timestamp, level, message, ...meta }) => {
        const metaStr = Object.keys(meta).length
            ? ' ' + (safeStringify(meta) ?? '')
            : '';
        return `${timestamp} [${level}]: ${message}${metaStr}`;
    })
);

// Log rotation — แยกไฟล์รายวัน เก็บ 14 วัน ไฟล์ละไม่เกิน 20MB
const rotateOptions = {
    dirname: logDir,
    datePattern: 'YYYY-MM-DD',
    maxSize: '20m',
    maxFiles: '14d',
    zippedArchive: true,
};

const logger = winston.createLogger({
    level: logLevel,
    format: fileFormat,
    transports: [
        // error.log — เก็บเฉพาะ error level (rotate)
        new DailyRotateFile({
            ...rotateOptions,
            filename: 'error-%DATE%.log',
            level: 'error',
        }),
        // combined.log — เก็บทุก level (rotate)
        new DailyRotateFile({
            ...rotateOptions,
            filename: 'combined-%DATE%.log',
        }),
    ],
    // 3. บันทึก uncaughtException / unhandledRejection อัตโนมัติ
    exceptionHandlers: [
        new DailyRotateFile({
            ...rotateOptions,
            filename: 'exceptions-%DATE%.log',
        }),
    ],
    rejectionHandlers: [
        new DailyRotateFile({
            ...rotateOptions,
            filename: 'rejections-%DATE%.log',
        }),
    ],
    exitOnError: false, // ไม่ให้ process crash เมื่อ log exception
});

// แสดงใน console ด้วยตอน development
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({ format: consoleFormat }));
    // 3. console รับรู้ exception/rejection ด้วย (dev เท่านั้น)
    logger.exceptions.handle(new winston.transports.Console({ format: consoleFormat }));
    logger.rejections.handle(new winston.transports.Console({ format: consoleFormat }));
}

module.exports = logger;
