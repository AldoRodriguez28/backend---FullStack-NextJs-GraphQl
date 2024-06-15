const mongoose = require("mongoose");
const Counter = require('./Counter');

const CounterSchema = mongoose.Schema({
  _id:{type: String, required:true},
  seq:{type: Number, default: 0}
});

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
      folio:{
        type: Number,
        unique: true,
      },
      nombreCliente:{
        type: String,
        required: true,
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

GestionesSchema.pre("save",async function (next){
  const doc = this;

  try {
    const counter = await Counter.findByIdAndUpdate(
      {_id: "folio"},
      {$inc: {seq:1}},
      {new:true, upsert:true}
    );
    doc.folio = counter.seq;
    next();
  } catch (error) {
    next(error);
  }
 
})
module.exports = mongoose.model("Gestion", GestionesSchema);