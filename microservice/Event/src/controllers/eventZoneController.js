const EventZone = require('../models/eventZoneModels');

exports.getAllZones = async (req, res) => {
  try {
    const zones = await EventZone.findAll();
    res.status(200).json({ success: true, data: zones });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getZoneById = async (req, res) => {
  try {
    const zone = await EventZone.findById(req.params.id);
    if (!zone) {
      return res.status(404).json({ success: false, message: 'Zone not found' });
    }
    res.status(200).json({ success: true, data: zone });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getZonesByScheduleId = async (req, res) => {
  try {
    const zones = await EventZone.findByScheduleId(req.params.scheduleId);
    res.status(200).json({ success: true, data: zones });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createZone = async (req, res) => {
  try {
    const zone = await EventZone.create(req.body);
    res.status(201).json({ success: true, data: zone });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateZone = async (req, res) => {
  try {
    const zone = await EventZone.findById(req.params.id);
    if (!zone) {
      return res.status(404).json({ success: false, message: 'Zone not found' });
    }
    const updatedZone = await EventZone.update(req.params.id, req.body);
    res.status(200).json({ success: true, data: updatedZone });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteZone = async (req, res) => {
  try {
    const zone = await EventZone.findById(req.params.id);
    if (!zone) {
      return res.status(404).json({ success: false, message: 'Zone not found' });
    }
    await EventZone.delete(req.params.id);
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateZoneStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const zone = await EventZone.findById(id);
    if (!zone) {
      return res.status(404).json({ success: false, message: 'Zone not found' });
    }
    
    const updatedZone = await EventZone.updateStatus(id, status);
    
    res.status(200).json({ success: true, data: updatedZone });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
