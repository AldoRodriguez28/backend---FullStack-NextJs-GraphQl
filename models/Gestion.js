const mongoose = require("mongoose");

const GestionesSchema = mongoose.Schema({
      clienteId:{
        type:mongoose.Schema.Types.ObjectId, 
        required: true,
        ref: "Cliente",
      },
      usuarioId: {
        type:mongoose.Schema.Types.ObjectId, 
        required: true,
        ref: "Usuario",
      },
      lugar:{
        type: String,
        required: true,
        trim: true,
      },
      tipo:{
        type: String,
        required: true,
        trim: true,
      },
      descripcion:{
        type: String,
        required: true,
        trim: true,
      },
      estatus:{
        type: String,
        required: true,
        trim: true,
      },
      creado: {
        type: Date,
        default: Date.now(),
      },
});
module.exports = mongoose.model("Gestion", GestionesSchema);