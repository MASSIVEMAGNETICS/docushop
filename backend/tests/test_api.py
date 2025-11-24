import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_root():
    """Test root endpoint"""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "DocuShop"
    assert data["version"] == "1.0.0"


def test_health_check():
    """Test health check endpoint"""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"


def test_login():
    """Test login endpoint"""
    response = client.post(
        "/api/auth/token",
        data={"username": "test@example.com", "password": "password"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


def test_create_organization():
    """Test creating an organization"""
    org_data = {
        "name": "Test Hospital",
        "assets": {},
        "settings": {}
    }
    # Skip this test if database is not available (unit test mode)
    # In integration tests, this should work with a test database
    pytest.skip("Requires database connection - run as integration test")


def test_api_docs_available():
    """Test that API documentation is available"""
    response = client.get("/docs")
    assert response.status_code == 200
    
    response = client.get("/openapi.json")
    assert response.status_code == 200
    data = response.json()
    assert "openapi" in data
    assert data["info"]["title"] == "DocuShop"
