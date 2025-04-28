const EventService = require('../services/eventService');
const VenueService = require('../services/venueService');

exports.validateTicketCreation = async (req, res, next) => {
  try {
    const { userID, seatID, scheduleID, zoneID } = req.body;
    
    if (!userID || !seatID || !scheduleID || !zoneID) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide userID, seatID, scheduleID, and zoneID' 
      });
    }
    
    // Validate that the event schedule exists
    const schedule = await EventService.validateEventSchedule(scheduleID);
    if (!schedule) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid event schedule' 
      });
    }
    
    // Validate that the zone exists
    const zone = await EventService.validateZone(zoneID);
    if (!zone) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid event zone' 
      });
    }
    
    // Validate that the zone belongs to the schedule
    if (zone.eventScheduleID !== scheduleID) {
      return res.status(400).json({ 
        success: false, 
        message: 'Zone does not belong to the specified schedule' 
      });
    }
    
    // Validate that the seat exists
    const seat = await VenueService.validateSeat(seatID);
    if (!seat) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid seat' 
      });
    }
    
    // Validate that the seat is available
    const seatAvailable = await VenueService.isSeatAvailable(seatID);
    if (!seatAvailable) {
      return res.status(400).json({ 
        success: false, 
        message: 'Seat is not available' 
      });
    }
    
    // Validate that the seat belongs to the stadium where the event is scheduled
    if (seat.stadiumID !== schedule.stadiumID) {
      return res.status(400).json({ 
        success: false, 
        message: 'Seat does not belong to the event stadium' 
      });
    }
    
    next();
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.validateCartId = (req, res, next) => {
  const { cartId } = req.params;
  
  if (!cartId) {
    return res.status(400).json({ 
      success: false, 
      message: 'Please provide a cart ID' 
    });
  }
  
  next();
};
