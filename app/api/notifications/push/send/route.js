import { sendEmail } from "@/src/lib/mail";
import { sendNotification } from "@/src/lib/send";

export async function GET(req) {
    const payload = JSON.stringify({
  title: '🎟️ Boletos comprados',
  body: 'Tu compra se procesó con éxito. Puedes ver tus boletos ahora.',
  icon: '/logo.png',
  url: '/mis-compras',
  data: { tipo: 'compra', usuario: '123' },
  actions: [
    { action: 'ver', title: 'Ver boletos', icon: '/eye.png' },
    { action: 'cerrar', title: 'Ignorar', icon: '/close.png' }
  ]
});

    sendNotification({}, payload);

    await sendEmail({
      to: [''],
      subject: 'Prueba desde servidor',
      html: '<p>Esto es una prueba con <strong>HTML</strong>.</p>'
    });

    return Response.json({})
}