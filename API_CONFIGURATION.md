# 🔧 API Configuration Documentation

เอกสารนี้อธิบายวิธีการจัดการ URL และการเชื่อมต่อระหว่าง Frontend และ Backend ของระบบ ครอบคลุมทั้ง Environment Variables, Utility Functions, API Routes ทั้งหมด และแนวทางการใช้งานที่ถูกต้อง

---

## 📁 ไฟล์ที่เกี่ยวข้อง

### Frontend:
- `frontend/.env` — Environment variables สำหรับ Development (ห้าม commit ขึ้น Git)
- `frontend/.env.example` — Template สำหรับสร้างไฟล์ `.env`
- `frontend/src/utils/apiConfig.js` — Utility functions หลักสำหรับจัดการ API URLs ทั้งหมด
- `frontend/src/redux/features/*/` — RTK Query API slices แต่ละโมดูล
- `frontend/src/services/*/` — RTK Query API files เพิ่มเติม

### Backend:
- `backend/.env` — Environment variables (ห้าม commit ขึ้น Git)
- `backend/.env.example` — Template สำหรับสร้างไฟล์ `.env`
- `backend/index.js` — Entry point, CORS configuration, และการลงทะเบียน Routes ทั้งหมด
- `backend/src/routes/upload.route.js` — API สำหรับอัปโหลดไฟล์
- `backend/uploads/` — โฟลเดอร์เก็บไฟล์ที่ผู้ใช้อัปโหลด (ไม่ commit)

---

## ⚙️ Environment Variables

### Frontend — `frontend/.env`

ตัวแปรสภาพแวดล้อมของ Frontend ต้องขึ้นต้นด้วย `VITE_` เสมอ เพื่อให้ Vite ส่งค่าไปยัง Browser ได้

```env
# API Base URL — ต้องรวม /api ด้วยเสมอ
VITE_API_BASE_URL=http://localhost:5000/api
```

> **หมายเหตุ:** หลังแก้ไขไฟล์ `.env` ต้อง restart dev server (`npm run dev`) เสมอ เพราะ Vite อ่านค่าตอน build เท่านั้น

| Environment | ค่าที่ใช้ |
|---|---|
| Development (local) | `http://localhost:5000/api` |
| Production (Vercel) | `https://your-api.vercel.app/api` |
| Production (Railway) | `https://your-app.railway.app/api` |
| Production (Custom Domain) | `https://api.yourdomain.com/api` |

### Backend — `backend/.env`

```env
# ============ Server ============
PORT=5000
NODE_ENV=development

# ============ Database (MySQL + Prisma) ============
DATABASE_HOST=localhost
DATABASE_PORT=3308
DATABASE_USER=root
DATABASE_PASSWORD=
DATABASE_NAME=eduweb_project
DATABASE_URL=mysql://root:@localhost:3308/eduweb_project

# ============ Authentication ============
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# ============ CORS ============
# URL ของ Frontend ที่อนุญาตให้เข้าถึง Backend
FRONTEND_URL=http://localhost:5173

# ============ File Upload ============
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=image/jpeg,image/jpg,image/png,image/gif,image/webp
```

| ตัวแปร | คำอธิบาย | Development | Production |
|---|---|---|---|
| `PORT` | พอร์ตของ Backend Server | `5000` | กำหนดโดย Hosting Platform |
| `NODE_ENV` | โหมดการทำงาน | `development` | `production` |
| `DATABASE_URL` | Connection String ของ MySQL | `mysql://root:@localhost:3308/...` | Connection String จาก Cloud DB |
| `JWT_SECRET` | กุญแจลับสำหรับ Sign JWT Token | ค่าใดก็ได้ | String สุ่ม อย่างน้อย 32 ตัวอักษร |
| `JWT_EXPIRES_IN` | อายุของ Token | `7d` | `7d` (ปรับได้) |
| `FRONTEND_URL` | URL ของ Frontend สำหรับ CORS | `http://localhost:5173` | URL ของ Frontend จริง |
| `MAX_FILE_SIZE` | ขนาดไฟล์สูงสุดที่อัปโหลดได้ (bytes) | `5242880` (5 MB) | `5242880` |
| `ALLOWED_FILE_TYPES` | ประเภทไฟล์ที่อนุญาต | `image/jpeg,image/png,...` | เหมือนกัน |

---

## 🗺️ API Routes ทั้งหมด

Backend ลงทะเบียน Routes ทั้งหมดใน `backend/index.js` ดังนี้:

| Base Path | ไฟล์ Route | คำอธิบาย |
|---|---|---|
| `POST /api/auth/login` | `auth.route.js` | เข้าสู่ระบบ ออก JWT Token |
| `GET /api/auth/me` | `authMe.route.js` | ดึงข้อมูล User ที่ Login อยู่ |
| `GET/PUT /api/profile` | `profile.route.js` | ดูและแก้ไขโปรไฟล์ |
| `GET/POST/PUT/DELETE /api/blogs` | `blogs.route.js` | จัดการบทความ |
| `GET/POST/PUT/DELETE /api/about` | `about.route.js` | ข้อมูลโรงเรียน (History, Timeline) |
| `GET/POST/DELETE /api/comments` | `comments.route.js` | แสดงความคิดเห็นในบทความ |
| `GET/POST/PUT/DELETE /api/teachers` | `teachers.route.js` | ข้อมูลครูและบุคลากร |
| `GET/POST/PUT/DELETE /api/clubs` | `clubs.route.js` | ชุมนุมวิชาการ |
| `GET/POST/PUT/DELETE /api/homevisits` | `homevisits.route.js` | บันทึกการเยี่ยมบ้าน |
| `GET/POST /api/flagpole-attendance` | `flagpole-attendance.route.js` | เช็คชื่อเข้าแถว |
| `POST /api/upload/image` | `upload.route.js` | อัปโหลดรูปภาพ |
| `GET/POST/PUT/DELETE /api/behavior-scores` | `behavior-score.route.js` | คะแนนความประพฤติ |
| `GET/POST/PUT/DELETE /api/students` | `student.route.js` | ข้อมูลนักเรียน (Admin) |
| `GET /api/students/public` | `student-public.route.js` | ข้อมูลนักเรียนสำหรับสาธารณะ |
| `GET/POST/PUT/DELETE /api/academic-years` | `academic.route.js` | ปีการศึกษาและภาคเรียน |
| `GET/POST/PUT/DELETE /api/classrooms` | `classrooms.route.js` | ห้องเรียน |
| `GET/POST/PUT/DELETE /api/schedules` | `classschedules.route.js` | ตารางเรียน |
| `GET/POST/PUT/DELETE /api/subjects` | `subjects.route.js` | รายวิชา |
| `GET /api/admissions` | `admissions.route.js` | ข้อมูลการรับสมัครนักเรียน |
| `GET /uploads/*` | Static | แสดงไฟล์ที่อัปโหลด (รูปภาพ) |

### โครงสร้างโฟลเดอร์ `uploads/`

ไฟล์ที่ผู้ใช้อัปโหลดจะถูกเก็บในโฟลเดอร์นี้บน Backend Server:

```
backend/uploads/
├── blogs/          ← รูปปกบทความ
├── homevisits/     ← รูปภาพหลักฐานการเยี่ยมบ้าน
├── profiles/       ← รูปโปรไฟล์ผู้ใช้
└── teachers/       ← รูปภาพครูและบุคลากร
```

---

## 🎯 Utility Functions — `apiConfig.js`

ไฟล์ `frontend/src/utils/apiConfig.js` เป็นจุดกลางสำหรับสร้างและจัดการ URL ทั้งหมด เพื่อให้ระบบทำงานได้ถูกต้องทั้งใน Development และ Production โดยไม่ต้องแก้ไขโค้ด

### ค่าคงที่ `API_BASE_URL`

```javascript
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
```

อ่านค่าจาก Environment Variable `VITE_API_BASE_URL` ก่อน ถ้าไม่มีจะใช้ค่า Default (`localhost:5000/api`) แทน ทำให้ระบบยังทำงานได้แม้ไม่มีไฟล์ `.env`

---

### 1. `getBackendURL()`

**วัตถุประสงค์:** ดึง URL ของ Backend Server หลัก โดยตัด `/api` ออก ใช้สำหรับสร้าง URL ของไฟล์ Static (รูปภาพ)

```javascript
export const getBackendURL = () => {
  return API_BASE_URL.replace('/api', '');
};
```

**ตัวอย่าง:**
```javascript
import { getBackendURL } from '../utils/apiConfig';

getBackendURL();
// Development → "http://localhost:5000"
// Production  → "https://api.yourdomain.com"
```

---

### 2. `getApiURL(endpoint)`

**วัตถุประสงค์:** สร้าง URL สำหรับเรียก API endpoints โดยรวม `API_BASE_URL` กับ path ที่กำหนด

```javascript
export const getApiURL = (endpoint) => {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${API_BASE_URL}${cleanEndpoint}`;
};
```

**ตัวอย่าง:**
```javascript
import { getApiURL } from '../utils/apiConfig';

getApiURL('/upload/image');
// Development → "http://localhost:5000/api/upload/image"
// Production  → "https://api.yourdomain.com/api/upload/image"

getApiURL('/blogs');
// Development → "http://localhost:5000/api/blogs"
```

---

### 3. `getStaticURL(path)`

**วัตถุประสงค์:** สร้าง URL สำหรับเข้าถึงไฟล์ Static บน Backend (รูปภาพ, ไฟล์อัปโหลด)

```javascript
export const getStaticURL = (path) => {
  const backendURL = getBackendURL();
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${backendURL}${cleanPath}`;
};
```

**ตัวอย่าง:**
```javascript
import { getStaticURL } from '../utils/apiConfig';

getStaticURL('/uploads/blogs/cover-123.jpg');
// Development → "http://localhost:5000/uploads/blogs/cover-123.jpg"
// Production  → "https://api.yourdomain.com/uploads/blogs/cover-123.jpg"

getStaticURL('/uploads/teachers/teacher-001.jpg');
// Development → "http://localhost:5000/uploads/teachers/teacher-001.jpg"
```

---

### 4. `isAbsoluteURL(url)`

**วัตถุประสงค์:** ตรวจสอบว่า URL ที่รับมาเป็น Absolute URL (มี `http://` หรือ `https://` นำหน้า) หรือไม่

```javascript
export const isAbsoluteURL = (url) => {
  return /^https?:\/\//i.test(url);
};
```

**ตัวอย่าง:**
```javascript
import { isAbsoluteURL } from '../utils/apiConfig';

isAbsoluteURL('http://localhost:5000/uploads/image.jpg');  // → true
isAbsoluteURL('https://api.yourdomain.com/uploads/a.jpg'); // → true
isAbsoluteURL('/uploads/blogs/image.jpg');                 // → false
isAbsoluteURL('uploads/blogs/image.jpg');                  // → false
```

---

### 5. `toAbsoluteURL(url)`

**วัตถุประสงค์:** แปลง URL ที่รับมาให้เป็น Absolute URL เสมอ — ถ้า URL เป็น Absolute อยู่แล้วจะส่งคืนตามเดิม แต่ถ้าเป็น Relative จะเติม Backend URL ให้อัตโนมัติ ใช้มากในกรณีที่ข้อมูลในฐานข้อมูลเก็บ URL ไว้สองรูปแบบไม่เหมือนกัน

```javascript
export const toAbsoluteURL = (url) => {
  if (!url) return '';
  if (isAbsoluteURL(url)) return url;
  return getStaticURL(url);
};
```

**ตัวอย่าง:**
```javascript
import { toAbsoluteURL } from '../utils/apiConfig';

// URL เป็น absolute อยู่แล้ว → ส่งคืนตามเดิม
toAbsoluteURL('http://localhost:5000/uploads/blogs/a.jpg');
// → "http://localhost:5000/uploads/blogs/a.jpg"

// URL เป็น relative → เติม Backend URL ให้
toAbsoluteURL('/uploads/blogs/a.jpg');
// Development → "http://localhost:5000/uploads/blogs/a.jpg"
// Production  → "https://api.yourdomain.com/uploads/blogs/a.jpg"

// ค่าว่าง → ส่งคืน string ว่าง
toAbsoluteURL(null);  // → ""
toAbsoluteURL('');    // → ""
```

---

### 6. `ENV_INFO` (สำหรับ Debugging)

```javascript
export const ENV_INFO = {
  isDevelopment: import.meta.env.DEV,
  isProduction:  import.meta.env.PROD,
  apiBaseURL:    API_BASE_URL,
  backendURL:    getBackendURL(),
};

// แสดงใน Console อัตโนมัติเมื่อรันใน Development
if (import.meta.env.DEV) {
  console.log('🔧 API Configuration:', ENV_INFO);
}
```

---

## 🔄 Flow การทำงาน

### Development:

```
ไฟล์ frontend/.env
  ↓  VITE_API_BASE_URL=http://localhost:5000/api
apiConfig.js อ่านค่าจาก import.meta.env
  ↓
getApiURL('/upload/image') → "http://localhost:5000/api/upload/image"
  ↓
Frontend ส่ง POST Request พร้อมรูปภาพ
  ↓
Backend รับไฟล์ → บันทึกที่ backend/uploads/blogs/image-xyz.jpg
  ↓
Backend ส่งกลับ { imageUrl: "http://localhost:5000/uploads/blogs/image-xyz.jpg" }
  ↓
toAbsoluteURL(imageUrl) → URL ถูกต้องสำหรับแสดงผล
```

### Production:

```
Hosting Platform (Vercel/Railway) ตั้งค่า
  ↓  VITE_API_BASE_URL=https://api.yourdomain.com/api
apiConfig.js อ่านค่าจาก environment variable
  ↓
getApiURL('/upload/image') → "https://api.yourdomain.com/api/upload/image"
  ↓
Frontend ส่ง POST Request พร้อมรูปภาพ (HTTPS)
  ↓
Backend รับไฟล์ → บันทึกที่ server/uploads/blogs/image-xyz.jpg
  ↓
Backend ส่งกลับ { imageUrl: "https://api.yourdomain.com/uploads/blogs/image-xyz.jpg" }
  ↓
toAbsoluteURL(imageUrl) → URL ถูกต้องสำหรับแสดงผล
```

---

## 📝 ตัวอย่างการใช้งานจริง

### ตัวอย่างที่ 1: อัปโหลดรูปภาพปกบทความ

```javascript
import { getApiURL } from '../../../utils/apiConfig';

const handleImageUpload = async (selectedFile) => {
  const formData = new FormData();
  formData.append('image', selectedFile);

  // ใช้ getApiURL — รองรับทั้ง dev และ prod
  const response = await fetch(getApiURL('/upload/image'), {
    method: 'POST',
    body: formData,
    credentials: 'include', // ส่ง Cookie ไปด้วย
  });

  const data = await response.json();
  if (data.success) {
    setCoverImg(data.imageUrl); // เก็บ URL ที่ Backend ส่งกลับ
  }
};
```

### ตัวอย่างที่ 2: แสดงรูปภาพที่อาจเป็น relative หรือ absolute URL

```javascript
import { toAbsoluteURL } from '../../utils/apiConfig';

// ใช้กับรูปภาพครู, รูปบทความ, รูปโปรไฟล์
const TeacherCard = ({ teacher }) => {
  const imageURL = toAbsoluteURL(teacher.profileImage);

  return (
    <img src={imageURL || '/default-avatar.png'} alt={teacher.name} />
  );
};
```

### ตัวอย่างที่ 3: RTK Query API Slice (รูปแบบที่ใช้ใน Services)

```javascript
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// อ่านค่าตรงจาก env variable (รูปแบบที่ใช้ใน services/ และ redux/features/)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const blogsApi = createApi({
  reducerPath: 'blogsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_BASE_URL}/`,
    credentials: 'include', // ส่ง Cookie ไปทุก request อัตโนมัติ
  }),
  tagTypes: ['Blogs'],
  endpoints: (builder) => ({
    fetchBlogs: builder.query({
      query: ({ page = 1, limit = 10 }) =>
        `blogs?page=${page}&limit=${limit}`,
      providesTags: ['Blogs'],
    }),
  }),
});
```

### ตัวอย่างที่ 4: แสดงรูปภาพจาก Backend (FacultyStaff.jsx)

```javascript
import { getBackendURL } from '../utils/apiConfig';

const getTeacherImageURL = (imagePath) => {
  if (!imagePath) return '/default-avatar.png';

  // ถ้าเป็น full URL อยู่แล้ว ใช้ได้เลย
  if (imagePath.startsWith('http')) return imagePath;

  // ถ้าเป็น path ที่อยู่ใน /uploads/ → ต่อกับ Backend URL
  if (imagePath.includes('/uploads/')) {
    return getBackendURL() + imagePath;
  }

  // Static assets ใน Frontend
  return imagePath;
};
```

---

## 🚨 ข้อผิดพลาดที่พบบ่อย

### ❌ ผิด: Hardcode URL ตรงในโค้ด
```javascript
// ❌ ไม่รองรับ production — URL จะใช้ได้แค่ใน localhost
fetch('http://localhost:5000/api/upload/image', { ... })
```

### ✅ ถูก: ใช้ Utility Function
```javascript
// ✅ รองรับทุก environment
import { getApiURL } from '../utils/apiConfig';
fetch(getApiURL('/upload/image'), { ... })
```

---

### ❌ ผิด: ลืมใส่ `credentials: 'include'`
```javascript
// ❌ ไม่ส่ง Cookie → Backend จะตอบ 401 Unauthorized
fetch(getApiURL('/profile'), { method: 'GET' })
```

### ✅ ถูก: ส่ง Cookie ทุกครั้ง
```javascript
// ✅ ส่ง JWT Cookie ไปพร้อมกับ Request
fetch(getApiURL('/profile'), {
  method: 'GET',
  credentials: 'include',
})
```

---

### ❌ ผิด: ใส่ `/api` ซ้ำใน endpoint
```javascript
// ❌ URL จะกลายเป็น http://localhost:5000/api/api/blogs
getApiURL('/api/blogs')
```

### ✅ ถูก: ระบุแค่ path หลัง /api
```javascript
// ✅ URL จะเป็น http://localhost:5000/api/blogs
getApiURL('/blogs')
```

---

### ❌ ผิด: ตั้งชื่อตัวแปร env ผิด
```javascript
// ❌ Vite จะไม่ส่งตัวแปรนี้ไปยัง Browser
API_BASE_URL=http://localhost:5000/api
```

### ✅ ถูก: ขึ้นต้นด้วย `VITE_`
```javascript
// ✅ Vite ส่งตัวแปรที่ขึ้นต้นด้วย VITE_ ไปยัง Browser เท่านั้น
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## 📊 Debugging

### ดูค่า Configuration ปัจจุบัน

เปิด Browser Console (F12) ในโหมด Development จะเห็นข้อความนี้โดยอัตโนมัติ:

```
🔧 API Configuration: {
  isDevelopment: true,
  isProduction: false,
  apiBaseURL: "http://localhost:5000/api",
  backendURL: "http://localhost:5000"
}
```

หาก `apiBaseURL` ไม่ถูกต้อง ให้ตรวจสอบไฟล์ `frontend/.env` และ restart dev server

### ตรวจสอบ Network Requests

1. เปิด DevTools (F12) → แท็บ **Network**
2. ทดสอบ Upload รูปภาพหรือเรียก API
3. ดูที่คอลัมน์ **Request URL** ควรเป็น:
   - Development: `http://localhost:5000/api/...`
   - Production: `https://api.yourdomain.com/api/...`
4. ดูที่ส่วน **Headers → Cookie** ควรมี `token=...` แนบมาด้วย

### ทดสอบ API โดยตรง

```bash
# ทดสอบว่า Backend ทำงานอยู่
curl http://localhost:5000

# ทดสอบ API endpoint
curl http://localhost:5000/api/blogs

# ทดสอบ Static file
curl http://localhost:5000/uploads/blogs/[ชื่อไฟล์]
```

---

## 🔐 Security Best Practices

1. **ห้าม commit `.env`** — ทั้ง `frontend/.env` และ `backend/.env` ต้องอยู่ใน `.gitignore` เสมอ
2. **ใช้ HTTPS ใน production** — ป้องกันการดักจับ Token และข้อมูล
3. **ตั้งค่า CORS ให้แคบที่สุด** — `FRONTEND_URL` ควรระบุ URL จริงของ Frontend เท่านั้น ห้ามใช้ `*` ใน production
4. **JWT Secret ต้องยาวและสุ่ม** — อย่างน้อย 32 ตัวอักษร ห้ามใช้คำที่เดาได้
5. **Validate ไฟล์ที่อัปโหลด** — Backend ตรวจสอบทั้ง MIME type และขนาดไฟล์อยู่แล้ว ห้าม bypass
6. **Cookie เป็น HttpOnly** — JWT เก็บใน HttpOnly Cookie ทำให้ JavaScript ฝั่ง Client ไม่สามารถอ่านได้ ป้องกัน XSS

---

## 📚 เพิ่มเติม / อ้างอิง

- [Vite — Environment Variables and Modes](https://vitejs.dev/guide/env-and-mode.html)
- [Express CORS Middleware](https://expressjs.com/en/resources/middleware/cors.html)
- [RTK Query — fetchBaseQuery](https://redux-toolkit.js.org/rtk-query/api/fetchBaseQuery)
- [DEPLOYMENT.md](./DEPLOYMENT.md) — คู่มือการ deploy สู่ Production
