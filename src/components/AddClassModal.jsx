import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const AddClassModal = ({ isOpen, closeModal, editingClass, handleAddClass, isDarkMode }) => {
  const [formData, setFormData] = useState({
    courseCode: '',
    section: '01',
    faculty: '',
    days: 'ST',
    time: '08:00 AM - 09:30 AM',
    room: 'NAC501',
    maxCapacity: 35
  });

  useEffect(() => {
    if (editingClass) {
      setFormData(editingClass);
    } else {
      setFormData({
        courseCode: '',
        section: '01',
        faculty: '',
        days: 'ST',
        time: '08:00 AM - 09:30 AM',
        room: 'NAC501',
        maxCapacity: 35
      });
    }
  }, [editingClass, isOpen]);

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
    <div className="fixed inset-0 z-50">
      <div 
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity"
        onClick={closeModal}
      />
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden transform transition-all scale-100 ${
        isDarkMode ? 'bg-slate-800 shadow-slate-900' : 'bg-white shadow-slate-300'
      }`}>
        <div className={`px-6 py-4 border-b flex justify-between items-center ${
          isDarkMode ? 'border-slate-700' : 'border-slate-100'
        }`}>
          <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            {editingClass ? 'Edit Class' : 'Add New Class Manually'}
          </h3>
          <button 
            onClick={closeModal}
            className={`transition-colors ${
              isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-400 hover:text-slate-900'
            }`}
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
                Course Code
              </label>
              <input
                type="text"
                name="courseCode"
                value={formData.courseCode}
                onChange={handleInputChange}
                required
                placeholder="e.g. CSE327"
                className={`w-full px-3 py-2 border rounded-md focus:ring-1 focus:ring-slate-900 focus:outline-none transition-all ${
                  isDarkMode 
                    ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-slate-500' 
                    : 'border-slate-200 focus:border-slate-900'
                }`}
              />
            </div>
            <div className="space-y-1.5">
              <label className={`text-xs font-semibold uppercase tracking-wide ${
                isDarkMode ? 'text-slate-400' : 'text-slate-500'
              }`}>
                Section
              </label>
              <select
                name="section"
                value={formData.section}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:ring-1 focus:ring-slate-900 focus:outline-none transition-all ${
                  isDarkMode 
                    ? 'bg-slate-700 border-slate-600 text-white focus:border-slate-500' 
                    : 'bg-white border-slate-200 focus:border-slate-900'
                }`}
              >
                <option value="01">01</option>
                <option value="02">02</option>
                <option value="10">10</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className={`text-xs font-semibold uppercase tracking-wide ${
              isDarkMode ? 'text-slate-400' : 'text-slate-500'
            }`}>
              Faculty Name
            </label>
            <input
              type="text"
              name="faculty"
              value={formData.faculty}
              onChange={handleInputChange}
              required
              placeholder="e.g. Dr. Rezwanul Huq"
              className={`w-full px-3 py-2 border rounded-md focus:ring-1 focus:ring-slate-900 focus:outline-none transition-all ${
                isDarkMode 
                  ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-slate-500' 
                  : 'border-slate-200 focus:border-slate-900'
              }`}
            />
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className={`text-xs font-semibold uppercase tracking-wide ${
                isDarkMode ? 'text-slate-400' : 'text-slate-500'
              }`}>
                Days
              </label>
              <select
                name="days"
                value={formData.days}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:ring-1 focus:ring-slate-900 focus:outline-none transition-all ${
                  isDarkMode 
                    ? 'bg-slate-700 border-slate-600 text-white focus:border-slate-500' 
                    : 'bg-white border-slate-200 focus:border-slate-900'
                }`}
              >
                <option value="ST">ST (Sun-Tue)</option>
                <option value="MW">MW (Mon-Wed)</option>
                <option value="RA">RA (Thu-Sat)</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className={`text-xs font-semibold uppercase tracking-wide ${
                isDarkMode ? 'text-slate-400' : 'text-slate-500'
              }`}>
                Time
              </label>
              <select
                name="time"
                value={formData.time}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:ring-1 focus:ring-slate-900 focus:outline-none transition-all ${
                  isDarkMode 
                    ? 'bg-slate-700 border-slate-600 text-white focus:border-slate-500' 
                    : 'bg-white border-slate-200 focus:border-slate-900'
                }`}
              >
                <option value="08:00 AM - 09:30 AM">08:00 AM - 09:30 AM</option>
                <option value="09:40 AM - 11:10 AM">09:40 AM - 11:10 AM</option>
                <option value="11:20 AM - 12:50 PM">11:20 AM - 12:50 PM</option>
                <option value="01:00 PM - 02:30 PM">01:00 PM - 02:30 PM</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className={`text-xs font-semibold uppercase tracking-wide ${
                isDarkMode ? 'text-slate-400' : 'text-slate-500'
              }`}>
                Room
              </label>
              <select
                name="room"
                value={formData.room}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:ring-1 focus:ring-slate-900 focus:outline-none transition-all ${
                  isDarkMode 
                    ? 'bg-slate-700 border-slate-600 text-white focus:border-slate-500' 
                    : 'bg-white border-slate-200 focus:border-slate-900'
                }`}
              >
                <option value="NAC501">NAC501</option>
                <option value="NAC502">NAC502</option>
                <option value="LIB603">LIB603</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className={`text-xs font-semibold uppercase tracking-wide ${
                isDarkMode ? 'text-slate-400' : 'text-slate-500'
              }`}>
                Max Cap
              </label>
              <input
                type="number"
                name="maxCapacity"
                value={formData.maxCapacity}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:ring-1 focus:ring-slate-900 focus:outline-none transition-all ${
                  isDarkMode 
                    ? 'bg-slate-700 border-slate-600 text-white focus:border-slate-500' 
                    : 'border-slate-200 focus:border-slate-900'
                }`}
              />
            </div>
          </div>

          <button
            type="submit"
            className={`w-full font-bold py-3 rounded-md transition-all shadow-md mt-2 ${
              isDarkMode
                ? 'bg-slate-700 hover:bg-slate-600 text-white'
                : 'bg-slate-900 hover:bg-black text-white'
            }`}
          >
            {editingClass ? 'Update Class' : 'Create Entry'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddClassModal;
