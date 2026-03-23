# 🚀 การ Deploy สู่ Production

เอกสารนี้อธิบายขั้นตอนการนำระบบขึ้น Production ครอบคลุม Environment Variables, ขั้นตอน Deploy Frontend และ Backend, Checklist, และการแก้ปัญหาที่พบบ่อย

---

## 📋 Environment Variables

### Frontend — `frontend/.env`

ในโหมด Production ให้ตั้งค่า `VITE_API_BASE_URL` ให้ชี้ไปที่ Backend จริง (ไม่ใช่ localhost)

> **สำคัญ:** ตัวแปรของ Vite ต้องขึ้นต้นด้วย `VITE_` เสมอ มิฉะนั้น Browser จะไม่เห็นค่า

```env
# Production API URL — ต้องรวม /api ด้วยเสมอ
VITE_API_BASE_URL=https://your-backend-domain.com/api
```

**ตัวอย่างตาม Hosting Platform:**
```env
# Railway
VITE_API_BASE_URL=https://your-app.railway.app/api

# Render
VITE_API_BASE_URL=https://your-app.onrender.com/api

# Custom Domain
VITE_API_BASE_URL=https://api.eduweb.com/api
```

---

### Backend — `backend/.env`

> **⚠️ ชื่อตัวแปรต้องตรงเป๊ะ** — โค้ดใน `verifyToken.js` และ `generateToken.js` อ่าน `JWT_SECRET_KEY` (ไม่ใช่ `JWT_SECRET`) และระบบใช้ MySQL ผ่าน Prisma (ไม่ใช่ MongoDB)

```env
# ============ Server ============
PORT=5000
NODE_ENV=production

# ============ Database (MySQL + Prisma) ============
# Connection String สำหรับ MySQL บน Cloud (เช่น PlanetScale, Railway MySQL, AWS RDS)
DATABASE_URL=mysql://username:password@your-db-host:3306/eduweb_project

# ============ Authentication ============
# ⚠️ ต้องใช้ชื่อ JWT_SECRET_KEY เท่านั้น
JWT_SECRET_KEY=your-super-secret-random-string-at-least-32-chars
JWT_EXPIRES_IN=7d

# ============ CORS ============
# URL ของ Frontend จริง — Backend อ่านค่านี้ใน index.js เพื่อกำหนด allowed origin
FRONTEND_URL=https://your-frontend-domain.com
```

**ตารางสรุป Environment Variables ที่จำเป็น:**

| ตัวแปร | คำอธิบาย | ตัวอย่างค่า Production |
|---|---|---|
| `PORT` | พอร์ต Backend (Hosting Platform กำหนดให้โดยอัตโนมัติ) | `5000` |
| `NODE_ENV` | โหมดการทำงาน | `production` |
| `DATABASE_URL` | MySQL Connection String | `mysql://user:pass@host:3306/dbname` |
| `JWT_SECRET_KEY` | กุญแจลับสำหรับ Sign JWT Token | Random string ≥ 32 ตัวอักษร |
| `JWT_EXPIRES_IN` | อายุ Token | `7d` |
| `FRONTEND_URL` | URL ของ Frontend สำหรับ CORS | `https://your-frontend.com` |

---

## 🔧 ขั้นตอนการ Deploy

### 1. เตรียม Code ก่อน Deploy

```bash
# 1. Pull code ล่าสุดจาก GitHub
git pull origin main

# 2. ตรวจสอบว่า .env ไม่อยู่ใน Git
git status   # ต้องไม่เห็น .env ในรายการ
```

---

### 2. Deploy Frontend

Frontend เป็น Static Site สามารถ deploy บน Vercel, Netlify, หรือ Railway ได้

#### Railway (แนะนำ — ง่ายและฟรี):
1. เข้า [railway.app](https://railway.app) → New Project → Deploy from GitHub
2. เลือก Repository และกำหนด Root Directory เป็น `frontend`
3. เพิ่ม Environment Variable ใน Dashboard:
   - `VITE_API_BASE_URL` = `https://your-backend.railway.app/api`
4. Railway จะรัน `npm run build` และ deploy อัตโนมัติ

#### Vercel:
```bash
cd frontend
npm run build       # ทดสอบ build ก่อนขึ้น production
vercel --prod
```

**Environment Variables ใน Vercel Dashboard:**
- `VITE_API_BASE_URL` = `https://your-backend-url.com/api`

> **หมายเหตุ:** หลังตั้งค่า Environment Variable บน Platform แล้ว ต้อง Redeploy ใหม่เพื่อให้ค่ามีผล

---

### 3. Deploy Backend

Backend ต้องการ Node.js Runtime และการเชื่อมต่อ MySQL — แนะนำใช้ Railway เพราะรองรับทั้ง Node.js และ MySQL ในที่เดียว

#### Railway (แนะนำ):
1. เข้า [railway.app](https://railway.app) → New Project → Deploy from GitHub
2. เลือก Repository และกำหนด Root Directory เป็น `backend`
3. เพิ่ม MySQL Service ใน Project เดียวกัน (Railway จะสร้าง `DATABASE_URL` ให้อัตโนมัติ)
4. เพิ่ม Environment Variables ที่เหลือใน Dashboard:

   | ตัวแปร | ค่า |
   |---|---|
   | `NODE_ENV` | `production` |
   | `JWT_SECRET_KEY` | (random string ≥ 32 ตัวอักษร) |
   | `JWT_EXPIRES_IN` | `7d` |
   | `FRONTEND_URL` | URL ของ Frontend ที่ deploy แล้ว |

5. รัน Prisma Migration หลัง deploy ครั้งแรก (ดูข้อ 4)

#### Render:
1. New Web Service → เชื่อม GitHub Repository
2. กำหนด Root Directory: `backend`
3. Build Command: `npm install && npx prisma generate`
4. Start Command: `npm start`
5. เพิ่ม Environment Variables เหมือนด้านบน

---

### 4. รัน Prisma Migration (สำคัญมาก)

ระบบใช้ Prisma ORM จัดการโครงสร้างฐานข้อมูล ต้องรัน Migration หลัง deploy Backend ครั้งแรก หรือเมื่อมีการเปลี่ยน Schema

```bash
# เข้าไปที่ folder backend
cd backend

# สร้างตารางทั้งหมดตาม schema.prisma (ใช้ตอน deploy ครั้งแรก)
npx prisma migrate deploy

# หรือถ้าต้องการ reset และเพิ่มข้อมูลตัวอย่างใหม่ (⚠️ ลบข้อมูลเก่าทั้งหมด)
npx prisma migrate reset

# สร้าง Prisma Client ให้ตรงกับ schema ปัจจุบัน (ต้องรันทุกครั้งที่ schema เปลี่ยน)
npx prisma generate
```

> **ความแตกต่างระหว่างคำสั่ง:**
> - `migrate deploy` — ใช้ใน Production: รัน migrations ที่ยังไม่ได้รัน ไม่ลบข้อมูล
> - `migrate reset` — ใช้ใน Development: ลบข้อมูลทั้งหมดแล้วสร้างใหม่
> - `migrate dev` — ใช้ใน Development: สร้าง migration ใหม่เมื่อแก้ schema

---

## ✅ Checklist ก่อน Deploy

### Frontend:
- [ ] ตั้งค่า `VITE_API_BASE_URL` บน Hosting Platform Dashboard (ไม่ใช่แค่ในไฟล์ `.env` local)
- [ ] ตรวจสอบว่าไม่มี hardcoded URLs (`localhost:5000`) ในโค้ด
- [ ] ทดสอบ build locally ก่อน: `npm run build && npm run preview`
- [ ] ตรวจสอบว่าไฟล์ `.env` อยู่ใน `.gitignore` แล้ว

### Backend:
- [ ] ตั้งค่า Environment Variables บน Hosting Platform ครบทุกตัว (โดยเฉพาะ `JWT_SECRET_KEY` และ `FRONTEND_URL`)
- [ ] ตรวจสอบ `DATABASE_URL` เชื่อมต่อ MySQL บน Cloud ได้
- [ ] รัน `npx prisma migrate deploy` หลัง deploy ครั้งแรก
- [ ] ตั้งค่า `FRONTEND_URL` ให้ตรงกับ URL ของ Frontend จริง (ใช้สำหรับ CORS)
- [ ] ตรวจสอบว่าไฟล์ `.env` อยู่ใน `.gitignore` แล้ว
- [ ] ตรวจสอบว่า folder `uploads/` มีอยู่หรือสร้างได้อัตโนมัติ (โค้ดสร้างให้เองถ้าไม่มี)

---

## 🔍 การตรวจสอบหลัง Deploy

### ตรวจสอบ Backend API:
```bash
# ทดสอบว่า Server ทำงานอยู่
curl https://your-backend-url.com/
# ควรได้ response: {"success":true,"message":"School Website API Server",...}

# ทดสอบ API endpoint
curl https://your-backend-url.com/api/blogs

# ทดสอบ Static file (รูปภาพ)
curl -I https://your-backend-url.com/uploads/blogs/[ชื่อไฟล์]
```

### ตรวจสอบ Frontend:
1. เปิดเว็บไซต์ใน Browser
2. เปิด DevTools (F12) → แท็บ **Console**
3. ดู log: `🔧 API Configuration: { apiBaseURL: "https://...", ... }` — ตรวจสอบว่า URL ถูกต้อง
4. แท็บ **Network** → ดู Request URL ของ API calls ว่าชี้ไปถูก domain

---

## 📝 CORS Configuration ที่ใช้จริงใน `backend/index.js`

CORS ของระบบนี้อ่านค่า `FRONTEND_URL` จาก Environment Variable โดยอัตโนมัติ — **ไม่ต้องแก้โค้ด** เพียงตั้งค่า `FRONTEND_URL` บน Hosting Platform ให้ถูกต้อง

```javascript
// Production: อ่าน FRONTEND_URL จาก env
const allowedOrigins = process.env.NODE_ENV === 'production'
  ? [process.env.FRONTEND_URL].filter(Boolean)
  : [
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:3000',
      'http://127.0.0.1:5173',
      /^http:\/\/192\.168\.\d+\.\d+:5173$/,  // Local network
      /^http:\/\/10\.\d+\.\d+\.\d+:5173$/
    ];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // Postman, mobile apps
    if (process.env.NODE_ENV === 'production') {
      allowedOrigins.indexOf(origin) !== -1
        ? callback(null, true)
        : callback(new Error('Not allowed by CORS'));
    } else {
      callback(null, true); // Development: อนุญาตทุก origin
    }
  },
  credentials: true,  // จำเป็นสำหรับส่ง Cookie (JWT Token)
  optionsSuccessStatus: 200
};
```

> **สรุป:** ตั้งค่า `FRONTEND_URL=https://your-frontend.com` บน Hosting Platform แล้ว CORS จะทำงานถูกต้องโดยอัตโนมัติ

---

## ⚠️ คำเตือน

### ❌ ห้ามทำ:
- ❌ Commit ไฟล์ `.env` ขึ้น Git (ข้อมูล Secret จะรั่วไหล)
- ❌ ใช้ `JWT_SECRET` แทน `JWT_SECRET_KEY` — โค้ดจะไม่สามารถ Sign Token ได้
- ❌ ลืมตั้งค่า `FRONTEND_URL` บน Backend — จะเกิด CORS Error ทุก Request
- ❌ ใช้ hardcoded URLs (`http://localhost:5000`) ในโค้ด Frontend
- ❌ ใช้ `migrate reset` บน Production — จะลบข้อมูลจริงทั้งหมด

### ✅ ควรทำ:
- ✅ ใช้ Environment Variables เสมอ ทั้ง Frontend และ Backend
- ✅ ใช้ HTTPS ทั้งคู่ใน Production
- ✅ ใช้ `migrate deploy` (ไม่ใช่ `migrate reset`) บน Production
- ✅ ทดสอบ build locally (`npm run build`) ก่อน deploy
- ✅ ตรวจสอบ Browser Console และ Network tab หลัง deploy

---

## 🆘 Troubleshooting

### ปัญหา: Login แล้วได้รับ Error 401 / JWT Invalid
**สาเหตุ:** ชื่อตัวแปร JWT ผิด — ระบบอ่าน `JWT_SECRET_KEY` แต่ตั้งค่าเป็น `JWT_SECRET`
**วิธีแก้:** เปลี่ยนชื่อตัวแปรใน Hosting Dashboard จาก `JWT_SECRET` → `JWT_SECRET_KEY`

---

### ปัญหา: CORS Error ใน Browser Console
```
Access to XMLHttpRequest at 'https://backend...' from origin 'https://frontend...' 
has been blocked by CORS policy
```
**สาเหตุ:** `FRONTEND_URL` บน Backend ไม่ตรงกับ URL ของ Frontend จริง
**วิธีแก้:**
1. ตรวจสอบ `FRONTEND_URL` ใน Backend Hosting Dashboard
2. ต้องตรงทุกตัวอักษร รวมถึงไม่มี `/` ท้าย URL เช่น `https://myapp.vercel.app` (ไม่ใช่ `https://myapp.vercel.app/`)
3. Redeploy Backend หลังแก้ค่า

---

### ปัญหา: API calls ล้มเหลว / ได้ 404
**สาเหตุ:** `VITE_API_BASE_URL` ของ Frontend ไม่ถูกต้อง
**วิธีแก้:**
1. เปิด DevTools (F12) → Console → ดู log `🔧 API Configuration: { apiBaseURL: "..." }`
2. ถ้า URL ผิด → แก้ค่า `VITE_API_BASE_URL` บน Frontend Hosting Dashboard
3. Redeploy Frontend เพื่อให้ค่าใหม่มีผล

---

### ปัญหา: รูปภาพไม่แสดง (404 on image)
**สาเหตุที่ 1:** `VITE_API_BASE_URL` ชี้ไปผิด Backend
**สาเหตุที่ 2:** ไฟล์รูปภาพอยู่ใน `uploads/` บน Server เดิม แต่ Deploy ไปอีก Server แล้วไฟล์หาย
**วิธีแก้:**
- ตรวจสอบ URL ของรูปใน DevTools → Network
- สำหรับ Hosting แบบ Ephemeral Storage (เช่น Render free tier) รูปจะหายหลัง restart — ต้องใช้ Cloud Storage เช่น AWS S3 หรือ Cloudinary แทน

---

### ปัญหา: Database Connection Error
**สาเหตุ:** `DATABASE_URL` ผิด หรือ MySQL Server ไม่ได้รัน
**วิธีแก้:**
1. ตรวจสอบ `DATABASE_URL` ว่า username, password, host, port, และ database name ถูกต้อง
2. ตรวจสอบว่า MySQL Service ทำงานอยู่
3. รัน `npx prisma migrate deploy` ถ้าตารางยังไม่ได้ถูกสร้าง

---

##  การตรวจสอบเมื่อเกิดปัญหา

เมื่อเกิดปัญหาใด ๆ ให้ตรวจสอบตามลำดับนี้:

1. **Browser Console (F12)** — ดู Error message และ `🔧 API Configuration` log
2. **Network tab** — ดู URL ของ Request และ Status Code ที่ได้รับกลับ
3. **Backend logs** — ดูใน Hosting Platform Dashboard (Railway/Render มี Log viewer)
4. **Environment Variables** — ตรวจสอบทุกตัวแปรบน Hosting Dashboard ว่าครบและชื่อถูกต้อง
