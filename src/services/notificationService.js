import { isIOS, isAndroid, supportsPush } from '../utils/platformUtils';

export const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/app2/sw.js');
      console.log('Service Worker registered with scope:', registration.scope);
      return registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      throw error;
    }
  }
  return null;
};

export const subscribeToPush = async () => {
  if (!supportsPush()) {
    console.log('Push notifications not supported on this platform');
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    let permission = await Notification.requestPermission();
    
    if (permission !== 'granted') {
      throw new Error('Notification permission denied');
    }

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(process.env.VITE_PUBLIC_VAPID_KEY)
    });

    await sendSubscriptionToServer(subscription);
    return subscription;
  } catch (error) {
    console.error('Error subscribing to push:', error);
    return null;
  }
};

export const checkAndUpdateBadge = async (daysToEvent) => {
  if (isIOS()) {
    return;
  }

  if ('setAppBadge' in navigator) {
    try {
      if (daysToEvent > 0) {
        await navigator.setAppBadge(daysToEvent);
      } else {
        await navigator.clearAppBadge();
      }
    } catch (error) {
      console.error('Error updating badge:', error);
    }
  }
};

export const scheduleEventReminder = async (event) => {
  if (isIOS()) {
    return addToCalendar(event);
  }

  if (Notification.permission === 'granted') {
    const eventDate = new Date(event.date);
    const now = new Date();
    const timeToEvent = eventDate.getTime() - now.getTime();

    setTimeout(() => {
      new Notification('Przypomnienie o wydarzeniu', {
        body: `Jutro odbędzie się: ${event.title}`,
        icon: '/app2/icons/icon-192x192.png'
      });
    }, timeToEvent - 24 * 60 * 60 * 1000);

    setTimeout(() => {
      new Notification('Wydarzenie za godzinę', {
        body: event.title,
        icon: '/app2/icons/icon-192x192.png'
      });
    }, timeToEvent - 60 * 60 * 1000);
  }
};

const addToCalendar = (event) => {
  const startDate = new Date(event.date);
  const endDate = new Date(startDate);
  endDate.setHours(startDate.getHours() + 2);

  if (isIOS()) {
    const calendarUrl = `webcal://calendar.google.com/calendar/ical/${encodeURIComponent(event.title)}/${startDate.toISOString()}/${endDate.toISOString()}`;
    window.location.href = calendarUrl;
  } else if (isAndroid()) {
    const calendarUrl = `content://com.android.calendar/time/${startDate.getTime()}`;
    window.location.href = calendarUrl;
  }
};

const urlBase64ToUint8Array = (base64String) => {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

const sendSubscriptionToServer = async (subscription) => {
  console.log('Subscription to be sent to server:', subscription);
};