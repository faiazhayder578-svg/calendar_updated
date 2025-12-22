import React from 'react';
import { BookOpen, Users, TrendingUp, Clock } from 'lucide-react';

const Dashboard = ({ classes, isDarkMode }) => {
  const getDashboardStats = () => {
    const totalClasses = classes.length;
    const totalEnrolled = classes.reduce((sum, cls) => sum + cls.enrolled, 0);
    const totalCapacity = classes.reduce((sum, cls) => sum + cls.maxCapacity, 0);
    const utilizationRate = totalCapacity > 0 ? ((totalEnrolled / totalCapacity) * 100).toFixed(1) : 0;
    
    return {
      totalClasses,
      totalEnrolled,
      totalCapacity,
      utilizationRate,
      availableSeats: totalCapacity - totalEnrolled
    };
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
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className={`rounded-xl shadow-sm border p-6 ${
          isDarkMode 
            ? 'bg-slate-800 border-slate-700' 
            : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${
                isDarkMode ? 'text-slate-400' : 'text-slate-500'
              }`}>
                Total Classes
              </p>
              <p className={`text-3xl font-bold mt-2 ${
                isDarkMode ? 'text-white' : 'text-slate-900'
              }`}>
                {stats.totalClasses}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className={`rounded-xl shadow-sm border p-6 ${
          isDarkMode 
            ? 'bg-slate-800 border-slate-700' 
            : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${
                isDarkMode ? 'text-slate-400' : 'text-slate-500'
              }`}>
                Total Students
              </p>
              <p className={`text-3xl font-bold mt-2 ${
                isDarkMode ? 'text-white' : 'text-slate-900'
              }`}>
                {stats.totalEnrolled}
              </p>
            </div>
            <div className="p-3 bg-emerald-100 rounded-lg">
              <Users className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
        </div>

        <div className={`rounded-xl shadow-sm border p-6 ${
          isDarkMode 
            ? 'bg-slate-800 border-slate-700' 
            : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${
                isDarkMode ? 'text-slate-400' : 'text-slate-500'
              }`}>
                Utilization Rate
              </p>
              <p className={`text-3xl font-bold mt-2 ${
                isDarkMode ? 'text-white' : 'text-slate-900'
              }`}>
                {stats.utilizationRate}%
              </p>
            </div>
            <div className="p-3 bg-amber-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </div>

        <div className={`rounded-xl shadow-sm border p-6 ${
          isDarkMode 
            ? 'bg-slate-800 border-slate-700' 
            : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${
                isDarkMode ? 'text-slate-400' : 'text-slate-500'
              }`}>
                Available Seats
              </p>
              <p className={`text-3xl font-bold mt-2 ${
                isDarkMode ? 'text-white' : 'text-slate-900'
              }`}>
                {stats.availableSeats}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Popular Courses */}
      <div className={`rounded-xl shadow-sm border overflow-hidden ${
        isDarkMode 
          ? 'bg-slate-800 border-slate-700' 
          : 'bg-white border-slate-200'
      }`}>
        <div className={`p-5 border-b ${
          isDarkMode ? 'border-slate-700' : 'border-slate-100'
        }`}>
          <h3 className={`text-base font-semibold ${
            isDarkMode ? 'text-white' : 'text-slate-800'
          }`}>
            Most Popular Courses
          </h3>
        </div>
        <div className="p-5">
          {getPopularCourses().length === 0 ? (
            <p className={`text-center py-8 ${
              isDarkMode ? 'text-slate-400' : 'text-slate-500'
            }`}>
              No courses available
            </p>
          ) : (
            <div className="space-y-4">
              {getPopularCourses().map((cls, index) => (
                <div key={cls.id} className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    index === 0 ? 'bg-amber-100 text-amber-600' :
                    index === 1 ? 'bg-slate-200 text-slate-600' :
                    index === 2 ? 'bg-orange-100 text-orange-600' :
                    isDarkMode ? 'bg-slate-700 text-slate-400' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className={`font-semibold ${
                      isDarkMode ? 'text-white' : 'text-slate-900'
                    }`}>
                      {cls.courseCode} - {cls.section}
                    </p>
                    <p className={`text-sm ${
                      isDarkMode ? 'text-slate-400' : 'text-slate-500'
                    }`}>
                      {cls.faculty}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${
                      isDarkMode ? 'text-white' : 'text-slate-900'
                    }`}>
                      {cls.enrolled}/{cls.maxCapacity}
                    </p>
                    <p className={`text-xs ${
                      isDarkMode ? 'text-slate-400' : 'text-slate-500'
                    }`}>
                      {((cls.enrolled / cls.maxCapacity) * 100).toFixed(0)}% filled
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Time Slot Distribution */}
      <div className={`rounded-xl shadow-sm border overflow-hidden ${
        isDarkMode 
          ? 'bg-slate-800 border-slate-700' 
          : 'bg-white border-slate-200'
      }`}>
        <div className={`p-5 border-b ${
          isDarkMode ? 'border-slate-700' : 'border-slate-100'
        }`}>
          <h3 className={`text-base font-semibold ${
            isDarkMode ? 'text-white' : 'text-slate-800'
          }`}>
            Time Slot Distribution
          </h3>
        </div>
        <div className="p-5">
          <div className="space-y-3">
            {Object.keys(getTimeSlotDistribution()).length === 0 ? (
              <p className={`text-center py-4 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                No time slot data available
              </p>
            ) : (
              Object.entries(getTimeSlotDistribution()).map(([time, count]) => (
                <div key={time}>
                  <div className="flex justify-between mb-1">
                    <span className={`text-sm ${
                      isDarkMode ? 'text-slate-300' : 'text-slate-700'
                    }`}>
                      {time}
                    </span>
                    <span className={`text-sm font-semibold ${
                      isDarkMode ? 'text-slate-300' : 'text-slate-700'
                    }`}>
                      {count} classes
                    </span>
                  </div>
                  <div className={`w-full h-2 rounded-full overflow-hidden ${
                    isDarkMode ? 'bg-slate-700' : 'bg-slate-100'
                  }`}>
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all"
                      style={{ width: `${(count / classes.length) * 100}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
