import Proyecto from "../model/Proyecto.js"
import Tarea from "../model/Tareas.js"
import mongoose from "mongoose"
import Usuario from "../model/Usuarios.js"

const obtenerProyectos = async (req, res) => {
    const proyectos = await Proyecto.find({
        $or: [
            { colaboradores: { $in: [req.usuario] } },
            { creador: { $in: [req.usuario] } }
        ]
    }).select("-tareas")
    
    res.json(proyectos)
}

const nuevoProyecto = async (req, res) => { 
    const proyecto = new Proyecto(req.body)
    proyecto.creador = req.usuario._id

    try {
        const proyectoAlmacenado = await proyecto.save()
        res.json(proyectoAlmacenado)
    } catch (error) {
        console.log(error);
    }
}

const obtenerProyecto = async (req, res) => {
    const {id} = req.params

    const valido = mongoose.Types.ObjectId.isValid(id)
    
    if (!valido) {
        const error = new Error("El Proyecto no existe")
        return res.status(404).json({msg:error.message})
    }
    
    const proyecto = await Proyecto.findById(id).populate({path:"tareas",populate: {path:"completado",select:"nombre email"}}).populate("colaboradores","nombre email")

    if (proyecto.creador.toString() !== req.usuario._id.toString() && !proyecto.colaboradores.some(colaborador=>colaborador._id.toString() === req.usuario._id.toString())) {
        const error = new Error("No tienes los permisos necesarios")
        return res.status(401).json({msg:error.message})
    }

    // obtener Tareas del proyecto

    const tareas = await Tarea.find().where("proyecto").equals(proyecto._id)

    res.json(proyecto)
}

const editarProyectos = async (req, res) => {
    const {id} = req.params
    const {nombre, cliente, descripcion, fechaEntrega} = req.body

    const valido = mongoose.Types.ObjectId.isValid(id)
    
    if (!valido) {
        const error = new Error("El Proyecto no existe")
        return res.status(404).json({msg:error.message})
    }
    
    const proyecto = await Proyecto.findById(id)

    if (proyecto.creador.toString() !== req.usuario._id.toString()) {
        const error = new Error("No tienes los permisos necesarios")
        return res.status(401).json({msg:error.message})
    }

    proyecto.nombre = nombre || proyecto.nombre
    proyecto.descripcion = descripcion || proyecto.descripcion
    proyecto.cliente = cliente || proyecto.cliente
    proyecto.fechaEntrega || fechaEntrega || proyecto.fechaEntrega

    try {
        const proyectoAlmacenado = await proyecto.save()
        res.json(proyectoAlmacenado)
    } catch (error) {
        console.log(error);
    }



}

const eliminarProyecto = async (req, res) => {
    const {id} = req.params

    const valido = mongoose.Types.ObjectId.isValid(id)
    
    if (!valido) {
        const error = new Error("El Proyecto no existe")
        return res.status(404).json({msg:error.message})
    }
    
    const proyecto = await Proyecto.findById(id)

    if (proyecto.creador.toString() !== req.usuario._id.toString()) {
        const error = new Error("No tienes los permisos necesarios")
        return res.status(401).json({msg:error.message})
    }

    try {
        await proyecto.deleteOne()
        res.json({msg:"el proyecto se a eliminado correctamente"})
    } catch (error) {
        console.log(error);
    }

}

const buscarColaborador = async (req, res) => {
    const {email} = req.body
    const usuario = await Usuario.findOne({email}).select("-confirmado -createdAt -updatedAt -__v -token -password")

    if (!usuario) {
        const error = new Error("usuario no encontrado")
        return res.status(404).json({msg:error.message})
    }

    res.json(usuario)


}

const agregarColaborador = async (req, res) => {
    const {id} = req.params
    const {email} = req.body
    const proyecto = await Proyecto.findById(id)
    const usuario = await Usuario.findOne({email}).select("-confirmado -createdAt -updatedAt -__v -token -password")

    
    if (!proyecto) {
        const error = new Error("proyecto no encontrado");
        return res.status(404).json({msg:error.message})
    }
    
    if (proyecto.creador.toString() !== req.usuario._id.toString()) {
        const error = new Error("solo el creador puede agregar colaboradoes");
        return res.status(404).json({msg:error.message})
    }

    if (!usuario) {
        const error = new Error("usuario no encontrado")
        return res.status(404).json({msg:error.message})
    }

    if (proyecto.creador.toString() === usuario._id.toString()) {
        const error = new Error("no puedes ser colaboardor en tu propio proyecto")
        return res.status(404).json({msg:error.message})
    }

    if (proyecto.colaboradores.includes(usuario._id)) {
        const error = new Error("este usuario ya pertenece al proyecto")
        return res.status(404).json({msg:error.message})
    }

    // esta bien ahora se puede agregar
    proyecto.colaboradores.push(usuario._id)
    await proyecto.save()

    res.json({msg:"colaborador agregado correctamente"})
}

const eliminarColaborador = async (req, res) => {
    const {id} = req.params
    const proyecto = await Proyecto.findById(id)
    
    if (!proyecto) {
        const error = new Error("proyecto no encontrado");
        return res.status(404).json({msg:error.message})
    }
    
    if (proyecto.creador.toString() !== req.usuario._id.toString()) {
        const error = new Error("solo el creador puede agregar colaboradoes");
        return res.status(404).json({msg:error.message})
    }

    // esta bien ahora se puede eliminar
    proyecto.colaboradores.pull(req.body._id)
    await proyecto.save()

    res.json({msg:"colaborador eliminado correctamente"})
    
}

const obtenerTareas = async (req, res) => {
    const {id} = req.params

    const valido = mongoose.Types.ObjectId.isValid(id)
    
    if (!valido) {
        const error = new Error("No Encontrado")
        return res.status(404).json({msg:error.message})
    }

    

    res.json(tareas)
}

export {
    obtenerProyectos,
    nuevoProyecto,
    obtenerProyecto,
    editarProyectos,
    eliminarProyecto,
    agregarColaborador,
    eliminarColaborador,
    buscarColaborador
}