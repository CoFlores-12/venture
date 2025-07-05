# Admin Schema Documentation

## Overview
The admin authentication system uses a centralized schema to avoid duplication and maintain consistency across the application.

## Schema Structure

### Admin User Object
```javascript
{
  id: "string",           // Unique identifier
  name: "string",         // Full name of the admin
  email: "string",        // Email address (used for login)
  password: "string",     // Password (should be hashed in production)
  adminCode: "string",    // Special admin access code
  role: "admin"           // Always "admin" for admin users
}
```

### Default Admin Credentials
- **Email**: admin@venture.com
- **Password**: admin123
- **Admin Code**: VENTURE2024

## File Structure

### Centralized Configuration
- **`app/lib/admin-config.js`** - Single source of truth for admin configuration
  - Contains admin schema definition
  - Stores admin users in memory
  - Provides helper functions for admin operations

### API Routes
- **`app/api/auth/[...nextauth]/route.js`** - NextAuth configuration
  - Uses centralized admin config for authentication
  - No longer contains duplicate admin schema

- **`app/api/admin/register/route.js`** - Admin registration API
  - Uses centralized admin config for user management
  - No longer contains duplicate admin schema

## Helper Functions

### `findAdminByCredentials(email, password, adminCode)`
Finds an admin user by matching all three credentials.

### `findAdminByEmail(email)`
Finds an admin user by email address.

### `addAdminUser(adminData)`
Creates and adds a new admin user to the system.

### `getSafeAdminList()`
Returns a list of admin users without sensitive data (password, adminCode).

## Security Considerations

### Current Implementation (Development)
- Admin credentials are hardcoded in the configuration file
- Passwords are stored in plain text
- Admin code is hardcoded
- Data is stored in memory (lost on server restart)

### Production Recommendations
1. **Environment Variables**: Move sensitive data to environment variables
   ```javascript
   // .env.local
   ADMIN_EMAIL=admin@venture.com
   ADMIN_PASSWORD=hashed_password_here
   ADMIN_CODE=secure_admin_code_here
   ```

2. **Password Hashing**: Use bcrypt or similar for password hashing
   ```javascript
   import bcrypt from 'bcrypt';
   const hashedPassword = await bcrypt.hash(password, 10);
   ```

3. **Database Storage**: Replace in-memory storage with a proper database
   ```javascript
   // Using Prisma (recommended)
   const admin = await prisma.adminUser.findUnique({
     where: { email: credentials.email }
   });
   ```

4. **Admin Code Security**: Use environment variables for admin codes
   ```javascript
   const ADMIN_CODE = process.env.ADMIN_REGISTRATION_CODE;
   ```

## Migration Path

### Step 1: Environment Variables
1. Create `.env.local` file
2. Move admin credentials to environment variables
3. Update `admin-config.js` to use `process.env`

### Step 2: Database Integration
1. Set up Prisma with PostgreSQL
2. Create admin user model
3. Replace in-memory storage with database calls

### Step 3: Password Hashing
1. Install bcrypt: `npm install bcrypt`
2. Hash passwords before storage
3. Update authentication to compare hashed passwords

### Step 4: Enhanced Security
1. Implement rate limiting
2. Add two-factor authentication
3. Set up audit logging
4. Implement session management

## Benefits of Centralized Schema

1. **Single Source of Truth**: All admin-related code uses the same schema
2. **Easier Maintenance**: Changes only need to be made in one place
3. **Consistency**: No risk of schema mismatches between files
4. **Better Testing**: Centralized configuration is easier to test
5. **Clearer Architecture**: Separation of concerns between config and implementation

## Usage Examples

### Authentication (NextAuth)
```javascript
import { findAdminByCredentials } from '../../../lib/admin-config';

const admin = findAdminByCredentials(email, password, adminCode);
```

### Registration
```javascript
import { addAdminUser, findAdminByEmail } from '../../../lib/admin-config';

const existingAdmin = findAdminByEmail(email);
const newAdmin = addAdminUser({ name, email, password, adminCode });
```

### Listing Admins
```javascript
import { getSafeAdminList } from '../../../lib/admin-config';

const admins = getSafeAdminList(); // Returns admins without sensitive data
``` 