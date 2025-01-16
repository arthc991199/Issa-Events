import { isIOS, isAndroid } from './platformUtils';

const formatDate = (date) => {
  return date.toISOString().replace(/-|:|\.\d+/g, '');
};

export const addToNativeCalendar = (event) => {
  const startDate = new Date(event.date);
  const endDate = new Date(startDate);
  endDate.setHours(startDate.getHours() + 2); // Zakładamy 2h wydarzenie

  if (isIOS()) {
    const calendarUrl = encodeURI([
      'data:text/calendar;charset=utf-8,',
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'BEGIN:VEVENT',
      'URL:' + event.link,
      'DTSTART:' + formatDate(startDate),
      'DTEND:' + formatDate(endDate),
      'SUMMARY:' + event.title,
      'DESCRIPTION:' + (event.agenda || ''),
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
  } else if (isAndroid()) {
    const calendarUrl = encodeURI([
      'https://www.google.com/calendar/render',
      '?action=TEMPLATE',
      '&text=' + event.title,
      '&dates=' + formatDate(startDate) + '/' + formatDate(endDate),
      '&details=' + (event.agenda || ''),
      '&location=' + event.location,
      '&sprop=&sprop=name:'
    ].join(''));

    window.open(calendarUrl, '_blank');
  }
};