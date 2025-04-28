const QRCode = require('qrcode');

exports.generateTicketQR = async (ticketData) => {
  try {
    // Create a JSON string with ticket information
    const ticketInfo = JSON.stringify({
      id: ticketData.id,
      event: ticketData.eventName,
      schedule: ticketData.scheduleId,
      seat: ticketData.seatNumber,
      zone: ticketData.zoneName,
      date: ticketData.date,
      time: ticketData.time,
      user: ticketData.userName,
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
