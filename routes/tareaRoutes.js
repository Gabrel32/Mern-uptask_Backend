import express from "express"
import {
    agregarTareas,
    obtenerTareas,
    actualizarTarea,
    eliminarTarea,
    cambiarEstado,
} from "../controllers/tareaControllers.js"
import checkAuth from "../middleware/checkAuth.js"

const router  = express.Router()

router.post("/",checkAuth,agregarTareas)
router.route("/:id")
    .get(checkAuth,obtenerTareas)
    .put(checkAuth,actualizarTarea)
    .delete(checkAuth,eliminarTarea)

router.post("/estado/:id",checkAuth,cambiarEstado)

export default router