#!/bin/bash
# MongoDB Restore Script for DocuShop
# Usage: ./restore.sh <backup_file.tar.gz>

set -e

# Check if backup file is provided
if [ -z "$1" ]; then
  echo "Error: No backup file specified"
  echo "Usage: $0 <backup_file.tar.gz>"
  exit 1
fi

BACKUP_FILE="$1"

# Check if backup file exists
if [ ! -f "${BACKUP_FILE}" ]; then
  echo "Error: Backup file not found: ${BACKUP_FILE}"
  exit 1
fi

# MongoDB connection settings (read from environment or defaults)
MONGO_HOST="${MONGO_HOST:-localhost}"
MONGO_PORT="${MONGO_PORT:-27017}"
MONGO_USERNAME="${MONGO_ROOT_USERNAME:-admin}"
MONGO_PASSWORD="${MONGO_ROOT_PASSWORD:-changeme}"
DATABASE_NAME="${DATABASE_NAME:-docushop}"

echo "Starting restore of DocuShop database..."
echo "Backup file: ${BACKUP_FILE}"

# Create temporary directory for extraction
TEMP_DIR=$(mktemp -d)
trap "rm -rf ${TEMP_DIR}" EXIT

# Extract backup
echo "Extracting backup..."
tar -xzf "${BACKUP_FILE}" -C "${TEMP_DIR}"

# Find the backup directory
BACKUP_DIR=$(find "${TEMP_DIR}" -type d -name "docushop_backup_*" | head -n 1)

if [ -z "${BACKUP_DIR}" ]; then
  echo "Error: Invalid backup file format"
  exit 1
fi

# Confirm restore
read -p "This will replace the current database. Are you sure? (yes/no): " CONFIRM
CONFIRM_LOWER=$(echo "${CONFIRM}" | tr '[:upper:]' '[:lower:]')
if [ "${CONFIRM_LOWER}" != "yes" ] && [ "${CONFIRM_LOWER}" != "y" ]; then
  echo "Restore cancelled."
  exit 0
fi

# Perform restore using mongorestore
echo "Restoring database..."
mongorestore \
  --uri="mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}/admin" \
  --db="${DATABASE_NAME}" \
  --drop \
  "${BACKUP_DIR}/${DATABASE_NAME}"

echo "Restore completed successfully!"
exit 0
