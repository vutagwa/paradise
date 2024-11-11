const admin = require("firebase-admin");

// Initialize Firebase Admin SDK
const serviceAccount = require("../nodejs/ewaste-bc9f8-firebase-adminsdk-sl1sc-fe1586c51b.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  // No need for databaseURL when using Firestore
});

// Function to send notifications
const sendNotification = (token, title, body) => {
  const message = {
    notification: {
      title: title,
      body: body,
    },
    token: token,
  };

  admin.messaging().send(message)
    .then((response) => {
      console.log("Notification sent successfully:", response);
    })
    .catch((error) => {
      console.log("Error sending notification:", error);
    });
};

// Example usage - send a notification for a new request
const token = "USER_FCM_TOKEN"; // Replace with user's FCM token
const title = "New E-Waste Request";
const body = "A new e-waste pickup request has been made. Check the details in the dashboard.";
sendNotification(token, title, body);
