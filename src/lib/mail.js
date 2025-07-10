import nodemailer from 'nodemailer';

/**
 * Modulo para enviar correos
 * 
 * @param {Object} options - Opciones del correo.
 * @param {string[]} options.to - Lista de correos destinatarios.
 * @param {string} options.subject - Asunto del correo.
 * @param {string} options.html - Contenido del correo en formato HTML.
 * @param {string} [options.from=process.env.GMAIL_USER] - Dirección de correo del remitente (opcional).
 * @returns {Promise<{ success: boolean, info?: any, error?: any }>} Resultado del envío.
 *
 * @example
 * await sendEmail({
 *   to: ['usuario1@example.com', 'usuario2@example.com'],
 *   subject: '¡Bienvenido!',
 *   html: '<h1>Gracias por registrarte</h1>'
 * });
 */
export async function sendEmail({ to, subject, html, from = process.env.GMAIL_USER }) {
  if (!Array.isArray(to)) {
    throw new Error("El campo 'to' debe ser un array de correos.");
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS
    }
  });

  const mailOptions = {
    from,
    to: to.join(','),
    subject,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('📧 Correo enviado:', info.messageId);
    return { success: true, info };
  } catch (error) {
    console.error('❌ Error al enviar correo:', error);
    return { success: false, error };
  }
}
