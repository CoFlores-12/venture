import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  correo: { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true },
  adminCode: { type: String, required: true },
  rol: { type: String, enum: ["superadmin", "admin", "editor"], default: "admin" },
  creadoEn: { type: Date, default: Date.now },
});

export default mongoose.models.Admin || mongoose.model("Admin", AdminSchema);