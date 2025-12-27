"""Test script to verify admin authentication"""
from app import app, db, AdminUser

def test_admins():
    with app.app_context():
        # Test all admin accounts
        test_credentials = [
            ("Monalisa", "Mona@123"),
            ("Abrar", "Abrar@456"),
            ("Faiaz", "Faiaz@789"),
            ("Rezwan", "Rezwan@000")
        ]
        
        print("Testing Admin Accounts:")
        print("-" * 50)
        
        for username, password in test_credentials:
            admin = AdminUser.query.filter_by(username=username).first()
            if admin:
                password_valid = admin.check_password(password)
                status = "✓ VALID" if password_valid else "✗ INVALID"
                print(f"{username}: {status}")
                if not password_valid:
                    print(f"  Expected: {password}")
            else:
                print(f"{username}: ✗ NOT FOUND")
        
        print("-" * 50)
        print(f"Total admins in database: {AdminUser.query.count()}")

if __name__ == "__main__":
    test_admins()
