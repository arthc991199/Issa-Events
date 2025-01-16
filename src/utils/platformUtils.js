export const isIOS = () => {
    return [
      'iPad Simulator',
      'iPhone Simulator',
      'iPod Simulator',
      'iPad',
      'iPhone',
      'iPod'
    ].includes(navigator.platform)
    || (navigator.userAgent.includes("Mac") && "ontouchend" in document);
  };
  
  export const isAndroid = () => {
    return /Android/i.test(navigator.userAgent);
  };
  
  export const isMobile = () => {
    return isIOS() || isAndroid();
  };
  
  export const supportsNotifications = () => {
    return 'Notification' in window && !isIOS();
  };
  
  export const supportsPush = () => {
    return 'PushManager' in window && !isIOS();
  };
  
  export const supportsInstallPrompt = () => {
    return !isIOS();
  };
  
  export const getInstallInstructions = () => {
    if (isIOS()) {
      return {
        title: 'Instalacja na iOS:',
        steps: [
          'Otwórz w Safari',
          'Dotknij przycisku Udostępnij',
          'Przewiń w dół i wybierz "Dodaj do ekranu początkowego"',
          'Potwierdź instalację'
        ]
      };
    } else if (isAndroid()) {
      return {
        title: 'Instalacja na Android:',
        steps: [
          'Otwórz w Chrome',
          'Dotknij menu (⋮)',
          'Wybierz "Dodaj do ekranu głównego"',
          'Potwierdź instalację'
        ]
      };
    } else {
      return {
        title: 'Instalacja na komputerze:',
        steps: [
          'Otwórz w Chrome',
          'Kliknij ikonę (⋮) w pasku adresu',
          'Wybierz "Zainstaluj aplikację"',
          'Potwierdź instalację'
        ]
      };
    }
  };
  
  export const handleCalendarAdd = (event) => {
    // Format daty dla kalendarza
    const formatDate = (date) => {
      return date.toISOString().replace(/-|:|\.\d+/g, '');
    };
  
    const startDate = new Date(event.date);
    const endDate = new Date(startDate);
    endDate.setHours(startDate.getHours() + 2); // Zakładamy 2h wydarzenie
  
    const calendarUrl = encodeURI([
      'data:text/calendar;charset=utf-8,',
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'BEGIN:VEVENT',
      'URL:' + event.link,
      'DTSTART:' + formatDate(startDate),
      'DTEND:' + formatDate(endDate),
      'SUMMARY:' + event.title,
      'DESCRIPTION:' + event.agenda,
      'LOCATION:' + event.location,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\n'));
  
    const link = document.createElement('a');
    link.href = calendarUrl;
    link.download = 'event.ics';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  export const addToNativeCalendar = (event) => {
    if (isIOS()) {
      handleCalendarAdd(event);
    } else {
      // Dla Androida można użyć Intent URL
      const startDate = new Date(event.date);
      const endDate = new Date(startDate);
      endDate.setHours(startDate.getHours() + 2);
  
      const calendarUrl = encodeURI([
        'https://www.google.com/calendar/render',
        '?action=TEMPLATE',
        '&text=' + event.title,
        '&dates=' + startDate.toISOString().replace(/-|:|\.\d+/g, '') + '/' + endDate.toISOString().replace(/-|:|\.\d+/g, ''),
        '&details=' + event.agenda,
        '&location=' + event.location,
        '&sprop=&sprop=name:'
      ].join(''));
  
      window.open(calendarUrl, '_blank');
    }
  };