import React, { useState } from 'react';
import { Terminal, Clock, MapPin, Calendar, ExternalLink, Bell, Mail } from 'lucide-react';
import { isIOS } from '../utils/platformUtils';
import { subscribeToPush, scheduleEventReminder } from '../services/notificationService';
import { addToNativeCalendar } from '../utils/calendarUtils';

const NotificationOptionsModal = ({ isOpen, onClose, event, teamColor }) => {
  const handleCalendarAdd = async () => {
    try {
      await addToNativeCalendar(event);
      onClose();
    } catch (error) {
      console.error('Error adding to calendar:', error);
    }
  };

  return (
    <div 
      className={`fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center ${
        isOpen ? 'block' : 'hidden'
      }`}
      onClick={onClose}
    >
      <div 
        className="bg-black border border-green-500 rounded-lg p-6 max-w-md w-full mx-4"
        onClick={e => e.stopPropagation()}
      >
        <h3 className="text-xl font-mono mb-4 text-green-500">
          Wybierz sposób przypomnienia
        </h3>
        <div className="space-y-4">
          <button
            onClick={handleCalendarAdd}
            className={`w-full p-3 border border-${teamColor}-500 rounded hover:bg-${teamColor}-500 
                     hover:text-black transition-colors font-mono text-sm flex 
                     items-center justify-center`}
          >
            <Calendar className="w-4 h-4 mr-2" />
            Dodaj do kalendarza
          </button>
        </div>
        <button
          onClick={onClose}
          className="mt-4 w-full p-2 border border-red-500 rounded hover:bg-red-500 
                   hover:text-black transition-colors font-mono text-sm"
        >
          Anuluj
        </button>
      </div>
    </div>
  );
};

const EventCard = ({ event, teamColor, isNext = false }) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);

  const handleNotificationToggle = async () => {
    try {
      if (isIOS()) {
        setShowNotificationModal(true);
      } else {
        if (Notification.permission !== 'granted') {
          const permission = await Notification.requestPermission();
          if (permission !== 'granted') return;
        }
        
        const subscription = await subscribeToPush();
        if (subscription) {
          await scheduleEventReminder(event);
          setNotificationsEnabled(true);
        }
      }
    } catch (error) {
      console.error('Error enabling notifications:', error);
    }
  };

  return (
    <>
      <div className="event-card p-4 rounded-lg mt-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg mb-2">{isNext ? 'FUTURE_EVENT:' : 'NEXT_EVENT:'}</h3>
          {!isNext && (
            <button
              onClick={handleNotificationToggle}
              className={`p-2 rounded transition-colors ${
                notificationsEnabled ? `text-${teamColor}-500` : 'text-gray-500'
              }`}
              title={notificationsEnabled ? 'Notifications enabled' : 'Enable notifications'}
            >
              <Bell className="w-5 h-5" />
            </button>
          )}
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
          {isNext ? 'DETAILS' : 'REGISTER'}
        </a>
      </div>

      <NotificationOptionsModal 
        isOpen={showNotificationModal}
        onClose={() => setShowNotificationModal(false)}
        event={event}
        teamColor={teamColor}
      />
    </>
  );
};

export default EventCard;