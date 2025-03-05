import { app, messaging } from "../firebase/firebase";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// Request permission and get token
export const requestForToken = async () => {
  try {
    // Register the service worker manually before getting the token
    const registration = await navigator.serviceWorker.register(
      "/firebase-messaging-sw.js"
    );
    console.log("Service Worker registered:", registration);

    const currentToken = await getToken(messaging, {
      vapidKey: import.meta.env.VITE_VAPID_KEY,
      serviceWorkerRegistration: registration,
    });

    if (currentToken) {
      return currentToken;
    } else {
      console.warn("No registration token available. Requesting permission...");
    }
  } catch (error) {
    console.error("Error retrieving FCM token:", error);
  }
  return null;
};

// Listen for incoming messages
export const onMessageListener = () =>
  new Promise((resolve, reject) => {
    try {
      onMessage(messaging, (payload) => {
        console.log("Foreground notification received:", payload);
        resolve(payload);
      });
    } catch (error) {
      reject(error);
      console.error("Error in message listener:", error);
    }
  });

export { messaging };
