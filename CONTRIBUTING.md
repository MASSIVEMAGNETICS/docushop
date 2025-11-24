# Contributing to DocuShop

Thank you for your interest in contributing to DocuShop! This document provides guidelines and instructions for contributing.

## Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Help create a welcoming environment for all contributors

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally
3. **Create a feature branch** from `main`
4. **Make your changes**
5. **Test thoroughly**
6. **Submit a pull request**

## Development Setup

See [DEVELOPMENT.md](./DEVELOPMENT.md) for detailed setup instructions.

## Pull Request Process

### Before Submitting

1. **Run tests** and ensure they pass
   ```bash
   cd backend && pytest tests/
   ```

2. **Run linters** and fix any issues
   ```bash
   cd backend && black app/ && flake8 app/
   ```

3. **Update documentation** if needed

4. **Check for security issues**
   - No secrets in code
   - No sensitive data in tests
   - Follow HIPAA guidelines

### Submitting a PR

1. **Create a descriptive title**
   - Good: "Add PDF watermark feature for signed documents"
   - Bad: "Fix stuff"

2. **Provide clear description**
   - What problem does this solve?
   - How does it work?
   - Any breaking changes?
   - Screenshots (if UI changes)

3. **Reference related issues**
   - "Fixes #123"
   - "Relates to #456"

4. **Request review** from maintainers

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Added unit tests
- [ ] Added integration tests
- [ ] Manual testing performed

## Security
- [ ] No secrets committed
- [ ] No PHI in test data
- [ ] HIPAA compliance verified

## Screenshots (if applicable)
[Add screenshots here]
```

## Coding Standards

### Python (Backend)

- Follow PEP 8 style guide
- Use type hints for all functions
- Write docstrings for public functions
- Keep functions small and focused
- Use async/await for I/O operations

```python
async def create_document(
    template_id: str,
    variables: Dict[str, Any]
) -> Document:
    """
    Create a new document from a template.
    
    Args:
        template_id: The ID of the template to use
        variables: Dictionary of variable values
        
    Returns:
        The created Document instance
        
    Raises:
        TemplateNotFoundError: If template doesn't exist
        ValidationError: If variables are invalid
    """
    # Implementation
```

### JavaScript/React (Frontend)

- Use functional components with hooks
- Use ES6+ features
- Keep components small and reusable
- Use meaningful variable names
- Add PropTypes or TypeScript types

```javascript
function DocumentCard({ document, onEdit, onDelete }) {
  const [isLoading, setIsLoading] = useState(false)
  
  const handleEdit = async () => {
    setIsLoading(true)
    try {
      await onEdit(document.id)
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <div className="document-card">
      {/* Component content */}
    </div>
  )
}
```

### CSS

- Use BEM naming convention
- Keep selectors specific
- Use CSS variables for theming
- Mobile-first responsive design

```css
.document-card {
  /* Component styles */
}

.document-card__title {
  /* Element styles */
}

.document-card--featured {
  /* Modifier styles */
}
```

## Commit Messages

Use conventional commit format:

```
type(scope): subject

body (optional)

footer (optional)
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Build process or auxiliary tool changes

### Examples

```
feat(templates): add drag-and-drop reordering

Implements drag-and-drop functionality for template elements
using react-beautiful-dnd library.

Closes #123
```

```
fix(auth): prevent token expiration during active sessions

Implements token refresh mechanism to keep users logged in
when actively using the application.
```

## Testing Guidelines

### Unit Tests

- Test individual functions and components
- Mock external dependencies
- Cover edge cases and error conditions
- Use descriptive test names

```python
def test_create_document_with_missing_required_variable():
    """Should raise ValidationError when required variable is missing"""
    template = create_test_template(required_vars=["patient_name"])
    with pytest.raises(ValidationError):
        create_document(template.id, variables={})
```

### Integration Tests

- Test complete workflows
- Use test database
- Clean up after tests
- Test API endpoints end-to-end

### Test Coverage

- Aim for >80% coverage
- Focus on critical paths first
- Don't sacrifice quality for coverage

## Documentation

### Code Comments

- Explain complex logic
- Document assumptions
- Link to related issues/PRs
- Keep comments up-to-date

### API Documentation

- Document all endpoints
- Include request/response examples
- Specify error responses
- Update OpenAPI schema

### User Documentation

- Keep README up-to-date
- Add screenshots for UI features
- Provide usage examples
- Update migration guides

## Security

### HIPAA Compliance

All contributions must maintain HIPAA compliance:

- **PHI Protection**: Never log or expose PHI
- **Encryption**: Use encryption for data at rest and in transit
- **Access Control**: Implement proper authorization
- **Audit Logging**: Log all PHI access
- **Data Minimization**: Only collect necessary data

### Security Best Practices

- Validate all inputs
- Sanitize outputs
- Use parameterized queries
- Keep dependencies updated
- Never commit secrets
- Use environment variables
- Follow principle of least privilege

### Security Review

Before merging, ensure:

- [ ] No secrets or credentials in code
- [ ] Input validation implemented
- [ ] SQL injection prevention
- [ ] XSS prevention
- [ ] CSRF protection
- [ ] Authentication required for sensitive endpoints
- [ ] Authorization checked
- [ ] Encryption used for PHI

## Review Process

### For Reviewers

- Be constructive and respectful
- Test the changes locally
- Check for security issues
- Verify documentation is updated
- Ensure tests pass
- Check code style compliance

### Review Checklist

- [ ] Code follows project standards
- [ ] Tests are included and passing
- [ ] Documentation is updated
- [ ] No security vulnerabilities
- [ ] HIPAA compliance maintained
- [ ] No breaking changes (or properly documented)
- [ ] Performance impact considered

## Release Process

### Version Numbering

We use Semantic Versioning (SemVer):

- MAJOR: Breaking changes
- MINOR: New features (backward compatible)
- PATCH: Bug fixes

### Release Checklist

1. Update version numbers
2. Update CHANGELOG.md
3. Run full test suite
4. Build Docker images
5. Test deployment
6. Tag release in Git
7. Deploy to production

## Questions?

- Check [DEVELOPMENT.md](./DEVELOPMENT.md)
- Review existing issues and PRs
- Ask in team chat
- Create a discussion on GitHub

## Thank You!

Your contributions help make DocuShop better for healthcare organizations and their patients.
