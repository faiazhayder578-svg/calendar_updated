import React from 'react';
import { BookOpen, Users, TrendingUp, Clock } from 'lucide-react';

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
  const recentReviews = getRecentReviews();

  return (
    <div className="space-y-6 pb-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className={`rounded-xl shadow-sm border p-6 transition-all hover:shadow-md ${isDarkMode
          ? 'bg-slate-800 border-slate-700'
          : 'bg-white border-slate-200'
          }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'
                }`}>
                Total Classes
              </p>
              <p className={`text-3xl font-bold mt-2 ${isDarkMode ? 'text-white' : 'text-slate-900'
                }`}>
                {stats.totalClasses}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className={`rounded-xl shadow-sm border p-6 transition-all hover:shadow-md ${isDarkMode
          ? 'bg-slate-800 border-slate-700'
          : 'bg-white border-slate-200'
          }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'
                }`}>
                Total Students
              </p>
              <p className={`text-3xl font-bold mt-2 ${isDarkMode ? 'text-white' : 'text-slate-900'
                }`}>
                {stats.totalEnrolled}
              </p>
            </div>
            <div className="p-3 bg-emerald-100 rounded-lg">
              <Users className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
        </div>

        <div className={`rounded-xl shadow-sm border p-6 transition-all hover:shadow-md ${isDarkMode
          ? 'bg-slate-800 border-slate-700'
          : 'bg-white border-slate-200'
          }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'
                }`}>
                Utilization Rate
              </p>
              <p className={`text-3xl font-bold mt-2 ${isDarkMode ? 'text-white' : 'text-slate-900'
                }`}>
                {stats.utilizationRate}%
              </p>
            </div>
            <div className="p-3 bg-amber-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </div>

        <div className={`rounded-xl shadow-sm border p-6 transition-all hover:shadow-md ${isDarkMode
          ? 'bg-slate-800 border-slate-700'
          : 'bg-white border-slate-200'
          }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'
                }`}>
                Total Reviews
              </p>
              <p className={`text-3xl font-bold mt-2 ${isDarkMode ? 'text-white' : 'text-slate-900'
                }`}>
                {stats.totalReviews}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <MessageSquare className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Popular Courses */}
        <div className={`rounded-xl shadow-sm border overflow-hidden ${isDarkMode
          ? 'bg-slate-800 border-slate-700'
          : 'bg-white border-slate-200'
          }`}>
          <div className={`p-5 border-b flex justify-between items-center ${isDarkMode ? 'border-slate-700 bg-slate-800/50' : 'border-slate-100 bg-slate-50/50'
            }`}>
            <h3 className={`text-base font-semibold ${isDarkMode ? 'text-white' : 'text-slate-800'
              }`}>
              Most Popular Courses
            </h3>
            <TrendingUp className="w-4 h-4 text-slate-400" />
          </div>
          <div className="p-5">
            {getPopularCourses().length === 0 ? (
              <p className={`text-center py-8 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'
                }`}>
                No courses available
              </p>
            ) : (
              <div className="space-y-4">
                {getPopularCourses().map((cls, index) => (
                  <div key={cls.id} className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${index === 0 ? 'bg-amber-100 text-amber-600' :
                      index === 1 ? 'bg-slate-200 text-slate-600' :
                        index === 2 ? 'bg-orange-100 text-orange-600' :
                          isDarkMode ? 'bg-slate-700 text-slate-400' : 'bg-slate-100 text-slate-500'
                      }`}>
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'
                        }`}>
                        {cls.courseCode} - {cls.section}
                      </p>
                      <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'
                        }`}>
                        {cls.faculty}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'
                        }`}>
                        {cls.enrolled}/{cls.maxCapacity}
                      </p>
                      <div className={`w-20 h-1 rounded-full mt-1 overflow-hidden ${isDarkMode ? 'bg-slate-700' : 'bg-slate-100'}`}>
                        <div
                          className="h-full bg-blue-500"
                          style={{ width: `${(cls.enrolled / cls.maxCapacity) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Latest Student Feedback */}
        <div className={`rounded-xl shadow-sm border overflow-hidden ${isDarkMode
          ? 'bg-slate-800 border-slate-700'
          : 'bg-white border-slate-200'
          }`}>
          <div className={`p-5 border-b flex justify-between items-center ${isDarkMode ? 'border-slate-700 bg-slate-800/50' : 'border-slate-100 bg-slate-50/50'
            }`}>
            <h3 className={`text-base font-semibold ${isDarkMode ? 'text-white' : 'text-slate-800'
              }`}>
              Latest Student Feedback
            </h3>
            <MessageSquare className="w-4 h-4 text-slate-400" />
          </div>
          <div className="p-5">
            {recentReviews.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <MessageSquare className="w-6 h-6 text-slate-400" />
                </div>
                <p className={`${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  No student reviews yet
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentReviews.map((rev) => (
                  <div key={rev.id} className={`p-3 rounded-lg border flex gap-3 transition-colors hover:border-amber-300 ${isDarkMode ? 'bg-slate-700/30 border-slate-600' : 'bg-slate-50 border-slate-100'
                    }`}>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <p className={`text-sm font-bold truncate ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                          {rev.courseCode}
                        </p>
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map(star => (
                            <TrendingUp key={star} className={`w-3 h-3 ${star <= rev.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-300'}`} />
                          ))}
                        </div>
                      </div>
                      <p className={`text-xs italic line-clamp-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                        "{rev.text}"
                      </p>
                      <p className={`text-[10px] mt-2 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                        — {rev.reviewer} • {rev.date}
                      </p>
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
