const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
const { fetchAndGenerateCSV,deleteFile } = require('./Email/DbDataToCsv.js');
const { sendEmail } = require('./Email/Mail');
require('dotenv').config(); // Load environment variables

const { MongoConnection } = require('./Config/mongo.js');
const { notFound, errorHandler } = require('./Middleware/error.js');

// Initialize Express app
const app = express();

// Load configurations
const port = process.env.APPPORT || 4123; // Default to 4123 if undefined
const allowedOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',')
  : [
      'http://localhost:5173',
      'http://localhost:9090',
      'http://localhost:3000',
      'http://127.0.0.1:5500',
    ];

// CORS Middleware
app.use(
  cors({
    credentials: true,
    origin: allowedOrigins,
    methods: 'GET, POST, PUT, DELETE, OPTIONS, HEAD',
  })
);

// Security and JSON Parsing Middleware
app.use(express.json({ limit: '10mb' }));
app.use(require('helmet')());

// Root Test Endpoint
app.get('/common-backend/test', (req, res) => {
  console.log('Request received for Root /common-backend --> On Domain:', req.hostname);
  res.json({
    Message: 'Hello, this is common backend',
    Status: '200',
    url: req.hostname,
  });
});

// Routes Middleware
app.use('/common-backend', require('./Router/Routes.js'));

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

// Cron Job: Fetch Data, Generate CSV, and Send Email
const setupCronJob = () => {
  const recipientEmail = 'recipient@example.com'; // Set recipient email
  const subject = 'Registered Data CSV';
  const body = 'Please find the attached CSV file containing user data.';

  cron.schedule('0 23 * * *', async () => {
    try {
      const filePath = await fetchAndGenerateCSV(); // Generate CSV file
      await sendEmail(recipientEmail, subject, body, filePath);// Send email with CSV attachment
  
      // Delete the file after sending the email
      await deleteFile(filePath); // Cleanup: Delete the generated CSV file
    } catch (error) {
      console.error('Error in scheduled task:', error.message);
    }
  });


  console.log('Cron job scheduled: Runs everyday at 11pm');
};



// Establish MongoDB connection and start server
async function startServer() {
  try {
    // Establish MongoDB connection before starting the server
    await MongoConnection();

    // Start the HTTP server only after DB connection is successful
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);

      // Start the cron job after the server starts
      setupCronJob();
    });
  } catch (err) {
    console.error('Failed to establish MongoDB connection:', err);
  }
}

// Start the server with DB connection
startServer();
