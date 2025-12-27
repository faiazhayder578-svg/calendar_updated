"""
Database initialization script for Academic Scheduler
Creates all tables and seeds default admin accounts and instructor preferences
"""
from app import app, db
import sys

def init_database():
    """Initialize database and seed admin accounts and instructor preferences"""
    with app.app_context():
        print("Creating database tables...")
        db.create_all()
        print("Database tables created successfully!")
        
        # Import models after db is created
        from app import AdminUser, InstructorPreference
        
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
        
        # Seed default instructor preferences
        print("\nSeeding instructor preferences...")
        default_instructors = [
            {
                "initials": "RJP",
                "full_name": "Dr. Rezwanul Huq Rana",
                "preferable_courses": "CSE115, CSE215, CSE225",
                "preferable_times": "ST1,ST2,MW1,MW2"
            },
            {
                "initials": "HAR",
                "full_name": "Dr. Hasibul Alam Rahman",
                "preferable_courses": "MAT130, MAT250, MAT350",
                "preferable_times": "ST2,ST3,ST5,RA1,RA2,RA3,RA5,RA6"
            },
            {
                "initials": "MRH",
                "full_name": "Mohammad Rezwanul Huq",
                "preferable_courses": "CSE225, CSE327",
                "preferable_times": "MW1,MW2,MW4"
            },
            {
                "initials": "AFE",
                "full_name": "Md Adnan Arefeen",
                "preferable_courses": "CSE299, CSE327, CSE468",
                "preferable_times": "ST3,ST4,MW4,MW5"
            },
            {
                "initials": "ATA",
                "full_name": "Atia Afroz",
                "preferable_courses": "MAT250, MAT350",
                "preferable_times": "ST3,ST4,ST6,MW3,MW4"
            },
            {
                "initials": "MLE",
                "full_name": "Mirza Mohammad Lutfe Elahi",
                "preferable_courses": "CSE115",
                "preferable_times": "ST1"
            },
            {
                "initials": "SFR1",
                "full_name": "Shafin Rahman",
                "preferable_courses": "CSE299",
                "preferable_times": "ST1"
            }
        ]
        
        instructor_count = 0
        for inst_data in default_instructors:
            existing = InstructorPreference.query.filter_by(initials=inst_data["initials"]).first()
            if not existing:
                instructor = InstructorPreference(
                    initials=inst_data["initials"],
                    full_name=inst_data["full_name"],
                    preferable_courses=inst_data["preferable_courses"],
                    preferable_times=inst_data["preferable_times"]
                )
                db.session.add(instructor)
                instructor_count += 1
                print(f"  - Created instructor: {inst_data['initials']} ({inst_data['full_name']})")
            else:
                print(f"  - Instructor already exists: {inst_data['initials']}")
        
        if instructor_count > 0:
            db.session.commit()
            print(f"\nSuccessfully seeded {instructor_count} instructor(s)!")
        else:
            print("\nAll instructors already exist.")
        
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
