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

  static async getEventDetails(eventId) {
    try {
      const response = await axios.get(`${process.env.EVENT_SERVICE_URL}/api/events/${eventId}`);
      return response.data.data;
    } catch (error) {
      console.error('Event service error:', error.message);
      throw new Error('Failed to fetch event details');
    }
  }

  static async getZone(zoneId, token = null) {
    try {
      const headers = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await axios.get(
        `${process.env.EVENT_SERVICE_URL}/api/zones/${zoneId}`,
        { headers }
      );
      return response.data;
    } catch (error) {
      console.error('Event service error:', error.message);
      throw new Error('Failed to fetch event zone');
    }
  }
  static async validateEventSchedule(scheduleId) {
    try {
      const response = await this.getEventSchedule(scheduleId);
      return response.success && response.data;
    } catch (error) {
      return false;
    }
  }

  static async validateZone(zoneId) {
    try {
      const response = await this.getZone(zoneId);
      return response.success && response.data;
    } catch (error) {
      return false;
    }
  }
}

module.exports = EventService;
