// MongoDB initialization script for production
// This script creates the application database and user

db = db.getSiblingDB('admin');

// Create application database
db = db.getSiblingDB('docushop');

// Create application user with read/write permissions
db.createUser({
  user: process.env.MONGO_APP_USERNAME || 'docushop_app',
  pwd: process.env.MONGO_APP_PASSWORD || 'changeme',
  roles: [
    {
      role: 'readWrite',
      db: 'docushop'
    }
  ]
});

// Create collections with validation
db.createCollection('users', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['email', 'username', 'role'],
      properties: {
        email: {
          bsonType: 'string',
          pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'
        },
        username: {
          bsonType: 'string',
          minLength: 3
        },
        role: {
          enum: ['admin', 'clinician', 'staff']
        }
      }
    }
  }
});

db.createCollection('organizations');
db.createCollection('templates');
db.createCollection('documents');
db.createCollection('audit_logs');

// Create indexes for performance
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ username: 1 }, { unique: true });
db.organizations.createIndex({ name: 1 });
db.templates.createIndex({ org_id: 1, name: 1 });
db.documents.createIndex({ org_id: 1, template_id: 1 });
db.documents.createIndex({ created_at: -1 });
db.audit_logs.createIndex({ entity_id: 1, action: 1 });
db.audit_logs.createIndex({ timestamp: -1 });

print('MongoDB initialized successfully for DocuShop');
