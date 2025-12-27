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
    const baseClasses = "w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2";
    const focusRingColor = isDarkMode
<<<<<<< HEAD
      ? 'focus-visible:ring-teal-400 focus-visible:ring-offset-slate-800'
      : 'focus-visible:ring-teal-500 focus-visible:ring-offset-white';
=======
      ? 'focus-visible:ring-indigo-400 focus-visible:ring-offset-slate-800'
      : 'focus-visible:ring-indigo-500 focus-visible:ring-offset-white';
>>>>>>> 9e987d0bc2b5e1ee9fd668c7dba32ea25ee440fe

    if (isDestructive) {
      return `${baseClasses} ${focusRingColor} ${isDarkMode
        ? 'text-red-400 hover:bg-red-500/10 hover:text-red-300'
        : 'text-red-600 hover:bg-red-50 hover:text-red-700'
        }`;
    }

    if (isActive) {
      return `${baseClasses} ${focusRingColor} sidebar-active-item ${isDarkMode
        ? 'text-white border-l-2 shadow-lg'
        : 'text-slate-900 border-l-2 shadow-md'
        }`;
    }

    return `${baseClasses} ${focusRingColor} sidebar-nav-item ${isDarkMode
      ? 'text-slate-400 hover:bg-[#124d54]/10 hover:text-[#339fa7]'
      : 'text-slate-600 hover:bg-[#124d54]/10 hover:text-[#124d54]'
      }`;
  };

  // Icon classes with consistent sizing
  const iconClasses = "w-5 h-5 flex-shrink-0 transition-all duration-200";
  const iconActiveClasses = `${iconClasses} opacity-100`;
  const iconInactiveClasses = `${iconClasses} opacity-70 group-hover:opacity-100 group-hover:scale-110`;

  // Section divider component
  const SectionDivider = ({ label }) => (
    <div className="pt-6 pb-2 px-4">
      <div className={`flex items-center gap-2 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
        <span className="text-[10px] uppercase font-bold tracking-widest">{label}</span>
        <div className={`flex-1 h-px ${isDarkMode ? 'bg-gradient-to-r from-slate-700 to-transparent' : 'bg-gradient-to-r from-slate-200 to-transparent'}`}></div>
      </div>
    </div>
  );

  return (
    <aside className={`sidebar-wrapper w-64 flex flex-col z-20 transition-all duration-300 glass-sidebar shrink-0 ${isDarkMode ? '' : ''
      }`}>
      {/* Logo Section with Accent Gradient */}
      <div className={`h-20 flex items-center px-6 border-b shrink-0 ${isDarkMode ? 'border-slate-700/50' : 'border-slate-200/50'
        }`}>
        <div className={`flex items-center gap-3 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
<<<<<<< HEAD
          <div className="sidebar-logo-icon p-2.5 rounded-xl text-white shadow-lg shrink-0 bg-gradient-to-br from-[#124d54] to-[#339fa7]">
=======
          <div className="sidebar-logo-icon p-2.5 rounded-xl text-white shadow-lg shrink-0">
>>>>>>> 9e987d0bc2b5e1ee9fd668c7dba32ea25ee440fe
            <Layers className="w-5 h-5" strokeWidth={1.75} />
          </div>
          <div className="sidebar-text min-w-0">
            <span className="text-lg font-bold tracking-tight truncate block">NSU Scheduler</span>
            <p className="sidebar-subtitle text-[10px] font-medium uppercase tracking-wider">
              Admin Portal
            </p>
          </div>
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
          {activeView === 'dashboard' && (
<<<<<<< HEAD
            <span className={`ml-auto w-1.5 h-1.5 rounded-full ${isDarkMode ? 'bg-teal-400/40' : 'bg-teal-400/50'}`}></span>
=======
            <span className={`ml-auto w-1.5 h-1.5 rounded-full ${isDarkMode ? 'bg-indigo-400/40' : 'bg-indigo-400/50'}`}></span>
>>>>>>> 9e987d0bc2b5e1ee9fd668c7dba32ea25ee440fe
          )}
        </button>

        <button
          onClick={() => setActiveView('schedule')}
          className={getNavItemClasses(activeView === 'schedule')}
        >
          <Calendar className={activeView === 'schedule' ? iconActiveClasses : iconInactiveClasses} strokeWidth={1.75} />
          <span>Class Schedule</span>
          {activeView === 'schedule' && (
<<<<<<< HEAD
            <span className={`ml-auto w-1.5 h-1.5 rounded-full ${isDarkMode ? 'bg-teal-400/40' : 'bg-teal-400/50'}`}></span>
=======
            <span className={`ml-auto w-1.5 h-1.5 rounded-full ${isDarkMode ? 'bg-indigo-400/40' : 'bg-indigo-400/50'}`}></span>
>>>>>>> 9e987d0bc2b5e1ee9fd668c7dba32ea25ee440fe
          )}
        </button>

        {/* Instructor Availability - Admin Only */}
        {!isStudentMode && (
          <button
            onClick={() => setActiveView('instructors')}
            className={getNavItemClasses(activeView === 'instructors')}
          >
            <Users className={activeView === 'instructors' ? iconActiveClasses : iconInactiveClasses} strokeWidth={1.75} />
            <span>Instructor Availability</span>
            {activeView === 'instructors' && (
<<<<<<< HEAD
              <span className={`ml-auto w-1.5 h-1.5 rounded-full ${isDarkMode ? 'bg-teal-400/40' : 'bg-teal-400/50'}`}></span>
=======
              <span className={`ml-auto w-1.5 h-1.5 rounded-full ${isDarkMode ? 'bg-indigo-400/40' : 'bg-indigo-400/50'}`}></span>
>>>>>>> 9e987d0bc2b5e1ee9fd668c7dba32ea25ee440fe
            )}
          </button>
        )}

        {/* Calendar View */}
        <button
          onClick={() => setActiveView('calendar')}
          className={getNavItemClasses(activeView === 'calendar')}
        >
          <CalendarDays className={activeView === 'calendar' ? iconActiveClasses : iconInactiveClasses} strokeWidth={1.75} />
          <span>Calendar View</span>
          {activeView === 'calendar' && (
<<<<<<< HEAD
            <span className={`ml-auto w-1.5 h-1.5 rounded-full ${isDarkMode ? 'bg-teal-400/40' : 'bg-teal-400/50'}`}></span>
=======
            <span className={`ml-auto w-1.5 h-1.5 rounded-full ${isDarkMode ? 'bg-indigo-400/40' : 'bg-indigo-400/50'}`}></span>
>>>>>>> 9e987d0bc2b5e1ee9fd668c7dba32ea25ee440fe
          )}
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

      {/* User Info Section with Enhanced Design */}
      <div className={`p-4 border-t ${isDarkMode ? 'border-slate-700/50' : 'border-slate-200/50'}`}>
        <div className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${isDarkMode
          ? 'bg-slate-800/50 hover:bg-slate-700/50'
          : 'bg-slate-100/50 hover:bg-slate-200/50'
          }`}>
          {/* Enhanced Avatar with Gradient Border */}
          <div className="relative">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${isDarkMode
              ? 'bg-gradient-to-br from-slate-700 to-slate-800 text-slate-200'
              : 'bg-gradient-to-br from-slate-100 to-slate-200 text-slate-600'
              }`}>
              <User className="w-5 h-5" strokeWidth={1.75} />
            </div>
            <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 ${isDarkMode ? 'bg-emerald-500/70 border-slate-800' : 'bg-emerald-400/70 border-white'}`}></div>
          </div>
          <div className="flex-1 min-w-0">
            <p className={`text-sm font-semibold truncate ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
              {currentUser?.username || 'Admin'}
            </p>
            <span className={`inline-flex items-center text-[10px] uppercase font-bold px-2 py-0.5 rounded-full mt-1 ${isStudentMode
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              : isDarkMode
<<<<<<< HEAD
                ? 'bg-teal-500/20 text-teal-400 border border-teal-500/30'
                : 'bg-teal-50 text-teal-600 border border-teal-200'
=======
                ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                : 'bg-indigo-50 text-indigo-600 border border-indigo-200'
>>>>>>> 9e987d0bc2b5e1ee9fd668c7dba32ea25ee440fe
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
