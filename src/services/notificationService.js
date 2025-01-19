import { isIOS } from '../utils/platformUtils';

export const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/dev/sw.js', {
        scope: '/dev/'
      });
      console.log('Service Worker registered with scope:', registration.scope);
      return registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      throw error;
    }
  }
  return null;
};

export const updateNotificationCount = (count) => {
  // Aktualizacja tytułu strony
  document.title = count > 0 ? `(${count}) ISSA Events` : 'ISSA Events';


  if ('setAppBadge' in navigator) {
    if (count > 0) {
      navigator.setAppBadge(count).catch((error) => {
        console.error('Error setting app badge:', error);
      });
    } else {
      navigator.clearAppBadge().catch((error) => {
        console.error('Error clearing app badge:', error);
      });
    }
  }
};

export const scheduleEventReminder = async (event) => {
  if (Notification.permission === 'granted') {
    const eventDate = new Date(event.date);
    const now = new Date();
    const timeToEvent = eventDate.getTime() - now.getTime();

    if (timeToEvent > 24 * 60 * 60 * 1000) {
      setTimeout(() => {
        new Notification('Przypomnienie o wydarzeniu', {
          body: `Jutro odbędzie się: ${event.title}`,
          icon: '/dev/icons/icon-192x192.png'
        });
      }, timeToEvent - 24 * 60 * 60 * 1000);
    }

    if (timeToEvent > 60 * 60 * 1000) {
      setTimeout(() => {
        new Notification('Wydarzenie za godzinę', {
          body: event.title,
          icon: '/dev/icons/icon-192x192.png'
        });
      }, timeToEvent - 60 * 60 * 1000);
    }
  }
};

export const subscribeToPush = async () => {
  try {
    // Sprawdzenie wsparcia dla powiadomień
    if (!('Notification' in window)) {
      throw new Error('Ten przeglądarka nie obsługuje powiadomień');
    }

    // Prośba o pozwolenie
    const permission = await Notification.requestPermission();
    
    if (permission !== 'granted') {
      throw new Error('Pozwolenie na powiadomienia nie zostało udzielone');
    }

    // Rejestracja Service Worker
    const registration = await registerServiceWorker();
    
    if (!registration) {
      throw new Error('Nie udało się zarejestrować Service Worker');
    }

    return true;
  } catch (error) {
    console.error('Błąd podczas subskrypcji powiadomień:', error);
    throw error;
  }
};

export const checkAndUpdateBadge = async () => {
  try {
    const permission = await Notification.permission;
    if (permission === 'granted') {
      const count = notificationStore.getUnreadCount();
      updateNotificationCount(count);
    }
  } catch (error) {
    console.error('Błąd podczas aktualizacji badge:', error);
  }
};