# DocuShop Deployments

This directory contains all deployment configurations and scripts for DocuShop.

## Directory Structure

```
deployments/
├── docker/
│   ├── docker-compose.prod.yml   # Production Docker Compose configuration
│   ├── .env.template              # Environment variables template
│   └── nginx-prod.conf            # Production nginx configuration
├── kubernetes/                    # Kubernetes manifests (future)
├── scripts/
│   ├── deploy.sh                  # Main deployment script
│   ├── backup.sh                  # Database backup script
│   ├── restore.sh                 # Database restore script
│   └── mongo-init.js              # MongoDB initialization script
└── DEPLOYMENT.md                  # Comprehensive deployment guide

## Quick Start

### Production Deployment

1. **Copy and configure environment variables**:
   ```bash
   cp docker/.env.template docker/.env
   nano docker/.env  # Edit with your values
   ```

2. **Run the deployment script**:
   ```bash
   ./scripts/deploy.sh production
   ```

3. **Verify deployment**:
   ```bash
   curl http://localhost/health
   curl http://localhost/api/health
   ```

## Deployment Options

### Option 1: Using Deployment Script (Recommended)

```bash
./scripts/deploy.sh production
```

This script:
- Pulls latest Docker images
- Stops existing containers
- Starts new containers
- Waits for health checks
- Displays service status

### Option 2: Manual Docker Compose

```bash
cd docker
docker compose -f docker-compose.prod.yml up -d
```

### Option 3: Using GitHub Container Registry

Pull pre-built images:

```bash
docker pull ghcr.io/massivemagnetics/docushop/backend:latest
docker pull ghcr.io/massivemagnetics/docushop/frontend:latest
```

## Environment Configuration

### Minimal Configuration

Required environment variables in `.env`:

```bash
# Database
MONGO_ROOT_PASSWORD=<strong-password>
MONGO_APP_PASSWORD=<strong-password>

# Security
SECRET_KEY=<32-char-hex>
ENCRYPTION_KEY=<32-char-hex>

# Domain
CORS_ORIGINS=https://your-domain.com
```

Generate secure keys:
```bash
openssl rand -hex 32
```

### Full Configuration

See `docker/.env.template` for all available options including:
- S3 storage settings
- Email/SMTP configuration
- Logging levels
- Health check intervals

## Backup and Restore

### Create Backup

```bash
./scripts/backup.sh /path/to/backups
```

Output: `docushop_backup_YYYYMMDD_HHMMSS.tar.gz`

### Restore from Backup

```bash
./scripts/restore.sh /path/to/backups/docushop_backup_20241124_020000.tar.gz
```

### Automated Backups

Schedule daily backups with cron:

```bash
crontab -e

# Add:
0 2 * * * /path/to/docushop/deployments/scripts/backup.sh /backups
```

## Monitoring

### Check Service Health

```bash
# All services
docker compose -f docker/docker-compose.prod.yml ps

# Individual health checks
curl http://localhost/health          # Frontend
curl http://localhost/api/health      # Backend
```

### View Logs

```bash
# All services
docker compose -f docker/docker-compose.prod.yml logs -f

# Specific service
docker compose -f docker/docker-compose.prod.yml logs -f backend
```

### Resource Usage

```bash
docker stats
```

## Updating

### Update to Latest Version

```bash
# Pull latest images
docker compose -f docker/docker-compose.prod.yml pull

# Restart services
docker compose -f docker/docker-compose.prod.yml up -d

# Clean up old images
docker image prune -f
```

## Security Considerations

### Production Checklist

- [ ] Change all default passwords
- [ ] Configure SSL/TLS certificates
- [ ] Set up firewall rules
- [ ] Enable HTTPS redirect
- [ ] Configure CORS origins
- [ ] Set strong SECRET_KEY and ENCRYPTION_KEY
- [ ] Restrict MongoDB port to localhost only
- [ ] Set up automated backups
- [ ] Enable audit logging
- [ ] Configure rate limiting (nginx)

### SSL/TLS Setup

1. Obtain certificates (Let's Encrypt):
   ```bash
   sudo certbot certonly --standalone -d your-domain.com
   ```

2. Copy certificates:
   ```bash
   sudo cp /etc/letsencrypt/live/your-domain.com/*.pem ./certs/
   ```

3. Update `nginx-prod.conf` with your domain and uncomment HTTPS block

4. Restart frontend:
   ```bash
   docker compose -f docker/docker-compose.prod.yml restart frontend
   ```

## Troubleshooting

### Services Won't Start

```bash
# Check logs
docker compose -f docker/docker-compose.prod.yml logs

# Check configuration
docker compose -f docker/docker-compose.prod.yml config

# Remove and recreate
docker compose -f docker/docker-compose.prod.yml down
docker compose -f docker/docker-compose.prod.yml up -d
```

### Database Connection Issues

```bash
# Check MongoDB status
docker exec docushop-mongodb-prod mongosh --eval "db.adminCommand('ping')"

# Check credentials
docker exec docushop-backend-prod env | grep MONGODB_URL
```

### High Memory Usage

```bash
# Check resource usage
docker stats

# Limit MongoDB memory
# Add to docker-compose.prod.yml under mongodb service:
# mem_limit: 2g
```

## Additional Documentation

- [Full Deployment Guide](DEPLOYMENT.md) - Comprehensive deployment instructions
- [API Documentation](../docs/API.md) - API reference
- [Development Guide](../docs/DEVELOPMENT.md) - Development setup
- [HIPAA Checklist](../docs/HIPAA_CHECKLIST.md) - Compliance requirements

## Support

For deployment issues:

1. Check the [Deployment Guide](DEPLOYMENT.md)
2. Review service logs
3. Open an issue on GitHub
4. Contact the development team

## CI/CD

GitHub Actions workflows are configured in `.github/workflows/`:

- `backend-ci.yml` - Backend build and test
- `frontend-ci.yml` - Frontend build and test  
- `docker-build.yml` - Docker image build and push

Images are automatically built and pushed to GitHub Container Registry on:
- Push to `main` branch
- Tagged releases (v*)

## License

Proprietary - All rights reserved
