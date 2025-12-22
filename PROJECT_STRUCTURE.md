# Academic Scheduler - Separated Files Structure

This project has been separated into modular, maintainable components for easy development and understanding.

## 📂 Complete File Structure

```
scheduler-app/
│
├── src/
│   ├── components/              # All React components
│   │   ├── Sidebar.jsx          # Left navigation sidebar
│   │   ├── Header.jsx           # Top header with buttons
│   │   ├── Dashboard.jsx        # Analytics dashboard view
│   │   ├── ScheduleView.jsx     # Class schedule table
│   │   ├── AddClassModal.jsx    # Manual class entry modal
│   │   └── AIScheduleModal.jsx  # AI schedule generator modal
│   │
│   ├── App.jsx                  # Main application component
│   ├── App.css                  # Global styles & scrollbar
│   └── main.jsx                 # React entry point
│
├── package.json                 # Dependencies & scripts
└── README.md                    # Installation & usage guide
```

## 🎯 Component Responsibilities

### **1. App.jsx** (Main Controller)
- **Purpose:** Central state management and data coordination
- **State Management:**
  - Classes array
  - Favorites
  - Enrolled classes
  - Dark mode
  - Notifications
  - Student/Admin mode
- **Functions:**
  - Data persistence (localStorage)
  - Add/Edit/Delete classes
  - Enrollment management
  - Conflict detection
  - CSV export

### **2. Sidebar.jsx**
- **Purpose:** Navigation and user profile
- **Features:**
  - Dashboard/Schedule view switching
  - Student view toggle
  - Dark mode toggle
  - User profile display
  - Current view highlighting

### **3. Header.jsx**
- **Purpose:** Top navigation bar with actions
- **Features:**
  - Page title
  - Notifications dropdown
  - Export CSV button
  - AI Schedule button (Admin only)
  - Add Class button (Admin only)

### **4. Dashboard.jsx**
- **Purpose:** Analytics and statistics display
- **Features:**
  - 4 stat cards (Classes, Students, Utilization, Seats)
  - Top 5 popular courses
  - Time slot distribution chart
  - Real-time calculations

### **5. ScheduleView.jsx**
- **Purpose:** Display and manage class schedule
- **Features:**
  - Sortable table (click column headers)
  - Search functionality
  - Status badges (Available/Almost Full/Full)
  - Student actions (Enroll/Drop/Favorite)
  - Admin actions (Edit/Delete)

### **6. AddClassModal.jsx**
- **Purpose:** Manual class entry/editing
- **Features:**
  - Form for class details
  - Validation
  - Works for both Add and Edit modes
  - Conflict checking

### **7. AIScheduleModal.jsx** ⭐
- **Purpose:** AI-powered schedule generation
- **Features:**
  - Multi-instructor input
  - Day/time selection toggles
  - Room preferences
  - AI generation with Claude API
  - Display 3 optimized options
  - Apply selected schedule

## 🔄 Data Flow

```
User Action
    ↓
App.jsx (State Management)
    ↓
Pass props to components
    ↓
Components render & handle events
    ↓
Callback functions update App.jsx state
    ↓
Re-render affected components
    ↓
localStorage updated automatically
```

## 🎨 Styling Approach

- **Tailwind CSS:** Utility-first styling (via CDN)
- **Dark Mode:** Conditional classes based on `isDarkMode` prop
- **Custom CSS:** App.css for scrollbars and animations
- **Icons:** Lucide React components

## 📦 Props Passed Between Components

### App.jsx → Sidebar
- isStudentMode, isDarkMode, activeView
- Functions: setActiveView, toggleStudentView, setIsDarkMode

### App.jsx → Header
- activeView, isDarkMode, isStudentMode, classes, notifications
- Functions: exportToCSV, openAIModal, openModal

### App.jsx → Dashboard
- classes, isDarkMode

### App.jsx → ScheduleView
- classes, isDarkMode, isStudentMode, favorites, enrolledClasses
- searchQuery, sortConfig
- Functions: handleSort, toggleFavorite, handleEnrollment, openModal, handleDelete

### App.jsx → AddClassModal
- isOpen, isDarkMode, editingClass
- Functions: closeModal, handleAddClass

### App.jsx → AIScheduleModal
- isOpen, isDarkMode
- Functions: closeModal, addNotification, applyGeneratedSchedule

## 🚀 Getting Started

1. **Navigate to project:**
   ```bash
   cd scheduler-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development:**
   ```bash
   npm run dev
   ```

## 🔧 Modifying Components

### To add a new feature:

1. **Identify the component** that needs modification
2. **Add state in App.jsx** if needed
3. **Pass props** to the component
4. **Implement logic** in the component
5. **Update callbacks** to modify App.jsx state

### Example: Adding a "Print Schedule" button

1. Add state in **App.jsx** if needed (probably not)
2. Add button in **Header.jsx**
3. Create handlePrint function in **App.jsx**
4. Pass handlePrint to **Header.jsx** as prop
5. Call handlePrint from button onClick

## 💡 Best Practices Used

✅ **Component Separation:** Each component has single responsibility
✅ **Props Drilling:** Data flows top-down explicitly
✅ **State Management:** Centralized in App.jsx
✅ **Reusability:** Components can be reused in different contexts
✅ **Maintainability:** Easy to find and fix issues
✅ **Scalability:** Easy to add new features

## 🎓 Learning Resources

- **React:** https://react.dev
- **Tailwind CSS:** https://tailwindcss.com
- **Lucide Icons:** https://lucide.dev
- **Vite:** https://vitejs.dev

## 📝 Notes

- All components are functional components using hooks
- No external state management (Redux, Context) needed for this app size
- localStorage handles persistence automatically
- Dark mode state preserved across sessions
- AI feature requires API access to Claude (Anthropic)

---

**Happy Coding! 🚀**
