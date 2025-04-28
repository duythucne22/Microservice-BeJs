const axios = require('axios');
require('dotenv').config();

class VenueService {
  static async getSeat(seatId, token = null) {
    try {
      const headers = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await axios.get(
        `${process.env.VENUE_SERVICE_URL}/api/seats/${seatId}`,
        { headers }
      );
      return response.data;
    } catch (error) {
      console.error('Venue service error:', error.message);
      throw new Error('Failed to fetch seat information');
    }
  }

  static async getStadium(stadiumId) {
    try {
      const response = await axios.get(`${process.env.VENUE_SERVICE_URL}/api/stadiums/${stadiumId}`);
      return response.data.data;
    } catch (error) {
      console.error('Venue service error:', error.message);
      throw new Error('Failed to fetch stadium information');
    }
  }

  static async updateSeatStatus(seatId, status, token) {
    try {
      const response = await axios.patch(
        `${process.env.VENUE_SERVICE_URL}/api/seats/${seatId}/status`,
        { status },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Venue service error:', error.message);
      throw new Error('Failed to update seat status');
    }
  }

  static async validateSeat(seatId) {
    try {
      const response = await this.getSeat(seatId);
      return response.success && response.data;
    } catch (error) {
      return false;
    }
  }

  static async isSeatAvailable(seatId) {
    try {
      const response = await this.getSeat(seatId);
      return response.success && response.data && response.data.status === 'available';
    } catch (error) {
      return false;
    }
  }
}

module.exports = VenueService;
