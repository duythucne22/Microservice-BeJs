exports.validateEvent = (req, res, next) => {
    const { name, date, owner } = req.body;
    
    if (!name || !date || !owner) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide name, date, and owner for the event' 
      });
    }
    
    next();
  };
  
  exports.validateSchedule = (req, res, next) => {
    const { stadiumID, eventID, date, timeStart, timeEnd } = req.body;
    
    if (!stadiumID || !eventID || !date || !timeStart || !timeEnd) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide stadiumID, eventID, date, timeStart, and timeEnd' 
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
  