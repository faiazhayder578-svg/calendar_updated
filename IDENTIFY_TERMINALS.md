# How to Identify Your Backend and Frontend Terminals

## Quick Identification

### Backend Terminal (Flask/Python)
Look for output like:
```
 * Serving Flask app 'app'
 * Debug mode: on
 * Running on http://127.0.0.1:5000
Press CTRL+C to quit
 * Restarting with stat
 * Debugger is active!
```

**Key indicators:**
- Shows "Flask app"
- Shows "Running on http://127.0.0.1:5000"
- Shows "Debug mode: on"
- May show login attempt logs

### Frontend Terminal (Vite/npm)
Look for output like:
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
➜  press h + enter to show help
```

**Key indicators:**
- Shows "VITE"
- Shows "http://localhost:5173/"
- Shows "ready in xxx ms"
- May show HMR (Hot Module Replacement) updates

## What to Do

### Step 1: Close All Extra Terminals
You only need 2 terminals:
1. One for backend
2. One for frontend

Close the other 4 terminals.

### Step 2: Restart Backend
In one terminal:
```bash
cd backend
python app.py
```

Wait for:
```
 * Running on http://127.0.0.1:5000
```

### Step 3: Restart Frontend
In a NEW terminal:
```bash
npm run dev
```

Wait for:
```
➜  Local:   http://localhost:5173/
```

### Step 4: Try Login Again
Go to: http://localhost:5173/login
Enter: admin1 / Admin@123

## If Still "Failed to Fetch"

The issue is likely that the frontend is trying to connect to `http://127.0.0.1:5000` but your browser might be blocking it.

### Quick Fix:
1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for the exact error message
4. Take a screenshot and share it

## Common Terminal Confusion

If you see 6 terminals, they might be:
1. Backend (running Flask) ✓ Keep this
2. Frontend (running Vite) ✓ Keep this
3. Old backend instance ✗ Close
4. Old frontend instance ✗ Close
5. Test/diagnostic script ✗ Close
6. Empty terminal ✗ Close

## Clean Start Instructions

### 1. Close ALL Terminals
- Close all 6 terminals
- This will stop all processes

### 2. Open NEW Terminal #1 - Backend
```bash
cd backend
python app.py
```

**Expected output:**
```
 * Serving Flask app 'app'
 * Debug mode: on
WARNING: This is a development server.
 * Running on http://127.0.0.1:5000
Press CTRL+C to quit
```

**Leave this terminal open!**

### 3. Open NEW Terminal #2 - Frontend
```bash
npm run dev
```

**Expected output:**
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

**Leave this terminal open!**

### 4. Test in Browser
1. Open: http://localhost:5173/login
2. Enter: admin1 / Admin@123
3. Click Login

## Still Getting "Failed to Fetch"?

This means the frontend cannot reach the backend. Try this:

### Test Backend Directly
Open a browser tab and go to:
```
http://127.0.0.1:5000/api/classes
```

**If you see `[]` or JSON data:** Backend is working!

**If you see an error:** Backend is not running properly.

### Check Browser Console
1. Press F12
2. Go to Console tab
3. Try to login
4. Look for red error messages
5. Share the error message

The error will tell us exactly what's wrong!
