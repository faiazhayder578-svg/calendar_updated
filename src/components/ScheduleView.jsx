import React from 'react';
import { Search, Star, Edit2, Trash2, CheckCircle2, AlertCircle, XCircle } from 'lucide-react';
import { encodeSchedule } from '../utils/scheduleEncoding';


const ScheduleView = ({
  classes,
  isDarkMode,
  isStudentMode,
  favorites,
  enrolledClasses,
  searchQuery,
  setSearchQuery,
  sortConfig,
  handleSort,
  toggleFavorite,
  handleEnrollment,
  openModal,
  handleDelete,
  setSelectedClassForAction,
  showEncodedSchedule = false
}) => {
  const getSortedClasses = () => {
    let sortedClasses = [...classes];

    if (sortConfig.key) {
      sortedClasses.sort((a, b) => {
        const aVal = (a[sortConfig.key] || '').toString().toLowerCase();
        const bVal = (b[sortConfig.key] || '').toString().toLowerCase();

        if (aVal < bVal) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aVal > bVal) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    } else if (isStudentMode) {
      // Default fallback for student mode if something goes wrong with sortConfig
      sortedClasses.sort((a, b) => a.courseCode.localeCompare(b.courseCode));
    }

    return sortedClasses;
  };

  const getFilteredClasses = () => {
    const sorted = getSortedClasses();
    
    // If showEncodedSchedule is true, classes are already filtered by parent
    // Just return sorted classes
    if (showEncodedSchedule) {
      return sorted;
    }
    
    if (!searchQuery) return sorted;

    return sorted.filter(cls =>
      cls.courseCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cls.faculty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cls.room.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cls.days.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cls.time.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const getStatusBadge = (enrolled, maxCapacity) => {
    const percentage = (enrolled / maxCapacity) * 100;
    const spotsLeft = maxCapacity - enrolled;
    
    if (percentage >= 100) {
      return (
        <span 
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold
            ${isDarkMode 
              ? 'bg-red-500/20 text-red-300 border border-red-500/30' 
              : 'bg-red-50 text-red-800 border border-red-200'}`}
          role="status"
          aria-label={`Class is full. ${enrolled} of ${maxCapacity} spots filled.`}
        >
          <XCircle className="w-3.5 h-3.5" strokeWidth={2} aria-hidden="true" />
          <span>Full</span>
          <span className="sr-only">({enrolled}/{maxCapacity})</span>
        </span>
      );
    } else if (percentage >= 80) {
      return (
        <span 
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold
            ${isDarkMode 
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' 
              : 'bg-amber-50 text-amber-800 border border-amber-200'}`}
          role="status"
          aria-label={`Class is almost full. ${spotsLeft} spots remaining out of ${maxCapacity}.`}
        >
          <AlertCircle className="w-3.5 h-3.5" strokeWidth={2} aria-hidden="true" />
          <span>Almost Full</span>
          <span className="sr-only">({spotsLeft} left)</span>
        </span>
      );
    } else {
      return (
        <span 
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold
            ${isDarkMode 
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
              : 'bg-emerald-50 text-emerald-800 border border-emerald-200'}`}
          role="status"
          aria-label={`Class is available. ${spotsLeft} spots remaining out of ${maxCapacity}.`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" strokeWidth={2} aria-hidden="true" />
          <span>Available</span>
          <span className="sr-only">({spotsLeft} spots)</span>
        </span>
      );
    }
  };

  return (
    <div className={`rounded-xl border overflow-hidden transition-all duration-200
      shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)]
      ${isDarkMode
        ? 'bg-slate-800 border-slate-700'
        : 'bg-white border-slate-200'
      }`}>
      {/* Search Bar - Hide in student mode when using external search */}
      {!showEncodedSchedule && (
        <div className={`px-6 py-4 border-b flex flex-wrap justify-between items-center gap-4 ${isDarkMode ? 'border-slate-700' : 'border-slate-100'
          }`}>
          <h3 className={`text-sm font-semibold uppercase tracking-wider ${isDarkMode ? 'text-slate-300' : 'text-slate-700'
            }`}>
            {isStudentMode ? 'Course Catalog' : 'Manage Courses'}
            {isStudentMode && favorites.length > 0 && (
              <span className={`ml-3 text-xs px-2.5 py-1 rounded-full font-medium normal-case tracking-normal ${isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'
                }`}>
                {favorites.length} favorites
              </span>
            )}
          </h3>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label className={`text-xs font-semibold uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Sort:
              </label>
              <select
                value={sortConfig.key || (isStudentMode ? 'courseCode' : 'id')}
                onChange={(e) => handleSort(e.target.value)}
                className={`pl-3 pr-8 py-2 border rounded-lg text-sm font-medium
                  focus:outline-none focus:ring-2 focus:ring-offset-1 appearance-none 
                  bg-no-repeat bg-[right_0.5rem_center] transition-all duration-200
                  ${isDarkMode
                    ? 'bg-slate-700 border-slate-600 text-white focus:ring-slate-500 focus:border-slate-500 hover:bg-slate-600'
                    : 'bg-white border-slate-200 text-slate-700 focus:ring-slate-400 focus:border-slate-400 hover:border-slate-300'
                  }`}
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='${isDarkMode ? '%2394a3b8' : '%2364748b'}'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7' /%3E%3C/svg%3E")`, backgroundSize: '1rem' }}
              >
                {isStudentMode ? (
                  <>
                    <option value="courseCode">Course Code</option>
                    <option value="faculty">Instructor</option>
                  </>
                ) : (
                  <>
                    <option value="id">Creation Order</option>
                    <option value="courseCode">Course Code</option>
                    <option value="faculty">Instructor</option>
                    <option value="room">Room</option>
                    <option value="time">Time</option>
                  </>
                )}
              </select>
            </div>
            <div className="relative group">
              <Search className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-200
                ${isDarkMode 
                  ? 'text-slate-500 group-focus-within:text-slate-300' 
                  : 'text-slate-400 group-focus-within:text-slate-600'
                }`} strokeWidth={1.75} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search courses..."
                className={`pl-10 pr-4 py-2.5 border rounded-lg text-sm w-72
                  focus:outline-none focus:ring-2 focus:ring-offset-1 transition-all duration-200
                  ${isDarkMode
                    ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:ring-slate-500 focus:border-slate-500 hover:bg-slate-600'
                    : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:ring-slate-400 focus:border-slate-400 hover:border-slate-300'
                  }`}
              />
            </div>
          </div>
        </div>
      )}

      {/* Student Info Banner - Hide in student mode when using external search */}
      {isStudentMode && !showEncodedSchedule && (
        <div className={`px-6 py-3 border-b ${isDarkMode ? 'bg-blue-900/20 border-slate-700' : 'bg-blue-50 border-blue-100'
          }`}>
          <p className={`text-sm ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>
            Browse courses. Contact administration for enrollment.
          </p>
        </div>
      )}

      {/* Table Header for Student View with Encoding */}
      {showEncodedSchedule && (
        <div className={`px-6 py-4 border-b flex justify-between items-center ${isDarkMode ? 'border-slate-700' : 'border-slate-100'}`}>
          <h3 className={`text-sm font-semibold uppercase tracking-wider ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
            Course Catalog
            <span className={`ml-3 text-xs px-2.5 py-1 rounded-full font-medium normal-case tracking-normal ${isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
              {classes.length} courses
            </span>
          </h3>
          <div className="flex items-center gap-2">
            <label className={`text-xs font-semibold uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Sort:
            </label>
            <select
              value={sortConfig.key || 'courseCode'}
              onChange={(e) => handleSort(e.target.value)}
              className={`pl-3 pr-8 py-2 border rounded-lg text-sm font-medium
                focus:outline-none focus:ring-2 focus:ring-offset-1 transition-all duration-200
                ${isDarkMode
                  ? 'bg-slate-700 border-slate-600 text-white focus:ring-slate-500'
                  : 'bg-white border-slate-200 text-slate-700 focus:ring-slate-400'
              }`}
            >
              <option value="courseCode">Course Code</option>
              <option value="faculty">Instructor</option>
              <option value="room">Room</option>
              <option value="time">Schedule</option>
            </select>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className={`text-xs uppercase font-semibold tracking-wider border-b ${isDarkMode
            ? 'bg-slate-700/50 text-slate-400 border-slate-700'
            : 'bg-slate-50 text-slate-500 border-slate-200'
            }`}>
            <tr>
              {isStudentMode && (
                <th className={`px-6 py-4 transition-colors duration-150 ${isDarkMode ? 'hover:text-slate-300' : 'hover:text-slate-700'
                  }`}>
                  Fav
                </th>
              )}
              {!isStudentMode && (
                <th
                  className={`px-6 py-4 transition-colors duration-150 cursor-pointer select-none ${isDarkMode ? 'hover:text-slate-300 hover:bg-slate-700/50' : 'hover:text-slate-700 hover:bg-slate-100'
                    }`}
                  onClick={() => handleSort('id')}
                >
                  <span className="flex items-center gap-1">
                    Order {sortConfig.key === 'id' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </span>
                </th>
              )}
              <th
                className={`px-6 py-4 transition-colors duration-150 cursor-pointer select-none ${isDarkMode ? 'hover:text-slate-300 hover:bg-slate-700/50' : 'hover:text-slate-700 hover:bg-slate-100'
                  }`}
                onClick={() => handleSort('courseCode')}
              >
                <span className="flex items-center gap-1">
                  Course {sortConfig.key === 'courseCode' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </span>
              </th>
              <th
                className={`px-6 py-4 transition-colors duration-150 cursor-pointer select-none ${isDarkMode ? 'hover:text-slate-300 hover:bg-slate-700/50' : 'hover:text-slate-700 hover:bg-slate-100'
                  }`}
                onClick={() => handleSort('section')}
              >
                <span className="flex items-center gap-1">
                  Sec {sortConfig.key === 'section' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </span>
              </th>
              <th
                className={`px-6 py-4 transition-colors duration-150 cursor-pointer select-none ${isDarkMode ? 'hover:text-slate-300 hover:bg-slate-700/50' : 'hover:text-slate-700 hover:bg-slate-100'
                  }`}
                onClick={() => handleSort('faculty')}
              >
                <span className="flex items-center gap-1">
                  Instructor {sortConfig.key === 'faculty' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </span>
              </th>
              <th
                className={`px-6 py-4 transition-colors duration-150 cursor-pointer select-none ${isDarkMode ? 'hover:text-slate-300 hover:bg-slate-700/50' : 'hover:text-slate-700 hover:bg-slate-100'
                  }`}
                onClick={() => handleSort('room')}
              >
                <span className="flex items-center gap-1">
                  Room {sortConfig.key === 'room' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </span>
              </th>
              <th
                className={`px-6 py-4 transition-colors duration-150 cursor-pointer select-none ${isDarkMode ? 'hover:text-slate-300 hover:bg-slate-700/50' : 'hover:text-slate-700 hover:bg-slate-100'
                  }`}
                onClick={() => handleSort('days')}
              >
                <span className="flex items-center gap-1">
                  Days {sortConfig.key === 'days' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </span>
              </th>
              <th
                className={`px-6 py-4 transition-colors duration-150 cursor-pointer select-none ${isDarkMode ? 'hover:text-slate-300 hover:bg-slate-700/50' : 'hover:text-slate-700 hover:bg-slate-100'
                  }`}
                onClick={() => handleSort('time')}
              >
                <span className="flex items-center gap-1">
                  Time {sortConfig.key === 'time' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </span>
              </th>
              <th
                className={`px-6 py-4 transition-colors duration-150 ${isDarkMode ? 'hover:text-slate-300' : 'hover:text-slate-700'}`}
              >
                Code
              </th>
              <th
                className={`px-6 py-4 transition-colors duration-150 cursor-pointer select-none ${isDarkMode ? 'hover:text-slate-300 hover:bg-slate-700/50' : 'hover:text-slate-700 hover:bg-slate-100'
                  }`}
                onClick={() => handleSort('enrolled')}
              >
                <span className="flex items-center gap-1">
                  Status {sortConfig.key === 'enrolled' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </span>
              </th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className={`text-sm ${isDarkMode
            ? 'text-slate-300'
            : 'text-slate-600'
            }`}>
            {getFilteredClasses().length === 0 ? (
              <tr>
                <td colSpan="11" className={`px-6 py-12 text-center ${isDarkMode ? 'text-slate-400' : 'text-slate-500'
                  }`}>
                  {isStudentMode
                    ? 'No classes available in the catalog.'
                    : 'No classes found. Click "Add Class" to add a new course.'
                  }
                </td>
              </tr>
            ) : (
              getFilteredClasses().map((cls, index) => (
                <tr
                  key={cls.id}
                  className={`transition-colors duration-150 border-b last:border-b-0 ${isDarkMode
                    ? `${index % 2 === 0 ? 'bg-slate-800' : 'bg-slate-800/50'} hover:bg-slate-700/70 border-slate-700/50`
                    : `${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'} hover:bg-slate-100/80 border-slate-100`
                    }`}
                >
                  {isStudentMode && (
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleFavorite(cls.id)}
                        className={`p-2.5 min-h-[44px] min-w-[44px] rounded-lg transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 inline-flex items-center justify-center ${
                          favorites.includes(cls.id)
                            ? 'scale-110'
                            : isDarkMode 
                              ? 'hover:bg-slate-700 focus-visible:ring-slate-400 focus-visible:ring-offset-slate-800' 
                              : 'hover:bg-slate-200 focus-visible:ring-slate-500 focus-visible:ring-offset-white'
                        }`}
                        title="Bookmark this class"
                        aria-label={favorites.includes(cls.id) ? 'Remove from favorites' : 'Add to favorites'}
                      >
                        <Star
                          className={`w-5 h-5 transition-colors duration-200 ${favorites.includes(cls.id)
                            ? 'fill-amber-400 text-amber-400'
                            : isDarkMode
                              ? 'text-slate-500 hover:text-amber-400'
                              : 'text-slate-300 hover:text-amber-400'
                            }`}
                          strokeWidth={1.75}
                        />
                      </button>
                    </td>
                  )}
                  {!isStudentMode && (
                    <td className={`px-6 py-4 text-xs font-mono ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                      {cls.id}
                    </td>
                  )}
                  <td className={`px-6 py-4 font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'
                    }`}>
                    {cls.courseCode}
                  </td>
                  <td className="px-6 py-4">{cls.section}</td>
                  <td className="px-6 py-4">{cls.faculty}</td>
                  <td className="px-6 py-4">{cls.room}</td>
                  <td className="px-6 py-4">{cls.days}</td>
                  <td className="px-6 py-4">{cls.time}</td>
                  <td className="px-6 py-4">
                    <span className={`font-mono font-bold text-base ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
                      {encodeSchedule(cls.days, cls.time)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(cls.enrolled, cls.maxCapacity)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      {!isStudentMode && (
                        <>
                          {/* ADMIN: Edit Button */}
                          <button
                            onClick={() => openModal(cls)}
                            className={`p-2.5 min-h-[44px] min-w-[44px] rounded-lg transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 inline-flex items-center justify-center ${isDarkMode
                              ? 'hover:bg-slate-600 text-slate-400 hover:text-blue-400 focus-visible:ring-blue-400 focus-visible:ring-offset-slate-800'
                              : 'hover:bg-blue-50 text-slate-400 hover:text-blue-600 focus-visible:ring-blue-500 focus-visible:ring-offset-white'
                              }`}
                            title="Edit class"
                            aria-label={`Edit ${cls.courseCode}`}
                          >
                            <Edit2 className="w-4 h-4" strokeWidth={1.75} />
                          </button>

                          {/* ADMIN: Delete Button */}
                          <button
                            onClick={() => handleDelete(cls.id, cls.courseCode)}
                            className={`p-2.5 min-h-[44px] min-w-[44px] rounded-lg transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 inline-flex items-center justify-center ${isDarkMode
                              ? 'hover:bg-slate-600 text-slate-400 hover:text-red-400 focus-visible:ring-red-400 focus-visible:ring-offset-slate-800'
                              : 'hover:bg-red-50 text-slate-400 hover:text-red-600 focus-visible:ring-red-500 focus-visible:ring-offset-white'
                              }`}
                            title="Delete class"
                            aria-label={`Delete ${cls.courseCode}`}
                          >
                            <Trash2 className="w-4 h-4" strokeWidth={1.75} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ScheduleView;
