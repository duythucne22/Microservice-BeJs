const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

// Import routes
const stadiumRoutes = require('./src/routes/stadiumRoutes');
const seatRoutes = require('./src/routes/seatRoutes');
const eventZoneRoutes = require('./src/routes/eventZoneRoutes'); // Add this line

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api/stadiums', stadiumRoutes);
app.use('/api/seats', seatRoutes);
app.use('/api/zones', eventZoneRoutes); // Add this line

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', service: 'Venue Service' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 8004;

app.listen(PORT, () => {
  console.log(`Venue Service running on port ${PORT}`);
});
