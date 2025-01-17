// Security utilities
const sanitizeInput = (text) => {
    if (!text) return '';
    const temp = document.createElement('div');
    temp.textContent = text;
    return temp.innerHTML;
  };
  
  const isValidUrl = (url) => {
    try {
      const parsedUrl = new URL(url);
      return parsedUrl.hostname === 'local.issa.org.pl';
    } catch {
      return false;
    }
  };
  
  // Cities configuration
  export const cities = {
    poznan: { 
      name: "Poznań", 
      feed: "https://local.issa.org.pl/spotkania/category/poznan/feed" 
    },
    szczecin: { 
      name: "Szczecin", 
      feed: "https://local.issa.org.pl/spotkania/category/szczecin/feed" 
    },
    rzeszow: { 
      name: "Rzeszów", 
      feed: "https://local.issa.org.pl/spotkania/category/rzeszow/feed" 
    },
    lublin: { 
      name: "Lublin", 
      feed: "https://local.issa.org.pl/spotkania/category/lublin/feed" 
    },
    krakow: { 
      name: "Kraków", 
      feed: "https://local.issa.org.pl/spotkania/category/krakow/feed" 
    },
    lodz: { 
      name: "Łódź", 
      feed: "https://local.issa.org.pl/spotkania/category/lodz/feed" 
    },
    katowice: { 
      name: "Katowice", 
      feed: "https://local.issa.org.pl/spotkania/category/katowice/feed" 
    },
    trojmiasto: { 
      name: "Trójmiasto", 
      feed: "https://local.issa.org.pl/spotkania/category/trojmiasto/feed" 
    },
    warszawa: { 
      name: "Warszawa", 
      feed: "https://local.issa.org.pl/spotkania/category/warszawa/feed" 
    },
    wroclaw: { 
      name: "Wrocław", 
      feed: "https://local.issa.org.pl/spotkania/category/wroclaw/feed" 
    },
    akademia: { 
      name: "Akademia", 
      feed: "https://local.issa.org.pl/spotkania/category/akademia/feed" 
    },
    "nl-akademia-najlepsze-prelekcje-z-local": { 
      name: "Najlepsze Prelekcje", 
      feed: "https://local.issa.org.pl/spotkania/category/nl-akademia-najlepsze-prelekcje-z-local/feed" 
    }
  };
  
  // Helper functions
  const extractLocation = (div) => {
    try {
      const venueElement = div.querySelector(".tribe-block__venue__name");
      const addressElement = div.querySelector(".tribe-street-address");
      const cityElement = div.querySelector(".tribe-locality");
      
      let location = "Sprawdź w wydarzeniu";
      
      if (venueElement || addressElement || cityElement) {
        const venue = venueElement ? sanitizeInput(venueElement.textContent.trim()) : "";
        const address = addressElement ? sanitizeInput(addressElement.textContent.trim()) : "";
        const city = cityElement ? sanitizeInput(cityElement.textContent.trim()) : "";
        
        location = [venue, address, city].filter(Boolean).join(", ");
      }
      
      return location;
    } catch (error) {
      console.error('Error extracting location:', error);
      return "Lokalizacja niedostępna";
    }
  };
  
  const extractAgenda = (div) => {
    try {
      const paragraphs = div.querySelectorAll("p");
      let agenda = null;
      
      for (let i = 0; i < paragraphs.length; i++) {
        if (paragraphs[i].textContent.includes("EVENTLINK") && i + 1 < paragraphs.length) {
          agenda = sanitizeInput(paragraphs[i + 1].textContent.trim());
          break;
        }
      }
      
      return agenda;
    } catch (error) {
      console.error('Error extracting agenda:', error);
      return null;
    }
  };
  
  const calculateTimeMessage = (eventDate) => {
    try {
      const today = new Date();
      eventDate.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);
      
      const diffDays = Math.ceil((eventDate - today) / (1000 * 60 * 60 * 24));
      
      if (diffDays > 0) {
        return `Pozostało: ${diffDays} dni`;
      } else if (diffDays === 0) {
        return "Wydarzenie jest dzisiaj!";
      } else {
        return "Wydarzenie już się odbyło.";
      }
    } catch (error) {
      console.error('Error calculating time message:', error);
      return "Data niedostępna";
    }
  };
  
  const parseEventData = (item) => {
    try {
      if (!item) throw new Error('Invalid item data');
  
      const title = sanitizeInput(item.querySelector("title")?.textContent);
      const date = item.querySelector("pubDate")?.textContent;
      const description = item.querySelector("description")?.textContent;
      const link = item.querySelector("link")?.textContent;
  
      if (!title || !date || !link) {
        throw new Error('Missing required event data');
      }
  
      if (!isValidUrl(link)) {
        throw new Error('Invalid event URL');
      }
  
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = description || '';
      
      const eventDate = new Date(date);
      if (isNaN(eventDate.getTime())) {
        throw new Error('Invalid date format');
      }
  
      return {
        title,
        date: eventDate.toLocaleDateString("pl-PL"),
        location: extractLocation(tempDiv),
        agenda: extractAgenda(tempDiv),
        timeMessage: calculateTimeMessage(eventDate),
        link
      };
    } catch (error) {
      console.error('Error parsing event data:', error);
      return null;
    }
  };
  
  // Storage utilities
  export const storage = {
    get: (key, defaultValue = null) => {
      try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
      } catch (error) {
        console.error('Error reading from localStorage:', error);
        return defaultValue;
      }
    },
  
    set: (key, value) => {
      try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
      } catch (error) {
        console.error('Error writing to localStorage:', error);
        return false;
      }
    },
  
    remove: (key) => {
      try {
        localStorage.removeItem(key);
        return true;
      } catch (error) {
        console.error('Error removing from localStorage:', error);
        return false;
      }
    }
  };
  
  // Cache dla zapobiegania częstym wywołaniom API
  const feedCache = new Map();
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minut
  
  // Main function to load events
  export const loadEvents = async (feedUrl) => {
    try {
      // Sprawdź cache
      const cachedData = feedCache.get(feedUrl);
      if (cachedData && (Date.now() - cachedData.timestamp < CACHE_DURATION)) {
        return cachedData.data;
      }
  
      console.log('Attempting to fetch URL:', feedUrl);
  
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 sekund timeout
  
      const response = await fetch(feedUrl, {
        headers: {
          'Accept': 'application/xml',
          'Content-Type': 'application/xml',
        },
        mode: 'cors',
        signal: controller.signal,
        referrerPolicy: 'no-referrer',
        cache: 'no-store' // Wyłączamy cache przeglądarki
      });
  
      clearTimeout(timeoutId);
  
      console.log('Fetch response status:', response.status);
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response text:', errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const text = await response.text();
      console.log('Received XML text (first 500 chars):', text.slice(0, 500));
  
      if (!text || !text.includes('<?xml')) {
        throw new Error('Invalid XML format');
      }
  
      const parser = new DOMParser();
      const xml = parser.parseFromString(text, "application/xml");
      
      const parserError = xml.querySelector('parsererror');
      if (parserError) {
        console.error('XML parsing error:', parserError.textContent);
        throw new Error('XML parsing error');
      }
  
      const items = xml.querySelectorAll("item");
  
      if (items.length === 0) {
        console.warn('No items found in the feed');
        return { currentEvent: null, nextEvent: null };
      }
  
      const currentEvent = parseEventData(items[0]);
      const nextEvent = items.length > 1 ? parseEventData(items[1]) : null;
  
      if (!currentEvent && !nextEvent) {
        console.warn('No valid events found after parsing');
        return { currentEvent: null, nextEvent: null };
      }
  
      const result = { currentEvent, nextEvent };
  
      // Zapisz do cache
      feedCache.set(feedUrl, {
        data: result,
        timestamp: Date.now()
      });
  
      return result;
    } catch (error) {
      if (error.name === 'AbortError') {
        console.error("Request timeout");
        throw new Error('Przekroczono czas oczekiwania na odpowiedź');
      }
      
      console.error("Detailed error fetching RSS feed:", error);
      throw new Error(`Failed to load events: ${error.message}`);
    }
  };