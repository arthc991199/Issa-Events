const NOTIFICATIONS_KEY = 'issa_notifications';
const REGISTRATIONS_KEY = 'issa_registrations';

export const notificationStore = {
  getNotifications() {
    try {
      const stored = localStorage.getItem(NOTIFICATIONS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error getting notifications:', error);
      return [];
    }
  },

  addNotification(notification) {
    try {
      const notifications = this.getNotifications();
      notifications.unshift(notification);
      localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
      this.updateBadgeCount();
      
      // Aktualizuj tytuł strony
      const unreadCount = this.getUnreadCount();
      document.title = unreadCount > 0 ? `(${unreadCount}) ISSA Events` : 'ISSA Events';
    } catch (error) {
      console.error('Error adding notification:', error);
    }
  },

  markAsRead(notificationId) {
    try {
      const notifications = this.getNotifications();
      const updated = notifications.map(notification => 
        notification.id === notificationId 
          ? { ...notification, isRead: true }
          : notification
      );
      localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updated));
      this.updateBadgeCount();
      
      // Aktualizuj tytuł strony
      const unreadCount = this.getUnreadCount();
      document.title = unreadCount > 0 ? `(${unreadCount}) ISSA Events` : 'ISSA Events';
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  },

  getUnreadCount() {
    try {
      const notifications = this.getNotifications();
      return notifications.filter(n => !n.isRead).length;
    } catch (error) {
      console.error('Error getting unread count:', error);
      return 0;
    }
  },

  updateBadgeCount() {
    if ('setAppBadge' in navigator) {
      const count = this.getUnreadCount();
      if (count > 0) {
        navigator.setAppBadge(count).catch(error => {
          console.error('Error setting app badge:', error);
        });
      } else {
        navigator.clearAppBadge().catch(error => {
          console.error('Error clearing app badge:', error);
        });
      }
    }
  },

  isRegistered(eventId) {
    try {
      const registrations = localStorage.getItem(REGISTRATIONS_KEY);
      const registeredEvents = registrations ? JSON.parse(registrations) : [];
      return registeredEvents.includes(eventId);
    } catch (error) {
      console.error('Error checking registration:', error);
      return false;
    }
  },

  addRegistration(eventId, eventTitle) {
    try {
      const registrations = localStorage.getItem(REGISTRATIONS_KEY);
      const registeredEvents = registrations ? JSON.parse(registrations) : [];
      
      if (!registeredEvents.includes(eventId)) {
        registeredEvents.push(eventId);
        localStorage.setItem(REGISTRATIONS_KEY, JSON.stringify(registeredEvents));
        
        const notification = {
          id: crypto.randomUUID(),
          type: 'registration',
          title: 'Potwierdzenie rejestracji',
          message: `Zarejestrowano na wydarzenie: ${eventTitle}`,
          timestamp: Date.now(),
          isRead: false,
          eventId
        };

        this.addNotification(notification);
      }
    } catch (error) {
      console.error('Error adding registration:', error);
    }
  },

  clearAll() {
    try {
      localStorage.removeItem(NOTIFICATIONS_KEY);
      this.updateBadgeCount();
      document.title = 'ISSA Events';
    } catch (error) {
      console.error('Error clearing notifications:', error);
    }
  }
};