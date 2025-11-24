# API Documentation

## Base URL

Development: `http://localhost:8000/api`
Production: `https://api.docushop.example/api`

## Authentication

DocuShop uses JWT (JSON Web Tokens) for authentication.

### Login

```http
POST /api/auth/token
Content-Type: application/x-www-form-urlencoded

username=user@example.com&password=yourpassword
```

Response:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

### Using the Token

Include the token in the Authorization header for all subsequent requests:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Organizations

### Create Organization

```http
POST /api/orgs
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "University Hospitals Elyria Medical Center",
  "assets": {
    "logo": "assets/logo.svg",
    "colors": {
      "primary": "#003366",
      "secondary": "#6699CC"
    }
  }
}
```

### Get Organization

```http
GET /api/orgs/{org_id}
Authorization: Bearer {token}
```

### List Organizations

```http
GET /api/orgs?skip=0&limit=100
Authorization: Bearer {token}
```

## Templates

### Create Template

```http
POST /api/orgs/{org_id}/templates
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Doctor's Excuse",
  "description": "Medical excuse letter",
  "pages": [
    {
      "page_number": 1,
      "size": "letter",
      "elements": [...]
    }
  ],
  "variables": [
    {
      "name": "patient_name",
      "type": "string",
      "required": true
    }
  ],
  "created_by": "usr-123"
}
```

### Get Template

```http
GET /api/orgs/{org_id}/templates/{template_id}
Authorization: Bearer {token}
```

### List Templates

```http
GET /api/orgs/{org_id}/templates?skip=0&limit=100
Authorization: Bearer {token}
```

### Update Template

```http
PUT /api/orgs/{org_id}/templates/{template_id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Updated Template Name",
  "is_published": true
}
```

### Delete Template

```http
DELETE /api/orgs/{org_id}/templates/{template_id}
Authorization: Bearer {token}
```

## Documents

### Create Document

```http
POST /api/orgs/{org_id}/docs
Authorization: Bearer {token}
Content-Type: application/json

{
  "template_id": "tpl-001",
  "filled_variables": {
    "patient_name": "John Doe",
    "dob": "1990-01-15",
    "visit_date": "2024-01-20"
  },
  "created_by": "usr-123"
}
```

Response:
```json
{
  "id": "doc-001",
  "template_id": "tpl-001",
  "org_id": "org-demo",
  "name": "Document from Doctor's Excuse",
  "filled_variables": {
    "patient_name": "John Doe",
    "dob": "1990-01-15",
    "visit_date": "2024-01-20"
  },
  "status": "draft",
  "created_by": "usr-123",
  "created_at": "2024-01-20T10:30:00Z"
}
```

### Get Document

```http
GET /api/orgs/{org_id}/docs/{doc_id}
Authorization: Bearer {token}
```

### List Documents

```http
GET /api/orgs/{org_id}/docs?skip=0&limit=100
Authorization: Bearer {token}
```

### Render Document

Generate PDF or DOCX from document:

```http
POST /api/orgs/{org_id}/docs/{doc_id}/render?format=pdf
Authorization: Bearer {token}
```

Response:
```json
{
  "url": "https://storage.example.com/doc-001.pdf",
  "format": "pdf"
}
```

### Sign Document

Apply electronic signature:

```http
POST /api/orgs/{org_id}/docs/{doc_id}/sign
Authorization: Bearer {token}
Content-Type: application/json

{
  "signer_id": "usr-123",
  "signer_name": "Dr. John Smith",
  "signature_data": "base64_encoded_signature_image",
  "pin_verified": true
}
```

### Get Audit Trail

```http
GET /api/orgs/{org_id}/docs/{doc_id}/audit
Authorization: Bearer {token}
```

Response:
```json
[
  {
    "event": "created",
    "user_id": "usr-123",
    "timestamp": "2024-01-20T10:30:00Z",
    "ip_address": "192.168.1.1",
    "metadata": {
      "template_id": "tpl-001"
    }
  },
  {
    "event": "signed",
    "user_id": "usr-123",
    "timestamp": "2024-01-20T10:35:00Z",
    "ip_address": "192.168.1.1",
    "metadata": {
      "signature_type": "typed"
    }
  }
]
```

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "detail": "Invalid request parameters"
}
```

### 401 Unauthorized
```json
{
  "detail": "Could not validate credentials"
}
```

### 403 Forbidden
```json
{
  "detail": "Not enough permissions"
}
```

### 404 Not Found
```json
{
  "detail": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "detail": "Internal server error"
}
```

## Rate Limiting

API requests are rate-limited to:
- 1000 requests per hour per user
- 100 requests per minute per user

Exceeded limits will return `429 Too Many Requests`.

## Data Models

### Template Element Types

- `text` - Plain text block
- `richtext` - Formatted text with variables
- `image` - Image/logo
- `signature` - Signature block
- `table` - Tabular data
- `autofield` - Auto-populated field
- `qr` - QR code
- `barcode` - Barcode

### Variable Types

- `string` - Text value
- `date` - Date value (ISO 8601)
- `number` - Numeric value
- `email` - Email address
- `phone` - Phone number
- `enum` - Predefined list of values

### Document Status

- `draft` - Being edited
- `pending_signature` - Awaiting signature
- `signed` - Electronically signed
- `finalized` - Completed and locked
- `archived` - Archived

## Interactive API Documentation

Visit `/docs` for Swagger UI interactive documentation.
Visit `/redoc` for ReDoc documentation.
