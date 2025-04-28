exports.validateStadium = (req, res, next) => {
    const { name, size, status, address } = req.body;
    
    if (!name || !size || !status || !address) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide name, size, status, and address for the stadium' 
      });
    }
    
    next();
  };
  
  exports.validateSeat = (req, res, next) => {
    const { stadiumID, seat_number, status } = req.body;
    
    if (!stadiumID || !seat_number || !status) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide stadiumID, seat_number, and status' 
      });
    }
    
    next();
  };
  
  exports.validateSeatStatus = (req, res, next) => {
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide status' 
      });
    }
    
    // Optional: Validate that status is one of the allowed values
    const allowedStatuses = ['available', 'reserved', 'sold', 'maintenance'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ 
        success: false, 
        message: `Status must be one of: ${allowedStatuses.join(', ')}` 
      });
    }
    
    next();
  };
  
  exports.validateZone = (req, res, next) => {
    const { name, size, eventScheduleID, price, status } = req.body;
    
    if (!name || !size || !eventScheduleID || !price || !status) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide name, size, eventScheduleID, price, and status' 
      });
    }
    
    next();
  };
  
  exports.validateZoneStatus = (req, res, next) => {
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide status' 
      });
    }
    
    // Optional: Validate that status is one of the allowed values
    const allowedStatuses = ['available', 'sold_out', 'closed'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ 
        success: false, 
        message: `Status must be one of: ${allowedStatuses.join(', ')}` 
      });
    }
    
    next();
  };
  