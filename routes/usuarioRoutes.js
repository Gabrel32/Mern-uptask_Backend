import express from "express"
import {
    autenticar,
    comprobarToken,
    confirmar,
    nuevoPassword,
    olvidePassword,
    perfil,
    registrar
} from "../controllers/usuarioControllers.js"

import checkAuth from "../middleware/checkAuth.js"

// Autenicacion, registro y confirrmacion de usuarios

const router = express.Router()

router.post("/",registrar)
router.post("/login",autenticar)
router.get("/confirmar/:token",confirmar)
router.post("/olvide-password", olvidePassword )
router.route("/olvide-password/:token").post(nuevoPassword).get(comprobarToken)
router.get("/perfil" , checkAuth, perfil)


export default router