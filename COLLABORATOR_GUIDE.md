# 📘 CSE327 Academic Scheduler - Collaborator Guide

This guide provides step-by-step instructions for all team members to set up and run the project on their devices.

---

## 📁 Project Structure Overview

```
CSE327/
├── src/                          # React Frontend (replicated from razwan/)
│   ├── components/               # UI Components
│   │   ├── Sidebar.jsx
│   │   ├── Header.jsx
│   │   ├── Dashboard.jsx
│   │   ├── ScheduleView.jsx
│   │   ├── AddClassModal.jsx
│   │   └── AIScheduleModal.jsx
│   ├── App.jsx                   # Main application
│   ├── App.css                   # Global styles
│   ├── api.js                    # API client for backend
│   └── main.jsx                  # Entry point
│
├── backend/                      # Flask Backend (replicated from razwan/)
│   ├── app.py                    # Flask API server
│   └── requirements.txt          # Python dependencies
│
├── razwan/                       # 🔒 BACKUP - Original collaborator folder (DO NOT DELETE)
│   └── (full project backup)
│
├── pb_data/                      # PocketBase data (existing)
├── pb_hooks/                     # PocketBase hooks (existing)
├── pb_migrations/                # PocketBase migrations (existing)
├── pocketbase.exe                # PocketBase server (existing)
│
├── package.json                  # Node.js dependencies
├── vite.config.js                # Vite build configuration
├── index.html.react              # React entry HTML (rename to use React version)
├── index.html                    # Current static HTML version
└── COLLABORATOR_GUIDE.md         # This file
```

---

## 🚀 Quick Start Guide

### Prerequisites

Before running the project, ensure you have:

| Tool | Version | Download Link |
|------|---------|---------------|
| Node.js | 18+ | https://nodejs.org/ |
| Python | 3.11+ | https://www.python.org/downloads/ |
| Git | Latest | https://git-scm.com/ |

---

## 📦 STEP 1: Clone the Repository

```bash
git clone <your-repo-url>
cd CSE327
```

---

## 🎨 STEP 2: Run the React Frontend

### Terminal 1 - Frontend

```bash
# Navigate to project root
cd D:\cse327\CSE327

# Install Node dependencies
npm install

# If you want to use the React version, rename the index file:
# (Windows)
ren index.html index.html.static
ren index.html.react index.html

# Start the development server
npm run dev
```

The frontend will start at: **http://localhost:5173**

---

## 🐍 STEP 3: Run the Flask Backend

### Terminal 2 - Backend (Open a NEW terminal)

```bash
# Navigate to backend folder
cd D:\cse327\CSE327\backend

# Create Python virtual environment (first time only)
python -m venv venv

# Activate virtual environment
# Windows:
327TP\Scripts\activate

# macOS/Linux:
# source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# Run the Flask server
python app.py
```

The backend will start at: **http://127.0.0.1:5000**

---

## 🗄️ STEP 4: Initialize the Database

Open your browser and make a POST request to initialize the database:

**Option A: Using Browser**
Navigate to: `http://127.0.0.1:5000/api/init` and use a REST client

**Option B: Using curl (Terminal)**
```bash
curl -X POST http://127.0.0.1:5000/api/init
```

**Option C: Using PowerShell**
```powershell
Invoke-WebRequest -Uri "http://127.0.0.1:5000/api/init" -Method POST
```

---

## ✅ STEP 5: Verify Everything Works

1. Open **http://localhost:5173** in your browser
2. You should see the Academic Scheduler interface
3. Try adding a class - if successful, the backend is working!

---

## 🔍 View Database (SQLite)

To inspect the database visually:

### Option 1: DB Browser for SQLite (Recommended)
1. Download from https://sqlitebrowser.org/
2. Open `backend/scheduler.db`
3. Browse tables and data

### Option 2: VS Code Extension
1. Install "SQLite" or "SQLite Viewer" extension
2. Open `backend/scheduler.db` in VS Code

### Option 3: API Endpoint
Visit: `http://127.0.0.1:5000/api/classes` to see all classes as JSON

---

## 🔧 Troubleshooting

### ❌ "No Python at..." Error
The virtual environment points to a missing Python installation.
**Fix:** Recreate the virtual environment:
```bash
cd backend
rmdir /s venv  # Windows
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

### ❌ "npm not found" Error
Node.js is not installed or not in PATH.
**Fix:** Install Node.js from https://nodejs.org/

### ❌ "CORS Error" in Browser Console
The Flask backend is not running.
**Fix:** Start the backend server with `python app.py`

### ❌ "Insert/Update failed" Notification
- Backend not running
- Database not initialized
- Missing required fields

**Fix:** 
1. Ensure backend is running (`python app.py`)
2. Initialize the database (POST to `/api/init`)

### ❌ Port Already in Use
Another process is using port 5173 or 5000.
**Fix:** 
```bash
# Find and kill the process (Windows)
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

---

## 🔄 Git Workflow for Collaborators

### Before Starting Work
```bash
git pull origin main
```

### After Making Changes
```bash
git add .
git commit -m "Your descriptive message"
git push origin main
```

### Creating a Feature Branch
```bash
git checkout -b feature/your-feature-name
# ... make changes ...
git add .
git commit -m "Add your feature"
git push origin feature/your-feature-name
# Then create a Pull Request on GitHub
```

---

## 📌 Important Notes

1. **DO NOT DELETE the `razwan/` folder** - It serves as a backup checkpoint
2. **DO NOT commit `node_modules/`** - It's in `.gitignore`
3. **DO NOT commit `backend/venv/`** - Each collaborator creates their own
4. **DO NOT commit `backend/scheduler.db`** - Each collaborator has their own database

---

## 🛠️ Tech Stack Summary

| Layer | Technology |
|-------|------------|
| Frontend | React 19 + Vite + Tailwind CSS |
| Backend | Flask (Python) + Flask-SQLAlchemy |
| Database | SQLite (file-based) |
| Icons | Lucide React |
| AI Feature | Claude API (Anthropic) |

---

## 📞 Need Help?

If you encounter issues:
1. Check this guide first
2. Check the `README.md` file
3. Ask your team lead
4. Create an issue on GitHub

---

**Happy Coding! 🚀**

