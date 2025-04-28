const axios = require('axios');
const CircuitBreaker = require('../utils/circuitBreaker');
require('dotenv').config();

class AuthService {
    static async verifyToken(token) {
    const breaker = new CircuitBreaker(async (token) => {
      const response = await axios.post(
        `${process.env.AUTH_SERVICE_URL}/api/auth/verify-token`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      return response.data;
    });

    try {
      return await breaker.exec(token);
    } catch (error) {
      console.error('Auth service error:', error.message);
      throw new Error('Authentication service unavailable');
    }
  }

  static async getUserProfile(token) {
    try {
      const response = await axios.get(
        `${process.env.AUTH_SERVICE_URL}/api/users/profile`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Auth service error:', error.message);
      throw new Error('Failed to fetch user profile');
    }
  }
}

module.exports = AuthService;
