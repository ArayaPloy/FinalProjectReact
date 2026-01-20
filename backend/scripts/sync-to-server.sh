#!/bin/bash

# ==============================================================================
# Database Sync Script (Localhost → Server)
# ==============================================================================
# Purpose: Sync database from localhost to remote server
# Usage: ./sync-to-server.sh
# ==============================================================================

# Configuration
LOCAL_DB_HOST="localhost"
LOCAL_DB_PORT="3308"  # XAMPP port
LOCAL_DB_NAME="eduweb_project"
LOCAL_DB_USER="root"
LOCAL_DB_PASS=""

REMOTE_DB_HOST="192.168.1.24"
REMOTE_DB_PORT="3306"
REMOTE_DB_NAME="eduweb_project"
REMOTE_DB_USER="root"
REMOTE_DB_PASS=""

REMOTE_SSH_USER="username"  # เปลี่ยนเป็น SSH username ของคุณ
REMOTE_BACKUP_DIR="/tmp"
LOCAL_BACKUP_DIR="../backups"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# ==============================================================================
# Functions
# ==============================================================================

print_header() {
    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}  Database Sync Script${NC}"
    echo -e "${GREEN}  Localhost → Server${NC}"
    echo -e "${GREEN}========================================${NC}"
    echo ""
}

confirm_sync() {
    echo -e "${YELLOW}========================================${NC}"
    echo -e "${YELLOW}⚠️  IMPORTANT ⚠️${NC}"
    echo -e "${YELLOW}========================================${NC}"
    echo "This will:"
    echo "  1. Backup database from localhost:$LOCAL_DB_PORT"
    echo "  2. Upload to server at $REMOTE_DB_HOST"
    echo "  3. Restore on server (REPLACING all data)"
    echo ""
    echo "Source: $LOCAL_DB_NAME @ localhost:$LOCAL_DB_PORT"
    echo "Target: $REMOTE_DB_NAME @ $REMOTE_DB_HOST:$REMOTE_DB_PORT"
    echo ""
    echo -e "${RED}All data on the server will be REPLACED!${NC}"
    echo ""
    
    read -p "Continue? (yes/no): " response
    
    if [ "$response" != "yes" ]; then
        echo -e "${YELLOW}Sync cancelled.${NC}"
        exit 0
    fi
}

step1_backup_local() {
    echo ""
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}Step 1: Backup Local Database${NC}"
    echo -e "${BLUE}========================================${NC}"
    echo ""
    
    local timestamp=$(date +%Y%m%d_%H%M%S)
    local backup_file="$LOCAL_BACKUP_DIR/sync_backup_$timestamp.sql"
    
    # Create backup directory if not exists
    mkdir -p "$LOCAL_BACKUP_DIR"
    
    echo "Creating backup from localhost:$LOCAL_DB_PORT..."
    
    if [ -z "$LOCAL_DB_PASS" ]; then
        mysqldump -h "$LOCAL_DB_HOST" -P "$LOCAL_DB_PORT" -u "$LOCAL_DB_USER" \
            --single-transaction \
            --routines \
            --triggers \
            --events \
            "$LOCAL_DB_NAME" > "$backup_file"
    else
        mysqldump -h "$LOCAL_DB_HOST" -P "$LOCAL_DB_PORT" -u "$LOCAL_DB_USER" -p"$LOCAL_DB_PASS" \
            --single-transaction \
            --routines \
            --triggers \
            --events \
            "$LOCAL_DB_NAME" > "$backup_file"
    fi
    
    if [ $? -ne 0 ]; then
        echo -e "${RED}Failed to create backup!${NC}"
        exit 1
    fi
    
    local size=$(du -h "$backup_file" | cut -f1)
    echo -e "${GREEN}✓ Backup created: $(basename "$backup_file") ($size)${NC}"
    echo "$backup_file"
}

step2_upload_to_server() {
    local backup_file=$1
    local remote_file="$REMOTE_BACKUP_DIR/$(basename "$backup_file")"
    
    echo ""
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}Step 2: Upload to Server${NC}"
    echo -e "${BLUE}========================================${NC}"
    echo ""
    
    echo "Uploading to $REMOTE_DB_HOST..."
    
    # Check if SSH key is set up
    if ssh -o BatchMode=yes -o ConnectTimeout=5 "$REMOTE_SSH_USER@$REMOTE_DB_HOST" true 2>/dev/null; then
        # SSH key exists, use SCP
        scp "$backup_file" "$REMOTE_SSH_USER@$REMOTE_DB_HOST:$remote_file"
        
        if [ $? -ne 0 ]; then
            echo -e "${RED}Failed to upload!${NC}"
            exit 1
        fi
        
        echo -e "${GREEN}✓ File uploaded successfully${NC}"
        echo "$remote_file"
    else
        # No SSH key, provide manual instructions
        echo -e "${YELLOW}SSH key not configured. Manual upload required.${NC}"
        echo ""
        echo "Option 1: Use SCP with password:"
        echo "  scp \"$backup_file\" $REMOTE_SSH_USER@$REMOTE_DB_HOST:$remote_file"
        echo ""
        echo "Option 2: Use SFTP/FileZilla:"
        echo "  1. Connect to $REMOTE_DB_HOST"
        echo "  2. Upload: $backup_file"
        echo "  3. To: $remote_file"
        echo ""
        
        read -p "Press Enter after you've uploaded the file manually..."
        echo "$remote_file"
    fi
}

step3_restore_on_server() {
    local remote_file=$1
    
    echo ""
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}Step 3: Restore on Server${NC}"
    echo -e "${BLUE}========================================${NC}"
    echo ""
    
    echo "Connecting to server and restoring database..."
    
    # Create restore commands
    local restore_commands="
        echo 'Dropping existing database...'
        mysql -h localhost -P $REMOTE_DB_PORT -u $REMOTE_DB_USER -p'$REMOTE_DB_PASS' -e 'DROP DATABASE IF EXISTS $REMOTE_DB_NAME;'
        
        echo 'Creating new database...'
        mysql -h localhost -P $REMOTE_DB_PORT -u $REMOTE_DB_USER -p'$REMOTE_DB_PASS' -e 'CREATE DATABASE $REMOTE_DB_NAME CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;'
        
        echo 'Restoring from backup...'
        mysql -h localhost -P $REMOTE_DB_PORT -u $REMOTE_DB_USER -p'$REMOTE_DB_PASS' $REMOTE_DB_NAME < $remote_file
        
        echo 'Cleaning up...'
        rm $remote_file
        
        echo 'Done!'
    "
    
    # Check if SSH key is set up
    if ssh -o BatchMode=yes -o ConnectTimeout=5 "$REMOTE_SSH_USER@$REMOTE_DB_HOST" true 2>/dev/null; then
        # SSH key exists, execute remotely
        ssh "$REMOTE_SSH_USER@$REMOTE_DB_HOST" "$restore_commands"
        
        if [ $? -ne 0 ]; then
            echo -e "${RED}Failed to restore on server!${NC}"
            exit 1
        fi
        
        echo -e "${GREEN}✓ Database restored successfully${NC}"
    else
        # No SSH key, provide manual instructions
        echo -e "${YELLOW}SSH key not configured. Manual restore required.${NC}"
        echo ""
        echo "Execute these commands on the server:"
        echo "--------------------------------------"
        echo "# Drop existing database"
        echo "mysql -h localhost -P $REMOTE_DB_PORT -u $REMOTE_DB_USER -p -e \"DROP DATABASE IF EXISTS $REMOTE_DB_NAME;\""
        echo ""
        echo "# Create new database"
        echo "mysql -h localhost -P $REMOTE_DB_PORT -u $REMOTE_DB_USER -p -e \"CREATE DATABASE $REMOTE_DB_NAME CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;\""
        echo ""
        echo "# Restore from backup"
        echo "mysql -h localhost -P $REMOTE_DB_PORT -u $REMOTE_DB_USER -p $REMOTE_DB_NAME < $remote_file"
        echo ""
        echo "# Clean up"
        echo "rm $remote_file"
        echo "--------------------------------------"
        echo ""
        
        read -p "Press Enter after you've restored the database..."
    fi
}

cleanup_local() {
    local backup_file=$1
    
    echo ""
    echo -e "${YELLOW}Cleanup:${NC}"
    read -p "Delete local backup file? (yes/no): " response
    
    if [ "$response" = "yes" ]; then
        rm "$backup_file"
        echo -e "${GREEN}✓ Local backup deleted${NC}"
    else
        echo "Local backup kept: $backup_file"
    fi
}

# ==============================================================================
# Main Script
# ==============================================================================

print_header
confirm_sync

# Execute sync steps
backup_file=$(step1_backup_local)
remote_file=$(step2_upload_to_server "$backup_file")
step3_restore_on_server "$remote_file"

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}✓ Sync completed successfully!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "Database '$REMOTE_DB_NAME' on $REMOTE_DB_HOST has been updated"
echo "with data from localhost:$LOCAL_DB_PORT"
echo ""

cleanup_local "$backup_file"

exit 0
