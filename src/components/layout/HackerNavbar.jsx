import React, { useState } from 'react';
import { 
  Terminal, 
  Users, 
  Calendar, 
  Settings, 
  Bell, 
  Menu,
  X,
  Shield 
} from 'lucide-react';

const NavbarItem = ({ icon: Icon, label, active, onClick, mobile = false }) => (
  <button 
    onClick={onClick}
    className={`
      group relative flex items-center 
      transition-all duration-300 ease-in-out
      hover:text-green-500 
      font-mono
      ${mobile 
        ? 'w-full py-4 px-4 border-b border-gray-700 hover:bg-gray-800 text-left' 
        : 'px-3 py-2'}
      ${active ? 'text-green-500' : 'text-gray-400'}
    `}
  >
    <Icon className={`w-5 h-5 mr-2 group-hover:animate-pulse`} />
    <span className="text-sm">
      {label}
    </span>
  </button>
);

const HackerNavbar = ({ currentTeam, onTeamChange, onMenuSelect }) => {
  const [activeMenu, setActiveMenu] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    { 
      icon: Terminal, 
      label: 'WYDARZENIA', 
      key: 'events' 
    },
    { 
      icon: Users, 
      label: 'SPOŁECZNOŚĆ', 
      key: 'community' 
    },
    { 
      icon: Calendar, 
      label: 'HARMONOGRAM', 
      key: 'schedule' 
    },
    { 
      icon: Settings, 
      label: 'USTAWIENIA', 
      key: 'settings' 
    }
  ];

  const handleMenuSelect = (key) => {
    setActiveMenu(key);
    onMenuSelect(key);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Navbar dla ekranów desktopowych */}
      <nav className={`
        hidden md:flex fixed top-0 left-0 right-0 z-50 
        bg-black bg-opacity-80 backdrop-blur-sm
        border-b border-${currentTeam === 'red' ? 'red' : 'blue'}-500/30
        justify-between items-center 
        px-4 py-2 font-mono
      `}
      >
        <div className="flex items-center">
          <Terminal className={`w-6 h-6 mr-2 text-${currentTeam === 'red' ? 'red' : 'blue'}-500`} />
          <h1 className="text-lg font-bold animate-text-flicker">
            ISSA EVENTS
          </h1>
        </div>

        {/* Menu Główne */}
        <div className="flex items-center space-x-4">
          {menuItems.map((item) => (
            <button
              key={item.key}
              onClick={() => handleMenuSelect(item.key)}
              className={`
                px-3 py-2 rounded-md text-sm font-mono
                transition-colors duration-200
                ${activeMenu === item.key 
                  ? 'text-green-500' 
                  : 'text-gray-400 hover:text-green-500'}
              `}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Prawa strona - Powiadomienia i Profil */}
        <div className="flex items-center space-x-4">
          <button 
            className="relative hover:text-green-500 transition-colors"
            onClick={() => handleMenuSelect('notifications')}
          >
            <Bell className="w-5 h-5" />
            <span className="absolute -top-2 -right-2 
              bg-red-500 text-white rounded-full 
              w-4 h-4 flex items-center justify-center 
              text-xs animate-pulse"
            >
              3
            </span>
          </button>

          <button 
            onClick={() => onTeamChange(currentTeam === 'blue' ? 'red' : 'blue')}
            className={`
              p-2 rounded-full 
              ${currentTeam === 'blue' ? 'bg-blue-500' : 'bg-red-500'} 
              text-black hover:opacity-80 transition-opacity
            `}
          >
            <Shield className="w-5 h-5" />
          </button>
        </div>
      </nav>

      {/* Navbar mobilny */}
      <nav className={`
        md:hidden fixed top-0 left-0 right-0 z-50 
        bg-black bg-opacity-90 backdrop-blur-sm
        border-b border-${currentTeam === 'red' ? 'red' : 'blue'}-500/30
        flex justify-between items-center 
        px-4 py-3 font-mono
      `}
      >
        <div className="flex items-center">
          <Terminal className={`w-6 h-6 mr-2 text-${currentTeam === 'red' ? 'red' : 'blue'}-500`} />
          <h1 className="text-lg font-bold animate-text-flicker">
            ISSA EVENTS
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          <button 
            className="relative hover:text-green-500 transition-colors"
            onClick={() => handleMenuSelect('notifications')}
          >
            <Bell className="w-5 h-5" />
            <span className="absolute -top-2 -right-2 
              bg-red-500 text-white rounded-full 
              w-4 h-4 flex items-center justify-center 
              text-xs animate-pulse"
            >
              3
            </span>
          </button>

          <button 
            onClick={() => onTeamChange(currentTeam === 'blue' ? 'red' : 'blue')}
            className={`
              p-2 rounded-full 
              ${currentTeam === 'blue' ? 'bg-blue-500' : 'bg-red-500'} 
              text-black hover:opacity-80 transition-opacity mr-2
            `}
          >
            <Shield className="w-5 h-5" />
          </button>

          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-white hover:text-green-500"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Menu mobilne */}
      {mobileMenuOpen && (
        <div 
          className={`
            md:hidden fixed top-16 left-0 right-0 bottom-0 z-40
            bg-black bg-opacity-95 backdrop-blur-sm
            overflow-y-auto
            border-t border-${currentTeam === 'red' ? 'red' : 'blue'}-500/30
          `}
        >
          <div className="pt-4">
            {menuItems.map((item) => (
              <button
                key={item.key}
                onClick={() => handleMenuSelect(item.key)}
                className={`
                  w-full px-4 py-3 text-left text-sm font-mono
                  border-b border-gray-700
                  transition-colors duration-200
                  ${activeMenu === item.key 
                    ? 'text-green-500 bg-gray-800' 
                    : 'text-gray-400 hover:text-green-500 hover:bg-gray-800'}
                  flex items-center
                `}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.label}
              </button>
            ))}

            {/* Dodatkowe opcje w menu mobilnym */}
            <div className="mt-4 border-t border-gray-700 pt-4">
              <button
                onClick={() => window.open('https://issa.org.pl/czlonkostwo/jak-zostac-czlonkiem-stowarzyszenia', '_blank')}
                className="w-full px-4 py-3 text-left text-sm font-mono text-gray-400 
                hover:text-green-500 hover:bg-gray-800 border-b border-gray-700 
                flex items-center"
              >
                <Users className="w-5 h-5 mr-3" />
                DOŁĄCZ DO SIECI
              </button>
              <button
                onClick={() => window.open('https://issa.org.pl/', '_blank')}
                className="w-full px-4 py-3 text-left text-sm font-mono text-gray-400 
                hover:text-green-500 hover:bg-gray-800 
                flex items-center"
              >
                <Terminal className="w-5 h-5 mr-3" />
                STRONA GŁÓWNA
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HackerNavbar;