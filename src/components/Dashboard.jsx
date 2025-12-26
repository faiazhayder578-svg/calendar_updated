import React from 'react';
import { BookOpen, Users, TrendingUp, Armchair } from 'lucide-react';

const Dashboard = ({ classes, reviews = {}, isDarkMode }) => {
  const getDashboardStats = () => {
    const totalClasses = classes.length;
    const totalEnrolled = classes.reduce((sum, cls) => sum + cls.enrolled, 0);
    const totalCapacity = classes.reduce((sum, cls) => sum + cls.maxCapacity, 0);
    const utilizationRate = totalCapacity > 0 ? ((totalEnrolled / totalCapacity) * 100).toFixed(1) : 0;

    // Calculate total reviews
    const allReviews = Object.values(reviews).flat();
    const totalReviews = allReviews.length;

    return {
      totalClasses,
      totalEnrolled,
      totalCapacity,
      utilizationRate,
      totalReviews,
      availableSeats: totalCapacity - totalEnrolled
    };
  };

  const getRecentReviews = () => {
    const allReviews = [];
    Object.entries(reviews).forEach(([classId, classReviews]) => {
      const cls = classes.find(c => c.id.toString() === classId.toString());
      if (cls && classReviews) {
        classReviews.forEach(rev => {
          allReviews.push({ ...rev, courseCode: cls.courseCode, faculty: cls.faculty });
        });
      }
    });

    return allReviews
      .sort((a, b) => b.id - a.id) // Sort by timestamp ID descending
      .slice(0, 5);
  };

  const getPopularCourses = () => {
    return [...classes]
      .sort((a, b) => b.enrolled - a.enrolled)
      .slice(0, 5);
  };

  const getTimeSlotDistribution = () => {
    const distribution = {};
    classes.forEach(cls => {
      distribution[cls.time] = (distribution[cls.time] || 0) + 1;
    });
    return distribution;
  };

  const stats = getDashboardStats();

  return (
    <div className="space-y-6 pb-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Classes Card */}
        <div className={`group rounded-xl border p-6 transition-all duration-200 cursor-default
          shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-lg)] hover:-translate-y-0.5
          ${isDarkMode
            ? 'bg-slate-800 border-slate-700 hover:border-slate-600'
            : 'bg-white border-slate-200 hover:border-slate-300'
          }`}>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className={`text-xs font-semibold uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-500'
                }`}>
                Total Classes
              </p>
              <p className={`text-3xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'
                }`}>
                {stats.totalClasses}
              </p>
              <p className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                Active courses
              </p>
            </div>
            <div className={`p-3.5 rounded-xl transition-all duration-200 group-hover:scale-110
              ${isDarkMode ? 'bg-blue-500/20' : 'bg-blue-50'}`}>
              <BookOpen className={`w-6 h-6 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} strokeWidth={1.75} />
            </div>
          </div>
        </div>

        {/* Total Students Card */}
        <div className={`group rounded-xl border p-6 transition-all duration-200 cursor-default
          shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-lg)] hover:-translate-y-0.5
          ${isDarkMode
            ? 'bg-slate-800 border-slate-700 hover:border-slate-600'
            : 'bg-white border-slate-200 hover:border-slate-300'
          }`}>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className={`text-xs font-semibold uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-500'
                }`}>
                Total Students
              </p>
              <p className={`text-3xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'
                }`}>
                {stats.totalEnrolled}
              </p>
              <p className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                Currently enrolled
              </p>
            </div>
            <div className={`p-3.5 rounded-xl transition-all duration-200 group-hover:scale-110
              ${isDarkMode ? 'bg-emerald-500/20' : 'bg-emerald-50'}`}>
              <Users className={`w-6 h-6 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`} strokeWidth={1.75} />
            </div>
          </div>
        </div>

        {/* Utilization Rate Card */}
        <div className={`group rounded-xl border p-6 transition-all duration-200 cursor-default
          shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-lg)] hover:-translate-y-0.5
          ${isDarkMode
            ? 'bg-slate-800 border-slate-700 hover:border-slate-600'
            : 'bg-white border-slate-200 hover:border-slate-300'
          }`}>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className={`text-xs font-semibold uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-500'
                }`}>
                Utilization Rate
              </p>
              <p className={`text-3xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'
                }`}>
                {stats.utilizationRate}%
              </p>
              <p className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                Capacity filled
              </p>
            </div>
            <div className={`p-3.5 rounded-xl transition-all duration-200 group-hover:scale-110
              ${isDarkMode ? 'bg-amber-500/20' : 'bg-amber-50'}`}>
              <TrendingUp className={`w-6 h-6 ${isDarkMode ? 'text-amber-400' : 'text-amber-600'}`} strokeWidth={1.75} />
            </div>
          </div>
        </div>

        {/* Available Seats Card */}
        <div className={`group rounded-xl border p-6 transition-all duration-200 cursor-default
          shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-lg)] hover:-translate-y-0.5
          ${isDarkMode
            ? 'bg-slate-800 border-slate-700 hover:border-slate-600'
            : 'bg-white border-slate-200 hover:border-slate-300'
          }`}>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className={`text-xs font-semibold uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-500'
                }`}>
                Available Seats
              </p>
              <p className={`text-3xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'
                }`}>
                {stats.availableSeats}
              </p>
              <p className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                Open spots
              </p>
            </div>
            <div className={`p-3.5 rounded-xl transition-all duration-200 group-hover:scale-110
              ${isDarkMode ? 'bg-purple-500/20' : 'bg-purple-50'}`}>
              <Armchair className={`w-6 h-6 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} strokeWidth={1.75} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Popular Courses */}
        <div className={`rounded-xl border overflow-hidden transition-all duration-200
          shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)]
          ${isDarkMode
            ? 'bg-slate-800 border-slate-700'
            : 'bg-white border-slate-200'
          }`}>
          <div className={`px-6 py-4 border-b flex justify-between items-center ${isDarkMode ? 'border-slate-700 bg-slate-800/50' : 'border-slate-100 bg-slate-50/50'
            }`}>
            <h3 className={`text-sm font-semibold uppercase tracking-wider ${isDarkMode ? 'text-slate-300' : 'text-slate-700'
              }`}>
              Most Popular Courses
            </h3>
            <TrendingUp className={`w-4 h-4 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} strokeWidth={1.75} />
          </div>
          <div className="p-6">
            {getPopularCourses().length === 0 ? (
              <p className={`text-center py-8 text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'
                }`}>
                No courses available
              </p>
            ) : (
              <div className="space-y-4">
                {getPopularCourses().map((cls, index) => (
                  <div key={cls.id} className={`flex items-center gap-4 p-3 rounded-lg transition-colors duration-150
                    ${isDarkMode ? 'hover:bg-slate-700/50' : 'hover:bg-slate-50'}`}>
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shrink-0
                      ${index === 0 
                        ? isDarkMode ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-100 text-amber-600' 
                        : index === 1 
                          ? isDarkMode ? 'bg-slate-600 text-slate-300' : 'bg-slate-200 text-slate-600'
                          : index === 2 
                            ? isDarkMode ? 'bg-orange-500/20 text-orange-400' : 'bg-orange-100 text-orange-600'
                            : isDarkMode ? 'bg-slate-700 text-slate-400' : 'bg-slate-100 text-slate-500'
                      }`}>
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-semibold text-sm truncate ${isDarkMode ? 'text-white' : 'text-slate-900'
                        }`}>
                        {cls.courseCode} - {cls.section}
                      </p>
                      <p className={`text-xs truncate ${isDarkMode ? 'text-slate-400' : 'text-slate-500'
                        }`}>
                        {cls.faculty}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className={`font-bold text-sm tabular-nums ${isDarkMode ? 'text-white' : 'text-slate-900'
                        }`}>
                        {cls.enrolled}/{cls.maxCapacity}
                      </p>
                      <div className={`w-20 h-1.5 rounded-full mt-1.5 overflow-hidden ${isDarkMode ? 'bg-slate-700' : 'bg-slate-200'}`}>
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            (cls.enrolled / cls.maxCapacity) >= 1 
                              ? 'bg-red-500' 
                              : (cls.enrolled / cls.maxCapacity) >= 0.8 
                                ? 'bg-amber-500' 
                                : 'bg-emerald-500'
                          }`}
                          style={{ width: `${Math.min((cls.enrolled / cls.maxCapacity) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
