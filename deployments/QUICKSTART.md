# DocuShop Deployment Quick Start

This is a quick start guide to deploy DocuShop in production. For comprehensive documentation, see [DEPLOYMENT.md](DEPLOYMENT.md).

## Prerequisites

- Docker 20.10+
- Docker Compose 2.0+
- 4GB+ RAM
- 20GB+ disk space

## 5-Minute Deployment

### 1. Clone and Navigate

```bash
git clone https://github.com/MASSIVEMAGNETICS/docushop.git
cd docushop
```

### 2. Configure Environment

```bash
# Copy the template
cp deployments/docker/.env.template deployments/docker/.env

# Generate secure keys
export SECRET_KEY=$(openssl rand -hex 32)
export ENCRYPTION_KEY=$(openssl rand -hex 32)
export MONGO_ROOT_PASSWORD=$(openssl rand -base64 24)
export MONGO_APP_PASSWORD=$(openssl rand -base64 24)

# Edit .env with your values
nano deployments/docker/.env
```

**Minimum required settings in `.env`:**
```bash
MONGO_ROOT_USERNAME=admin
MONGO_ROOT_PASSWORD=<your-mongo-root-password>
MONGO_APP_USERNAME=docushop_app
MONGO_APP_PASSWORD=<your-mongo-app-password>
DATABASE_NAME=docushop
SECRET_KEY=<your-secret-key>
ENCRYPTION_KEY=<your-encryption-key>
CORS_ORIGINS=http://localhost,http://your-domain.com
```

### 3. Deploy

```bash
./deployments/scripts/deploy.sh production
```

### 4. Verify

```bash
# Check service health
curl http://localhost/health          # Frontend
curl http://localhost/api/health      # Backend

# View logs
docker compose -f deployments/docker/docker-compose.prod.yml logs -f
```

### 5. Access

- **Frontend**: http://localhost
- **Backend API**: http://localhost/api
- **API Docs**: http://localhost/api/docs

## Common Tasks

### View Logs

```bash
# All services
docker compose -f deployments/docker/docker-compose.prod.yml logs -f

# Specific service
docker compose -f deployments/docker/docker-compose.prod.yml logs -f backend
```

### Restart Services

```bash
docker compose -f deployments/docker/docker-compose.prod.yml restart
```

### Stop Services

```bash
docker compose -f deployments/docker/docker-compose.prod.yml down
```

### Update Application

```bash
# Pull latest images
docker compose -f deployments/docker/docker-compose.prod.yml pull

# Restart
docker compose -f deployments/docker/docker-compose.prod.yml up -d
```

### Backup Database

```bash
./deployments/scripts/backup.sh /path/to/backups
```

### Restore Database

```bash
./deployments/scripts/restore.sh /path/to/backup.tar.gz
```

## SSL/TLS Setup (Optional but Recommended)

### Using Let's Encrypt

```bash
# Install certbot
sudo apt-get install certbot

# Obtain certificate
sudo certbot certonly --standalone -d your-domain.com

# Copy certificates
sudo cp /etc/letsencrypt/live/your-domain.com/fullchain.pem ./certs/
sudo cp /etc/letsencrypt/live/your-domain.com/privkey.pem ./certs/

# Update nginx config
# Uncomment the HTTPS server block in deployments/docker/nginx-prod.conf

# Restart frontend
docker compose -f deployments/docker/docker-compose.prod.yml restart frontend
```

## Production Checklist

Before going live:

- [ ] Change all default passwords
- [ ] Set strong SECRET_KEY and ENCRYPTION_KEY
- [ ] Configure proper CORS_ORIGINS
- [ ] Set up SSL/TLS certificates
- [ ] Configure firewall (allow ports 80, 443)
- [ ] Set up automated backups (cron)
- [ ] Test backup and restore procedures
- [ ] Configure monitoring/alerting
- [ ] Review security headers in nginx
- [ ] Test all critical workflows
- [ ] Document access credentials securely

## Troubleshooting

### Services won't start

```bash
# Check logs
docker compose -f deployments/docker/docker-compose.prod.yml logs

# Verify configuration
docker compose -f deployments/docker/docker-compose.prod.yml config
```

### Database connection errors

```bash
# Check MongoDB status
docker exec docushop-mongodb-prod mongosh --eval "db.adminCommand('ping')"

# Verify credentials in .env file
cat deployments/docker/.env | grep MONGO
```

### Cannot access frontend

```bash
# Check if port 80 is available
sudo lsof -i :80

# Check nginx logs
docker compose -f deployments/docker/docker-compose.prod.yml logs frontend
```

## Getting Help

- [Full Deployment Guide](DEPLOYMENT.md)
- [GitHub Issues](https://github.com/MASSIVEMAGNETICS/docushop/issues)
- [Development Guide](../docs/DEVELOPMENT.md)
- [API Documentation](../docs/API.md)

## Next Steps

1. Review the [Full Deployment Guide](DEPLOYMENT.md)
2. Set up monitoring and logging
3. Configure automated backups
4. Review the [HIPAA Compliance Checklist](../docs/HIPAA_CHECKLIST.md)
5. Test disaster recovery procedures
