import React, { useState } from 'react';
import { X, Sparkles, Plus, XCircle, Loader, CheckCircle, ChevronRight } from 'lucide-react';

const AIScheduleModal = ({ isOpen, closeModal, isDarkMode, addNotification, applyGeneratedSchedule }) => {
  const [instructorAvailability, setInstructorAvailability] = useState([
    { id: 1, name: '', courseCode: '', preferredDays: [], availableTimes: [], roomPreference: '' }
  ]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedSchedules, setGeneratedSchedules] = useState([]);

  const availableDays = ['ST', 'MW', 'RA'];
  const availableTimes = [
    '08:00 AM - 09:30 AM',
    '09:40 AM - 11:10 AM',
    '11:20 AM - 12:50 PM',
    '01:00 PM - 02:30 PM',
    '02:40 PM - 04:10 PM'
  ];

  const addInstructorSlot = () => {
    setInstructorAvailability([
      ...instructorAvailability,
      {
        id: Date.now(),
        name: '',
        courseCode: '',
        preferredDays: [],
        availableTimes: [],
        roomPreference: ''
      }
    ]);
  };

  const removeInstructorSlot = (id) => {
    if (instructorAvailability.length > 1) {
      setInstructorAvailability(instructorAvailability.filter(slot => slot.id !== id));
    }
  };

  const updateInstructorSlot = (id, field, value) => {
    setInstructorAvailability(instructorAvailability.map(slot =>
      slot.id === id ? { ...slot, [field]: value } : slot
    ));
  };

  const toggleDaySelection = (id, day) => {
    setInstructorAvailability(instructorAvailability.map(slot => {
      if (slot.id === id) {
        const days = slot.preferredDays.includes(day)
          ? slot.preferredDays.filter(d => d !== day)
          : [...slot.preferredDays, day];
        return { ...slot, preferredDays: days };
      }
      return slot;
    }));
  };

  const toggleTimeSelection = (id, time) => {
    setInstructorAvailability(instructorAvailability.map(slot => {
      if (slot.id === id) {
        const times = slot.availableTimes.includes(time)
          ? slot.availableTimes.filter(t => t !== time)
          : [...slot.availableTimes, time];
        return { ...slot, availableTimes: times };
      }
      return slot;
    }));
  };

  const generateScheduleWithAI = async () => {
    // Validate input
    const invalidSlots = instructorAvailability.filter(
      slot => !slot.name || !slot.courseCode || slot.preferredDays.length === 0 || slot.availableTimes.length === 0
    );

    if (invalidSlots.length > 0) {
      addNotification('Please fill all instructor information including days and times', 'error');
      return;
    }

    setIsGenerating(true);

    try {
      console.log('Sending instructors to backend:', instructorAvailability);

      const response = await fetch("http://localhost:5000/api/generate-schedule", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          instructors: instructorAvailability
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate schedule');
      }

      if (data.schedules && data.schedules.length > 0) {
        setGeneratedSchedules(data.schedules);
        addNotification(`Generated ${data.schedules.length} schedule options!`, 'success');
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Generation Error:', error);
      addNotification(`Error: ${error.message}`, 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApplySchedule = (schedule) => {
    applyGeneratedSchedule(schedule.classes);
    handleClose();
  };

  const handleClose = () => {
    setGeneratedSchedules([]);
    setInstructorAvailability([
      { id: 1, name: '', courseCode: '', preferredDays: [], availableTimes: [], roomPreference: '' }
    ]);
    closeModal();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      />
      <div className="min-h-screen px-4 flex items-center justify-center">
        <div className={`relative w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden transform transition-all ${isDarkMode ? 'bg-slate-800 shadow-slate-900' : 'bg-white shadow-slate-300'
          }`}>
          <div className={`px-6 py-4 border-b flex justify-between items-center ${isDarkMode ? 'border-slate-700 bg-gradient-to-r from-purple-900/30 to-indigo-900/30' : 'border-slate-100 bg-gradient-to-r from-purple-50 to-indigo-50'
            }`}>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  AI Schedule Generator
                </h3>
                <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  Enter instructor availability and let the system create optimal schedules
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className={`transition-colors ${isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-400 hover:text-slate-900'
                }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 max-h-[70vh] overflow-y-auto">
            {generatedSchedules.length === 0 ? (
              // Input Form
              <div className="space-y-6">

                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-blue-900/20 border border-blue-800' : 'bg-blue-50 border border-blue-200'
                  }`}>
                  <p className={`text-sm ${isDarkMode ? 'text-blue-300' : 'text-blue-800'}`}>
                    💡 <strong>Tip:</strong> Provide instructor availability details for each course. The system will generate 3 optimized schedule options considering conflicts, room utilization, and preferences.
                  </p>
                </div>

                {instructorAvailability.map((slot, index) => (
                  <div key={slot.id} className={`p-5 rounded-xl border ${isDarkMode ? 'bg-slate-700/30 border-slate-600' : 'bg-slate-50 border-slate-200'
                    }`}>
                    <div className="flex justify-between items-center mb-4">
                      <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                        Instructor {index + 1}
                      </h4>
                      {instructorAvailability.length > 1 && (
                        <button
                          onClick={() => removeInstructorSlot(slot.id)}
                          className="text-red-500 hover:text-red-600 transition-colors"
                        >
                          <XCircle className="w-5 h-5" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="space-y-1.5">
                        <label className={`text-xs font-semibold uppercase ${isDarkMode ? 'text-slate-400' : 'text-slate-500'
                          }`}>
                          Instructor Name
                        </label>
                        <input
                          type="text"
                          value={slot.name}
                          onChange={(e) => updateInstructorSlot(slot.id, 'name', e.target.value)}
                          placeholder="e.g. Dr. John Smith"
                          className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all ${isDarkMode
                            ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400'
                            : 'bg-white border-slate-200'
                            }`}
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className={`text-xs font-semibold uppercase ${isDarkMode ? 'text-slate-400' : 'text-slate-500'
                          }`}>
                          Course Code
                        </label>
                        <input
                          type="text"
                          value={slot.courseCode}
                          onChange={(e) => updateInstructorSlot(slot.id, 'courseCode', e.target.value)}
                          placeholder="e.g. CSE327"
                          className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all ${isDarkMode
                            ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400'
                            : 'bg-white border-slate-200'
                            }`}
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="space-y-2">
                        <label className={`text-xs font-semibold uppercase ${isDarkMode ? 'text-slate-400' : 'text-slate-500'
                          }`}>
                          Preferred Days
                        </label>
                        <div className="flex gap-2">
                          {availableDays.map(day => (
                            <button
                              key={day}
                              type="button"
                              onClick={() => toggleDaySelection(slot.id, day)}
                              className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-all ${slot.preferredDays.includes(day)
                                ? 'bg-purple-600 text-white shadow-md'
                                : isDarkMode
                                  ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                                }`}
                            >
                              {day}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className={`text-xs font-semibold uppercase ${isDarkMode ? 'text-slate-400' : 'text-slate-500'
                          }`}>
                          Available Time Slots
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {availableTimes.map(time => (
                            <button
                              key={time}
                              type="button"
                              onClick={() => toggleTimeSelection(slot.id, time)}
                              className={`px-3 py-2 rounded-md text-xs font-medium transition-all ${slot.availableTimes.includes(time)
                                ? 'bg-indigo-600 text-white shadow-md'
                                : isDarkMode
                                  ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                                }`}
                            >
                              {time}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className={`text-xs font-semibold uppercase ${isDarkMode ? 'text-slate-400' : 'text-slate-500'
                          }`}>
                          Room Preference (Optional)
                        </label>
                        <select
                          value={slot.roomPreference}
                          onChange={(e) => updateInstructorSlot(slot.id, 'roomPreference', e.target.value)}
                          className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all ${isDarkMode
                            ? 'bg-slate-700 border-slate-600 text-white'
                            : 'bg-white border-slate-200'
                            }`}
                        >
                          <option value="">No Preference</option>
                          <option value="NAC501">NAC501</option>
                          <option value="NAC502">NAC502</option>
                          <option value="LIB603">LIB603</option>
                          <option value="ENG204">ENG204</option>
                          <option value="SCI305">SCI305</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  onClick={addInstructorSlot}
                  className={`w-full py-3 rounded-lg border-2 border-dashed font-medium transition-all ${isDarkMode
                    ? 'border-slate-600 text-slate-400 hover:border-slate-500 hover:text-slate-300 hover:bg-slate-700/30'
                    : 'border-slate-300 text-slate-500 hover:border-slate-400 hover:text-slate-700 hover:bg-slate-50'
                    }`}
                >
                  <Plus className="w-5 h-5 inline mr-2" />
                  Add Another Instructor
                </button>

                <div className="flex gap-3">
                  <button
                    onClick={handleClose}
                    className={`flex-1 py-3 rounded-lg font-medium transition-all ${isDarkMode
                      ? 'bg-slate-700 hover:bg-slate-600 text-white'
                      : 'bg-slate-200 hover:bg-slate-300 text-slate-900'
                      }`}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={generateScheduleWithAI}
                    disabled={isGenerating}
                    className={`flex-1 py-3 rounded-lg font-medium transition-all shadow-lg ${isGenerating
                      ? 'bg-slate-400 cursor-not-allowed text-white'
                      : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white'
                      }`}
                  >
                    {isGenerating ? (
                      <div className="flex items-center justify-center gap-2">
                        <Loader className="w-5 h-5 animate-spin" />
                        <span>Generating...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <Sparkles className="w-5 h-5" />
                        <span>Generate Schedules</span>
                      </div>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              // Generated Schedules Display
              <div className="space-y-6">
                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-emerald-900/20 border border-emerald-800' : 'bg-emerald-50 border border-emerald-200'
                  }`}>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                    <p className={`text-sm font-medium ${isDarkMode ? 'text-emerald-300' : 'text-emerald-800'}`}>
                      Successfully generated {generatedSchedules.length} optimized schedule options!
                    </p>
                  </div>
                </div>

                {generatedSchedules.map((schedule, idx) => (
                  <div key={idx} className={`p-5 rounded-xl border ${isDarkMode ? 'bg-slate-700/30 border-slate-600' : 'bg-slate-50 border-slate-200'
                    }`}>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                          Option {schedule.option}
                        </h4>
                        <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                          {schedule.classes.length} classes scheduled
                        </p>
                      </div>
                      <button
                        onClick={() => handleApplySchedule(schedule)}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white rounded-lg font-medium transition-all shadow-md"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>Apply This Schedule</span>
                      </button>
                    </div>

                    <div className="space-y-3">
                      {schedule.classes.map((cls, clsIdx) => (
                        <div key={clsIdx} className={`p-3 rounded-lg ${isDarkMode ? 'bg-slate-800/50' : 'bg-white'
                          }`}>
                          <div className="flex justify-between items-start">
                            <div>
                              <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                {cls.courseCode} - Section {cls.section}
                              </p>
                              <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                {cls.faculty}
                              </p>
                              <div className="flex gap-3 mt-2 text-xs">
                                <span className={`px-2 py-1 rounded ${isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-700'
                                  }`}>
                                  {cls.days}
                                </span>
                                <span className={`px-2 py-1 rounded ${isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-700'
                                  }`}>
                                  {cls.time}
                                </span>
                                <span className={`px-2 py-1 rounded ${isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-700'
                                  }`}>
                                  Room {cls.room}
                                </span>
                              </div>
                            </div>
                            {cls.rationale && (
                              <div className={`text-xs max-w-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                <ChevronRight className="w-3 h-3 inline" />
                                {cls.rationale}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                <button
                  onClick={handleClose}
                  className={`w-full py-3 rounded-lg font-medium transition-all ${isDarkMode
                    ? 'bg-slate-700 hover:bg-slate-600 text-white'
                    : 'bg-slate-200 hover:bg-slate-300 text-slate-900'
                    }`}
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIScheduleModal;
