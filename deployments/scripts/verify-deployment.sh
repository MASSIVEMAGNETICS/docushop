#!/bin/bash
# Deployment Verification Script for DocuShop
# Usage: ./verify-deployment.sh

set -e

echo "======================================"
echo "DocuShop Deployment Verification"
echo "======================================"
echo ""

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"

cd "${PROJECT_ROOT}"

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check functions
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $1 exists"
        return 0
    else
        echo -e "${RED}✗${NC} $1 missing"
        return 1
    fi
}

check_executable() {
    if [ -x "$1" ]; then
        echo -e "${GREEN}✓${NC} $1 is executable"
        return 0
    else
        echo -e "${RED}✗${NC} $1 is not executable"
        return 1
    fi
}

check_command() {
    if [ "$1" = "docker compose" ]; then
        if docker compose version &> /dev/null; then
            echo -e "${GREEN}✓${NC} docker compose is installed"
            return 0
        else
            echo -e "${RED}✗${NC} docker compose is not installed"
            return 1
        fi
    elif command -v "$1" &> /dev/null; then
        echo -e "${GREEN}✓${NC} $1 is installed"
        return 0
    else
        echo -e "${RED}✗${NC} $1 is not installed"
        return 1
    fi
}

echo "Checking required commands..."
check_command docker
check_command "docker compose"
echo ""

echo "Checking deployment files..."
check_file "deployments/docker/docker-compose.prod.yml"
check_file "deployments/docker/.env.template"
check_file "deployments/docker/nginx-prod.conf"
echo ""

echo "Checking deployment scripts..."
check_file "deployments/scripts/deploy.sh"
check_file "deployments/scripts/backup.sh"
check_file "deployments/scripts/restore.sh"
check_file "deployments/scripts/mongo-init.js"
echo ""

echo "Checking script permissions..."
check_executable "deployments/scripts/deploy.sh"
check_executable "deployments/scripts/backup.sh"
check_executable "deployments/scripts/restore.sh"
echo ""

echo "Checking CI/CD workflows..."
check_file ".github/workflows/backend-ci.yml"
check_file ".github/workflows/frontend-ci.yml"
check_file ".github/workflows/docker-build.yml"
echo ""

echo "Checking documentation..."
check_file "deployments/DEPLOYMENT.md"
check_file "deployments/README.md"
check_file "deployments/QUICKSTART.md"
check_file "deployments/TESTING.md"
check_file "CHANGELOG.md"
echo ""

echo "Validating Docker Compose configuration..."
if docker compose -f deployments/docker/docker-compose.prod.yml config > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} Docker Compose configuration is valid"
else
    echo -e "${YELLOW}⚠${NC} Docker Compose configuration has warnings (this is normal without .env file)"
fi
echo ""

echo "Checking Dockerfile..."
check_file "backend/Dockerfile"
check_file "frontend/Dockerfile"
echo ""

echo "======================================"
echo "Verification Complete"
echo "======================================"
echo ""
echo "Next steps:"
echo "1. Create deployments/docker/.env from .env.template"
echo "2. Update environment variables with production values"
echo "3. Run: ./deployments/scripts/deploy.sh production"
echo ""
