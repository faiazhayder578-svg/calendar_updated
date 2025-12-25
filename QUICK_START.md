# Quick Start Guide

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- Python 3.7+
- pip (Python package manager)

### Installation

#### 1. Install Backend Dependencies
```bash
cd backend
pip install -r requirements.txt
```

#### 2. Initialize Database
```bash
python init_db.py
```

Expected output:
```
Creating database tables...
Database tables created successfully!
  - Created admin: admin1
  - Created admin: admin2
  - Created admin: admin3
  - Created admin: admin4

Default Admin Credentials:
  Username: admin1 | Password: Admin@123
  Username: admin2 | Password: Admin@456
  Username: admin3 | Password: Admin@789
  Username: admin4 | Password: Admin@000
```

#### 3. Install Frontend Dependencies
```bash
cd ..
npm install
```

### Running the Application

#### Start Backend Server (Terminal 1)
```bash
cd backend
python app.py
```

Backend will run on: `http://localhost:5000`

#### Start Frontend Server (Terminal 2)
```bash
npm run dev
```

Frontend will run on: `http://localhost:5173`

### Accessing the Application

#### Landing Page
Open your browser and navigate to:
```
http://localhost:5173/
```

#### Student View (No Login Required)
```
http://localhost:5173/student
```

Features:
- Browse all courses
- Search and filter
- View calendar
- Read-only access

#### Admin Login
```
http://localhost:5173/login
```

Default credentials:
- Username: `admin1`
- Password: `Admin@123`

#### Admin Dashboard (After Login)
```
http://localhost:5173/admin
```

Features:
- Full class management
- Add/Edit/Delete classes
- Instructor availability tracking
- AI schedule generation
- Academic calendar upload
- Export to CSV
- And more...

## Quick Navigation Guide

### From Landing Page
1. Click "Student View" → Browse courses without login
2. Click "Admin Login" → Login to admin dashboard

### From Student View
1. Click "Admin Login" in navbar → Go to login page
2. Browse courses, search, view calendar
3. Toggle dark mode
4. Select themes

### From Admin Dashboard
1. Use sidebar to navigate between views
2. Click "Logout" to return to landing page
3. Click "Change Password" to update credentials
4. Toggle "Student View" to preview student experience

## Common Tasks

### Adding a New Class (Admin)
1. Login to admin dashboard
2. Click "Add Class" button
3. Fill in course details
4. System checks instructor availability
5. System suggests available sections
6. Click "Create Entry"

### Searching for Courses (Student)
1. Go to student view
2. Use search bar to filter by:
   - Course code
   - Instructor name
   - Room number
3. Sort by clicking column headers

### Uploading Academic Calendar (Admin)
1. Login to admin dashboard
2. Click "Upload Calendar" button
3. Select PDF file
4. System extracts events automatically
5. Review and save

### Changing Admin Password
1. Login to admin dashboard
2. Click "Change Password" in sidebar
3. Enter current password
4. Enter new password (min 6 characters)
5. Confirm new password
6. Click "Change Password"

## Troubleshooting

### Backend Not Starting
- Check if port 5000 is available
- Verify Python dependencies are installed
- Check database file exists in `backend/instance/`

### Frontend Not Starting
- Check if port 5173 is available
- Run `npm install` again
- Clear node_modules and reinstall

### Login Not Working
- Verify backend is running
- Check browser console for errors
- Ensure database is initialized
- Try default credentials: admin1 / Admin@123

### Classes Not Showing
- Verify backend is running
- Check browser console for API errors
- Ensure database has data
- Try refreshing the page

### Instructor Availability Not Working
- Check backend logs for errors
- Verify InstructorTimetable table exists
- Re-run `python init_db.py`

## Development Tips

### Hot Reload
Both frontend and backend support hot reload:
- Frontend: Changes reflect immediately
- Backend: Restart server after code changes

### Debugging
- Frontend: Use browser DevTools
- Backend: Check terminal output
- API calls: Use Network tab in DevTools

### Database Reset
To reset the database:
```bash
cd backend
rm instance/scheduler.db
python init_db.py
```

### Clear Browser Data
To reset frontend state:
1. Open DevTools
2. Go to Application tab
3. Clear localStorage
4. Refresh page

## Project Structure

```
academic-scheduler/
├── backend/
│   ├── app.py (Main backend server)
│   ├── init_db.py (Database initialization)
│   ├── requirements.txt (Python dependencies)
│   └── instance/
│       └── scheduler.db (SQLite database)
├── src/
│   ├── App.jsx (Router configuration)
│   ├── main.jsx (Entry point)
│   ├── api.js (API functions)
│   └── components/
│       ├── LandingPage.jsx (/)
│       ├── LoginPage.jsx (/login)
│       ├── StudentLayout.jsx (/student)
│       └── AdminLayout.jsx (/admin)
├── package.json (Frontend dependencies)
└── vite.config.js (Vite configuration)
```

## Key Features

### Phase 1 Features
- ✅ Admin authentication system
- ✅ Instructor availability tracking
- ✅ Section management (01-10, overflow to 11+)
- ✅ Password hashing and security
- ✅ Real-time conflict detection

### Phase 2 Features
- ✅ Landing page with routing
- ✅ Student view (read-only)
- ✅ Admin dashboard (full access)
- ✅ Separate navigation for each view
- ✅ Protected admin routes

## Support

### Documentation
- `IMPLEMENTATION_SUMMARY.md` - Phase 1 features
- `PHASE2_IMPLEMENTATION_SUMMARY.md` - Phase 2 features
- `ROUTING_IMPLEMENTATION.md` - Routing details
- `backend/README_AUTH.md` - Authentication details

### Common Issues
1. **Port already in use**: Change port in config
2. **Database locked**: Close other connections
3. **CORS errors**: Check backend CORS settings
4. **Session expired**: Login again

## Next Steps

After getting started:
1. Explore the landing page
2. Try student view without login
3. Login as admin
4. Add some test classes
5. Test instructor availability
6. Upload an academic calendar
7. Generate an AI schedule
8. Export data to CSV

## Production Deployment

### Backend
1. Set environment variables
2. Use production WSGI server (gunicorn)
3. Configure proper SECRET_KEY
4. Enable HTTPS
5. Set up database backups

### Frontend
1. Run `npm run build`
2. Deploy dist folder to static hosting
3. Configure server for client-side routing
4. Set up environment variables
5. Enable HTTPS

## Security Checklist

- [ ] Change default admin passwords
- [ ] Set strong SECRET_KEY
- [ ] Enable HTTPS in production
- [ ] Configure CORS properly
- [ ] Regular database backups
- [ ] Monitor authentication logs
- [ ] Keep dependencies updated

## Performance Tips

- Use production build for deployment
- Enable gzip compression
- Optimize images
- Use CDN for static assets
- Monitor API response times
- Implement caching strategies

Enjoy using Academic Scheduler!
