const Joi = require('joi');

const userSchema = Joi.object({
  userName: Joi.string().min(3).max(30).required(),
  passWord: Joi.string().min(6).required(),
  fullName: Joi.string().required(),
  birth: Joi.date().iso().required(),
  phoneNumber: Joi.string().pattern(/^[0-9]{10,15}$/).required(),
  address: Joi.string().required(),
  email: Joi.string().email().required()
});

const ownerSchema = Joi.object({
  userName: Joi.string().min(3).max(30).required(),
  passWord: Joi.string().min(6).required(),
  phoneNumber: Joi.string().pattern(/^[0-9]{10,15}$/).required(),
  email: Joi.string().email().required()
});

const loginSchema = Joi.object({
  userName: Joi.string().required(),
  passWord: Joi.string().required(),
  role: Joi.string().valid('customer', 'owner').default('customer')
});

exports.validateUserRegistration = (req, res, next) => {
  const { error } = userSchema.validate(req.body);
  
  if (error) {
    return res.status(400).json({ 
      success: false, 
      message: error.details[0].message 
    });
  }
  
  next();
};

exports.validateOwnerRegistration = (req, res, next) => {
  const { error } = ownerSchema.validate(req.body);
  
  if (error) {
    return res.status(400).json({ 
      success: false, 
      message: error.details[0].message 
    });
  }
  
  next();
};

exports.validateLogin = (req, res, next) => {
  const { error } = loginSchema.validate(req.body);
  
  if (error) {
    return res.status(400).json({ 
      success: false, 
      message: error.details[0].message 
    });
  }
  
  next();
};

exports.validatePasswordUpdate = (req, res, next) => {
  const schema = Joi.object({
    currentPassword: Joi.string().required(),
    newPassword: Joi.string().min(6).required()
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
