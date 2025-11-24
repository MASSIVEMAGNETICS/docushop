"""
Seed script to populate the database with sample data for development/demo.
Run this script to set up initial organizations, users, and templates.
"""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime
import json


async def seed_database():
    """Seed the database with sample data"""
    
    # Connect to MongoDB
    client = AsyncIOMotorClient("mongodb://localhost:27017")
    db = client["docushop"]
    
    print("🌱 Seeding database...")
    
    # Clear existing data (for development only!)
    print("  Clearing existing data...")
    await db.organizations.delete_many({})
    await db.users.delete_many({})
    await db.templates.delete_many({})
    await db.documents.delete_many({})
    
    # Create sample organization
    print("  Creating organization...")
    org = {
        "id": "org-uh-elyria",
        "name": "University Hospitals Elyria Medical Center",
        "assets": {
            "logo": "assets/logo.svg",
            "colors": {
                "primary": "#003366",
                "secondary": "#6699CC"
            },
            "fonts": ["Arial", "Times New Roman"]
        },
        "settings": {
            "timezone": "America/New_York",
            "date_format": "MM/DD/YYYY"
        },
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    await db.organizations.insert_one(org)
    
    # Create sample users
    print("  Creating users...")
    users = [
        {
            "id": "usr-admin-001",
            "email": "admin@uh-elyria.org",
            "name": "System Administrator",
            "role": "admin",
            "org_id": "org-uh-elyria",
            "is_active": True,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "id": "usr-dr-smith",
            "email": "john.smith@uh-elyria.org",
            "name": "Dr. John Smith",
            "role": "clinician",
            "org_id": "org-uh-elyria",
            "is_active": True,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "id": "usr-staff-jane",
            "email": "jane.doe@uh-elyria.org",
            "name": "Jane Doe",
            "role": "staff",
            "org_id": "org-uh-elyria",
            "is_active": True,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
    ]
    await db.users.insert_many(users)
    
    # Load and insert sample templates
    print("  Creating templates...")
    
    # Doctor's Excuse template
    with open('../docs/sample-templates/doctors-excuse.json', 'r') as f:
        doctors_excuse = json.load(f)
        doctors_excuse['created_at'] = datetime.utcnow()
        doctors_excuse['updated_at'] = datetime.utcnow()
        await db.templates.insert_one(doctors_excuse)
    
    # Verification of Visit template
    with open('../docs/sample-templates/verification-of-visit.json', 'r') as f:
        verification = json.load(f)
        verification['created_at'] = datetime.utcnow()
        verification['updated_at'] = datetime.utcnow()
        await db.templates.insert_one(verification)
    
    # Create a sample document
    print("  Creating sample document...")
    sample_doc = {
        "id": "doc-sample-001",
        "template_id": "tpl-visit-note-001",
        "org_id": "org-uh-elyria",
        "name": "Doctor's Excuse - John Doe",
        "filled_variables": {
            "patient_name": "John Doe",
            "dob": "1990-01-15",
            "visit_date": "2024-01-20",
            "return_date": "2024-01-22",
            "physician_name": "Dr. John Smith",
            "physician_title": "MD"
        },
        "rendered_pdfs": [],
        "status": "draft",
        "signatures": [],
        "audit_trail": [
            {
                "event": "created",
                "user_id": "usr-dr-smith",
                "timestamp": datetime.utcnow(),
                "ip_address": "127.0.0.1",
                "metadata": {
                    "template_id": "tpl-visit-note-001"
                }
            }
        ],
        "created_by": "usr-dr-smith",
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    await db.documents.insert_one(sample_doc)
    
    print("✅ Database seeded successfully!")
    print(f"   Organization: {org['name']}")
    print(f"   Users: {len(users)}")
    print(f"   Templates: 2")
    print(f"   Documents: 1")
    
    client.close()


if __name__ == "__main__":
    asyncio.run(seed_database())
