import Usuario from "../model/Usuarios.js";
import { generarId } from "../helpers/index.js";
import generarJWT from "../helpers/generarJWT.js";
import { emailRegistro, emailOlvidePasword } from "../helpers/email.js";


const registrar = async (req,res)=>{
    // evitar registros duplicados 
 
    const {email} = req.body
    const existeUsuario = await Usuario.findOne({email})


    if (existeUsuario) {
        const error = new Error("usuario ya registrado")
        return res.status(400).json({msg:error.message})
    }


    try {
        const usuario = new Usuario(req.body)
        usuario.token = generarId()
        const usuarioAlmacenado = await usuario.save()
        
        // enviar el email de confirmacion 

        emailRegistro({
            email: usuario.email,
            nombre: usuario.nombre,
            token: usuario.token,
            
        })

        res.json({msg:"Usuario Creado Correctamente, Revisa tu Email para Confirmar tu Cuenta"})
    } catch (error) {
        console.log(error);
    }

}

const autenticar = async (req, res) => {

    const {email,password} = req.body
    
    // comprobar si el usuario existe
    const usuario = await Usuario.findOne({email})
    if(!usuario){
        const error = new Error("el usuario no esta registrado")
        return res.status(404).json({msg:error.message})
    }

    // comprobar si el usuario esta confirmado
    if(!usuario.confirmado){
        const error = new Error("tu cuenta no ha sido confirmada")
        return res.status(404).json({msg:error.message})
    }
    // comprobar su password
    if (await usuario.comprobarPassword(password)) {
        res.json({
            _id:usuario._id,
            nombre: usuario.nombre,
            email: usuario.email,
            token: generarJWT(usuario._id)
        })
    }else{
        const error = new Error("la contraseña es incorrecta")
        return res.status(404).json({msg:error.message})
    }
}

const confirmar = async (req, res) => {
    const {token} = req.params
    const usuarioConfirmar = await Usuario.findOne({token})
    
    if (!usuarioConfirmar) {
        const error = new Error("el token es incorrecto o esta expirado")
        return res.status(404).json({msg:error.message})
    }

    try {
        usuarioConfirmar.confirmado = true
        usuarioConfirmar.token = ""
        await usuarioConfirmar.save()
        res.json({msg:"usuario confirmado correctamente"})
    } catch (error) {
        console.log(error);
    }
}

const olvidePassword = async (req, res) => {
    const {email} = req.body

    const usuario = await Usuario.findOne({email})
    if(!usuario){
        const error = new Error("el usuario no esta registrado")
        return res.status(404).json({msg:error.message})
    }

    try {
        usuario.token = generarId()
        usuario.save()
    //  Enviando el email

        emailOlvidePasword({
            email: usuario.email,
            nombre: usuario.nombre,
            token: usuario.token,
        })
        
        res.json({msg:"Hemos enviado un email con las instrucciones a tu correo"})
    } catch (error) {
        console.log(error);
    }
}

const comprobarToken = async (req, res) => {
    const {token} = req.params

    const tokenValido = await Usuario.findOne({token})

    if (tokenValido) {
        res.json({msg:"token valido"})
        
    }
    else{
        const error = new Error("el token es invalido")
        return res.status(404).json({msg:error.message})
    }

} 

const nuevoPassword = async (req, res) => {
    const {token} = req.params
    const {password} = req.body

    const usuario = await Usuario.findOne({token})

    if (usuario) {
        usuario.password = password
        usuario.token = ""
        try {
            await usuario.save()
            res.json({msg:"Ha cambiado su contraseña correctamente"})
        } catch (error) {
            console.log(error);
        }
        
    }
    else{
        const error = new Error("el usuario no es invalido")
        return res.status(404).json({msg:error.message})
    }
}

const perfil = async (req, res) => {
    const {usuario} = req

    res.json(usuario)
}

export {
    registrar,
    autenticar,
    confirmar,
    olvidePassword,
    comprobarToken,
    nuevoPassword,
    perfil
}