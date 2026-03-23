# ระบบจัดการเว็บไซต์และสารสนเทศโรงเรียน

ระบบเว็บแอปพลิเคชันแบบครบวงจร (Full-Stack Web Application) สำหรับบริหารจัดการข้อมูลโรงเรียน ครอบคลุมการแสดงข้อมูลสาธารณะ การเช็คชื่อนักเรียน การบันทึกคะแนนความประพฤติ การเยี่ยมบ้านนักเรียน และการจัดการบทความข่าวสาร

---

## 🛠️ Tech Stack

| ส่วน | เทคโนโลยี |
|---|---|
| **Frontend** | React.js 18, Redux Toolkit, Tailwind CSS, Vite |
| **Backend** | Node.js, Express.js, Prisma ORM |
| **Database** | MySQL |
| **Authentication** | JWT Token (HttpOnly Cookie) + bcrypt |
| **UI Libraries** | Ant Design, Recharts, Editor.js, SweetAlert2, Framer Motion |

---

## 📁 โครงสร้างโปรเจค

```
eduWeb-fullstack-mern/
├── frontend/          ← React + Vite (port 5173)
│   ├── src/
│   │   ├── components/    ← Shared components (Navbar, Footer ฯลฯ)
│   │   ├── pages/         ← หน้าต่าง ๆ ของเว็บไซต์
│   │   ├── redux/         ← Redux Store, RTK Query API slices
│   │   ├── services/      ← RTK Query API files เพิ่มเติม
│   │   ├── utils/         ← Utility functions (apiConfig.js ฯลฯ)
│   │   └── router/        ← React Router, ProtectedRoute
│   └── .env.example   ← Template สำหรับสร้าง .env
│
├── backend/           ← Node.js + Express (port 5000)
│   ├── src/
│   │   ├── middleware/    ← verifyToken, isAdmin ฯลฯ
│   │   └── routes/        ← API routes ทั้งหมด
│   ├── prisma/
│   │   ├── schema.prisma  ← Database schema
│   │   ├── migrations/    ← Database migrations (commit ขึ้น git)
│   │   └── seeds/         ← Seed data scripts
│   ├── uploads/           ← ไฟล์อัปโหลด (ไม่ commit)
│   │   ├── blogs/
│   │   ├── homevisits/
│   │   ├── profiles/
│   │   └── teachers/
│   ├── index.js           ← Entry point + CORS + Routes
│   └── .env.example   ← Template สำหรับสร้าง .env
│
├── API_CONFIGURATION.md
├── DEPLOYMENT.md
└── README.md
```

---

## 👥 กลุ่มผู้ใช้งาน

| กลุ่ม | Role | สิทธิ์หลัก |
|---|---|---|
| บุคคลทั่วไป / นักเรียน / ผู้ปกครอง | — (ไม่ต้องล็อกอิน) | ดูข้อมูลสาธารณะ ตรวจสอบการเช็คชื่อและคะแนนความประพฤติ |
| ครู / บุคลากร | `teacher` | เช็คชื่อนักเรียน บันทึกคะแนนพฤติกรรม บันทึกเยี่ยมบ้าน เขียนบทความ |
| ผู้ดูแลระบบ | `admin` | จัดการข้อมูลทั้งหมด อนุมัติบทความ ดูรายงาน |
| ผู้ดูแลระบบสูงสุด | `super_admin` | สิทธิ์ทุกอย่างของ admin + จัดการข้อมูลระดับระบบ |

---

## 🚀 การติดตั้งและรันในเครื่อง (Local Development)

### ขั้นตอนที่ 1: Clone Repository

```bash
git clone https://github.com/[username]/[repo-name].git
cd [repo-name]
```

### ขั้นตอนที่ 2: ติดตั้งและตั้งค่า Backend

```bash
cd backend

# ติดตั้ง dependencies
npm install

# สร้างไฟล์ .env จาก template
copy .env.example .env    # Windows
# cp .env.example .env    # macOS/Linux

# แก้ไขไฟล์ .env ตามนี้
# DATABASE_URL=mysql://root:@localhost:3308/eduweb_project
# JWT_SECRET_KEY=your-secret-key-change-this
# FRONTEND_URL=http://localhost:5173
```

### ขั้นตอนที่ 3: ตั้งค่าฐานข้อมูล

```bash
# ต้องมี MySQL รันอยู่ก่อน (port 3306 หรือ 3308)
# สร้างฐานข้อมูล: CREATE DATABASE eduweb_project;

# รัน Migration + Seed (สร้างตาราง + ข้อมูลตัวอย่าง)
npx prisma migrate reset

# หรือถ้าต้องการแค่สร้างตาราง (ไม่ลบข้อมูลเก่า)
npx prisma migrate dev
```

### ขั้นตอนที่ 4: ติดตั้งและตั้งค่า Frontend

```bash
cd ../frontend

# ติดตั้ง dependencies
npm install

# สร้างไฟล์ .env
copy .env.example .env    # Windows
# cp .env.example .env    # macOS/Linux

# เนื้อหาใน .env
# VITE_API_BASE_URL=http://localhost:5000/api
```

### ขั้นตอนที่ 5: รันระบบ

เปิด Terminal 2 หน้าต่าง:

```bash
# Terminal 1 — Backend
cd backend
npm run dev
# Server รันที่ http://localhost:5000

# Terminal 2 — Frontend
cd frontend
npm run dev
# เว็บรันที่ http://localhost:5173
```

---

## 🔑 Environment Variables ที่จำเป็น

### `backend/.env`

```env
PORT=5000
NODE_ENV=development
DATABASE_URL=mysql://root:@localhost:3308/eduweb_project
JWT_SECRET_KEY=your-super-secret-key-change-this
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
```

> ⚠️ ชื่อตัวแปรต้องเป็น `JWT_SECRET_KEY` เท่านั้น (ตามที่โค้ดใน `verifyToken.js` อ่านค่า)

### `frontend/.env`

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## 📜 Scripts ที่ใช้บ่อย

### Backend

| คำสั่ง | คำอธิบาย |
|---|---|
| `npm run dev` | รัน Development server (nodemon) |
| `npm start` | รัน Production server |
| `npx prisma migrate dev` | สร้าง Migration ใหม่เมื่อแก้ schema |
| `npx prisma migrate reset` | Reset DB + Seed (⚠️ ลบข้อมูลทั้งหมด) |
| `npx prisma migrate deploy` | รัน Migration บน Production |
| `npx prisma studio` | เปิด GUI ดูข้อมูลใน DB (port 5555) |
| `npm test` | รัน Unit Tests |

### Frontend

| คำสั่ง | คำอธิบาย |
|---|---|
| `npm run dev` | รัน Development server (port 5173) |
| `npm run build` | Build สำหรับ Production |
| `npm run preview` | Preview Production build |

---

## 🌐 URL สำคัญ (Development)

| URL | คำอธิบาย |
|---|---|
| `http://localhost:5173` | หน้าเว็บไซต์ Frontend |
| `http://localhost:5000` | Backend API Server |
| `http://localhost:5000/api/blogs` | ทดสอบ API endpoint |
| `http://localhost:5555` | Prisma Studio (GUI ฐานข้อมูล) |

---

## 📚 เอกสารอ้างอิง

| ไฟล์ | เนื้อหา |
|---|---|
| [API_CONFIGURATION.md](./API_CONFIGURATION.md) | การตั้งค่า API URL และ Environment Variables |
| [DEPLOYMENT.md](./DEPLOYMENT.md) | คู่มือการ Deploy สู่ Production |
| [backend/SETUP.md](./backend/SETUP.md) | คู่มือตั้งค่า Backend สำหรับนักพัฒนา |
| [SECURITY.md](./SECURITY.md) | แนวทางความปลอดภัยของระบบ |

---

## ⚠️ หมายเหตุด้านความปลอดภัย

- ห้าม commit ไฟล์ `.env` ขึ้น Git เด็ดขาด
- `JWT_SECRET_KEY` ต้องเป็น random string ที่ยาวและเดาไม่ได้ โดยเฉพาะใน Production
- ไฟล์ใน `backend/uploads/` ไม่ควร commit ขึ้น Git (มีอยู่ใน `.gitignore` แล้ว)
- ดูรายละเอียดเพิ่มเติมที่ [SECURITY.md](./SECURITY.md)
