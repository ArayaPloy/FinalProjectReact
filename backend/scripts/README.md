# 🗄️ Database Backup & Sync Guide

## 📋 สารบัญ
1. [Backup Database](#1-backup-database)
2. [Restore Database](#2-restore-database)
3. [Sync Localhost → Server](#3-sync-localhost--server)
4. [Automated Backup](#4-automated-backup)
5. [Best Practices](#5-best-practices)

---

## 1. Backup Database

### Windows (XAMPP)
```bash
cd backend/scripts
backup-database.bat
```

### Linux/Mac (Server VM)
```bash
cd backend/scripts
chmod +x backup-database.sh
./backup-database.sh
```

**ผลลัพธ์:**
- ไฟล์ backup: `backend/backups/backup_eduweb_project_YYYYMMDD_HHMMSS.sql`
- เก็บ backup 7 วันล่าสุด (อัตโนมัติ)

---

## 2. Restore Database

### Windows
```bash
cd backend/scripts
restore-database.bat
```

### Linux/Mac
```bash
cd backend/scripts
chmod +x restore-database.sh
./restore-database.sh
```

**ตัวเลือก:**
1. เลือกไฟล์ backup จากรายการ
2. ยืนยันการ restore (⚠️ จะลบข้อมูลเดิม)
3. รอจนเสร็จสิ้น

---

## 3. Sync Localhost → Server

### วิธีที่ 1: Manual Sync (แนะนำ)

**ขั้นตอนที่ 1: Backup ที่ Localhost**
```bash
# Windows
cd backend/scripts
backup-database.bat
```

**ขั้นตอนที่ 2: Upload ไปยัง Server**

**Option A: ใช้ SCP (ถ้ามี SSH)**
```bash
scp backend/backups/backup_eduweb_project_*.sql username@192.168.1.24:/home/username/backups/
```

**Option B: ใช้ WinSCP / FileZilla**
1. เชื่อมต่อไปยัง `192.168.1.24`
2. Upload ไฟล์จาก `backend/backups/` → `/home/username/backups/`

**Option C: ใช้ Git (ไม่แนะนำสำหรับไฟล์ใหญ่)**
```bash
# Localhost
cd backend/backups
git add backup_eduweb_project_*.sql
git commit -m "Database backup"
git push origin main

# Server
cd backend/backups
git pull origin main
```

**ขั้นตอนที่ 3: Restore ที่ Server**
```bash
# SSH เข้า Server
ssh username@192.168.1.24

# Restore database
cd /path/to/backend/scripts
./restore-database.sh
```

### วิธีที่ 2: Automated Sync (ต้องตั้งค่า SSH Key)

**ตั้งค่า SSH Key (One-time setup)**
```bash
# Localhost
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
ssh-copy-id username@192.168.1.24

# ทดสอบ connection
ssh username@192.168.1.24
```

**สร้าง Sync Script**
```bash
cd backend/scripts
./sync-to-server.bat  # Windows
./sync-to-server.sh   # Linux/Mac
```

---

## 4. Automated Backup

### Windows: Task Scheduler

**สร้าง Scheduled Task:**
1. เปิด Task Scheduler
2. Create Basic Task
   - Name: "Database Backup"
   - Trigger: Daily at 2:00 AM
   - Action: Start a program
     - Program: `D:\eduWeb-fullstack-mern\backend\scripts\backup-database.bat`
3. Save

### Linux/Mac: Cron Job

**แก้ไข crontab:**
```bash
crontab -e
```

**เพิ่มบรรทัด (backup ทุกวันเวลา 02:00):**
```bash
0 2 * * * /path/to/backend/scripts/backup-database.sh >> /var/log/db-backup.log 2>&1
```

---

## 5. Best Practices

### ✅ DO's
- ✅ Backup ก่อนทุกครั้งที่ deploy
- ✅ เก็บ backup หลายเวอร์ชัน (อย่างน้อย 7 วัน)
- ✅ ทดสอบ restore บน local ก่อน
- ✅ ใช้ .env แยกระหว่าง development และ production
- ✅ เข้ารหัส backup ถ้าเก็บใน cloud

### ❌ DON'Ts
- ❌ อย่า commit .sql files ขนาดใหญ่ลง Git
- ❌ อย่าใช้ root password ที่ว่างเปล่าบน production
- ❌ อย่า restore ทับ production โดยไม่ backup
- ❌ อย่าใช้ฐานข้อมูลเดียวกันระหว่าง dev/prod

---

## 🔧 Troubleshooting

### ปัญหา: "Access denied for user"
**แก้ไข:**
```bash
# ตรวจสอบ user/password ใน script
# หรือสร้าง user ใหม่
mysql -u root -p
CREATE USER 'backup_user'@'localhost' IDENTIFIED BY 'secure_password';
GRANT SELECT, LOCK TABLES, SHOW VIEW ON eduweb_project.* TO 'backup_user'@'localhost';
FLUSH PRIVILEGES;
```

### ปัญหา: "Database not found"
**แก้ไข:**
```sql
-- ตรวจสอบชื่อ database
SHOW DATABASES;

-- สร้าง database ใหม่
CREATE DATABASE eduweb_project CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### ปัญหา: Backup file ใหญ่เกินไป
**แก้ไข:**
```bash
# Compress ด้วย gzip
gzip backup_eduweb_project_*.sql

# Restore จาก compressed file
gunzip -c backup_eduweb_project_*.sql.gz | mysql -u root -p eduweb_project
```

---

## 📞 Support

หากมีปัญหา:
1. ตรวจสอบ log files
2. ดู error messages
3. ตรวจสอบ MySQL status: `systemctl status mysql`

---

**Last Updated:** January 21, 2026
