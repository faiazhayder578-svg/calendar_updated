"""
Database initialization script for Academic Scheduler
Creates all tables and seeds default admin accounts
"""
from app import app, db
import sys

def init_database():
    """Initialize database and seed admin accounts"""
    with app.app_context():
        print("Creating database tables...")
        db.create_all()
        print("Database tables created successfully!")
        
        # Import AdminUser after db is created
        from app import AdminUser
        
        # Seed default admin accounts
        default_admins = [
            {"username": "Monalisa", "password": "Mona@123"},
            {"username": "Abrar", "password": "Abrar@456"},
            {"username": "Faiaz", "password": "Faiaz@789"},
            {"username": "Rezwan", "password": "Rezwan@000"}
        ]
        
        seeded_count = 0
        for admin_data in default_admins:
            existing = AdminUser.query.filter_by(username=admin_data["username"]).first()
            if not existing:
                admin = AdminUser(username=admin_data["username"])
                admin.set_password(admin_data["password"])
                db.session.add(admin)
                seeded_count += 1
                print(f"  - Created admin: {admin_data['username']}")
            else:
                print(f"  - Admin already exists: {admin_data['username']}")
        
        if seeded_count > 0:
            db.session.commit()
            print(f"\nSuccessfully seeded {seeded_count} admin account(s)!")
        else:
            print("\nAll admin accounts already exist.")
        
        print("\nDefault Admin Credentials:")
        print("  Username: Monalisa | Password: Mona@123")
        print("  Username: Abrar | Password: Abrar@456")
        print("  Username: Faiaz | Password: Faiaz@789")
        print("  Username: Rezwan | Password: Rezwan@000")
        print("\nDatabase initialization complete!")

if __name__ == "__main__":
    try:
        init_database()
        sys.exit(0)
    except Exception as e:
        print(f"\nError initializing database: {e}")
        sys.exit(1)
