import { useState, useEffect } from 'react';

export const useOfflineMode = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [offlineData, setOfflineData] = useState(null);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Load cached data
    const loadCachedData = async () => {
      try {
        const cache = await caches.open('issa-events-v1');
        const cachedData = await cache.match('/api/events');
        if (cachedData) {
          const data = await cachedData.json();
          setOfflineData(data);
        }
      } catch (error) {
        console.error('Error loading cached data:', error);
      }
    };

    loadCachedData();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const saveToCache = async (data) => {
    try {
      const cache = await caches.open('issa-events-v1');
      await cache.put(
        '/api/events',
        new Response(JSON.stringify(data))
      );
      setOfflineData(data);
    } catch (error) {
      console.error('Error saving to cache:', error);
    }
  };

  return { isOffline, offlineData, saveToCache };
};