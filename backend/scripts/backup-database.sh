#!/bin/bash
# ========================================
# Backup MySQL Database Script (Linux/Mac)
# ========================================

# กำหนดค่าตัวแปร
DB_NAME="eduweb_project"
DB_USER="root"
DB_PASSWORD=""
DB_HOST="localhost"
DB_PORT="3306"
BACKUP_DIR="../backups"

# สร้างชื่อไฟล์ backup ตามวันที่และเวลา
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="$BACKUP_DIR/backup_${DB_NAME}_${TIMESTAMP}.sql"

# สร้างโฟลเดอร์ backups ถ้ายังไม่มี
mkdir -p "$BACKUP_DIR"

echo "========================================"
echo "Starting Database Backup..."
echo "Database: $DB_NAME"
echo "Timestamp: $TIMESTAMP"
echo "========================================"

# Backup database
if [ -z "$DB_PASSWORD" ]; then
    mysqldump -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USER" "$DB_NAME" > "$BACKUP_FILE" 2>&1
else
    mysqldump -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" > "$BACKUP_FILE" 2>&1
fi

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Backup completed successfully!"
    echo "📁 File: $BACKUP_FILE"
    echo ""
    
    # แสดงขนาดไฟล์
    FILE_SIZE=$(ls -lh "$BACKUP_FILE" | awk '{print $5}')
    echo "📊 Size: $FILE_SIZE"
    
    # Compress backup (optional)
    echo ""
    echo "🗜️  Compressing backup..."
    gzip "$BACKUP_FILE"
    echo "✅ Compressed: ${BACKUP_FILE}.gz"
    
    # เก็บ backup เฉพาะ 7 วันล่าสุด
    echo ""
    echo "🗑️  Cleaning old backups (keeping last 7 days)..."
    find "$BACKUP_DIR" -name "backup_*.sql.gz" -mtime +7 -delete
    
else
    echo ""
    echo "❌ Backup failed! Error code: $?"
    echo "Please check:"
    echo "  - MySQL is running"
    echo "  - Database name is correct"
    echo "  - User credentials are correct"
fi

echo ""
echo "========================================"
