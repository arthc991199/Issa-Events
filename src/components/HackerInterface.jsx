import React, { useState, useEffect } from 'react';
import HackerNavbar from '../components/layout/HackerNavbar';
import { 
  Terminal, Clock, MapPin, Calendar, ChevronRight, 
  RefreshCw, Users, ExternalLink, Wifi, WifiOff 
} from 'lucide-react';
import { cities, loadEvents } from '../services/eventService';
import { registerServiceWorker, subscribeToPush, checkAndUpdateBadge } from '../services/notificationService';
import { useOfflineMode } from '../hooks/useOfflineMode';
import { getInstallInstructions } from '../utils/platformUtils';
import MatrixBackground from '../components/MatrixBackground';
import '../styles/terminal.css';
import '../styles/matrix-background.css';

// Komponent Baneru Offline
const OfflineBanner = ({ teamColor }) => (
  <div className={`fixed top-0 left-0 right-0 bg-${teamColor}-900/50 
                   text-${teamColor}-300 py-2 px-4 text-center flex items-center 
                   justify-center font-mono text-sm`}>
    <WifiOff className="w-4 h-4 mr-2" />
    Tryb Offline - Wyświetlanie Zapisanych Danych
  </div>
);

// Komponent Karty Wydarzenia
const EventCard = ({ event, teamColor, isNext = false }) => {
  return (
    <div className="event-card p-4 rounded-lg mt-4">
      <div className="flex justify-between items-start">
        <h3 className="text-lg mb-2">{isNext ? 'PRZYSZŁE WYDARZENIE:' : 'NASTĘPNE WYDARZENIE:'}</h3>
      </div>
      <div className={`space-y-2 text-${teamColor}-400 ${!isNext && 'animate-matrix-text'}`}>
        <p className="flex items-center">
          <Terminal className="w-4 h-4 mr-2" />
          {event.title}
        </p>
        <p className="flex items-center">
          <Calendar className="w-4 h-4 mr-2" />
          {event.date}
        </p>
        <p className="flex items-center">
          <MapPin className="w-4 h-4 mr-2" />
          {event.location}
        </p>
        {!isNext && (
          <p className="flex items-center">
            <Clock className="w-4 h-4 mr-2" />
            {event.timeMessage}
          </p>
        )}
        {event.agenda && !isNext && (
          <p className={`mt-2 text-sm border-t border-${teamColor}-500/30 pt-2`}>
            {event.agenda}
          </p>
        )}
      </div>
      <a
        href={event.link}
        target="_blank"
        rel="noopener noreferrer"
        className={`city-button inline-block mt-4 px-4 py-2 border 
                   border-${teamColor}-500 rounded hover:bg-${teamColor}-500 
                   hover:text-black transition-colors`}
      >
        <ExternalLink className="w-4 h-4 inline-block mr-2" />
        {isNext ? 'SZCZEGÓŁY' : 'REJESTRACJA'}
      </a>
    </div>
  );
};

// Komponent Ładowania
const LoadingMessage = () => {
  const [dots, setDots] = useState('');
  
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return <p className="loading-dots animate-pulse">Inicjalizacja systemu{dots}</p>;
};

// Główny Komponent Interfejsu
const HackerInterface = () => {
  const [selectedCity, setSelectedCity] = useState(localStorage.getItem('selectedCity'));
  const [eventData, setEventData] = useState(null);
  const [nextEventData, setNextEventData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentTeam, setCurrentTeam] = useState(localStorage.getItem('team') || 'blue');
  const [currentMenu, setCurrentMenu] = useState('events');
  const { isOffline, offlineData, saveToCache } = useOfflineMode();

  // Inicjalizacja PWA
  useEffect(() => {
    const initializePWA = async () => {
      try {
        await registerServiceWorker();
        
        if (Notification.permission === 'granted') {
          await subscribeToPush();
        }
      } catch (error) {
        console.error('Błąd inicjalizacji PWA:', error);
      }
    };

    initializePWA();
  }, []);

  // Ładowanie wydarzeń
  useEffect(() => {
    const fetchEvents = async () => {
      if (selectedCity && cities[selectedCity]) {
        setLoading(true);
        try {
          const data = await loadEvents(cities[selectedCity].feed);
          setEventData(data.currentEvent);
          setNextEventData(data.nextEvent);
          
          if (data.currentEvent) {
            await saveToCache(data);
          }

          if (data.currentEvent?.timeMessage) {
            const daysMatch = data.currentEvent.timeMessage.match(/\d+/);
            if (daysMatch) {
              await checkAndUpdateBadge(parseInt(daysMatch[0]));
            }
          }
        } catch (error) {
          console.error('Błąd ładowania wydarzeń:', error);
          if (isOffline && offlineData) {
            setEventData(offlineData.currentEvent);
            setNextEventData(offlineData.nextEvent);
          }
        } finally {
          setLoading(false);
        }
      }
    };

    fetchEvents();
  }, [selectedCity, isOffline, offlineData]);

  // Obsługa zmiany menu
  const handleMenuSelect = (menuKey) => {
    setCurrentMenu(menuKey);
    switch(menuKey) {
      case 'events':
        break;
      case 'community':
        break;
      case 'schedule':
        break;
      case 'settings':
        break;
      case 'notifications':
        break;
    }
  };

  const teamColor = currentTeam === 'red' ? 'red' : 'blue';
  const installInstructions = getInstallInstructions();

  return (
    <div className={`min-h-screen matrix-bg text-${teamColor}-500 p-4 ${currentTeam}-team relative`}>
      {/* Nowe tło Matrix */}
      <MatrixBackground teamColor={teamColor} />

      {/* Navbar */}
      <HackerNavbar 
        currentTeam={currentTeam} 
        onTeamChange={setCurrentTeam}
        onMenuSelect={handleMenuSelect}
      />

      {/* Główna treść z marginesem górnym */}
      <div className="pt-16 relative z-10">
        {isOffline && <OfflineBanner teamColor={teamColor} />}
        
        {/* Główna treść */}
        <div className="max-w-4xl mx-auto">
          {!selectedCity ? (
            <div className="space-y-6">
              {/* Wybór miasta */}
              <div className="terminal-container">
                <h2 className="font-mono text-xl mb-4 flex items-center">
                  <ChevronRight className="mr-2" />
                  WYBIERZ LOKALIZACJĘ
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {Object.entries(cities).map(([key, data]) => (
                    <button
                      key={key}
                      onClick={() => {
                        setSelectedCity(key);
                        localStorage.setItem('selectedCity', key);
                      }}
                      className={`city-button p-3 border border-${teamColor}-500 rounded 
                               hover:bg-${teamColor}-500 hover:text-black transition-colors 
                               font-mono text-sm flex items-center justify-center
                               ${isOffline ? 'opacity-75' : ''}`}
                      disabled={isOffline}
                    >
                      <MapPin className="w-4 h-4 mr-2" />
                      {data.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="terminal-container">
              {/* Nagłówek miasta */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-mono text-xl flex items-center">
                  <Calendar className="mr-2" />
                  {cities[selectedCity].name}_WYDARZENIA
                </h2>
                <div className="flex items-center space-x-4">
                  {isOffline ? (
                    <WifiOff className={`w-5 h-5 text-${teamColor}-500`} />
                  ) : (
                    <Wifi className={`w-5 h-5 text-${teamColor}-500`} />
                  )}
                  <button
                    onClick={() => {
                      setSelectedCity(null);
                      localStorage.removeItem('selectedCity');
                    }}
                    className={`city-button flex items-center px-3 py-2 border 
                              border-${teamColor}-500 rounded hover:bg-${teamColor}-500 
                              hover:text-black transition-colors font-mono text-sm`}
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    ZMIEŃ LOKALIZACJĘ
                  </button>
                </div>
              </div>
              
              {/* Wyświetlanie wydarzeń */}
              <div className="space-y-4 font-mono">
                {loading ? (
                  <LoadingMessage />
                ) : eventData ? (
                  <>
                    <EventCard event={eventData} teamColor={teamColor} />
                    {nextEventData && (
                      <EventCard 
                        event={nextEventData} 
                        teamColor={teamColor} 
                        isNext={true} 
                      />
                    )}
                  </>
                ) : (
                  <p className="text-center py-8">Nie znaleziono nadchodzących wydarzeń.</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Stopka */}
        <footer className="mt-8 text-center font-mono text-sm">
          <p className="mb-2">LINKI SYSTEMOWE:</p>
          <div className="flex justify-center space-x-4">
            <a
              href="https://issa.org.pl/"
              target="_blank"
              rel="noopener noreferrer"
              className={`hover:text-${teamColor}-400 transition-colors flex items-center`}
            >
              <Terminal className="w-4 h-4 mr-1" />
              STRONA GŁÓWNA
            </a>
            <a
              href="https://issa.org.pl/czlonkostwo/jak-zostac-czlonkiem-stowarzyszenia"
              target="_blank"
              rel="noopener noreferrer"
              className={`hover:text-${teamColor}-400 transition-colors flex items-center`}
            >
              <Users className="w-4 h-4 mr-1" />
              DOŁĄCZ DO SIECI
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default HackerInterface;