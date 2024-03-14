const admin = require("firebase-admin");

var serviceAccount = require("./lib/enotify-c579a-firebase-adminsdk-gjzss-d53cd0d225.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Construct the message
const message = {
  notification: {
    title: "New Message",
    body: "You have a new message!",
  },
  topic: "4ITS", // or specify the device token for individual devices
};

// Send the message
admin
  .messaging()
  .send(message)
  .then((response) => {
    console.log("Successfully sent message:", response);
  })
  .catch((error) => {
    console.error("Error sending message:", error);
  });
