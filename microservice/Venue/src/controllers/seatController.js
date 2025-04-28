const Seat = require('../models/seatModels');

exports.getAllSeats = async (req, res) => {
  try {
    const seats = await Seat.findAll();
    res.status(200).json({ success: true, data: seats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getSeatById = async (req, res) => {
  try {
    const seat = await Seat.findById(req.params.id);
    if (!seat) {
      return res.status(404).json({ success: false, message: 'Seat not found' });
    }
    res.status(200).json({ success: true, data: seat });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getSeatsByStadiumId = async (req, res) => {
  try {
    const seats = await Seat.findByStadiumId(req.params.stadiumId);
    res.status(200).json({ success: true, data: seats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createSeat = async (req, res) => {
  try {
    const seat = await Seat.create(req.body);
    res.status(201).json({ success: true, data: seat });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.bulkCreateSeats = async (req, res) => {
  try {
    const seats = await Seat.bulkCreate(req.body.seats);
    res.status(201).json({ 
      success: true, 
      message: `Created ${seats.length} seats successfully`, 
      data: seats 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateSeat = async (req, res) => {
  try {
    const seat = await Seat.findById(req.params.id);
    if (!seat) {
      return res.status(404).json({ success: false, message: 'Seat not found' });
    }
    const updatedSeat = await Seat.update(req.params.id, req.body);
    res.status(200).json({ success: true, data: updatedSeat });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateSeatStatus = async (req, res) => {
  try {
    const seat = await Seat.findById(req.params.id);
    if (!seat) {
      return res.status(404).json({ success: false, message: 'Seat not found' });
    }
    const updatedSeat = await Seat.updateStatus(req.params.id, req.body.status);
    res.status(200).json({ success: true, data: updatedSeat });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteSeat = async (req, res) => {
  try {
    const seat = await Seat.findById(req.params.id);
    if (!seat) {
      return res.status(404).json({ success: false, message: 'Seat not found' });
    }
    await Seat.delete(req.params.id);
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
