import pytest
from app.services.encryption_service import EncryptionService


def test_encryption_service():
    """Test encryption and decryption"""
    service = EncryptionService()
    
    plaintext = "Sensitive patient data"
    encrypted = service.encrypt(plaintext)
    
    # Encrypted text should be different from plaintext
    assert encrypted != plaintext
    
    # Decryption should return original text
    decrypted = service.decrypt(encrypted)
    assert decrypted == plaintext


def test_encryption_with_phi():
    """Test encryption with PHI data"""
    service = EncryptionService()
    
    phi_data = "Patient: John Doe, SSN: 123-45-6789"
    encrypted = service.encrypt(phi_data)
    decrypted = service.decrypt(encrypted)
    
    assert decrypted == phi_data
    # Ensure encrypted data doesn't contain original SSN
    assert "123-45-6789" not in encrypted


def test_key_generation():
    """Test encryption key generation"""
    key = EncryptionService.generate_key()
    assert key is not None
    assert len(key) > 0
