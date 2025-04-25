const db = require('../config/db');
const { hashPassword, comparePassword } = require('../utils/passwordUtils');

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
    const [rows] = await db.query('SELECT * FROM Customers WHERE userName = ?', [username]);
    return rows[0];
  }

  static async findByEmail(email) {
    const [rows] = await db.query('SELECT * FROM Customers WHERE email = ?', [email]);
    return rows[0];
  }

  static async create(user) {
    const { userName, passWord, fullName, birth, phoneNumber, address, email } = user;
    
    // Check if username already exists
    const existingUser = await this.findByUsername(userName);
    if (existingUser) {
      throw new Error('Username already exists');
    }
    
    // Check if email already exists
    const existingEmail = await this.findByEmail(email);
    if (existingEmail) {
      throw new Error('Email already exists');
    }
    
    // Hash password
    const hashedPassword = await hashPassword(passWord);
    
    // Insert user
    const [result] = await db.query(
      'INSERT INTO Customers (userName, passWord, fullName, birth, phoneNumber, address, email) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [userName, hashedPassword, fullName, birth, phoneNumber, address, email]
    );
    
    return { 
      id: result.insertId, 
      userName, 
      fullName, 
      birth, 
      phoneNumber, 
      address, 
      email,
      role: 'customer'
    };
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
    
    // Update user
    await db.query(
      'UPDATE Customers SET fullName = ?, birth = ?, phoneNumber = ?, address = ?, email = ? WHERE id = ?',
      [fullName, birth, phoneNumber, address, email, id]
    );
    
    return { id, fullName, birth, phoneNumber, address, email };
  }

  static async updatePassword(id, currentPassword, newPassword) {
    // Get current user with password
    const [rows] = await db.query('SELECT * FROM Customers WHERE id = ?', [id]);
    const user = rows[0];
    
    if (!user) {
      throw new Error('User not found');
    }
    
    // Verify current password
    const isPasswordValid = await comparePassword(currentPassword, user.passWord);
    
    if (!isPasswordValid) {
      throw new Error('Current password is incorrect');
    }
    
    // Hash new password
    const hashedPassword = await hashPassword(newPassword);
    
    // Update password
    await db.query(
      'UPDATE Customers SET passWord = ? WHERE id = ?',
      [hashedPassword, id]
    );
    
    return { id, message: 'Password updated successfully' };
  }

  static async delete(id) {
    await db.query('DELETE FROM Customers WHERE id = ?', [id]);
    return { id };
  }

  static async validateCredentials(username, password) {
    // Get user with password
    const user = await this.findByUsername(username);
    
    if (!user) {
      return null;
    }
    
    // Verify password
    const isPasswordValid = await comparePassword(password, user.passWord);
    
    if (!isPasswordValid) {
      return null;
    }
    
    // Return user without password
    const { passWord, ...userWithoutPassword } = user;
    return { ...userWithoutPassword, role: 'customer' };
  }
}

module.exports = User;
