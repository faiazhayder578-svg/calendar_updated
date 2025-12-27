import { useState, useEffect } from 'react';
import { User, Clock, BookOpen } from 'lucide-react';

const InstructorAvailability = ({ isDarkMode }) => {
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch instructors from backend API
  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/instructor-preferences');
        if (response.ok) {
          const data = await response.json();
          setInstructors(data);
        } else {
          setError('Failed to load instructor data');
        }
      } catch (err) {
        console.error('Failed to fetch instructors:', err);
        setError('Failed to connect to server');
      } finally {
        setLoading(false);
      }
    };

    fetchInstructors();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-600"></div>
      </div>
    );
  }

  if (error) {
    return (
<<<<<<< HEAD
      <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-red-900/20 border-red-800 text-red-300' : 'bg-red-50 border-red-200 text-red-700'
        }`}>
=======
      <div className={`p-4 rounded-lg border ${
        isDarkMode ? 'bg-red-900/20 border-red-800 text-red-300' : 'bg-red-50 border-red-200 text-red-700'
      }`}>
>>>>>>> 9e987d0bc2b5e1ee9fd668c7dba32ea25ee440fe
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
          Instructor Availability
        </h2>
        <p className={`text-sm mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
          View instructor preferences for courses and time slots
        </p>
      </div>

      {/* Info Banner */}
<<<<<<< HEAD
      <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-teal-900/20 border-teal-800 text-teal-300' : 'bg-teal-50 border-teal-200 text-teal-700'
        }`}>
=======
      <div className={`p-4 rounded-lg border ${
        isDarkMode ? 'bg-blue-900/20 border-blue-800 text-blue-300' : 'bg-blue-50 border-blue-200 text-blue-700'
      }`}>
>>>>>>> 9e987d0bc2b5e1ee9fd668c7dba32ea25ee440fe
        <p className="text-sm">
          This data is managed by the system administrator. Contact the admin office to update instructor availability.
        </p>
      </div>

      {/* Instructors Table */}
<<<<<<< HEAD
      <div className={`rounded-xl shadow-sm border overflow-hidden ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
        }`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className={`text-xs uppercase font-semibold tracking-wider border-b ${isDarkMode
                ? 'bg-slate-700/50 text-slate-400 border-slate-700'
                : 'bg-slate-50 text-slate-500 border-slate-100'
              }`}>
=======
      <div className={`rounded-xl shadow-sm border overflow-hidden ${
        isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
      }`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className={`text-xs uppercase font-semibold tracking-wider border-b ${
              isDarkMode
                ? 'bg-slate-700/50 text-slate-400 border-slate-700'
                : 'bg-slate-50 text-slate-500 border-slate-100'
            }`}>
>>>>>>> 9e987d0bc2b5e1ee9fd668c7dba32ea25ee440fe
              <tr>
                <th className="px-6 py-4">Initials</th>
                <th className="px-6 py-4">Full Name</th>
                <th className="px-6 py-4">Preferable Courses</th>
                <th className="px-6 py-4">Preferable Time Slots</th>
              </tr>
            </thead>
<<<<<<< HEAD
            <tbody className={`divide-y text-sm ${isDarkMode ? 'divide-slate-700 text-slate-300' : 'divide-slate-50 text-slate-600'
              }`}>
              {instructors.length === 0 ? (
                <tr>
                  <td colSpan="4" className={`px-6 py-8 text-center ${isDarkMode ? 'text-slate-400' : 'text-slate-400'
                    }`}>
=======
            <tbody className={`divide-y text-sm ${
              isDarkMode ? 'divide-slate-700 text-slate-300' : 'divide-slate-50 text-slate-600'
            }`}>
              {instructors.length === 0 ? (
                <tr>
                  <td colSpan="4" className={`px-6 py-8 text-center ${
                    isDarkMode ? 'text-slate-400' : 'text-slate-400'
                  }`}>
>>>>>>> 9e987d0bc2b5e1ee9fd668c7dba32ea25ee440fe
                    No instructor data available.
                  </td>
                </tr>
              ) : (
                instructors.map((instructor) => (
                  <tr
                    key={instructor.id}
<<<<<<< HEAD
                    className={`transition-colors ${isDarkMode ? 'hover:bg-slate-700/50' : 'hover:bg-slate-50'
                      }`}
                  >
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center justify-center w-10 h-10 rounded-full font-bold text-sm ${isDarkMode ? 'bg-slate-700 text-white' : 'bg-slate-200 text-slate-700'
                        }`}>
                        {instructor.initials}
                      </span>
                    </td>
                    <td className={`px-6 py-4 font-medium ${isDarkMode ? 'text-white' : 'text-slate-800'
                      }`}>
=======
                    className={`transition-colors ${
                      isDarkMode ? 'hover:bg-slate-700/50' : 'hover:bg-slate-50'
                    }`}
                  >
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center justify-center w-10 h-10 rounded-full font-bold text-sm ${
                        isDarkMode ? 'bg-slate-700 text-white' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {instructor.initials}
                      </span>
                    </td>
                    <td className={`px-6 py-4 font-medium ${
                      isDarkMode ? 'text-white' : 'text-slate-800'
                    }`}>
>>>>>>> 9e987d0bc2b5e1ee9fd668c7dba32ea25ee440fe
                      {instructor.fullName}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {(instructor.preferableCourses || "").split(',').filter(c => c.trim()).map((course, idx) => (
                          <span
                            key={idx}
<<<<<<< HEAD
                            className={`px-2 py-1 rounded text-xs font-medium ${isDarkMode
                                ? 'bg-teal-900/30 text-teal-300'
                                : 'bg-teal-50 text-teal-700'
                              }`}
=======
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              isDarkMode
                                ? 'bg-blue-900/30 text-blue-300'
                                : 'bg-blue-50 text-blue-700'
                            }`}
>>>>>>> 9e987d0bc2b5e1ee9fd668c7dba32ea25ee440fe
                          >
                            {course.trim()}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {(instructor.preferableTimes || []).map((time, idx) => (
                          <span
                            key={idx}
<<<<<<< HEAD
                            className={`px-2 py-1 rounded text-xs font-mono font-medium ${isDarkMode
                                ? 'bg-emerald-900/30 text-emerald-300'
                                : 'bg-emerald-50 text-emerald-700'
                              }`}
=======
                            className={`px-2 py-1 rounded text-xs font-mono font-medium ${
                              isDarkMode
                                ? 'bg-emerald-900/30 text-emerald-300'
                                : 'bg-emerald-50 text-emerald-700'
                            }`}
>>>>>>> 9e987d0bc2b5e1ee9fd668c7dba32ea25ee440fe
                          >
                            {time}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Legend */}
<<<<<<< HEAD
      <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
        }`}>
=======
      <div className={`p-4 rounded-lg border ${
        isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
      }`}>
>>>>>>> 9e987d0bc2b5e1ee9fd668c7dba32ea25ee440fe
        <h4 className={`text-sm font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
          Time Slot Codes
        </h4>
        <div className="grid grid-cols-3 gap-4 text-xs">
          <div>
            <p className={`font-semibold mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>ST (Sun-Tue)</p>
            <div className={`space-y-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              <p>ST1 = 08:00 AM - 09:30 AM</p>
              <p>ST2 = 09:40 AM - 11:10 AM</p>
              <p>ST3 = 11:20 AM - 12:50 PM</p>
              <p>ST4 = 01:00 PM - 02:30 PM</p>
              <p>ST5 = 02:40 PM - 04:10 PM</p>
              <p>ST6 = 04:20 PM - 05:50 PM</p>
            </div>
          </div>
          <div>
            <p className={`font-semibold mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>MW (Mon-Wed)</p>
            <div className={`space-y-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              <p>MW1 = 08:00 AM - 09:30 AM</p>
              <p>MW2 = 09:40 AM - 11:10 AM</p>
              <p>MW3 = 11:20 AM - 12:50 PM</p>
              <p>MW4 = 01:00 PM - 02:30 PM</p>
              <p>MW5 = 02:40 PM - 04:10 PM</p>
              <p>MW6 = 04:20 PM - 05:50 PM</p>
            </div>
          </div>
          <div>
            <p className={`font-semibold mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>RA (Thu-Sat)</p>
            <div className={`space-y-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              <p>RA1 = 08:00 AM - 09:30 AM</p>
              <p>RA2 = 09:40 AM - 11:10 AM</p>
              <p>RA3 = 11:20 AM - 12:50 PM</p>
              <p>RA4 = 01:00 PM - 02:30 PM</p>
              <p>RA5 = 02:40 PM - 04:10 PM</p>
              <p>RA6 = 04:20 PM - 05:50 PM</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorAvailability;
