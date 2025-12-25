# Login Redirect Issue - Troubleshooting Guide

## Current Status
Login credentials work, but after successful login, you're redirected back to the login page.

## Quick Test Steps

### Test 1: Backend Session Test (PowerShell)
```powershell
powershell -ExecutionPolicy Bypass -File test_login_flow.ps1
```
**Expected**: Should show "SUCCESS: Session is working!"
**If it fails**: Backend issue - restart backend

### Test 2: Browser Cookie Test
1. Open `test_cookie.html` in your browser
2. Click "1. Test Login" - should show success
3. Click "2. Test Auth Check" - should show authenticated
4. If Test 2 fails, cookies aren't working in browser

### Test 3: Check Browser Console
1. Open http://localhost:5173/login
2. Press F12 to open DevTools
3. Go to Console tab
4. Clear console
5. Try logging in
6. Look for these messages:
   ```
   LoginPage: Attempting login...
   LoginPage: Login successful
   api.js: Calling checkAuth...
   api.js: checkAuth response data: {authenticated: true/false}
   AdminLayout: User authenticated (or Not authenticated)
   ```

## Common Issues & Solutions

### Issue 1: "Failed to fetch" error
**Symptom**: Login button shows "Failed to fetch"
**Cause**: Backend not running or wrong URL
**Solution**:
```powershell
cd backend
python app.py
```
Make sure it says "Running on http://127.0.0.1:5000"

### Issue 2: Login succeeds but redirects back
**Symptom**: Console shows "Login successful" but then "Not authenticated"
**Cause**: Cookie not being sent with auth check request
**Solution**:
1. Check if frontend URL is `localhost:5173` (NOT `127.0.0.1:5173`)
2. Clear browser cookies and cache
3. Restart both frontend and backend

### Issue 3: CORS errors in console
**Symptom**: Red CORS errors in browser console
**Cause**: CORS configuration issue
**Solution**: Backend should be restarted with latest changes

### Issue 4: Cookie domain mismatch
**Symptom**: Cookie set for `127.0.0.1` but frontend on `localhost`
**Cause**: URL mismatch
**Solution**: 
- Frontend MUST use: `http://localhost:5173`
- Backend MUST use: `http://localhost:5000`
- Never mix `localhost` and `127.0.0.1`

## Step-by-Step Debug Process

### Step 1: Verify Backend
```powershell
# Check if backend is running
curl http://localhost:5000/api/classes

# Should return JSON with classes
```

### Step 2: Clear Browser Data
1. F12 → Application tab
2. Clear all cookies for `localhost`
3. Clear Local Storage
4. Close DevTools
5. Hard refresh (Ctrl+Shift+R)

### Step 3: Test Login with Console Open
1. F12 → Console tab
2. Go to login page
3. Enter: admin1 / Admin@123
4. Watch console logs
5. Copy ALL console output

### Step 4: Check Network Tab
1. F12 → Network tab
2. Clear network log
3. Try login
4. Check these requests:
   - POST `/api/auth/login` → Status 200?
   - GET `/api/auth/check` → Status 200?
5. Click on `/api/auth/check`
6. Check "Request Headers" → Should have `Cookie: session=...`

### Step 5: Check Cookies
1. F12 → Application tab
2. Cookies → `http://localhost:5000`
3. Should see `session` cookie
4. Check properties:
   - Domain: `localhost`
   - Path: `/`
   - SameSite: `Lax`

## What to Report

If still not working, please provide:

1. **Console logs** (from Step 3)
2. **Network tab** (status codes from Step 4)
3. **Cookie details** (from Step 5)
4. **Backend terminal output** (last 20 lines)

## Files Changed
- `src/api.js` - Changed BASE to `localhost:5000`
- `src/components/LoginPage.jsx` - Added logging
- `src/components/AdminLayout.jsx` - Added logging
- `backend/app.py` - Fixed CORS and session config

## Restart Everything

If all else fails:
```powershell
# Stop all terminals (Ctrl+C in each)

# Restart backend
cd backend
python app.py

# Restart frontend (in new terminal)
npm run dev

# Clear browser completely
# F12 → Application → Clear storage → Clear site data
# Close and reopen browser
```
