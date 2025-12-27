# Authentication System Documentation

## Overview
The Academic Scheduler now includes a secure authentication system for admin users.

## Features
- Secure password hashing using Werkzeug's security utilities
- Session-based authentication
- 4 pre-seeded admin accounts
- Password change functionality
- Protected API endpoints

## Database Schema

### AdminUser Table
- `id`: Integer, Primary Key
- `username`: String(80), Unique, Not Null
- `password_hash`: String(255), Not Null
- `created_at`: DateTime, Default: Current Timestamp

## Default Admin Accounts
Upon database initialization, 4 admin accounts are automatically created:

1. **Username:** admin1 | **Password:** Admin@123
2. **Username:** admin2 | **Password:** Admin@456
3. **Username:** admin3 | **Password:** Admin@789
4. **Username:** admin4 | **Password:** Admin@000

## Setup Instructions

### 1. Install Dependencies
Ensure all required packages are installed:
```bash
cd backend
pip install -r requirements.txt
```

### 2. Initialize Database
Run the initialization script to create tables and seed admin accounts:
```bash
python init_db.py
```

### 3. Start Backend Server
```bash
python app.py
```

### 4. Start Frontend
```bash
cd ..
npm install
npm run dev
```

## API Endpoints

### Authentication Endpoints

#### POST /api/auth/login
Login with admin credentials.

**Request Body:**
```json
{
  "username": "admin1",
  "password": "Admin@123"
}
```

**Response (Success):**
```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "username": "admin1",
    "created_at": "2024-01-01T00:00:00"
  }
}
```

#### POST /api/auth/logout
Logout current admin user.

**Response:**
```json
{
  "message": "Logout successful"
}
```

#### GET /api/auth/check
Check if user is authenticated.

**Response:**
```json
{
  "authenticated": true,
  "user": {
    "id": 1,
    "username": "admin1",
    "created_at": "2024-01-01T00:00:00"
  }
}
```

#### POST /api/auth/change-password
Change admin password (requires authentication).

**Request Body:**
```json
{
  "currentPassword": "Admin@123",
  "newPassword": "NewSecurePassword123"
}
```

**Response:**
```json
{
  "message": "Password changed successfully"
}
```

## Security Features

### Password Hashing
- Passwords are hashed using `werkzeug.security.generate_password_hash`
- Uses PBKDF2 with SHA-256 by default
- Passwords are never stored in plain text
- Passwords are never returned in API responses

### Session Management
- Session-based authentication using Flask sessions
- Secure session cookies with configurable settings
- Sessions cleared on logout

### Password Requirements
- Minimum 6 characters for new passwords
- Can be customized in the frontend validation

## Frontend Components

### LoginPage
- Clean, professional login interface
- Error handling and validation
- Loading states
- Displays default credentials for convenience

### ChangePasswordModal
- Secure password change interface
- Current password verification
- New password confirmation
- Real-time validation

## Configuration

### Environment Variables
Set these in your environment or `.env` file:

```bash
SECRET_KEY=your-secret-key-here  # Auto-generated if not set
```

### CORS Configuration
The backend is configured to accept credentials from the frontend:
```python
CORS(app, supports_credentials=True)
```

## Testing

### Manual Testing
1. Start both backend and frontend servers
2. Navigate to the application
3. Login with default credentials (admin1 / Admin@123)
4. Test password change functionality
5. Test logout functionality

### Database Reset
To reset the database and re-seed admin accounts:
```bash
cd backend
rm instance/scheduler.db
python init_db.py
```

## Troubleshooting

### Login Issues
- Ensure backend server is running on port 5000
- Check browser console for CORS errors
- Verify credentials are correct

### Session Issues
- Clear browser cookies
- Restart backend server
- Check SECRET_KEY is set

### Database Issues
- Delete `instance/scheduler.db` and re-run `init_db.py`
- Check file permissions on the database file

## Future Enhancements
- Role-based access control (RBAC)
- Password reset functionality
- Email verification
- Two-factor authentication (2FA)
- Session timeout configuration
- Audit logging
