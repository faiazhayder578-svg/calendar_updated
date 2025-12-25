# Troubleshooting "Failed to Fetch" Error

## What This Error Means
"Failed to fetch" means the frontend (React app) cannot connect to the backend (Flask server).

## Quick Fix Steps

### Step 1: Check if Backend is Running

Open a terminal and run:
```bash
cd backend
python app.py
```

**Expected Output:**
```
 * Serving Flask app 'app'
 * Debug mode: on
WARNING: This is a development server. Do not use it in a production deployment.
 * Running on http://127.0.0.1:5000
Press CTRL+C to quit
```

**If you see this, backend is running correctly!**

### Step 2: Verify Backend is Accessible

Open a new browser tab and go to:
```
http://localhost:5000/api/classes
```

**Expected Result:** You should see JSON data (even if empty: `[]`)

**If you see an error or "Cannot connect":** Backend is not running properly.

### Step 3: Check Frontend is Running

In a **separate terminal**, run:
```bash
npm run dev
```

**Expected Output:**
```
VITE v... ready in ...ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

### Step 4: Test the Connection

1. Open browser DevTools (F12)
2. Go to Console tab
3. Try to login
4. Look for error messages

## Common Issues & Solutions

### Issue 1: Backend Not Running
**Symptom:** "Failed to fetch" error
**Solution:**
```bash
cd backend
python app.py
```
Keep this terminal open!

### Issue 2: Wrong Port
**Symptom:** Backend running but still "Failed to fetch"
**Check:** Backend should be on port 5000
**Solution:** Look at backend terminal output, should say "Running on http://127.0.0.1:5000"

### Issue 3: CORS Error
**Symptom:** Error in browser console mentioning CORS
**Solution:** Backend CORS is already configured, but restart backend:
```bash
# Stop backend (Ctrl+C)
# Start again
python app.py
```

### Issue 4: Firewall Blocking
**Symptom:** Connection refused
**Solution:** 
- Check Windows Firewall
- Allow Python through firewall
- Try running as administrator

### Issue 5: Port Already in Use
**Symptom:** Backend won't start, says "Address already in use"
**Solution:**
```bash
# Windows - Kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID_NUMBER> /F

# Then start backend again
python app.py
```

## Step-by-Step Debugging

### 1. Stop Everything
- Close all terminals
- Stop all Python processes
- Stop all Node processes

### 2. Start Backend First
```bash
cd backend
python app.py
```
**Wait for:** "Running on http://127.0.0.1:5000"

### 3. Test Backend Directly
Open browser: `http://localhost:5000/api/classes`
Should see: `[]` or JSON data

### 4. Start Frontend
In NEW terminal:
```bash
npm run dev
```
**Wait for:** "Local: http://localhost:5173/"

### 5. Try Login Again
Go to: `http://localhost:5173/login`
Enter: admin1 / Admin@123

## Check Backend Logs

When you try to login, backend terminal should show:
```
Login attempt for username: admin1
Login successful for: admin1
127.0.0.1 - - [timestamp] "POST /api/auth/login HTTP/1.1" 200 -
```

**If you don't see this:** Backend is not receiving the request

## Check Browser Console

Press F12, go to Console tab, look for:
- Red errors
- Network errors
- CORS errors

Press F12, go to Network tab:
- Try to login
- Look for "login" request
- Check if it's red (failed) or green (success)
- Click on it to see details

## Quick Test Script

Create a file `test_backend.py` in backend folder:
```python
import requests

try:
    response = requests.get('http://localhost:5000/api/classes')
    print(f"✓ Backend is accessible")
    print(f"Status: {response.status_code}")
except Exception as e:
    print(f"✗ Cannot connect to backend: {e}")
```

Run:
```bash
cd backend
pip install requests
python test_backend.py
```

## Still Not Working?

### Check These:

1. **Python Version**
   ```bash
   python --version
   ```
   Should be Python 3.7 or higher

2. **Dependencies Installed**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

3. **Database Exists**
   ```bash
   cd backend
   dir instance
   ```
   Should see `scheduler.db`

4. **Frontend Dependencies**
   ```bash
   npm install
   ```

5. **Clear Browser Cache**
   - Settings → Privacy → Clear browsing data
   - Check "Cookies" and "Cached images"
   - Clear data

6. **Try Different Browser**
   - Chrome
   - Firefox
   - Edge

## Manual Test

### Test Backend Login Endpoint

Open PowerShell:
```powershell
$body = @{
    username = "admin1"
    password = "Admin@123"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method POST -Body $body -ContentType "application/json"
```

**Expected:** Should return user data

**If this works:** Backend is fine, issue is with frontend connection

## Final Checklist

- [ ] Backend running on port 5000
- [ ] Frontend running on port 5173
- [ ] Can access http://localhost:5000/api/classes in browser
- [ ] Can access http://localhost:5173 in browser
- [ ] No firewall blocking
- [ ] No CORS errors in console
- [ ] Backend shows login attempt logs

## Get Help

If still not working, provide:
1. Backend terminal output
2. Frontend terminal output
3. Browser console errors (F12 → Console)
4. Browser network tab (F12 → Network → try login → screenshot)

## Quick Recovery

If nothing works, try complete reset:

```bash
# 1. Stop everything
# Close all terminals

# 2. Backend
cd backend
rm instance/scheduler.db
python init_db.py
python app.py

# 3. Frontend (new terminal)
npm install
npm run dev

# 4. Try login again
```
