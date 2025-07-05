// Centralized admin configuration
// In production, this should be moved to environment variables and database

export const ADMIN_CONFIG = {
  // Default admin credentials (should be in environment variables in production)
  DEFAULT_ADMIN: {
    id: "1",
    name: "Admin User",
    email: "admin@venture.com",
    password: "admin123", // In production, use hashed passwords
    adminCode: "VENTURE2024",
    role: "admin"
  },
  
  // Admin code for registration (should be in environment variables in production)
  ADMIN_REGISTRATION_CODE: "VENTURE2024",
  
  // Admin user schema structure
  ADMIN_SCHEMA: {
    id: "string",
    name: "string", 
    email: "string",
    password: "string",
    adminCode: "string",
    role: "admin"
  }
};

// In-memory admin users storage (replace with database in production)
export let adminUsers = [
  ADMIN_CONFIG.DEFAULT_ADMIN
];

// Helper functions
export const addAdminUser = (adminData) => {
  const newAdmin = {
    id: (adminUsers.length + 1).toString(),
    ...adminData,
    role: 'admin'
  };
  adminUsers.push(newAdmin);
  return newAdmin;
};

export const findAdminByCredentials = (email, password, adminCode) => {
  return adminUsers.find(
    (user) => 
      user.email === email && 
      user.password === password &&
      user.adminCode === adminCode
  );
};

export const findAdminByEmail = (email) => {
  return adminUsers.find(user => user.email === email);
};

export const getSafeAdminList = () => {
  return adminUsers.map(({ password, adminCode, ...admin }) => admin);
}; 