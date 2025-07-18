const prisma = require('../config/database');
const { calculateEventStatus, transformEventByLanguage, getImageFilenameFromUrl, deleteImageFile } = require('../utils/fileUtils');

class EventService {
  // Get all events
  static async getAllEvents(status, language = 'en') {
    let whereClause = {};
    
    if (status) {
      whereClause.status = status;
    }
    
    const events = await prisma.event.findMany({
      where: whereClause,
      orderBy: [
        { featured: 'desc' },
        { startDate: 'desc' }
      ]
    });
    
    return events.map(event => transformEventByLanguage(event, language));
  }

  // Get event by id
  static async getEventById(id, language = 'en') {
    const event = await prisma.event.findUnique({
      where: { id: parseInt(id) }
    });
    
    if (!event) {
      throw new Error('Event not found');
    }
    
    return transformEventByLanguage(event, language);
  }

  // Create a new event
  static async createEvent(eventData) {
    const { 
      title_en, 
      title_zh,
      description_en, 
      description_zh,
      imageUrl, 
      startDate, 
      endDate, 
      location_en,
      location_zh,
      link, 
      featured 
    } = eventData;
    
    // Calculate event status
    const status = calculateEventStatus(startDate, endDate);
    
    const newEvent = await prisma.event.create({
      data: {
        title_en,
        title_zh,
        description_en,
        description_zh,
        imageUrl,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        location_en,
        location_zh,
        status,
        link,
        featured: featured || false
      }
    });
    
    return newEvent;
  }

  // Update an event
  static async updateEvent(id, eventData) {
    const { 
      title_en, 
      title_zh,
      description_en, 
      description_zh,
      imageUrl, 
      startDate, 
      endDate, 
      location_en,
      location_zh,
      status: providedStatus, 
      link, 
      featured 
    } = eventData;
    
    // Get existing event to retrieve old image
    const existingEvent = await prisma.event.findUnique({
      where: { id: parseInt(id) }
    });
    
    if (!existingEvent) {
      throw new Error('Event not found');
    }
    
    // If imageUrl is different, delete old image
    if (existingEvent.imageUrl && imageUrl && existingEvent.imageUrl !== imageUrl) {
      const oldImageFilename = getImageFilenameFromUrl(existingEvent.imageUrl);
      deleteImageFile(oldImageFilename);
    }
    
    // Calculate status if not provided
    let status = providedStatus;
    if (!status) {
      status = calculateEventStatus(startDate, endDate);
    }
    
    const updatedEvent = await prisma.event.update({
      where: { id: parseInt(id) },
      data: {
        title_en,
        title_zh,
        description_en,
        description_zh,
        imageUrl,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        location_en,
        location_zh,
        status,
        link,
        featured
      }
    });
    
    return updatedEvent;
  }

  // Delete an event
  static async deleteEvent(id) {
    // Get event details to retrieve image filename
    const event = await prisma.event.findUnique({
      where: { id: parseInt(id) }
    });
    
    if (!event) {
      throw new Error('Event not found');
    }
    
    // Delete associated image file if exists
    if (event.imageUrl) {
      const imageFilename = getImageFilenameFromUrl(event.imageUrl);
      deleteImageFile(imageFilename);
    }
    
    await prisma.event.delete({
      where: { id: parseInt(id) }
    });
    
    return { message: 'Event deleted successfully' };
  }

  // Upload event image
  static async uploadEventImage(req, eventId) {
    if (!req.file) {
      throw new Error('No image file provided');
    }
    
    // Check if this is for an existing event
    if (eventId) {
      const existingEvent = await prisma.event.findUnique({
        where: { id: parseInt(eventId) }
      });
      
      if (existingEvent && existingEvent.imageUrl) {
        const oldImageFilename = getImageFilenameFromUrl(existingEvent.imageUrl);
        deleteImageFile(oldImageFilename);
      }
    }
    
    // Get the server URL
    const protocol = req.protocol;
    const host = req.get('host');
    
    // Generate the image URL
    const imageUrl = `${protocol}://${host}/uploads/events/${req.file.filename}`;
    
    return { 
      imageUrl, 
      message: 'Image uploaded successfully' 
    };
  }
}

module.exports = EventService; 