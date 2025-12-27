import { useState, useRef, useEffect } from 'react';
import { Search, Star, Edit2, Trash2, CheckCircle2, AlertCircle, XCircle, Copy, Check } from 'lucide-react';
import { encodeSchedule } from '../utils/scheduleEncoding';

// Get instructor initials for avatar
const getInitials = (name) => {
  if (!name) return '??';
  const parts = name.split(' ').filter(p => p.length > 0);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

// Get a consistent color for instructor avatar based on name
const getAvatarColor = (name) => {
  const colors = [
    { bg: 'bg-indigo-100 dark:bg-indigo-500/20', text: 'text-indigo-700 dark:text-indigo-300' },
    { bg: 'bg-purple-100 dark:bg-purple-500/20', text: 'text-purple-700 dark:text-purple-300' },
    { bg: 'bg-pink-100 dark:bg-pink-500/20', text: 'text-pink-700 dark:text-pink-300' },
    { bg: 'bg-blue-100 dark:bg-blue-500/20', text: 'text-blue-700 dark:text-blue-300' },
    { bg: 'bg-teal-100 dark:bg-teal-500/20', text: 'text-teal-700 dark:text-teal-300' },
    { bg: 'bg-orange-100 dark:bg-orange-500/20', text: 'text-orange-700 dark:text-orange-300' },
  ];
  const hash = name?.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) || 0;
  return colors[hash % colors.length];
};

const ScheduleView = ({
  classes,
  isDarkMode,
  isStudentMode,
  favorites,
  searchQuery,
  setSearchQuery,
  sortConfig,
  handleSort,
  toggleFavorite,
  openModal,
  handleDelete,
  showEncodedSchedule = false
}) => {
  const [copiedCode, setCopiedCode] = useState(null);
  const tableScrollRef = useRef(null);

  // Enable horizontal scrolling with mouse wheel
  useEffect(() => {
    const scrollContainer = tableScrollRef.current;
    if (!scrollContainer) return;

    const handleWheel = (e) => {
      // Only handle horizontal scroll if there's overflow
      if (scrollContainer.scrollWidth > scrollContainer.clientWidth) {
        // Check if we're at the horizontal edges
        const atLeftEdge = scrollContainer.scrollLeft === 0;
        const atRightEdge = scrollContainer.scrollLeft + scrollContainer.clientWidth >= scrollContainer.scrollWidth - 1;

        // If scrolling down and not at right edge, or scrolling up and not at left edge
        if ((e.deltaY > 0 && !atRightEdge) || (e.deltaY < 0 && !atLeftEdge)) {
          e.preventDefault();
          scrollContainer.scrollLeft += e.deltaY;
        }
      }
    };

    scrollContainer.addEventListener('wheel', handleWheel, { passive: false });
    return () => scrollContainer.removeEventListener('wheel', handleWheel);
  }, []);

  const copyToClipboard = (code, classId) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(classId);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const getSortedClasses = () => {
    let sortedClasses = [...classes];
    if (sortConfig.key) {
      sortedClasses.sort((a, b) => {
        const aVal = (a[sortConfig.key] || '').toString().toLowerCase();
        const bVal = (b[sortConfig.key] || '').toString().toLowerCase();
        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    } else if (isStudentMode) {
      sortedClasses.sort((a, b) => a.courseCode.localeCompare(b.courseCode));
    }
    return sortedClasses;
  };

  const getFilteredClasses = () => {
    const sorted = getSortedClasses();
    if (showEncodedSchedule) return sorted;
    if (!searchQuery) return sorted;
    return sorted.filter(cls =>
      cls.courseCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cls.faculty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cls.room.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  // Get status info for row tinting
  const getStatusInfo = (enrolled, maxCapacity) => {
    const percentage = (enrolled / maxCapacity) * 100;
    if (percentage >= 100) return { status: 'full', percentage };
    if (percentage >= 80) return { status: 'warning', percentage };
    return { status: 'available', percentage };
  };

  // Softer status badge colors
  const getStatusBadge = (enrolled, maxCapacity) => {
    const { status } = getStatusInfo(enrolled, maxCapacity);
    const spotsLeft = maxCapacity - enrolled;

    if (status === 'full') {
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold
          ${isDarkMode ? 'bg-red-500/15 text-red-300 border border-red-500/25' : 'bg-red-50 text-red-700 border border-red-100'}`}
          role="status">
          <XCircle className="w-3.5 h-3.5" strokeWidth={2} />
          <span>Full</span>
        </span>
      );
    } else if (status === 'warning') {
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold
          ${isDarkMode ? 'bg-amber-500/15 text-amber-300 border border-amber-500/25' : 'bg-amber-50 text-amber-700 border border-amber-100'}`}
          role="status">
          <AlertCircle className="w-3.5 h-3.5" strokeWidth={2} />
          <span>{spotsLeft} left</span>
        </span>
      );
    }
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold
        ${isDarkMode ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20' : 'bg-green-50 text-green-700 border border-green-100'}`}
        role="status">
        <CheckCircle2 className="w-3.5 h-3.5" strokeWidth={2} />
        <span>Open</span>
      </span>
    );
  };

  // Row background based on status
  const getRowBg = (cls, index) => {
    const { status } = getStatusInfo(cls.enrolled, cls.maxCapacity);
    if (isDarkMode) {
      if (status === 'full') return 'bg-red-500/5 hover:bg-red-500/10';
      if (status === 'warning') return 'bg-amber-500/5 hover:bg-amber-500/10';
      return index % 2 === 0 ? 'bg-slate-800 hover:bg-slate-700/70' : 'bg-slate-800/50 hover:bg-slate-700/70';
    }
    if (status === 'full') return 'bg-red-50/50 hover:bg-red-50';
    if (status === 'warning') return 'bg-amber-50/50 hover:bg-amber-50';
    return index % 2 === 0 ? 'bg-white hover:bg-stone-50' : 'bg-stone-50/50 hover:bg-stone-100/80';
  };

  return (
    <div className={`rounded-2xl border overflow-hidden transition-all duration-300
      ${isDarkMode ? 'bg-slate-800 border-slate-700 shadow-xl shadow-slate-900/20' : 'bg-white border-stone-200 shadow-lg shadow-stone-200/50'}`}>

      {/* Header */}
      {!showEncodedSchedule && (
        <div className={`px-6 py-4 border-b flex flex-wrap justify-between items-center gap-4 ${isDarkMode ? 'border-slate-700' : 'border-stone-100'}`}>
          <h3 className={`text-sm font-bold uppercase tracking-wider ${isDarkMode ? 'text-slate-200' : 'text-stone-800'}`}>
            {isStudentMode ? 'Course Catalog' : 'Manage Courses'}
            {isStudentMode && favorites.length > 0 && (
              <span className={`ml-3 text-xs px-2.5 py-1 rounded-full font-medium normal-case ${isDarkMode ? 'bg-indigo-500/20 text-indigo-300' : 'bg-indigo-50 text-indigo-700'}`}>
                {favorites.length} favorites
              </span>
            )}
          </h3>
          <div className="flex items-center gap-4">
            <select
              value={sortConfig.key || 'courseCode'}
              onChange={(e) => handleSort(e.target.value)}
              className={`px-3 py-2 border-2 rounded-xl text-sm font-medium transition-all
                ${isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:border-indigo-500' : 'bg-white border-stone-200 text-stone-700 focus:border-indigo-400'} focus:outline-none`}
            >
              <option value="courseCode">Sort: Course</option>
              <option value="faculty">Sort: Instructor</option>
              <option value="room">Sort: Room</option>
              <option value="time">Sort: Time</option>
            </select>
            <div className="relative">
              <Search className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${isDarkMode ? 'text-slate-500' : 'text-stone-400'}`} strokeWidth={1.75} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className={`pl-10 pr-4 py-2.5 border-2 rounded-xl text-sm w-64 transition-all
                  ${isDarkMode ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-indigo-500' : 'bg-white border-stone-200 text-stone-900 placeholder-stone-400 focus:border-indigo-400'} focus:outline-none`}
              />
            </div>
          </div>
        </div>
      )}

      {/* Student Header with Encoding */}
      {showEncodedSchedule && (
        <div className={`px-6 py-4 border-b flex justify-between items-center ${isDarkMode ? 'border-slate-700' : 'border-stone-100'}`}>
          <h3 className={`text-sm font-bold uppercase tracking-wider ${isDarkMode ? 'text-slate-200' : 'text-stone-800'}`}>
            Course Catalog
            <span className={`ml-3 text-xs px-2.5 py-1 rounded-full font-medium normal-case ${isDarkMode ? 'bg-indigo-500/20 text-indigo-300' : 'bg-indigo-50 text-indigo-700'}`}>
              {classes.length} courses
            </span>
          </h3>
          <select
            value={sortConfig.key || 'courseCode'}
            onChange={(e) => handleSort(e.target.value)}
            className={`px-3 py-2 border-2 rounded-xl text-sm font-medium transition-all
              ${isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:border-indigo-500' : 'bg-white border-stone-200 text-stone-700 focus:border-indigo-400'} focus:outline-none`}
          >
            <option value="courseCode">Sort: Course</option>
            <option value="faculty">Sort: Instructor</option>
            <option value="room">Sort: Room</option>
          </select>
        </div>
      )}

      {/* Table */}
      <div ref={tableScrollRef} className="table-scroll-wrapper overflow-x-auto -webkit-overflow-scrolling-touch cursor-grab active:cursor-grabbing">
        <table className="w-full text-left">
          <thead className={`text-xs uppercase font-bold tracking-wider border-b ${isDarkMode ? 'bg-slate-700/50 text-slate-400 border-slate-700' : 'bg-stone-50 text-stone-500 border-stone-200'}`}>
            <tr>
              {isStudentMode && <th className="px-5 py-4 w-12">Fav</th>}
              {!isStudentMode && <th className="px-5 py-4 w-16 cursor-pointer hover:text-indigo-500" onClick={() => handleSort('id')}>#</th>}
              <th className="px-5 py-4 cursor-pointer hover:text-indigo-500" onClick={() => handleSort('courseCode')}>Course</th>
              <th className="px-5 py-4 w-16">Sec</th>
              <th className="px-5 py-4 cursor-pointer hover:text-indigo-500" onClick={() => handleSort('faculty')}>Instructor</th>
              <th className="px-5 py-4">Room</th>
              <th className="px-5 py-4">Schedule</th>
              <th className="px-5 py-4 w-20">Code</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4 w-24">Actions</th>
            </tr>
          </thead>
          <tbody className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-stone-600'}`}>
            {getFilteredClasses().length === 0 ? (
              <tr>
                <td colSpan="10" className={`px-6 py-16 text-center ${isDarkMode ? 'text-slate-400' : 'text-stone-500'}`}>
                  <div className="flex flex-col items-center gap-2">
                    <Search className="w-8 h-8 opacity-30" />
                    <p className="font-medium">No classes found</p>
                    <p className="text-xs opacity-70">{isStudentMode ? 'Try adjusting your filters' : 'Click "Add Class" to create one'}</p>
                  </div>
                </td>
              </tr>
            ) : (
              getFilteredClasses().map((cls, index) => {
                const code = encodeSchedule(cls.days, cls.time);
                const avatarColor = getAvatarColor(cls.faculty);
                return (
                  <tr key={cls.id} className={`transition-colors duration-150 border-b last:border-b-0 ${getRowBg(cls, index)} ${isDarkMode ? 'border-slate-700/50' : 'border-stone-100'}`}>
                    {isStudentMode && (
                      <td className="px-5 py-3">
                        <button onClick={() => toggleFavorite(cls.id)}
                          className={`p-2 rounded-lg transition-all ${favorites.includes(cls.id) ? 'scale-110' : isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-stone-200'}`}>
                          <Star className={`w-5 h-5 ${favorites.includes(cls.id) ? 'fill-amber-400 text-amber-400' : isDarkMode ? 'text-slate-500' : 'text-stone-300'}`} strokeWidth={1.75} />
                        </button>
                      </td>
                    )}
                    {!isStudentMode && (
                      <td className={`px-5 py-3 text-xs font-mono ${isDarkMode ? 'text-slate-500' : 'text-stone-400'}`}>{cls.id}</td>
                    )}
                    <td className={`px-5 py-3 font-bold ${isDarkMode ? 'text-white' : 'text-stone-900'}`}>{cls.courseCode}</td>
                    <td className="px-5 py-3 font-medium">{cls.section}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${isDarkMode ? avatarColor.text.replace('dark:', '') : avatarColor.text.split(' ')[0]} ${isDarkMode ? avatarColor.bg.replace('dark:', '') : avatarColor.bg.split(' ')[0]}`}>
                          {getInitials(cls.faculty)}
                        </div>
                        <span className="truncate max-w-[120px]">{cls.faculty}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-1 rounded-md text-xs font-medium ${isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-stone-100 text-stone-700'}`}>{cls.room}</span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex flex-col">
                        <span className="font-medium">{cls.days}</span>
                        <span className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-stone-500'}`}>{cls.time}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <button
                        onClick={() => copyToClipboard(code, cls.id)}
                        className={`group flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-mono font-bold text-sm transition-all
                          ${copiedCode === cls.id
                            ? isDarkMode ? 'bg-emerald-500/20 text-emerald-300' : 'bg-emerald-100 text-emerald-700'
                            : isDarkMode ? 'bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                        title="Click to copy"
                      >
                        {code}
                        {copiedCode === cls.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />}
                      </button>
                    </td>
                    <td className="px-5 py-3">{getStatusBadge(cls.enrolled, cls.maxCapacity)}</td>
                    <td className="px-5 py-3">
                      {!isStudentMode && (
                        <div className="flex items-center gap-1">
                          <button onClick={() => openModal(cls)}
                            className={`p-2 rounded-lg transition-all ${isDarkMode ? 'hover:bg-slate-600 text-slate-400 hover:text-blue-400' : 'hover:bg-blue-50 text-stone-400 hover:text-blue-600'}`}
                            title="Edit">
                            <Edit2 className="w-4 h-4" strokeWidth={1.75} />
                          </button>
                          <button onClick={() => handleDelete(cls.id, cls.courseCode)}
                            className={`p-2 rounded-lg transition-all ${isDarkMode ? 'hover:bg-slate-600 text-slate-400 hover:text-red-400' : 'hover:bg-red-50 text-stone-400 hover:text-red-600'}`}
                            title="Delete">
                            <Trash2 className="w-4 h-4" strokeWidth={1.75} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ScheduleView;