// Import the functions you need from the SDKs
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDp-lH4tZYp07M7nooQGH-A9DGWBxt0T4Y",
  authDomain: "ewaste-bc9f8.firebaseapp.com",
  projectId: "ewaste-bc9f8",
  storageBucket: "ewaste-bc9f8.appspot.com",
  messagingSenderId: "226144948961",
  appId: "1:226144948961:web:5e725c7f9899fe98a01da0",
  measurementId: "G-PPRH2QSTVX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const messaging = getMessaging(app);

// Request permission to send notifications
export const requestPermission = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      console.log("Notification permission granted.");
      const token = await getToken(messaging, {
        vapidKey: "YOUR_PUBLIC_VAPID_KEY", // get this from Firebase Cloud Messaging settings
      });
      console.log("FCM Token:", token);
      return token;
    } else {
      console.log("Unable to get permission to notify.");
    }
  } catch (error) {
    console.error("Error getting FCM token:", error);
  }
};

// Handle incoming messages when the app is in the foreground
export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      console.log("Message received: ", payload);
      resolve(payload);
    });
  });
