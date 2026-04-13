import nodemailer from 'nodemailer';// Para enviar correos

export async function enviarEmailConfirmacion({ nombreVendedora, email, url}) {
    const transport = nodemailer.createTransport({
        service:'gmail',
        auth: {
            user: 'marcelaguadalupe.palomar@gmail.com',
            pass: 'zsvo qnpm xwxv grhl' //Se requiere de una contraseña para enviar correos
        }
    });

    await transport.sendMail({
        from: '"NLG" <TUCORREO@gmail.com>',
        to: email,
        subject: "Confirma tu cuenta",
        html: `
        <p>Hola ${nombreVendedora}, confirma tu cuenta dando clic en el siguiente enlace:</p>
        <a href="${url}">Confirmar cuenta</a>
    `
    });
}

export async function enviarEmailRecuperacion(correo, url) {
  const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'marcelaguadalupe.palomar@gmail.com',
        pass: 'zsvo qnpm xwxv grhl' //Se requiere de una contraseña para enviar correos
    }
  });

  await transport.sendMail({
    from: '"NLG" <TUCORREO@gmail.com>',
    to: correo,
    subject: "Recupera tu contraseña",
    html: `
      <p>Hola, has solicitado restablecer tu contraseña.</p>
      <p>Da clic en el siguiente enlace para crear una nueva contraseña. El enlace expirará en 1 hora:</p>
      <a href="${url}">Restablecer contraseña</a>
      <p>Si no solicitaste este cambio, ignora este correo.</p>
    `
  });
}