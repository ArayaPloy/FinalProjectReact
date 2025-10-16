# 🔧 API Configuration Documentation

## 📁 ไฟล์ที่เกี่ยวข้อง

### Frontend:
- `frontend/.env` - Environment variables (ห้าม commit)
- `frontend/.env.example` - Template สำหรับ .env
- `frontend/.env.production.example` - Template สำหรับ production
- `frontend/src/utils/apiConfig.js` - Utility functions สำหรับจัดการ API URLs
- `frontend/src/services/api.js` - Axios instance พร้อม interceptors

### Backend:
- `backend/.env` - Environment variables (ห้าม commit)
- `backend/index.js` - CORS configuration
- `backend/src/routes/upload.route.js` - Upload API endpoint

---

## 🎯 Utility Functions

### 1. `getApiURL(endpoint)`
สร้าง URL สำหรับ API endpoints

```javascript
import { getApiURL } from '@/utils/apiConfig';

// Development: http://localhost:5000/api/upload/image
// Production:  https://api.yourdomain.com/api/upload/image
const uploadURL = getApiURL('/upload/image');
```

### 2. `getBackendURL()`
ดึง Backend URL หลัก (ไม่รวม /api)

```javascript
import { getBackendURL } from '@/utils/apiConfig';

// Development: http://localhost:5000
// Production:  https://api.yourdomain.com
const backendURL = getBackendURL();
```

### 3. `getStaticURL(path)`
สร้าง URL สำหรับ static files (รูปภาพ, ไฟล์)

```javascript
import { getStaticURL } from '@/utils/apiConfig';

// Development: http://localhost:5000/uploads/blogs/image.jpg
// Production:  https://api.yourdomain.com/uploads/blogs/image.jpg
const imageURL = getStaticURL('/uploads/blogs/image.jpg');
```

### 4. `isAbsoluteURL(url)`
ตรวจสอบว่า URL เป็น absolute URL หรือไม่

```javascript
import { isAbsoluteURL } from '@/utils/apiConfig';

isAbsoluteURL('http://example.com/image.jpg'); // true
isAbsoluteURL('/uploads/image.jpg'); // false
```

### 5. `toAbsoluteURL(url)`
แปลง relative URL เป็น absolute URL

```javascript
import { toAbsoluteURL } from '@/utils/apiConfig';

// ถ้าเป็น absolute แล้ว ส่งกลับ as-is
toAbsoluteURL('http://example.com/image.jpg'); 
// → 'http://example.com/image.jpg'

// ถ้าเป็น relative แปลงเป็น absolute
toAbsoluteURL('/uploads/blogs/image.jpg'); 
// → 'http://localhost:5000/uploads/blogs/image.jpg' (dev)
// → 'https://api.yourdomain.com/uploads/blogs/image.jpg' (prod)
```

---

## 📝 ตัวอย่างการใช้งาน

### ตัวอย่างที่ 1: Upload รูปภาพ (AddPost.jsx, UpdatePost.jsx)

```javascript
import { getApiURL } from '../../../utils/apiConfig';

const handleImageUpload = async () => {
  const formData = new FormData();
  formData.append('image', selectedFile);

  // ✅ ใช้ getApiURL - รองรับทั้ง dev และ prod
  const uploadURL = getApiURL('/upload/image');
  
  const response = await fetch(uploadURL, {
    method: 'POST',
    body: formData,
  });
  
  const data = await response.json();
  if (data.success) {
    setCoverImg(data.imageUrl);
  }
};
```

### ตัวอย่างที่ 2: แสดงรูปภาพ (SingleBlogCard.jsx)

```javascript
import { toAbsoluteURL } from '../../utils/apiConfig';

const BlogCard = ({ blog }) => {
  // ✅ รองรับทั้ง absolute และ relative URLs
  const imageURL = toAbsoluteURL(blog.coverImg);
  
  return (
    <img src={imageURL} alt={blog.title} />
  );
};
```

### ตัวอย่างที่ 3: เรียก API ด้วย Axios (RTK Query หรือ Axios)

```javascript
import api from '../../services/api';

// ✅ api instance ใช้ baseURL จาก env variable อัตโนมัติ
const fetchBlogs = async () => {
  const response = await api.get('/blogs');
  return response.data;
};
```

---

## 🔄 Flow การทำงาน

### Development:
1. `.env` → `VITE_API_BASE_URL=http://localhost:5000/api`
2. `apiConfig.js` → อ่านค่าจาก `import.meta.env.VITE_API_BASE_URL`
3. `getApiURL('/upload/image')` → `http://localhost:5000/api/upload/image`
4. Upload ไปที่ `http://localhost:5000/api/upload/image`
5. Backend ส่งกลับ `imageUrl: "http://localhost:5000/uploads/blogs/image-123.jpg"`

### Production:
1. Hosting Platform → Set `VITE_API_BASE_URL=https://api.yourdomain.com/api`
2. `apiConfig.js` → อ่านค่าจาก environment variable
3. `getApiURL('/upload/image')` → `https://api.yourdomain.com/api/upload/image`
4. Upload ไปที่ `https://api.yourdomain.com/api/upload/image`
5. Backend ส่งกลับ `imageUrl: "https://api.yourdomain.com/uploads/blogs/image-123.jpg"`

---

## ⚙️ Environment Variables Reference

### Frontend

| Variable | Description | Development | Production |
|----------|-------------|-------------|------------|
| `VITE_API_BASE_URL` | API Base URL รวม `/api` | `http://localhost:5000/api` | `https://api.yourdomain.com/api` |

### Backend

| Variable | Description | Development | Production |
|----------|-------------|-------------|------------|
| `PORT` | Server port | `5000` | `5000` (or assigned by hosting) |
| `NODE_ENV` | Environment | `development` | `production` |
| `MONGODB_URL` | MongoDB connection | Local MongoDB | MongoDB Atlas |
| `JWT_SECRET` | JWT secret key | Any string | Strong random string |

---

## 🚨 Common Mistakes

### ❌ ผิด: Hardcode URL
```javascript
// ❌ ห้ามทำ - ไม่รองรับ production
fetch('http://localhost:5000/api/upload/image', {...})
```

### ✅ ถูก: ใช้ Utility Function
```javascript
// ✅ ถูกต้อง - รองรับทั้ง dev และ prod
import { getApiURL } from '@/utils/apiConfig';
fetch(getApiURL('/upload/image'), {...})
```

### ❌ ผิด: ตรวจสอบ URL แบบ hardcode
```javascript
// ❌ ห้ามทำ - ใช้ได้แค่ localhost
if (url.includes('localhost:5000')) {
  // ...
}
```

### ✅ ถูก: ใช้ Utility Function
```javascript
// ✅ ถูกต้อง - ใช้ได้ทุก environment
import { isAbsoluteURL, getBackendURL } from '@/utils/apiConfig';
if (url.includes(getBackendURL())) {
  // ...
}
```

---

## 📊 Debugging

### ดูค่า Configuration ปัจจุบัน

เปิด Browser Console (F12) ใน development mode จะเห็น:

```
🔧 API Configuration: {
  isDevelopment: true,
  isProduction: false,
  apiBaseURL: "http://localhost:5000/api",
  backendURL: "http://localhost:5000"
}
```

### ตรวจสอบ Network Requests

1. เปิด DevTools → Network tab
2. กด Upload รูปภาพ
3. ดู Request URL ควรเป็น:
   - Dev: `http://localhost:5000/api/upload/image`
   - Prod: `https://api.yourdomain.com/api/upload/image`

---

## 🔐 Security Best Practices

1. ✅ ไม่ commit `.env` ขึ้น Git
2. ✅ ใช้ Environment Variables เสมอ
3. ✅ ตั้งค่า CORS ให้เฉพาะ domains ที่ไว้ใจ
4. ✅ ใช้ HTTPS ใน production
5. ✅ Validate file types และ sizes
6. ✅ ใช้ strong JWT secret ใน production

---

## 📚 เพิ่มเติม

- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [CORS Configuration](https://expressjs.com/en/resources/middleware/cors.html)
- [DEPLOYMENT.md](./DEPLOYMENT.md) - คู่มือการ deploy
