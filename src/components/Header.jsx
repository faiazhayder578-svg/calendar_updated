import React from 'react';
import { Bell, Download, Plus, X, Calendar, Sparkles } from 'lucide-react';

const Header = ({
  activeView,
  isDarkMode,
  isStudentMode,
  classes,
  notifications,
  showNotifications,
  setShowNotifications,
  exportToCSV,
  openModal,
  setShowCalendarModal,
  openAIModal
}) => {
  const getViewTitle = () => {
    if (activeView === 'dashboard') return 'Dashboard Overview';
    if (activeView === 'calendar') return 'Calendar View';
    if (activeView === 'instructors') return 'Instructor Availability';
    return 'Class Schedule';
  };

  // Button base classes with consistent styling and accessible focus states
  const buttonBaseClasses = "inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.98]";
  
  // Secondary button (Export)
  const secondaryButtonClasses = `${buttonBaseClasses} ${
    isDarkMode
      ? 'bg-slate-700 text-slate-200 hover:bg-slate-600 shadow-sm focus-visible:ring-slate-400 focus-visible:ring-offset-slate-800'
      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 focus-visible:ring-slate-500 focus-visible:ring-offset-white'
  }`;

  // Primary button (Add Class)
  const primaryButtonClasses = `${buttonBaseClasses} bg-slate-900 text-white hover:bg-slate-800 shadow-sm focus-visible:ring-slate-500 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-800`;

  // Accent button (Calendar)
  const accentButtonClasses = `${buttonBaseClasses} bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm focus-visible:ring-indigo-500 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-800`;

  // Gradient button (AI Schedule)
  const gradientButtonClasses = `${buttonBaseClasses} bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 shadow-sm focus-visible:ring-purple-500 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-800`;

  // Icon button (Notifications)
  const iconButtonClasses = `relative p-2.5 min-h-[44px] min-w-[44px] rounded-lg transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 inline-flex items-center justify-center ${
    isDarkMode
      ? 'hover:bg-slate-700 text-slate-400 hover:text-slate-200 focus-visible:ring-slate-400 focus-visible:ring-offset-slate-800'
      : 'hover:bg-slate-100 text-slate-500 hover:text-slate-700 focus-visible:ring-slate-500 focus-visible:ring-offset-white'
  }`;

  return (
    <header className={`h-20 border-b px-8 flex items-center justify-between transition-colors duration-300 ${
      isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
    }`}>
      {/* Title Section */}
      <div>
        <h1 className={`text-2xl font-bold tracking-tight ${
          isDarkMode ? 'text-white' : 'text-slate-900'
        }`}>
          {getViewTitle()}
        </h1>
        <p className={`text-sm mt-0.5 ${
          isDarkMode ? 'text-slate-400' : 'text-slate-500'
        }`}>
          {isStudentMode
            ? `Browse and review ${classes.length} available courses`
            : `Manage ${classes.length} course${classes.length !== 1 ? 's' : ''}`
          }
        </p>
      </div>

      {/* Actions Section */}
      <div className="flex items-center gap-3">
        {/* ADMIN ONLY: Export CSV Button */}
        {!isStudentMode && (
          <button
            onClick={exportToCSV}
            className={secondaryButtonClasses}
            title="Export schedule to CSV"
          >
            <Download className="w-4 h-4" strokeWidth={1.75} />
            <span className="hidden sm:inline">Export</span>
          </button>
        )}

        {/* ADMIN ONLY: AI Schedule Button */}
        {!isStudentMode && (
          <button
            onClick={openAIModal}
            className={gradientButtonClasses}
            title="Generate schedule with AI"
          >
            <Sparkles className="w-4 h-4" strokeWidth={1.75} />
            <span className="hidden sm:inline">Auto Schedule</span>
          </button>
        )}

        {/* ADMIN ONLY: Upload Calendar Button */}
        {!isStudentMode && (
          <button
            onClick={() => setShowCalendarModal(true)}
            className={accentButtonClasses}
            title="Upload academic calendar"
          >
            <Calendar className="w-4 h-4" strokeWidth={1.75} />
            <span className="hidden sm:inline">Update Calendar</span>
          </button>
        )}

        {/* ADMIN ONLY: Add Class Button */}
        {!isStudentMode && (
          <button
            onClick={() => openModal()}
            className={primaryButtonClasses}
            title="Add new class manually"
          >
            <Plus className="w-4 h-4" strokeWidth={1.75} />
            <span className="hidden sm:inline">Add Class</span>
          </button>
        )}

        {/* Notifications (Both Admin and Student) */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className={iconButtonClasses}
            title="View notifications"
            aria-label={`Notifications${notifications.length > 0 ? ` (${notifications.length} unread)` : ''}`}
          >
            <Bell className="w-5 h-5" strokeWidth={1.75} />
            {notifications.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-slate-800 animate-pulse"></span>
            )}
          </button>

          {/* Notification Dropdown */}
          {showNotifications && (
            <div className={`absolute right-0 top-full mt-2 w-80 rounded-xl shadow-xl border overflow-hidden z-50 animate-modal-enter ${
              isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
            }`}>
              {/* Dropdown Header */}
              <div className={`px-4 py-3 border-b flex justify-between items-center ${
                isDarkMode ? 'border-slate-700 bg-slate-800/80' : 'border-slate-100 bg-slate-50/80'
              }`}>
                <h3 className={`font-semibold text-sm ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  Notifications
                </h3>
                <button
                  onClick={() => setShowNotifications(false)}
                  className={`p-1 rounded-md transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 ${
                    isDarkMode 
                      ? 'text-slate-400 hover:text-white hover:bg-slate-700 focus-visible:ring-slate-400 focus-visible:ring-offset-slate-800' 
                      : 'text-slate-400 hover:text-slate-900 hover:bg-slate-200 focus-visible:ring-slate-500 focus-visible:ring-offset-slate-50'
                  }`}
                  aria-label="Close notifications"
                >
                  <X className="w-4 h-4" strokeWidth={1.75} />
                </button>
              </div>

              {/* Dropdown Content */}
              <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className={`px-4 py-10 text-center ${
                    isDarkMode ? 'text-slate-400' : 'text-slate-500'
                  }`}>
                    <Bell className="w-8 h-8 mx-auto mb-2 opacity-40" strokeWidth={1.5} />
                    <p className="text-sm">No notifications yet</p>
                  </div>
                ) : (
                  notifications.map((notif, index) => (
                    <div
                      key={notif.id}
                      className={`px-4 py-3 border-b transition-colors duration-200 ${
                        isDarkMode
                          ? 'border-slate-700/50 hover:bg-slate-700/50'
                          : 'border-slate-100 hover:bg-slate-50'
                      } ${index === 0 ? 'animate-slide-in' : ''}`}
                    >
                      <div className="flex items-start gap-3">
                        {/* Status Indicator */}
                        <div className={`w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 ring-2 ring-offset-1 ${
                          isDarkMode ? 'ring-offset-slate-800' : 'ring-offset-white'
                        } ${
                          notif.type === 'success' 
                            ? 'bg-emerald-500 ring-emerald-500/30' 
                            : notif.type === 'error' 
                              ? 'bg-red-500 ring-red-500/30' 
                              : 'bg-blue-500 ring-blue-500/30'
                        }`}></div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm leading-relaxed ${
                            isDarkMode ? 'text-slate-200' : 'text-slate-700'
                          }`}>
                            {notif.message}
                          </p>
                          <p className={`text-xs mt-1 ${
                            isDarkMode ? 'text-slate-500' : 'text-slate-400'
                          }`}>
                            {notif.timestamp}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
