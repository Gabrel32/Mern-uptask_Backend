import Proyecto from "../model/Proyecto.js"
import Tarea from "../model/Tareas.js"
import mongoose from "mongoose"


const agregarTareas = async (req,res) => {
    const {proyecto} = req.body

    const valido = mongoose.Types.ObjectId.isValid(proyecto)
    
    if (!valido) {
        const error = new Error("la tarea no existe")
        return res.status(404).json({msg:error.message})
    }

    const existeProyecto = await Proyecto.findById(proyecto)


    if (req.usuario._id.toString() !== existeProyecto.creador.toString()) {
        const error = new Error("No tienes los permisos necesarios para añadir tareas")
        return res.status(403).json({msg:error.message})

    }

    try {
        const {nombre, descripcion, prioridad, fechaEntrega,proyecto} = req.body
        const tareaAlmacenada = await Tarea.create({nombre,descripcion,fechaEntrega,prioridad,proyecto})
        // almacernar id en el proyecto
        existeProyecto.tareas.push(tareaAlmacenada._id)
        await existeProyecto.save()
        res.json(tareaAlmacenada)

    } catch (error) {
        console.log(error);
    }


}
const obtenerTareas = async (req,res) => {
    const {id} = req.params;

    const valido = mongoose.Types.ObjectId.isValid(id)
    
    if (!valido) {
        const error = new Error("El Proyecto no existe")
        return res.status(404).json({msg:error.message})
    }

    const tarea = await Tarea.findById(id).populate("proyecto")

    if (tarea.proyecto.creador.toString() !== req.usuario._id.toString()) {
        const error = new Error("Accion no valida")
        return res.status(404).json({msg:error.message})
    }

    res.json(tarea)
}
const actualizarTarea = async (req,res) => {
    const {id} = req.params;

    const valido = mongoose.Types.ObjectId.isValid(id)
    
    if (!valido) {
        const error = new Error("El Proyecto no existe")
        return res.status(404).json({msg:error.message})
    }

    const tarea = await Tarea.findById(id).populate("proyecto")

    if (tarea.proyecto.creador.toString() !== req.usuario._id.toString()) {
        const error = new Error("Accion no valida")
        return res.status(404).json({msg:error.message})
    }

    tarea.nombre = req.body.nombre || tarea.nombre
    tarea.descripcion = req.body.descripcion || tarea.descripcion
    tarea.prioridad = req.body.prioridad || tarea.prioridad
    tarea.fechaEntrega = req.body.fechaEntrega || tarea.fechaEntrega

    try {
        const tareaAlmacenada = await tarea.save()
        res.json(tareaAlmacenada)
    } catch (error) {
        console.log(error);
    }

}
const eliminarTarea = async (req,res) => {
    const {id} = req.params;

    const valido = mongoose.Types.ObjectId.isValid(id)
    
    if (!valido) {
        const error = new Error("El Proyecto no existe")
        return res.status(404).json({msg:error.message})
    }

    const tarea = await Tarea.findById(id).populate("proyecto")

    if (tarea?.proyecto.creador.toString() !== req.usuario._id.toString()) {
        const error = new Error("Accion no valida")
        return res.status(404).json({msg:error.message})
    }

    try {
        const proyecto = await Proyecto.findById(tarea.proyecto)
        
        proyecto.tareas.pull(tarea._id)

        await Promise.allSettled([await proyecto.save(), await tarea.deleteOne()]) 

        res.json({msg:"tarea eliminada correctamente"})
        
    } catch (error) {
        console.log(error);
    }

}
const cambiarEstado = async (req,res) => {
    const {id} = req.params;

    const valido = mongoose.Types.ObjectId.isValid(id)
    
    if (!valido) {
        const error = new Error("El Proyecto no existe")
        return res.status(404).json({msg:error.message})
    }

    const tarea = await Tarea.findById(id).populate("proyecto")

    if (tarea.proyecto.creador.toString() !== req.usuario._id.toString()&& !tarea.proyecto.colaboradores.some(colaborador=>colaborador._id.toString() === req.usuario._id.toString())) {
        const error = new Error("Accion no valida")
        return res.status(404).json({msg:error.message})
    }

    tarea.estado = !tarea.estado
    tarea.completado = req.usuario._id

    
    await tarea.save()

    const tareax = await Tarea.findById(id).populate("proyecto").populate("completado")


    res.json(
        tareax
    )
}


export {
    agregarTareas,
    obtenerTareas,
    actualizarTarea,
    eliminarTarea,
    cambiarEstado,
}