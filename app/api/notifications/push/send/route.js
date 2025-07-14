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

const html = ` <div style="background-color: #f3f4f6; padding: 30px 0; font-family: 'Segoe UI', sans-serif;">
    <table align="center" width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
      <tr>
        <td style="background-color: #fff; text-align: center; padding: 20px; display: flex; flex-direction: row; align-items: end; justify-content: center; font-size: 20px; scale: 110%;">
          <img src="https://venture-navy.vercel.app/logo.png" alt="Venture Logo" style="height: 40px; width: 40px;" />
          enture
        </td>
      </tr>
      <tr>
        <td>
          <img src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&h=400&q=80" alt="Evento destacado" style="width: 100%; height: auto;" />
        </td>
      </tr>
      <tr>
        <td style="padding: 30px;">
          <h1 style="color: #5004be; font-size: 24px; margin: 0;">🎉 ¡Tegus se mueve y tú no te lo puedes perder!</h1>
          <p style="color: #333; font-size: 16px; line-height: 1.6; margin-top: 15px;">
            Obeth, esta semana hay nuevos eventos cerca de ti. Vive experiencias únicas, conoce personas increíbles y disfruta tu ciudad como nunca antes.
          </p>

          <div style="margin-top: 25px;">
            <a href="https://venture-navy.vercel.app/" style="background-color: #fe6d0a; color: #fff; padding: 14px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">Explorar eventos</a>
          </div>

          <hr style="margin: 40px 0; border: none; border-top: 1px solid #ddd;" />

          <p style="font-size: 14px; color: #888; text-align: center;">
            Estás recibiendo esta notificación porque formas parte de <strong>Venture</strong>. <br />
            Si no deseas recibir más correos, puedes actualizar tus preferencias desde tu perfil.
          </p>
        </td>
      </tr>
    </table>
  </div>`

    sendNotification({}, payload);

    await sendEmail({
      to: ['obethflores2014@gmail.com'],
    subject: '🎟️ Vive los mejores eventos con Venture',
      html
    });

    return Response.json({})
}