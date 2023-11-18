const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require("cors");
const amqp = require('amqplib');
const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB Atlas!');
});

app.use(express.json());
app.use(
	cors({
		origin: "http://localhost:3000",
		methods: "GET,POST,PUT,DELETE",
		credentials: true,
	})
);

// Invoice Schema
const Invoice = require('./models/invoice');

// Documentation for all endpoints
app.get('/', (req, res) => {
    const endpoints = [
      {
        path: '/invoices',
        method: 'GET',
        purpose: 'Retrieve all invoices',
        request: 'None',
        response: 'Array of Invoice objects',
      },
      {
        path: '/invoices',
        method: 'POST',
        purpose: 'Create a new invoice',
        request: 'JSON object: { recipientEmail, billAmount, dueDate, status }',
        response: 'Created Invoice object',
      },
      // Add other endpoints documentation here
      {
        path: '/invoices/:email',
        method: 'GET',
        purpose: 'Retrieve invoices by recipient email',
        request: 'None',
        response: 'Array of Invoice objects for the specified email',
      },
      {
        path: '/invoices/:email/due',
        method: 'GET',
        purpose: 'Retrieve overdue invoices by recipient email',
        request: 'None',
        response: 'Array of overdue Invoice objects for the specified email',
      },
    ];
  
    res.json({ endpoints });
  });
// GET all invoices
app.get('/invoices', async (req, res) => {
  try {
    const invoices = await Invoice.find();
    res.json(invoices);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new invoice
app.post('/invoices', async (req, res) => {
  const invoice = new Invoice({
    ownerEmail: req.body.ownerEmail,
    recipientEmail: req.body.recipientEmail,
    billAmount: req.body.billAmount,
    dueDate: req.body.dueDate,
    status: req.body.status || 'not paid',
  });

  try {
    const newInvoice = await invoice.save();
    res.status(201).json(newInvoice);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update an invoice by ID
app.put('/invoices/:id', async (req, res) => {
  try {
    const updatedInvoice = await Invoice.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedInvoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    res.json(updatedInvoice);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE an invoice by ID
app.delete('/invoices/:id', async (req, res) => {
  try {
    const deletedInvoice = await Invoice.findByIdAndDelete(req.params.id);
    if (!deletedInvoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    res.json({ message: 'Invoice deleted', deletedInvoice });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
// GET invoices by recipient email
app.get('/invoices/:email', async (req, res) => {
    try {
      const email = req.params.email;
      const invoices = await Invoice.find({ ownerEmail: email });
      if (invoices.length === 0) {
        return res.status(404).json({ message: 'No invoices found for this email' });
      }
      res.json(invoices);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  
// GET invoices by recipient email where due date is passed
app.get('/invoices/:email/due', async (req, res) => {
    try {
      const email = req.params.email;
      const currentDate = new Date();
      
      const invoices = await Invoice.find({
        recipientEmail: email,
        dueDate: { $lt: currentDate } // Due date is less than current date
      });
  
      if (invoices.length === 0) {
        return res.status(404).json({ message: 'No overdue invoices found for this email' });
      }
      
      res.json(invoices);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  app.get('/payment/:id', async (req, res) => {
    try {
      const invoiceId = req.params.id;
      const invoice = await Invoice.findById(invoiceId);
  
      if (!invoice) {
        return res.status(404).json({ message: 'Invoice not found' });
      }
  
      res.json({ status: invoice.status });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
// Function to receive messages from RabbitMQ
async function receiveMessage() {
    try {
      const connection = await amqp.connect('amqp://localhost');
      const channel = await connection.createChannel();
      const queue = 'service-host-invoice-service'; // Adjust queue name as needed
  
      await channel.assertQueue(queue);
      console.log(`[*] Waiting for messages in '${queue}'. To exit press CTRL+C`);
  
      channel.consume(queue, async (msg) => {
        if (msg !== null) {
          const receivedMessage = msg.content.toString();
          console.log(`[x] Received '${receivedMessage}'`);
          const Message = JSON.parse(receivedMessage);
        console.log("recieved query: ",Message)
          if (Message && Message.query === 'get-invoices') {
            // If received message is 'get-invoices', fetch and publish invoices
            try {
              const invoices = await Invoice.find(); // Fetch invoices (assuming Invoice is your Mongoose model)
              const messageToSend = JSON.stringify(invoices);
                await sendMessage(messageToSend, 'invoice-service-service-host'); // Publish invoices to 'mailer' queue
            } catch (err) {
              console.error('Error fetching or sending invoices:', err);
            }
          }
  
          channel.ack(msg);
        }
      });
    } catch (error) {
      console.error('Error:', error);
    }
  }
  
  // Function to send messages to RabbitMQ
  async function sendMessage(message, queueName = 'service-host') {
    try {
      const connection = await amqp.connect('amqp://localhost');
      const channel = await connection.createChannel();
      const queue = queueName;
  
      await channel.assertQueue(queue);
  
      channel.sendToQueue(queue, Buffer.from(message));
  
      console.log(`[x] Sent '${message}'`);
  
    } catch (error) {
      console.error('Error:', error);
    }
  }
  app.listen(PORT, () => {
    receiveMessage();
  console.log(`Server is running on port ${PORT}`);
});
