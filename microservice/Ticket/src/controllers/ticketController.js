const Ticket = require('../models/ticketModel');
const { generateTicketQR } = require('../utils/qrcodeUtil');

exports.getAllTickets = async (req, res) => {
  try {
    const tickets = await Ticket.findAll();
    res.status(200).json({ success: true, data: tickets });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }
    res.status(200).json({ success: true, data: ticket });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getTicketWithDetails = async (req, res) => {
  try {
    const ticket = await Ticket.getTicketWithDetails(req.params.id);
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }
    res.status(200).json({ success: true, data: ticket });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getTicketsByUserId = async (req, res) => {
  try {
    const tickets = await Ticket.findByUserId(req.params.userId);
    res.status(200).json({ success: true, data: tickets });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getTicketsByScheduleId = async (req, res) => {
  try {
    const tickets = await Ticket.findByScheduleId(req.params.scheduleId);
    res.status(200).json({ success: true, data: tickets });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getTicketsByCartId = async (req, res) => {
  try {
    const tickets = await Ticket.findByCartId(req.params.cartId);
    res.status(200).json({ success: true, data: tickets });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createTicket = async (req, res) => {
  try {
    const ticket = await Ticket.create(req.body, req.token);
    res.status(201).json({ success: true, data: ticket });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteTicket = async (req, res) => {
  try {
    await Ticket.delete(req.params.id, req.token);
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAvailableSeatsForSchedule = async (req, res) => {
  try {
    const { scheduleId, zoneId } = req.params;
    const seats = await Ticket.getAvailableSeatsForSchedule(scheduleId, zoneId);
    res.status(200).json({ success: true, data: seats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.confirmTicketsAfterPayment = async (req, res) => {
  try {
    const result = await Ticket.confirmTicketsAfterPayment(req.params.cartId, req.token);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.cancelTickets = async (req, res) => {
  try {
    const result = await Ticket.cancelTickets(req.params.cartId, req.token);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.generateTicketQR = async (req, res) => {
  try {
    const ticket = await Ticket.getTicketWithDetails(req.params.id);
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }
    
    // Check if user is authorized to access this ticket
    if (req.user.id !== ticket.userID && req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'You are not authorized to access this ticket' 
      });
    }
    
    // Format ticket data for QR code
    const ticketData = {
      id: ticket.id,
      eventName: ticket.eventDetails?.eventName || 'Unknown Event',
      scheduleId: ticket.scheduleID,
      seatNumber: ticket.seat_number,
      zoneName: ticket.zoneName,
      date: ticket.eventDetails?.date || 'Unknown Date',
      time: `${ticket.eventDetails?.timeStart || '00:00'} - ${ticket.eventDetails?.timeEnd || '00:00'}`,
      userName: ticket.customerName
    };
    
    // Generate QR code
    const qrCode = await generateTicketQR(ticketData);
    
    res.status(200).json({ 
      success: true, 
      data: {
        ticket,
        qrCode
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


exports.getTicketsByUserId = async (req, res) => {
  try {
    const tickets = await Ticket.findByUserId(req.params.userId);
    res.status(200).json({ success: true, data: tickets });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getTicketsByScheduleId = async (req, res) => {
  try {
    const tickets = await Ticket.findByScheduleId(req.params.scheduleId);
    res.status(200).json({ success: true, data: tickets });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getTicketsByCartId = async (req, res) => {
  try {
    const tickets = await Ticket.findByCartId(req.params.cartId);
    res.status(200).json({ success: true, data: tickets });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createTicket = async (req, res) => {
  try {
    // Extract token from authorization header
    const token = req.headers.authorization.split(' ')[1];
    
    // Create ticket and pass token for service calls
    const ticket = await Ticket.create(req.body, token);
    
    res.status(201).json({ success: true, data: ticket });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.bulkCreateTickets = async (req, res) => {
  try {
    const tickets = await Ticket.bulkCreate(req.body.tickets);
    res.status(201).json({ 
      success: true, 
      message: `Created ${tickets.length} tickets successfully`, 
      data: tickets 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteTicket = async (req, res) => {
  try {
    await Ticket.delete(req.params.id);
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAvailableSeatsForSchedule = async (req, res) => {
  try {
    const { scheduleId, zoneId } = req.params;
    const seats = await Ticket.getAvailableSeatsForSchedule(scheduleId, zoneId);
    res.status(200).json({ success: true, data: seats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.confirmTicketsAfterPayment = async (req, res) => {
  try {
    const result = await Ticket.confirmTicketsAfterPayment(req.params.cartId);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.cancelTickets = async (req, res) => {
  try {
    const result = await Ticket.cancelTickets(req.params.cartId);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.generateTicketQR = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    // Get additional event details using Event Service
    const eventSchedule = await EventService.getEventSchedule(ticket.scheduleID);
    const eventDetails = await EventService.getEventDetails(eventSchedule.eventID);
    
    // Generate QR code
    const qrCode = await generateTicketQRCode(ticketWithDetails);
    
    res.status(200).json({ 
      success: true, 
      data: {
        ticket: ticketWithDetails,
        qrCode
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

