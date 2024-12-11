const cron = require('node-cron');
const { fetchAndGenerateCSV } = require('../Controller/DbDataToCsv');
const { sendEmail } = require('../Controller/Mail');

// Define the recipient and email details
const recipientEmail = 'recipient@example.com';
const subject = 'User Data CSV';
const body = 'Please find the attached CSV file containing user data.';

// Schedule a cron job to run every 5 minutes
cron.schedule('*/5 * * * *', async () => {
  try {
    console.log('Running scheduled task: Fetching data and sending email');

    // Fetch data and generate CSV
    const csvFilePath = await fetchAndGenerateCSV();

    // Send the email with the generated CSV
    await sendEmail(recipientEmail, subject, body, csvFilePath);

    console.log('CSV generated and email sent successfully');
  } catch (error) {
    console.error('Error in scheduled task:', error.message);
  }
});

console.log('Cron job scheduled: Runs every 5 minutes');
