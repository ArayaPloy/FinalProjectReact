# ✅ Pre-Reset Checklist

## 📦 Backup Status
- ✅ Database backed up: `backup_20250116_215544.sql` (143 KB)
- ✅ Backup location: `D:\eduWeb-fullstack-mern\backend\`
- ✅ Backup includes ALL current data

## 📝 Seed File Status
- ✅ Original seed data preserved:
  - blog_categories (7)
  - club_categories (7)
  - attendancestatuses (5)
  - academic_years (3)
  - semesters (6)
  - daysofweek (5)
  - departments (10)
  - genders (3)
  - school_info (1)
  - school_timeline (6)
  - teachers (18)
  - userroles (5)
  - users (1 - admin@admin.com)
  - students (from CSV - 153 students)

- ✅ NEW: Exported data added to seed:
  - users (11 additional accounts)
  - blogs (7 real blog posts)
  - comments (3 comments)
  - academicclubs (3 clubs)
  - homevisits (8 home visit records)

## ⚠️ Data That Will Be Lost (Not in Seed)
These tables have data but are NOT included in seed file:
- flagpoleattendance (119 records) - Sample only (20) included
- studentbehaviorscores (69 records) - Sample only (20) included

**Note:** These are attendance/behavior records that can be re-entered if needed.

## 🎯 What Will Happen When Running Reset

```bash
npx prisma migrate reset
```

### Step 1: Drop Database
- MySQL database `eduweb_project` will be dropped
- ALL tables and data will be deleted

### Step 2: Create New Database
- Fresh `eduweb_project` database created
- Clean slate with no tables

### Step 3: Run All Migrations
- Migration: `20251030121056_init`
- Migration: `20251030203017_update_database`
- Migration: `new_migration_add_profile_fields` (if you create it)
- Result: All tables created with correct schema (NO DRIFT!)

### Step 4: Run Seed
- All data from seed.js will be inserted
- Users will be able to login immediately
- Blogs, home visits, clubs will be restored

## 📊 Expected Final State

### Users (12 accounts):
1. admin@admin.com (super_admin) - Password: 12345678
2. admin1@admin.com (admin)
3. admin2@admin.com (admin)
4. admin3@admin.com (admin)
5. Chumnanwit1@gmail.com (admin - ผู้อำนวยการ)
6. pitchaya2@gmail.com (admin - รองผู้อำนวยการ)
7. amon3@gmail.com (teacher - หัวหน้ากลุ่มสาระภาษาไทย)
8. pornsiri4@gmail.com (teacher)
9. kesorn5@gmail.com (teacher - หัวหน้ากลุ่มสาระคณิตศาสตร์)
10. Nutthawut6@gmail.com (teacher)
11. wilailak7@gmail.com (teacher - หัวหน้ากลุ่มสาระวิทยาศาสตร์)
12. surangkana8@gmail.com (teacher)

### Content:
- 7 Blog Posts (real school news)
- 8 Home Visits (real visit records with images)
- 3 Academic Clubs
- 153 Students

### Reference Data:
- All categories, departments, academic years, semesters
- School information and timeline

## 🚀 Ready to Execute?

If everything looks good, run:

```bash
cd backend
npx prisma migrate reset
```

Press `y` when asked to confirm.

## 🔧 After Reset - Next Steps

1. ✅ Verify migration success
   ```bash
   npx prisma migrate status
   ```

2. ✅ Generate Prisma Client
   ```bash
   npx prisma generate
   ```

3. ✅ Test login with admin account
   - Email: admin@admin.com
   - Password: 12345678

4. ✅ Verify data restoration
   - Check blogs exist
   - Check home visits exist
   - Check users can login

5. 🎨 Continue with Profile Page Development
   - Backend: Create profile routes
   - Frontend: Create Profile.jsx component
   - Test profile image upload

## 📞 Restore from Backup (If Needed)

If anything goes wrong, restore from backup:

```bash
mysql -u root -P 3308 eduweb_project < backup_20250116_215544.sql
```

---

**Created:** 2026-01-16
**Backup File:** backup_20250116_215544.sql
**Status:** ✅ READY TO RESET
