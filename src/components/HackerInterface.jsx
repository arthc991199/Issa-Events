import React, { useState, useEffect } from 'react';
import HackerNavbar from '../components/layout/HackerNavbar';
import { 
  Terminal, 
  Clock, 
  MapPin, 
  Calendar, 
  ChevronRight, 
  RefreshCw, 
  Users, 
  ExternalLink, 
  Wifi, 
  WifiOff,
  AlertTriangle
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
                   justify-center font-mono text-sm z-50`}>
    <WifiOff className="w-4 h-4 mr-2" />
    Tryb Offline - Wyświetlanie Zapisanych Danych
  </div>
);

// Komponent Błędu
const ErrorMessage = ({ message, teamColor }) => (
  <div className={`flex items-center justify-center p-4 border border-${teamColor}-500 
                   rounded-lg text-${teamColor}-400 space-x-2`}>
    <AlertTriangle className="w-5 h-5" />
    <span className="font-mono">{message}</span>
  </div>
);

// Komponent Karty Wydarzenia
const EventCard = ({ event, teamColor, isNext = false }) => {
  if (!event) return null;

  return (
    <div className="event-card p-4 rounded-lg mt-4">
      <div className="flex justify-between items-start">
        <h3 className="text-lg mb-2">{isNext ? 'PRZYSZŁE WYDARZENIE:' : 'NASTĘPNE WYDARZENIE:'}</h3>
      </div>
      <div className={`space-y-2 text-${teamColor}-400 ${!isNext && 'animate-matrix-text'}`}>
        <p className="flex items-center">
          <Terminal className="w-4 h-4 mr-2 flex-shrink-0" />
          <span className="break-words">{event.title}</span>
        </p>
        <p className="flex items-center">
          <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
          {event.date}
        </p>
        <p className="flex items-center">
          <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
          <span className="break-words">{event.location}</span>
        </p>
        {!isNext && (
          <p className="flex items-center">
            <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
            {event.timeMessage}
          </p>
        )}
        {event.agenda && !isNext && (
          <p className={`mt-2 text-sm border-t border-${teamColor}-500/30 pt-2 break-words`}>
            {event.agenda}
          </p>
        )}
      </div>
      {event.link && (
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
      )}
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
  const [error, setError] = useState(null);
  const [currentTeam, setCurrentTeam] = useState(localStorage.getItem('team') || 'blue');
  const [currentMenu, setCurrentMenu] = useState('events');
  const [fetchTrigger, setFetchTrigger] = useState(0);
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
    let isMounted = true;
    const fetchEvents = async () => {
      if (selectedCity && cities[selectedCity]) {
        setLoading(true);
        setError(null);
        try {
          const data = await loadEvents(cities[selectedCity].feed);
          
          if (!isMounted) return;

          if (data && (data.currentEvent || data.nextEvent)) {
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
          } else {
            setEventData(null);
            setNextEventData(null);
            setError('Brak dostępnych wydarzeń');
          }
        } catch (error) {
          console.error('Błąd ładowania wydarzeń:', error);
          setError(error.message || 'Wystąpił błąd podczas ładowania wydarzeń');
          
          if (isOffline && offlineData) {
            setEventData(offlineData.currentEvent);
            setNextEventData(offlineData.nextEvent);
          }
        } finally {
          if (isMounted) {
            setLoading(false);
          }
        }
      }
    };

    fetchEvents();

    return () => {
      isMounted = false;
    };
  }, [selectedCity, isOffline, offlineData, fetchTrigger]);

  const handleMenuSelect = (menuKey) => {
    setCurrentMenu(menuKey);
  };

  const refreshEvents = () => {
    setFetchTrigger(prev => prev + 1);
  };

  const teamColor = currentTeam === 'red' ? 'red' : 'blue';
  const installInstructions = getInstallInstructions();

  return (
    <div className={`min-h-screen matrix-bg text-${teamColor}-500 p-4 ${currentTeam}-team relative`}>
      {/* Matrix Background */}
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
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h2 className="font-mono text-xl flex items-center">
                  <Calendar className="mr-2" />
                  {cities[selectedCity].name}_WYDARZENIA
                </h2>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
                  {isOffline ? (
                    <WifiOff className={`w-5 h-5 text-${teamColor}-500`} />
                  ) : (
                    <Wifi className={`w-5 h-5 text-${teamColor}-500`} />
                  )}
                  <button
                    onClick={() => {
                      setSelectedCity(null);
                      localStorage.removeItem('selectedCity');
                      setError(null);
                    }}
                    className={`city-button flex items-center px-3 py-2 border 
                             border-${teamColor}-500 rounded hover:bg-${teamColor}-500 
                             hover:text-black transition-colors font-mono text-sm
                             w-full sm:w-auto justify-center sm:justify-start`}
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
                ) : error ? (
                  <ErrorMessage message={error} teamColor={teamColor} />
                ) : eventData || nextEventData ? (
                  <>
                    {eventData && <EventCard event={eventData} teamColor={teamColor} />}
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

              {/* Przycisk odświeżania */}
              {!isOffline && !loading && (
                <div className="mt-6 flex justify-center">
                  <button
                    onClick={refreshEvents}
                    className={`flex items-center px-4 py-2 border border-${teamColor}-500 
                             rounded hover:bg-${teamColor}-500 hover:text-black 
                             transition-colors font-mono text-sm`}
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    ODŚWIEŻ DANE
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Stopka */}
        <footer className="mt-8 text-center font-mono text-sm">
          <p className="mb-2">LINKI SYSTEMOWE:</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 sm:space-x-4">
            <a
              href="https://issa.org.pl/"
              target="_blank"
              rel="noopener noreferrer"
              className={`hover:text-${teamColor}-400 transition-colors flex items-center justify-center`}
            >
              <Terminal className="w-4 h-4 mr-1" />
              STRONA GŁÓWNA
            </a>
            <a
              href="https://issa.org.pl/czlonkostwo/jak-zostac-czlonkiem-stowarzyszenia"
              target="_blank"
              rel="noopener noreferrer"
              className={`hover:text-${teamColor}-400 transition-colors flex items-center justify-center`}
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