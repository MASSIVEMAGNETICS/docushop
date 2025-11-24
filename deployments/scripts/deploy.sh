#!/bin/bash
# Deployment script for DocuShop
# Usage: ./deploy.sh [environment]

set -e

ENVIRONMENT="${1:-production}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"

echo "======================================"
echo "DocuShop Deployment Script"
echo "Environment: ${ENVIRONMENT}"
echo "======================================"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "Error: Docker is not installed"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker compose &> /dev/null; then
    echo "Error: Docker Compose is not installed"
    exit 1
fi

# Navigate to project root
cd "${PROJECT_ROOT}"

# Load environment variables
if [ -f "deployments/docker/.env" ]; then
    echo "Loading environment variables from .env file..."
    export $(cat deployments/docker/.env | grep -v '^#' | xargs)
else
    echo "Warning: .env file not found. Using defaults."
    echo "Please create deployments/docker/.env from .env.template"
fi

# Pull latest images if using remote registry
if [ "${ENVIRONMENT}" == "production" ]; then
    echo "Pulling latest Docker images..."
    docker compose -f deployments/docker/docker-compose.prod.yml pull
fi

# Stop existing containers
echo "Stopping existing containers..."
docker compose -f deployments/docker/docker-compose.prod.yml down

# Start services
echo "Starting services..."
docker compose -f deployments/docker/docker-compose.prod.yml up -d

# Wait for services to be healthy
echo "Waiting for services to be healthy..."
sleep 10

# Check service health
echo "Checking service health..."
for i in {1..30}; do
    if docker compose -f deployments/docker/docker-compose.prod.yml ps | grep -q "healthy"; then
        echo "Services are healthy!"
        break
    fi
    if [ $i -eq 30 ]; then
        echo "Warning: Services did not become healthy in time"
        docker compose -f deployments/docker/docker-compose.prod.yml ps
        exit 1
    fi
    echo "Waiting... ($i/30)"
    sleep 2
done

# Show running services
echo ""
echo "======================================"
echo "Deployment completed successfully!"
echo "======================================"
docker compose -f deployments/docker/docker-compose.prod.yml ps

echo ""
echo "Application URLs:"
echo "  Frontend: http://localhost"
echo "  Backend API: http://localhost/api"
echo "  API Docs: http://localhost/api/docs"
echo ""
echo "To view logs: docker compose -f deployments/docker/docker-compose.prod.yml logs -f"
echo "To stop: docker compose -f deployments/docker/docker-compose.prod.yml down"
echo ""

exit 0
