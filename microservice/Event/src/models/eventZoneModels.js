const pool = require('../config/db');

class EventZone {
  static async findAll() {
    const [rows] = await pool.query('SELECT * FROM eventZone');
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.query('SELECT * FROM eventZone WHERE id = ?', [id]);
    return rows[0];
  }

  static async findByScheduleId(scheduleId) {
    const [rows] = await pool.query('SELECT * FROM eventZone WHERE eventScheduleID = ?', [scheduleId]);
    return rows;
  }

  static async create(zone) {
    const { name, size, eventScheduleID, price, status } = zone;
    const [result] = await pool.query(
      'INSERT INTO eventZone (name, size, eventScheduleID, price, status) VALUES (?, ?, ?, ?, ?)',
      [name, size, eventScheduleID, price, status]
    );
    return { id: result.insertId, name, size, eventScheduleID, price, status };
  }

  static async update(id, zone) {
    const { name, size, eventScheduleID, price, status } = zone;
    await pool.query(
      'UPDATE eventZone SET name = ?, size = ?, eventScheduleID = ?, price = ?, status = ? WHERE id = ?',
      [name, size, eventScheduleID, price, status, id]
    );
    return { id, name, size, eventScheduleID, price, status };
  }

  static async delete(id) {
    await pool.query('DELETE FROM eventZone WHERE id = ?', [id]);
    return { id };
  }

  static async updateStatus(id, status) {
    await pool.query('UPDATE eventZone SET status = ? WHERE id = ?', [status, id]);
    return { id, status };
  }
}

module.exports = EventZone;
