export function generateFavoriteUserEventHtml(newEvent, favoriteUser, recipient) {
  const eventTitle = newEvent?.title || 'Nuevo Evento';
  const organizerName = favoriteUser?.nombre || 'Un organizador';
  const recipientName = recipient?.nombre || 'Estimado usuario';
  const eventLocation = newEvent?.location || 'Ubicación por confirmar';
  const eventDate = newEvent?.date || 'Fecha por confirmar';
  const eventTime = newEvent?.time || 'Hora por confirmar';
  const eventBanner = newEvent?.banner || 'https://placehold.co/1200x400/cccccc/333333?text=Nuevo+Evento+Venture'; // Placeholder image

  return `
    <div style="background-color: #f3f4f6; padding: 30px 0; font-family: 'Segoe UI', sans-serif;">
      <table align="center" width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
        <tr>
          <td style="background-color: #fff; text-align: center; padding: 20px; display: flex; flex-direction: row; align-items: end; justify-content: center; font-size: 20px; scale: 110%;">
            <img src="https://venture-navy.vercel.app/logo.png" alt="Venture Logo" style="height: 40px; width: 40px;" />
            enture
          </td>
        </tr>
        <tr>
          <td>
            <img src="${eventBanner}" alt="Banner del Nuevo Evento" style="width: 100%; height: auto; object-fit: cover; max-height: 200px;" />
          </td>
        </tr>
        <tr>
          <td style="padding: 30px;">
            <h1 style="color: #5004be; font-size: 24px; margin: 0;">🎉 ¡${organizerName} ha publicado un nuevo evento!</h1>
            <p style="color: #333; font-size: 16px; line-height: 1.6; margin-top: 15px;">
              Hola ${recipientName},
            </p>
            <p style="color: #333; font-size: 16px; line-height: 1.6; margin-top: 10px;">
              ¡Tu organizador favorito, <strong>${organizerName}</strong>, ha publicado un nuevo evento que no te querrás perder!
            </p>
            <ul style="color: #333; font-size: 16px; line-height: 1.6; margin-top: 10px; padding-left: 20px;">
              <li><strong>Evento:</strong> ${eventTitle}</li>
              <li><strong>Fecha:</strong> ${eventDate}</li>
              <li><strong>Hora:</strong> ${eventTime}</li>
              <li><strong>Ubicación:</strong> ${eventLocation}</li>
            </ul>

            <div style="margin-top: 25px; text-align: center;">
              <a href="https://venture-navy.vercel.app/eventos/${newEvent._id}" style="background-color: #fe6d0a; color: #fff; padding: 14px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">Ver detalles del evento</a>
            </div>

            <hr style="margin: 40px 0; border: none; border-top: 1px solid #ddd;" />

            <p style="font-size: 14px; color: #888; text-align: center;">
              Estás recibiendo este correo porque sigues a ${organizerName} en <strong>Venture</strong>.
              Puedes gestionar tus preferencias de notificación en tu perfil.
            </p>
          </td>
        </tr>
      </table>
    </div>
  `;
}
