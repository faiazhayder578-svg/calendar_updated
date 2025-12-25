"""Diagnostic script for troubleshooting authentication issues"""
from app import app, db, AdminUser
import sys

def diagnose():
    print("=" * 60)
    print("ACADEMIC SCHEDULER - AUTHENTICATION DIAGNOSTICS")
    print("=" * 60)
    print()
    
    with app.app_context():
        # Check database connection
        print("1. Database Connection")
        print("-" * 60)
        try:
            db.session.execute(db.text('SELECT 1'))
            print("✓ Database connection successful")
        except Exception as e:
            print(f"✗ Database connection failed: {e}")
            return
        print()
        
        # Check AdminUser table
        print("2. AdminUser Table")
        print("-" * 60)
        try:
            admin_count = AdminUser.query.count()
            print(f"✓ AdminUser table exists")
            print(f"  Total admin accounts: {admin_count}")
        except Exception as e:
            print(f"✗ AdminUser table error: {e}")
            return
        print()
        
        # Check each admin account
        print("3. Admin Accounts Verification")
        print("-" * 60)
        test_credentials = [
            ("admin1", "Admin@123"),
            ("admin2", "Admin@456"),
            ("admin3", "Admin@789"),
            ("admin4", "Admin@000")
        ]
        
        all_valid = True
        for username, password in test_credentials:
            admin = AdminUser.query.filter_by(username=username).first()
            if admin:
                password_valid = admin.check_password(password)
                if password_valid:
                    print(f"✓ {username}: Valid credentials")
                else:
                    print(f"✗ {username}: Invalid password")
                    all_valid = False
            else:
                print(f"✗ {username}: Account not found")
                all_valid = False
        print()
        
        # Check Flask configuration
        print("4. Flask Configuration")
        print("-" * 60)
        print(f"SECRET_KEY set: {'✓' if app.config.get('SECRET_KEY') else '✗'}")
        print(f"SESSION_COOKIE_SAMESITE: {app.config.get('SESSION_COOKIE_SAMESITE')}")
        print(f"SESSION_COOKIE_SECURE: {app.config.get('SESSION_COOKIE_SECURE')}")
        print(f"SESSION_COOKIE_HTTPONLY: {app.config.get('SESSION_COOKIE_HTTPONLY')}")
        print()
        
        # Summary
        print("5. Summary")
        print("-" * 60)
        if all_valid and admin_count == 4:
            print("✓ All systems operational")
            print("✓ All admin accounts are valid")
            print()
            print("If you're still experiencing login issues:")
            print("  1. Ensure backend is running: python app.py")
            print("  2. Ensure frontend is running: npm run dev")
            print("  3. Check browser console for errors")
            print("  4. Clear browser cookies and cache")
            print("  5. Try incognito/private mode")
        else:
            print("✗ Issues detected")
            print()
            print("To fix:")
            print("  1. Delete database: rm instance/scheduler.db")
            print("  2. Reinitialize: python init_db.py")
            print("  3. Run this diagnostic again")
        print()
        print("=" * 60)

if __name__ == "__main__":
    diagnose()
