#!/bin/bash

# Path to the backup script
BACKUP_SCRIPT="/mnt/c/Users/pavan/Desktop/srilaxmi-devops/scripts/backup.sh"

# Make the backup script executable
chmod +x "$BACKUP_SCRIPT"

# Define the cron job (runs every night at 2:00 AM)
CRON_JOB="0 2 * * * /bin/bash $BACKUP_SCRIPT >> /mnt/c/Users/pavan/Desktop/srilaxmi-devops/backups/backup.log 2>&1"

# Check if the cron job already exists to avoid duplicates
if crontab -l 2>/dev/null | grep -Fq "$BACKUP_SCRIPT"; then
  echo "Cron job already exists. Skipping installation."
else
  # Add the cron job to the user's crontab
  (crontab -l 2>/dev/null; echo "$CRON_JOB") | crontab -
  echo "Nightly cron job successfully installed to run at 2:00 AM."
fi
