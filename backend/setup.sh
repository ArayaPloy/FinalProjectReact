#!/bin/bash
# ============================================
# Quick Setup Script สำหรับ Backend
# ============================================

echo "🚀 Starting Backend Setup..."
echo ""

# ตรวจสอบว่ามี Node.js หรือไม่
if ! command -v node &> /dev/null
then
    echo "❌ Node.js ไม่ได้ติดตั้ง กรุณาติดตั้งก่อน"
    echo "📥 Download: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"
echo "✅ NPM version: $(npm -v)"
echo ""

# ติดตั้ง dependencies
echo "📦 Installing dependencies..."
npm install

# ตรวจสอบว่ามี .env หรือไม่
if [ ! -f .env ]; then
    echo "⚠️  ไม่พบไฟล์ .env"
    echo "📝 กำลังคัดลอกจาก .env.example..."
    cp .env.example .env
    echo "✅ สร้างไฟล์ .env แล้ว"
    echo "⚠️  กรุณาแก้ไขค่าใน .env ให้ถูกต้อง!"
    echo ""
else
    echo "✅ พบไฟล์ .env แล้ว"
    echo ""
fi

# ถามว่าต้องการ reset database หรือไม่
echo "❓ ต้องการ reset และ seed database หรือไม่?"
echo "   (จะลบข้อมูลเก่าทั้งหมดและสร้างใหม่)"
read -p "   (y/n): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]
then
    echo "🗄️  Resetting database..."
    npx prisma migrate reset --force
    echo "✅ Database reset สำเร็จ!"
else
    echo "⏭️  ข้าม database reset"
fi

echo ""
echo "✅ Setup เสร็จสมบูรณ์!"
echo ""
echo "📝 ขั้นตอนถัดไป:"
echo "   1. แก้ไขไฟล์ .env ให้ถูกต้อง"
echo "   2. ตรวจสอบว่า MongoDB รันอยู่"
echo "   3. รัน: npm run dev"
echo ""
echo "🚀 Happy Coding!"
