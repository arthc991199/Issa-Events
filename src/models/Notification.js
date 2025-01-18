export class Notification {
    constructor(id, type, title, message, timestamp, isRead = false, eventId = null) {
      this.id = id;
      this.type = type; 
      this.title = title;
      this.message = message;
      this.timestamp = timestamp;
      this.isRead = isRead;
      this.eventId = eventId;
    }
  
    static createRegistrationNotification(eventTitle, eventId) {
      return new Notification(
        crypto.randomUUID(),
        'registration',
        'Zarejestrowano na wydarzenie',
        `Potwierdzamy rejestrację na: ${eventTitle}`,
        Date.now(),
        false,
        eventId
      );
    }
  }