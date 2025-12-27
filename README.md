# Academic Class Scheduler

A modern, AI-powered class scheduling system built with React, featuring both manual class entry and AI-generated schedule optimization.

## 🌟 Features

### Two Ways to Add Classes:
1. **Manual Entry** - Add classes one by one with full control
2. **AI Schedule Generator** - Input instructor availability and get 3 optimized schedule options

### Core Features:
- 📊 **Dashboard** with analytics and statistics
- 🎓 **Student View** with enrollment and favorites
- 🔍 **Search & Filter** classes
- 📤 **Export to CSV**
- 🌙 **Dark Mode** support
- 🔔 **Real-time Notifications**
- ⭐ **Favorites System**
- ✅ **Conflict Detection**
- 💾 **Local Storage** persistence

## 📁 Project Structure

```
scheduler-app/
├── src/
│   ├── components/
│   │   ├── Sidebar.jsx           # Navigation sidebar
│   │   ├── Header.jsx             # Top header with actions
│   │   ├── Dashboard.jsx          # Analytics dashboard
│   │   ├── ScheduleView.jsx       # Class schedule table
│   │   ├── AddClassModal.jsx      # Manual class entry form
│   │   └── AIScheduleModal.jsx    # AI schedule generator
│   ├── App.jsx                    # Main application component
│   ├── App.css                    # Global styles
│   └── main.jsx                   # Application entry point
├── package.json
└── README.md
```

## 🚀 Installation

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Install lucide-react (for icons):**
   ```bash
   npm install lucide-react
   ```

3. **Start Development Server:**
   ```bash
   npm run dev
   ```

4. **Build for Production:**
   ```bash
   npm run build
   ```

## 🎯 Component Breakdown

### **App.jsx**
- Main application state management
- Handles data persistence (localStorage)
- Coordinates between all components

### **Sidebar.jsx**
- Navigation menu
- View switching (Dashboard/Schedule/Student)
- Dark mode toggle
- User profile section

### **Header.jsx**
- Page title
- Notifications dropdown
- Export CSV button
- AI Schedule & Add Class buttons

### **Dashboard.jsx**
- Statistics cards (Total Classes, Students, Utilization)
- Popular courses ranking
- Time slot distribution chart

### **ScheduleView.jsx**
- Sortable class table
- Search functionality
- Student enrollment/favorites
- Admin edit/delete actions

### **AddClassModal.jsx**
- Manual class entry form
- Edit existing classes
- Validation and conflict checking

### **AIScheduleModal.jsx**
- Instructor availability input
- Multiple instructor management
- AI-powered schedule generation
- 3 optimized schedule options
- Apply schedule to system

## 🤖 AI Schedule Generator

The AI Schedule Generator uses Claude AI to create optimized class schedules:

1. **Input:** Instructor name, course, preferred days, available times, room preference
2. **Processing:** AI analyzes constraints and generates 3 different optimal schedules
3. **Output:** Three schedule options with rationale for each assignment
4. **Apply:** Select and apply your preferred schedule

### Requirements for AI Generation:
- Instructor name
- Course code
- At least one preferred day
- At least one available time slot

## 🎨 Styling

The project uses:
- **Tailwind CSS** (via CDN in index.html)
- **Custom CSS** for scrollbars and animations
- **Lucide React** for icons
- **Inter Font** from Google Fonts

## 💾 Data Persistence

All data is stored in browser localStorage:
- Classes list
- Favorites
- Enrolled classes
- Dark mode preference

## 🔧 Configuration Files Needed

Make sure you have these files in your project root:

1. **index.html** - Include Tailwind CDN
2. **vite.config.js** - Vite configuration
3. **eslint.config.js** - ESLint configuration

## 📝 Usage

### Admin Mode:
- Add classes manually or via AI
- Edit/delete existing classes
- View dashboard analytics
- Export schedules to CSV

### Student Mode:
- View available classes
- Enroll/drop classes
- Mark favorites
- Conflict detection on enrollment

## 🎓 Future Enhancements

- Backend integration
- User authentication
- Email notifications
- Calendar integration
- PDF export
- Multi-semester support

## 📄 License

MIT License - feel free to use this project for educational purposes!
