import mongoose from "mongoose";

const tareaSchema = mongoose.Schema({
    nombre: {
        type:String,
        require:true,
        trim:true
    },
    descripcion: {
        type:String,
        require:true,
        trim:true
    },
    estado:{
        type:Boolean,
        default:false
    },
    fechaEntrega:{
        type:Date,
        require:true,
        default:Date.now()
    },
    prioridad:{
        type: String,
        require:true,
        enum: ["baja","media","alta"]
    },
    proyecto:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Proyecto"
    },
    completado:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuario",
        default:null
    }
},{timestamps:true})

const Tarea = mongoose.model("Tarea",tareaSchema)

export default Tarea