# Changelog

All notable changes to DocuShop will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

#### Deployment Infrastructure
- GitHub Actions CI/CD pipelines
  - Backend CI workflow with testing, linting, and coverage
  - Frontend CI workflow with build validation
  - Docker build and push workflow to GitHub Container Registry
- Production Docker Compose configuration (`deployments/docker/docker-compose.prod.yml`)
- Production-ready nginx configuration with security headers
- Environment configuration template (`.env.template`)
- Deployment scripts
  - `deploy.sh` - Automated deployment with health checks
  - `backup.sh` - Database backup with compression
  - `restore.sh` - Database restore from backup
  - `mongo-init.js` - MongoDB initialization with user and index creation
- Comprehensive deployment documentation
  - `DEPLOYMENT.md` - Full deployment guide with SSL/TLS, monitoring, and troubleshooting
  - `deployments/README.md` - Quick reference for deployment options
- Enhanced `.gitignore` for deployment artifacts (backups, certificates, etc.)

#### Security & Configuration
- Multi-platform Docker image builds (linux/amd64, linux/arm64)
- Health check configurations for all services
- Logging configuration with rotation
- SSL/TLS support with Let's Encrypt integration
- Environment-based configuration management
- Database authentication and authorization setup

#### Documentation
- Production deployment checklist
- SSL/TLS configuration guide
- Backup and restore procedures
- Monitoring and maintenance guidelines
- Troubleshooting guide
- Performance tuning recommendations

### Changed
- Updated main README.md with deployment section
- Enhanced Docker Compose configuration with production-ready settings

### Security
- Added security headers to nginx configuration
- Implemented proper CORS configuration
- Database bound to localhost only in production
- Support for encrypted environment variables

## [1.0.0] - 2024-11-24

### Added
- Initial MVP release
- Core template editor with React Konva
- Document generation with variable autofill
- PDF export functionality
- RESTful API with FastAPI
- MongoDB database integration
- JWT authentication
- AES-256 encryption service
- Audit logging service
- Docker and Docker Compose support
- Electron desktop application for Windows
- Comprehensive documentation

### Features
- Template Editor - Drag-and-drop canvas for creating document templates
- AutoFlow/Variables - Admin-defined variables for dynamic content
- Template Library - Organization-level assets and branding
- Document Generation - Create documents from templates with autofill
- Export & Delivery - PDF generation (DOCX planned)
- Authentication & Audit - JWT-based auth with comprehensive audit logging
- Electronic Signatures - Digital signature support
- Compliance & Security - HIPAA-focused design with encryption
- Windows Desktop App - Native Windows 10 application with full menu bar

[Unreleased]: https://github.com/MASSIVEMAGNETICS/docushop/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/MASSIVEMAGNETICS/docushop/releases/tag/v1.0.0
