const Stadium = require('../models/stadiumModels');

exports.getAllStadiums = async (req, res) => {
  try {
    const stadiums = await Stadium.findAll();
    res.status(200).json({ success: true, data: stadiums });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getStadiumById = async (req, res) => {
  try {
    const stadium = await Stadium.findById(req.params.id);
    if (!stadium) {
      return res.status(404).json({ success: false, message: 'Stadium not found' });
    }
    res.status(200).json({ success: true, data: stadium });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getStadiumWithSeats = async (req, res) => {
  try {
    const stadium = await Stadium.getStadiumWithSeats(req.params.id);
    if (!stadium) {
      return res.status(404).json({ success: false, message: 'Stadium not found' });
    }
    res.status(200).json({ success: true, data: stadium });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createStadium = async (req, res) => {
  try {
    const stadium = await Stadium.create(req.body);
    res.status(201).json({ success: true, data: stadium });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateStadium = async (req, res) => {
  try {
    const stadium = await Stadium.findById(req.params.id);
    if (!stadium) {
      return res.status(404).json({ success: false, message: 'Stadium not found' });
    }
    const updatedStadium = await Stadium.update(req.params.id, req.body);
    res.status(200).json({ success: true, data: updatedStadium });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteStadium = async (req, res) => {
  try {
    const stadium = await Stadium.findById(req.params.id);
    if (!stadium) {
      return res.status(404).json({ success: false, message: 'Stadium not found' });
    }
    await Stadium.delete(req.params.id);
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
