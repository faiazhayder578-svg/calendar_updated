import React from 'react';
import { Search, Star, Edit2, Trash2, QrCode, MessageSquare, Filter } from 'lucide-react';


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
  setShowReviewsModal,
  setShowGradeCalc,
  setShowQRGenerator,
  setSelectedClassForAction,
  reviews
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
    if (!searchQuery) return sorted;

    return sorted.filter(cls =>
      cls.courseCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cls.faculty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cls.room.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const getStatusBadge = (enrolled, maxCapacity) => {
    const percentage = (enrolled / maxCapacity) * 100;
    if (percentage >= 100) {
      return <span className="px-2 py-1 bg-red-50 text-red-600 text-xs font-semibold rounded">Full</span>;
    } else if (percentage >= 80) {
      return <span className="px-2 py-1 bg-amber-50 text-amber-600 text-xs font-semibold rounded">Almost Full</span>;
    } else {
      return <span className="px-2 py-1 bg-emerald-50 text-emerald-600 text-xs font-semibold rounded">Available</span>;
    }
  };

  return (
    <div className={`rounded-xl shadow-sm border overflow-hidden ${isDarkMode
      ? 'bg-slate-800 border-slate-700'
      : 'bg-white border-slate-200'
      }`}>
      {/* Search Bar */}
      <div className={`p-5 border-b flex justify-between items-center ${isDarkMode ? 'border-slate-700' : 'border-slate-100'
        }`}>
        <h3 className={`text-base font-semibold ${isDarkMode ? 'text-white' : 'text-slate-800'
          }`}>
          {isStudentMode ? 'Course Catalog' : 'Manage Courses'}
          {isStudentMode && favorites.length > 0 && (
            <span className={`ml-3 text-xs px-2 py-1 rounded-full ${isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'
              }`}>
              {favorites.length} favorites
            </span>
          )}
        </h3>
        <div className="flex items-center gap-3">
          <div className="relative group flex items-center gap-2">
            <label className={`text-xs font-semibold uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Sort:
            </label>
            <select
              value={sortConfig.key || (isStudentMode ? 'courseCode' : 'id')}
              onChange={(e) => handleSort(e.target.value)}
              className={`pl-3 pr-8 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 appearance-none bg-no-repeat bg-[right_0.5rem_center] transition-all ${isDarkMode
                ? 'bg-slate-700 border-slate-600 text-white focus:bg-slate-600'
                : 'bg-slate-50 border-slate-200 focus:bg-white'
                }`}
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7' /%3E%3C/svg%3E")`, backgroundSize: '1rem' }}
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
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 group-focus-within:text-slate-600 transition-colors ${isDarkMode ? 'text-slate-500' : 'text-slate-400'
              }`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search courses..."
              className={`pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 w-72 transition-all ${isDarkMode
                ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:bg-slate-600'
                : 'bg-slate-50 border-slate-200 focus:bg-white'
                }`}
            />
          </div>
        </div>
      </div>

      {/* Student Info Banner */}
      {isStudentMode && (
        <div className={`px-5 py-3 border-b ${isDarkMode ? 'bg-blue-900/20 border-slate-700' : 'bg-blue-50 border-blue-100'
          }`}>
          <p className={`text-sm ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>
            📖 <strong>Student View:</strong> Browse courses and write reviews. Contact administration for enrollment.
          </p>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className={`text-xs uppercase font-semibold tracking-wider cursor-pointer border-b ${isDarkMode
            ? 'bg-slate-700/50 text-slate-400 border-slate-700'
            : 'bg-slate-50 text-slate-500 border-slate-100'
            }`}>
            <tr>
              {isStudentMode && (
                <th className={`px-6 py-4 transition-colors ${isDarkMode ? 'hover:text-slate-300' : 'hover:text-slate-800'
                  }`}>
                  Fav
                </th>
              )}
              {!isStudentMode && (
                <th
                  className={`px-6 py-4 transition-colors cursor-pointer ${isDarkMode ? 'hover:text-slate-300' : 'hover:text-slate-800'
                    }`}
                  onClick={() => handleSort('id')}
                >
                  Order {sortConfig.key === 'id' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
              )}
              <th
                className={`px-6 py-4 transition-colors cursor-pointer ${isDarkMode ? 'hover:text-slate-300' : 'hover:text-slate-800'
                  }`}
                onClick={() => handleSort('courseCode')}
              >
                Course {sortConfig.key === 'courseCode' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th
                className={`px-6 py-4 transition-colors cursor-pointer ${isDarkMode ? 'hover:text-slate-300' : 'hover:text-slate-800'
                  }`}
                onClick={() => handleSort('section')}
              >
                Sec {sortConfig.key === 'section' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th
                className={`px-6 py-4 transition-colors cursor-pointer ${isDarkMode ? 'hover:text-slate-300' : 'hover:text-slate-800'
                  }`}
                onClick={() => handleSort('faculty')}
              >
                Instructor {sortConfig.key === 'faculty' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th
                className={`px-6 py-4 transition-colors cursor-pointer ${isDarkMode ? 'hover:text-slate-300' : 'hover:text-slate-800'
                  }`}
                onClick={() => handleSort('room')}
              >
                Room {sortConfig.key === 'room' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th
                className={`px-6 py-4 transition-colors cursor-pointer ${isDarkMode ? 'hover:text-slate-300' : 'hover:text-slate-800'
                  }`}
                onClick={() => handleSort('time')}
              >
                Time {sortConfig.key === 'time' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th
                className={`px-6 py-4 transition-colors cursor-pointer ${isDarkMode ? 'hover:text-slate-300' : 'hover:text-slate-800'
                  }`}
                onClick={() => handleSort('days')}
              >
                Days {sortConfig.key === 'days' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th
                className={`px-6 py-4 transition-colors cursor-pointer ${isDarkMode ? 'hover:text-slate-300' : 'hover:text-slate-800'
                  }`}
                onClick={() => handleSort('enrolled')}
              >
                Status {sortConfig.key === 'enrolled' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className={`divide-y text-sm ${isDarkMode
            ? 'divide-slate-700 text-slate-300'
            : 'divide-slate-50 text-slate-600'
            }`}>
            {getFilteredClasses().length === 0 ? (
              <tr>
                <td colSpan={isStudentMode ? "9" : "10"} className={`px-6 py-8 text-center ${isDarkMode ? 'text-slate-400' : 'text-slate-400'
                  }`}>
                  {isStudentMode
                    ? 'No classes available in the catalog.'
                    : 'No classes found. Click "Add Class" to add manually or use "AI Schedule" to generate automatically.'
                  }
                </td>
              </tr>
            ) : (
              getFilteredClasses().map((cls) => (
                <tr
                  key={cls.id}
                  className={`transition-colors ${isDarkMode
                    ? 'hover:bg-slate-700/50'
                    : 'hover:bg-slate-50'
                    }`}
                >
                  {isStudentMode && (
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleFavorite(cls.id)}
                        className="transition-colors"
                        title="Bookmark this class"
                      >
                        <Star
                          className={`w-5 h-5 ${favorites.includes(cls.id)
                            ? 'fill-amber-400 text-amber-400'
                            : isDarkMode
                              ? 'text-slate-500 hover:text-amber-400'
                              : 'text-slate-300 hover:text-amber-400'
                            }`}
                        />
                      </button>
                    </td>
                  )}
                  {!isStudentMode && (
                    <td className="px-6 py-4 text-xs font-mono text-slate-400">
                      {cls.id}
                    </td>
                  )}
                  <td className={`px-6 py-4 font-semibold ${isDarkMode ? 'text-white' : 'text-slate-800'
                    }`}>
                    {cls.courseCode}
                  </td>
                  <td className="px-6 py-4">{cls.section}</td>
                  <td className="px-6 py-4">{cls.faculty}</td>
                  <td className="px-6 py-4">{cls.room}</td>
                  <td className="px-6 py-4">{cls.time}</td>
                  <td className="px-6 py-4">{cls.days}</td>
                  <td className="px-6 py-4">
                    {getStatusBadge(cls.enrolled, cls.maxCapacity)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {isStudentMode ? (
                        <>
                          {/* STUDENT: Write Review Button */}
                          <button
                            onClick={() => {
                              setSelectedClassForAction(cls);
                              setShowReviewsModal(true);
                            }}
                            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 ${isDarkMode
                              ? 'bg-amber-900/30 text-amber-300 hover:bg-amber-900/50 border border-amber-700'
                              : 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200'
                              }`}
                            title="Write or view reviews"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>Review</span>
                          </button>
                        </>
                      ) : (
                        <>
                          {/* ADMIN: View Reviews Button */}
                          <button
                            onClick={() => {
                              setSelectedClassForAction(cls);
                              setShowReviewsModal(true);
                            }}
                            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 ${isDarkMode
                              ? 'bg-amber-900/30 text-amber-300 hover:bg-amber-900/50 border border-amber-700'
                              : 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200'
                              }`}
                            title="View student reviews"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>Reviews</span>
                            {reviews[cls.id]?.length > 0 && (
                              <span className="bg-amber-500 text-white text-[10px] px-1 rounded-full">
                                {reviews[cls.id].length}
                              </span>
                            )}
                          </button>

                          {/* ADMIN: Edit Button */}
                          <button
                            onClick={() => openModal(cls)}
                            className={`p-1.5 rounded-md transition-colors ${isDarkMode
                              ? 'hover:bg-slate-700 text-slate-400 hover:text-blue-400'
                              : 'hover:bg-blue-50 text-slate-400 hover:text-blue-600'
                              }`}
                            title="Edit class"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          {/* ADMIN: QR Code Button */}
                          <button
                            onClick={() => {
                              setSelectedClassForAction(cls);
                              setShowQRGenerator(true);
                            }}
                            className={`p-1.5 rounded-md transition-colors ${isDarkMode
                              ? 'hover:bg-slate-700 text-slate-400 hover:text-green-400'
                              : 'hover:bg-green-50 text-slate-400 hover:text-green-600'
                              }`}
                            title="Generate QR code for attendance"
                          >
                            <QrCode className="w-4 h-4" />
                          </button>

                          {/* ADMIN: Delete Button */}
                          <button
                            onClick={() => handleDelete(cls.id, cls.courseCode)}
                            className={`p-1.5 rounded-md transition-colors ${isDarkMode
                              ? 'hover:bg-slate-700 text-slate-400 hover:text-red-400'
                              : 'hover:bg-red-50 text-slate-400 hover:text-red-600'
                              }`}
                            title="Delete class"
                          >
                            <Trash2 className="w-4 h-4" />
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
