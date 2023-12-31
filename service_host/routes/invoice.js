const amqp = require('amqplib');

// Function to send messages to RabbitMQ
async function sendMessage(message, queueName = 'mailer') {
  try {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    const queue = queueName;
    message=JSON.stringify({ query: message })
    await channel.assertQueue(queue);

    channel.sendToQueue(queue, Buffer.from(message));

    console.log(`[x] Sent '${message}'`);
    
  } catch (error) {
    console.error('Error:', error);
  }
}

async function listenForResponse(queueName = 'invoice-service-service-host') {
  try {
    connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    const queue = queueName;

    await channel.assertQueue(queue);

    console.log(`[*] Waiting for response messages in '${queue}'`);

    return new Promise((resolve) => {
      channel.consume(queue, (msg) => {
        if (msg !== null) {
          const receivedMessage = msg.content.toString();
          console.log(`[x] Received response: '${receivedMessage}'`);

          channel.ack(msg);
          resolve(receivedMessage); 
          // Resolve the promise with the received message
        }
      });
    });
  } catch (error) {
    console.error('Error:', error);
  }finally{
    console.log("finally got ")
  }
}

// Define your route
const router = require("express").Router();
router.get("/getall", async (req, res) => {
  try {
    console.log("endpoint recieved")
    await sendMessage('get-invoices', 'service-host-invoice-service'); // Send 'get-invoices' message to RabbitMQ

    // Start listening for the response from RabbitMQ
    const receivedMessage = await listenForResponse();
    console.log("promise accomplished")
    // Check if a response was received from RabbitMQ
    if (receivedMessage) {
      res.status(200).json({ message: 'Received response from RabbitMQ', data: JSON.parse(receivedMessage) });
    } else {
      res.status(500).json({ error: 'No response received from RabbitMQ' });
    }
  } catch (err) {
    console.error('Error sending message to RabbitMQ:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Export the router
module.exports = router;