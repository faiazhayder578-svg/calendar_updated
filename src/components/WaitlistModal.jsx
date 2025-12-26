import React, { useState } from 'react';
import { X, Users, Clock, CheckCircle } from 'lucide-react';

const WaitlistModal = ({ isOpen, closeModal, selectedClass, waitlist, joinWaitlist, isDarkMode }) => {
  const [studentName, setStudentName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [studentId, setStudentId] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const studentInfo = {
      id: Date.now(),
      name: studentName,
      email: studentEmail,
      studentId: studentId,
      joinedAt: new Date().toISOString(),
      position: waitlist.length + 1
    };
    
    joinWaitlist(selectedClass.id, studentInfo);
    setStudentName('');
    setStudentEmail('');
    setStudentId('');
    closeModal();
  };

  if (!isOpen || !selectedClass) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Enhanced backdrop with blur effect */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-backdrop-enter"
        onClick={closeModal}
      />
      {/* Modal container with animation */}
      <div className={`relative w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-modal-enter ${
          isDarkMode ? 'bg-slate-800 shadow-slate-900/50' : 'bg-white shadow-slate-200'
        }`}>
        {/* Header with clear title and close button */}
        <div className={`px-6 py-4 border-b flex justify-between items-center ${
          isDarkMode ? 'border-slate-700 bg-gradient-to-r from-orange-900/30 to-red-900/30' : 'border-slate-100 bg-gradient-to-r from-orange-50 to-red-50'
        }`}>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-orange-600 to-red-600 rounded-lg">
              <Users className="w-5 h-5 text-white" strokeWidth={1.75} />
            </div>
            <div>
              <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                Class Waitlist
              </h3>
              <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                {selectedClass.courseCode} - {selectedClass.section}
              </p>
            </div>
          </div>
          <button 
            onClick={closeModal}
            className={`p-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              isDarkMode 
                ? 'text-slate-400 hover:text-white hover:bg-slate-700/50 focus:ring-orange-500' 
                : 'text-slate-400 hover:text-slate-900 hover:bg-slate-100 focus:ring-orange-400'
            }`}
          >
            <X className="w-5 h-5" strokeWidth={1.75} />
          </button>
        </div>

        <div className="px-6 py-5 max-h-[60vh] overflow-y-auto">
          {/* Class Full Notice */}
          <div className={`p-4 rounded-xl mb-6 ${
              isDarkMode ? 'bg-red-900/20 border border-red-800' : 'bg-red-50 border border-red-200'
            }`}>
            <div className="flex items-center gap-2.5 mb-2">
              <Clock className={`w-5 h-5 ${isDarkMode ? 'text-red-400' : 'text-red-600'}`} strokeWidth={1.75} />
              <span className={`font-semibold ${isDarkMode ? 'text-red-300' : 'text-red-700'}`}>
                Class is Full
              </span>
            </div>
            <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-red-400' : 'text-red-700'}`}>
              This class has reached maximum capacity ({selectedClass.enrolled}/{selectedClass.maxCapacity}). 
              Join the waitlist to be notified when a spot opens up.
            </p>
          </div>

          {/* Current Waitlist */}
          {waitlist.length > 0 && (
            <div className="mb-6">
              <h4 className={`font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                Current Waitlist ({waitlist.length} student{waitlist.length !== 1 ? 's' : ''})
              </h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {waitlist.map((student, index) => (
                  <div
                    key={student.id}
                    className={`p-3.5 rounded-xl flex items-center gap-3 border transition-all duration-200 hover:shadow-sm ${
                      isDarkMode ? 'bg-slate-700/30 border-slate-700' : 'bg-slate-50 border-slate-100'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      index === 0
                        ? 'bg-amber-100 text-amber-600'
                        : isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {student.position}
                    </div>
                    <div className="flex-1">
                      <div className={`font-medium text-sm ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                        {student.name}
                      </div>
                      <div className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        ID: {student.studentId}
                      </div>
                    </div>
                    <div className={`text-xs font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      {new Date(student.joinedAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Join Waitlist Form */}
          <form onSubmit={handleSubmit} className={`p-6 rounded-xl ${
              isDarkMode ? 'bg-slate-700/30 border border-slate-600' : 'bg-blue-50 border border-blue-200'
            }`}>
            <h4 className={`font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Join Waitlist
            </h4>

            <div className="space-y-4">
              <div>
                <label className={`text-xs font-semibold uppercase tracking-wide block mb-2 ${
                    isDarkMode ? 'text-slate-400' : 'text-slate-500'
                  }`}>
                  Your Name *
                </label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  required
                  placeholder="John Doe"
                  className={`w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 ${
                    isDarkMode 
                      ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' 
                      : 'bg-white border-slate-200 placeholder-slate-400'
                  }`}
                />
              </div>

              <div>
                <label className={`text-xs font-semibold uppercase tracking-wide block mb-2 ${
                    isDarkMode ? 'text-slate-400' : 'text-slate-500'
                  }`}>
                  Email Address *
                </label>
                <input
                  type="email"
                  value={studentEmail}
                  onChange={(e) => setStudentEmail(e.target.value)}
                  required
                  placeholder="john.doe@university.edu"
                  className={`w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 ${
                    isDarkMode 
                      ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' 
                      : 'bg-white border-slate-200 placeholder-slate-400'
                  }`}
                />
              </div>

              <div>
                <label className={`text-xs font-semibold uppercase tracking-wide block mb-2 ${
                    isDarkMode ? 'text-slate-400' : 'text-slate-500'
                  }`}>
                  Student ID *
                </label>
                <input
                  type="text"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  required
                  placeholder="2021-1234567"
                  className={`w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 ${
                    isDarkMode 
                      ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' 
                      : 'bg-white border-slate-200 placeholder-slate-400'
                  }`}
                />
              </div>
            </div>

            <div className={`mt-4 p-3.5 rounded-xl flex items-start gap-2.5 ${
                isDarkMode ? 'bg-blue-900/20' : 'bg-blue-100/50'
              }`}>
              <CheckCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                  isDarkMode ? 'text-blue-400' : 'text-blue-600'
                }`} strokeWidth={1.75} />
              <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                You'll receive an email notification when a spot becomes available. 
                Your position: <strong>#{waitlist.length + 1}</strong>
              </p>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={closeModal}
                className={`flex-1 py-3 rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-[0.98] ${
                  isDarkMode
                    ? 'bg-slate-700 hover:bg-slate-600 text-white focus:ring-slate-500'
                    : 'bg-slate-200 hover:bg-slate-300 text-slate-900 focus:ring-slate-400'
                }`}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-3 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white rounded-xl font-semibold inline-flex items-center justify-center gap-2 transition-all duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 active:scale-[0.98]"
              >
                <Users className="w-4 h-4" strokeWidth={1.75} />
                Join Waitlist
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default WaitlistModal;
