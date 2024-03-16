const express = require("express");
const serverless = require("serverless-http");
const cors = require("cors");
const admin = require("firebase-admin");

const app = express();
const router = express.Router();

const serviceAccount = require("./enotify-c579a-firebase-adminsdk-gjzss-d53cd0d225.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

app.use(cors());
app.use(express.json());
router.use(cors());
router.use(express.json());

router.get("/", (req, res) => {
  res.json({
    hello: "Hello boy!",
  });
});
router.post("/data", (req, res) => {
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
      res.status(200).send("Message sent successfully");
    })
    .catch((error) => {
      console.error("Error sending message:", error);
      res.status(500).send("Error sending message");
    });
});
app.use(`/.netlify/functions/api`, router);

module.exports = app;
module.exports.handler = serverless(app);
