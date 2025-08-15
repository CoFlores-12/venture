// Migration script to add lastLogin field to existing users
// Run this once after deploying the schema changes

import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';

// Load environment variables from .env.local
function loadEnv() {
  try {
    const envPath = path.resolve('.env.local');
    const envContent = fs.readFileSync(envPath, 'utf8');
    
    envContent.split('\n').forEach(line => {
      // Skip comments and empty lines
      if (line.trim().startsWith('#') || !line.trim()) return;
      
      const [key, ...valueParts] = line.split('=');
      if (key && valueParts.length > 0) {
        let value = valueParts.join('=').trim();
        
        // Remove surrounding quotes if present
        if ((value.startsWith('"') && value.endsWith('"')) || 
            (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1);
        }
        
        process.env[key.trim()] = value;
      }
    });
    
    console.log('Environment variables loaded from .env.local');
  } catch (error) {
    console.error('Could not load .env.local:', error.message);
  }
}

// Load env first
loadEnv();

// Now import modules that depend on env vars
const User = (await import('../src/models/Users.js')).default;

// Direct MongoDB connection
async function connectToDatabase() {
  const MONGODB_URI = process.env.MONGODB_URI;
  
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI not found in environment variables");
  }
  
  await mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  
  console.log("✅ Connected to MongoDB");
}

async function migrateLastLogin() {
  try {
    await connectToDatabase();

    // Update all existing users that don't have lastLogin field
    const result = await User.updateMany(
      { lastLogin: { $exists: false } },
      { $set: { lastLogin: null } }
    );

    console.log(`Migration completed. Updated ${result.modifiedCount} users.`);
    
    // Optionally, set lastLogin to createdAt for users who registered recently
    // This gives a more realistic "last seen" for existing users
    const recentUsersResult = await User.updateMany(
      { 
        lastLogin: null,
        creadoEn: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } // Last 30 days
      },
      [{ $set: { lastLogin: "$creadoEn" } }]
    );

    console.log(`Set lastLogin to creation date for ${recentUsersResult.modifiedCount} recent users.`);

  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

// Run migration
migrateLastLogin();
