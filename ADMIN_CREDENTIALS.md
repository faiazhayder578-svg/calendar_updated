# Admin Credentials

## Default Admin Accounts

The system comes with 4 pre-configured admin accounts.

### Account 1
- **Username**: `Monalisa`
- **Password**: `Mona@123`
- **Status**: ✓ Active

### Account 2
- **Username**: `Abrar`
- **Password**: `Abrar@456`
- **Status**: ✓ Active

### Account 3
- **Username**: `Faiaz`
- **Password**: `Faiaz@789`
- **Status**: ✓ Active

### Account 4
- **Username**: `Rezwan`
- **Password**: `Rezwan@000`
- **Status**: ✓ Active

## Login Instructions

1. Navigate to: `http://localhost:5173/login`
2. Enter one of the usernames above
3. Enter the corresponding password
4. Click "Login"
5. You will be redirected to the admin dashboard

## Troubleshooting

### If Login Fails

1. **Check Backend is Running**
   ```bash
   cd backend
   python app.py
   ```
   Backend should be running on `http://localhost:5000`

2. **Check Frontend is Running**
   ```bash
   npm run dev
   ```
   Frontend should be running on `http://localhost:5173`

3. **Reinitialize Database** (if accounts don't exist)
   ```bash
   cd backend
   rm instance/scheduler.db
   python init_db.py
   ```

## Password Requirements

When changing passwords:
- Minimum 6 characters
- Can include letters, numbers, and special characters

## Security Notes

1. **Password Storage**: All passwords are hashed using PBKDF2-SHA256
2. **Session Security**: Sessions are managed with localStorage (24-hour expiry)

## Resetting Admin Accounts

If you need to reset the admin accounts:

1. Delete the database:
   ```bash
   cd backend
   rm instance/scheduler.db
   ```

2. Reinitialize:
   ```bash
   python init_db.py
   ```

This will recreate all 4 admin accounts with default passwords.
