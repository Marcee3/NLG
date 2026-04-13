import nodemailer from 'nodemailer';
import dns from 'dns';

// 🔥 FORZAR IPv4 (ARREGLA ERROR ENETUNREACH EN RENDER)
dns.setDefaultResultOrder('ipv4first');

const transport = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587, // 🔥 más estable en servidores cloud
  secure: false, // 🔥 obligatorio con puerto 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Verificar conexión SMTP al iniciar
transport.verify((error) => {
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
      from: `"NLG" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Confirma tu cuenta",
      html: `
        <p>Hola ${nombreVendedora}, confirma tu cuenta:</p>
        <a href="${url}">Confirmar cuenta</a>
      `
    });

    console.log('✅ Correo enviado correctamente:', info.messageId);
    return true;

  } catch (error) {
    console.error('❌ Error enviando confirmación:', error);
    return false;
  }
}

export async function enviarEmailRecuperacion(correo, url) {
  try {
    console.log('📧 Enviando correo de recuperación...');

    const info = await transport.sendMail({
      from: `"NLG" <${process.env.EMAIL_USER}>`,
      to: correo,
      subject: "Recupera tu contraseña",
      html: `
        <p>Restablecer contraseña:</p>
        <a href="${url}">Crear nueva contraseña</a>
      `
    });

    console.log('✅ Correo enviado correctamente:', info.messageId);
    return true;

  } catch (error) {
    console.error('❌ Error enviando recuperación:', error);
    return false;
  }
}