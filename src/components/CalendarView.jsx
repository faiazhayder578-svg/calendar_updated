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

  // Event type colors
  const eventColors = {
    'holiday': { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-300', dot: 'bg-red-500' },
    'exam': { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-300', dot: 'bg-purple-500' },
    'advising': { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-300', dot: 'bg-blue-500' },
    'evaluation': { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-300', dot: 'bg-orange-500' },
    'registration': { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-300', dot: 'bg-green-500' },
    'break': { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-300', dot: 'bg-yellow-500' },
    'other': { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-300', dot: 'bg-gray-500' }
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
    <div className={`rounded-xl shadow-sm border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
      }`}>
      {/* Header */}
      <div className={`p-6 border-b ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <CalendarIcon className={`w-6 h-6 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`} />
            <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Academic Calendar
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={goToToday}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${isDarkMode
                  ? 'bg-slate-700 text-slate-200 hover:bg-slate-600'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
            >
              Today
            </button>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={previousMonth}
            className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-slate-700 text-slate-300' : 'hover:bg-slate-100 text-slate-600'
              }`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
            {getMonthName()}
          </h3>

          <button
            onClick={nextMonth}
            className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-slate-700 text-slate-300' : 'hover:bg-slate-100 text-slate-600'
              }`}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className={`px-6 py-3 border-b ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
        <div className="flex flex-wrap gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className={isDarkMode ? 'text-slate-300' : 'text-slate-600'}>Holidays</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-purple-500"></div>
            <span className={isDarkMode ? 'text-slate-300' : 'text-slate-600'}>Exams</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className={isDarkMode ? 'text-slate-300' : 'text-slate-600'}>Advising</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
            <span className={isDarkMode ? 'text-slate-300' : 'text-slate-600'}>Evaluation</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className={isDarkMode ? 'text-slate-300' : 'text-slate-600'}>Registration</span>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-6">
        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {dayNames.map(day => (
            <div
              key={day}
              className={`text-center text-sm font-semibold py-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'
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
                className={`aspect-square border rounded-lg p-2 transition-all hover:shadow-md ${isTodayDate
                    ? isDarkMode
                      ? 'bg-blue-900/30 border-blue-500 ring-2 ring-blue-500'
                      : 'bg-blue-50 border-blue-500 ring-2 ring-blue-500'
                    : isDarkMode
                      ? 'bg-slate-700 border-slate-600 hover:border-slate-500'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
              >
                {/* Date number */}
                <div className={`text-sm font-semibold mb-1 ${isTodayDate
                    ? 'text-blue-600'
                    : isDarkMode
                      ? 'text-slate-200'
                      : 'text-slate-700'
                  }`}>
                  {date.getDate()}
                </div>

                {/* Events Only (No Classes) */}
                <div className="space-y-1">
                  {/* Academic Events */}
                  {dayEvents.slice(0, 4).map((event, idx) => {
                    const colors = eventColors[event.type] || eventColors.other;
                    return (
                      <div
                        key={`event-${idx}`}
                        className={`text-[10px] px-1.5 py-0.5 rounded truncate ${colors.bg} ${colors.text} border ${colors.border}`}
                        title={event.title}
                      >
                        <div className="flex items-center gap-1">
                          <div className={`w-1.5 h-1.5 rounded-full ${colors.dot}`}></div>
                          <span className="truncate">{event.title}</span>
                        </div>
                      </div>
                    );
                  })}

                  {/* Show "+X more" if there are more items */}
                  {dayEvents.length > 4 && (
                    <div className={`text-[9px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      +{dayEvents.length - 4} more
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
        <div className={`p-6 border-t ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
          <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            Upcoming Events
          </h3>
          <div className="space-y-2">
            {academicEvents
              .filter(event => new Date(event.startDate) >= new Date())
              .slice(0, 5)
              .map((event, idx) => {
                const colors = eventColors[event.type] || eventColors.other;
                return (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg border ${isDarkMode ? 'bg-slate-700 border-slate-600' : 'bg-slate-50 border-slate-200'
                      }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full mt-1.5 ${colors.dot}`}></div>
                      <div className="flex-1">
                        <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                          {event.title}
                        </div>
                        <div className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                          {new Date(event.startDate).toLocaleDateString()}
                          {event.endDate && event.endDate !== event.startDate &&
                            ` - ${new Date(event.endDate).toLocaleDateString()}`}
                        </div>
                        {event.description && (
                          <div className={`text-xs mt-1 ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>
                            {event.description}
                          </div>
                        )}
                      </div>
                      <span className={`text-xs px-2 py-1 rounded ${colors.bg} ${colors.text}`}>
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
        <div className={`p-6 border-t text-center ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
          <CalendarIcon className={`w-12 h-12 mx-auto mb-3 ${isDarkMode ? 'text-slate-600' : 'text-slate-300'}`} />
          <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            No academic calendar uploaded yet. Admin can upload NSU Academic Calendar to see events here.
          </p>
        </div>
      )}
    </div>
  );
};

export default CalendarView;