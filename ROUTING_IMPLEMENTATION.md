# Routing Implementation Documentation

## Overview
The application now has a complete routing structure with separate views for landing, student, and admin users.

## Route Structure

### 1. Landing Page (`/`)
**Component**: `LandingPage.jsx`

**Features**:
- Professional hero section with project name and description
- Two primary action buttons:
  - "Student View" → Redirects to `/student`
  - "Admin Login" → Redirects to `/login`
- Feature showcase grid highlighting:
  - Smart Scheduling
  - Instructor Management
  - Course Catalog
- Statistics section
- Professional footer
- Admin Login button in header

**Design**:
- Clean, academic aesthetic
- Gradient background
- Responsive layout
- No emojis (professional tone)

### 2. Login Page (`/login`)
**Component**: `LoginPage.jsx`

**Features**:
- Standard admin authentication form
- Username and password fields
- Error handling with visual feedback
- Loading states
- Default credentials displayed for convenience
- On successful login → Redirects to `/admin`

**Security**:
- Session-based authentication
- Password hashing on backend
- Credentials validation

### 3. Student View (`/student`)
**Component**: `StudentLayout.jsx`

**Features**:
- **Navbar** with:
  - Logo and "Student View" label
  - Navigation links (Dashboard, Courses, Calendar)
  - Dark mode toggle
  - Theme selector
  - Admin Login button (redirects to `/login`)
- **Info Banner**: Explains student view limitations
- **Read-only Access**:
  - View Dashboard statistics
  - Browse course catalog
  - Search and filter classes
  - View calendar with academic events
- **Restrictions**:
  - No "Add Class" button
  - No "Edit" buttons
  - No "Delete" buttons
  - No enrollment functionality (info only)

**Capabilities**:
- Search classes by course code, instructor, or room
- Sort classes by various criteria
- View class details (time, room, capacity, enrollment)
- View academic calendar
- Toggle dark mode
- Select custom themes

### 4. Admin Dashboard (`/admin`)
**Component**: `AdminLayout.jsx`

**Features**:
- **Full Admin Access**:
  - Sidebar navigation
  - Dashboard with statistics
  - Class schedule management
  - Calendar view
- **Admin Capabilities**:
  - Add new classes
  - Edit existing classes
  - Delete classes
  - Generate AI schedules
  - Upload academic calendars
  - Export to CSV
  - QR code generation
  - Grade calculator
  - Waitlist management
- **Authentication Required**:
  - Checks auth status on mount
  - Redirects to `/login` if not authenticated
  - Logout functionality
  - Password change option
- **Student Preview Mode**:
  - Toggle to preview student view
  - Maintains admin session

## Component Architecture

### App.jsx
- Root component with React Router setup
- Defines all routes
- Handles login logic
- Provides navigation structure

### Layout Components

#### LandingPage
- Standalone component
- No authentication required
- Marketing/informational focus

#### StudentLayout
- Self-contained student experience
- Fetches data from backend
- No authentication required
- Read-only operations

#### AdminLayout
- Protected route (requires authentication)
- Full CRUD operations
- Session management
- All admin features

## Navigation Flow

```
Landing Page (/)
    ├─→ Student View (/student)
    │   └─→ Admin Login (/login) → Admin Dashboard (/admin)
    │
    └─→ Admin Login (/login)
        └─→ Admin Dashboard (/admin)
            └─→ Logout → Landing Page (/)
```

## Authentication Flow

1. **Unauthenticated User**:
   - Lands on `/` (Landing Page)
   - Can access `/student` (no auth required)
   - Clicking "Admin Login" → `/login`

2. **Login Process**:
   - User enters credentials at `/login`
   - Backend validates and creates session
   - On success → Redirect to `/admin`
   - On failure → Show error message

3. **Authenticated Admin**:
   - Access to `/admin` dashboard
   - Session persists across page refreshes
   - Can logout → Returns to `/`

4. **Session Validation**:
   - AdminLayout checks auth on mount
   - If not authenticated → Redirect to `/login`
   - Uses `checkAuth()` API call

## Key Features by Route

### Landing Page Features
- Hero section with call-to-action
- Feature highlights
- Statistics showcase
- Professional design
- Responsive layout

### Student View Features
- Browse all courses
- Search functionality
- Sort and filter
- View calendar
- Dark mode
- Theme customization
- No modification capabilities

### Admin Dashboard Features
- Full class management
- Instructor availability tracking
- Section management
- Conflict detection
- AI schedule generation
- Academic calendar upload
- Export functionality
- User management
- Password change

## Styling Consistency

All routes maintain:
- Consistent color scheme (slate-based)
- Dark mode support
- Theme customization
- Professional typography
- Responsive design
- Smooth transitions

## Data Flow

### Student View
```
StudentLayout → Backend API → Display Data
(Read-only, no state persistence)
```

### Admin Dashboard
```
AdminLayout ↔ Backend API ↔ Database
(Full CRUD, state management, localStorage sync)
```

## Security Considerations

1. **Route Protection**:
   - Admin routes check authentication
   - Redirect to login if not authenticated

2. **Session Management**:
   - Server-side sessions
   - Secure cookies
   - Session validation on protected routes

3. **Data Access**:
   - Student view: Read-only API access
   - Admin view: Full API access (authenticated)

## Testing Checklist

- [ ] Landing page loads correctly
- [ ] "Student View" button navigates to `/student`
- [ ] "Admin Login" button navigates to `/login`
- [ ] Student view displays classes without auth
- [ ] Student view has no edit/delete buttons
- [ ] Admin login button in student navbar works
- [ ] Login page validates credentials
- [ ] Successful login redirects to `/admin`
- [ ] Failed login shows error message
- [ ] Admin dashboard requires authentication
- [ ] Unauthenticated access to `/admin` redirects to `/login`
- [ ] Logout returns to landing page
- [ ] Dark mode persists across routes
- [ ] Theme selection persists across routes
- [ ] Back button navigation works correctly
- [ ] Direct URL access works for all routes
- [ ] Unknown routes redirect to landing page

## File Structure

```
src/
├── App.jsx (Router setup)
├── main.jsx (Entry point)
├── api.js (API functions)
├── components/
│   ├── LandingPage.jsx (/)
│   ├── LoginPage.jsx (/login)
│   ├── StudentLayout.jsx (/student)
│   ├── AdminLayout.jsx (/admin)
│   ├── Sidebar.jsx (Admin only)
│   ├── Header.jsx (Admin only)
│   ├── Dashboard.jsx (Shared)
│   ├── ScheduleView.jsx (Shared)
│   ├── CalendarView.jsx (Shared)
│   └── ... (other components)
```

## Environment Setup

### Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Backend server (separate terminal)
cd backend
python app.py
```

### Access Points
- Landing: http://localhost:5173/
- Student: http://localhost:5173/student
- Login: http://localhost:5173/login
- Admin: http://localhost:5173/admin

## Future Enhancements

1. **Student Authentication**:
   - Student login system
   - Personal schedules
   - Enrollment functionality

2. **Enhanced Navigation**:
   - Breadcrumbs
   - Back button handling
   - Route transitions

3. **Additional Routes**:
   - `/about` - About page
   - `/contact` - Contact form
   - `/help` - Help documentation

4. **SEO Optimization**:
   - Meta tags per route
   - Open Graph tags
   - Sitemap generation
