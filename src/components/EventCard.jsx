import React, { useState } from 'react';
import { Terminal, Clock, MapPin, Calendar, ExternalLink, Check, Bell } from 'lucide-react';
import { notificationStore } from '../services/notificationStoreService';

const formatAgenda = (agenda) => {
  if (!agenda) return null;
  
  // Czyścimy HTML entities i inne specjalne znaki
  let cleanAgenda = agenda
    .replace(/&nbsp;/g, ' ')
    .replace(/\[…\]/g, '')
    .replace(/\[\.\.\.\]/g, '');
    
  // Szukamy wzorców czasowych (np. "17:00", "17:20" itp.)
  const timePattern = /(\d{1,2}:\d{2})\s*(.*?)(?=\d{1,2}:\d{2}|$)/g;
  const matches = [...cleanAgenda.matchAll(timePattern)];
  
  return matches.map(match => ({
    time: match[1],
    description: match[2].trim()
  }));
};

const formatTitle = (title) => {
  // Usuwamy #numerWydarzenia i hashtagi, zachowując główną nazwę
  return title
    .replace(/#\d+\s+/, '')  // Usuwa #26 
    .replace(/#[A-Za-z0-9]+/g, '') // Usuwa pozostałe hashtagi
    .trim();
};

const EventCard = ({ event, teamColor, isNext = false }) => {
  const [isRegistered, setIsRegistered] = useState(
    notificationStore.isRegistered(event.id)
  );
  const formattedAgenda = formatAgenda(event.agenda);

  const handleRegistration = (e) => {
    e.preventDefault();
    notificationStore.addRegistration(event.id, event.title);
    setIsRegistered(true);
    
    // Otwórz link rejestracji w nowej karcie
    window.open(event.link, '_blank');
  };
  
  return (
    <div className={`bg-black/30 backdrop-blur-sm border border-${teamColor}-500/30 
                    rounded-lg p-6 my-4 font-mono`}>
      {/* Nagłówek z tytułem i czasem */}
      <div className="flex items-start justify-between mb-6 gap-4">
        <h2 className={`text-${teamColor}-400 text-xl font-bold`}>
          {formatTitle(event.title)}
        </h2>
        <span className={`text-${teamColor}-500 text-sm px-3 py-1 
                       border border-${teamColor}-500/30 rounded-full 
                       whitespace-nowrap`}>
          {event.timeMessage}
        </span>
      </div>

      {/* Informacje o dacie i lokalizacji */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center gap-2">
          <Calendar className={`w-5 h-5 text-${teamColor}-500 flex-shrink-0`} />
          <span className="text-white/90">{event.date}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className={`w-5 h-5 text-${teamColor}-500 flex-shrink-0`} />
          <span className="text-white/90">{event.location}</span>
        </div>
      </div>

      {/* Agenda */}
      {formattedAgenda && formattedAgenda.length > 0 && (
        <div className={`mt-6 border-t border-${teamColor}-500/30 pt-4`}>
          <h3 className={`text-${teamColor}-400 mb-4 flex items-center gap-2`}>
            <Clock className="w-5 h-5" />
            Agenda
          </h3>
          <div className="space-y-4">
            {formattedAgenda.map((item, index) => (
              <div key={index} className="flex gap-4">
                <span className={`text-${teamColor}-500 font-bold min-w-[60px] 
                                flex-shrink-0`}>
                  {item.time}
                </span>
                <span className="text-white/80 break-words">
                  {item.description}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Przyciski akcji */}
      <div className="mt-6 flex items-center gap-4">
        {isRegistered ? (
          <div className={`inline-flex items-center gap-2 px-4 py-2 
                       border border-${teamColor}-500 rounded 
                       bg-${teamColor}-500/20 text-${teamColor}-500`}>
            <Check className="w-4 h-4" />
            Zarejestrowano
          </div>
        ) : (
          <a
            href={event.link}
            onClick={handleRegistration}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-2 px-4 py-2 
                     border border-${teamColor}-500 rounded 
                     hover:bg-${teamColor}-500 hover:text-black 
                     transition-colors`}
          >
            <ExternalLink className="w-4 h-4" />
            {isNext ? 'Szczegóły' : 'Zarejestruj się'}
          </a>
        )}
      </div>
    </div>
  );
};

export default EventCard;