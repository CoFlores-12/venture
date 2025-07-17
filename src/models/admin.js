import mongoose from "mongoose";

const ActivitySchema = new mongoose.Schema({
  action: { type: String, required: true },
  details: { type: String },
  type: { type: String, enum: ['success', 'warning', 'info', 'error'], default: 'info' },
  timestamp: { type: Date, default: Date.now }
});

const AdminSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  correo: { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true },
  adminCode: { type: String, required: true },
  rol: { type: String, enum: ["superadmin", "admin", "editor"], default: "admin" },
  creadoEn: { type: Date, default: Date.now },
  activities: [ActivitySchema]
});

export default mongoose.models.Admin || mongoose.model("Admin", AdminSchema);