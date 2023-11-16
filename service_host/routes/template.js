const router = require("express").Router();
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
require("dotenv").config();

// Replace these placeholders with your actual email credentials
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.USER_EMAIL,
    pass: process.env.USER_PASSWORD,
  },
});

router.post('/sendmails', (req, res) => {
  const { email } = req.body;

  // Configure email parameters
  const mailOptions = {
    from: process.env.USER_EMAIL,
    to: email,
  };

  // Sending 5 emails
  for (let i = 1; i <= 5; i++) {
    mailOptions.subject = `mail${i}`;
    mailOptions.text = 'hi this is a random mail';

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  }

  res.send('Emails sent successfully!');
});
module.exports = router;