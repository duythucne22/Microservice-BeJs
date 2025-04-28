const db = require('../config/db');

class Seat {
  static async findAll() {
    const [rows] = await db.query('SELECT * FROM Seats');
    return rows;
  }

  static async findById(id) {
    const [rows] = await db.query('SELECT * FROM Seats WHERE id = ?', [id]);
    return rows[0];
  }

  static async findByStadiumId(stadiumId) {
    const [rows] = await db.query('SELECT * FROM Seats WHERE stadiumID = ?', [stadiumId]);
    return rows;
  }

  static async create(seat) {
    const { stadiumID, seat_number, status } = seat;
    
    // Check if seat already exists in this stadium
    const [existingSeat] = await db.query(
      'SELECT * FROM Seats WHERE stadiumID = ? AND seat_number = ?',
      [stadiumID, seat_number]
    );
    
    if (existingSeat.length > 0) {
      throw new Error(`Seat ${seat_number} already exists in stadium ${stadiumID}`);
    }
    
    const [result] = await db.query(
      'INSERT INTO Seats (stadiumID, seat_number, status) VALUES (?, ?, ?)',
      [stadiumID, seat_number, status]
    );
    return { id: result.insertId, stadiumID, seat_number, status };
  }

  static async update(id, seat) {
    const { stadiumID, seat_number, status } = seat;
    
    // Check if updating would create a duplicate
    const [existingSeat] = await db.query(
      'SELECT * FROM Seats WHERE stadiumID = ? AND seat_number = ? AND id != ?',
      [stadiumID, seat_number, id]
    );
    
    if (existingSeat.length > 0) {
      throw new Error(`Seat ${seat_number} already exists in stadium ${stadiumID}`);
    }
    
    await db.query(
      'UPDATE Seats SET stadiumID = ?, seat_number = ?, status = ? WHERE id = ?',
      [stadiumID, seat_number, status, id]
    );
    return { id, stadiumID, seat_number, status };
  }

  static async delete(id) {
    await db.query('DELETE FROM Seats WHERE id = ?', [id]);
    return { id };
  }

  static async bulkCreate(seats) {
    // Start a transaction
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();
      
      const createdSeats = [];
      for (const seat of seats) {
        const { stadiumID, seat_number, status } = seat;
        
        // Check if seat already exists
        const [existingSeat] = await connection.query(
          'SELECT * FROM Seats WHERE stadiumID = ? AND seat_number = ?',
          [stadiumID, seat_number]
        );
        
        if (existingSeat.length === 0) {
          const [result] = await connection.query(
            'INSERT INTO Seats (stadiumID, seat_number, status) VALUES (?, ?, ?)',
            [stadiumID, seat_number, status]
          );
          createdSeats.push({ 
            id: result.insertId, 
            stadiumID, 
            seat_number, 
            status 
          });
        }
      }
      
      await connection.commit();
      return createdSeats;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  static async updateStatus(id, status) {
    await db.query('UPDATE Seats SET status = ? WHERE id = ?', [status, id]);
    return { id, status };
  }
}

module.exports = Seat;
