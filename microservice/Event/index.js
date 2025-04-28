const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

// Import routes
const eventRoutes = require('./src/routes/eventRoutes');
const eventScheduleRoutes = require('./src/routes/eventScheduleRoutes');
const eventZoneRoutes = require('./src/routes/eventZoneRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api/events', eventRoutes);
app.use('/api/schedules', eventScheduleRoutes);
app.use('/api/zones', eventZoneRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', service: 'Event Service' });
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

const PORT = process.env.PORT || 8003;

app.listen(PORT, () => {
  console.log(`Event Service running on port ${PORT}`);
});
