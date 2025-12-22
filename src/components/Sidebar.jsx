import React from 'react';
import { Layers, BarChart2, Calendar, Eye, LogOut, Moon, Sun, Palette, CalendarDays } from 'lucide-react';

const Sidebar = ({
  isStudentMode,
  isDarkMode,
  activeView,
  setActiveView,
  toggleStudentView,
  setIsDarkMode,
  addNotification,
  setShowThemeSelector
}) => {
  return (
    <aside className={`w-64 border-r flex flex-col z-20 shadow-[4px_0_24px_rgba(0,0,0,0.02)] transition-colors duration-300 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
      }`}>
      <div className={`h-20 flex items-center px-8 border-b ${isDarkMode ? 'border-slate-700' : 'border-slate-100'
        }`}>
        <div className={`flex items-center gap-3 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
          <div className={`p-1.5 rounded-md ${isDarkMode ? 'bg-slate-700' : 'bg-slate-900'} text-white`}>
            <Layers className="w-5 h-5" />
          </div>
          <span className="text-lg font-bold tracking-tight">Scheduler</span>
        </div>
      </div>

      <nav className="flex-1 pt-6 px-3 space-y-1">
        {/* Dashboard - VISIBLE FOR BOTH STUDENTS AND ADMINS */}
        <button
          onClick={() => setActiveView('dashboard')}
          className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${activeView === 'dashboard'
              ? isDarkMode
                ? 'bg-slate-700 text-white'
                : 'bg-slate-100 text-slate-900'
              : isDarkMode
                ? 'text-slate-400 hover:bg-slate-700 hover:text-white'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
            }`}
        >
          <BarChart2 className="w-5 h-5 mr-3 opacity-70" />
          Dashboard
        </button>

        <button
          onClick={() => setActiveView('schedule')}
          className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${activeView === 'schedule'
              ? isDarkMode
                ? 'bg-slate-700 text-white'
                : 'bg-slate-100 text-slate-900'
              : isDarkMode
                ? 'text-slate-400 hover:bg-slate-700 hover:text-white'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
            }`}
        >
          <Calendar className="w-5 h-5 mr-3" />
          Class Schedule
        </button>

        {/* Calendar View */}
        <button
          onClick={() => setActiveView('calendar')}
          className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${activeView === 'calendar'
              ? isDarkMode
                ? 'bg-slate-700 text-white'
                : 'bg-slate-100 text-slate-900'
              : isDarkMode
                ? 'text-slate-400 hover:bg-slate-700 hover:text-white'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
            }`}
        >
          <CalendarDays className="w-5 h-5 mr-3" />
          Calendar View
        </button>

        <div className="pt-4 pb-2 px-4">
          <p className={`text-[10px] uppercase font-bold tracking-wider ${isDarkMode ? 'text-slate-500' : 'text-slate-400'
            }`}>Views</p>
        </div>

        <button
          onClick={toggleStudentView}
          className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors group ${isDarkMode
              ? 'text-slate-400 hover:bg-slate-700 hover:text-white'
              : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
            }`}
        >
          {isStudentMode ? (
            <LogOut className="w-5 h-5 mr-3 opacity-70 group-hover:opacity-100" />
          ) : (
            <Eye className="w-5 h-5 mr-3 opacity-70 group-hover:opacity-100" />
          )}
          <span>{isStudentMode ? 'Exit Student View' : 'Student View'}</span>
        </button>

        <div className="pt-4 pb-2 px-4">
          <p className={`text-[10px] uppercase font-bold tracking-wider ${isDarkMode ? 'text-slate-500' : 'text-slate-400'
            }`}>Settings</p>
        </div>

        <button
          onClick={() => {
            setIsDarkMode(!isDarkMode);
            addNotification(`${!isDarkMode ? 'Dark' : 'Light'} mode enabled`, 'info');
          }}
          className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors group ${isDarkMode
              ? 'text-slate-400 hover:bg-slate-700 hover:text-white'
              : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
            }`}
        >
          {isDarkMode ? (
            <Sun className="w-5 h-5 mr-3 opacity-70 group-hover:opacity-100" />
          ) : (
            <Moon className="w-5 h-5 mr-3 opacity-70 group-hover:opacity-100" />
          )}
          <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
        </button>

        {/* Custom Themes */}
        <button
          onClick={() => setShowThemeSelector(true)}
          className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors group ${isDarkMode
              ? 'text-slate-400 hover:bg-slate-700 hover:text-white'
              : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
            }`}
        >
          <Palette className="w-5 h-5 mr-3 opacity-70 group-hover:opacity-100" />
          <span>Custom Themes</span>
        </button>
      </nav>

      <div className={`p-4 border-t ${isDarkMode ? 'border-slate-700' : 'border-slate-100'}`}>
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs border ${isDarkMode
              ? 'bg-slate-700 text-slate-300 border-slate-600'
              : 'bg-slate-200 text-slate-600 border-slate-300'
            }`}>
            MR
          </div>
          <div>
            <p className={`text-sm font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
              M. Rezwanul Huq
            </p>
            <p className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded w-max mt-0.5 ${isStudentMode
                ? 'bg-emerald-50 text-emerald-600'
                : isDarkMode
                  ? 'bg-slate-700 text-slate-400'
                  : 'bg-slate-100 text-slate-500'
              }`}>
              {isStudentMode ? 'Student (Preview)' : 'Administrator'}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
