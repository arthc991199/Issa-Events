// src/components/NotificationPanel.jsx
import React, { useState, useEffect } from 'react';
import { Bell, X, CheckCircle, Calendar, AlertTriangle, Trash2, Check } from 'lucide-react';
import { notificationStore } from '../services/notificationStoreService';

const NotificationPanel = ({ teamColor }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  useEffect(() => {
    const loadNotifications = () => {
      const allNotifications = notificationStore.getNotifications();
      setNotifications(allNotifications);
      setUnreadCount(notificationStore.getUnreadCount());
    };

    loadNotifications();
    const interval = setInterval(loadNotifications, 30000000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Aktualizuj tytuł strony
    document.title = unreadCount > 0 ? `(${unreadCount}) ISSA Events` : 'ISSA Events';
  }, [unreadCount]);

  const handleMarkAsRead = (notificationId) => {
    notificationStore.markAsRead(notificationId);
    setNotifications(notificationStore.getNotifications());
    setUnreadCount(notificationStore.getUnreadCount());
  };

  const handleClearAll = () => {
    notificationStore.clearAll();
    setNotifications([]);
    setUnreadCount(0);
    setIsPanelOpen(false);
  };

  const togglePanel = () => {
    setIsPanelOpen(!isPanelOpen);
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'registration':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'event':
        return <Calendar className="w-5 h-5 text-blue-500" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={togglePanel}
        className="relative p-2 hover:bg-gray-800 rounded-full transition-colors"
        aria-label={`Powiadomienia (${unreadCount} nieprzeczytanych)`}
      >
        <Bell className={`w-6 h-6 text-${teamColor}-500`} />
        {unreadCount > 0 && (
          <span className={`absolute -top-1 -right-1 bg-${teamColor}-500 
                         text-black rounded-full w-5 h-5 flex items-center 
                         justify-center text-xs font-bold`}>
            {unreadCount}
          </span>
        )}
      </button>

      {isPanelOpen && (
        <>
          <div 
            className="fixed inset-0 z-40 bg-black/50"
            onClick={togglePanel}
          />
          
          <div className={`absolute right-0 mt-2 w-80 max-h-[80vh] overflow-y-auto 
                        bg-black border border-${teamColor}-500/30 rounded-lg 
                        shadow-lg z-50`}>
            <div className="sticky top-0 bg-black p-3 border-b border-gray-800">
              <div className="flex justify-between items-center mb-2">
                <span className={`text-${teamColor}-500 font-bold`}>
                  Powiadomienia
                </span>
                <button onClick={togglePanel}>
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {notifications.length > 0 && (
                <button
                  onClick={handleClearAll}
                  className="text-xs flex items-center gap-1 px-2 py-1 
                           rounded border border-red-500/30 hover:bg-red-500/20"
                >
                  <Trash2 className="w-3 h-3" />
                  Wyczyść wszystkie
                </button>
              )}
            </div>
            
            <div className="divide-y divide-gray-800">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-gray-400">
                  Brak powiadomień
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 ${!notification.isRead ? `bg-${teamColor}-500/10` : ''}`}
                  >
                    <div className="flex items-start gap-3">
                      {getNotificationIcon(notification.type)}
                      <div className="flex-1 min-w-0">
                        <h4 className={`text-${teamColor}-400 font-bold truncate`}>
                          {notification.title}
                        </h4>
                        <p className="text-sm text-gray-300 mt-1 break-words">
                          {notification.message}
                        </p>
                        <span className="text-xs text-gray-500 mt-2 block">
                          {new Date(notification.timestamp).toLocaleString()}
                        </span>
                      </div>
                      {!notification.isRead && (
                        <button
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="text-gray-400 hover:text-gray-200 flex-shrink-0"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationPanel;