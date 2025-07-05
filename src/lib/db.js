import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Por favor agrega MONGODB_URI en tu .env.local");
}

let isConnected = false;

export async function connectToMongoose() {
  if (isConnected) return;

  try {
    const db = await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isConnected = db.connections[0].readyState === 1;
    console.log("✅ Mongoose conectado");
  } catch (error) {
    console.error("❌ Error al conectar Mongoose:", error);
    throw error;
  }
}
