import React, { useState, useEffect } from 'react';
import { Terminal, Clock, MapPin, Calendar, ChevronRight, RefreshCw, Users, ExternalLink, Shield, Crosshair } from 'lucide-react';
import { cities, loadEvents } from '../services/eventService';
import '../styles/terminal.css';

// Team Switcher Component
const TeamSwitcher = ({ currentTeam, onTeamChange }) => (
  <div className="team-switcher">
    <button
      className={`team-button ${currentTeam === 'blue' ? 'text-blue-500' : 'text-gray-400'}`}
      onClick={() => onTeamChange('blue')}
    >
      <Shield className="inline-block mr-2" />
      Blue Team
    </button>
    <button
      className={`team-button ${currentTeam === 'red' ? 'text-red-500' : 'text-gray-400'}`}
      onClick={() => onTeamChange('red')}
    >
      <Crosshair className="inline-block mr-2" />
      Red Team
    </button>
  </div>
);

// Loading Animation Component
const LoadingMessage = () => {
  const [dots, setDots] = useState('');
  
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return <p className="loading-dots animate-pulse">Initializing system{dots}</p>;
};

// Event Card Component
const EventCard = ({ event, teamColor, isNext = false }) => (
  <div className="event-card p-4 rounded-lg mt-4">
    <h3 className="text-lg mb-2">{isNext ? 'FUTURE_EVENT:' : 'NEXT_EVENT:'}</h3>
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
      {isNext ? 'DETAILS' : 'REGISTER'}
    </a>
  </div>
);

// Installation Guide Component
const InstallationGuide = ({ teamColor }) => (
  <div className="terminal-container">
    <h2 className="font-mono text-xl mb-4 flex items-center">
      <Terminal className="mr-2" />
      INSTALLATION_GUIDE
    </h2>
    <div className="font-mono text-sm space-y-4">
      <div className="space-y-2">
        <p className={`text-${teamColor}-400`}>{'>'} Android_Chrome:</p>
        <ol className="list-decimal list-inside pl-4 text-green-300">
          <li>Open in Chrome</li>
          <li>Tap menu (⋮)</li>
          <li>Select "Add to Home screen"</li>
          <li>Confirm installation</li>
        </ol>
      </div>
      <div className="space-y-2">
        <p className={`text-${teamColor}-400`}>{'>'} iOS_Safari:</p>
        <ol className="list-decimal list-inside pl-4 text-green-300">
          <li>Open in Safari</li>
          <li>Tap share icon</li>
          <li>Select "Add to Home Screen"</li>
          <li>Confirm installation</li>
        </ol>
      </div>
    </div>
  </div>
);

// Main Component
const HackerInterface = () => {
  const [selectedCity, setSelectedCity] = useState(localStorage.getItem('selectedCity'));
  const [eventData, setEventData] = useState(null);
  const [nextEventData, setNextEventData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentTeam, setCurrentTeam] = useState(localStorage.getItem('team') || 'blue');

  useEffect(() => {
    const fetchEvents = async () => {
      if (selectedCity && cities[selectedCity]) {
        setLoading(true);
        const { currentEvent, nextEvent } = await loadEvents(cities[selectedCity].feed);
        setEventData(currentEvent);
        setNextEventData(nextEvent);
        setLoading(false);
      }
    };

    fetchEvents();
  }, [selectedCity]);

  const handleTeamChange = (team) => {
    setCurrentTeam(team);
    localStorage.setItem('team', team);
  };

  const handleCitySelect = (city) => {
    setSelectedCity(city);
    localStorage.setItem('selectedCity', city);
  };

  const resetCity = () => {
    setSelectedCity(null);
    localStorage.removeItem('selectedCity');
  };

  const teamColor = currentTeam === 'red' ? 'red' : 'blue';

  return (
    <div className={`min-h-screen matrix-bg text-${teamColor}-500 p-4 ${currentTeam}-team`}>
      <TeamSwitcher currentTeam={currentTeam} onTeamChange={handleTeamChange} />
      <div className="scanline" />
      <div className="terminal-overlay" />

      {/* Header */}
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-mono mb-2 glitch-text animate-pulse">
          <Terminal className="inline-block mr-2 mb-1" />
          ISSA Events Terminal
        </h1>
        <p className={`text-sm text-${teamColor}-400 font-mono animate-text-flicker`}>
          {currentTeam === 'red' ? 'RED TEAM' : 'BLUE TEAM'} v0.8_beta
        </p>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto">
        {!selectedCity ? (
          <div className="space-y-6">
            {/* City Selection */}
            <div className="terminal-container">
              <h2 className="font-mono text-xl mb-4 flex items-center">
                <ChevronRight className="mr-2" />
                SELECT_LOCATION
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {Object.entries(cities).map(([key, data]) => (
                  <button
                    key={key}
                    onClick={() => handleCitySelect(key)}
                    className={`city-button p-3 border border-${teamColor}-500 rounded 
                             hover:bg-${teamColor}-500 hover:text-black transition-colors 
                             font-mono text-sm flex items-center justify-center`}
                  >
                    <MapPin className="w-4 h-4 mr-2" />
                    {data.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Installation Guide */}
            <InstallationGuide teamColor={teamColor} />
          </div>
        ) : (
          <div className="terminal-container">
            {/* City Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-mono text-xl flex items-center">
                <Calendar className="mr-2" />
                {cities[selectedCity].name}_EVENTS
              </h2>
              <button
                onClick={resetCity}
                className={`city-button flex items-center px-3 py-2 border 
                          border-${teamColor}-500 rounded hover:bg-${teamColor}-500 
                          hover:text-black transition-colors font-mono text-sm`}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                CHANGE_LOCATION
              </button>
            </div>
            
            {/* Events Display */}
            <div className="space-y-4 font-mono">
              {loading ? (
                <LoadingMessage />
              ) : eventData ? (
                <>
                  <EventCard event={eventData} teamColor={teamColor} />
                  {nextEventData && (
                    <EventCard event={nextEventData} teamColor={teamColor} isNext={true} />
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
          <a
            href="https://issa.org.pl/"
            target="_blank"
            rel="noopener noreferrer"
            className={`hover:text-${teamColor}-400 transition-colors flex items-center`}
          >
            <Terminal className="w-4 h-4 mr-1" />
            MAIN_PAGE
          </a>
          <a
            href="https://issa.org.pl/czlonkostwo/jak-zostac-czlonkiem-stowarzyszenia"
            target="_blank"
            rel="noopener noreferrer"
            className={`hover:text-${teamColor}-400 transition-colors flex items-center`}
          >
            <Users className="w-4 h-4 mr-1" />
            JOIN_NETWORK
          </a>
        </div>
      </footer>
    </div>
  );
};

export default HackerInterface;