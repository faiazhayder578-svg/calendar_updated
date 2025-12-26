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
    return 'Class Schedule';
  };

  return (
    <header className={`h-20 border-b px-8 flex items-center justify-between transition-colors duration-300 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
      }`}>
      <div>
        <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'
          }`}>
          {getViewTitle()}
        </h1>
        <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'
          }`}>
          {isStudentMode
            ? `Browse and review ${classes.length} available courses`
            : `Manage ${classes.length} course${classes.length !== 1 ? 's' : ''}`
          }
        </p>
      </div>

      <div className="flex items-center gap-3">
        {/* ADMIN ONLY: Export CSV Button */}
        {!isStudentMode && (
          <button
            onClick={exportToCSV}
            className={`px-4 py-2.5 rounded-lg font-medium text-sm transition-all flex items-center gap-2 ${isDarkMode
                ? 'bg-slate-700 text-slate-200 hover:bg-slate-600'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            title="Export schedule to CSV"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export</span>
          </button>
        )}

        {/* ADMIN ONLY: AI Schedule Button */}
        {!isStudentMode && (
          <button
            onClick={openAIModal}
            className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-medium text-sm hover:from-purple-700 hover:to-indigo-700 transition-all flex items-center gap-2 shadow-sm"
            title="Generate schedule with AI"
          >
            <Sparkles className="w-4 h-4" />
            <span className="hidden sm:inline">Auto Schedule</span>
          </button>
        )}

        {/* ADMIN ONLY: Upload Calendar Button */}
        {!isStudentMode && (
          <button
            onClick={() => setShowCalendarModal(true)}
            className="px-4 py-2.5 bg-indigo-600 text-white rounded-lg font-medium text-sm hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-sm"
            title="Upload academic calendar"
          >
            <Calendar className="w-4 h-4" />
            <span className="hidden sm:inline">Update Calendar</span>
          </button>
        )}

        {/* ADMIN ONLY: Add Class Button */}
        {!isStudentMode && (
          <button
            onClick={() => openModal()}
            className="px-4 py-2.5 bg-slate-900 text-white rounded-lg font-medium text-sm hover:bg-slate-800 transition-all flex items-center gap-2 shadow-sm"
            title="Add new class manually"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Class</span>
          </button>
        )}

        {/* Notifications (Both Admin and Student) */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className={`relative p-2.5 rounded-lg transition-colors ${isDarkMode
                ? 'hover:bg-slate-700 text-slate-400'
                : 'hover:bg-slate-100 text-slate-500'
              }`}
            title="View notifications"
          >
            <Bell className="w-5 h-5" />
            {notifications.length > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            )}
          </button>

          {showNotifications && (
            <div className={`absolute right-0 top-full mt-2 w-80 rounded-xl shadow-2xl border overflow-hidden z-50 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
              }`}>
              <div className={`px-4 py-3 border-b flex justify-between items-center ${isDarkMode ? 'border-slate-700' : 'border-slate-100'
                }`}>
                <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  Notifications
                </h3>
                <button
                  onClick={() => setShowNotifications(false)}
                  className={`${isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-400 hover:text-slate-900'}`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className={`px-4 py-8 text-center text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'
                    }`}>
                    No notifications yet
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`px-4 py-3 border-b transition-colors ${isDarkMode
                          ? 'border-slate-700 hover:bg-slate-700/50'
                          : 'border-slate-50 hover:bg-slate-50'
                        }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${notif.type === 'success' ? 'bg-emerald-500' :
                            notif.type === 'error' ? 'bg-red-500' :
                              'bg-blue-500'
                          }`}></div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                            {notif.message}
                          </p>
                          <p className={`text-xs mt-1 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
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