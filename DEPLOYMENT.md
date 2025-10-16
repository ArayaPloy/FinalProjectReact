# 🚀 การ Deploy สู่ Production

## 📋 Environment Variables

### Frontend (.env)

สร้างไฟล์ `.env` ใน folder `frontend/` สำหรับ Production:

```env
# Production API URL
VITE_API_BASE_URL=https://your-backend-domain.com/api
```

**ตัวอย่าง:**
```env
# Vercel
VITE_API_BASE_URL=https://your-api.vercel.app/api

# Heroku
VITE_API_BASE_URL=https://your-app.herokuapp.com/api

# Custom Domain
VITE_API_BASE_URL=https://api.eduweb.com/api
```

### Backend (.env)

ตรวจสอบว่าไฟล์ `.env` ใน folder `backend/` มีค่าเหล่านี้:

```env
PORT=5000
MONGODB_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NODE_ENV=production
```

---

## 🔧 ขั้นตอนการ Deploy

### 1. Frontend (Vercel/Netlify)

#### Vercel:
```bash
cd frontend
npm run build
vercel --prod
```

**Environment Variables ใน Vercel Dashboard:**
- `VITE_API_BASE_URL` = `https://your-backend-url.com/api`

#### Netlify:
```bash
cd frontend
npm run build
netlify deploy --prod
```

**Environment Variables ใน Netlify Dashboard:**
- `VITE_API_BASE_URL` = `https://your-backend-url.com/api`

---

### 2. Backend (Heroku/Railway/VPS)

#### Heroku:
```bash
cd backend
heroku create your-app-name
git push heroku main
```

**Config Vars ใน Heroku:**
- `PORT` = `5000`
- `MONGODB_URL` = `your_mongodb_atlas_url`
- `JWT_SECRET` = `your_secret_key`
- `NODE_ENV` = `production`

#### Railway:
1. เชื่อม GitHub repository
2. เลือก folder `backend`
3. เพิ่ม Environment Variables ใน Railway Dashboard

---

## ✅ Checklist ก่อน Deploy

### Frontend:
- [ ] อัพเดท `VITE_API_BASE_URL` ใน `.env` หรือ Platform Dashboard
- [ ] ตรวจสอบว่าไม่มี hardcoded URLs (`localhost:5000`)
- [ ] Test build locally: `npm run build && npm run preview`
- [ ] เพิ่ม `.env` ใน `.gitignore` (ป้องกัน commit ขึ้น git)

### Backend:
- [ ] อัพเดท CORS origins ใน `index.js` เพิ่ม production domain
- [ ] ตั้งค่า MongoDB Atlas (ไม่ใช้ localhost)
- [ ] ตั้งค่า Environment Variables บน hosting platform
- [ ] เพิ่ม `.env` ใน `.gitignore`
- [ ] ตรวจสอบว่า `uploads/` folder ถูกสร้างอัตโนมัติ

---

## 🔍 การตรวจสอบหลัง Deploy

### ตรวจสอบ API:
```bash
# Test API endpoint
curl https://your-backend-url.com/api/blogs

# Test upload endpoint
curl https://your-backend-url.com/api/upload/image
```

### ตรวจสอบ Frontend:
1. เปิด Browser DevTools (F12)
2. ไปที่ Console tab
3. ดู log ข้อความ: `🔧 API Configuration: { ... }`
4. ตรวจสอบว่า `apiBaseURL` ถูกต้อง

---

## ⚠️ คำเตือน

### ❌ ห้ามทำ:
- ❌ Commit `.env` ขึ้น Git
- ❌ ใช้ hardcoded URLs (`http://localhost:5000`)
- ❌ เปิด CORS สำหรับทุก origins ใน production (`origin: '*'`)

### ✅ ควรทำ:
- ✅ ใช้ Environment Variables เสมอ
- ✅ เพิ่ม `.env.example` เป็น template
- ✅ ตั้งค่า CORS ให้เฉพาะ domains ที่ไว้ใจ
- ✅ ใช้ HTTPS ใน production

---

## 📝 ตัวอย่าง CORS Configuration สำหรับ Production

แก้ไขใน `backend/index.js`:

```javascript
app.use(cors({ 
  origin: process.env.NODE_ENV === 'production' 
    ? [
        'https://your-frontend-domain.com',
        'https://www.your-frontend-domain.com'
      ]
    : [
        'http://localhost:5173',
        'http://localhost:5174',
        'http://localhost:3000'
      ],
  credentials: true
}));
```

---

## 🆘 Troubleshooting

### ปัญหา: API calls ล้มเหลว
**สาเหตุ:** `VITE_API_BASE_URL` ไม่ถูกต้อง
**วิธีแก้:** ตรวจสอบ Environment Variables บน hosting platform

### ปัญหา: CORS Error
**สาเหตุ:** Backend ไม่ยอมรับ requests จาก frontend domain
**วิธีแก้:** เพิ่ม frontend URL ใน CORS configuration

### ปัญหา: รูปภาพไม่แสดง
**สาเหตุ:** Static files path ไม่ถูกต้อง
**วิธีแก้:** ตรวจสอบว่า backend serve static files ที่ `/uploads`

---

## 📞 Support

หากมีปัญหา ตรวจสอบ:
1. Browser Console (F12)
2. Network tab (ดู API requests)
3. Backend logs
4. Environment Variables บน hosting platform
