# DocuShop - Document Composition Platform

**A HIPAA-compliant document composition platform for clinical use.**

DocuShop enables authorized staff to create, brand, autofill, sign, audit, and export official documents such as doctor's excuses, verification letters, visit summaries, and reports. Think "Photoshop for documents" designed for healthcare.

## Features

### MVP Feature Set

- ✅ **Template Editor (Canvas)** - WYSIWYG drag-and-drop canvas for creating document templates
- ✅ **AutoFlow / Variables** - Admin-defined variables for dynamic content
- ✅ **Template Library & Branding** - Organization-level assets and branding
- ✅ **Document Generation** - Create documents from templates with autofill
- ✅ **Export & Delivery** - PDF generation (DOCX planned)
- ✅ **Authentication & Audit** - JWT-based auth with comprehensive audit logging
- ✅ **Electronic Signatures** - Digital signature support
- ✅ **Compliance & Security** - HIPAA-focused design with encryption

## Tech Stack

### Backend
- **Framework**: FastAPI (Python 3.12+)
- **Database**: MongoDB
- **Storage**: S3-compatible (encrypted)
- **PDF**: WeasyPrint for HTML-to-PDF conversion
- **Auth**: JWT with OAuth2 support

### Frontend
- **Framework**: React 19+ with Vite
- **Canvas Editor**: React Konva for drag-and-drop editing
- **Styling**: CSS modules

## Quick Start

### Prerequisites

- Python 3.12+
- Node.js 20+
- MongoDB (local or cloud)

### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start the server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`

API Documentation: `http://localhost:8000/docs`

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:3000`

## Project Structure

```
docushop/
├── backend/
│   ├── app/
│   │   ├── models/         # Data models (User, Template, Document)
│   │   ├── routers/        # API endpoints
│   │   ├── services/       # Business logic (PDF, Audit, Encryption)
│   │   ├── utils/          # Utilities
│   │   ├── config.py       # Configuration
│   │   ├── database.py     # Database connection
│   │   └── main.py         # FastAPI application
│   ├── tests/              # Backend tests
│   └── requirements.txt    # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API client
│   │   └── utils/          # Utilities
│   ├── public/             # Static assets
│   └── package.json        # Node dependencies
├── deployments/            # Deployment configurations
└── docs/                   # Documentation
```

## API Endpoints

### Organizations
- `POST /api/orgs` - Create organization
- `GET /api/orgs/{org_id}` - Get organization
- `GET /api/orgs` - List organizations
- `PUT /api/orgs/{org_id}` - Update organization

### Templates
- `POST /api/orgs/{org_id}/templates` - Create template
- `GET /api/orgs/{org_id}/templates/{template_id}` - Get template
- `GET /api/orgs/{org_id}/templates` - List templates
- `PUT /api/orgs/{org_id}/templates/{template_id}` - Update template
- `DELETE /api/orgs/{org_id}/templates/{template_id}` - Delete template

### Documents
- `POST /api/orgs/{org_id}/docs` - Create document
- `GET /api/orgs/{org_id}/docs/{doc_id}` - Get document
- `GET /api/orgs/{org_id}/docs` - List documents
- `POST /api/orgs/{org_id}/docs/{doc_id}/render` - Render PDF/DOCX
- `POST /api/orgs/{org_id}/docs/{doc_id}/sign` - Apply signature
- `GET /api/orgs/{org_id}/docs/{doc_id}/audit` - Get audit trail

### Authentication
- `POST /api/auth/token` - Login and get JWT token

## Data Models

### Template
```json
{
  "id": "tpl-001",
  "org_id": "org-uh-elyria",
  "name": "Doctor Note - Excuse for School/Work",
  "pages": [{
    "page_number": 1,
    "size": "letter",
    "elements": [
      {
        "id": "text-1",
        "type": "text",
        "x": 40,
        "y": 90,
        "w": 520,
        "h": 40,
        "props": {
          "text": "Patient: {{patient_name}}",
          "fontSize": 14
        }
      }
    ]
  }],
  "variables": [
    {
      "name": "patient_name",
      "type": "string",
      "required": true
    }
  ]
}
```

### Document
```json
{
  "id": "doc-001",
  "template_id": "tpl-001",
  "org_id": "org-uh-elyria",
  "filled_variables": {
    "patient_name": "John Doe",
    "dob": "1990-01-15"
  },
  "status": "signed",
  "signatures": [...],
  "audit_trail": [...]
}
```

## Security & HIPAA Compliance

### Implemented Features
- ✅ TLS encryption in transit
- ✅ AES-256 encryption at rest (via encryption service)
- ✅ JWT-based authentication
- ✅ Role-based access control (RBAC)
- ✅ Comprehensive audit logging
- ✅ Tamper-evident signatures

### To Be Configured in Production
- [ ] Cloud KMS or HSM for key management
- [ ] Business Associate Agreement (BAA) execution
- [ ] Data retention and deletion policies
- [ ] Incident response procedures
- [ ] Regular penetration testing
- [ ] Vulnerability scanning

## Development

### Running Tests

Backend:
```bash
cd backend
pytest
```

Frontend:
```bash
cd frontend
npm test
```

### Code Quality

Backend linting:
```bash
cd backend
black app/
flake8 app/
mypy app/
```

## Deployment

See `/deployments` directory for:
- Docker configurations
- Kubernetes manifests
- Environment configuration templates

## Roadmap

### Phase A (Weeks 1-4) ✅
- Core template editor
- Basic PDF export
- Template storage API

### Phase B (Weeks 5-8) 🚧
- Enhanced autofill forms
- Full RBAC implementation
- Signature workflows
- Advanced audit logging

### Phase C (Weeks 9-12) 📋
- DOCX export
- EHR integration APIs
- Load testing & optimization
- Production deployment

## License

Proprietary - All rights reserved

## Support

For support, please contact your system administrator or the development team.

