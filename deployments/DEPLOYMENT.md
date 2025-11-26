# DocuShop Deployment Guide

This guide provides comprehensive instructions for deploying DocuShop in various environments.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Deployment Methods](#deployment-methods)
3. [Production Deployment](#production-deployment)
4. [Environment Configuration](#environment-configuration)
5. [Database Setup](#database-setup)
6. [SSL/TLS Configuration](#ssltls-configuration)
7. [Monitoring and Maintenance](#monitoring-and-maintenance)
8. [Backup and Restore](#backup-and-restore)
9. [Troubleshooting](#troubleshooting)

## Prerequisites

### System Requirements

- **OS**: Linux (Ubuntu 20.04+ recommended), macOS, or Windows with WSL2
- **CPU**: 2+ cores
- **RAM**: 4GB minimum, 8GB recommended
- **Storage**: 20GB minimum, 50GB+ recommended for production
- **Docker**: Version 20.10+
- **Docker Compose**: Version 2.0+

### Required Tools

```bash
# Install Docker (Ubuntu/Debian)
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo apt-get update
sudo apt-get install docker-compose-plugin

# Verify installation
docker --version
docker compose version
```

## Deployment Methods

DocuShop supports multiple deployment methods:

1. **Docker Compose** (Recommended for single-server deployments)
2. **Kubernetes** (For production clusters)
3. **Manual Deployment** (For development or custom setups)

## Production Deployment

### Quick Start

1. **Clone the repository**

```bash
git clone https://github.com/MASSIVEMAGNETICS/docushop.git
cd docushop
```

2. **Configure environment**

```bash
# Copy the environment template
cp deployments/docker/.env.template deployments/docker/.env

# Edit the .env file with your production values
nano deployments/docker/.env
```

3. **Deploy using the deployment script**

```bash
./deployments/scripts/deploy.sh production
```

### Manual Deployment Steps

If you prefer to deploy manually:

```bash
# Navigate to the deployment directory
cd deployments/docker

# Pull latest images (if using GitHub Container Registry)
docker compose -f docker-compose.prod.yml pull

# Start the services
docker compose -f docker-compose.prod.yml up -d

# Check service status
docker compose -f docker-compose.prod.yml ps

# View logs
docker compose -f docker-compose.prod.yml logs -f
```

## Environment Configuration

### Required Environment Variables

Edit `deployments/docker/.env` and configure the following:

#### Database Configuration

```bash
MONGO_ROOT_USERNAME=admin
MONGO_ROOT_PASSWORD=your-strong-password-here
MONGO_APP_USERNAME=docushop_app
MONGO_APP_PASSWORD=your-app-password-here
DATABASE_NAME=docushop
```

**Security Note**: Use strong, randomly generated passwords. Example:
```bash
openssl rand -base64 32
```

#### Application Security

```bash
# Generate a secret key
SECRET_KEY=$(openssl rand -hex 32)
ENCRYPTION_KEY=$(openssl rand -hex 32)
```

#### CORS Configuration

```bash
# Add your domain(s)
CORS_ORIGINS=https://docushop.yourdomain.com,https://www.docushop.yourdomain.com
```

#### S3 Storage (Optional)

```bash
S3_ENDPOINT=https://s3.amazonaws.com
S3_ACCESS_KEY=your-access-key
S3_SECRET_KEY=your-secret-key
S3_BUCKET=docushop-documents
S3_REGION=us-east-1
```

## Database Setup

### Initialize Database

The database is automatically initialized on first run using the `mongo-init.js` script. This script:

- Creates the application database
- Creates the application user with appropriate permissions
- Sets up collections with validation rules
- Creates indexes for performance

### Manual Database Initialization

If you need to manually initialize:

```bash
docker exec -it docushop-mongodb-prod mongosh -u admin -p

# In mongosh shell:
use docushop
db.createUser({
  user: "docushop_app",
  pwd: "your-password",
  roles: [{role: "readWrite", db: "docushop"}]
})
```

## SSL/TLS Configuration

### Using Let's Encrypt

1. **Install Certbot**

```bash
sudo apt-get install certbot
```

2. **Obtain SSL Certificate**

```bash
sudo certbot certonly --standalone -d docushop.yourdomain.com
```

3. **Copy Certificates**

```bash
sudo mkdir -p /path/to/docushop/certs
sudo cp /etc/letsencrypt/live/docushop.yourdomain.com/fullchain.pem /path/to/docushop/certs/
sudo cp /etc/letsencrypt/live/docushop.yourdomain.com/privkey.pem /path/to/docushop/certs/
```

4. **Update nginx configuration**

Edit `deployments/docker/nginx-prod.conf` and uncomment the HTTPS server block. Update the `server_name` directive with your domain.

5. **Restart services**

```bash
docker compose -f deployments/docker/docker-compose.prod.yml restart frontend
```

### Certificate Renewal

Set up auto-renewal with cron:

```bash
sudo crontab -e

# Add this line:
0 0 * * * certbot renew --quiet && docker compose -f /path/to/docushop/deployments/docker/docker-compose.prod.yml restart frontend
```

## Monitoring and Maintenance

### Health Checks

Check service health:

```bash
# Frontend health
curl http://localhost/health

# Backend health
curl http://localhost/api/health

# Database health
docker exec docushop-mongodb-prod mongosh --eval "db.adminCommand('ping')"
```

### Viewing Logs

```bash
# All services
docker compose -f deployments/docker/docker-compose.prod.yml logs -f

# Specific service
docker compose -f deployments/docker/docker-compose.prod.yml logs -f backend
docker compose -f deployments/docker/docker-compose.prod.yml logs -f frontend
docker compose -f deployments/docker/docker-compose.prod.yml logs -f mongodb
```

### Resource Monitoring

```bash
# View container resource usage
docker stats

# View disk usage
docker system df
```

### Updating the Application

```bash
# Pull latest images
docker compose -f deployments/docker/docker-compose.prod.yml pull

# Restart services
docker compose -f deployments/docker/docker-compose.prod.yml up -d

# Remove old images
docker image prune -f
```

## Backup and Restore

### Automated Backups

Set up automated backups with cron:

```bash
# Edit crontab
crontab -e

# Add daily backup at 2 AM
0 2 * * * /path/to/docushop/deployments/scripts/backup.sh /path/to/backups
```

### Manual Backup

```bash
./deployments/scripts/backup.sh /path/to/backups
```

This creates a compressed backup in the format: `docushop_backup_YYYYMMDD_HHMMSS.tar.gz`

### Restore from Backup

```bash
./deployments/scripts/restore.sh /path/to/backups/docushop_backup_20241124_020000.tar.gz
```

**Warning**: This will replace the current database!

### Backup Best Practices

1. **Regular Backups**: Schedule daily backups
2. **Off-site Storage**: Store backups in a different location
3. **Test Restores**: Regularly test backup restoration
4. **Retention Policy**: Keep backups for 30+ days
5. **Encryption**: Encrypt backups containing PHI/PII

## Troubleshooting

### Common Issues

#### 1. Services Not Starting

```bash
# Check logs
docker compose -f deployments/docker/docker-compose.prod.yml logs

# Check service status
docker compose -f deployments/docker/docker-compose.prod.yml ps

# Restart services
docker compose -f deployments/docker/docker-compose.prod.yml restart
```

#### 2. Database Connection Issues

```bash
# Check MongoDB logs
docker compose -f deployments/docker/docker-compose.prod.yml logs mongodb

# Test connection
docker exec -it docushop-mongodb-prod mongosh -u admin -p
```

#### 3. Frontend Not Loading

```bash
# Check nginx logs
docker compose -f deployments/docker/docker-compose.prod.yml logs frontend

# Verify nginx configuration
docker exec docushop-frontend-prod nginx -t
```

#### 4. Backend API Errors

```bash
# Check backend logs
docker compose -f deployments/docker/docker-compose.prod.yml logs backend

# Check environment variables
docker exec docushop-backend-prod env | grep -E "(MONGODB|SECRET|DATABASE)"
```

#### 5. Permission Issues

```bash
# Fix volume permissions
sudo chown -R $USER:$USER /var/lib/docker/volumes/docushop_*
```

### Performance Tuning

#### MongoDB Optimization

```javascript
// In mongosh
use docushop

// Check slow queries
db.system.profile.find().limit(10).sort({ts:-1}).pretty()

// Analyze query performance
db.templates.explain("executionStats").find({org_id: "org-123"})
```

#### Nginx Optimization

Edit `nginx-prod.conf` to adjust:
- Worker processes
- Worker connections
- Buffer sizes
- Keepalive timeout

### Security Hardening

1. **Change Default Ports**
   - Use non-standard ports for MongoDB
   - Use a reverse proxy for the frontend

2. **Firewall Configuration**
   ```bash
   sudo ufw allow 80/tcp
   sudo ufw allow 443/tcp
   sudo ufw enable
   ```

3. **Regular Updates**
   ```bash
   # Update base images
   docker compose -f deployments/docker/docker-compose.prod.yml pull
   docker compose -f deployments/docker/docker-compose.prod.yml up -d
   ```

4. **Audit Logs**
   - Monitor audit logs in the database
   - Set up alerts for suspicious activity

## Support

For issues or questions:

- **GitHub Issues**: https://github.com/MASSIVEMAGNETICS/docushop/issues
- **Documentation**: See `docs/` directory
- **Security Issues**: Contact security team directly

## Additional Resources

- [API Documentation](../docs/API.md)
- [Development Guide](../docs/DEVELOPMENT.md)
- [HIPAA Compliance](../docs/HIPAA_CHECKLIST.md)
- [Contributing Guide](../CONTRIBUTING.md)
