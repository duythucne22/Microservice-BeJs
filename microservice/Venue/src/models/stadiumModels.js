const db = require('../config/db');

class Stadium {
  static async findAll() {
    const [rows] = await db.query('SELECT * FROM Stadiums');
    return rows;
  }

  static async findById(id) {
    const [rows] = await db.query('SELECT * FROM Stadiums WHERE id = ?', [id]);
    return rows[0];
  }

  static async create(stadium) {
    const { name, size, status, address } = stadium;
    const [result] = await db.query(
      'INSERT INTO Stadiums (name, size, status, address) VALUES (?, ?, ?, ?)',
      [name, size, status, address]
    );
    return { id: result.insertId, name, size, status, address };
  }

  static async update(id, stadium) {
    const { name, size, status, address } = stadium;
    await db.query(
      'UPDATE Stadiums SET name = ?, size = ?, status = ?, address = ? WHERE id = ?',
      [name, size, status, address, id]
    );
    return { id, name, size, status, address };
  }

  static async delete(id) {
    await db.query('DELETE FROM Stadiums WHERE id = ?', [id]);
    return { id };
  }

  static async getStadiumWithSeats(id) {
    const [stadium] = await db.query('SELECT * FROM Stadiums WHERE id = ?', [id]);
    if (!stadium[0]) return null;
    
    const [seats] = await db.query('SELECT * FROM Seats WHERE stadiumID = ?', [id]);
    return {
      ...stadium[0],
      seats
    };
  }
}

module.exports = Stadium;
