const mongoose = require("mongoose");

const ClienteSchema = mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true,
  },
  apellido: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
  },
  matricula: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  municipio: {
    type: String,
    required: true,
    trim: true,
  },
  estado: {
    type: String,
    required: true,
    trim: true,
  },
  telefono: {
    type: String,
    required: true,
    trim: true,
  },
  curp: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  creado: {
    type: Date,
    default: Date.now(),
  },
});

ClienteSchema.index({ nombre: 'text', apellido: 'text', curp:'text', matricula:'text'});
module.exports = mongoose.model("Clientes", ClienteSchema);