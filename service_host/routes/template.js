const router = require("express").Router();
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
require("dotenv").config();
function generateRandomINR() {
  // Generate a random decimal number between 1 and 1000
  const randomAmount = (Math.random() * (1000 - 1) + 1).toFixed(2);
  // Format the number to represent currency in INR
  const formattedAmount = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR'
  }).format(randomAmount);

  return formattedAmount;
}
function generateRandomDueDate() {
  const currentDate = new Date();
  const futureDate = new Date(currentDate.getTime() + Math.random() * 30 * 24 * 60 * 60 * 1000 - 5* 24 * 60 * 60 * 1000); // Adding up to 30 days in milliseconds

  const formattedDueDate = futureDate.toUTCString(); // Format the date as a string in UTC format

  return formattedDueDate;
}

// Example usage:


function generateRandomInvoiceNumber() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const length = 8;
  let invoiceNumber = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    invoiceNumber += characters[randomIndex];
  }

  return invoiceNumber;
}

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
    const randomInvoice = generateRandomInvoiceNumber();

    mailOptions.subject = `Your OpenAI API invoice ${randomInvoice} requires payment`;
    const randomINR = generateRandomINR();
  const randomDueDate = generateRandomDueDate();

    mailOptions.text = `Hi there,
    Your invoice ${randomInvoice} for ${randomINR} is ready for payment.
    The due date for this invoice is ${randomDueDate}. If the invoice is not paid by this date, your API access may be suspended.
    
    If you have any questions about this invoice, please reach out to ar@openai.com
    
    Best,
    The OpenAI team`;
    

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