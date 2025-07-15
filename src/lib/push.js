import webPush from 'web-push';

// Only set VAPID details if all required environment variables are present
if (process.env.VAPID_EMAIL && process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
webPush.setVapidDetails(
    `mailto:${process.env.VAPID_EMAIL}`, // Subject must be a mailto: URL
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);
} else {
  console.warn('VAPID environment variables not configured. Push notifications will not work.');
}

export default webPush;
