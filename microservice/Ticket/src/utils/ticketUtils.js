const QRCode = require('qrcode');
const axios = require('axios');

exports.generateTicketQRCode = async (ticketData) => {
  try {
    // Create a JSON string with ticket information
    const ticketInfo = JSON.stringify({
      id: ticketData.id,
      event: ticketData.eventName,
      seat: ticketData.seat_number,
      zone: ticketData.zoneName,
      date: ticketData.eventDate,
      time: `${ticketData.timeStart} - ${ticketData.timeEnd}`,
      user: ticketData.customerName,
      timestamp: new Date().toISOString()
    });
    
    // Generate QR code as data URL
    const qrCodeDataUrl = await QRCode.toDataURL(ticketInfo);
    return qrCodeDataUrl;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw error;
  }
};

exports.getEventDetails = async (scheduleId) => {
  try {
    const response = await axios.get(`${process.env.EVENT_SERVICE_URL}/api/schedules/${scheduleId}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching event details:', error);
    throw new Error('Failed to fetch event details');
  }
};

exports.validateSeat = async (seatId, scheduleId) => {
  try {
    // Check if seat exists and is available
    const seatResponse = await axios.get(`${process.env.VENUE_SERVICE_URL}/api/seats/${seatId}`);
    const seat = seatResponse.data.data;
    
    if (!seat) {
      throw new Error('Seat not found');
    }
    
    if (seat.status !== 'available') {
      throw new Error('Seat is not available');
    }
    
    // Check if the seat is in the stadium where the event is scheduled
    const scheduleResponse = await axios.get(`${process.env.EVENT_SERVICE_URL}/api/schedules/${scheduleId}`);
    const schedule = scheduleResponse.data.data;
    
    if (seat.stadiumID !== schedule.stadiumID) {
      throw new Error('Seat does not belong to the event stadium');
    }
    
    return true;
  } catch (error) {
    console.error('Error validating seat:', error);
    throw error;
  }
};
