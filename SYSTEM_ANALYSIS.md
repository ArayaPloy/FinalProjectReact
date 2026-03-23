# การวิเคราะห์ระบบ - ระบบบริหารจัดการโรงเรียน

## 📊 สถาปัตยกรรมระบบ (System Architecture)

### 🎯 Architecture Pattern: **3-Tier Architecture**
```
┌─────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                   │
│              (React + Redux + Tailwind CSS)             │
└────────────────────┬────────────────────────────────────┘
                     │ REST API (HTTP/HTTPS)
┌────────────────────▼────────────────────────────────────┐
│                   APPLICATION LAYER                     │
│         (Node.js + Express + JWT + Middleware)          │
└────────────────────┬────────────────────────────────────┘
                     │ Prisma ORM
┌────────────────────▼────────────────────────────────────┐
│                     DATA LAYER                          │
│              (MySQL + Prisma Schema)                    │
└─────────────────────────────────────────────────────────┘
```

---

## 🧩 สถาปัตยกรรมและ Design Patterns ที่ใช้

### 1. **MVC Pattern (Modified)**
```
Frontend:
├── View (React Components)
├── Controller (Redux Actions/Thunks)
└── Model (Redux Store State)

Backend:
├── Routes (Controller)
├── Middleware (Business Logic)
└── Prisma Models (Data Access Layer)
```

### 2. **Repository Pattern**
- ใช้ Prisma ORM เป็น Repository Layer
- แยก Data Access Logic ออกจาก Business Logic
- ทำให้ง่ายต่อการเปลี่ยน Database

### 3. **Middleware Pattern**
```javascript
// Authentication Flow
Request → CORS → Security Headers → Auth Middleware → Route Handler → Response
```

### 4. **Redux Pattern (Flux Architecture)**
```
Component → Action → Reducer → Store → Component (Re-render)
```

### 5. **API Service Layer Pattern**
- RTK Query (Redux Toolkit Query)
- Centralized API calls
- Automatic caching & refetching

---

## 🔐 Authentication & Authorization Algorithm

### 🔑 JWT Authentication Flow

```javascript
// Algorithm: JWT Token-Based Authentication

1. USER LOGIN
   ├── User sends { email, password }
   ├── Backend validates credentials
   ├── bcrypt.compare(password, hashedPassword) → O(1) time complexity
   └── Generate JWT Token

2. TOKEN GENERATION
   ├── Algorithm: HMAC-SHA256
   ├── Payload: { userId, role, exp }
   ├── Sign with JWT_SECRET_KEY
   ├── Token expires in 2h (ปกติ) หรือ 7d (Remember Me)
   └── Cookie maxAge sync กับ tokenExpiry เสมอ

3. TOKEN VERIFICATION
   ├── Extract token from Cookie/Header
   ├── jwt.verify(token, SECRET) → O(1)
   ├── Check expiration
   └── Decode user info

4. AUTHORIZATION
   ├── Check user.role
   ├── Match against allowedRoles[]
   └── Grant/Deny access
```

### 🛡️ Password Hashing Algorithm

```javascript
// Algorithm: bcrypt (Blowfish cipher)
const saltRounds = 10; // 2^10 iterations
const hashedPassword = await bcrypt.hash(password, saltRounds);

// Time Complexity: O(2^saltRounds)
// Space Complexity: O(1)
// Rainbow table resistant: ✅
// Timing attack resistant: ✅
```

---

## 📡 API Communication Algorithm

### RTK Query Caching Strategy

```javascript
// Algorithm: Normalized State + Tag-Based Invalidation

1. DATA FETCHING
   ├── Check cache first (O(1) lookup)
   ├── If cache hit → return cached data
   └── If cache miss → fetch from API

2. CACHE INVALIDATION
   ├── Tag-based system: ['User', 'Blog', 'Comment']
   ├── Mutation invalidates related tags
   └── Automatic re-fetch for stale data

3. OPTIMISTIC UPDATES
   ├── Update UI immediately
   ├── Send request to backend
   └── Rollback on error

// Time Complexity: O(1) for cache operations
// Space Complexity: O(n) where n = cached entities
```

---

## 🗄️ Database Design & Algorithms

### 🔗 Relational Database Schema

```
Normalization Level: 3NF (Third Normal Form)

Key Tables:
├── users (Authentication)
├── userroles (RBAC - Role-Based Access Control)
├── students (Student Management)
├── teachers (Teacher Management)
├── blogs (Content Management)
├── comments (Social Engagement)
├── flagpoleattendance (Attendance Tracking)
├── studentbehaviorscores (Behavior Management)
├── academic_years (Academic Calendar)
└── semesters (Academic Periods)
```

### 📊 Indexing Strategy

```sql
-- Primary Keys: B-Tree Index (O(log n) search)
PRIMARY KEY (id)

-- Foreign Keys: Indexed for JOIN operations
INDEX idx_user_role (roleId)
INDEX idx_blog_author (author)

-- Soft Delete: Boolean index
INDEX idx_deleted (isDeleted)

-- Composite Index for queries
INDEX idx_attendance (date, classRoom, studentId)
```

### 🔍 Query Optimization Algorithms

```javascript
// 1. EAGER LOADING (Prevent N+1 Problem)
await prisma.users.findMany({
  include: {
    userroles: true,      // 1 JOIN instead of N queries
    students: true
  }
});

// Time Complexity: O(n) → One query with JOINs
// vs N+1: O(n²) → Multiple sequential queries

// 2. PAGINATION
await prisma.blogs.findMany({
  skip: (page - 1) * limit,
  take: limit
});

// Time Complexity: O(log n) with proper indexing
// Space Complexity: O(limit)

// 3. FILTERING
await prisma.students.findMany({
  where: {
    classRoom: selectedClass,
    isDeleted: false
  }
});

// Uses composite index: O(log n)
```

---

## 🧮 Business Logic Algorithms

### 1. Attendance Tracking Algorithm

```javascript
// Algorithm: Hash Map for O(1) access

const attendanceRecords = useMemo(() => {
  const records = {};
  
  // Build hash map: O(n)
  existingAttendance.forEach(record => {
    records[record.studentId] = record.statusId;
  });
  
  return records;
}, [existingAttendance]);

// Lookup: O(1)
// Update: O(1)
// Total for n students: O(n)
```

### 2. Behavior Score Calculation

```javascript
// Algorithm: Running Sum + Statistical Analysis

function calculateBehaviorScore(scores) {
  // Time Complexity: O(n)
  const total = scores.reduce((sum, score) => sum + score.points, 0);
  const average = total / scores.length;
  const min = Math.min(...scores.map(s => s.points));
  const max = Math.max(...scores.map(s => s.points));
  
  return { total, average, min, max };
}

// Space Complexity: O(1)
```

### 3. Role-Based Access Control (RBAC)

```javascript
// Algorithm: Role Hierarchy Check

const roleHierarchy = {
  'super_admin': 4,  // Highest privilege
  'admin': 3,
  'teacher': 2,
  'user': 1          // Lowest privilege
};

function hasPermission(userRole, requiredRole) {
  // O(1) lookup
  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
}
```

### 4. Academic Calendar Management

```javascript
// Algorithm: Date Range Calculation

function detectCurrentSemester(academicYears, currentDate) {
  // O(n * m) where n = years, m = semesters per year
  for (const year of academicYears) {
    for (const semester of year.semesters) {
      if (currentDate >= semester.startDate && 
          currentDate <= semester.endDate) {
        return semester; // O(1) return
      }
    }
  }
  return null;
}

// Optimized with indexing: O(log n)
```

### 5. Blog Statistics Algorithm

```javascript
// Algorithm: Group By + Aggregation

const blogStats = useMemo(() => {
  // Monthly grouping: O(n)
  const monthlyData = blogs.reduce((acc, blog) => {
    const month = new Date(blog.createdAt).getMonth();
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {});
  
  // Category grouping: O(n)
  const categoryData = blogs.reduce((acc, blog) => {
    const category = blog.blog_categories?.name;
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {});
  
  return { monthlyData, categoryData };
}, [blogs]);

// Total: O(n)
// Memoized: Only recalculates when blogs change
```

---

## 🎨 Frontend Optimization Algorithms

### 1. Memoization (React.useMemo)

```javascript
// Algorithm: Cached Computation

const expensiveResult = useMemo(() => {
  // Only recalculates when dependencies change
  return complexCalculation(data);
}, [data]);

// Without memo: O(n) on every render
// With memo: O(n) only when data changes
```

### 2. Virtual Scrolling (For Large Lists)

```javascript
// Algorithm: Windowing
// Only render visible items + buffer

const visibleItems = useMemo(() => {
  const start = Math.max(0, scrollTop - bufferSize);
  const end = Math.min(items.length, scrollTop + viewportHeight + bufferSize);
  return items.slice(start, end);
}, [scrollTop, items]);

// Renders only ~20-30 items instead of 1000+
// Time Complexity: O(visible items)
// Memory: O(visible items)
```

### 3. Debouncing (Search Input)

```javascript
// Algorithm: Delay Execution

function debounce(func, delay) {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

const handleSearch = debounce((query) => {
  fetchResults(query);
}, 300);

// Reduces API calls from 10+ to 1 per search
```

---

## 🔄 Data Flow Algorithm

### Request-Response Cycle

```
1. USER ACTION
   └→ onClick/onChange event

2. DISPATCH ACTION
   └→ Redux action creator

3. RTK QUERY
   ├→ Check cache (O(1))
   ├→ If stale, fetch API
   └→ Update store

4. API REQUEST
   ├→ Middleware chain
   ├→ Auth verification
   ├→ Route handler
   └→ Database query

5. DATABASE
   ├→ Index lookup (O(log n))
   ├→ Execute query
   └→ Return results

6. RESPONSE
   ├→ Serialize data
   ├→ Send to frontend
   └→ Update cache

7. UI UPDATE
   ├→ Selector extracts state
   ├→ Component re-renders
   └→ Virtual DOM diff (O(n))
```

---

## ⚡ Performance Optimization Techniques

### 1. **Code Splitting**
```javascript
// Lazy loading routes
const Dashboard = lazy(() => import('./Dashboard'));

// Reduces initial bundle size by ~60%
```

### 2. **Image Optimization**
```javascript
// Lazy loading images
<img loading="lazy" src={imageUrl} />

// Reduces initial page load by ~40%
```

### 3. **Database Connection Pooling**
```javascript
// Prisma connection pool
const prisma = new PrismaClient({
  pool: {
    min: 2,
    max: 10
  }
});

// Reuses connections: O(1) connection overhead
```

### 4. **Caching Strategy**
```
Browser Cache → CDN Cache → Server Cache → Database
(Fastest)                                  (Slowest)
```

---

## 🔒 Security Algorithms

### 1. **CORS Policy**
```javascript
// Whitelist-based origin checking
const allowedOrigins = [
  'http://localhost:5173',
  'https://yourdomain.com'
];

function isOriginAllowed(origin) {
  return allowedOrigins.includes(origin); // O(n)
}

// With Set: O(1) lookup
const originSet = new Set(allowedOrigins);
```

### 2. **Rate Limiting** ✅ (ใช้งานแล้ว — `express-rate-limit`)
```javascript
// Sliding Window Algorithm (express-rate-limit)
// จำกัด Login ล้มเหลว 5 ครั้ง / 30 นาที / IP
// skipSuccessfulRequests: true — นับเฉพาะ request ที่ล้มเหลว
const loginRateLimiter = rateLimit({
  windowMs: 30 * 60 * 1000,
  max: 5,
  skipSuccessfulRequests: true,   // O(1) check per request
  handler: (req, res) => {
    res.status(429).json({ message: 'บัญชีถูกล็อค', retryAfterMinutes });
  }
});

// เมื่อล้มเหลวแต่ยังไม่ครบ → Frontend แสดง "เหลืออีก X ครั้ง"
// เมื่อครบ 5 ครั้ง → Backend ตอบ 429 → Frontend แสดง "ถูกล็อค X นาที"
// Time Complexity: O(1) per request
// Space Complexity: O(unique IPs in window)
```

### 5. **Security Headers — Helmet** ✅ (ใช้งานแล้ว)
```javascript
// index.js — Helmet เพิ่ม HTTP Security Headers อัตโนมัติ
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: false
}));
// ป้องกัน: MIME sniffing, Clickjacking, Downgrade attack, DNS prefetch
// headers เพิ่มเติม: X-Content-Type-Options, X-Frame-Options, HSTS, Referrer-Policy
```

### 6. **Audit Logging (Database)** ✅ (ใช้งานแล้ว)
```javascript
// auth.user.js — createAuditLog helper (fire-and-forget)
// บันทึกทุก action สำคัญลง audit_logs table ผ่าน Prisma
// ❌ ห้าม log password หรือ hashedPassword เด็ดขาด
await createAuditLog({
  actorId: req.user.id,   // ผู้กระทำ
  tableName: 'users',
  recordId: userId,
  action: 'UPDATE',       // CREATE | UPDATE | DELETE
  oldValues: { username: 'old' },
  newValues: { username: 'new' },
  req                     // ดึง ipAddress + userAgent อัตโนมัติ
});
// Scope: register, approve/reject reset, change-password,
//        delete/update/restore user (7 endpoints)
```

### 7. **Winston Security Logging** ✅ (ใช้งานแล้ว)
```javascript
// logger.js — DailyRotateFile (14 วัน, 20MB/ไฟล์, zip archive)
// ทุก error handler ใช้ logger.error แทน console.error
logger.info('LOGIN_SUCCESS',  { event, userId, email, role, ip });
logger.warn('LOGIN_FAILED',   { event, email, reason, ip, remainingAttempts });
logger.info('USER_REGISTERED', { event, userId, email, ip });
logger.info('PASSWORD_CHANGED', { event, userId, ip });
logger.error('LOGIN_ERROR',   { event, error: error.message, stack });
// req.socket?.remoteAddress (Node.js 16+ recommended แทน req.connection)
```
await prisma.users.findMany({
  where: { email: userInput } // Safe: parameterized
});

// VULNERABLE:
// `SELECT * FROM users WHERE email = '${userInput}'`
```

### 4. **XSS Prevention**
```javascript
// React automatically escapes output
<div>{userInput}</div> // Safe

// VULNERABLE:
// <div dangerouslySetInnerHTML={{__html: userInput}} />
```

---

## 📈 Scalability Considerations

### Current Limitations
```
1. No horizontal scaling (single server)
2. No load balancing
3. No database replication
4. File storage on local disk
```

### Recommended Upgrades
```
1. Database:
   ├── Master-Slave replication
   ├── Read replicas for analytics
   └── Sharding for large datasets

2. Backend:
   ├── Multiple Node.js instances
   ├── Load balancer (Nginx)
   └── Message queue (Redis/RabbitMQ)

3. Frontend:
   ├── CDN for static assets
   ├── Server-side rendering (Next.js)
   └── Progressive Web App (PWA)

4. File Storage:
   ├── AWS S3 / Google Cloud Storage
   ├── Image CDN (Cloudinary)
   └── Video streaming (YouTube API)
```

---

## 🧪 Testing Strategy

### Recommended Test Pyramid
```
              /\
             /  \  Unit Tests (70%)
            /────\
           /      \  Integration Tests (20%)
          /────────\
         /          \  E2E Tests (10%)
        /____________\
```

### Unit Testing
```javascript
// Jest + React Testing Library

test('calculates attendance stats correctly', () => {
  const students = [
    { id: 1, status: 'present' },
    { id: 2, status: 'absent' }
  ];
  
  const stats = calculateStats(students);
  
  expect(stats.present).toBe(1);
  expect(stats.absent).toBe(1);
});
```

---

## 📊 Performance Metrics

### Current Performance
```
Time Complexity Analysis:
├── User Login: O(1) - Hash lookup + JWT generation
├── Blog List: O(n) - Linear scan with pagination
├── Attendance Save: O(n) - Batch insert
├── Search: O(n) - Full table scan (needs indexing)
└── Dashboard Stats: O(n) - Aggregation queries

Space Complexity:
├── Redux Store: O(n) - All fetched data
├── Component State: O(m) - Form data
└── API Cache: O(k) - Recent queries
```

### Optimization Potential
```
1. Add full-text search index → O(log n)
2. Implement GraphQL → Reduce over-fetching
3. Add Redis cache → O(1) frequent queries
4. Implement pagination → O(limit) instead of O(n)
```

---

## 🎯 สรุป: Core Algorithms ที่ใช้

| Feature | Algorithm | Complexity |
|---------|-----------|------------|
| Authentication | JWT + bcrypt | O(1) |
| Authorization | RBAC Hierarchy | O(1) |
| Rate Limiting | Sliding Window (express-rate-limit) | O(1) |
| Audit Logging | fire-and-forget DB write | O(1) |
| Security Headers | Helmet middleware | O(1) |
| Database Queries | B-Tree Index | O(log n) |
| API Caching | Hash Map | O(1) |
| Search | Linear Scan | O(n) ⚠️ |
| Attendance | Hash Map | O(1) |
| Statistics | Aggregation | O(n) |
| Rendering | Virtual DOM Diff | O(n) |
| Routing | Trie (React Router) | O(k) |
| State Management | Immutable Updates | O(n) |

### ⚠️ Performance Bottlenecks
1. **Search without index**: O(n) → Add full-text search
2. **No pagination**: Loads all data → Implement virtual scrolling
3. **No caching**: Repeated API calls → Add Redis
4. **File uploads**: Blocking I/O → Use async/stream

---

## 🚀 Recommended Next Steps

### Short-term (1-2 weeks)
1. ✅ เพิ่ม Input Validation (regex + manual — Register, Login)
2. ✅ Implement Rate Limiting (express-rate-limit — 5 ครั้ง/30 นาที/IP)
3. ✅ เพิ่ม Database Indexes (schema.prisma — audit_logs, users)
4. ✅ Setup Error Logging (Winston + DailyRotateFile — log rotation 14 วัน)
5. ✅ Security Headers (Helmet)
6. ✅ Audit Logging (audit_logs table + createAuditLog helper — 7 endpoints)
7. ✅ Token Expiry 2h/7d + Cookie sync
8. ✅ console.error → logger.error ทุก handler (structured JSON logging)

### Medium-term (1-3 months)
1. ⏳ Add Redis caching
2. ⏳ Implement full-text search (Elasticsearch)
3. ⏳ Add unit tests (Jest)
4. ⏳ Setup CI/CD pipeline

### Long-term (3-6 months)
1. 🎯 Microservices architecture
2. 🎯 Kubernetes deployment
3. 🎯 Real-time features (WebSocket)
4. 🎯 Mobile app (React Native)

---

**สร้างเมื่อ**: 3 พฤศจิกายน 2025  
**อัปเดตล่าสุด**: 23 มีนาคม 2026  
**เวอร์ชัน**: 1.3  
**สถานะ**: Production-Ready (Security hardened — rate limiting, audit logging, Helmet, Winston ✅)
