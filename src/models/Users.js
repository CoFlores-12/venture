import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  correo: { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true },
  rol: { type: String, enum: ["default", "organizer"], default: "default" },
  creadoEn: { type: Date, default: Date.now },
  
  // Campos solo para organizadores
  organizacion: { type: String },
  identidad: { type: String },
  identidadDoc: { type: String },
  descripcion: { type: String },
  foto: { type: String },         
  ubicacion: { type: String },
  contacto: { type: String },
  sitioWeb: { type: String },
  verificado: { type: Boolean },
  scannAccess: { type: String },
});


export default mongoose.models.User || mongoose.model("User", UserSchema);