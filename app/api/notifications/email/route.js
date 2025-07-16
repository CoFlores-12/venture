import { sendEmail } from "@/src/lib/email";
import { sendNotification } from "@/src/lib/send";
import { NextResponse } from 'next/server';
import { generatePurchaseConfirmationEmailHtml } from '@/src/lib/emailTemplates/purchaseConfirmation'; 
import { generateReviewReceivedEmailHtml } from '@/src/lib/emailTemplates/reviewReceived'; 
import { generateFavoriteUserEventHtml } from '@/src/lib/emailTemplates/favoriteUserEvent';

export async function POST(req) {
  try {
    const { type, data } = await req.json();
    if (!type || !data) {
      return NextResponse.json({ success: false, error: 'Tipo de evento o datos faltantes.' }, { status: 400 });
    }

    let emailHtml = '';
    let emailSubject = '';
    let recipientEmail = '';
    let pushPayload = null; // Para notificaciones push

    switch (type) {
      case 'purchase_confirmed':
        const { purchase, event, user } = data;
        emailSubject = `🎉 ¡Tu compra para ${event.title} ha sido confirmada! 🎉`;
        emailHtml = generatePurchaseConfirmationEmailHtml(purchase, event, user);
        recipientEmail = user.correo;
        // Puedes definir el pushPayload aquí si quieres una notificación push para confirmación de compra
        pushPayload = {
          title: '🎟️ Boletos comprados',
          body: `Tu compra para ${event.title} se procesó con éxito. Puedes ver tus boletos ahora.`,
          icon: '/logo.png',
          url: '/mis-purchases',
          data: { tipo: 'compra', purchaseId: purchase._id.toString(), userId: user._id.toString() },
          actions: [
            { action: 'ver', title: 'Ver boletos', icon: '/eye.png' },
            { action: 'cerrar', title: 'Ignorar', icon: '/close.png' }
          ]
        };
        break;
      case 'review_received': 
        const { review, event: reviewedEvent, organizer, reviewer } = data;
        emailSubject = `⭐ Nueva reseña para tu evento: ${reviewedEvent.title}`;
        emailHtml = generateReviewReceivedEmailHtml(review, reviewedEvent, organizer, reviewer);
        recipientEmail = organizer.correo; // El organizador recibe la notificación
        pushPayload = { 
          title: '⭐ Nueva reseña recibida',
          body: `¡${reviewer.nombre} ha dejado una reseña para tu evento "${reviewedEvent.title}"!`,
          icon: '/logo.png', // O un ícono específico para reseñas
          url: `/eventos/${reviewedEvent._id}/reviews`, // URL para ver las reseñas del evento
          data: { tipo: 'reseña', eventId: reviewedEvent._id.toString(), reviewId: review._id.toString() },
          actions: [
            { action: 'ver_reseña', title: 'Ver reseña', icon: '/eye.png' },
            { action: 'cerrar', title: 'Ignorar', icon: '/close.png' }
          ]
        };
        break;
      case 'favorite_user_event':
        const { newEvent, favoriteUser, recipient } = data; 
        emailSubject = `✨ ¡${favoriteUser.nombre} ha publicado un nuevo evento: ${newEvent.title}!`;
        emailHtml = generateFavoriteUserEventHtml(newEvent, favoriteUser, recipient);
        recipientEmail = recipient.correo; // El usuario favorito recibe la notificación
        pushPayload = { 
          title: '🎉 Nuevo evento de tu favorito',
          body: `¡${favoriteUser.nombre} ha publicado un nuevo evento: "${newEvent.title}"!`,
          icon: '/logo.png', // O un ícono específico para eventos
          url: `/eventos/${newEvent._id}`, // URL para ver el nuevo evento
          data: { tipo: 'nuevo_evento_favorito', eventId: newEvent._id.toString(), organizerId: favoriteUser._id.toString() },
          actions: [
            { action: 'ver_evento', title: 'Ver evento', icon: '/eye.png' },
            { action: 'cerrar', title: 'Ignorar', icon: '/close.png' }
          ]
        };
        break;
      default:
        console.warn(`Unknown event type: ${type}`);
        return NextResponse.json({ success: false, error: 'Unknown event type.' }, { status: 400 });
    }

    // Send email if there is a recipient and HTML
    if (recipientEmail && emailHtml) {
      const emailResult = await sendEmail({
        to: [recipientEmail],
        subject: emailSubject,
        html: emailHtml,
      });
      if (!emailResult.success) {
        console.warn(`Warning: Email for '${type}' could not be sent.`, emailResult.error);
      } else {
        console.log(`Email for '${type}' sent to ${recipientEmail}.`);
      }
    }

    // Send push notification if there is a payload
    if (pushPayload) {
        // sendNotification might need the user ID or subscription here
        sendNotification({}, JSON.stringify(pushPayload)); 
        console.log(`Push notification for '${type}' sent.`);
    }

    return NextResponse.json({ success: true, message: `Event '${type}' processed.` }, { status: 200 });

  } catch (error) {
    console.error('Error in the central notification service:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error processing the notification.' },
      { status: 500 }
    );
  }
}
