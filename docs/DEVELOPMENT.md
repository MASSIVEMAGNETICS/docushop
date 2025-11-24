# Development Guide

## Getting Started

### Prerequisites

- Python 3.12+
- Node.js 20+
- MongoDB 7+
- Git

### Initial Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/MASSIVEMAGNETICS/docushop.git
   cd docushop
   ```

2. **Backend Setup**
   ```bash
   cd backend
   
   # Create virtual environment
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   
   # Install dependencies
   pip install -r requirements.txt
   
   # Copy environment template
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   
   # Install dependencies
   npm install
   ```

4. **Start MongoDB**
   ```bash
   # Using Docker
   docker run -d -p 27017:27017 --name docushop-mongo mongo:7
   
   # Or use your local MongoDB installation
   mongod --dbpath /path/to/data
   ```

5. **Seed the Database (Optional)**
   ```bash
   cd backend
   source venv/bin/activate
   python seed.py
   ```

## Development Workflow

### Running the Application

**Backend (Terminal 1)**
```bash
cd backend
source venv/bin/activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at:
- API: http://localhost:8000
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

**Frontend (Terminal 2)**
```bash
cd frontend
npm run dev
```

The frontend will be available at http://localhost:3000

### Running Tests

**Backend Tests**
```bash
cd backend
source venv/bin/activate
pytest tests/ -v
```

**Frontend Tests** (when added)
```bash
cd frontend
npm test
```

### Code Quality

**Backend Linting**
```bash
cd backend
source venv/bin/activate

# Format code
black app/

# Check style
flake8 app/

# Type checking
mypy app/
```

**Frontend Linting**
```bash
cd frontend
npm run lint  # When configured
```

## Project Structure

```
docushop/
├── backend/               # FastAPI backend
│   ├── app/
│   │   ├── models/       # Pydantic models
│   │   ├── routers/      # API endpoints
│   │   ├── services/     # Business logic
│   │   ├── utils/        # Utilities
│   │   ├── config.py     # Configuration
│   │   ├── database.py   # Database connection
│   │   └── main.py       # FastAPI app
│   ├── tests/            # Backend tests
│   ├── seed.py           # Database seeding
│   └── requirements.txt  # Python dependencies
├── frontend/             # React frontend
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── pages/        # Page components
│   │   ├── services/     # API client
│   │   └── utils/        # Utilities
│   ├── public/           # Static assets
│   └── package.json      # Node dependencies
├── docs/                 # Documentation
│   ├── API.md           # API documentation
│   ├── HIPAA_CHECKLIST.md
│   └── sample-templates/
├── deployments/          # Deployment configs (future)
└── docker-compose.yml    # Docker orchestration
```

## Database

### MongoDB Collections

- `organizations` - Organization records
- `users` - User accounts
- `templates` - Document templates
- `documents` - Document instances

### Connecting to MongoDB

```bash
# Using MongoDB shell
mongosh mongodb://localhost:27017/docushop

# Or MongoDB Compass
mongodb://localhost:27017
```

### Resetting the Database

```bash
cd backend
source venv/bin/activate
python seed.py  # This clears and reseeds
```

## API Development

### Adding a New Endpoint

1. **Define the model** in `backend/app/models/`
2. **Create the router** in `backend/app/routers/`
3. **Add the service logic** in `backend/app/services/` (if needed)
4. **Register the router** in `backend/app/main.py`
5. **Write tests** in `backend/tests/`

### Example: Adding a New Resource

```python
# 1. Model (app/models/report.py)
from pydantic import BaseModel

class Report(BaseModel):
    id: str
    title: str
    content: str

# 2. Router (app/routers/reports.py)
from fastapi import APIRouter
router = APIRouter()

@router.post("/")
async def create_report(report: Report):
    return report

# 3. Register (app/main.py)
from app.routers import reports
app.include_router(reports.router, prefix="/api/reports", tags=["reports"])
```

## Frontend Development

### Adding a New Page

1. **Create page component** in `frontend/src/pages/`
2. **Add styles** in corresponding `.css` file
3. **Update routing** in `frontend/src/App.jsx`
4. **Connect to API** using service in `frontend/src/services/api.js`

### Component Structure

```jsx
// Example: NewPage.jsx
import React, { useState, useEffect } from 'react'
import './NewPage.css'

function NewPage({ onNavigate }) {
  const [data, setData] = useState([])
  
  useEffect(() => {
    // Fetch data
  }, [])
  
  return (
    <div className="new-page">
      {/* Your content */}
    </div>
  )
}

export default NewPage
```

## Environment Variables

### Backend (.env)

```env
# Required
MONGODB_URL=mongodb://localhost:27017
SECRET_KEY=your-secret-key-here

# Optional
DEBUG=true
S3_ENDPOINT=https://s3.amazonaws.com
S3_BUCKET=docushop-documents
```

### Frontend

Environment variables are handled through Vite.
Create `.env.local` for local overrides:

```env
VITE_API_URL=http://localhost:8000
```

## Docker Development

### Using Docker Compose

```bash
# Build and start all services
docker-compose up --build

# Start in background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Remove volumes
docker-compose down -v
```

### Individual Services

```bash
# Backend only
docker build -t docushop-backend ./backend
docker run -p 8000:8000 docushop-backend

# Frontend only
docker build -t docushop-frontend ./frontend
docker run -p 3000:80 docushop-frontend
```

## Debugging

### Backend Debugging

1. **Add breakpoints** using `import pdb; pdb.set_trace()`
2. **Run without reload**: `uvicorn app.main:app --host 0.0.0.0 --port 8000`
3. **Check logs** in terminal

### Frontend Debugging

1. **Use browser DevTools** (F12)
2. **Add console.log** statements
3. **Use React DevTools** extension

## Common Issues

### Backend won't start

- Check MongoDB is running: `mongosh`
- Check virtual environment is activated
- Verify all dependencies installed: `pip install -r requirements.txt`

### Frontend won't build

- Clear node_modules: `rm -rf node_modules && npm install`
- Check Node version: `node --version` (should be 20+)
- Clear Vite cache: `rm -rf node_modules/.vite`

### Database connection errors

- Verify MongoDB is running
- Check MONGODB_URL in .env
- Test connection: `mongosh mongodb://localhost:27017`

## Best Practices

### Code Style

- **Python**: Follow PEP 8, use type hints
- **JavaScript**: Use ES6+, functional components
- **Comments**: Explain why, not what
- **Naming**: Use descriptive, meaningful names

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/my-feature

# Make changes and commit
git add .
git commit -m "Add feature X"

# Push to remote
git push origin feature/my-feature

# Create Pull Request on GitHub
```

### Testing

- Write tests for all new features
- Aim for >80% code coverage
- Test edge cases and error conditions
- Use descriptive test names

## Performance Tips

### Backend

- Use async/await for I/O operations
- Index frequently queried fields in MongoDB
- Use pagination for large result sets
- Cache frequently accessed data

### Frontend

- Use React.memo for expensive components
- Lazy load pages and components
- Optimize images and assets
- Minimize bundle size

## Security Checklist

- [ ] Never commit secrets or credentials
- [ ] Use environment variables for configuration
- [ ] Validate all user inputs
- [ ] Sanitize data before rendering
- [ ] Use HTTPS in production
- [ ] Keep dependencies updated
- [ ] Follow HIPAA compliance guidelines

## Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://react.dev/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Vite Documentation](https://vitejs.dev/)
- [HIPAA Security Rule](https://www.hhs.gov/hipaa/for-professionals/security/)

## Getting Help

- Check existing documentation in `/docs`
- Review API docs at http://localhost:8000/docs
- Search GitHub issues
- Ask the team in Slack/Teams (if applicable)
