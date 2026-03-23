# 🔐 Security Documentation

เอกสารนี้อธิบายมาตรการความปลอดภัยที่ระบบใช้งานอยู่จริง (Implemented) พร้อมรายการที่แนะนำให้เพิ่มเติม และ Checklist สำหรับ Production

---

## ✅ มาตรการที่ใช้งานอยู่จริง

### Authentication — `backend/src/routes/auth.user.js` + `backend/src/middleware/`

**JWT Token เก็บใน HttpOnly Cookie (ไม่ใช่ localStorage)**

Token ถูกออกแบบให้เก็บใน Cookie ที่ Browser ดูแล ซึ่งปลอดภัยกว่า localStorage มาก

```javascript
// auth.user.js — ตั้งค่า Cookie ตอน Login
res.cookie('token', token, {
  httpOnly: true,  // JavaScript ฝั่ง Client อ่านค่าไม่ได้ — ป้องกัน XSS
  secure: process.env.NODE_ENV === 'production', // ส่งผ่าน HTTPS เท่านั้นใน Production
  sameSite: 'Lax',  // ป้องกัน CSRF — ส่ง Cookie เฉพาะ same-site requests
  maxAge: cookieMaxAge // 2h (ปกติ) / 7d (Remember Me) — sync กับ tokenExpiry
});
```

**การตรวจสอบ Token — `verifyToken.js`**

Middleware นี้ใช้กับทุก route ที่ต้องการ Authentication:

```javascript
// verifyToken.js
const token = req.cookies.token; // อ่านจาก Cookie เท่านั้น (ไม่รับจาก Header)
const decoded = jwt.verify(token, JWT_SECRET); // ตรวจ signature + expiration

// ตรวจสอบเพิ่มเติมว่า User ยังมีอยู่และไม่ถูกลบ
// (Token ยัง valid แต่ account ถูกปิดใน DB)
const user = await prisma.users.findUnique({ where: { id: decoded.userId } });
if (!user || user.isDeleted) return res.status(401).json({ message: 'User not found or deleted' });

// จัดการ TokenExpiredError
if (error.name === 'TokenExpiredError') {
    return res.status(401).json({ message: 'Session หมดอายุ กรุณาเข้าสู่ระบบใหม่', sessionExpired: true });
}
```

**JWT Expiration — `generateToken.js`**

Token มีอายุสั้นเพื่อจำกัดช่วงเวลาที่ Attacker ใช้ Token ที่ขโมยไปได้:

```javascript
// generateToken.js
const token = jwt.sign(payload, JWT_SECRET, { 
    expiresIn: expiry  // '2h' (ปกติ) หรือ '7d' (Remember Me)
});

// auth.user.js — Token + Cookie ต้อง sync กันเสมอ
const tokenExpiry  = rememberMe ? '7d' : '2h';
const cookieMaxAge = rememberMe ? 7 * 24 * 60 * 60 * 1000 : 2 * 60 * 60 * 1000;
const token = await generateToken(user.id, tokenExpiry);
res.cookie('token', token, { ..., maxAge: cookieMaxAge });
```

> **ทำไมต้อง sync:** Token หมดแต่ cookie ยังอยู่ = Frontend ส่ง request โดยไม่รู้ว่า token ใช้ไม่ได้แล้ว | Cookie หมดก่อน token = user หลุด session โดยไม่สมเหตุ

**ข้อจำกัด: Token ยัง valid หลัง Logout**

```javascript
// ปัจจุบัน: logout แค่ลบ cookie — Token String ยังถือว่า valid จนหมดอายุ
router.post('/logout', (req, res) => {
    res.clearCookie('token');  // ลบ Cookie ออก — แต่ Token String ยังใช้ได้อยู่
    res.status(200).send({ message: 'Logged out successfully' });
});
```

**การลดความเสี่ยงที่มีอยู่แล้ว:**

| มาตรการ | ผล |
|---|---|
| **Token Expiration** | Token หมดอายุใน **2 ชั่วโมง** (ปกติ) หรือ **7 วัน** (Remember Me) — จำกัดช่วงเวลาที่ Attacker จะใช้ Token ที่ขโมยไปได้ |
| **HttpOnly Cookie** | Token ไม่สามารถอ่านได้ผ่าน `document.cookie` หรือ JavaScript — ป้องกัน XSS attack ที่พยายามขโมย Token |
| **verifyToken — isDeleted check** | ถ้า Admin ปิด/ลบ account ใน DB ทันที Token นั้นจะ invalid แม้ยังไม่หมดอายุ |

**ข้อจำกัดที่ยังมีอยู่:**
- ยังไม่มี Token Blacklist หรือ Refresh Token
- Token ที่ขโมยไปผ่านช่องทางอื่น (เช่น network sniffing บน HTTP, device compromise) จะยังใช้ได้จนหมดอายุ
- ไม่สามารถ revoke Token ของ User ที่ยังอยู่ใน session ได้ทันที นอกจากลบ account

**วิธีแก้ (แนะนำ):** เพิ่ม Token Blacklist ด้วย Redis — ดูหัวข้อ คำแนะนำให้เพิ่มเติม

**การแยกสิทธิ์ — `admin.js`**

```javascript
// admin.js — ตรวจสอบ role ก่อนเข้า Admin routes
const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
    return res.status(403).json({ message: 'คุณไม่ได้รับอนุญาตให้ดำเนินการนี้' });
  }
  next();
};
```

> **สรุป Flow การ Auth:** Login → JWT ใน HttpOnly Cookie → Request → `verifyToken` อ่าน Cookie → ตรวจสอบกับ DB → อนุญาต/ปฏิเสธ

---

### Rate Limiting — `backend/src/middleware/rateLimiter.js`

**จำกัด Login ล้มเหลวสูงสุด 5 ครั้งต่อ 30 นาที ต่อ 1 IP**

```javascript
// rateLimiter.js
const loginRateLimiter = rateLimit({
  windowMs: 30 * 60 * 1000,    // หน้าต่างเวลา 30 นาที
  max: 5,                       // สูงสุด 5 ครั้ง
  skipSuccessfulRequests: true, // Login สำเร็จ ไม่นับ — นับเฉพาะครั้งที่ล้มเหลว
  handler: (req, res) => {
    res.status(429).json({
      message: `เข้าสู่ระบบล้มเหลวเกินกำหนด กรุณารอ ${minutesLeft} นาที`,
      rateLimited: true,
      retryAfter: minutesLeft  // ส่งเวลาที่เหลือกลับด้วย
    });
  }
});
```

- เมื่อกรอกรหัสผ่านผิดแต่ยังไม่ครบลิมิต → Frontend แสดง SweetAlert "เหลืออีก X ครั้ง"
- เมื่อครบ 5 ครั้ง → Backend ตอบ 429 → Frontend แสดง SweetAlert "บัญชีถูกล็อค X นาที"
- ใช้งานผ่าน `req.rateLimit.remaining` ที่ express-rate-limit inject ไว้ใน request

---

### Security Logging — `backend/src/middleware/logger.js` + Winston

**Events ที่บันทึก:**

| Event | Level | จุดที่เกิด |
|---|---|---|
| `LOGIN_SUCCESS` | info | login สำเร็จ |
| `LOGIN_FAILED` | warn | email/password ผิด, account ถูกลบ |
| `LOGIN_RATE_LIMITED` | warn | ครบ 5 ครั้ง/30 นาที |
| `LOGIN_ERROR` | error | exception ใน login handler |
| `USER_REGISTERED` | info | สมัครสมาชิกสำเร็จ |
| `REGISTER_ERROR` | error | exception ใน register handler |
| `PASSWORD_RESET_REQUESTED` | info | ผู้ใช้ส่งคำขอรีเซ็ตรหัสผ่านใหม่ |
| `PASSWORD_RESET_DUPLICATE` | warn | มีคำขอ pending อยู่แล้ว |
| `PASSWORD_CHANGED` | info | เปลี่ยนรหัสผ่านสำเร็จ (หลัง approve) |
| `USER_DELETED` | info | Admin soft delete user |
| `USER_ROLE_UPDATED` | info | Admin เปลี่ยน role หรือ username |
| `FORGOT_PASSWORD_ERROR` | error | exception ใน forgot-password handler |
| `CHANGE_PASSWORD_ERROR` | error | exception ใน change-password handler |
| `APPROVE_RESET_ERROR` | error | exception ใน approve handler |
| `AUDIT_LOG_WRITE_ERROR` | error | เขียน audit_logs ล้มเหลว |

```javascript
// ตัวอย่าง structured log ที่ได้จริง
logger.info('LOGIN_SUCCESS',  { event, userId, email, role, ip });
logger.warn('LOGIN_FAILED',   { event, email, reason, ip, remainingAttempts });
logger.warn('LOGIN_RATE_LIMITED', { event, ip, email, retryAfterMinutes });
logger.info('USER_REGISTERED', { event, userId, email, username, ip });
logger.info('PASSWORD_CHANGED', { event, userId, ip });
logger.info('USER_DELETED',   { event, adminId, targetUserId, targetEmail, ip });
logger.info('USER_ROLE_UPDATED', { event, adminId, targetUserId, oldRoleId, newRoleId, ip });
logger.error('LOGIN_ERROR',   { event, error: error.message, stack: error.stack });
// ❌ ห้าม log password หรือ hashedPassword ในทุกกรณี
```

**ไฟล์ Log ที่สร้าง (ระบบ log rotation — แยกไฟล์รายวัน):**
| ไฟล์ | เนื้อหา | เก็บ |
|---|---|---|
| `backend/logs/combined-YYYY-MM-DD.log` | ทุก event (info + warn + error) | 14 วัน |
| `backend/logs/error-YYYY-MM-DD.log` | เฉพาะ error level | 14 วัน |
| `backend/logs/exceptions-YYYY-MM-DD.log` | `uncaughtException` | 14 วัน |
| `backend/logs/rejections-YYYY-MM-DD.log` | `unhandledRejection` | 14 วัน |

เงื่อนไข logger:
- **Log rotation**: ไฟล์ไม่เกิน 20MB ต่อไฟล์, zip archive อัตโนมัติ ป้องกัน disk เต็ม
- **Exception/Rejection handlers**: crash log ไม่หาย, `exitOnError: false`
- **Log level**: `dev` → `debug`, `prod` → `info` (ผ่าน `NODE_ENV`)
- **Safe stringify**: `safe-stable-stringify` ป้องกัน circular object crash
- **Console timestamp**: แสดง `HH:mm:ss` ไว้หน้า log level เพื่อง่าย debug

นอกจากนี้ยังมีบันทึกใน Database ผ่าน **`audit_logs` table** (Prisma) โดยใช้ helper function `createAuditLog()` ที่รวม logic การเขียนและจัดการ error ไว้ในที่เดียว:

```javascript
// auth.user.js — createAuditLog helper (fire-and-forget)
// ❌ ห้ามส่ง password หรือ hashedPassword เข้า oldValues/newValues เด็ดขาด
await createAuditLog({
    actorId: req.user.id,       // ผู้กระทำ (null = สมัครสมาชิกเอง)
    tableName: 'users',
    recordId: userId,
    action: 'UPDATE',           // CREATE | UPDATE | DELETE
    oldValues: { username: 'old' },
    newValues: { username: 'new' },
    req                         // ใช้ดึง ipAddress + userAgent อัตโนมัติ
});
```

**endpoint ที่บันทึก audit_logs:**
| Endpoint | Action | บันทึกเมื่อ |
|---|---|---|
| `POST /register` | CREATE | สมัครสมาชิกสำเร็จ |
| `POST /…/approve` | UPDATE | Admin อนุมัติรีเซ็ตรหัสผ่าน |
| `POST /…/reject` | UPDATE | Admin ปฏิเสธคำขอ |
| `POST /change-password` | UPDATE | เปลี่ยนรหัสผ่านสำเร็จ |
| `DELETE /users/:id` | DELETE | Admin soft delete user |
| `PUT /users/:id` | UPDATE | Admin แก้ไข role/username |
| `PATCH /users/:id/restore` | UPDATE | Admin คืนสถานะ user |

---

### Password Security — `bcrypt` (saltRounds: 10)

รหัสผ่านถูก Hash ด้วย bcrypt ก่อนบันทึกลงฐานข้อมูลเสมอ โดยใช้ salt rounds 10 (แต่ละ round เพิ่มเวลา Hash เป็น 2 เท่า ทำให้ Brute Force ยากขึ้น)

```javascript
// auth.user.js — Register
const saltRounds = 10;
const hashedPassword = await bcrypt.hash(password, saltRounds);

// auth.user.js — Login
const isMatch = await bcrypt.compare(password, user.password);
```

---

### Security Headers — Helmet + `backend/index.js`

ใช้ **Helmet** (แทน manual headers เดิม) เพิ่ม HTTP security headers อัตโนมัติ:

```javascript
// index.js
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }, // อนุญาต Frontend โหลดรูปจาก backend
  contentSecurityPolicy: false // ปิดไว้ก่อน — เปิดเมื่อ configure CSP directives แล้ว
}));
```

Headers ที่ Helmet เพิ่มให้อัตโนมัติ:

| Header | ป้องกัน |
|---|---|
| `X-Content-Type-Options: nosniff` | MIME-type sniffing |
| `X-Frame-Options: SAMEORIGIN` | Clickjacking |
| `Strict-Transport-Security` | Downgrade attack |
| `Referrer-Policy: no-referrer` | URL รั่วไหลไปยังเว็บภายนอก |
| `X-DNS-Prefetch-Control: off` | DNS prefetch |

---

### CORS — `backend/index.js`

CORS กำหนด Origin ที่อนุญาตให้เรียก API ได้อย่างเข้มงวด:

```javascript
// index.js — โค้ด CORS จริงทั้งหมด
const allowedOrigins = process.env.NODE_ENV === 'production'
  ? [process.env.FRONTEND_URL].filter(Boolean)
  : [
      'http://localhost:5173',
      'http://localhost:5174',
      /^http:\/\/192\.168\.\d+\.\d+:5173$/,  // Local network
      /^http:\/\/10\.\d+\.\d+\.\d+:5173$/
    ];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // Postman/mobile

    if (process.env.NODE_ENV === 'production') {
      // ✅ Production: strict — origin ที่ไม่ได้รับอนุญาต
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS')); // → Global Error Handler ตอบ 403
      }
    } else {
      // ⚠️ Development: อนุญาตทุก origin แต่ log warning
      const isAllowed = allowedOrigins.some(a =>
        typeof a === 'string' ? a === origin : a.test(origin)
      );
      if (!isAllowed) console.warn(`⚠️ CORS: ${origin} not in whitelist`);
      callback(null, true);
    }
  },
  credentials: true,   // อนุญาตให้ส่ง Cookie ข้าม Origin
  optionsSuccessStatus: 200
};
```

> **Production:** origin ที่ไม่ได้รับอนุญาต → Global Error Handler ส่งกลับ 403 ทันที `{ message: 'CORS policy: Origin not allowed' }`  
> **Development:** อนุญาตทุก origin แต่แสดง warning ใน console

---

### File Upload Security — `backend/src/routes/upload.route.js`

ไฟล์ที่อัปโหลดผ่านการตรวจสอบ 3 ชั้น:

**1. MIME Type Validation**
```javascript
const allowedTypes = /jpeg|jpg|png|gif|webp/;
const mimetype = allowedTypes.test(file.mimetype);    // ตรวจ MIME type จาก OS
const extname = allowedTypes.test(path.extname(...)); // ตรวจ extension
if (!mimetype || !extname) cb(new Error('Invalid file type'));
```

**2. ขนาดไฟล์สูงสุด (hardcoded ในโค้ด)**
| Route | ขนาดสูงสุด | จำนวนไฟล์สูงสุด |
|---|---|---|
| `upload.route.js` (รูปบทความ, ครู) | 5 MB | 1 ไฟล์ |
| `homevisits.route.js` (รูปเยี่ยมบ้าน) | 2 MB | 5 ไฟล์ |
| `profile.route.js` (รูปโปรไฟล์) | 2 MB | 1 ไฟล์ |

**3. Filename Sanitization**
```javascript
// ลบอักขระพิเศษออกจากชื่อไฟล์ ป้องกัน Path Traversal
let safeName = nameWithoutExt.replace(/[^a-zA-Z0-9\u0e00-\u0e7f]/g, '_');
// Extension จาก mimetype switch-case (ไม่ใช่จากชื่อไฟล์) ป้องกันการ Spoof extension
const finalFilename = safeName + '-' + Date.now() + '-' + random + ext;
```

**⚠️ ช่องโหว่ที่ยังมี: ไม่ตรวจ File Content จริง (Magic Bytes)**

ระบบตรวจ MIME type จาก **HTTP header** (`Content-Type`) ที่ Browser ส่งมา ซึ่ง Attacker อาจปลอมได้

```javascript
// ✅ สิ่งที่มี — ตรวจ MIME type header + extension
const mimetype = allowedTypes.test(file.mimetype);    // HTTP header
const extname  = allowedTypes.test(path.extname(...)); // ชื่อไฟล์

// ❌ สิ่งที่ยังไม่มี — อ่าน Magic Bytes จริง (4 bytes แรกของไฟล์)
// JPEG: FF D8 FF | PNG: 89 50 4E 47 | GIF: 47 49 46 38
// ต้องใช้ library เช่น file-type: const { fileTypeFromBuffer } = require('file-type');
```

**ความเสี่ยง:** ไฟล์ที่ส่งมาด้วย `Content-Type: image/jpeg` แต่จริง ๆ เป็น `.php` หรือ `.exe` จะผ่านการตรวจนี้ได้  
**ความเสี่ยงต่ำในระบบนี้** เพราะไฟล์ถูก serve เป็น static file ผ่าน Express ไม่ถูก execute — แต่ควรแก้ไขก่อน Production จริง

---

### Error Handling — แยก Production/Development

```javascript
// index.js — Global Error Handler
res.status(err.status || 500).json({
  message: process.env.NODE_ENV === 'production'
    ? 'Internal server error'       // Production: ซ่อน error detail
    : err.message,                  // Development: แสดง detail เพื่อ debug
  ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
});
```

---

### SQL Injection Prevention — Prisma ORM

ระบบใช้ Prisma ORM ทุก query ถูก parameterize โดยอัตโนมัติ ทำให้ไม่มีความเสี่ยง SQL Injection

```javascript
// ✅ ปลอดภัย — Prisma parameterize ค่าทั้งหมด
await prisma.users.findUnique({ where: { email: userInput } });

// ❌ รูปแบบที่ Prisma ไม่ใช้ — ห้าม concat user input
// `SELECT * FROM users WHERE email = '${userInput}'`
```

---

### Environment Variables

- ตัวแปรลับทั้งหมดอ่านจาก `process.env` เท่านั้น ไม่มี hardcode ในโค้ด
- `JWT_SECRET_KEY` ใช้ในไฟล์ `verifyToken.js` และ `generateToken.js`
- ไฟล์ `.env` อยู่ใน `.gitignore` ป้องกันการ commit ขึ้น Git

---

### Input Validation — ✅ Backend + Frontend

**Backend validation (auth.user.js — Register):**
```javascript
// ตรวจทุก field ก่อนสร้าง user
if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ message: 'รูปแบบ email ไม่ถูกต้อง' });
}
if (!password || password.length < 8) {
    return res.status(400).json({ message: 'รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร' });
}
if (!username || username.trim().length < 3 || username.trim().length > 12) {
    return res.status(400).json({ message: 'ชื่อผู้ใช้ต้องมี 3-12 ตัวอักษร' });
}
// ตรวจ duplicate email/username
const existingUser = await prisma.users.findFirst({ where: { OR: [{ email }, { username }] } });
if (existingUser) return res.status(400).send({ message: 'User already exists' });
// Prisma error P2002 (แบบสำรอง)
if (error.code === 'P2002') return res.status(400).send({ message: 'Email or username already exists' });
```

**Frontend (Register.jsx) — validation และ SweetAlert:**
- ตรวจ email regex, password `length < 8`, username `length 3-12` ก่อนส่ง API
- แสดง SweetAlert warning ทันทีเมื่อ validation ไม่ผ่าน
- `minLength`/`maxLength` attributes ตรงกับ Backend บน input fields
- Backend validation > Frontend — ป้องกัน bypass ผ่าน `curl`/Postman

---

### Prisma Soft Delete — ข้อระวังที่สำคัญ

ระบบใช้ **Soft Delete** (เปลี่ยน `isDeleted: true` ไม่ได้ลบแถวจริง) ทุก query ที่ list users ต้องเพิ่ม `where: { isDeleted: false }` เสมอ

```javascript
// ✅ verifyToken.js — ตรวจสอบในทุก request
if (!user || user.isDeleted) return res.status(401).json(...);

// ✅ generateToken.js — filter ตอนออก Token
prisma.users.findUnique({ where: { id: userId, isDeleted: false } });

// ⚠️ query ที่อาจลืมเพิ่ม filter เช่น: GET /api/auth/users —
// ถ้า query ไม่ใส่ where: { isDeleted: false } จะได้ users ที่ถูกสมมติลบกลับมาด้วย
```

**Pattern ที่ถูกต้อง:**
```javascript
// ปลอดภัย — อยู่ใน verifyToken.js และ generateToken.js
prisma.users.findUnique({ where: { id: userId, isDeleted: false } });

// อันตราย — list โดยไม่ filter
prisma.users.findMany();  // ❌ คืน deleted users ด้วย

// ถูกต้อง
prisma.users.findMany({ where: { isDeleted: false } });  // ✅
```

---

---

## ⚠️ สิ่งที่แนะนำให้เพิ่มเติม

### ความสำคัญสูง

**1. Helmet — ✅ ดำเนินการแล้ว** — ดูหัวข้อ Security Headers ด้านบน

**2. HTTPS + Secure Cookie Flags (Production)**

ระบบตั้ง `secure: process.env.NODE_ENV === 'production'` ไว้แล้ว — ต้องให้แน่ใจว่า Hosting Platform ใช้ HTTPS จริง ตรวจสอบโดยดูที่ URL ขึ้นต้นด้วย `https://`

---

### ความสำคัญปานกลาง

**3. Refresh Token Mechanism**

ปัจจุบัน Token อายุ **2 ชั่วโมง** (ปกติ) / **7 วัน** (Remember Me) ไม่มี Refresh Token — หาก Token ถูก Compromise จะต้องรอให้หมดอายุเองเท่านั้น

**4. Cloud Storage สำหรับไฟล์ Upload**

ปัจจุบันไฟล์เก็บใน `backend/uploads/` บน Server ตรง ๆ — เมื่อ Redeploy หรือ Server ล่ม ไฟล์จะหาย แนะนำใช้ AWS S3 หรือ Cloudinary

**5. Database Backups**

```bash
# Backup MySQL
mysqldump -u root -p eduweb_project > backup_$(date +%Y%m%d).sql

# Restore
mysql -u root -p eduweb_project < backup_20260323.sql
```

---

### ความสำคัญต่ำ (Good to Have)

**6. Backend Input Validation — ✅ ดำเนินการแล้ว** — ดูหัวข้อ Input Validation ด้านบน

**7. File Magic Bytes Validation** — เพิ่ม `npm install file-type` ตรวจ magic bytes จริงของไฟล์ ดูรายละเอียดในหัวข้อ Upload Security

**8. Security Scanning**
```bash
npm audit           # ตรวจ dependencies ที่มีช่องโหว่
npm audit fix       # แก้อัตโนมัติสำหรับ minor vulnerabilities
```

**9. Token Blacklist (Redis)**

เมื่อ Logout ปัจจุบัน Token ยังถือว่า valid จนหมดอายุ — แนะนำเก็บ Blacklist ใน Redis:

```javascript
// ตอน Logout — เพิ่ม Token เข้า Blacklist
const token = req.cookies.token;
const decoded = jwt.decode(token);
const ttl = decoded.exp - Math.floor(Date.now() / 1000); // เวลาที่เหลือจนหมดอายุ
await redis.setEx(`blacklist:${token}`, ttl, '1');
res.clearCookie('token');

// ใน verifyToken.js — ตรวจก่อนอนุญาต
const isBlacklisted = await redis.get(`blacklist:${token}`);
if (isBlacklisted) return res.status(401).json({ message: 'Token has been revoked' });
```

ข้อดี: revoke ได้ทันที, TTL ของ Redis key ตรงกับอายุ Token ที่เหลือ (ไม่สิ้นเปลืองพื้นที่)

---

---

## � CSRF: `sameSite: 'Lax'` vs `'Strict'` — ทำไมระบบนี้ใช้ Lax ก็เหมาะสมแล้ว?

### ความแตกต่างระหว่าง Lax กับ Strict

| พฤติกรรม | `sameSite: 'Lax'` | `sameSite: 'Strict'` |
|---|---|---|
| คลิก Link จากเว็บภายนอก → เข้าตรง | ✅ ส่ง Cookie | ❌ ไม่ส่ง Cookie |
| Form POST จากเว็บภายนอก (CSRF attack) | ❌ ไม่ส่ง Cookie | ❌ ไม่ส่ง Cookie |
| XHR/fetch จากเว็บภายนอก (cross-origin) | ❌ ไม่ส่ง Cookie | ❌ ไม่ส่ง Cookie |

### ทำไม `Lax` เหมาะสมสำหรับระบบนี้

ระบบ EduWeb เป็น **Single Page Application (SPA)** ที่:
1. **Frontend และ Backend อยู่คนละ domain** (e.g. `frontend.vercel.app` ≠ `backend.railway.app`) ทุก API call ใช้ `credentials: 'include'` และ `fetch()` — ทั้งหมดป้องกันสัก `Strict` อยู่แล้ว
2. **CORS ปิดกั้น** cross-origin requests ที่ไม่ใช่จาก `FRONTEND_URL` ที่อนุญาต ทำให้ CSRF ผ่านแค่ SameSite ไม่สำเร็จอยู่แล้ว
3. **`Lax` ช่วย**ให้ Login link จาก email หรือ QR code ยังทำงานได้ — `Strict` จะบล็อคกรณี เหล่านี้ ทำให้ UX แย่ลง

### เมื่อไหรถึงควรใช้ `Strict`?

ใช้ `Strict` เมื่อระบบ **same-domain** (Frontend และ Backend อยู่บน domain เดียวกัน เช่น `school.ac.th/api`) หรือเมื่อทนความเสียหายต่อ UX ได้

**สรุป:** `Lax` เหมาะสมสำหรับระบบ EduWeb เพราะ CORS และ architecture ของระบบป้องกัน CSRF อยู่แล้ว โดยไม่ต้องเปลี่ยน และยัง UX ดีกว่าด้วย

---

## �🚨 Production Checklist

### ก่อน Deploy

**Environment Variables:**
- [ ] ตั้งค่า `JWT_SECRET_KEY` เป็น random string ≥ 64 ตัวอักษร (ดูวิธีสร้างด้านล่าง)
- [ ] ตั้งค่า `NODE_ENV=production`
- [ ] ตั้งค่า `FRONTEND_URL` ให้ตรงกับ URL ของ Frontend จริง
- [ ] ตั้งค่า `DATABASE_URL` ชี้ไปที่ MySQL บน Cloud (ไม่ใช่ localhost)
- [ ] ตรวจสอบว่าไม่มีไฟล์ `.env` ใน Git history

**Database:**
- [ ] ใช้รหัสผ่าน MySQL ที่แข็งแรง (ไม่ใช่ root ไม่มีรหัส)
- [ ] รัน `npx prisma migrate deploy` หลัง deploy ครั้งแรก
- [ ] ทดสอบการ restore จาก backup

**Network & HTTPS:**
- [ ] Hosting Platform ใช้ HTTPS (ตรวจสอบ URL ขึ้นต้น `https://`)
- [ ] CORS อนุญาตเฉพาะ domain จริงเท่านั้น (ไม่ใช่ `*`)
- [ ] ปิดการแสดง error stack trace ใน production (ระบบทำอยู่แล้วผ่าน `NODE_ENV`)

**Code Review:**
- [ ] รัน `npm audit` ตรวจสอบ dependencies ที่มีช่องโหว่
- [ ] ไม่มี hardcoded credentials ในโค้ด

---

---

## 📝 Environment Variables Security

### ❌ ผิด — hardcode secrets ในโค้ด
```javascript
const JWT_SECRET = "my-hardcoded-secret"; // ❌ ถ้า commit ขึ้น Git ทุกคนเห็น
const API_URL = "http://localhost:5000";   // ❌ ใช้ไม่ได้ใน Production
```

### ✅ ถูก — อ่านจาก Environment Variables เสมอ
```javascript
// Backend (Node.js)
const JWT_SECRET = process.env.JWT_SECRET_KEY; // ⚠️ ต้องเป็น JWT_SECRET_KEY

// Frontend (Vite)
const API_URL = import.meta.env.VITE_API_BASE_URL; // ⚠️ ต้องขึ้นต้นด้วย VITE_
```

---

---

## 🔒 Password & Secret Key Security

### สร้าง JWT Secret Key ที่ปลอดภัย

```bash
# วิธีที่ 1 — OpenSSL (Linux/macOS)
openssl rand -base64 64

# วิธีที่ 2 — Node.js (ทุก OS)
node -e "console.log(require('crypto').randomBytes(64).toString('base64'))"

# วิธีที่ 3 — PowerShell (Windows)
[Convert]::ToBase64String((1..64 | ForEach-Object { Get-Random -Maximum 256 }))
```

นำค่าที่ได้ไปใส่ใน `backend/.env`:
```env
JWT_SECRET_KEY=<ค่าที่สร้างได้จากคำสั่งด้านบน>
```

### สร้าง MySQL User สำหรับ Production (แทน root)
```sql
-- สร้าง user ที่มีสิทธิ์เฉพาะ database นี้เท่านั้น
CREATE USER 'eduweb_user'@'localhost' IDENTIFIED BY 'StrongP@ssw0rd!';
GRANT ALL PRIVILEGES ON eduweb_project.* TO 'eduweb_user'@'localhost';
FLUSH PRIVILEGES;
```

แล้วอัปเดต `DATABASE_URL` ใน `.env`:
```env
DATABASE_URL=mysql://eduweb_user:StrongP@ssw0rd!@localhost:3306/eduweb_project
```

---

---

## 🛡️ สรุปมาตรการตาม OWASP Top 10

| ช่องโหว่ | สถานะ | วิธีที่ระบบจัดการ |
|---|---|---|
| Broken Access Control | ✅ จัดการแล้ว | `verifyToken.js` + `isAdmin.js` middleware ตรวจทุก request |
| Cryptographic Failures | ✅ จัดการแล้ว | bcrypt hash รหัสผ่าน, JWT + expiration ใน HttpOnly Cookie, HTTPS ใน Production |
| Injection (SQL) | ✅ จัดการแล้ว | Prisma ORM parameterize ทุก query อัตโนมัติ |
| Injection (XSS) | ✅ จัดการแล้ว | HttpOnly Cookie ป้องกัน Token theft, `X-XSS-Protection` header |
| Insecure Design | ✅ จัดการแล้ว | Role-based access (teacher/admin/super_admin), ความต้องการสิทธิ์ชัดเจน |
| Security Misconfiguration | ✅ จัดการแล้ว | Helmet (HSTS, Referrer-Policy ฯลฯ), CORS whitelist + full origin callback, Error ซ่อน detail ใน Production |
| CSRF | ✅ เพียงพอสำหรับระบบนี้ | `sameSite: 'Lax'` + CORS whitelist ป้องกัน CSRF ชั้นหนึ่ง — ดูคำอธิบายด้านล่าง |
| File Upload | ✅/⚠️ จัดการบางส่วน | MIME header + extension + filename sanitization ✅ — Magic bytes ❌ ยังไม่มี |
| Rate Limiting | ✅ จัดการแล้ว | `loginRateLimiter`: 5 ครั้งต่อ 30 นาที (นับเฉพาะครั้งที่ล้มเหลว) + SweetAlert แจ้งเตือน |
| Security Logging | ✅ จัดการแล้ว | Winston: Login/Delete/RoleChange + DB: `audit_logs` table |
| Input Validation | ✅ จัดการแล้ว | Backend: email regex + password min 8 + username 3-12 chars + Frontend: SweetAlert + minLength/maxLength |
| Token Revocation | ⚠️ ช่องโหว่บางส่วน | Expiration 2h/7d + HttpOnly ลด risk — ยังไม่มี Blacklist/Refresh Token |
| Soft Delete Safety | ✅ส่วนใหญ่ | verifyToken + generateToken filter `isDeleted: false` — ต้องมั่นใจ list queries ทั่วระบบ |
| Dependency Vulnerabilities | ⚠️ ต้องตรวจเป็นประจำ | รัน `npm audit` เป็นประจำ (last run: 2026-03-23, 7 vulns เหลือ ต้อง --force ถึงจะ fix ได้) |

---

---

## 🔄 การบำรุงรักษาเป็นประจำ

### ทุกครั้งที่ Deploy
```bash
npm audit              # ตรวจ vulnerabilities ใน dependencies
npm audit fix          # แก้ที่แก้ได้อัตโนมัติ
```

### รายเดือน
- อัปเดต dependencies: `npm update`
- ตรวจสอบ MySQL slow query log
- Backup และทดสอบ restore ฐานข้อมูล

### กรณีฉุกเฉิน — JWT Secret ถูก Compromise

หาก `JWT_SECRET_KEY` รั่วไหล ให้ดำเนินการทันที:

1. สร้าง Secret ใหม่ทันที
2. อัปเดตใน Hosting Platform
3. Redeploy Backend
4. **ผล:** Token ทั้งหมดที่ออกด้วย Secret เก่าจะใช้ไม่ได้ทันที — ผู้ใช้ทุกคนต้อง Login ใหม่

```bash
# สร้าง Secret ใหม่
node -e "console.log(require('crypto').randomBytes(64).toString('base64'))"
```
