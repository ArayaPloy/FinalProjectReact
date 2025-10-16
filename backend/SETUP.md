# 🚀 Backend Setup Guide

คู่มือการตั้งค่า Backend สำหรับทีมพัฒนา

---

## 📋 ขั้นตอนการ Setup ครั้งแรก

### 1️⃣ Clone Repository

```bash
git clone https://github.com/YourUsername/FinalProjectReact.git
cd FinalProjectReact/backend
```

---

### 2️⃣ ติดตั้ง Dependencies

```bash
npm install
```

---

### 3️⃣ ตั้งค่า Environment Variables

**คัดลอกไฟล์ `.env.example` เป็น `.env`:**

```bash
# Windows PowerShell
Copy-Item .env.example .env

# macOS/Linux
cp .env.example .env
```

**แก้ไขไฟล์ `.env` ตามความต้องการ:**

```env
PORT=5000
NODE_ENV=development
MONGODB_URL=mongodb://localhost:27017/eduweb
JWT_SECRET=your-super-secret-jwt-key-change-this
```

⚠️ **สำคัญ:** อย่า commit ไฟล์ `.env` ขึ้น Git!

---

### 4️⃣ ตั้งค่า Database

#### Option A: ใช้ Local MongoDB (แนะนำสำหรับ Development)

1. **ติดตั้ง MongoDB:**
   - Windows: [Download MongoDB Community Server](https://www.mongodb.com/try/download/community)
   - macOS: `brew install mongodb-community`
   - Linux: `sudo apt-get install mongodb`

2. **เริ่มต้น MongoDB Service:**
   ```bash
   # Windows
   net start MongoDB
   
   # macOS
   brew services start mongodb-community
   
   # Linux
   sudo systemctl start mongod
   ```

3. **ตรวจสอบว่า MongoDB รันอยู่:**
   ```bash
   mongosh
   # ถ้าเชื่อมต่อได้ แสดงว่าพร้อมใช้งาน
   ```

#### Option B: ใช้ MongoDB Atlas (Cloud - Free Tier)

1. ไปที่ [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. สร้าง Free Cluster
3. สร้าง Database User
4. Whitelist IP Address (0.0.0.0/0 สำหรับ development)
5. คัดลอก Connection String แล้วใส่ใน `.env`:
   ```env
   MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/eduweb?retryWrites=true&w=majority
   ```

---

### 5️⃣ Reset และ Seed Database

**⚠️ สำคัญมาก:** ทุกครั้งที่ clone repo ใหม่หรือมีการเปลี่ยน schema ต้องรัน:

```bash
npx prisma migrate reset
```

คำสั่งนี้จะ:
- ✅ ลบข้อมูลเก่าทั้งหมด
- ✅ สร้าง tables ใหม่ตาม schema
- ✅ รัน seed script (เพิ่มข้อมูลตัวอย่าง)

**ถ้า seed ไม่รัน ให้รันแยก:**
```bash
npx prisma db seed
```

---

### 6️⃣ เริ่มต้น Development Server

```bash
npm run dev
# หรือ
node index.js
```

Server จะรันที่: `http://localhost:5000`

---

## 🔄 เมื่อมีการอัพเดท Code

### เมื่อ Pull Code ใหม่จาก Git

```bash
# 1. Pull code ล่าสุด
git pull origin main

# 2. อัพเดท dependencies (ถ้ามีการเปลี่ยนแปลง)
npm install

# 3. ⚠️ ถ้ามีการเปลี่ยน Database Schema - ต้อง reset!
npx prisma migrate reset
```

### เมื่อมีการเปลี่ยนแปลง Schema (schema.prisma)

```bash
# Reset database และ seed ใหม่
npx prisma migrate reset

# สร้าง migration ใหม่ (สำหรับคนที่แก้ schema)
npx prisma migrate dev --name description_of_change
```

---

## 📁 โครงสร้างโปรเจค

```
backend/
├── src/
│   ├── middleware/       # Authentication, validation
│   ├── model/           # Mongoose models
│   ├── routes/          # API routes
│   └── data/            # Static data (ถ้ามี)
├── prisma/
│   ├── schema.prisma    # Database schema
│   ├── migrations/      # Database migrations (commit ขึ้น git)
│   └── seeds/          # Seed data scripts
├── uploads/            # ไฟล์ที่ user upload (ไม่ commit)
│   ├── blogs/          # รูปภาพบทความ
│   └── homevisits/     # ไฟล์การเยี่ยมบ้าน
├── .env.example        # Template สำหรับ .env (commit)
├── .env               # Environment variables (ห้าม commit!)
├── .gitignore         # Files ที่ไม่ commit
├── index.js           # Entry point
└── package.json       # Dependencies
```

---

## 🧪 ทดสอบว่า Setup สำเร็จ

### 1. ทดสอบ Server

```bash
# เข้าไปที่ browser
http://localhost:5000
# ควรเห็น: "EduWeb-Prototype School Website Server is Running...!"
```

### 2. ทดสอบ API

```bash
# ทดสอบ GET blogs
curl http://localhost:5000/api/blogs

# หรือเปิด browser
http://localhost:5000/api/blogs
```

### 3. ตรวจสอบ Database

```bash
# เปิด Prisma Studio (GUI สำหรับดู database)
npx prisma studio
# เปิดที่ http://localhost:5555
```

---

## 🚨 Troubleshooting

### ปัญหา: Cannot connect to MongoDB

**วิธีแก้:**
1. ตรวจสอบว่า MongoDB service รันอยู่
2. ตรวจสอบ `MONGODB_URL` ใน `.env`
3. ถ้าใช้ Atlas: ตรวจสอบ IP whitelist และ credentials

### ปัญหา: Port 5000 already in use

**วิธีแก้:**
```bash
# Windows: หา process ที่ใช้ port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:5000 | xargs kill -9
```

หรือเปลี่ยน PORT ใน `.env`:
```env
PORT=5001
```

### ปัญหา: Prisma migration failed

**วิธีแก้:**
```bash
# ลบ database และเริ่มใหม่
npx prisma migrate reset

# ถ้ายังไม่ได้ ลบ migrations folder และสร้างใหม่
rm -rf prisma/migrations
npx prisma migrate dev --name init
```

### ปัญหา: Seed script ไม่รัน

**วิธีแก้:**
```bash
# รัน seed แยก
npx prisma db seed

# ถ้ายังไม่ได้ ตรวจสอบ package.json
# ควรมี:
"prisma": {
  "seed": "node prisma/seeds/seed.js"
}
```

### ปัญหา: Upload ไม่ทำงาน

**วิธีแก้:**
1. ตรวจสอบว่า folder `uploads/blogs/` และ `uploads/homevisits/` มีอยู่
2. ถ้าไม่มี สร้างใหม่:
   ```bash
   mkdir -p uploads/blogs uploads/homevisits
   ```

---

## 📝 Best Practices

### ✅ ควรทำ:

1. **ก่อน commit:**
   - รัน `git status` ตรวจสอบว่าไม่มี `.env` ใน staging
   - ตรวจสอบว่าไม่มีไฟล์ sensitive data

2. **ก่อน push:**
   - ทดสอบว่า code ทำงานได้
   - อัพเดท documentation ถ้ามีการเปลี่ยนแปลง

3. **เมื่อแก้ schema:**
   - สร้าง migration ด้วย `prisma migrate dev --name <description>`
   - Commit migration files ขึ้น git
   - แจ้งทีมให้รัน `prisma migrate reset`

4. **การทำงานร่วมกัน:**
   - ใช้ branches สำหรับ features ใหม่
   - Pull code ก่อนเริ่มทำงานทุกครั้ง
   - Merge ผ่าน Pull Requests

### ❌ ห้ามทำ:

1. ❌ Commit `.env` file
2. ❌ Commit `node_modules/`
3. ❌ Commit `uploads/` (ยกเว้น `.gitkeep`)
4. ❌ Commit sensitive data (passwords, API keys)
5. ❌ แก้ไขไฟล์ในFolder `prisma/migrations/` โดยตรง
6. ❌ ใช้ JWT_SECRET เดียวกันกับ production

---

## 🔐 Security Checklist

- [ ] ไฟล์ `.env` อยู่ใน `.gitignore`
- [ ] ใช้ strong JWT_SECRET (production)
- [ ] เปลี่ยน default passwords ทั้งหมด
- [ ] ไม่ commit API keys หรือ credentials
- [ ] ตั้งค่า CORS ให้ถูกต้อง
- [ ] Validate user inputs
- [ ] ใช้ HTTPS ใน production

---

## 📞 ติดต่อ

หากมีปัญหาหรือข้อสงสัย:
1. เช็ค Troubleshooting section ก่อน
2. ดู logs: `npm run dev`
3. ถาม team ใน chat group
4. สร้าง Issue ใน GitHub

---

## 📚 เอกสารเพิ่มเติม

- [Prisma Documentation](https://www.prisma.io/docs)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [JWT Authentication](https://jwt.io/introduction)

---

**Happy Coding! 🚀**
