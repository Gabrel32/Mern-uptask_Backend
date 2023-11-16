import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import conectarDB from "./config/db.js";
import usuarioRoutes from "./routes/usuarioRoutes.js"
import proyectosRoutes from "./routes/proyectosRoutes.js"
import tareaRoutes from "./routes/tareaRoutes.js"


const app = express()
app.use(express.json())

dotenv.config()

conectarDB()

// configurar cors
const whitelist = [process.env.FRONTEND_URL]

const corsOption = {
    origin:function(origin,callback){

    if (whitelist.includes(origin)) {
        // Puede consultar la API
        callback(null,true)
    }else{
        // NO puede consultar la API
        callback(new Error("Error de Cors"))
    }
    },
}

app.use(cors(corsOption))

// Routing
app.use("/api/usuarios",usuarioRoutes)
app.use("/api/proyectos",proyectosRoutes)
app.use("/api/tareas",tareaRoutes)



const PORT = process.env.PORT || 4000

const servidor = app.listen(PORT,()=>{
    console.log(`servidor corriendo en el puerto ${PORT}`);
})

import { Server } from "socket.io"

const io = new Server(servidor,{
    pingTimeout: 60000,
    cors:{
        origin: process.env.FRONTEND_URL,
    },
});

io.on("connection", (socket)=>{
    console.log("conectado a socket.io");
    // Definir los eventos de socket.io
    socket.on("abrir proyecto", (proyecto)=>{
        socket.join(proyecto);
    })
    socket.on("nueva tarea" ,tarea => {
        const proyecto = tarea.proyecto
        socket.to(proyecto).emit("tarea agregada",tarea);
    })
    socket.on("eliminar tarea",(tarea)=>{
        const proyecto = tarea.proyecto
        socket.to(proyecto).emit("tarea eliminada",tarea);
    });
    socket.on("actualizar tarea",tarea =>{
        const proyecto = tarea.proyecto._id
        socket.to(proyecto).emit("tarea actualizada", tarea)
    })
    socket.on("completar tarea",(tarea)=>{
        const proyecto = tarea.proyecto._id
        socket.to(proyecto).emit("tarea completada",tarea)
    })
})