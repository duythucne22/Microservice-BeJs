const Owner = require('../models/ownerModels');

exports.getAllOwners = async (req, res) => {
  try {
    const owners = await Owner.findAll();
    res.status(200).json({ success: true, data: owners });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getOwnerById = async (req, res) => {
  try {
    const owner = await Owner.findById(req.params.id);
    if (!owner) {
      return res.status(404).json({ success: false, message: 'Owner not found' });
    }
    res.status(200).json({ success: true, data: owner });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createOwner = async (req, res) => {
  try {
    const owner = await Owner.create(req.body);
    res.status(201).json({ success: true, data: owner });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateOwner = async (req, res) => {
  try {
    const owner = await Owner.update(req.params.id, req.body);
    res.status(200).json({ success: true, data: owner });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const result = await Owner.updatePassword(req.params.id, currentPassword, newPassword);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteOwner = async (req, res) => {
  try {
    await Owner.delete(req.params.id);
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getCurrentOwner = async (req, res) => {
  try {
    const owner = await Owner.findById(req.user.id);
    if (!owner) {
      return res.status(404).json({ success: false, message: 'Owner not found' });
    }
    res.status(200).json({ success: true, data: owner });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
