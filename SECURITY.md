# 🔐 Security Best Practices Checklist

## ✅ สิ่งที่ทำแล้ว

### Backend Security
- ✅ Environment variables แยก development/production
- ✅ CORS configuration with origin whitelist
- ✅ Security headers (X-Frame-Options, X-Content-Type-Options, X-XSS-Protection)
- ✅ JWT authentication with secure secret
- ✅ Password hashing (bcrypt)
- ✅ Error handling with production/development modes
- ✅ Input validation in routes
- ✅ PM2 process management configuration
- ✅ Credentials from environment variables only

### Frontend Security
- ✅ Environment-based API URLs
- ✅ Token stored in localStorage (consider httpOnly cookies for better security)
- ✅ No hardcoded secrets
- ✅ Build optimization for production

---

## ⚠️ สิ่งที่ต้องทำเพิ่มเติม (แนะนำ)

### High Priority

1. **Rate Limiting**
   ```bash
   npm install express-rate-limit
   ```
   ```javascript
   const rateLimit = require('express-rate-limit');
   
   const limiter = rateLimit({
     windowMs: 15 * 60 * 1000, // 15 minutes
     max: 100 // limit each IP to 100 requests per windowMs
   });
   
   app.use('/api/', limiter);
   ```

2. **Helmet (Security Headers)**
   ```bash
   npm install helmet
   ```
   ```javascript
   const helmet = require('helmet');
   app.use(helmet());
   ```

3. **Input Validation & Sanitization**
   ```bash
   npm install express-validator
   ```

4. **HTTPS Only (Production)**
   - Force HTTPS redirect in Nginx
   - Set secure cookies: `sameSite: 'strict', secure: true`

5. **Database Connection Security**
   - Use connection pooling
   - Parameterized queries (Prisma already does this)
   - Regular backups

---

### Medium Priority

6. **Logging & Monitoring**
   ```bash
   npm install winston
   ```

7. **File Upload Security**
   - Validate file types
   - Limit file sizes
   - Scan for malware
   - Use dedicated storage (S3, etc.)

8. **API Request Validation**
   - Validate all input data
   - Sanitize user inputs
   - Check file upload MIME types

9. **Session Management**
   - Token expiration
   - Refresh tokens
   - Blacklist compromised tokens

10. **Database Backups**
    - Automated daily backups
    - Off-site backup storage
    - Test restore procedures

---

### Low Priority (Good to Have)

11. **Audit Logging**
    - Log all admin actions
    - Track failed login attempts
    - Monitor suspicious activities

12. **Security Scanning**
    - Regular dependency updates: `npm audit fix`
    - Penetration testing
    - Vulnerability scanning

13. **API Documentation**
    - Swagger/OpenAPI
    - Request/Response examples
    - Authentication flow

---

## 🚨 Critical Production Checklist

### Before Going Live

- [ ] เปลี่ยน `JWT_SECRET_KEY` เป็นค่าใหม่ที่ปลอดภัย (64+ characters)
- [ ] ตั้งค่า `NODE_ENV=production`
- [ ] ใช้รหัสผ่าน database ที่แข็งแรง
- [ ] ตั้งค่า HTTPS/SSL certificates
- [ ] จำกัด CORS origins เฉพาะ domain จริง
- [ ] ปิดการแสดง error stack traces ใน production
- [ ] Setup firewall (UFW, iptables)
- [ ] Setup fail2ban (optional but recommended)
- [ ] Enable MySQL slow query log
- [ ] Setup monitoring & alerts
- [ ] Test database restore procedure
- [ ] Document recovery procedures

---

## 📝 Environment Variables Security

### ❌ Don't
```javascript
// WRONG - Hardcoded secrets
const JWT_SECRET = "my-secret-key";
const API_URL = "http://localhost:5000";
```

### ✅ Do
```javascript
// CORRECT - From environment
const JWT_SECRET = process.env.JWT_SECRET_KEY;
const API_URL = import.meta.env.VITE_API_BASE_URL;
```

---

## 🔒 Password Security

### Database Users
```sql
-- Strong password example
CREATE USER 'eduweb'@'localhost' IDENTIFIED BY 'aB3$xY9!pQ7#mK2@vL5^nR8&wT4%';
```

### JWT Secret Generation
```bash
# Generate secure random string (Linux/Mac)
openssl rand -base64 64

# Or use Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('base64'))"
```

---

## 🛡️ Additional Security Measures

### 1. Database Security
```javascript
// Use prepared statements (Prisma does this automatically)
// Never concatenate user input into queries
```

### 2. File Upload Security
```javascript
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    // Sanitize filename
    const sanitized = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    cb(null, Date.now() + '-' + sanitized);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});
```

### 3. Rate Limiting by Route
```javascript
// Different limits for different routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5 // 5 login attempts per 15 minutes
});

app.use('/api/auth/login', authLimiter);
```

---

## 📊 Monitoring & Alerts

### PM2 Monitoring
```bash
# Enable PM2 web monitoring
pm2 install pm2-server-monit

# Or use PM2 Plus (paid service)
pm2 link <secret> <public>
```

### Log Monitoring
```bash
# Install logrotate for log management
sudo apt install logrotate

# Configure log rotation
sudo nano /etc/logrotate.d/eduweb
```

---

## 🔄 Regular Maintenance

### Daily
- Monitor error logs
- Check disk space
- Monitor CPU/Memory usage

### Weekly
- Review security logs
- Update dependencies if needed
- Check for failed backup jobs

### Monthly
- Security audit
- Performance review
- Database optimization
- Test disaster recovery

---

## 📞 Security Incident Response

1. **Identify** - Detect the issue
2. **Contain** - Stop the spread
3. **Eradicate** - Remove the threat
4. **Recover** - Restore services
5. **Review** - Prevent recurrence

### Emergency Contacts
- Server admin: [contact]
- Database admin: [contact]
- Security team: [contact]
