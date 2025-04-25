const db = require('../config/db');
const { hashPassword, comparePassword } = require('../utils/passwordUtils');

class Owner {
  static async findAll() {
    const [rows] = await db.query('SELECT id, userName, phoneNumber, email FROM Owners');
    return rows;
  }

  static async findById(id) {
    const [rows] = await db.query(
      'SELECT id, userName, phoneNumber, email FROM Owners WHERE id = ?', 
      [id]
    );
    return rows[0];
  }

  static async findByUsername(username) {
    const [rows] = await db.query('SELECT * FROM Owners WHERE userName = ?', [username]);
    return rows[0];
  }

  static async findByEmail(email) {
    const [rows] = await db.query('SELECT * FROM Owners WHERE email = ?', [email]);
    return rows[0];
  }

  static async create(owner) {
    const { userName, passWord, phoneNumber, email } = owner;
    
    // Check if username already exists
    const existingOwner = await this.findByUsername(userName);
    if (existingOwner) {
      throw new Error('Username already exists');
    }
    
    // Check if email already exists
    const existingEmail = await this.findByEmail(email);
    if (existingEmail) {
      throw new Error('Email already exists');
    }
    
    // Hash password
    const hashedPassword = await hashPassword(passWord);
    
    // Insert owner
    const [result] = await db.query(
      'INSERT INTO Owners (userName, passWord, phoneNumber, email) VALUES (?, ?, ?, ?)',
      [userName, hashedPassword, phoneNumber, email]
    );
    
    return { 
      id: result.insertId, 
      userName, 
      phoneNumber, 
      email,
      role: 'owner'
    };
  }

  static async update(id, ownerData) {
    const { phoneNumber, email } = ownerData;
    
    // Check if email already exists for another owner
    if (email) {
      const [existingOwners] = await db.query(
        'SELECT * FROM Owners WHERE email = ? AND id != ?', 
        [email, id]
      );
      
      if (existingOwners.length > 0) {
        throw new Error('Email already exists');
      }
    }
    
    // Update owner
    await db.query(
      'UPDATE Owners SET phoneNumber = ?, email = ? WHERE id = ?',
      [phoneNumber, email, id]
    );
    
    return { id, phoneNumber, email };
  }

  static async updatePassword(id, currentPassword, newPassword) {
    // Get current owner with password
    const [rows] = await db.query('SELECT * FROM Owners WHERE id = ?', [id]);
    const owner = rows[0];
    
    if (!owner) {
      throw new Error('Owner not found');
    }
    
    // Verify current password
    const isPasswordValid = await comparePassword(currentPassword, owner.passWord);
    
    if (!isPasswordValid) {
      throw new Error('Current password is incorrect');
    }
    
    // Hash new password
    const hashedPassword = await hashPassword(newPassword);
    
    // Update password
    await db.query(
      'UPDATE Owners SET passWord = ? WHERE id = ?',
      [hashedPassword, id]
    );
    
    return { id, message: 'Password updated successfully' };
  }

  static async delete(id) {
    await db.query('DELETE FROM Owners WHERE id = ?', [id]);
    return { id };
  }

  static async validateCredentials(username, password) {
    // Get owner with password
    const owner = await this.findByUsername(username);
    
    if (!owner) {
      return null;
    }
    
    // Verify password
    const isPasswordValid = await comparePassword(password, owner.passWord);
    
    if (!isPasswordValid) {
      return null;
    }
    
    // Return owner without password
    const { passWord, ...ownerWithoutPassword } = owner;
    return { ...ownerWithoutPassword, role: 'owner' };
  }
}

module.exports = Owner;
