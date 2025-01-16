export const cities = {
    poznan: { name: "Poznań", feed: "https://local.issa.org.pl/spotkania/category/poznan/feed" },
    szczecin: { name: "Szczecin", feed: "https://local.issa.org.pl/spotkania/category/szczecin/feed" },
    rzeszow: { name: "Rzeszów", feed: "https://local.issa.org.pl/spotkania/category/rzeszow/feed" },
    lublin: { name: "Lublin", feed: "https://local.issa.org.pl/spotkania/category/lublin/feed" },
    krakow: { name: "Kraków", feed: "https://local.issa.org.pl/spotkania/category/krakow/feed" },
    lodz: { name: "Łódź", feed: "https://local.issa.org.pl/spotkania/category/lodz/feed" },
    katowice: { name: "Katowice", feed: "https://local.issa.org.pl/spotkania/category/katowice/feed" },
    trojmiasto: { name: "Trójmiasto", feed: "https://local.issa.org.pl/spotkania/category/trojmiasto/feed" },
    warszawa: { name: "Warszawa", feed: "https://local.issa.org.pl/spotkania/category/warszawa/feed" },
    wroclaw: { name: "Wrocław", feed: "https://local.issa.org.pl/spotkania/category/wroclaw/feed" },
    akademia: { name: "Akademia", feed: "https://local.issa.org.pl/spotkania/category/akademia/feed" },
    "nl-akademia-najlepsze-prelekcje-z-local": { 
      name: "Najlepsze Prelekcje", 
      feed: "https://local.issa.org.pl/spotkania/category/nl-akademia-najlepsze-prelekcje-z-local/feed" 
    }
  };
  
  // Helper function to extract location from HTML
  const extractLocation = (div) => {
    const venueElement = div.querySelector(".tribe-block__venue__name");
    const addressElement = div.querySelector(".tribe-street-address");
    const cityElement = div.querySelector(".tribe-locality");
    
    let location = "Sprawdź w wydarzeniu";
    
    if (venueElement || addressElement || cityElement) {
      const venue = venueElement ? venueElement.textContent.trim() : "";
      const address = addressElement ? addressElement.textContent.trim() : "";
      const city = cityElement ? cityElement.textContent.trim() : "";
      
      location = [venue, address, city].filter(Boolean).join(", ");
    }
    
    return location;
  };
  
  // Helper function to extract agenda from HTML
  const extractAgenda = (div) => {
    const paragraphs = div.querySelectorAll("p");
    let agenda = null;
    
    for (let i = 0; i < paragraphs.length; i++) {
      if (paragraphs[i].textContent.includes("EVENTLINK") && i + 1 < paragraphs.length) {
        agenda = paragraphs[i + 1].textContent.trim();
        break;
      }
    }
    
    return agenda;
  };
  
  // Helper function to calculate time message
  const calculateTimeMessage = (eventDate) => {
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
  };
  
  // Helper function to parse single event data
  const parseEventData = (item) => {
    const title = item.querySelector("title").textContent;
    const date = item.querySelector("pubDate").textContent;
    const description = item.querySelector("description").textContent;
    const link = item.querySelector("link").textContent;
  
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = description;
    
    const location = extractLocation(tempDiv);
    const agenda = extractAgenda(tempDiv);
    const eventDate = new Date(date);
    const timeMessage = calculateTimeMessage(eventDate);
  
    return {
      title,
      date: eventDate.toLocaleDateString("pl-PL"),
      location,
      agenda,
      timeMessage,
      link
    };
  };
  
  // Main function to load events
  export const loadEvents = async (feedUrl) => {
    try {
      const response = await fetch(feedUrl);
      const text = await response.text();
      const parser = new DOMParser();
      const xml = parser.parseFromString(text, "application/xml");
      const items = xml.querySelectorAll("item");
  
      if (items.length === 0) {
        return { currentEvent: null, nextEvent: null };
      }
  
      const currentEvent = parseEventData(items[0]);
      const nextEvent = items.length > 1 ? parseEventData(items[1]) : null;
  
      return { currentEvent, nextEvent };
    } catch (error) {
      console.error("Error fetching RSS feed:", error);
      return { currentEvent: null, nextEvent: null };
    }
  };