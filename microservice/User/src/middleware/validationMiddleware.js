const Joi = require('joi');

exports.validateUserUpdate = (req, res, next) => {
  const schema = Joi.object({
    fullName: Joi.string(),
    birth: Joi.date().iso(),
    phoneNumber: Joi.string().pattern(/^[0-9]{10,15}$/),
    address: Joi.string(),
    email: Joi.string().email()
  }).min(1); // At least one field must be present
  
  const { error } = schema.validate(req.body);
  
  if (error) {
    return res.status(400).json({ 
      success: false, 
      message: error.details[0].message 
    });
  }
  
  next();
};

exports.validateAddressUpdate = (req, res, next) => {
  const schema = Joi.object({
    address: Joi.string().required()
  });
  
  const { error } = schema.validate(req.body);
  
  if (error) {
    return res.status(400).json({ 
      success: false, 
      message: error.details[0].message 
    });
  }
  
  next();
};
