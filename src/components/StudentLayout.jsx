import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, LogIn, Moon, Sun, Palette, Layers, Search, Filter, X, ChevronDown } from 'lucide-react';
import Dashboard from './Dashboard';
import ScheduleView from './ScheduleView';
import CalendarView from './CalendarView';
import ThemeSelector from './ThemeSelector';
import { getInstructorInitials, matchesSearch } from '../utils/scheduleEncoding';

const StudentLayout = () => {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState('schedule');
  const [classes, setClasses] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'courseCode', direction: 'asc' });

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const storedPreference = localStorage.getItem('darkMode');
    if (storedPreference !== null) {
      return JSON.parse(storedPreference);
    }
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  const [currentTheme, setCurrentTheme] = useState('default');
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const [academicEvents, setAcademicEvents] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    instructor: '',
    courseCode: '',
    room: '',
    timeSlot: '',
    days: ''
  });

  const timeSlots = [
    { value: '', label: 'All Time Slots' },
    { value: '08:00 AM - 09:30 AM', label: '08:00-09:30 (Slot 1)' },
    { value: '09:40 AM - 11:10 AM', label: '09:40-11:10 (Slot 2)' },
    { value: '11:20 AM - 12:50 PM', label: '11:20-12:50 (Slot 3)' },
    { value: '01:00 PM - 02:30 PM', label: '01:00-02:30 (Slot 4)' },
    { value: '02:40 PM - 04:10 PM', label: '02:40-04:10 (Slot 5)' },
    { value: '04:20 PM - 05:50 PM', label: '04:20-05:50 (Slot 6)' }
  ];

  const dayOptions = [
    { value: '', label: 'All Days' },
    { value: 'ST', label: 'ST (Sun-Tue)' },
    { value: 'MW', label: 'MW (Mon-Wed)' },
    { value: 'RA', label: 'RA (Thu-Sat)' }
  ];

  const getUniqueInstructors = () => {
    const instructors = [...new Set(classes.map(c => c.faculty))].filter(Boolean).sort();
    return [{ value: '', label: 'All Instructors' }, ...instructors.map(i => ({
      value: i,
      label: `${i} (${getInstructorInitials(i)})`
    }))];
  };

  const getUniqueRooms = () => {
    const rooms = [...new Set(classes.map(c => c.room))].filter(Boolean).sort();
    return [{ value: '', label: 'All Rooms' }, ...rooms.map(r => ({ value: r, label: r }))];
  };

  const getFilteredClasses = () => {
    return classes.filter(cls => {
      if (searchQuery && !matchesSearch(cls, searchQuery)) return false;
      if (filters.instructor && cls.faculty !== filters.instructor) return false;
      if (filters.courseCode && !cls.courseCode.toLowerCase().includes(filters.courseCode.toLowerCase())) return false;
      if (filters.room && cls.room !== filters.room) return false;
      if (filters.timeSlot && cls.time !== filters.timeSlot) return false;
      if (filters.days && cls.days !== filters.days) return false;
      return true;
    });
  };

  const activeFilterCount = Object.values(filters).filter(v => v !== '').length;

  const clearFilters = () => {
    setFilters({ instructor: '', courseCode: '', room: '', timeSlot: '', days: '' });
    setSearchQuery('');
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const savedEvents = localStorage.getItem('academicEvents');
    if (savedTheme) setCurrentTheme(savedTheme);
    if (savedEvents) setAcademicEvents(JSON.parse(savedEvents));

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

    const fetchEvents = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/academic-events');
        if (response.ok) {
          const data = await response.json();
          if (data && data.length > 0) setAcademicEvents(data);
        }
      } catch (error) {
        console.error('Failed to fetch academic events:', error);
      }
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
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
    <div className={`min-h-screen flex flex-col transition-colors duration-300 theme-${currentTheme} page-background ${isDarkMode ? 'bg-slate-900' : 'bg-stone-50'
      }`}>
      {/* Background Decorative Elements */}
      <div className="page-bg-blur-1"></div>
      <div className="page-bg-blur-2"></div>
      <div className="page-bg-shape-1"></div>
      <div className="page-bg-shape-2"></div>
      <div className="page-bg-shape-3"></div>

      {/* Glassmorphism Navbar */}
      <nav className={`relative border-b transition-all duration-300 z-20 ${isDarkMode
        ? 'bg-slate-800/80 backdrop-blur-xl border-slate-700/50'
        : 'bg-white/70 backdrop-blur-xl border-stone-200/50 shadow-sm'
        }`}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo with Gradient */}
            <div className="flex items-center gap-3">
<<<<<<< HEAD
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#124d54] to-[#339fa7] text-white shadow-lg shadow-[#124d54]/25">
=======
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25">
>>>>>>> 9e987d0bc2b5e1ee9fd668c7dba32ea25ee440fe
                <Layers className="w-5 h-5" strokeWidth={1.75} />
              </div>
              <div>
                <h1 className={`text-lg font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-stone-900'}`}>
                  NSU Class Scheduler
                </h1>
<<<<<<< HEAD
                <p className={`text-[10px] font-semibold uppercase tracking-wider ${isDarkMode ? 'text-teal-400' : 'text-teal-600'}`}>
=======
                <p className={`text-[10px] font-semibold uppercase tracking-wider ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>
>>>>>>> 9e987d0bc2b5e1ee9fd668c7dba32ea25ee440fe
                  Student Portal
                </p>
              </div>
            </div>

            {/* Navigation with Active Gradient */}
            <div className={`flex items-center gap-1 p-1.5 rounded-2xl ${isDarkMode ? 'bg-slate-700/50' : 'bg-stone-100/80'}`}>
              {['dashboard', 'schedule', 'calendar'].map((view) => (
                <button
                  key={view}
                  onClick={() => setActiveView(view)}
                  className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 ${activeView === view
                    ? isDarkMode
<<<<<<< HEAD
                      ? 'bg-gradient-to-r from-teal-600/30 to-emerald-600/30 text-white shadow-lg shadow-teal-500/10'
=======
                      ? 'bg-gradient-to-r from-indigo-600/30 to-purple-600/30 text-white shadow-lg shadow-indigo-500/10'
>>>>>>> 9e987d0bc2b5e1ee9fd668c7dba32ea25ee440fe
                      : 'bg-white text-stone-900 shadow-md'
                    : isDarkMode
                      ? 'text-slate-400 hover:text-white hover:bg-white/5'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-white/50'
                    }`}
                >
                  {view === 'calendar' && <Calendar className="w-4 h-4" strokeWidth={1.75} />}
                  {view.charAt(0).toUpperCase() + view.slice(1) === 'Schedule' ? 'Courses' : view.charAt(0).toUpperCase() + view.slice(1)}
                </button>
              ))}
            </div>

            {/* Actions with Accent Button */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`p-2.5 rounded-xl transition-all duration-200 ${isDarkMode
                  ? 'hover:bg-white/10 text-slate-400 hover:text-white'
                  : 'hover:bg-stone-100 text-stone-500 hover:text-stone-900'
<<<<<<< HEAD
                  } focus:outline-none focus:ring-2 focus:ring-teal-500/50`}
=======
                  } focus:outline-none focus:ring-2 focus:ring-indigo-500/50`}
>>>>>>> 9e987d0bc2b5e1ee9fd668c7dba32ea25ee440fe
              >
                {isDarkMode ? <Sun className="w-5 h-5" strokeWidth={1.75} /> : <Moon className="w-5 h-5" strokeWidth={1.75} />}
              </button>

              <button
                onClick={() => setShowThemeSelector(true)}
                className={`p-2.5 rounded-xl transition-all duration-200 ${isDarkMode
                  ? 'hover:bg-white/10 text-slate-400 hover:text-white'
                  : 'hover:bg-stone-100 text-stone-500 hover:text-stone-900'
<<<<<<< HEAD
                  } focus:outline-none focus:ring-2 focus:ring-teal-500/50`}
=======
                  } focus:outline-none focus:ring-2 focus:ring-indigo-500/50`}
>>>>>>> 9e987d0bc2b5e1ee9fd668c7dba32ea25ee440fe
              >
                <Palette className="w-5 h-5" strokeWidth={1.75} />
              </button>

              <button
                onClick={() => navigate('/login')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white transition-all duration-200 
<<<<<<< HEAD
                  bg-gradient-to-r from-[#124d54] to-[#339fa7]
                  shadow-lg shadow-[#124d54]/25 hover:shadow-[#124d54]/40 
                  hover:scale-[1.02] active:scale-[0.98]
                  ${isDarkMode ? 'hover:shadow-teal-400/30' : ''}`}
=======
                  bg-gradient-to-r from-indigo-500 to-purple-600
                  shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 
                  hover:scale-[1.02] active:scale-[0.98]
                  ${isDarkMode ? 'hover:shadow-indigo-400/30' : ''}`}
>>>>>>> 9e987d0bc2b5e1ee9fd668c7dba32ea25ee440fe
              >
                <LogIn className="w-4 h-4" strokeWidth={1.75} />
                Admin Login
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Info Banner with Accent */}
<<<<<<< HEAD
      <div className={`relative border-b z-10 ${isDarkMode ? 'bg-teal-900/20 border-teal-800/30' : 'bg-teal-50/80 border-teal-100/50'}`}>
        <div className="max-w-7xl mx-auto px-6 py-3">
          <p className={`text-sm font-medium ${isDarkMode ? 'text-teal-300' : 'text-teal-700'}`}>
=======
      <div className={`relative border-b z-10 ${isDarkMode ? 'bg-indigo-900/20 border-indigo-800/30' : 'bg-indigo-50/80 border-indigo-100/50'}`}>
        <div className="max-w-7xl mx-auto px-6 py-3">
          <p className={`text-sm font-medium ${isDarkMode ? 'text-indigo-300' : 'text-indigo-700'}`}>
>>>>>>> 9e987d0bc2b5e1ee9fd668c7dba32ea25ee440fe
            Browse courses and view schedules. Contact administration for enrollment.
          </p>
        </div>
      </div>

      {/* Search & Filters with Glassmorphism */}
      {activeView === 'schedule' && (
        <div className={`relative border-b z-10 ${isDarkMode
          ? 'bg-slate-800/80 backdrop-blur-xl border-slate-700/50'
          : 'bg-white/70 backdrop-blur-xl border-stone-200/50 shadow-sm'
          }`}>
          <div className="max-w-7xl mx-auto px-6 py-5">
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isDarkMode ? 'text-slate-500' : 'text-stone-400'}`} strokeWidth={1.75} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by course, instructor, room, or schedule code..."
                  className={`w-full pl-12 pr-4 py-3.5 border-2 rounded-xl text-sm transition-all duration-200 ${isDarkMode
<<<<<<< HEAD
                    ? 'bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:border-teal-500 focus:bg-slate-700'
                    : 'bg-white/80 border-stone-200 text-stone-800 placeholder-stone-400 focus:border-teal-400 focus:bg-white'
                    } focus:outline-none focus:ring-4 focus:ring-teal-500/10`}
=======
                    ? 'bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:border-indigo-500 focus:bg-slate-700'
                    : 'bg-white/80 border-stone-200 text-stone-800 placeholder-stone-400 focus:border-indigo-400 focus:bg-white'
                    } focus:outline-none focus:ring-4 focus:ring-indigo-500/10`}
>>>>>>> 9e987d0bc2b5e1ee9fd668c7dba32ea25ee440fe
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-5 py-3.5 rounded-xl font-medium transition-all duration-200 ${showFilters || activeFilterCount > 0
<<<<<<< HEAD
                  ? 'bg-gradient-to-r from-[#124d54] to-[#339fa7] text-white shadow-lg shadow-[#124d54]/25'
=======
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25'
>>>>>>> 9e987d0bc2b5e1ee9fd668c7dba32ea25ee440fe
                  : isDarkMode
                    ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
              >
                <Filter className="w-4 h-4" strokeWidth={1.75} />
                Filters
                {activeFilterCount > 0 && (
                  <span className="ml-1 px-2 py-0.5 text-xs font-bold rounded-full bg-white/20">{activeFilterCount}</span>
                )}
                <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} strokeWidth={1.75} />
              </button>
              {(activeFilterCount > 0 || searchQuery) && (
                <button onClick={clearFilters} className={`flex items-center gap-1.5 px-4 py-3.5 rounded-xl text-sm font-medium ${isDarkMode ? 'text-red-400 hover:bg-red-500/10' : 'text-red-600 hover:bg-red-50'
                  }`}>
                  <X className="w-4 h-4" strokeWidth={1.75} />
                  Clear
                </button>
              )}
            </div>

            {showFilters && (
              <div className={`mt-5 pt-5 border-t grid grid-cols-2 md:grid-cols-5 gap-4 animate-slide-in ${isDarkMode ? 'border-slate-700' : 'border-stone-200'}`}>
                <div>
                  <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${isDarkMode ? 'text-slate-400' : 'text-stone-500'}`}>Instructor</label>
                  <select value={filters.instructor} onChange={(e) => setFilters(prev => ({ ...prev, instructor: e.target.value }))}
<<<<<<< HEAD
                    className={`w-full px-3 py-2.5 border-2 rounded-xl text-sm ${isDarkMode ? 'bg-slate-700/50 border-slate-600 text-white focus:border-teal-500' : 'bg-white border-stone-200 text-stone-800 focus:border-teal-400'} focus:outline-none`}>
=======
                    className={`w-full px-3 py-2.5 border-2 rounded-xl text-sm ${isDarkMode ? 'bg-slate-700/50 border-slate-600 text-white focus:border-indigo-500' : 'bg-white border-stone-200 text-stone-800 focus:border-indigo-400'} focus:outline-none`}>
>>>>>>> 9e987d0bc2b5e1ee9fd668c7dba32ea25ee440fe
                    {getUniqueInstructors().map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${isDarkMode ? 'text-slate-400' : 'text-stone-500'}`}>Course Code</label>
                  <input type="text" value={filters.courseCode} onChange={(e) => setFilters(prev => ({ ...prev, courseCode: e.target.value }))} placeholder="e.g., CSE"
<<<<<<< HEAD
                    className={`w-full px-3 py-2.5 border-2 rounded-xl text-sm ${isDarkMode ? 'bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:border-teal-500' : 'bg-white border-stone-200 text-stone-800 placeholder-stone-400 focus:border-teal-400'} focus:outline-none`} />
=======
                    className={`w-full px-3 py-2.5 border-2 rounded-xl text-sm ${isDarkMode ? 'bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:border-indigo-500' : 'bg-white border-stone-200 text-stone-800 placeholder-stone-400 focus:border-indigo-400'} focus:outline-none`} />
>>>>>>> 9e987d0bc2b5e1ee9fd668c7dba32ea25ee440fe
                </div>
                <div>
                  <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${isDarkMode ? 'text-slate-400' : 'text-stone-500'}`}>Room</label>
                  <select value={filters.room} onChange={(e) => setFilters(prev => ({ ...prev, room: e.target.value }))}
<<<<<<< HEAD
                    className={`w-full px-3 py-2.5 border-2 rounded-xl text-sm ${isDarkMode ? 'bg-slate-700/50 border-slate-600 text-white focus:border-teal-500' : 'bg-white border-stone-200 text-stone-800 focus:border-teal-400'} focus:outline-none`}>
=======
                    className={`w-full px-3 py-2.5 border-2 rounded-xl text-sm ${isDarkMode ? 'bg-slate-700/50 border-slate-600 text-white focus:border-indigo-500' : 'bg-white border-stone-200 text-stone-800 focus:border-indigo-400'} focus:outline-none`}>
>>>>>>> 9e987d0bc2b5e1ee9fd668c7dba32ea25ee440fe
                    {getUniqueRooms().map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${isDarkMode ? 'text-slate-400' : 'text-stone-500'}`}>Time Slot</label>
                  <select value={filters.timeSlot} onChange={(e) => setFilters(prev => ({ ...prev, timeSlot: e.target.value }))}
<<<<<<< HEAD
                    className={`w-full px-3 py-2.5 border-2 rounded-xl text-sm ${isDarkMode ? 'bg-slate-700/50 border-slate-600 text-white focus:border-teal-500' : 'bg-white border-stone-200 text-stone-800 focus:border-teal-400'} focus:outline-none`}>
=======
                    className={`w-full px-3 py-2.5 border-2 rounded-xl text-sm ${isDarkMode ? 'bg-slate-700/50 border-slate-600 text-white focus:border-indigo-500' : 'bg-white border-stone-200 text-stone-800 focus:border-indigo-400'} focus:outline-none`}>
>>>>>>> 9e987d0bc2b5e1ee9fd668c7dba32ea25ee440fe
                    {timeSlots.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${isDarkMode ? 'text-slate-400' : 'text-stone-500'}`}>Days</label>
                  <select value={filters.days} onChange={(e) => setFilters(prev => ({ ...prev, days: e.target.value }))}
<<<<<<< HEAD
                    className={`w-full px-3 py-2.5 border-2 rounded-xl text-sm ${isDarkMode ? 'bg-slate-700/50 border-slate-600 text-white focus:border-teal-500' : 'bg-white border-stone-200 text-stone-800 focus:border-teal-400'} focus:outline-none`}>
=======
                    className={`w-full px-3 py-2.5 border-2 rounded-xl text-sm ${isDarkMode ? 'bg-slate-700/50 border-slate-600 text-white focus:border-indigo-500' : 'bg-white border-stone-200 text-stone-800 focus:border-indigo-400'} focus:outline-none`}>
>>>>>>> 9e987d0bc2b5e1ee9fd668c7dba32ea25ee440fe
                    {dayOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                </div>
              </div>
            )}

            <div className={`mt-4 pt-4 border-t ${isDarkMode ? 'border-slate-700' : 'border-stone-200'}`}>
              <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-stone-500'}`}>
                <span className="font-semibold">Schedule Codes:</span>{' '}
<<<<<<< HEAD
                <span className={`mx-1 px-1.5 py-0.5 rounded font-mono ${isDarkMode ? 'bg-slate-700 text-teal-400' : 'bg-teal-50 text-teal-700'}`}>ST1</span> = Sun-Tue 8:00AM,
                <span className={`mx-1 px-1.5 py-0.5 rounded font-mono ${isDarkMode ? 'bg-slate-700 text-teal-400' : 'bg-teal-50 text-teal-700'}`}>MW2</span> = Mon-Wed 9:40AM
=======
                <span className={`mx-1 px-1.5 py-0.5 rounded font-mono ${isDarkMode ? 'bg-slate-700 text-indigo-400' : 'bg-indigo-50 text-indigo-700'}`}>ST1</span> = Sun-Tue 8:00AM,
                <span className={`mx-1 px-1.5 py-0.5 rounded font-mono ${isDarkMode ? 'bg-slate-700 text-indigo-400' : 'bg-indigo-50 text-indigo-700'}`}>MW2</span> = Mon-Wed 9:40AM
>>>>>>> 9e987d0bc2b5e1ee9fd668c7dba32ea25ee440fe
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="relative flex-1 max-w-7xl mx-auto w-full px-6 py-8 z-10">
        <div className="animate-fade-in-up">
          {activeView === 'dashboard' ? (
            <Dashboard classes={classes} isDarkMode={isDarkMode} />
          ) : activeView === 'calendar' ? (
            <CalendarView classes={classes} enrolledClasses={[]} isDarkMode={isDarkMode} academicEvents={academicEvents} />
          ) : (
            <ScheduleView
              classes={getFilteredClasses()}
              isDarkMode={isDarkMode}
              isStudentMode={true}
              favorites={[]}
              enrolledClasses={[]}
              searchQuery=""
              setSearchQuery={() => { }}
              sortConfig={sortConfig}
              handleSort={handleSort}
              toggleFavorite={() => { }}
              handleEnrollment={() => { }}
              openModal={() => { }}
              handleDelete={() => { }}
              setSelectedClassForAction={() => { }}
              showEncodedSchedule={true}
            />
          )}
        </div>
      </main>

      <ThemeSelector isOpen={showThemeSelector} closeModal={() => setShowThemeSelector(false)} currentTheme={currentTheme} setCurrentTheme={setCurrentTheme} isDarkMode={isDarkMode} />
    </div>
  );
};

export default StudentLayout;