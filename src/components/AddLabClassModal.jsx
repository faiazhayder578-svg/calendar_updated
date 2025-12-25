import React, { useState, useEffect } from 'react';
import { X, AlertCircle, FlaskConical } from 'lucide-react';
import { checkInstructorAvailability, getClasses } from '../api';
import RoomSelector from './RoomSelector';

const AddLabClassModal = ({ isOpen, closeModal, theoryCourse, handleAddClass, isDarkMode }) => {
  const [formData, setFormData] = useState({
    courseCode: '',
    section: '01',
    faculty: '',
    days: 'S',
    time: '08:00 AM - 11:10 AM',
    room: 'LIB601',
    maxCapacity: 35
  });

  const [availabilityStatus, setAvailabilityStatus] = useState(null);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [existingClasses, setExistingClasses] = useState([]);

  // Fetch existing classes for room availability
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const classes = await getClasses();
        setExistingClasses(classes);
      } catch (error) {
        console.error('Error fetching classes:', error);
      }
    };
    if (isOpen) {
      fetchClasses();
    }
  }, [isOpen]);

  // Lab time slots (3-hour slots + standard slots)
  const labTimeSlots = [
    // 3-hour lab slots
    '08:00 AM - 11:10 AM',
    '09:40 AM - 12:50 PM',
    '11:20 AM - 02:30 PM',
    '12:50 PM - 04:10 PM',
    '02:40 PM - 05:50 PM',
    // Standard time slots
    '08:00 AM - 09:30 AM',
    '09:40 AM - 11:10 AM',
    '11:20 AM - 12:50 PM',
    '01:00 PM - 02:30 PM',
    '02:40 PM - 04:10 PM',
    '04:20 PM - 05:50 PM'
  ];

  // Day options for labs (single days + 2-day combinations)
  const labDays = [
    // Single-day options
    { value: 'S', label: 'Sunday' },
    { value: 'M', label: 'Monday' },
    { value: 'T', label: 'Tuesday' },
    { value: 'W', label: 'Wednesday' },
    { value: 'R', label: 'Thursday' },
    { value: 'A', label: 'Saturday' },
    // 2-day combinations
    { value: 'ST', label: 'Sunday-Tuesday' },
    { value: 'MW', label: 'Monday-Wednesday' },
    { value: 'RA', label: 'Thursday-Saturday' }
  ];

  useEffect(() => {
    if (isOpen && theoryCourse) {
      // Generate lab course code by appending 'L'
      const labCourseCode = theoryCourse.courseCode.endsWith('L') 
        ? theoryCourse.courseCode 
        : `${theoryCourse.courseCode}L`;
      
      // Section is locked to match theory class section
      setFormData({
        courseCode: labCourseCode,
        section: theoryCourse.section || '01',
        faculty: theoryCourse.faculty || '',
        days: 'S',
        time: '08:00 AM - 11:10 AM',
        room: 'LIB601',
        maxCapacity: theoryCourse.maxCapacity || 35
      });
    }
    setAvailabilityStatus(null);
  }, [isOpen, theoryCourse]);

  // Check instructor availability
  useEffect(() => {
    const checkAvailability = async () => {
      if (!formData.faculty || !formData.days || !formData.time) {
        setAvailabilityStatus(null);
        return;
      }

      setCheckingAvailability(true);
      try {
        const result = await checkInstructorAvailability(
          formData.faculty,
          formData.days,
          formData.time,
          null
        );
        setAvailabilityStatus(result);
      } catch (error) {
        console.error('Error checking availability:', error);
        setAvailabilityStatus(null);
      } finally {
        setCheckingAvailability(false);
      }
    };

    const timeoutId = setTimeout(checkAvailability, 500);
    return () => clearTimeout(timeoutId);
  }, [formData.faculty, formData.days, formData.time]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = handleAddClass(formData);
    if (success) {
      closeModal();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity"
        onClick={closeModal}
      />
      <div className={`relative w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden transform transition-all scale-100 ${
        isDarkMode ? 'bg-slate-800 shadow-slate-900' : 'bg-white shadow-slate-300'
      }`}>
        <div className={`px-6 py-4 border-b flex justify-between items-center ${
          isDarkMode ? 'border-slate-700 bg-gradient-to-r from-purple-900/30 to-blue-900/30' : 'border-slate-100 bg-gradient-to-r from-purple-50 to-blue-50'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-purple-900/50' : 'bg-purple-100'}`}>
              <FlaskConical className={`w-5 h-5 ${isDarkMode ? 'text-purple-300' : 'text-purple-600'}`} />
            </div>
            <div>
              <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                Add Lab Class
              </h3>
              <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                Linked to: {theoryCourse?.courseCode || 'Theory Course'}
              </p>
            </div>
          </div>
          <button
            onClick={closeModal}
            className={`transition-colors ${isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-400 hover:text-slate-900'}`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className={`text-xs font-semibold uppercase tracking-wide ${
                isDarkMode ? 'text-slate-400' : 'text-slate-500'
              }`}>
                Lab Course Code
              </label>
              <input
                type="text"
                name="courseCode"
                value={formData.courseCode}
                onChange={handleInputChange}
                required
                placeholder="e.g. CSE115L"
                className={`w-full px-3 py-2 border rounded-md focus:ring-1 focus:ring-purple-500 focus:outline-none transition-all ${
                  isDarkMode
                    ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-purple-500'
                    : 'border-slate-200 focus:border-purple-500'
                }`}
              />
            </div>
            <div className="space-y-1.5">
              <label className={`text-xs font-semibold uppercase tracking-wide ${
                isDarkMode ? 'text-slate-400' : 'text-slate-500'
              }`}>
                Section (Inherited)
              </label>
              <input
                type="text"
                name="section"
                value={formData.section}
                readOnly
                className={`w-full px-3 py-2 border rounded-md cursor-not-allowed ${
                  isDarkMode
                    ? 'bg-slate-700/50 border-slate-600 text-slate-400'
                    : 'bg-slate-100 border-slate-200 text-slate-600'
                }`}
              />
              <p className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>
                Same as theory class section
              </p>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className={`text-xs font-semibold uppercase tracking-wide ${
              isDarkMode ? 'text-slate-400' : 'text-slate-500'
            }`}>
              Lab Instructor
            </label>
            <input
              type="text"
              name="faculty"
              value={formData.faculty}
              onChange={handleInputChange}
              required
              placeholder="e.g. Dr. Rezwanul Huq"
              className={`w-full px-3 py-2 border rounded-md focus:ring-1 focus:ring-purple-500 focus:outline-none transition-all ${
                isDarkMode
                  ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-purple-500'
                  : 'border-slate-200 focus:border-purple-500'
              }`}
            />
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className={`text-xs font-semibold uppercase tracking-wide ${
                isDarkMode ? 'text-slate-400' : 'text-slate-500'
              }`}>
                Day
              </label>
              <select
                name="days"
                value={formData.days}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:ring-1 focus:ring-purple-500 focus:outline-none transition-all ${
                  isDarkMode
                    ? 'bg-slate-700 border-slate-600 text-white focus:border-purple-500'
                    : 'bg-white border-slate-200 focus:border-purple-500'
                }`}
              >
                {labDays.map(day => (
                  <option key={day.value} value={day.value}>{day.label}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className={`text-xs font-semibold uppercase tracking-wide ${
                isDarkMode ? 'text-slate-400' : 'text-slate-500'
              }`}>
                Lab Time Slot
              </label>
              <select
                name="time"
                value={formData.time}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:ring-1 focus:ring-purple-500 focus:outline-none transition-all ${
                  isDarkMode
                    ? 'bg-slate-700 border-slate-600 text-white focus:border-purple-500'
                    : 'bg-white border-slate-200 focus:border-purple-500'
                }`}
              >
                {labTimeSlots.map(slot => (
                  <option key={slot} value={slot}>{slot}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Instructor Availability Status */}
          {formData.faculty && (
            <div className="mt-2">
              {checkingAvailability ? (
                <div className={`flex items-center gap-2 p-3 rounded-lg ${
                  isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'
                }`}>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                  <span className="text-sm">Checking instructor availability...</span>
                </div>
              ) : availabilityStatus && !availabilityStatus.available ? (
                <div className="flex items-start gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Instructor Not Available</p>
                    <p className="text-xs mt-1">{availabilityStatus.message}</p>
                  </div>
                </div>
              ) : availabilityStatus && availabilityStatus.available ? (
                <div className={`flex items-center gap-2 p-3 rounded-lg ${
                  isDarkMode ? 'bg-green-900/20 border border-green-500/20 text-green-400' : 'bg-green-50 border border-green-200 text-green-700'
                }`}>
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-sm">Instructor is available for this lab slot</span>
                </div>
              ) : null}
            </div>
          )}

          <div className="grid grid-cols-2 gap-5">
            <RoomSelector
              selectedRoom={formData.room}
              onSelectRoom={(room) => setFormData(prev => ({ ...prev, room }))}
              selectedDays={formData.days}
              selectedTime={formData.time}
              isDarkMode={isDarkMode}
              existingClasses={existingClasses}
              editingClassId={null}
              isLabClass={true}
            />
            <div className="space-y-1.5">
              <label className={`text-xs font-semibold uppercase tracking-wide ${
                isDarkMode ? 'text-slate-400' : 'text-slate-500'
              }`}>
                Max Capacity
              </label>
              <input
                type="number"
                name="maxCapacity"
                value={formData.maxCapacity}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:ring-1 focus:ring-purple-500 focus:outline-none transition-all ${
                  isDarkMode
                    ? 'bg-slate-700 border-slate-600 text-white focus:border-purple-500'
                    : 'border-slate-200 focus:border-purple-500'
                }`}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={availabilityStatus && !availabilityStatus.available}
            className={`w-full font-bold py-3 rounded-md transition-all shadow-md mt-2 ${
              availabilityStatus && !availabilityStatus.available
                ? 'bg-slate-400 cursor-not-allowed text-slate-200'
                : isDarkMode
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white'
                : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white'
            }`}
          >
            Create Lab Class
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddLabClassModal;
