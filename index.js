const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const { MONGODB_URI, PORT } = require('./config');
const userRoute = require('./routes/users');

const app = express();

mongoose.set('strictQuery', false);

console.log('Connecting to MongoDB...');
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB...');
    app.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
    // Handle the error (e.g., exit the process or perform recovery actions)
  });

app.use(express.json());
app.use(cors());

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

app.use('/', userRoute);
