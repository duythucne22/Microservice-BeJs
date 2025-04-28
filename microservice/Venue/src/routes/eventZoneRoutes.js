const express = require('express');
const eventZoneController = require('../controllers/eventZoneController');
const { authenticateToken, authorizeAdmin } = require('../middleware/authMiddleware');
const router = express.Router();

// Public routes (no authentication required)
router.get('/', eventZoneController.getAllZones);
router.get('/:id', eventZoneController.getZoneById);
router.get('/:id/details', eventZoneController.getZoneWithEventDetails);
router.get('/schedule/:scheduleId', eventZoneController.getZonesByScheduleId);

// Protected routes (require authentication)
router.post('/', authenticateToken, authorizeAdmin, eventZoneController.createZone);
router.put('/:id', authenticateToken, authorizeAdmin, eventZoneController.updateZone);
router.patch('/:id/status', authenticateToken, authorizeAdmin, eventZoneController.updateZoneStatus);
router.delete('/:id', authenticateToken, authorizeAdmin, eventZoneController.deleteZone);

module.exports = router;
