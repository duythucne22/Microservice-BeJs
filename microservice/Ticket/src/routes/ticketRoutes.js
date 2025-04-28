const express = require('express');
const ticketController = require('../controllers/ticketController');
const { authenticateToken, authorizeUser, authorizeAdmin } = require('../middleware/authMiddleware');
const { validateTicketCreation, validateCartId } = require('../middleware/validationMiddleware');
const router = express.Router();

// Public routes
router.get('/available/:scheduleId/:zoneId', ticketController.getAvailableSeatsForSchedule);

// Protected routes - Any authenticated user
router.get('/', authenticateToken, authorizeAdmin, ticketController.getAllTickets);
router.get('/:id', authenticateToken, ticketController.getTicketById);
router.get('/:id/details', authenticateToken, ticketController.getTicketWithDetails);
router.get('/user/:userId', authenticateToken, authorizeUser, ticketController.getTicketsByUserId);
router.get('/schedule/:scheduleId', authenticateToken, ticketController.getTicketsByScheduleId);
router.get('/cart/:cartId', authenticateToken, ticketController.getTicketsByCartId);
router.get('/:id/qr', authenticateToken, ticketController.generateTicketQR);

// Protected routes - Create/modify tickets
router.post('/', authenticateToken, validateTicketCreation, ticketController.createTicket);
router.delete('/:id', authenticateToken, ticketController.deleteTicket);

// Protected routes - Cart operations
router.post('/confirm/:cartId', authenticateToken, validateCartId, ticketController.confirmTicketsAfterPayment);
router.post('/cancel/:cartId', authenticateToken, validateCartId, ticketController.cancelTickets);

module.exports = router;
