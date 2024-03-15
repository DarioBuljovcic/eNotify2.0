const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
const app = express();
const port = 5000;

const serviceAccount = require("./enotify-c579a-firebase-adminsdk-gjzss-d53cd0d225.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Construct the message

app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/api/data", (req, res) => {
  const data = req.body; // Data sent from the client
  console.log(data);
  const message = {
    notification: {
      title: data.Tittle,
      body: data.Text,
    },
    android: {
      notification: {
        channelId: data.NotificationId, // Set your channel ID here
      },
    },
    topic: data.Class, // or specify the device token for individual devices
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
  res.status(200).send("Data received successfully");
});

app.listen(port, () => {
  console.log("Server is running on port 5000");
});
