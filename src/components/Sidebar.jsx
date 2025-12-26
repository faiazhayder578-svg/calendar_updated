import { Layers, BarChart2, Calendar, Eye, LogOut, Moon, Sun, Palette, CalendarDays, Lock, User, Users } from 'lucide-react';

const Sidebar = ({
  isStudentMode,
  isDarkMode,
  activeView,
  setActiveView,
  toggleStudentView,
  setIsDarkMode,
  addNotification,
  setShowThemeSelector,
  currentUser,
  onLogout,
  onChangePassword
}) => {
  // Navigation item base classes with smooth transitions and accessible focus states
  const getNavItemClasses = (isActive, isDestructive = false) => {
    const baseClasses = "w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 group focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2";
    const focusRingColor = isDarkMode 
      ? 'focus-visible:ring-slate-400 focus-visible:ring-offset-slate-800' 
      : 'focus-visible:ring-slate-500 focus-visible:ring-offset-white';
    
    if (isDestructive) {
      return `${baseClasses} ${focusRingColor} ${
        isDarkMode
          ? 'text-red-400 hover:bg-red-900/20 hover:text-red-300 focus-visible:ring-red-400'
          : 'text-red-600 hover:bg-red-50 hover:text-red-700 focus-visible:ring-red-500'
      }`;
    }
    
    if (isActive) {
      return `${baseClasses} ${focusRingColor} ${
        isDarkMode
          ? 'bg-slate-700 text-white border-l-2 border-white'
          : 'bg-slate-100 text-slate-900 border-l-2 border-slate-900'
      }`;
    }
    
    return `${baseClasses} ${focusRingColor} ${
      isDarkMode
        ? 'text-slate-400 hover:bg-slate-700/50 hover:text-white'
        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
    }`;
  };

  // Icon classes with consistent sizing
  const iconClasses = "w-5 h-5 flex-shrink-0 transition-opacity duration-200";
  const iconActiveClasses = `${iconClasses} opacity-100`;
  const iconInactiveClasses = `${iconClasses} opacity-70 group-hover:opacity-100`;

  // Section divider component
  const SectionDivider = ({ label }) => (
    <div className="pt-5 pb-2 px-4">
      <div className={`flex items-center gap-2 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
        <span className="text-[10px] uppercase font-bold tracking-wider">{label}</span>
        <div className={`flex-1 h-px ${isDarkMode ? 'bg-slate-700' : 'bg-slate-200'}`}></div>
      </div>
    </div>
  );

  return (
    <aside className={`w-64 border-r flex flex-col z-20 shadow-[4px_0_24px_rgba(0,0,0,0.03)] transition-colors duration-300 ${
      isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
    }`}>
      {/* Logo Section */}
      <div className={`h-20 flex items-center px-6 border-b ${
        isDarkMode ? 'border-slate-700' : 'border-slate-100'
      }`}>
        <div className={`flex items-center gap-3 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
          <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-slate-700' : 'bg-slate-900'} text-white shadow-sm`}>
            <Layers className="w-5 h-5" strokeWidth={1.75} />
          </div>
          <span className="text-lg font-bold tracking-tight">NSU Class Scheduler</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 pt-4 px-3 space-y-1 overflow-y-auto">
        {/* Main Navigation */}
        <button
          onClick={() => setActiveView('dashboard')}
          className={getNavItemClasses(activeView === 'dashboard')}
        >
          <BarChart2 className={activeView === 'dashboard' ? iconActiveClasses : iconInactiveClasses} strokeWidth={1.75} />
          <span>Dashboard</span>
        </button>

        <button
          onClick={() => setActiveView('schedule')}
          className={getNavItemClasses(activeView === 'schedule')}
        >
          <Calendar className={activeView === 'schedule' ? iconActiveClasses : iconInactiveClasses} strokeWidth={1.75} />
          <span>Class Schedule</span>
        </button>

        {/* Instructor Availability - Admin Only */}
        {!isStudentMode && (
          <button
            onClick={() => setActiveView('instructors')}
            className={getNavItemClasses(activeView === 'instructors')}
          >
            <Users className={activeView === 'instructors' ? iconActiveClasses : iconInactiveClasses} strokeWidth={1.75} />
            <span>Instructor Availability</span>
          </button>
        )}

        {/* Calendar View */}
        <button
          onClick={() => setActiveView('calendar')}
          className={getNavItemClasses(activeView === 'calendar')}
        >
          <CalendarDays className={activeView === 'calendar' ? iconActiveClasses : iconInactiveClasses} strokeWidth={1.75} />
          <span>Calendar View</span>
        </button>

        {/* Views Section */}
        <SectionDivider label="Views" />

        <button
          onClick={toggleStudentView}
          className={getNavItemClasses(false)}
        >
          {isStudentMode ? (
            <LogOut className={iconInactiveClasses} strokeWidth={1.75} />
          ) : (
            <Eye className={iconInactiveClasses} strokeWidth={1.75} />
          )}
          <span>{isStudentMode ? 'Exit Student View' : 'Student View'}</span>
        </button>

        {/* Settings Section */}
        <SectionDivider label="Settings" />

        <button
          onClick={() => {
            setIsDarkMode(!isDarkMode);
            addNotification(`${!isDarkMode ? 'Dark' : 'Light'} mode enabled`, 'info');
          }}
          className={getNavItemClasses(false)}
        >
          {isDarkMode ? (
            <Sun className={iconInactiveClasses} strokeWidth={1.75} />
          ) : (
            <Moon className={iconInactiveClasses} strokeWidth={1.75} />
          )}
          <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
        </button>

        {/* Custom Themes */}
        <button
          onClick={() => setShowThemeSelector(true)}
          className={getNavItemClasses(false)}
        >
          <Palette className={iconInactiveClasses} strokeWidth={1.75} />
          <span>Custom Themes</span>
        </button>

        {/* Admin Account Section */}
        {!isStudentMode && (
          <>
            <SectionDivider label="Account" />

            <button
              onClick={onChangePassword}
              className={getNavItemClasses(false)}
            >
              <Lock className={iconInactiveClasses} strokeWidth={1.75} />
              <span>Change Password</span>
            </button>

            <button
              onClick={onLogout}
              className={getNavItemClasses(false, true)}
            >
              <LogOut className={iconInactiveClasses} strokeWidth={1.75} />
              <span>Logout</span>
            </button>
          </>
        )}
      </nav>

      {/* User Info Section */}
      <div className={`p-4 border-t ${isDarkMode ? 'border-slate-700' : 'border-slate-100'}`}>
        <div className="flex items-center gap-3">
          {/* Enhanced Avatar */}
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-sm ring-2 ring-offset-2 transition-all duration-200 ${
            isDarkMode
              ? 'bg-gradient-to-br from-slate-600 to-slate-700 text-slate-200 ring-slate-600 ring-offset-slate-800'
              : 'bg-gradient-to-br from-slate-100 to-slate-200 text-slate-600 ring-slate-200 ring-offset-white'
          }`}>
            <User className="w-5 h-5" strokeWidth={1.75} />
          </div>
          <div className="flex-1 min-w-0">
            <p className={`text-sm font-semibold truncate ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
              {currentUser?.username || 'Admin'}
            </p>
            <span className={`inline-flex items-center text-[10px] uppercase font-bold px-2 py-0.5 rounded-full mt-1 ${
              isStudentMode
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                : isDarkMode
                  ? 'bg-slate-700 text-slate-400'
                  : 'bg-slate-100 text-slate-500'
            }`}>
              {isStudentMode ? 'Student (Preview)' : 'Administrator'}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
