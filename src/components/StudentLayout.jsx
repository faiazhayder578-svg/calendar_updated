import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, LogIn, Moon, Sun, Palette, Layers, Search, Filter, X, ChevronDown } from 'lucide-react';
import Dashboard from './Dashboard';
import ScheduleView from './ScheduleView';
import CalendarView from './CalendarView';
import ThemeSelector from './ThemeSelector';
import { encodeSchedule, getInstructorInitials, matchesSearch } from '../utils/scheduleEncoding';

const StudentLayout = () => {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState('schedule');
  const [classes, setClasses] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'courseCode', direction: 'asc' });
  
  /* ============================================
     THEME STATE - System Detection + Manual Toggle
     ============================================ */
  // Initialize dark mode: check localStorage first, then system preference
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check if user has a stored preference (manual override)
    const storedPreference = localStorage.getItem('darkMode');
    if (storedPreference !== null) {
      return JSON.parse(storedPreference);
    }
    // Fall back to system preference on first load only
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });
  
  const [currentTheme, setCurrentTheme] = useState('default');
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const [academicEvents, setAcademicEvents] = useState([]);
  
  // Advanced filter states
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    instructor: '',
    courseCode: '',
    room: '',
    timeSlot: '',
    days: ''
  });

  // Time slots for filter dropdown
  const timeSlots = [
    { value: '', label: 'All Time Slots' },
    { value: '08:00 AM - 09:30 AM', label: '08:00-09:30 (Slot 1)' },
    { value: '09:40 AM - 11:10 AM', label: '09:40-11:10 (Slot 2)' },
    { value: '11:20 AM - 12:50 PM', label: '11:20-12:50 (Slot 3)' },
    { value: '01:00 PM - 02:30 PM', label: '01:00-02:30 (Slot 4)' },
    { value: '02:40 PM - 04:10 PM', label: '02:40-04:10 (Slot 5)' },
    { value: '04:20 PM - 05:50 PM', label: '04:20-05:50 (Slot 6)' }
  ];

  // Days for filter dropdown
  const dayOptions = [
    { value: '', label: 'All Days' },
    { value: 'ST', label: 'ST (Sun-Tue)' },
    { value: 'MW', label: 'MW (Mon-Wed)' },
    { value: 'RA', label: 'RA (Thu-Sat)' },
    { value: 'S', label: 'Sunday' },
    { value: 'M', label: 'Monday' },
    { value: 'T', label: 'Tuesday' },
    { value: 'W', label: 'Wednesday' },
    { value: 'R', label: 'Thursday' },
    { value: 'A', label: 'Saturday' }
  ];

  // Get unique instructors from classes
  const getUniqueInstructors = () => {
    const instructors = [...new Set(classes.map(c => c.faculty))].filter(Boolean).sort();
    return [{ value: '', label: 'All Instructors' }, ...instructors.map(i => ({ 
      value: i, 
      label: `${i} (${getInstructorInitials(i)})` 
    }))];
  };

  // Get unique rooms from classes
  const getUniqueRooms = () => {
    const rooms = [...new Set(classes.map(c => c.room))].filter(Boolean).sort();
    return [{ value: '', label: 'All Rooms' }, ...rooms.map(r => ({ value: r, label: r }))];
  };

  // Filter classes based on all criteria
  const getFilteredClasses = () => {
    return classes.filter(cls => {
      // Search query (includes encoded values)
      if (searchQuery && !matchesSearch(cls, searchQuery)) {
        return false;
      }
      
      // Instructor filter
      if (filters.instructor && cls.faculty !== filters.instructor) {
        return false;
      }
      
      // Course code filter (partial match)
      if (filters.courseCode && !cls.courseCode.toLowerCase().includes(filters.courseCode.toLowerCase())) {
        return false;
      }
      
      // Room filter
      if (filters.room && cls.room !== filters.room) {
        return false;
      }
      
      // Time slot filter
      if (filters.timeSlot && cls.time !== filters.timeSlot) {
        return false;
      }
      
      // Days filter
      if (filters.days && cls.days !== filters.days) {
        return false;
      }
      
      return true;
    });
  };

  // Count active filters
  const activeFilterCount = Object.values(filters).filter(v => v !== '').length;

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      instructor: '',
      courseCode: '',
      room: '',
      timeSlot: '',
      days: ''
    });
    setSearchQuery('');
  };

  // Load data from localStorage on mount
  useEffect(() => {
    // Note: darkMode is initialized in useState with system detection
    const savedTheme = localStorage.getItem('theme');
    const savedEvents = localStorage.getItem('academicEvents');

    if (savedTheme) setCurrentTheme(savedTheme);
    if (savedEvents) setAcademicEvents(JSON.parse(savedEvents));

    // Fetch classes from backend
    const fetchClasses = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/classes');
        if (response.ok) {
          const data = await response.json();
          if (data && data.length > 0) setClasses(data);
        }
      } catch (error) {
        console.error('Failed to fetch classes:', error);
      }
    };
    fetchClasses();

    // Fetch academic events
    const fetchEvents = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/academic-events');
        if (response.ok) {
          const data = await response.json();
          if (data && data.length > 0) {
            setAcademicEvents(data);
          }
        }
      } catch (error) {
        console.error('Failed to fetch academic events:', error);
      }
    };
    fetchEvents();
  }, []);

  // Save dark mode preference and apply to document
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    // Apply dark class to document for global CSS selectors
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem('theme', currentTheme);
  }, [currentTheme]);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 theme-${currentTheme} ${
      isDarkMode ? 'bg-slate-900' : 'bg-slate-50'
    }`}>
      {/* Student Navbar */}
      <nav className={`border-b transition-colors duration-300 shadow-sm ${
        isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
      }`}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg shadow-md ${isDarkMode ? 'bg-slate-700' : 'bg-slate-900'} text-white`}>
                <Layers className="w-5 h-5" strokeWidth={1.75} />
              </div>
              <div>
                <h1 className={`text-lg font-bold tracking-tight ${
                  isDarkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  NSU Class Scheduler
                </h1>
                <p className={`text-xs font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  Student View
                </p>
              </div>
            </div>

            {/* Navigation Links */}
            <div className={`flex items-center gap-1 p-1 rounded-xl ${isDarkMode ? 'bg-slate-700/50' : 'bg-slate-100/80'}`}>
              <button
                onClick={() => setActiveView('dashboard')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeView === 'dashboard'
                    ? isDarkMode
                      ? 'bg-slate-600 text-white shadow-sm'
                      : 'bg-white text-slate-900 shadow-sm'
                    : isDarkMode
                    ? 'text-slate-400 hover:text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveView('schedule')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeView === 'schedule'
                    ? isDarkMode
                      ? 'bg-slate-600 text-white shadow-sm'
                      : 'bg-white text-slate-900 shadow-sm'
                    : isDarkMode
                    ? 'text-slate-400 hover:text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Courses
              </button>
              <button
                onClick={() => setActiveView('calendar')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeView === 'calendar'
                    ? isDarkMode
                      ? 'bg-slate-600 text-white shadow-sm'
                      : 'bg-white text-slate-900 shadow-sm'
                    : isDarkMode
                    ? 'text-slate-400 hover:text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Calendar className="w-4 h-4" strokeWidth={1.75} />
                Calendar
              </button>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`p-2.5 rounded-lg transition-all duration-200 ${
                  isDarkMode
                    ? 'hover:bg-slate-700 text-slate-400 hover:text-white'
                    : 'hover:bg-slate-100 text-slate-500 hover:text-slate-900'
                } focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 ${isDarkMode ? 'focus:ring-offset-slate-800' : ''}`}
                title={isDarkMode ? 'Light Mode' : 'Dark Mode'}
              >
                {isDarkMode ? <Sun className="w-5 h-5" strokeWidth={1.75} /> : <Moon className="w-5 h-5" strokeWidth={1.75} />}
              </button>

              <button
                onClick={() => setShowThemeSelector(true)}
                className={`p-2.5 rounded-lg transition-all duration-200 ${
                  isDarkMode
                    ? 'hover:bg-slate-700 text-slate-400 hover:text-white'
                    : 'hover:bg-slate-100 text-slate-500 hover:text-slate-900'
                } focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 ${isDarkMode ? 'focus:ring-offset-slate-800' : ''}`}
                title="Themes"
              >
                <Palette className="w-5 h-5" strokeWidth={1.75} />
              </button>

              <button
                onClick={() => navigate('/login')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98] ${
                  isDarkMode
                    ? 'bg-slate-700 hover:bg-slate-600 text-white'
                    : 'bg-slate-900 hover:bg-slate-800 text-white'
                } focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 ${isDarkMode ? 'focus:ring-offset-slate-800' : ''}`}
              >
                <LogIn className="w-4 h-4" strokeWidth={1.75} />
                Admin Login
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Student Info Banner */}
      <div className={`border-b ${isDarkMode ? 'bg-blue-900/20 border-blue-800/50' : 'bg-blue-50 border-blue-100'}`}>
        <div className="max-w-7xl mx-auto px-6 py-3">
          <p className={`text-sm font-medium ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>
            Browse courses and view schedules. Contact administration for enrollment.
          </p>
        </div>
      </div>

      {/* Advanced Search & Filters Panel - Only show on schedule view */}
      {activeView === 'schedule' && (
        <div className={`border-b shadow-sm ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
          <div className="max-w-7xl mx-auto px-6 py-5">
            {/* Search Bar with Filter Toggle */}
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${
                  isDarkMode ? 'text-slate-500' : 'text-slate-400'
                }`} strokeWidth={1.75} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by course, instructor, room, or schedule code (e.g., ST1, MW2)..."
                  className={`w-full pl-12 pr-4 py-3.5 border-2 rounded-xl text-sm transition-all duration-200 ${
                    isDarkMode
                      ? 'bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:border-slate-400 focus:bg-slate-700'
                      : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-500 focus:border-slate-400 focus:bg-white'
                  } focus:outline-none focus:ring-4 focus:ring-slate-500/10`}
                  aria-label="Search courses"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-5 py-3.5 rounded-xl font-medium transition-all duration-200 ${
                  showFilters || activeFilterCount > 0
                    ? isDarkMode
                      ? 'bg-slate-600 text-white shadow-md'
                      : 'bg-slate-900 text-white shadow-md'
                    : isDarkMode
                    ? 'bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                } focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 ${isDarkMode ? 'focus:ring-offset-slate-800' : ''}`}
              >
                <Filter className="w-4 h-4" strokeWidth={1.75} />
                Filters
                {activeFilterCount > 0 && (
                  <span className={`ml-1 px-2 py-0.5 text-xs font-semibold rounded-full ${
                    isDarkMode ? 'bg-slate-500 text-white' : 'bg-white text-slate-900'
                  }`}>
                    {activeFilterCount}
                  </span>
                )}
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`} strokeWidth={1.75} />
              </button>
              {(activeFilterCount > 0 || searchQuery) && (
                <button
                  onClick={clearFilters}
                  className={`flex items-center gap-1.5 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isDarkMode
                      ? 'text-red-400 hover:bg-red-900/20 hover:text-red-300'
                      : 'text-red-600 hover:bg-red-50'
                  } focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${isDarkMode ? 'focus:ring-offset-slate-800' : ''}`}
                >
                  <X className="w-4 h-4" strokeWidth={1.75} />
                  Clear
                </button>
              )}
            </div>

            {/* Expandable Filter Panel */}
            {showFilters && (
              <div className={`mt-5 pt-5 border-t grid grid-cols-2 md:grid-cols-5 gap-4 animate-slide-in ${
                isDarkMode ? 'border-slate-700' : 'border-slate-200'
              }`}>
                {/* Instructor Filter */}
                <div>
                  <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${
                    isDarkMode ? 'text-slate-400' : 'text-slate-500'
                  }`}>
                    Instructor
                  </label>
                  <select
                    value={filters.instructor}
                    onChange={(e) => setFilters(prev => ({ ...prev, instructor: e.target.value }))}
                    className={`w-full px-3 py-2.5 border-2 rounded-lg text-sm transition-all duration-200 ${
                      isDarkMode
                        ? 'bg-slate-700/50 border-slate-600 text-white focus:border-slate-400 focus:bg-slate-700'
                        : 'bg-white border-slate-200 text-slate-800 focus:border-slate-400'
                    } focus:outline-none focus:ring-4 focus:ring-slate-500/10`}
                  >
                    {getUniqueInstructors().map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                {/* Course Code Filter */}
                <div>
                  <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${
                    isDarkMode ? 'text-slate-400' : 'text-slate-500'
                  }`}>
                    Course Code
                  </label>
                  <input
                    type="text"
                    value={filters.courseCode}
                    onChange={(e) => setFilters(prev => ({ ...prev, courseCode: e.target.value }))}
                    placeholder="e.g., CSE, MAT"
                    className={`w-full px-3 py-2.5 border-2 rounded-lg text-sm transition-all duration-200 ${
                      isDarkMode
                        ? 'bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:border-slate-400 focus:bg-slate-700'
                        : 'bg-white border-slate-200 text-slate-800 placeholder-slate-500 focus:border-slate-400'
                    } focus:outline-none focus:ring-4 focus:ring-slate-500/10`}
                    aria-label="Filter by course code"
                  />
                </div>

                {/* Room Filter */}
                <div>
                  <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${
                    isDarkMode ? 'text-slate-400' : 'text-slate-500'
                  }`}>
                    Room
                  </label>
                  <select
                    value={filters.room}
                    onChange={(e) => setFilters(prev => ({ ...prev, room: e.target.value }))}
                    className={`w-full px-3 py-2.5 border-2 rounded-lg text-sm transition-all duration-200 ${
                      isDarkMode
                        ? 'bg-slate-700/50 border-slate-600 text-white focus:border-slate-400 focus:bg-slate-700'
                        : 'bg-white border-slate-200 text-slate-800 focus:border-slate-400'
                    } focus:outline-none focus:ring-4 focus:ring-slate-500/10`}
                  >
                    {getUniqueRooms().map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                {/* Time Slot Filter */}
                <div>
                  <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${
                    isDarkMode ? 'text-slate-400' : 'text-slate-500'
                  }`}>
                    Time Slot
                  </label>
                  <select
                    value={filters.timeSlot}
                    onChange={(e) => setFilters(prev => ({ ...prev, timeSlot: e.target.value }))}
                    className={`w-full px-3 py-2.5 border-2 rounded-lg text-sm transition-all duration-200 ${
                      isDarkMode
                        ? 'bg-slate-700/50 border-slate-600 text-white focus:border-slate-400 focus:bg-slate-700'
                        : 'bg-white border-slate-200 text-slate-800 focus:border-slate-400'
                    } focus:outline-none focus:ring-4 focus:ring-slate-500/10`}
                  >
                    {timeSlots.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                {/* Days Filter */}
                <div>
                  <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${
                    isDarkMode ? 'text-slate-400' : 'text-slate-500'
                  }`}>
                    Days
                  </label>
                  <select
                    value={filters.days}
                    onChange={(e) => setFilters(prev => ({ ...prev, days: e.target.value }))}
                    className={`w-full px-3 py-2.5 border-2 rounded-lg text-sm transition-all duration-200 ${
                      isDarkMode
                        ? 'bg-slate-700/50 border-slate-600 text-white focus:border-slate-400 focus:bg-slate-700'
                        : 'bg-white border-slate-200 text-slate-800 focus:border-slate-400'
                    } focus:outline-none focus:ring-4 focus:ring-slate-500/10`}
                  >
                    {dayOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Encoding Legend */}
            <div className={`mt-4 pt-4 border-t ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
              <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                <span className="font-semibold">Schedule Codes:</span> Search using encoded format - 
                <span className={`mx-1 px-1.5 py-0.5 rounded font-mono text-xs ${isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-700'}`}>ST1</span> = Sun-Tue 8:00AM,
                <span className={`mx-1 px-1.5 py-0.5 rounded font-mono text-xs ${isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-700'}`}>MW2</span> = Mon-Wed 9:40AM,
                <span className={`mx-1 px-1.5 py-0.5 rounded font-mono text-xs ${isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-700'}`}>RA3</span> = Thu-Sat 11:20AM,
                etc. (Slots: 1=8:00, 2=9:40, 3=11:20, 4=1:00, 5=2:40, 6=4:20)
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">
        {activeView === 'dashboard' ? (
          <Dashboard classes={classes} isDarkMode={isDarkMode} />
        ) : activeView === 'calendar' ? (
          <CalendarView
            classes={classes}
            enrolledClasses={[]}
            isDarkMode={isDarkMode}
            academicEvents={academicEvents}
          />
        ) : (
          <ScheduleView
            classes={getFilteredClasses()}
            isDarkMode={isDarkMode}
            isStudentMode={true}
            favorites={[]}
            enrolledClasses={[]}
            searchQuery=""
            setSearchQuery={() => {}}
            sortConfig={sortConfig}
            handleSort={handleSort}
            toggleFavorite={() => {}}
            handleEnrollment={() => {}}
            openModal={() => {}}
            handleDelete={() => {}}
            setShowGradeCalc={() => {}}
            setShowQRGenerator={() => {}}
            setSelectedClassForAction={() => {}}
            showEncodedSchedule={true}
          />
        )}
      </main>

      {/* Theme Selector Modal */}
      <ThemeSelector
        isOpen={showThemeSelector}
        closeModal={() => setShowThemeSelector(false)}
        currentTheme={currentTheme}
        setCurrentTheme={setCurrentTheme}
        isDarkMode={isDarkMode}
      />
    </div>
  );
};

export default StudentLayout;
