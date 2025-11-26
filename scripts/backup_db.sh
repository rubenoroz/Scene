#!/bin/bash
# Backup the SQLite database before a destructive operation (e.g., prisma migrate reset)
# Usage: ./scripts/backup_db.sh
# It copies the current database file to a timestamped backup in the backups/ directory.

set -e

DB_PATH="prisma/dev.db"
BACKUP_DIR="backups"
mkdir -p "$BACKUP_DIR"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
cp "$DB_PATH" "$BACKUP_DIR/dev_$TIMESTAMP.backup.db"

echo "Database backup created at $BACKUP_DIR/dev_$TIMESTAMP.backup.db"
