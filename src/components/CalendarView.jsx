import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

const CalendarView = ({ classes, enrolledClasses, isDarkMode, academicEvents = [] }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Get first day of current month
  const getFirstDayOfMonth = () => {
    return new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  };

  // Get last day of current month
  const getLastDayOfMonth = () => {
    return new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  };

  // Navigate months
  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Get month name
  const getMonthName = () => {
    return currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  };

  // Day mapping for class schedule
  const dayMapping = {
    'ST': ['Sunday', 'Tuesday'],
    'MW': ['Monday', 'Wednesday'],
    'RA': ['Thursday', 'Saturday'],
    'S': ['Sunday'],
    'M': ['Monday'],
    'T': ['Tuesday'],
    'W': ['Wednesday'],
    'R': ['Thursday'],
    'F': ['Friday'],
    'A': ['Saturday']
  };

  // Get classes for a specific day
  const getClassesForDay = (dayName) => {
    return classes.filter(cls => {
      const classDays = dayMapping[cls.days] || [];
      return classDays.includes(dayName);
    });
  };

  // Get academic events for a specific date
  const getEventsForDate = (date) => {
    return academicEvents.filter(event => {
      const eventStart = new Date(event.startDate);
      const eventEnd = new Date(event.endDate);
      const checkDate = new Date(date);

      // Reset time part for accurate date comparison
      eventStart.setHours(0, 0, 0, 0);
      eventEnd.setHours(23, 59, 59, 999);
      checkDate.setHours(0, 0, 0, 0);

      // Check if date falls within event range
      return checkDate >= eventStart && checkDate <= eventEnd;
    });
  };

  // Event type colors with dark mode support - WCAG AA compliant contrast
  const eventColors = {
<<<<<<< HEAD
    'holiday': {
      bg: isDarkMode ? 'bg-red-500/20' : 'bg-red-50',
      text: isDarkMode ? 'text-red-300' : 'text-red-800',
      border: isDarkMode ? 'border-red-500/30' : 'border-red-200',
      dot: 'bg-red-500'
    },
    'exam': {
      bg: isDarkMode ? 'bg-purple-500/20' : 'bg-purple-50',
      text: isDarkMode ? 'text-purple-300' : 'text-purple-800',
      border: isDarkMode ? 'border-purple-500/30' : 'border-purple-200',
      dot: 'bg-purple-500'
    },
    'advising': {
      bg: isDarkMode ? 'bg-[#124d54]/20' : 'bg-teal-50',
      text: isDarkMode ? 'text-teal-300' : 'text-teal-800',
      border: isDarkMode ? 'border-teal-500/30' : 'border-teal-200',
      dot: 'bg-teal-500'
    },
    'evaluation': {
      bg: isDarkMode ? 'bg-orange-500/20' : 'bg-orange-50',
      text: isDarkMode ? 'text-orange-300' : 'text-orange-800',
      border: isDarkMode ? 'border-orange-500/30' : 'border-orange-200',
      dot: 'bg-orange-500'
    },
    'registration': {
      bg: isDarkMode ? 'bg-emerald-500/20' : 'bg-emerald-50',
      text: isDarkMode ? 'text-emerald-300' : 'text-emerald-800',
      border: isDarkMode ? 'border-emerald-500/30' : 'border-emerald-200',
      dot: 'bg-emerald-500'
    },
    'break': {
      bg: isDarkMode ? 'bg-amber-500/20' : 'bg-amber-50',
      text: isDarkMode ? 'text-amber-300' : 'text-amber-800',
      border: isDarkMode ? 'border-amber-500/30' : 'border-amber-200',
      dot: 'bg-amber-500'
    },
    'other': {
      bg: isDarkMode ? 'bg-slate-500/20' : 'bg-slate-100',
      text: isDarkMode ? 'text-slate-300' : 'text-slate-800',
      border: isDarkMode ? 'border-slate-500/30' : 'border-slate-200',
      dot: 'bg-slate-500'
=======
    'holiday': { 
      bg: isDarkMode ? 'bg-red-500/20' : 'bg-red-50', 
      text: isDarkMode ? 'text-red-300' : 'text-red-800', 
      border: isDarkMode ? 'border-red-500/30' : 'border-red-200', 
      dot: 'bg-red-500' 
    },
    'exam': { 
      bg: isDarkMode ? 'bg-purple-500/20' : 'bg-purple-50', 
      text: isDarkMode ? 'text-purple-300' : 'text-purple-800', 
      border: isDarkMode ? 'border-purple-500/30' : 'border-purple-200', 
      dot: 'bg-purple-500' 
    },
    'advising': { 
      bg: isDarkMode ? 'bg-blue-500/20' : 'bg-blue-50', 
      text: isDarkMode ? 'text-blue-300' : 'text-blue-800', 
      border: isDarkMode ? 'border-blue-500/30' : 'border-blue-200', 
      dot: 'bg-blue-500' 
    },
    'evaluation': { 
      bg: isDarkMode ? 'bg-orange-500/20' : 'bg-orange-50', 
      text: isDarkMode ? 'text-orange-300' : 'text-orange-800', 
      border: isDarkMode ? 'border-orange-500/30' : 'border-orange-200', 
      dot: 'bg-orange-500' 
    },
    'registration': { 
      bg: isDarkMode ? 'bg-emerald-500/20' : 'bg-emerald-50', 
      text: isDarkMode ? 'text-emerald-300' : 'text-emerald-800', 
      border: isDarkMode ? 'border-emerald-500/30' : 'border-emerald-200', 
      dot: 'bg-emerald-500' 
    },
    'break': { 
      bg: isDarkMode ? 'bg-amber-500/20' : 'bg-amber-50', 
      text: isDarkMode ? 'text-amber-300' : 'text-amber-800', 
      border: isDarkMode ? 'border-amber-500/30' : 'border-amber-200', 
      dot: 'bg-amber-500' 
    },
    'other': { 
      bg: isDarkMode ? 'bg-slate-500/20' : 'bg-slate-100', 
      text: isDarkMode ? 'text-slate-300' : 'text-slate-800', 
      border: isDarkMode ? 'border-slate-500/30' : 'border-slate-200', 
      dot: 'bg-slate-500' 
>>>>>>> 9e987d0bc2b5e1ee9fd668c7dba32ea25ee440fe
    }
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const firstDay = getFirstDayOfMonth();
    const lastDay = getLastDayOfMonth();
    const startingDayOfWeek = firstDay.getDay();
    const daysInMonth = lastDay.getDate();

    const days = [];

    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
    }

    return days;
  };

  const calendarDays = generateCalendarDays();
  const today = new Date();
  const isToday = (date) => {
    if (!date) return false;
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className={`rounded-xl border overflow-hidden transition-all duration-200
      shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)]
      ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
      }`}>
      {/* Header */}
      <div className={`px-6 py-5 border-b ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
<<<<<<< HEAD
            <div className={`p-2.5 rounded-xl ${isDarkMode ? 'bg-teal-500/10' : 'bg-teal-50'}`}>
              <CalendarIcon className={`w-5 h-5 ${isDarkMode ? 'text-teal-400' : 'text-teal-600'}`} strokeWidth={1.75} />
=======
            <div className={`p-2.5 rounded-xl ${isDarkMode ? 'bg-slate-700' : 'bg-slate-100'}`}>
              <CalendarIcon className={`w-5 h-5 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`} strokeWidth={1.75} />
>>>>>>> 9e987d0bc2b5e1ee9fd668c7dba32ea25ee440fe
            </div>
            <h2 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Academic Calendar
            </h2>
          </div>

          <button
            onClick={goToToday}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
              focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
              ${isDarkMode
<<<<<<< HEAD
                ? 'bg-[#124d54] text-white hover:bg-[#094044] focus-visible:ring-teal-500 focus-visible:ring-offset-slate-800 shadow-md shadow-teal-900/20'
                : 'bg-teal-50 text-teal-700 hover:bg-teal-100 focus-visible:ring-teal-500 focus-visible:ring-offset-white border border-teal-100'
=======
                ? 'bg-slate-700 text-slate-200 hover:bg-slate-600 focus-visible:ring-slate-400 focus-visible:ring-offset-slate-800'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 focus-visible:ring-slate-500 focus-visible:ring-offset-white'
>>>>>>> 9e987d0bc2b5e1ee9fd668c7dba32ea25ee440fe
              }`}
            aria-label="Go to today"
          >
            Today
          </button>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={previousMonth}
            className={`p-2.5 min-h-[44px] min-w-[44px] rounded-lg transition-all duration-200 inline-flex items-center justify-center
              focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
<<<<<<< HEAD
              ${isDarkMode
                ? 'hover:bg-teal-500/10 text-slate-400 hover:text-teal-400 focus-visible:ring-teal-500 focus-visible:ring-offset-slate-800'
                : 'hover:bg-teal-50 text-slate-500 hover:text-teal-700 focus-visible:ring-teal-400 focus-visible:ring-offset-white'
=======
              ${isDarkMode 
                ? 'hover:bg-slate-700 text-slate-400 hover:text-slate-200 focus-visible:ring-slate-400 focus-visible:ring-offset-slate-800' 
                : 'hover:bg-slate-100 text-slate-500 hover:text-slate-700 focus-visible:ring-slate-500 focus-visible:ring-offset-white'
>>>>>>> 9e987d0bc2b5e1ee9fd668c7dba32ea25ee440fe
              }`}
            aria-label="Previous month"
          >
            <ChevronLeft className="w-5 h-5" strokeWidth={1.75} />
          </button>

          <h3 className={`text-base font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
            {getMonthName()}
          </h3>

          <button
            onClick={nextMonth}
            className={`p-2.5 min-h-[44px] min-w-[44px] rounded-lg transition-all duration-200 inline-flex items-center justify-center
              focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
<<<<<<< HEAD
              ${isDarkMode
                ? 'hover:bg-teal-500/10 text-slate-400 hover:text-teal-400 focus-visible:ring-teal-500 focus-visible:ring-offset-slate-800'
                : 'hover:bg-teal-50 text-slate-500 hover:text-teal-700 focus-visible:ring-teal-400 focus-visible:ring-offset-white'
=======
              ${isDarkMode 
                ? 'hover:bg-slate-700 text-slate-400 hover:text-slate-200 focus-visible:ring-slate-400 focus-visible:ring-offset-slate-800' 
                : 'hover:bg-slate-100 text-slate-500 hover:text-slate-700 focus-visible:ring-slate-500 focus-visible:ring-offset-white'
>>>>>>> 9e987d0bc2b5e1ee9fd668c7dba32ea25ee440fe
              }`}
            aria-label="Next month"
          >
            <ChevronRight className="w-5 h-5" strokeWidth={1.75} />
          </button>
        </div>
      </div>

      {/* Legend */}
<<<<<<< HEAD
      <div className={`px-6 py-3 border-b ${isDarkMode ? 'border-teal-500/20 bg-teal-900/10' : 'border-teal-100 bg-teal-50/30'}`}>
=======
      <div className={`px-6 py-3 border-b ${isDarkMode ? 'border-slate-700 bg-slate-800/50' : 'border-slate-100 bg-slate-50/50'}`}>
>>>>>>> 9e987d0bc2b5e1ee9fd668c7dba32ea25ee440fe
        <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
            <span className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>Holidays</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-purple-500"></div>
            <span className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>Exams</span>
          </div>
          <div className="flex items-center gap-2">
<<<<<<< HEAD
            <div className="w-2.5 h-2.5 rounded-full bg-teal-500"></div>
=======
            <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
>>>>>>> 9e987d0bc2b5e1ee9fd668c7dba32ea25ee440fe
            <span className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>Advising</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-orange-500"></div>
            <span className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>Evaluation</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
            <span className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>Registration</span>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-6">
        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-2 mb-3">
          {dayNames.map(day => (
            <div
              key={day}
              className={`text-center text-xs font-semibold uppercase tracking-wider py-2 ${isDarkMode ? 'text-slate-500' : 'text-slate-500'
                }`}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-2">
          {calendarDays.map((date, index) => {
            if (!date) {
              return <div key={`empty-${index}`} className="aspect-square" />;
            }

            const dayEvents = getEventsForDate(date);
            const isTodayDate = isToday(date);

            return (
              <div
                key={date.toISOString()}
                className={`aspect-square border rounded-xl p-2 transition-all duration-200 cursor-default
                  ${isTodayDate
                    ? isDarkMode
<<<<<<< HEAD
                      ? 'bg-teal-500/20 border-teal-500 ring-2 ring-teal-500/50 shadow-lg shadow-teal-500/20'
                      : 'bg-teal-50 border-teal-400 ring-2 ring-teal-400/50 shadow-lg shadow-teal-500/10'
                    : isDarkMode
                      ? 'bg-slate-700/30 border-slate-700/50 hover:border-teal-500/50 hover:bg-teal-900/20'
                      : 'bg-white border-slate-200 hover:border-teal-200 hover:bg-teal-50/50'
=======
                      ? 'bg-blue-500/20 border-blue-500 ring-2 ring-blue-500/50 shadow-lg shadow-blue-500/20'
                      : 'bg-blue-50 border-blue-400 ring-2 ring-blue-400/50 shadow-lg shadow-blue-500/10'
                    : isDarkMode
                      ? 'bg-slate-700/50 border-slate-600 hover:border-slate-500 hover:bg-slate-700'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
>>>>>>> 9e987d0bc2b5e1ee9fd668c7dba32ea25ee440fe
                  }`}
              >
                {/* Date number */}
                <div className={`text-sm font-semibold mb-1 ${isTodayDate
<<<<<<< HEAD
                  ? isDarkMode ? 'text-teal-400' : 'text-teal-600'
                  : isDarkMode
                    ? 'text-slate-200'
                    : 'text-slate-700'
=======
                    ? isDarkMode ? 'text-blue-400' : 'text-blue-600'
                    : isDarkMode
                      ? 'text-slate-200'
                      : 'text-slate-700'
>>>>>>> 9e987d0bc2b5e1ee9fd668c7dba32ea25ee440fe
                  }`}>
                  {date.getDate()}
                </div>

                {/* Events Only (No Classes) */}
                <div className="space-y-1">
                  {/* Academic Events */}
                  {dayEvents.slice(0, 3).map((event, idx) => {
                    const colors = eventColors[event.type] || eventColors.other;
                    return (
                      <div
                        key={`event-${idx}`}
                        className={`text-[10px] px-1.5 py-0.5 rounded-md truncate ${colors.bg} ${colors.text} border ${colors.border}`}
                        title={event.title}
                      >
                        <div className="flex items-center gap-1">
                          <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${colors.dot}`}></div>
                          <span className="truncate">{event.title}</span>
                        </div>
                      </div>
                    );
                  })}

                  {/* Show "+X more" if there are more items */}
                  {dayEvents.length > 3 && (
                    <div className={`text-[9px] font-medium ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                      +{dayEvents.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Upcoming Events Panel */}
      {academicEvents.length > 0 && (
        <div className={`px-6 py-5 border-t ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
          <h3 className={`text-sm font-semibold uppercase tracking-wider mb-4 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
            Upcoming Events
          </h3>
          <div className="space-y-3">
            {academicEvents
              .filter(event => new Date(event.startDate) >= new Date())
              .slice(0, 5)
              .map((event, idx) => {
                const colors = eventColors[event.type] || eventColors.other;
                return (
                  <div
                    key={idx}
                    className={`p-4 rounded-xl border transition-all duration-200 hover:shadow-sm
<<<<<<< HEAD
                      ${isDarkMode
                        ? 'bg-teal-900/10 border-teal-500/20 hover:border-teal-500/40 hover:bg-teal-900/20'
                        : 'bg-teal-50/30 border-teal-100 hover:border-teal-200 hover:bg-teal-50'
=======
                      ${isDarkMode 
                        ? 'bg-slate-700/50 border-slate-600 hover:border-slate-500' 
                        : 'bg-slate-50 border-slate-200 hover:border-slate-300'
>>>>>>> 9e987d0bc2b5e1ee9fd668c7dba32ea25ee440fe
                      }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${colors.dot}`}></div>
                      <div className="flex-1 min-w-0">
                        <div className={`font-semibold text-sm ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                          {event.title}
                        </div>
                        <div className={`text-xs mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                          {new Date(event.startDate).toLocaleDateString()}
                          {event.endDate && event.endDate !== event.startDate &&
                            ` - ${new Date(event.endDate).toLocaleDateString()}`}
                        </div>
                        {event.description && (
                          <div className={`text-xs mt-1.5 line-clamp-2 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                            {event.description}
                          </div>
                        )}
                      </div>
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium shrink-0 capitalize ${colors.bg} ${colors.text}`}>
                        {event.type}
                      </span>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* No Events Message */}
      {academicEvents.length === 0 && (
        <div className={`px-6 py-12 border-t text-center ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
<<<<<<< HEAD
          <div className={`inline-flex p-4 rounded-2xl mb-4 ${isDarkMode ? 'bg-teal-500/10' : 'bg-teal-50'}`}>
            <CalendarIcon className={`w-10 h-10 ${isDarkMode ? 'text-teal-500/40' : 'text-teal-400'}`} strokeWidth={1.5} />
=======
          <div className={`inline-flex p-4 rounded-2xl mb-4 ${isDarkMode ? 'bg-slate-700' : 'bg-slate-100'}`}>
            <CalendarIcon className={`w-10 h-10 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} strokeWidth={1.5} />
>>>>>>> 9e987d0bc2b5e1ee9fd668c7dba32ea25ee440fe
          </div>
          <p className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
            No academic calendar uploaded yet
          </p>
          <p className={`text-xs mt-1 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
            Admin can upload NSU Academic Calendar to see events here.
          </p>
        </div>
      )}
    </div>
  );
};

<<<<<<< HEAD
export default React.memo(CalendarView);
=======
export default CalendarView;
>>>>>>> 9e987d0bc2b5e1ee9fd668c7dba32ea25ee440fe
