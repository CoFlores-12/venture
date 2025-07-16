
export function generatePurchaseConfirmationEmailHtml(purchase, event, user) {
  const eventTitle = event?.title || 'Evento Desconocido';
  const eventDate = event?.date || 'Fecha por confirmar';
  const eventTime = event?.time || 'Hora por confirmar';
  const eventLocation = event?.location || 'Ubicación por confirmar';
  const eventBanner = event?.banner || 'https://placehold.co/1200x400/cccccc/333333?text=Evento+Venture';
  const userName = user?.nombre || 'Estimado usuario';
  const ticketType = purchase?.typeTicket || 'Tipo de Boleto';
  const ticketQuantity = purchase?.ticketQuantity || 0;
  const totalAmount = purchase?.totalAmount?.toFixed(2) || '0.00';
  const purchaseId = purchase?._id?.toString() || 'N/A';

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
            <h1 style="color: #5004be; font-size: 24px; margin: 0;">¡Gracias por tu compra, ${userName}!</h1>
            <p style="color: #333; font-size: 16px; line-height: 1.6; margin-top: 15px;">
              Hemos confirmado tu compra de boletos para el evento: <strong>${eventTitle}</strong>.
            </p>
            <p style="color: #333; font-size: 16px; line-height: 1.6; margin-top: 10px;">
              Aquí están los detalles de tu compra:
            </p>
            <ul style="color: #333; font-size: 16px; line-height: 1.6; margin-top: 10px; padding-left: 20px;">
              <li><strong>Evento:</strong> ${eventTitle}</li>
              <li><strong>Fecha:</strong> ${eventDate}</li>
              <li><strong>Hora:</strong> ${eventTime}</li>
              <li><strong>Ubicación:</strong> ${eventLocation}</li>
              <li><strong>Tipo de Boleto:</strong> ${ticketType}</li>
              <li><strong>Cantidad:</strong> ${ticketQuantity}</li>
              <li><strong>Monto Total:</strong> L. ${totalAmount}</li>
              <li><strong>ID de Compra:</strong> ${purchaseId}</li>
            </ul>

            <div style="margin-top: 25px; text-align: center;">
              <a href="https://venture-navy.vercel.app/mis-compras" style="background-color: #fe6d0a; color: #fff; padding: 14px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">Ver mis boletos y compras</a>
            </div>

            <hr style="margin: 40px 0; border: none; border-top: 1px solid #ddd;" />

            <p style="font-size: 14px; color: #888; text-align: center;">
              Estás recibiendo este correo porque realizaste una compra en <strong>Venture</strong>. <br />
              Si tienes alguna pregunta, no dudes en contactarnos.
            </p>
          </td>
        </tr>
      </table>
    </div>
  `;
}
