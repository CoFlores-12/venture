# Admin Login Guide - Venture

## 🔑 Default Admin Credentials

**Email**: `admin@venture.com`  
**Password**: `admin123`  
**Admin Code**: `VENTURE2024`

## 🚀 How to Access Admin Panel

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **Navigate to admin login**:
   ```
   http://localhost:3000/admin/login
   ```

3. **Enter the credentials**:
   - Email: `admin@venture.com`
   - Password: `admin123`
   - Admin Code: `VENTURE2024`

4. **Click "Iniciar Sesión"**

## 🔧 Troubleshooting

### Issue: "Login doesn't perform"

**Possible causes and solutions:**

1. **Server not running**
   - Make sure `npm run dev` is running
   - Check terminal for any errors

2. **Wrong credentials**
   - Double-check email, password, and admin code
   - All fields are case-sensitive

3. **Browser cache issues**
   - Clear browser cache and cookies
   - Try incognito/private mode

4. **Network issues**
   - Check if localhost:3000 is accessible
   - Try refreshing the page

### Issue: "Redirected to login repeatedly"

**This usually means:**
- Session cookie not being set properly
- Middleware not recognizing the session
- Browser blocking cookies

**Solutions:**
1. Check browser console for errors
2. Ensure cookies are enabled
3. Try a different browser

### Issue: "API errors"

**Check the browser's Network tab:**
1. Open Developer Tools (F12)
2. Go to Network tab
3. Try logging in
4. Look for failed requests to `/api/admin/auth`

## ✅ **Working Solution**

The admin authentication system is now working correctly with:

- **Secure cookie settings** optimized for development
- **Proper middleware protection** for all admin routes
- **Separate authentication system** from regular users
- **Automatic session validation** and expiration

## 🧪 Testing the API

The admin authentication system has been tested and is working correctly. You can verify by:

1. **Logging in** with the credentials above
2. **Accessing the dashboard** at `/admin/dashboard`
3. **Testing logout** from the dashboard
4. **Verifying session persistence** by refreshing the page

## 📁 File Structure

```
app/
├── admin/
│   ├── layout.js              # Admin layout with AuthProvider
│   ├── login/page.js          # Admin login page
│   ├── dashboard/page.js      # Admin dashboard
│   ├── users/page.js          # User management
│   └── events/page.js         # Event petitions
├── api/admin/auth/
│   ├── route.js               # Login/logout API
│   └── check/route.js         # Session validation
├── hooks/
│   └── useAdminAuth.js        # Admin auth context
├── lib/
│   └── admin-config.js        # Admin credentials
└── middleware.js              # Route protection
```

## 🔒 Security Features

- **HTTP-only cookies** (prevents XSS)
- **Path restriction** (`/admin` only)
- **Session expiration** (7 days)
- **Middleware protection** (all admin routes)
- **Separate from user auth** (no privilege escalation)

## 🚨 Important Notes

1. **Development only**: These credentials are for development. In production, use environment variables and database storage.

2. **Session management**: Admin sessions are completely separate from regular user sessions.

3. **Route protection**: All `/admin/*` routes require valid admin session.

4. **Logout**: Use the logout button in the admin dashboard to properly clear the session.

## 🆘 Still Having Issues?

1. **Check the console** for JavaScript errors
2. **Check the Network tab** for failed API calls
3. **Verify the server is running** on localhost:3000
4. **Try the test script** to isolate the issue
5. **Clear browser data** and try again

If the issue persists, check the server logs for any backend errors. 