const fs = require('fs');
const path = require('path');
const { getDb } = require('../Config/mongo');

// Function to fetch all data from MongoDB
const fetchData = async () => {
  try {
    const db = await getDb();
    const dronaRegister = db.collection('dronaRegister');

    // Fetch all documents
    const users = await dronaRegister.find({}).toArray(); // Converts cursor to array
    return users;
  } catch (error) {
    console.error('Error fetching data:', error.message);
    throw error;
  }
};

// Function to generate a CSV file
const generateCSV = async (users) => {
  try {
    if (!users || users.length === 0) {
      throw new Error('No user data found to export');
    }

    // CSV headers
    const csvHeaders = 'ID,Parent Name,Student Name,Email,Phone,Grade,Message\n';

    // Map user data to CSV rows
    const csvRows = users
      .map((user) => {
        // Ensure fields are handled properly
        const sanitizedData = [
          user._id || 'N/A',
          `"${user.Parent_name || 'N/A'}"`,
          `"${user.Student_name || 'N/A'}"`,
          `"${user.Email || 'N/A'}"`,
          user.Phone ? user.Phone : 'N/A',
          user.Grade ? user.Grade : 'N/A',
          `"${user.Message || 'N/A'}"`,
        ];
        return sanitizedData.join(',');
      })
      .join('\n');

    // File path with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filePath = path.join(__dirname, `exports/user_data_${timestamp}.csv`);

    // Ensure exports folder exists
    fs.mkdirSync(path.dirname(filePath), { recursive: true });

    // Write to file
    await fs.promises.writeFile(filePath, csvHeaders + csvRows);

    console.log('CSV generated at:', filePath);
    return filePath;
  } catch (err) {
    console.error('Error generating CSV:', err.message);
    throw err;
  }
};

// Function to fetch data and generate a CSV file
const fetchAndGenerateCSV = async () => {
  try {
    const users = await fetchData(); // Fetch data
    const filePath = await generateCSV(users); // Generate CSV
    return filePath; // Return CSV file path
  } catch (error) {
    console.error('Error in fetch and generate CSV:', error.message);
    throw error;
  }
};

const deleteFile = async (filePath) => {
  try {
    // Check if file exists before attempting to delete
    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath); // Delete the file
      console.log('CSV file deleted:', filePath);
    }
  } catch (error) {
    console.error('Error deleting file:', error.message);
  }
};


// Export the fetchAndGenerateCSV function

module.exports = { fetchAndGenerateCSV, deleteFile };
