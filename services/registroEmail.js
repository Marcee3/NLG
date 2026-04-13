import nodemailer from 'nodemailer';

const transport = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// verificar conexión al iniciar (IMPORTANTE en Render)
transport.verify((error, success) => {
  if (error) {
    console.error('❌ Error SMTP:', error);
  } else {
    console.log('✅ SMTP listo para enviar correos');
  }
});

export async function enviarEmailConfirmacion({ nombreVendedora, email, url }) {
  try {
    console.log('📧 Enviando correo de confirmación...');

    const info = await transport.sendMail({
      from: '"NLG" <' + process.env.EMAIL_USER + '>',
      to: email,
      subject: "Confirma tu cuenta",
      html: `
        <p>Hola ${nombreVendedora}, confirma tu cuenta:</p>
        <a href="${url}">Confirmar cuenta</a>
      `
    });

    console.log('✅ Correo enviado:', info.messageId);

  } catch (error) {
    console.error('❌ Error enviando confirmación:', error);
  }
}

export async function enviarEmailRecuperacion(correo, url) {
  try {
    console.log('📧 Enviando correo de recuperación...');

    const info = await transport.sendMail({
      from: '"NLG" <' + process.env.EMAIL_USER + '>',
      to: correo,
      subject: "Recupera tu contraseña",
      html: `
        <p>Restablecer contraseña:</p>
        <a href="${url}">Crear nueva contraseña</a>
      `
    });

    console.log('✅ Correo enviado:', info.messageId);

  } catch (error) {
    console.error('❌ Error enviando recuperación:', error);
  }
}