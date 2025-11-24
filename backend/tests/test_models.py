import pytest
from app.models.user import User, UserRole, Organization
from app.models.template import Template, TemplateElement, TemplateVariable, ElementType, VariableType
from app.models.document import Document, DocumentStatus


def test_user_model():
    """Test User model creation and validation"""
    user = User(
        email="test@example.com",
        name="Test User",
        role=UserRole.CLINICIAN,
        org_id="org-123"
    )
    assert user.email == "test@example.com"
    assert user.role == UserRole.CLINICIAN
    assert user.is_active is True


def test_organization_model():
    """Test Organization model"""
    org = Organization(
        name="Test Hospital",
        assets={"logo": "logo.svg"},
        settings={"timezone": "UTC"}
    )
    assert org.name == "Test Hospital"
    assert "logo" in org.assets


def test_template_element():
    """Test TemplateElement model"""
    element = TemplateElement(
        id="elem-1",
        type=ElementType.TEXT,
        x=100,
        y=200,
        w=300,
        h=50,
        props={"text": "Hello {{name}}"}
    )
    assert element.type == ElementType.TEXT
    assert element.x == 100
    assert element.props["text"] == "Hello {{name}}"


def test_template_variable():
    """Test TemplateVariable model"""
    var = TemplateVariable(
        name="patient_name",
        type=VariableType.STRING,
        required=True
    )
    assert var.name == "patient_name"
    assert var.type == VariableType.STRING
    assert var.required is True


def test_template_model():
    """Test Template model"""
    template = Template(
        org_id="org-123",
        name="Test Template",
        created_by="usr-123"
    )
    assert template.name == "Test Template"
    assert template.is_published is False


def test_document_model():
    """Test Document model"""
    doc = Document(
        template_id="tpl-123",
        org_id="org-123",
        name="Test Document",
        filled_variables={"patient_name": "John Doe"},
        created_by="usr-123"
    )
    assert doc.template_id == "tpl-123"
    assert doc.status == DocumentStatus.DRAFT
    assert doc.filled_variables["patient_name"] == "John Doe"
