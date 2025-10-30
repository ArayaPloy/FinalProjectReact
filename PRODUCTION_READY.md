# ✅ Production Ready Checklist

## 📦 ไฟล์ที่สร้าง/แก้ไขสำหรับ Production

### Backend (9 ไฟล์)
1. ✅ `.env` - จัดระเบียบ environment variables
2. ✅ `.env.production.example` - Template สำหรับ production
3. ✅ `index.js` - เพิ่ม security headers, CORS config, error handling
4. ✅ `ecosystem.config.js` - PM2 configuration
5. ✅ `package.json` - มี scripts สำหรับ deployment อยู่แล้ว

### Frontend (12+ ไฟล์)
6. ✅ `.env.development` - Development environment
7. ✅ `.env.production` - Production environment (ต้องแก้ URL จริง)
8. ✅ `.env.local.example` - Template for local development

**RTK Query APIs ที่แก้ไข (ลบ hardcoded URLs):**
9. ✅ `services/academicApi.js`
10. ✅ `services/studentPublicApi.js`
11. ✅ `redux/features/auth/authApi.js`
12. ✅ `redux/features/blogs/blogsApi.js`
13. ✅ `redux/features/comments/commentsApi.js`
14. ✅ `redux/features/teachers/teachersApi.js`
15. ✅ `redux/features/clubs/clubsApi.js`
16. ✅ `redux/features/about/aboutApi.js`
17. ✅ `redux/features/attendance/flagpoleAttendanceApi.js`

**Already Good:**
- ✅ `services/behaviorScoreApi.js` - ใช้ `getApiURL` แล้ว
- ✅ `services/studentsApi.js` - ใช้ `getApiURL` แล้ว
- ✅ `utils/apiConfig.js` - มี environment support แล้ว
- ✅ `services/api.js` - มี environment support แล้ว

### Documentation
18. ✅ `SECURITY.md` - Security best practices & checklist

---

## 🎯 สิ่งที่ต้องทำก่อน Deploy

### 1. Backend Setup (VPS)

```bash
# 1. Clone repo
git clone <your-repo> eduweb
cd eduweb/backend

# 2. Install dependencies
npm install --production

# 3. Setup .env (IMPORTANT!)
cp .env.production.example .env
nano .env
```

**แก้ไขใน `.env`:**
```env
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://your-actual-domain.com

# ⚠️ CHANGE THIS!
JWT_SECRET_KEY=<generate-new-secure-key-here>

# Database
DATABASE_HOST=localhost
DATABASE_USER=eduweb_user
DATABASE_PASSWORD=<your-secure-password>
DATABASE_NAME=eduweb_project
DATABASE_URL=mysql://eduweb_user:<password>@localhost:3306/eduweb_project
```

```bash
# 4. Database setup
mysql -u root -p
# CREATE DATABASE... (ดูใน DEPLOYMENT.md)

# 5. Run migrations
npx prisma migrate deploy

# 6. (Optional) Seed data
npm run seed

# 7. Start with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

---

### 2. Frontend Setup

```bash
cd frontend

# 1. แก้ไข .env.production
nano .env.production
```

```env
# ⚠️ เปลี่ยนเป็น API URL จริง!
VITE_API_BASE_URL=https://api.your-domain.com/api
VITE_APP_ENV=production
```

```bash
# 2. Build
npm run build

# 3. Deploy dist/ folder to nginx
sudo cp -r dist/* /var/www/html/
# หรือตาม nginx config ที่ตั้งไว้
```

---

### 3. Nginx Configuration

**API (Backend):**
```nginx
# /etc/nginx/sites-available/eduweb-api
server {
    listen 80;
    server_name api.your-domain.com;
    
    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
    
    location /uploads {
        alias /var/www/eduweb/backend/uploads;
        expires 30d;
    }
}
```

**Frontend:**
```nginx
# /etc/nginx/sites-available/eduweb-frontend
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    root /var/www/eduweb/frontend/dist;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

```bash
# Enable sites
sudo ln -s /etc/nginx/sites-available/eduweb-api /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/eduweb-frontend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Setup SSL
sudo certbot --nginx -d api.your-domain.com
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

---

## 🔒 Security Checklist

### Critical (ต้องทำ)
- [ ] เปลี่ยน `JWT_SECRET_KEY` ใหม่ (64+ characters)
- [ ] ใช้รหัสผ่าน database ที่แข็งแรง
- [ ] ตั้งค่า `FRONTEND_URL` เป็น domain จริง
- [ ] ตั้งค่า `NODE_ENV=production`
- [ ] Setup HTTPS/SSL (Let's Encrypt)
- [ ] จำกัด CORS origins
- [ ] Setup firewall (UFW)

### Recommended (แนะนำ)
- [ ] Install rate limiting (express-rate-limit)
- [ ] Install Helmet.js for security headers
- [ ] Setup database backups (cron job)
- [ ] Setup PM2 monitoring
- [ ] Configure log rotation
- [ ] Setup fail2ban (optional)

---

## 📊 Monitoring

```bash
# Backend status
pm2 status
pm2 logs

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Database
mysql -u eduweb_user -p -e "SHOW PROCESSLIST;"
```

---

## 🔄 Update & Deployment

**สร้าง deploy script:**
```bash
nano deploy.sh
```

```bash
#!/bin/bash
echo "🚀 Deploying..."

# Backend
cd /var/www/eduweb/backend
git pull origin main
npm install --production
npx prisma migrate deploy
pm2 restart eduweb-backend

# Frontend
cd /var/www/eduweb/frontend
git pull origin main
npm install
npm run build

echo "✅ Done!"
```

```bash
chmod +x deploy.sh
./deploy.sh
```

---

## 🆘 Troubleshooting

### CORS Error
- ตรวจสอบ `FRONTEND_URL` ใน backend `.env`
- ต้องตรงกับ domain ที่ใช้งานจริง

### Database Connection Error
- ตรวจสอบ `DATABASE_URL` format
- ตรวจสอบ MySQL running: `sudo systemctl status mysql`

### 502 Bad Gateway
- Backend ไม่ running: `pm2 restart all`
- ตรวจสอบ port: `sudo netstat -tulpn | grep :5000`

### Environment Variables ไม่ทำงาน
- Frontend: ต้อง build ใหม่หลังแก้ `.env.production`
- Backend: ต้อง restart PM2 หลังแก้ `.env`

---

## 📝 Important Notes

1. **Frontend Build:**
   - ทุกครั้งที่แก้ `.env.production` ต้อง `npm run build` ใหม่
   - Environment variables ถูก embed ใน build time

2. **Backend Restart:**
   - ทุกครั้งที่แก้ `.env` ต้อง `pm2 restart all`

3. **Database Migrations:**
   - Production: `npx prisma migrate deploy`
   - Development: `npx prisma migrate dev`

4. **Uploads Directory:**
   - สร้าง folder: `mkdir -p uploads/homevisits uploads/blogs`
   - Set permissions: `chmod 755 uploads`

---

## 🎉 ความสำเร็จ!

หลังทำตาม checklist นี้ครบ ระบบจะพร้อม production:

✅ No hardcoded URLs  
✅ Environment-based configuration  
✅ Security headers enabled  
✅ CORS properly configured  
✅ Error handling for production  
✅ PM2 process management  
✅ Nginx reverse proxy  
✅ SSL/HTTPS ready  
✅ Database migrations ready  
✅ Deployment scripts ready  

---

## 📞 Support

หากมีปัญหา:
1. ตรวจสอบ logs: `pm2 logs`, `nginx logs`
2. ทดสอบ API: `curl http://localhost:5000/api`
3. ตรวจสอบ database: `mysql -u eduweb_user -p`
4. Review SECURITY.md และ DEPLOYMENT.md
