const express = require("express");
const serverless = require("serverless-http");
const cors = require("cors");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const admin = require("firebase-admin");

const app = express();
const router = express.Router();

const serviceAccount = require("./enotify-c579a-firebase-adminsdk-gjzss-d53cd0d225.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
router.use(cors());
router.use(express.json());
router.use(bodyParser.json());

router.get("/", (req, res) => {
  res.json({
    hello: "Hello boy!",
  });
});
router.post("/data", (req, res) => {
  const data = req.body; // Data sent from the client
  console.log(data);
  data.Class.forEach((studentClass) => {
    console.log(studentClass);
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
      topic: studentClass, // or specify the device token for individual devices
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
  });
});
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "enotifysup@gmail.com",
    pass: "vqcv ccqq syrg gsdc",
  },
});

// API endpoint to send email
router.post("/send-email", (req, res) => {
  const { to, subject, text } = req.body;

  const mailOptions = {
    from: "enotifysup@gmail.com",
    to,
    subject,
    text,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
      res.status(500).send("Error sending email");
    } else {
      console.log("Email sent:", info.response);
      res.send("Email sent successfully");
    }
  });
});
app.use(`/.netlify/functions/api`, router);

module.exports = app;
module.exports.handler = serverless(app);
