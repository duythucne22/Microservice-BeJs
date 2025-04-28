const axios = require('axios');
require('dotenv').config();

class EventService {
  static async getEventSchedule(scheduleId, token = null) {
    try {
      const headers = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await axios.get(
        `${process.env.EVENT_SERVICE_URL}/api/schedules/${scheduleId}`,
        { headers }
      );
      return response.data;
    } catch (error) {
      console.error('Event service error:', error.message);
      throw new Error('Failed to fetch event schedule');
    }
  }

  static async validateEventSchedule(scheduleId) {
    try {
      const response = await this.getEventSchedule(scheduleId);
      return response.success;
    } catch (error) {
      return false;
    }
  }
}

module.exports = EventService;
