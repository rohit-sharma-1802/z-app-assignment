// Import dependencies
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const ruleRoutes = require('./routes/routes');
require('dotenv').config();

// Initialize the app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware setup
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Database connection
const dbURI = process.env.DB_URI || 'your_default_mongo_db_uri_here';
mongoose.connect(dbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Successfully connected to the database'))
  .catch(error => console.error('Database connection error:', error));

// Route setup
app.use('/api/rules', ruleRoutes);

// Serve the homepage
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/views', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
