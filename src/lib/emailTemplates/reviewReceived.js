
export function generateReviewReceivedEmailHtml(review, event, organizer, reviewer) {
  const eventTitle = event?.title || 'Evento Desconocido';
  const organizerName = organizer?.nombre || 'Organizador';
  const reviewerName = reviewer?.nombre || 'Un usuario';
  const reviewRating = review?.rating || 0;
  const reviewComment = review?.comment || 'Sin comentario.';
  const reviewDate = review?.createdAt ? new Date(review.createdAt).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Fecha desconocida';
  const eventBanner = event?.banner || 'https://placehold.co/1200x400/cccccc/333333?text=Evento+Venture'; // Placeholder image

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
            <img src="${eventBanner}" alt="Banner del Evento" style="width: 100%; height: auto; object-fit: cover; max-height: 200px;" />
          </td>
        </tr>
        <tr>
          <td style="padding: 30px;">
            <h1 style="color: #5004be; font-size: 24px; margin: 0;">¡Nueva reseña para tu evento: ${eventTitle}!</h1>
            <p style="color: #333; font-size: 16px; line-height: 1.6; margin-top: 15px;">
              Hola ${organizerName},
            </p>
            <p style="color: #333; font-size: 16px; line-height: 1.6; margin-top: 10px;">
              El usuario <strong>${reviewerName}</strong> ha dejado una nueva reseña para tu evento <strong>"${eventTitle}"</strong>.
            </p>
            <ul style="color: #333; font-size: 16px; line-height: 1.6; margin-top: 10px; padding-left: 20px;">
              <li><strong>Calificación:</strong> ${'⭐'.repeat(reviewRating)} (${reviewRating}/5)</li>
              <li><strong>Comentario:</strong> "${reviewComment}"</li>
              <li><strong>Fecha de reseña:</strong> ${reviewDate}</li>
            </ul>

            <div style="margin-top: 25px; text-align: center;">
              <a href="https://venture-navy.vercel.app/eventos/${event._id}/reviews" style="background-color: #fe6d0a; color: #fff; padding: 14px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">Ver todas las reseñas del evento</a>
            </div>

            <hr style="margin: 40px 0; border: none; border-top: 1px solid #ddd;" />

            <p style="font-size: 14px; color: #888; text-align: center;">
              Estás recibiendo este correo porque eres el organizador de este evento en <strong>Venture</strong>.
            </p>
          </td>
        </tr>
      </table>
    </div>
  `;
}
