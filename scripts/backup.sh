#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Configuration
DB_CONTAINER_NAME="srilaxmi-db"
DB_USER="postgres"
DB_DATABASE="srilaxmi"
BACKUP_DIR="/mnt/c/Users/pavan/Desktop/srilaxmi-devops/backups"
S3_BUCKET="srilaxmi-db-backups-pavan" # Change to match your S3 backup bucket name
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="$BACKUP_DIR/db_backup_$TIMESTAMP.sql.gz"

echo "=== starting database backup ==="

# Create local backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Run pg_dump inside the docker container and compress it
echo "Backing up database '$DB_DATABASE' from container '$DB_CONTAINER_NAME'..."
docker exec "$DB_CONTAINER_NAME" pg_dump -U "$DB_USER" -d "$DB_DATABASE" | gzip > "$BACKUP_FILE"

echo "Backup created locally: $BACKUP_FILE"

# Upload to S3 if AWS CLI is configured
if aws s3 ls "s3://$S3_BUCKET" >/dev/null 2>&1; then
  echo "Uploading backup to AWS S3 bucket 's3://$S3_BUCKET'..."
  aws s3 cp "$BACKUP_FILE" "s3://$S3_BUCKET/db_backups/db_backup_$TIMESTAMP.sql.gz"
  echo "S3 Upload complete."
else
  echo "AWS S3: S3 bucket not reachable or credentials missing. Skipping S3 upload."
fi

# Clean up local backups older than 7 days
echo "Cleaning up local backups older than 7 days..."
find "$BACKUP_DIR" -type f -name "db_backup_*.sql.gz" -mtime +7 -delete
echo "Cleanup complete."

echo "=== database backup finished successfully ==="
