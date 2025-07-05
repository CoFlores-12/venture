# Venture Admin System

## Overview
This document describes the administrator login system for the Venture event platform.

## Features

### Admin Authentication
- **Separate admin login**: Administrators have their own login page with additional security
- **Admin code requirement**: Administrators must provide a special admin code in addition to email and password
- **Role-based access**: Only users with admin role can access the admin dashboard
- **Session management**: Secure session handling with NextAuth.js

### Admin Dashboard
The admin dashboard provides comprehensive metrics and management tools:

#### Key Metrics
- **Total Events**: Number of all events in the platform
- **Pending Events**: Events awaiting approval
- **Total Users**: Number of registered users
- **Total Sales**: Revenue generated from ticket sales
- **Total Commissions**: Platform commissions earned

#### Dashboard Features
- **Real-time metrics**: Live updates of platform statistics
- **Recent events**: List of latest events with approval status
- **Quick actions**: Fast access to common admin tasks
- **Activity feed**: Recent platform activities and notifications
- **Responsive design**: Works on desktop and mobile devices

## Access Information

### Default Admin Credentials
- **Email**: admin@venture.com
- **Password**: admin123
- **Admin Code**: VENTURE2024

### How to Access
1. Go to the main login page (`/register`)
2. Click on "¿Eres un Administrador?" link
3. Enter the admin credentials
4. You'll be redirected to the admin dashboard

## Security Notes

### Production Considerations
- **Password hashing**: In production, implement proper password hashing (bcrypt)
- **Database storage**: Replace in-memory storage with a proper database
- **Admin code security**: Use environment variables for admin codes
- **Rate limiting**: Implement rate limiting for login attempts
- **Two-factor authentication**: Consider adding 2FA for admin accounts

### Current Implementation
- Uses NextAuth.js for authentication
- Credentials provider for admin login
- Session-based authentication
- Role-based access control

## File Structure

```
app/
├── admin/
│   ├── login/
│   │   └── page.js          # Admin login/signup page
│   └── dashboard/
│       └── page.js          # Admin dashboard
├── api/
│   ├── auth/
│   │   └── [...nextauth]/
│   │       └── route.js     # NextAuth configuration
│   └── admin/
│       └── register/
│           └── route.js     # Admin registration API
└── register/
    └── page.js              # Main login page (updated with admin link)
```

## API Endpoints

### Admin Registration
- **POST** `/api/admin/register`
  - Registers a new admin user
  - Requires: name, email, password, adminCode
  - Returns: success message and admin data

### Admin List
- **GET** `/api/admin/register`
  - Returns list of admin users (without sensitive data)

## Customization

### Adding New Metrics
To add new metrics to the dashboard:

1. Update the `stats` state in `app/admin/dashboard/page.js`
2. Add new metric card to the `metricCards` array
3. Update the API calls to fetch real data

### Styling
The admin system uses:
- Tailwind CSS for styling
- DaisyUI components
- Framer Motion for animations
- Dark mode support

### Authentication Flow
1. User clicks "¿Eres un Administrador?" on main login
2. Redirected to `/admin/login`
3. Enters credentials including admin code
4. NextAuth validates credentials
5. If valid, redirected to `/admin/dashboard`
6. Dashboard checks for admin role
7. If not admin, redirected back to login

## Troubleshooting

### Common Issues
1. **Login not working**: Verify admin code is correct
2. **Dashboard not loading**: Check if user has admin role
3. **Session issues**: Clear browser cookies and try again

### Development
- Run `npm run dev` to start development server
- Admin system is available at `/admin/login`
- Dashboard is available at `/admin/dashboard`

## Future Enhancements
- [ ] Database integration (Prisma/PostgreSQL)
- [ ] Password hashing with bcrypt
- [ ] Email verification for admin accounts
- [ ] Two-factor authentication
- [ ] Admin user management interface
- [ ] Event approval workflow
- [ ] Advanced analytics and reporting
- [ ] Audit logs for admin actions 