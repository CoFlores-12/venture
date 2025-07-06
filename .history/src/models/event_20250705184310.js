import mongoose from "mongoose";

const EntradaSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  precio: { type: Number, required: true },
  cantidadDisponible: { type: Number, required: false },
});

const EventoSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  descripcion: { type: String, required: true },
  ubicacion: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number], // [longitud, latitud]
      required: true,
    },
  },
  imagen: { type: String, required: true },
  fecha: { type: Date, required: true },
  horaInicio: { type: String, required: true },
  horaFin: { type: String, required: true },
  categoria: { type: String, required: true },
  plan: {
    type: String,
    enum: ['BASICO', 'ESTANDAR', 'PREMIUM'],
    required: true,
  },
  entradas: [EntradaSchema],
  maxAsistentes: { type: Number },
  creadoPor: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User", 
  },
  creadoEn: { type: Date, default: Date.now },
  actualizadoEn: { type: Date, default: Date.now },
});

EventoSchema.index({ ubicacion: '2dsphere' });

export default mongoose.models.Evento || mongoose.model("Evento", EventoSchema);
