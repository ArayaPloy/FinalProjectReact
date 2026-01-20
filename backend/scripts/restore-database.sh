#!/bin/bash

# ==============================================================================
# Database Restore Script (Linux/Mac)
# ==============================================================================
# Purpose: Restore MySQL database from backup file
# Usage: ./restore-database.sh
# ==============================================================================

# Configuration
DB_HOST="localhost"
DB_PORT="3306"
DB_NAME="eduweb_project"
DB_USER="root"
DB_PASS=""  # เปลี่ยนตามของคุณ
BACKUP_DIR="../backups"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# ==============================================================================
# Functions
# ==============================================================================

print_header() {
    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}  Database Restore Script${NC}"
    echo -e "${GREEN}========================================${NC}"
    echo ""
}

list_backups() {
    echo -e "${YELLOW}Available backups:${NC}"
    echo ""
    
    local counter=1
    for file in "$BACKUP_DIR"/*.sql; do
        if [ -f "$file" ]; then
            local size=$(du -h "$file" | cut -f1)
            local date=$(stat -f "%Sm" -t "%Y-%m-%d %H:%M:%S" "$file" 2>/dev/null || stat -c "%y" "$file" | cut -d'.' -f1)
            echo "$counter) $(basename "$file")"
            echo "   Size: $size"
            echo "   Date: $date"
            echo ""
            counter=$((counter+1))
        fi
    done
    
    if [ $counter -eq 1 ]; then
        echo -e "${RED}No backup files found in $BACKUP_DIR${NC}"
        exit 1
    fi
}

confirm_restore() {
    local backup_file=$1
    
    echo -e "${RED}========================================${NC}"
    echo -e "${RED}⚠️  WARNING ⚠️${NC}"
    echo -e "${RED}========================================${NC}"
    echo "This will:"
    echo "  1. DROP the existing database '$DB_NAME'"
    echo "  2. CREATE a new database '$DB_NAME'"
    echo "  3. RESTORE from: $(basename "$backup_file")"
    echo ""
    echo -e "${RED}All current data will be LOST!${NC}"
    echo ""
    
    read -p "Are you sure you want to continue? (yes/no): " response
    
    if [ "$response" != "yes" ]; then
        echo -e "${YELLOW}Restore cancelled.${NC}"
        exit 0
    fi
}

restore_database() {
    local backup_file=$1
    
    echo ""
    echo -e "${YELLOW}Starting restore process...${NC}"
    echo ""
    
    # Drop database
    echo "1. Dropping existing database..."
    if [ -z "$DB_PASS" ]; then
        mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -e "DROP DATABASE IF EXISTS $DB_NAME;"
    else
        mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASS" -e "DROP DATABASE IF EXISTS $DB_NAME;"
    fi
    
    if [ $? -ne 0 ]; then
        echo -e "${RED}Failed to drop database!${NC}"
        exit 1
    fi
    echo -e "${GREEN}✓ Database dropped${NC}"
    
    # Create database
    echo "2. Creating new database..."
    if [ -z "$DB_PASS" ]; then
        mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -e "CREATE DATABASE $DB_NAME CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
    else
        mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASS" -e "CREATE DATABASE $DB_NAME CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
    fi
    
    if [ $? -ne 0 ]; then
        echo -e "${RED}Failed to create database!${NC}"
        exit 1
    fi
    echo -e "${GREEN}✓ Database created${NC}"
    
    # Import backup
    echo "3. Restoring from backup..."
    if [ -z "$DB_PASS" ]; then
        mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" "$DB_NAME" < "$backup_file"
    else
        mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" < "$backup_file"
    fi
    
    if [ $? -ne 0 ]; then
        echo -e "${RED}Failed to restore backup!${NC}"
        exit 1
    fi
    echo -e "${GREEN}✓ Backup restored${NC}"
    
    echo ""
    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}✓ Restore completed successfully!${NC}"
    echo -e "${GREEN}========================================${NC}"
    echo ""
    echo "Database: $DB_NAME"
    echo "Restored from: $(basename "$backup_file")"
    echo ""
}

# ==============================================================================
# Main Script
# ==============================================================================

print_header

# Check if backup directory exists
if [ ! -d "$BACKUP_DIR" ]; then
    echo -e "${RED}Backup directory not found: $BACKUP_DIR${NC}"
    exit 1
fi

# List available backups
list_backups

# Get user selection
read -p "Select backup number to restore: " selection

# Get the selected file
counter=1
selected_file=""
for file in "$BACKUP_DIR"/*.sql; do
    if [ -f "$file" ]; then
        if [ $counter -eq $selection ]; then
            selected_file=$file
            break
        fi
        counter=$((counter+1))
    fi
done

# Validate selection
if [ -z "$selected_file" ]; then
    echo -e "${RED}Invalid selection!${NC}"
    exit 1
fi

# Confirm and restore
confirm_restore "$selected_file"
restore_database "$selected_file"

exit 0
