# Deployment Testing Guide

This guide provides step-by-step instructions for testing DocuShop deployment.

## Pre-Deployment Testing

### 1. Verify Prerequisites

```bash
# Run verification script
./deployments/scripts/verify-deployment.sh
```

Expected output: All checks should pass (✓)

### 2. Validate Configuration Files

```bash
# Validate Docker Compose
docker compose -f deployments/docker/docker-compose.prod.yml config

# Check .env file exists
test -f deployments/docker/.env && echo "✓ .env exists" || echo "✗ .env missing"
```

## Deployment Testing

### 1. Deploy Application

```bash
./deployments/scripts/deploy.sh production
```

Expected: All services start successfully and become healthy.

### 2. Service Health Checks

```bash
# Frontend health
curl -f http://localhost/health
# Expected: HTTP 200, "healthy"

# Backend health
curl -f http://localhost/api/health
# Expected: HTTP 200, {"status": "healthy"}

# MongoDB health
docker exec docushop-mongodb-prod mongosh --eval "db.adminCommand('ping')"
# Expected: { ok: 1 }
```

### 3. Service Connectivity

```bash
# Check all services are running
docker compose -f deployments/docker/docker-compose.prod.yml ps

# Expected output:
# NAME                       STATUS         PORTS
# docushop-backend-prod      Up (healthy)   127.0.0.1:8000->8000/tcp
# docushop-frontend-prod     Up (healthy)   0.0.0.0:80->80/tcp
# docushop-mongodb-prod      Up (healthy)   127.0.0.1:27017->27017/tcp
```

### 4. API Documentation Access

```bash
# Check API docs are accessible
curl -f http://localhost/api/docs
# Expected: HTTP 200, HTML response

# Test root endpoint
curl http://localhost/api/
# Expected: {"name": "DocuShop", "version": "1.0.0", ...}
```

### 5. Database Connection Test

```bash
# Test backend can connect to MongoDB
docker compose -f deployments/docker/docker-compose.prod.yml logs backend | grep -i "connected to mongodb"

# List databases
docker exec docushop-mongodb-prod mongosh -u admin -p "${MONGO_ROOT_PASSWORD}" --authenticationDatabase admin --eval "db.adminCommand('listDatabases')"
# Expected: docushop database should exist
```

## Functional Testing

### 1. Authentication Endpoint

```bash
# Test login endpoint (should fail without valid credentials)
curl -X POST http://localhost/api/auth/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=test&password=test"

# Expected: HTTP 401 or 422 (invalid credentials)
```

### 2. Organizations Endpoint

```bash
# Test organizations list (may require auth)
curl http://localhost/api/orgs
```

### 3. CORS Headers

```bash
# Check CORS headers
curl -I http://localhost/api/ -H "Origin: http://localhost"
# Expected: Access-Control-Allow-Origin header present
```

### 4. Static Assets

```bash
# Check frontend loads
curl -I http://localhost/
# Expected: HTTP 200, Content-Type: text/html

# Check static assets are cached
curl -I http://localhost/assets/index.js 2>/dev/null || curl -I http://localhost/
# Expected: Cache-Control header present
```

## Security Testing

### 1. Security Headers

```bash
# Check security headers on frontend
curl -I http://localhost/ | grep -E "(X-Frame-Options|X-Content-Type-Options|X-XSS-Protection)"

# Expected headers:
# X-Frame-Options: SAMEORIGIN
# X-Content-Type-Options: nosniff
# X-XSS-Protection: 1; mode=block
```

### 2. MongoDB Port Security

```bash
# Verify MongoDB is only accessible from localhost
netstat -tlnp | grep 27017 || ss -tlnp | grep 27017
# Expected: Should show 127.0.0.1:27017, NOT 0.0.0.0:27017
```

### 3. SSL/TLS (if configured)

```bash
# Test HTTPS redirect (if configured)
curl -I http://your-domain.com
# Expected: HTTP 301 redirect to HTTPS

# Test SSL certificate
openssl s_client -connect your-domain.com:443 -servername your-domain.com
# Expected: Valid certificate chain
```

## Backup and Restore Testing

### 1. Create Test Backup

```bash
# Create backup
./deployments/scripts/backup.sh /tmp/test-backups

# Verify backup file exists
ls -lh /tmp/test-backups/docushop_backup_*.tar.gz
```

### 2. Test Restore (on non-production system)

```bash
# Stop application
docker compose -f deployments/docker/docker-compose.prod.yml down

# Start only MongoDB
docker compose -f deployments/docker/docker-compose.prod.yml up -d mongodb

# Restore from backup
./deployments/scripts/restore.sh /tmp/test-backups/docushop_backup_*.tar.gz

# Restart all services
docker compose -f deployments/docker/docker-compose.prod.yml up -d
```

## Performance Testing

### 1. Response Time

```bash
# Measure API response time
time curl -s http://localhost/api/health > /dev/null
# Expected: < 200ms

# Measure frontend load time
time curl -s http://localhost/ > /dev/null
# Expected: < 1s
```

### 2. Concurrent Requests

```bash
# Install apache bench if needed
sudo apt-get install apache2-utils

# Test with 100 concurrent requests
ab -n 100 -c 10 http://localhost/api/health

# Expected: No failed requests, reasonable response times
```

### 3. Resource Usage

```bash
# Check container resource usage
docker stats --no-stream

# Expected:
# - Backend: < 500MB RAM
# - Frontend: < 50MB RAM
# - MongoDB: < 1GB RAM (varies with data)
```

## Monitoring Testing

### 1. Log Output

```bash
# Check logs are being generated
docker compose -f deployments/docker/docker-compose.prod.yml logs --tail=10

# Verify log rotation is working
docker inspect docushop-backend-prod | jq '.[0].HostConfig.LogConfig'
# Expected: max-size: 10m, max-file: 3
```

### 2. Health Check Status

```bash
# View health check results
docker inspect docushop-backend-prod | jq '.[0].State.Health'
# Expected: Status: "healthy"
```

## CI/CD Testing

### 1. GitHub Actions Workflows

```bash
# Validate workflow syntax
cat .github/workflows/backend-ci.yml | grep -E "^(name|on|jobs)"
cat .github/workflows/frontend-ci.yml | grep -E "^(name|on|jobs)"
cat .github/workflows/docker-build.yml | grep -E "^(name|on|jobs)"
```

### 2. Local Build Test (if possible)

```bash
# Test backend build (may fail in restricted environments)
cd backend && docker build -t docushop-backend:test .

# Test frontend build
cd frontend && docker build -t docushop-frontend:test .
```

## Cleanup After Testing

```bash
# Stop all services
docker compose -f deployments/docker/docker-compose.prod.yml down

# Remove volumes (WARNING: This deletes data!)
docker compose -f deployments/docker/docker-compose.prod.yml down -v

# Clean up test backups
rm -rf /tmp/test-backups
```

## Test Results Checklist

Mark each test as completed:

- [ ] Pre-deployment verification passed
- [ ] Deployment script completed successfully
- [ ] All service health checks pass
- [ ] API documentation accessible
- [ ] Database connection working
- [ ] Authentication endpoints responding
- [ ] Security headers present
- [ ] MongoDB port properly restricted
- [ ] Backup creation successful
- [ ] Restore procedure tested
- [ ] Response times acceptable
- [ ] Resource usage within limits
- [ ] Logs being generated and rotated
- [ ] Health checks reporting correctly

## Common Issues and Solutions

### Issue: Services not healthy

**Solution:**
```bash
docker compose -f deployments/docker/docker-compose.prod.yml logs
# Review logs for errors
```

### Issue: Database connection failed

**Solution:**
```bash
# Verify credentials
cat deployments/docker/.env | grep MONGO
# Check MongoDB logs
docker compose -f deployments/docker/docker-compose.prod.yml logs mongodb
```

### Issue: High memory usage

**Solution:**
```bash
# Add memory limits to docker-compose.prod.yml
# Under each service, add:
# mem_limit: 1g
```

## Next Steps

After all tests pass:

1. Document any issues found and their solutions
2. Update deployment scripts if needed
3. Schedule automated backup testing
4. Set up production monitoring
5. Create runbook for common operational tasks
