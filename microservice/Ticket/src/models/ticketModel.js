const pool = require('../config/db');
const VenueService = require('../services/venueService');
const EventService = require('../services/eventService');

class Ticket {
  static async findAll() {
    const [rows] = await pool.query(`
      SELECT t.*, c.userName as customerName, s.seat_number, ez.name as zoneName, ez.price
      FROM Tickets t
      JOIN Customers c ON t.userID = c.id
      JOIN Seats s ON t.seatID = s.id
      JOIN eventZone ez ON t.zoneID = ez.id
      JOIN EventSchedules es ON t.scheduleID = es.id
    `);
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.query(`
      SELECT t.*, c.userName as customerName, s.seat_number, ez.name as zoneName, ez.price
      FROM Tickets t
      JOIN Customers c ON t.userID = c.id
      JOIN Seats s ON t.seatID = s.id
      JOIN eventZone ez ON t.zoneID = ez.id
      JOIN EventSchedules es ON t.scheduleID = es.id
      WHERE t.id = ?
    `, [id]);
    return rows[0];
  }

  static async findByUserId(userId) {
    const [rows] = await pool.query(`
      SELECT t.*, c.userName as customerName, s.seat_number, ez.name as zoneName, ez.price,
      es.date as eventDate, es.timeStart, es.timeEnd, el.name as eventName
      FROM Tickets t
      JOIN Customers c ON t.userID = c.id
      JOIN Seats s ON t.seatID = s.id
      JOIN eventZone ez ON t.zoneID = ez.id
      JOIN EventSchedules es ON t.scheduleID = es.id
      JOIN EventList el ON es.eventID = el.id
      WHERE t.userID = ?
    `, [userId]);
    return rows;
  }

  static async findByScheduleId(scheduleId) {
    const [rows] = await pool.query(`
      SELECT t.*, c.userName as customerName, s.seat_number, ez.name as zoneName, ez.price
      FROM Tickets t
      JOIN Customers c ON t.userID = c.id
      JOIN Seats s ON t.seatID = s.id
      JOIN eventZone ez ON t.zoneID = ez.id
      WHERE t.scheduleID = ?
    `, [scheduleId]);
    return rows;
  }

  static async findByCartId(cartId) {
    const [rows] = await pool.query(`
      SELECT t.*, c.userName as customerName, s.seat_number, ez.name as zoneName, ez.price
      FROM Tickets t
      JOIN Customers c ON t.userID = c.id
      JOIN Seats s ON t.seatID = s.id
      JOIN eventZone ez ON t.zoneID = ez.id
      WHERE t.cartID = ?
    `, [cartId]);
    return rows;
  }

  static async create(ticket, token) {
    const { userID, seatID, scheduleID, zoneID, cartID } = ticket;
    
    // Check if seat is already booked for this schedule
    const [existingTicket] = await pool.query(
      'SELECT * FROM Tickets WHERE seatID = ? AND scheduleID = ?',
      [seatID, scheduleID]
    );
    
    if (existingTicket.length > 0) {
      throw new Error('This seat is already booked for this event schedule');
    }
    
    // Start a transaction
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      
      // Update seat status to reserved via Venue Service
      await VenueService.updateSeatStatus(seatID, "reserved", token);
      
      // Create the ticket
      const [result] = await connection.query(
        'INSERT INTO Tickets (userID, seatID, scheduleID, zoneID, cartID) VALUES (?, ?, ?, ?, ?)',
        [userID, seatID, scheduleID, zoneID, cartID]
      );
      
      await connection.commit();
      
      return { 
        id: result.insertId, 
        userID, 
        seatID, 
        scheduleID, 
        zoneID,
        cartID
      };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  static async delete(id, token) {
    // Get the ticket to find the seat ID
    const [ticket] = await pool.query('SELECT * FROM Tickets WHERE id = ?', [id]);
    if (ticket.length === 0) {
      throw new Error('Ticket not found');
    }
    
    const seatID = ticket[0].seatID;
    
    // Start a transaction
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      
      // Update seat status back to available via Venue Service
      await VenueService.updateSeatStatus(seatID, "available", token);
      
      // Delete the ticket
      await connection.query('DELETE FROM Tickets WHERE id = ?', [id]);
      
      await connection.commit();
      return { id };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  static async getAvailableSeatsForSchedule(scheduleId, zoneId) {
    // Get schedule details to find the stadium
    try {
      const scheduleResponse = await EventService.getEventSchedule(scheduleId);
      if (!scheduleResponse.success) {
        throw new Error('Failed to fetch event schedule');
      }
      
      const stadiumID = scheduleResponse.data.stadiumID;
      
      // Get all seats that are available for this stadium
      const [rows] = await pool.query(`
        SELECT s.* 
        FROM Seats s
        LEFT JOIN Tickets t ON t.seatID = s.id AND t.scheduleID = ?
        WHERE s.stadiumID = ? 
        AND s.status = 'available'
        AND t.id IS NULL
      `, [scheduleId, stadiumID]);
      
      return rows;
    } catch (error) {
      console.error('Error getting available seats:', error);
      throw error;
    }
  }

  static async confirmTicketsAfterPayment(cartId, token) {
    // Start a transaction
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      
      // Get all tickets in the cart
      const [tickets] = await connection.query(
        'SELECT * FROM Tickets WHERE cartID = ?',
        [cartId]
      );
      
      // Update seat status from reserved to sold for all seats in the cart
      for (const ticket of tickets) {
        await VenueService.updateSeatStatus(ticket.seatID, "sold", token);
      }
      
      await connection.commit();
      return { success: true, message: 'Tickets confirmed', count: tickets.length };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  static async cancelTickets(cartId, token) {
    // Start a transaction
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      
      // Get all tickets in the cart
      const [tickets] = await connection.query(
        'SELECT * FROM Tickets WHERE cartID = ?',
        [cartId]
      );
      
      // Update seat status back to available for all seats in the cart
      for (const ticket of tickets) {
        await VenueService.updateSeatStatus(ticket.seatID, "available", token);
      }
      
      // Delete all tickets in the cart
      await connection.query('DELETE FROM Tickets WHERE cartID = ?', [cartId]);
      
      await connection.commit();
      return { success: true, message: 'Tickets cancelled', count: tickets.length };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  static async getTicketWithDetails(id) {
    const ticket = await this.findById(id);
    if (!ticket) return null;
    
    try {
      // Get event schedule details
      const scheduleResponse = await EventService.getEventSchedule(ticket.scheduleID);
      
      if (scheduleResponse.success) {
        const schedule = scheduleResponse.data;
        
        return {
          ...ticket,
          eventDetails: {
            eventName: schedule.eventName,
            stadiumName: schedule.stadiumName,
            date: schedule.date,
            timeStart: schedule.timeStart,
            timeEnd: schedule.timeEnd
          }
        };
      }
      
      return ticket;
    } catch (error) {
      console.error('Error fetching ticket details:', error);
      return ticket;
    }
  }
}

module.exports = Ticket;
