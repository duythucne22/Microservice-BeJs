const db = require('../config/db');

class User {
  static async findAll() {
    const [rows] = await db.query('SELECT id, userName, fullName, birth, phoneNumber, address, email FROM Customers');
    return rows;
  }

  static async findById(id) {
    const [rows] = await db.query(
      'SELECT id, userName, fullName, birth, phoneNumber, address, email FROM Customers WHERE id = ?', 
      [id]
    );
    return rows[0];
  }

  static async findByUsername(username) {
    const [rows] = await db.query(
      'SELECT id, userName, fullName, birth, phoneNumber, address, email FROM Customers WHERE userName = ?', 
      [username]
    );
    return rows[0];
  }

  static async findByEmail(email) {
    const [rows] = await db.query(
      'SELECT id, userName, fullName, birth, phoneNumber, address, email FROM Customers WHERE email = ?', 
      [email]
    );
    return rows[0];
  }

  static async update(id, userData) {
    const { fullName, birth, phoneNumber, address, email } = userData;
    
    // Check if email already exists for another user
    if (email) {
      const [existingUsers] = await db.query(
        'SELECT * FROM Customers WHERE email = ? AND id != ?', 
        [email, id]
      );
      
      if (existingUsers.length > 0) {
        throw new Error('Email already exists');
      }
    }
    
    // Build dynamic query based on provided fields
    let query = 'UPDATE Customers SET ';
    const queryParams = [];
    const updateFields = [];
    
    if (fullName !== undefined) {
      updateFields.push('fullName = ?');
      queryParams.push(fullName);
    }
    
    if (birth !== undefined) {
      updateFields.push('birth = ?');
      queryParams.push(birth);
    }
    
    if (phoneNumber !== undefined) {
      updateFields.push('phoneNumber = ?');
      queryParams.push(phoneNumber);
    }
    
    if (address !== undefined) {
      updateFields.push('address = ?');
      queryParams.push(address);
    }
    
    if (email !== undefined) {
      updateFields.push('email = ?');
      queryParams.push(email);
    }
    
    if (updateFields.length === 0) {
      throw new Error('No fields to update');
    }
    
    query += updateFields.join(', ');
    query += ' WHERE id = ?';
    queryParams.push(id);
    
    // Update user
    await db.query(query, queryParams);
    
    // Get updated user
    return this.findById(id);
  }

  static async updateAddress(id, address) {
    await db.query(
      'UPDATE Customers SET address = ? WHERE id = ?',
      [address, id]
    );
    
    return this.findById(id);
  }

  static async search(query) {
    const searchTerm = `%${query}%`;
    
    const [rows] = await db.query(
      `SELECT id, userName, fullName, birth, phoneNumber, address, email 
       FROM Customers 
       WHERE userName LIKE ? OR fullName LIKE ? OR email LIKE ? OR phoneNumber LIKE ?`,
      [searchTerm, searchTerm, searchTerm, searchTerm]
    );
    
    return rows;
  }

  static async getStatistics() {
    // Get total users count
    const [totalCount] = await db.query('SELECT COUNT(*) as count FROM Customers');
    
    // Get users registered in the last 30 days
    const [recentCount] = await db.query(
      'SELECT COUNT(*) as count FROM Customers WHERE birth > DATE_SUB(NOW(), INTERVAL 30 DAY)'
    );
    
    // Get users by age groups (assuming birth is a date field)
    const [ageGroups] = await db.query(`
      SELECT 
        COUNT(CASE WHEN TIMESTAMPDIFF(YEAR, birth, CURDATE()) < 18 THEN 1 END) as under18,
        COUNT(CASE WHEN TIMESTAMPDIFF(YEAR, birth, CURDATE()) BETWEEN 18 AND 24 THEN 1 END) as age18to24,
        COUNT(CASE WHEN TIMESTAMPDIFF(YEAR, birth, CURDATE()) BETWEEN 25 AND 34 THEN 1 END) as age25to34,
        COUNT(CASE WHEN TIMESTAMPDIFF(YEAR, birth, CURDATE()) BETWEEN 35 AND 44 THEN 1 END) as age35to44,
        COUNT(CASE WHEN TIMESTAMPDIFF(YEAR, birth, CURDATE()) BETWEEN 45 AND 54 THEN 1 END) as age45to54,
        COUNT(CASE WHEN TIMESTAMPDIFF(YEAR, birth, CURDATE()) >= 55 THEN 1 END) as age55plus
      FROM Customers
    `);
    
    return {
      totalUsers: totalCount[0].count,
      recentUsers: recentCount[0].count,
      ageGroups: ageGroups[0]
    };
  }
}

module.exports = User;
