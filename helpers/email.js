import nodemailer from "nodemailer"

export const emailRegistro = async (datos) => {
  const {email, nombre, token} = datos

  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

    //   informacion del email

  const info = await transport.sendMail({
    from:'"UpTask - Administrador de Proyectos" <cuentas@uptask.com>',
    to:email,
    subject:"UpTask - Comprueba tu Cuenta",
    text: "Comprueba tu cuenta en UpTask",
    html:`<p>Hola: ${nombre} Comprueba tu cuenta en UpTask</p>
    <p>Tu cuenta ya esta casi lista, solo falta comprobarla en el siguiente enlace:</p>
    
    <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Comprobar Cuenta</a>

    
    <p>si tu no creaste esta cuenta puedes ignorar esta mensaje</p>
    `

  })


    
}
export const emailOlvidePasword = async (datos) => {
  const {email, nombre, token} = datos

  // TODO: mover a varialbles de entorno

  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

    //   informacion del email

  const info = await transport.sendMail({
    from:'"UpTask - Administrador de Proyectos" <cuentas@uptask.com>',
    to:email,
    subject:"UpTask - Restablece tu Contraseña",
    text: "Restablece tu Contraseña",
    html:`<p>Hola: ${nombre} has solicitado restablecer tu contraseña</p>
    <p>sigue los pasos para generar una nueva contraseña en el siguiente enlace:</p>
    
    <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Restablece tu Contraseña</a>

    
    <p>si tu no solicitaste este email, puedes ignorar esta mensaje</p>
    `

  })


    
}

