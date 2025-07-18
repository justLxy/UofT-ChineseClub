const EventService = require('../services/eventService');

class EventController {
  // Get all events
  static async getAllEvents(req, res) {
    try {
      const { status, language = 'en' } = req.query;
      const events = await EventService.getAllEvents(status, language);
      res.json(events);
    } catch (error) {
      console.error('Error fetching events:', error);
      res.status(500).json({ error: 'Failed to fetch events' });
    }
  }

  // Get event by id
  static async getEventById(req, res) {
    try {
      const { id } = req.params;
      const { language = 'en' } = req.query;
      const event = await EventService.getEventById(id, language);
      res.json(event);
    } catch (error) {
      console.error('Error fetching event:', error);
      if (error.message === 'Event not found') {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Failed to fetch event' });
      }
    }
  }

  // Create a new event
  static async createEvent(req, res) {
    try {
      const newEvent = await EventService.createEvent(req.body);
      res.status(201).json(newEvent);
    } catch (error) {
      console.error('Error creating event:', error);
      res.status(500).json({ error: 'Failed to create event' });
    }
  }

  // Update an event
  static async updateEvent(req, res) {
    try {
      const { id } = req.params;
      const updatedEvent = await EventService.updateEvent(id, req.body);
      res.json(updatedEvent);
    } catch (error) {
      console.error('Error updating event:', error);
      if (error.message === 'Event not found') {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Failed to update event' });
      }
    }
  }

  // Delete an event
  static async deleteEvent(req, res) {
    try {
      const { id } = req.params;
      const result = await EventService.deleteEvent(id);
      res.json(result);
    } catch (error) {
      console.error('Error deleting event:', error);
      if (error.message === 'Event not found') {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Failed to delete event' });
      }
    }
  }

  // Upload event image
  static async uploadEventImage(req, res) {
    try {
      const eventId = req.body.eventId;
      const result = await EventService.uploadEventImage(req, eventId);
      res.json(result);
    } catch (error) {
      console.error('Error uploading image:', error);
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = EventController; 