const express = require('express');
const eventScheduleController = require('../controllers/eventScheduleController');
const { authenticateToken, authorizeOwner } = require('../middleware/authMiddleware');
const router = express.Router();

// Public routes
router.get('/', eventScheduleController.getAllSchedules);
router.get('/:id', eventScheduleController.getScheduleById);
router.get('/event/:eventId', eventScheduleController.getSchedulesByEventId);

// Protected routes
router.post('/', authenticateToken, authorizeOwner, eventScheduleController.createSchedule);
router.put('/:id', authenticateToken, authorizeOwner, eventScheduleController.updateSchedule);
router.delete('/:id', authenticateToken, authorizeOwner, eventScheduleController.deleteSchedule);

module.exports = router;
