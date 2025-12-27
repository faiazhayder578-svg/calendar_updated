# Browser Debugging Steps

## Step 1: Clear Everything
1. Open browser DevTools (F12)
2. Go to **Application** tab (Chrome) or **Storage** tab (Firefox)
3. Under **Cookies**, find `http://localhost:5173` and delete all cookies
4. Under **Local Storage**, find `http://localhost:5173` and clear it
5. Close DevTools and refresh the page (Ctrl+F5)

## Step 2: Open Console and Try Login
1. Open DevTools (F12)
2. Go to **Console** tab
3. Clear the console (click the 🚫 icon)
4. Go to login page: http://localhost:5173/login
5. Enter credentials: `admin1` / `Admin@123`
6. Click Login
7. **WATCH THE CONSOLE** - you should see:
   ```
   LoginPage: Attempting login...
   LoginPage: Login successful, response: {...}
   LoginPage: Navigating to /admin
   AdminLayout: Checking authentication...
   AdminLayout: Auth response: {...}
   ```

## Step 3: Check Network Tab
1. In DevTools, go to **Network** tab
2. Clear network log
3. Try logging in again
4. Look for these requests:
   - **POST** to `/api/auth/login` - should return 200
   - **GET** to `/api/auth/check` - should return 200
5. Click on the `/api/auth/login` request
6. Check **Response Headers** - should include `Set-Cookie: session=...`
7. Click on the `/api/auth/check` request
8. Check **Request Headers** - should include `Cookie: session=...`

## Step 4: Check Cookies
1. In DevTools, go to **Application** tab
2. Expand **Cookies** in left sidebar
3. Click on `http://localhost:5000` (backend domain)
4. You should see a cookie named `session`
5. Check its properties:
   - **Domain**: should be `localhost`
   - **Path**: should be `/`
   - **SameSite**: should be `Lax`
   - **HttpOnly**: should be checked

## What to Report

Please copy and paste:

1. **Console logs** (everything that appears when you try to login)
2. **Network tab** - status codes for login and check requests
3. **Cookie details** - does the session cookie exist? What are its properties?
4. **Any error messages** in red

## Common Issues

### Issue: "AdminLayout: Not authenticated, redirecting to login"
**Cause**: Cookie is not being sent with `/api/auth/check` request
**Check**: 
- Is the cookie domain `localhost` (not `127.0.0.1`)?
- Is the frontend URL `http://localhost:5173` (not `127.0.0.1`)?

### Issue: No session cookie appears
**Cause**: Backend not setting cookie properly
**Check**: Backend terminal logs - should show "Login successful for: admin1"

### Issue: Cookie exists but not sent with requests
**Cause**: CORS or SameSite issue
**Check**: Network tab - Request Headers should include the cookie
