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

  // Card configurations with gradient colors
  const statCards = [
    {
      label: 'Total Classes',
      value: stats.totalClasses,
      subtitle: 'Active courses',
      icon: BookOpen,
      gradient: 'from-indigo-500 to-indigo-600',
      shadowColor: 'shadow-indigo-500/20',
      bgLight: 'bg-indigo-50',
      bgDark: 'bg-indigo-500/20',
      textLight: 'text-indigo-600',
      textDark: 'text-indigo-400'
    },
    {
      label: 'Total Students',
      value: stats.totalEnrolled,
      subtitle: 'Currently enrolled',
      icon: Users,
      gradient: 'from-emerald-500 to-teal-600',
      shadowColor: 'shadow-emerald-500/20',
      bgLight: 'bg-emerald-50',
      bgDark: 'bg-emerald-500/20',
      textLight: 'text-emerald-600',
      textDark: 'text-emerald-400'
    },
    {
      label: 'Utilization Rate',
      value: `${stats.utilizationRate}%`,
      subtitle: 'Capacity filled',
      icon: TrendingUp,
      gradient: 'from-amber-500 to-orange-600',
      shadowColor: 'shadow-amber-500/20',
      bgLight: 'bg-amber-50',
      bgDark: 'bg-amber-500/20',
      textLight: 'text-amber-600',
      textDark: 'text-amber-400'
    },
    {
      label: 'Available Seats',
      value: stats.availableSeats,
      subtitle: 'Open spots',
      icon: Armchair,
      gradient: 'from-purple-500 to-pink-600',
      shadowColor: 'shadow-purple-500/20',
      bgLight: 'bg-purple-50',
      bgDark: 'bg-purple-500/20',
      textLight: 'text-purple-600',
      textDark: 'text-purple-400'
    }
  ];

  return (
    <div className="space-y-8 pb-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div 
              key={index}
              className={`group relative rounded-2xl p-6 transition-all duration-300 cursor-default overflow-hidden
                ${isDarkMode
                  ? 'bg-slate-800 border border-slate-700 hover:border-slate-600'
                  : 'bg-white border border-slate-200/50 hover:border-slate-300'
                }
                shadow-lg ${card.shadowColor} hover:shadow-xl hover:-translate-y-1`}
            >
              {/* Gradient Accent Line */}
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${card.gradient} opacity-80`}></div>
              
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className={`text-xs font-semibold uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    {card.label}
                  </p>
                  <p className={`text-3xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    {card.value}
                  </p>
                  <p className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                    {card.subtitle}
                  </p>
                </div>
                <div className={`p-3.5 rounded-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3
                  ${isDarkMode ? card.bgDark : card.bgLight}`}>
                  <Icon className={`w-6 h-6 ${isDarkMode ? card.textDark : card.textLight}`} strokeWidth={1.75} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Popular Courses */}
        <div className={`rounded-2xl overflow-hidden transition-all duration-300
          ${isDarkMode
            ? 'bg-slate-800 border border-slate-700'
            : 'bg-white border border-slate-200/50'
          }
          shadow-lg hover:shadow-xl`}>
          <div className={`px-6 py-4 border-b flex justify-between items-center ${isDarkMode ? 'border-slate-700 bg-slate-800/50' : 'border-slate-100 bg-slate-50/50'
            }`}>
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-amber-500/20' : 'bg-amber-50'}`}>
                <TrendingUp className={`w-4 h-4 ${isDarkMode ? 'text-amber-400' : 'text-amber-600'}`} strokeWidth={1.75} />
              </div>
              <h3 className={`text-sm font-semibold uppercase tracking-wider ${isDarkMode ? 'text-slate-300' : 'text-slate-700'
                }`}>
                Most Popular Courses
              </h3>
            </div>
          </div>
          <div className="p-6">
            {getPopularCourses().length === 0 ? (
              <p className={`text-center py-8 text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'
                }`}>
                No courses available
              </p>
            ) : (
              <div className="space-y-3">
                {getPopularCourses().map((cls, index) => (
                  <div key={cls.id} className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-200
                    ${isDarkMode ? 'hover:bg-slate-700/50' : 'hover:bg-slate-50'}`}>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 transition-transform duration-200 group-hover:scale-110
                      ${index === 0 
                        ? 'bg-gradient-to-br from-amber-400 to-amber-500 text-white shadow-lg shadow-amber-500/30' 
                        : index === 1 
                          ? 'bg-gradient-to-br from-slate-300 to-slate-400 text-white shadow-lg shadow-slate-400/30'
                          : index === 2 
                            ? 'bg-gradient-to-br from-orange-400 to-orange-500 text-white shadow-lg shadow-orange-500/30'
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
                      <div className={`w-24 h-2 rounded-full mt-2 overflow-hidden ${isDarkMode ? 'bg-slate-700' : 'bg-slate-200'}`}>
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            (cls.enrolled / cls.maxCapacity) >= 1 
                              ? 'bg-gradient-to-r from-red-500 to-rose-500' 
                              : (cls.enrolled / cls.maxCapacity) >= 0.8 
                                ? 'bg-gradient-to-r from-amber-500 to-orange-500' 
                                : 'bg-gradient-to-r from-emerald-500 to-teal-500'
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
