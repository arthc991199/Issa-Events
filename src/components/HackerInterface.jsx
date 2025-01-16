import React, { useState, useEffect } from 'react';
import { Terminal, Clock, MapPin, Calendar, ChevronRight, RefreshCw, Users, ExternalLink } from 'lucide-react';

const HackerInterface = () => {
  const [selectedCity, setSelectedCity] = useState(localStorage.getItem('selectedCity'));
  const [eventData, setEventData] = useState(null);
  const [nextEventData, setNextEventData] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const cities = {
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
    "nl-akademia-najlepsze-prelekcje-z-local": { name: "Najlepsze Prelekcje", feed: "https://local.issa.org.pl/spotkania/category/nl-akademia-najlepsze-prelekcje-z-local/feed" }
  };

  useEffect(() => {
    if (selectedCity && cities[selectedCity]) {
      loadEvents(cities[selectedCity].feed);
    }
  }, [selectedCity]);

  const loadEvents = async (feedUrl) => {
    setLoading(true);
    try {
      const response = await fetch(feedUrl);
      const text = await response.text();
      const parser = new DOMParser();
      const xml = parser.parseFromString(text, "application/xml");
      const items = xml.querySelectorAll("item");

      if (items.length > 0) {
        // Parse first event
        const firstEvent = items[0];
        const title = firstEvent.querySelector("title").textContent;
        const date = firstEvent.querySelector("pubDate").textContent;
        const description = firstEvent.querySelector("description").textContent;
        const link = firstEvent.querySelector("link").textContent;

        // Parse location and agenda from description
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = description;
        
        const location = extractLocation(tempDiv);
        const agenda = extractAgenda(tempDiv);
        
        const eventDate = new Date(date);
        const today = new Date();
        eventDate.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);
        
        const diffDays = Math.ceil((eventDate - today) / (1000 * 60 * 60 * 24));
        
        let timeMessage = "";
        if (diffDays > 0) {
          timeMessage = `Pozostało: ${diffDays} dni`;
        } else if (diffDays === 0) {
          timeMessage = "Wydarzenie jest dzisiaj!";
        } else {
          timeMessage = "Wydarzenie już się odbyło.";
        }

        setEventData({
          title,
          date: eventDate.toLocaleDateString("pl-PL"),
          location,
          agenda,
          timeMessage,
          link
        });

        // Parse second event if exists
        if (items.length > 1) {
          const secondEvent = items[1];
          const title2 = secondEvent.querySelector("title").textContent;
          const date2 = secondEvent.querySelector("pubDate").textContent;
          const description2 = secondEvent.querySelector("description").textContent;
          const link2 = secondEvent.querySelector("link").textContent;
          
          const tempDiv2 = document.createElement("div");
          tempDiv2.innerHTML = description2;

          setNextEventData({
            title: title2,
            date: new Date(date2).toLocaleDateString("pl-PL"),
            location: extractLocation(tempDiv2),
            link: link2
          });
        } else {
          setNextEventData(null);
        }
      } else {
        setEventData(null);
        setNextEventData(null);
      }
    } catch (error) {
      console.error("Error fetching RSS feed:", error);
      setEventData(null);
      setNextEventData(null);
    }
    setLoading(false);
  };

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

  const extractAgenda = (div) => {
    // Szukamy agendy w paragrafie po "EVENTLINK"
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

  const handleCitySelect = (city) => {
    setSelectedCity(city);
    localStorage.setItem('selectedCity', city);
  };

  const resetCity = () => {
    setSelectedCity(null);
    localStorage.removeItem('selectedCity');
  };

  return (
    <div className="min-h-screen bg-black text-green-500 p-4">
      {/* Header */}
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-mono mb-2 animate-pulse">
          <Terminal className="inline-block mr-2 mb-1" />
          ISSA Events Terminal
        </h1>
        <p className="text-sm text-green-400 font-mono">v0.8_beta</p>
      </header>

      {/* Main content */}
      <div className="max-w-4xl mx-auto">
        {!selectedCity ? (
          <div className="space-y-6">
            <div className="border border-green-500 p-4 rounded-lg bg-black/50">
              <h2 className="font-mono text-xl mb-4 flex items-center">
                <ChevronRight className="mr-2" />
                SELECT_LOCATION
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {Object.entries(cities).map(([key, data]) => (
                  <button
                    key={key}
                    onClick={() => handleCitySelect(key)}
                    className="p-3 border border-green-500 rounded hover:bg-green-500 hover:text-black transition-colors font-mono text-sm flex items-center justify-center"
                  >
                    <MapPin className="w-4 h-4 mr-2" />
                    {data.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Installation Instructions */}
            <div className="border border-green-500 p-4 rounded-lg mt-8 bg-black/50">
              <h2 className="font-mono text-xl mb-4 flex items-center">
                <Terminal className="mr-2" />
                INSTALLATION_GUIDE
              </h2>
              <div className="font-mono text-sm space-y-4">
                <div className="space-y-2">
                  <p className="text-green-400">{'>'} Android_Chrome:</p>
                  <ol className="list-decimal list-inside pl-4 text-green-300">
                    <li>Open in Chrome</li>
                    <li>Tap menu (⋮)</li>
                    <li>Select "Add to Home screen"</li>
                    <li>Confirm installation</li>
                  </ol>
                </div>
                <div className="space-y-2">
                  <p className="text-green-400">{'>'} iOS_Safari:</p>
                  <ol className="list-decimal list-inside pl-4 text-green-300">
                    <li>Open in Safari</li>
                    <li>Tap share icon</li>
                    <li>Select "Add to Home Screen"</li>
                    <li>Confirm installation</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="border border-green-500 p-4 rounded-lg bg-black/50">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-mono text-xl flex items-center">
                <Calendar className="mr-2" />
                {cities[selectedCity].name}_EVENTS
              </h2>
              <button
                onClick={resetCity}
                className="flex items-center px-3 py-2 border border-green-500 rounded hover:bg-green-500 hover:text-black transition-colors font-mono text-sm"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                CHANGE_LOCATION
              </button>
            </div>
            
            <div className="space-y-4 font-mono">
              {loading ? (
                <p className="animate-pulse">Loading event data...</p>
              ) : eventData ? (
                <>
                  <div className="border border-green-500 p-4 rounded-lg">
                    <h3 className="text-lg mb-2">NEXT_EVENT:</h3>
                    <div className="space-y-2 text-green-400">
                      <p className="flex items-center">
                        <Terminal className="w-4 h-4 mr-2" />
                        {eventData.title}
                      </p>
                      <p className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        {eventData.date}
                      </p>
                      <p className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2" />
                        {eventData.location}
                      </p>
                      <p className="flex items-center">
                        <Clock className="w-4 h-4 mr-2" />
                        {eventData.timeMessage}
                      </p>
                      {eventData.agenda && (
                        <p className="mt-2 text-sm border-t border-green-500/30 pt-2">
                          {eventData.agenda}
                        </p>
                      )}
                    </div>
                    <a
                      href={eventData.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-4 px-4 py-2 border border-green-500 rounded hover:bg-green-500 hover:text-black transition-colors"
                    >
                      <ExternalLink className="w-4 h-4 inline-block mr-2" />
                      REGISTER
                    </a>
                  </div>

                  {nextEventData && (
                    <div className="border border-green-500 p-4 rounded-lg mt-4">
                      <h3 className="text-lg mb-2">FUTURE_EVENT:</h3>
                      <div className="space-y-2 text-green-400">
                        <p className="flex items-center">
                          <Terminal className="w-4 h-4 mr-2" />
                          {nextEventData.title}
                        </p>
                        <p className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2" />
                          {nextEventData.date}
                        </p>
                        {nextEventData.location && (
                          <p className="flex items-center">
                            <MapPin className="w-4 h-4 mr-2" />
                            {nextEventData.location}
                          </p>
                        )}
                      </div>
                      <a
                        href={nextEventData.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-4 px-4 py-2 border border-green-500 rounded hover:bg-green-500 hover:text-black transition-colors"
                      >
                        <ExternalLink className="w-4 h-4 inline-block mr-2" />
                        DETAILS
                      </a>
                    </div>
                  )}
                </>
              ) : (
                <p>No upcoming events found in database.</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-8 text-center font-mono text-sm">
        <p className="mb-2">SYSTEM_LINKS:</p>
        <div className="flex justify-center space-x-4">
          <a href="https://issa.org.pl/" 
             target="_blank" 
             rel="noopener noreferrer" 
             className="hover:text-green-400 transition-colors flex items-center">
            <Terminal className="w-4 h-4 mr-1" />
            MAIN_PAGE
          </a>
          <a href="https://issa.org.pl/czlonkostwo/jak-zostac-czlonkiem-stowarzyszenia" 
             target="_blank" 
             rel="noopener noreferrer"
             className="hover:text-green-400 transition-colors flex items-center">
            <Users className="w-4 h-4 mr-1" />
            JOIN_NETWORK
          </a>
        </div>
      </footer>
    </div>
  );
};

export default HackerInterface;