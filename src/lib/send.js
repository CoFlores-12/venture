import { connectToMongoose } from "./db";
import PushSubscription from '@/src/models/pushSubs';
import webPush from '@/src/lib/push';

export async function sendNotification(query = {}, payload) {
  try {
    if (!query || !payload) {
      throw new Error("Faltan parámetros requeridos");
    }

    connectToMongoose()

    const subscriptions = await PushSubscription.find(query);
    
    for (const sub of subscriptions) {
        try {
            await webPush.sendNotification(sub.subscription, payload);
        } catch (err) {
            console.error('Push error', err);
        }
    }

    return { success: true, message: "Notificación enviada a todos los dispositivos" };
  } catch (error) {
    console.error("Error al enviar la notificación:", error);
    return { success: false, message: error.message };
  }
}