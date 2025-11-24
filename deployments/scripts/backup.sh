#!/bin/bash
# MongoDB Backup Script for DocuShop
# Usage: ./backup.sh [backup_dir]

set -e

# Configuration
BACKUP_DIR="${1:-./backups}"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_NAME="docushop_backup_${TIMESTAMP}"
BACKUP_PATH="${BACKUP_DIR}/${BACKUP_NAME}"

# MongoDB connection settings (read from environment or defaults)
MONGO_HOST="${MONGO_HOST:-localhost}"
MONGO_PORT="${MONGO_PORT:-27017}"
MONGO_USERNAME="${MONGO_ROOT_USERNAME:-admin}"
MONGO_PASSWORD="${MONGO_ROOT_PASSWORD:-changeme}"
DATABASE_NAME="${DATABASE_NAME:-docushop}"

echo "Starting backup of DocuShop database..."
echo "Backup location: ${BACKUP_PATH}"

# Create backup directory if it doesn't exist
mkdir -p "${BACKUP_DIR}"

# Perform backup using mongodump
mongodump \
  --host="${MONGO_HOST}" \
  --port="${MONGO_PORT}" \
  --username="${MONGO_USERNAME}" \
  --password="${MONGO_PASSWORD}" \
  --authenticationDatabase=admin \
  --db="${DATABASE_NAME}" \
  --out="${BACKUP_PATH}"

# Compress the backup
echo "Compressing backup..."
tar -czf "${BACKUP_PATH}.tar.gz" -C "${BACKUP_DIR}" "${BACKUP_NAME}"
rm -rf "${BACKUP_PATH}"

echo "Backup completed successfully!"
echo "Backup file: ${BACKUP_PATH}.tar.gz"
echo "Backup size: $(du -h ${BACKUP_PATH}.tar.gz | cut -f1)"

# Clean up old backups (keep last 30 days by default)
RETENTION_DAYS="${BACKUP_RETENTION_DAYS:-30}"
echo "Cleaning up backups older than ${RETENTION_DAYS} days..."
find "${BACKUP_DIR}" -name "docushop_backup_*.tar.gz" -mtime +${RETENTION_DAYS} -delete
echo "Cleanup completed."

exit 0
