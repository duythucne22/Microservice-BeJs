const express = require('express');
const eventZoneController = require('../controllers/eventZoneController');
const { authenticateToken, authorizeOwner } = require('../middleware/authMiddleware');
const router = express.Router();

// Public routes
router.get('/', eventZoneController.getAllZones);
router.get('/:id', eventZoneController.getZoneById);
router.get('/schedule/:scheduleId', eventZoneController.getZonesByScheduleId);

// Protected routes
router.post('/', authenticateToken, authorizeOwner, eventZoneController.createZone);
router.put('/:id', authenticateToken, authorizeOwner, eventZoneController.updateZone);
router.patch('/:id/status', authenticateToken, authorizeOwner, eventZoneController.updateZoneStatus);
router.delete('/:id', authenticateToken, authorizeOwner, eventZoneController.deleteZone);

module.exports = router;
