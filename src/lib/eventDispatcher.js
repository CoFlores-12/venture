export async function dispatchNotificationEvent(eventType, data) {
  try {
    const response = await fetch('http://localhost:3000/api/notifications/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ type: eventType, data }),
    });

    if (!response.ok) {
      console.error(`Error al delegar evento ${eventType}:`, response.statusText);
    } else {
      console.log(`Evento '${eventType}' delegado con éxito.`);
    }
  } catch (error) {
    console.error(`Error al delegar evento '${eventType}' (fetch):`, error);
  }
}
