import { useState } from 'react';
import { X, Sparkles, Plus, XCircle, Loader, CheckCircle, FlaskConical, ChevronDown, ChevronUp, Lightbulb, AlertTriangle, Check } from 'lucide-react';
import { addClassesBulk } from '../api';

const AIScheduleModal = ({ isOpen, closeModal, isDarkMode, addNotification, applyGeneratedSchedule, onScheduleSaved }) => {
  const [instructorAvailability, setInstructorAvailability] = useState([
    { id: 1, name: '', courseCode: '', preferredDays: [], availableTimes: [], maxSections: 3, hasLab: false, labDays: [], labTimes: [] }
  ]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedSchedules, setGeneratedSchedules] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  const availableDays = ['ST', 'MW', 'RA'];
  const availableTimes = [
    '08:00 AM - 09:30 AM',
    '09:40 AM - 11:10 AM',
    '11:20 AM - 12:50 PM',
    '01:00 PM - 02:30 PM',
    '02:40 PM - 04:10 PM',
    '04:20 PM - 05:50 PM'
  ];

  // Lab configuration options - Single days
  const labSingleDays = [
    { value: 'S', label: 'Sunday' },
    { value: 'M', label: 'Monday' },
    { value: 'T', label: 'Tuesday' },
    { value: 'W', label: 'Wednesday' },
    { value: 'R', label: 'Thursday' },
    { value: 'A', label: 'Saturday' }
  ];

  // Lab configuration options - Double day patterns (same as theory)
  const labDoubleDays = [
    { value: 'ST', label: 'Sun-Tue' },
    { value: 'MW', label: 'Mon-Wed' },
    { value: 'RA', label: 'Thu-Sat' }
  ];

  // Combined lab days for validation
  const labDays = [...labSingleDays, ...labDoubleDays];

  // Valid day pairs for labs (S-T, M-W, R-A)
  const validDayPairs = {
    'S': 'T',
    'T': 'S',
    'M': 'W',
    'W': 'M',
    'R': 'A',
    'A': 'R'
  };

  // Lab time slots - both 3-hour and 1.5-hour options
  const labTimeSlots = [
    // 3-hour slots
    { value: '08:00 AM - 11:10 AM', label: '08:00 AM - 11:10 AM (3 hrs)', duration: '3hr' },
    { value: '09:40 AM - 12:50 PM', label: '09:40 AM - 12:50 PM (3 hrs)', duration: '3hr' },
    { value: '11:20 AM - 02:30 PM', label: '11:20 AM - 02:30 PM (3 hrs)', duration: '3hr' },
    { value: '12:50 PM - 04:10 PM', label: '12:50 PM - 04:10 PM (3 hrs)', duration: '3hr' },
    { value: '02:40 PM - 05:50 PM', label: '02:40 PM - 05:50 PM (3 hrs)', duration: '3hr' },
    // 1.5-hour slots (same as theory)
    { value: '08:00 AM - 09:30 AM', label: '08:00 AM - 09:30 AM', duration: '1.5hr' },
    { value: '09:40 AM - 11:10 AM', label: '09:40 AM - 11:10 AM', duration: '1.5hr' },
    { value: '11:20 AM - 12:50 PM', label: '11:20 AM - 12:50 PM', duration: '1.5hr' },
    { value: '01:00 PM - 02:30 PM', label: '01:00 PM - 02:30 PM', duration: '1.5hr' },
    { value: '02:40 PM - 04:10 PM', label: '02:40 PM - 04:10 PM', duration: '1.5hr' },
    { value: '04:20 PM - 05:50 PM', label: '04:20 PM - 05:50 PM', duration: '1.5hr' }
  ];

  // Check if selected lab days have a valid pairing conflict
  const getLabDayConflict = (selectedDays) => {
    if (selectedDays.length < 2) return null;
    
    // If a double day pattern is selected, no other days should be selected
    const hasDoubleDay = selectedDays.some(d => d.length === 2);
    if (hasDoubleDay && selectedDays.length > 1) {
      return 'Cannot combine double day patterns (ST, MW, RA) with other days';
    }
    
    // For single days, check all pairs of selected days
    for (let i = 0; i < selectedDays.length; i++) {
      for (let j = i + 1; j < selectedDays.length; j++) {
        const day1 = selectedDays[i];
        const day2 = selectedDays[j];
        // Check if they are NOT a valid pair
        if (validDayPairs[day1] !== day2) {
          return `Invalid day combination: ${day1} and ${day2}. Valid pairs are: S-T, M-W, R-A`;
        }
      }
    }
    return null;
  };

  // Parse time string to minutes from midnight
  const parseTimeToMinutes = (timeStr) => {
    const parts = timeStr.trim().split(' ');
    const timePart = parts[0];
    const period = parts[1] || 'AM';
    
    let [hours, minutes] = timePart.split(':').map(Number);
    if (period === 'PM' && hours !== 12) {
      hours += 12;
    } else if (period === 'AM' && hours === 12) {
      hours = 0;
    }
    
    return hours * 60 + minutes;
  };

  // Check if two time slots overlap
  const checkTimeOverlap = (time1, time2) => {
    try {
      const [start1Str, end1Str] = time1.split(' - ');
      const [start2Str, end2Str] = time2.split(' - ');
      
      const start1 = parseTimeToMinutes(start1Str);
      const end1 = parseTimeToMinutes(end1Str);
      const start2 = parseTimeToMinutes(start2Str);
      const end2 = parseTimeToMinutes(end2Str);
      
      return start1 < end2 && start2 < end1;
    } catch {
      return false;
    }
  };

  // Check if two day patterns overlap
  const checkDayOverlap = (day1, day2) => {
    const expandDays = (dayPattern) => {
      if (dayPattern.length === 2) {
        return new Set(dayPattern.split(''));
      }
      return new Set([dayPattern]);
    };
    
    const days1 = expandDays(day1);
    const days2 = expandDays(day2);
    
    for (const d of days1) {
      if (days2.has(d)) return true;
    }
    return false;
  };

  // Check for potential conflicts between theory and lab times for an instructor
  const getLabTimeConflict = (slot) => {
    if (!slot.hasLab || slot.labDays.length === 0 || slot.labTimes.length === 0) {
      return null;
    }
    
    const encodedLabDays = encodeLabDays(slot.labDays);
    
    // Check each combination of theory day/time with lab day/time
    for (const theoryDay of slot.preferredDays) {
      for (const theoryTime of slot.availableTimes) {
        for (const labDay of encodedLabDays) {
          for (const labTime of slot.labTimes) {
            // Check if days overlap
            if (checkDayOverlap(theoryDay, labDay)) {
              // Check if times overlap
              if (checkTimeOverlap(theoryTime, labTime)) {
                return `Potential conflict: Theory (${theoryDay} ${theoryTime}) overlaps with Lab (${labDay} ${labTime}). The scheduler will try to avoid this.`;
              }
            }
          }
        }
      }
    }
    
    return null;
  };

  // Convert selected lab days to encoded format for backend
  // If S and T are selected separately, encode as "ST"
  const encodeLabDays = (selectedDays) => {
    if (selectedDays.length === 0) return [];
    
    // If already a double day pattern, return as-is
    if (selectedDays.some(d => d.length === 2)) {
      return selectedDays;
    }
    
    // Check if we have a valid pair that should be combined
    const sortedDays = [...selectedDays].sort();
    
    // Check for S-T pair
    if (sortedDays.includes('S') && sortedDays.includes('T')) {
      const remaining = sortedDays.filter(d => d !== 'S' && d !== 'T');
      return ['ST', ...remaining];
    }
    // Check for M-W pair
    if (sortedDays.includes('M') && sortedDays.includes('W')) {
      const remaining = sortedDays.filter(d => d !== 'M' && d !== 'W');
      return ['MW', ...remaining];
    }
    // Check for R-A pair
    if (sortedDays.includes('R') && sortedDays.includes('A')) {
      const remaining = sortedDays.filter(d => d !== 'R' && d !== 'A');
      return ['RA', ...remaining];
    }
    
    // Return as single days
    return selectedDays;
  };

  // Track which instructor slots have expanded lab panels
  const [expandedLabPanels, setExpandedLabPanels] = useState({});

  const [totalSections, setTotalSections] = useState(1);

  const addInstructorSlot = () => {
    setInstructorAvailability([
      ...instructorAvailability,
      {
        id: Date.now(),
        name: '',
        courseCode: '',
        preferredDays: [],
        availableTimes: [],
        maxSections: 3,
        hasLab: false,
        labDays: [],
        labTimes: []
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

  const toggleLabPanel = (id) => {
    setExpandedLabPanels(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const toggleLabEnabled = (id) => {
    setInstructorAvailability(instructorAvailability.map(slot => {
      if (slot.id === id) {
        const newHasLab = !slot.hasLab;
        return { 
          ...slot, 
          hasLab: newHasLab,
          // Clear lab selections when disabling
          labDays: newHasLab ? slot.labDays : [],
          labTimes: newHasLab ? slot.labTimes : []
        };
      }
      return slot;
    }));
  };

  const toggleLabDaySelection = (id, day) => {
    setInstructorAvailability(instructorAvailability.map(slot => {
      if (slot.id === id) {
        const days = slot.labDays.includes(day)
          ? slot.labDays.filter(d => d !== day)
          : [...slot.labDays, day];
        return { ...slot, labDays: days };
      }
      return slot;
    }));
  };

  const toggleLabTimeSelection = (id, time) => {
    setInstructorAvailability(instructorAvailability.map(slot => {
      if (slot.id === id) {
        const times = slot.labTimes.includes(time)
          ? slot.labTimes.filter(t => t !== time)
          : [...slot.labTimes, time];
        return { ...slot, labTimes: times };
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

    // Validate lab day pairs
    const labDayConflicts = instructorAvailability.filter(
      slot => slot.hasLab && getLabDayConflict(slot.labDays)
    );

    if (labDayConflicts.length > 0) {
      addNotification('Please fix lab day conflicts. Valid pairs are: S-T, M-W, R-A', 'error');
      return;
    }

    setIsGenerating(true);

    try {
      // Encode lab days before sending to backend
      const instructorsWithEncodedLabDays = instructorAvailability.map(inst => ({
        ...inst,
        labDays: encodeLabDays(inst.labDays)
      }));
      
      console.log('Sending instructors to backend:', instructorsWithEncodedLabDays);

      const response = await fetch("http://localhost:5000/api/generate-schedule", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          instructors: instructorsWithEncodedLabDays,
          totalSections: parseInt(totalSections)
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate schedule');
      }

      if (data.schedules && data.schedules.length > 0) {
        setGeneratedSchedules(data.schedules);

        // Check for conflicts in the first option (or any option)
        const conflictOpt = data.schedules.find(s => s.conflict);
        if (conflictOpt) {
          addNotification(`Warning: ${conflictOpt.conflictMessage}`, 'error');
        } else {
          addNotification(`Generated ${data.schedules.length} schedule options!`, 'success');
        }

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

  const handleApplySchedule = async (schedule) => {
    // Filter out conflict/unassigned classes that shouldn't be saved
    const validClasses = schedule.classes.filter(cls => 
      cls.courseCode !== 'UNASSIGNED' && 
      !cls.conflict && 
      cls.room !== 'TBD'
    );

    if (validClasses.length === 0) {
      addNotification('No valid classes to save. Please resolve conflicts first.', 'error');
      return;
    }

    setIsSaving(true);
    setSaveError(null);

    try {
      // Prepare classes for bulk API - format for database
      const classesToSave = validClasses.map(cls => ({
        courseCode: cls.courseCode,
        section: cls.section,
        faculty: cls.faculty,
        room: cls.room,
        time: cls.time,
        days: cls.days,
        maxCapacity: 40,
        enrolled: 0
      }));

      // Call bulk API to save all classes at once
      const savedClasses = await addClassesBulk(classesToSave);

      // Update local state with saved classes (which now have IDs from database)
      if (applyGeneratedSchedule) {
        applyGeneratedSchedule(savedClasses);
      }

      // Trigger refresh of class list in parent component
      if (onScheduleSaved) {
        onScheduleSaved();
      }

      addNotification(`Successfully saved ${savedClasses.length} classes to database!`, 'success');
      handleClose();
    } catch (error) {
      console.error('Failed to save schedule:', error);
      setSaveError(error.message || 'Failed to save schedule to database');
      addNotification(`Error: ${error.message || 'Failed to save schedule'}`, 'error');
      // Keep modal open on failure - don't call handleClose()
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    setGeneratedSchedules([]);
    setInstructorAvailability([
      { id: 1, name: '', courseCode: '', preferredDays: [], availableTimes: [], maxSections: 3, hasLab: false, labDays: [], labTimes: [] }
    ]);
    setExpandedLabPanels({});
    setSaveError(null);
    closeModal();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Enhanced backdrop with blur effect */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-backdrop-enter"
        onClick={handleClose}
      />
      {/* Modal container with animation */}
      <div className={`relative w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden animate-modal-enter ${isDarkMode ? 'bg-slate-800 shadow-slate-900/50' : 'bg-white shadow-slate-200'
          }`}>
        {/* Header with clear title and close button */}
        <div className={`px-6 py-4 border-b flex justify-between items-center ${isDarkMode ? 'border-slate-700 bg-gradient-to-r from-purple-900/30 to-indigo-900/30' : 'border-slate-100 bg-gradient-to-r from-purple-50 to-indigo-50'
            }`}>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg">
              <Sparkles className="w-5 h-5 text-white" strokeWidth={1.75} />
            </div>
            <div>
              <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                Auto Schedule Generator
              </h3>
              <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Enter instructor availability and let the system create optimal schedules
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className={`p-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${isDarkMode 
              ? 'text-slate-400 hover:text-white hover:bg-slate-700/50 focus:ring-purple-500' 
              : 'text-slate-400 hover:text-slate-900 hover:bg-slate-100 focus:ring-purple-400'
              }`}
          >
            <X className="w-5 h-5" strokeWidth={1.75} />
          </button>
        </div>

        <div className="px-6 py-5 max-h-[80vh] overflow-y-auto">
            {generatedSchedules.length === 0 ? (
              // Input Form
              <div className="space-y-6">

                <div className={`p-4 rounded-xl flex items-start gap-3 ${isDarkMode ? 'bg-blue-900/30 border border-blue-700' : 'bg-blue-50 border border-blue-200'
                  }`}>
                  <Lightbulb className={`w-5 h-5 flex-shrink-0 mt-0.5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} strokeWidth={1.75} />
                  <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-blue-200' : 'text-blue-900'}`}>
                    <strong>Tip:</strong> Provide instructor availability details for each course. The system will generate 3 optimized schedule options considering conflicts, room utilization, and preferences.
                  </p>
                </div>

                <div className={`p-4 rounded-xl border flex items-center justify-between ${isDarkMode ? 'bg-slate-700/50 border-slate-600' : 'bg-white border-slate-200'}`}>
                  <label className={`text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    Total Available Sections
                  </label>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Start assigning from Section 1 to:</span>
                    <input
                      type="number"
                      min="1"
                      value={totalSections}
                      onChange={(e) => setTotalSections(Math.max(1, parseInt(e.target.value) || 1))}
                      className={`w-20 px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none focus:border-transparent transition-all duration-200 text-center font-bold ${isDarkMode
                        ? 'bg-slate-800 border-slate-600 text-white'
                        : 'bg-slate-50 border-slate-200 text-slate-900'
                        }`}
                    />
                  </div>
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
                          className="text-red-500 hover:text-red-600 transition-colors duration-200 p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 focus:outline-none focus:ring-2 focus:ring-red-400"
                        >
                          <XCircle className="w-5 h-5" strokeWidth={1.75} />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="space-y-1.5">
                        <label className={`text-xs font-semibold uppercase tracking-wide ${isDarkMode ? 'text-slate-400' : 'text-slate-500'
                          }`}>
                          Instructor Name
                        </label>
                        <input
                          type="text"
                          value={slot.name}
                          onChange={(e) => updateInstructorSlot(slot.id, 'name', e.target.value)}
                          placeholder="e.g. Dr. John Smith"
                          className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none focus:border-transparent transition-all duration-200 ${isDarkMode
                            ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400'
                            : 'bg-white border-slate-200 placeholder-slate-400'
                            }`}
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className={`text-xs font-semibold uppercase tracking-wide ${isDarkMode ? 'text-slate-400' : 'text-slate-500'
                          }`}>
                          Course Code
                        </label>
                        <input
                          type="text"
                          value={slot.courseCode}
                          onChange={(e) => updateInstructorSlot(slot.id, 'courseCode', e.target.value)}
                          placeholder="e.g. CSE327"
                          className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none focus:border-transparent transition-all duration-200 ${isDarkMode
                            ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400'
                            : 'bg-white border-slate-200 placeholder-slate-400'
                            }`}
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="space-y-1.5">
                        <label className={`text-xs font-semibold uppercase tracking-wide ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                          Max Sections
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="10"
                          value={slot.maxSections}
                          onChange={(e) => updateInstructorSlot(slot.id, 'maxSections', parseInt(e.target.value))}
                          className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none focus:border-transparent transition-all duration-200 ${isDarkMode
                            ? 'bg-slate-700 border-slate-600 text-white'
                            : 'bg-white border-slate-200'
                            }`}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className={`text-xs font-semibold uppercase tracking-wide ${isDarkMode ? 'text-slate-400' : 'text-slate-500'
                          }`}>
                          Preferred Days
                        </label>
                        <div className="flex gap-2">
                          {availableDays.map(day => (
                            <button
                              key={day}
                              type="button"
                              onClick={() => toggleDaySelection(slot.id, day)}
                              className={`flex-1 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 ${slot.preferredDays.includes(day)
                                ? 'bg-purple-600 text-white shadow-md focus:ring-purple-400'
                                : isDarkMode
                                  ? 'bg-slate-700 text-slate-300 hover:bg-slate-600 focus:ring-slate-500'
                                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 focus:ring-slate-400'
                                }`}
                            >
                              {day}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className={`text-xs font-semibold uppercase tracking-wide ${isDarkMode ? 'text-slate-400' : 'text-slate-500'
                          }`}>
                          Available Time Slots
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {availableTimes.map(time => (
                            <button
                              key={time}
                              type="button"
                              onClick={() => toggleTimeSelection(slot.id, time)}
                              className={`px-3 py-2.5 rounded-lg text-xs font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 ${slot.availableTimes.includes(time)
                                ? 'bg-indigo-600 text-white shadow-md focus:ring-indigo-400'
                                : isDarkMode
                                  ? 'bg-slate-700 text-slate-300 hover:bg-slate-600 focus:ring-slate-500'
                                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 focus:ring-slate-400'
                                }`}
                            >
                              {time}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Add Lab Button */}
                      <div className="pt-3 border-t border-slate-200 dark:border-slate-600">
                        <button
                          type="button"
                          onClick={() => toggleLabPanel(slot.id)}
                          className={`w-full flex items-center justify-between px-4 py-3 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                            slot.hasLab
                              ? 'bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-400'
                              : isDarkMode
                                ? 'bg-slate-600 text-slate-200 hover:bg-slate-500 focus:ring-slate-400'
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 focus:ring-slate-400'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <FlaskConical className="w-4 h-4" strokeWidth={1.75} />
                            <span>{slot.hasLab ? 'Lab Configured' : 'Add Lab'}</span>
                          </div>
                          {expandedLabPanels[slot.id] ? (
                            <ChevronUp className="w-4 h-4" strokeWidth={1.75} />
                          ) : (
                            <ChevronDown className="w-4 h-4" strokeWidth={1.75} />
                          )}
                        </button>

                        {/* Lab Configuration Panel */}
                        {expandedLabPanels[slot.id] && (
                          <div className={`mt-3 p-4 rounded-lg border ${
                            isDarkMode 
                              ? 'bg-slate-800/50 border-slate-600' 
                              : 'bg-white border-slate-200'
                          }`}>
                            {/* Enable/Disable Lab Toggle */}
                            <div className="flex items-center justify-between mb-4">
                              <label className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                                Enable Lab for this Course
                              </label>
                              <button
                                type="button"
                                onClick={() => toggleLabEnabled(slot.id)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 ${
                                  slot.hasLab ? 'bg-emerald-600' : isDarkMode ? 'bg-slate-600' : 'bg-slate-300'
                                }`}
                              >
                                <span
                                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                                    slot.hasLab ? 'translate-x-6' : 'translate-x-1'
                                  }`}
                                />
                              </button>
                            </div>

                            {slot.hasLab && (
                              <>
                                {/* Lab Day Selection */}
                                <div className="space-y-2 mb-4">
                                  <label className={`text-xs font-semibold uppercase tracking-wide ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                    Lab Days
                                  </label>
                                  
                                  {/* Double Day Patterns */}
                                  <div>
                                    <p className={`text-xs mb-1.5 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Double Day Patterns:</p>
                                    <div className="grid grid-cols-3 gap-2">
                                      {labDoubleDays.map(day => (
                                        <button
                                          key={day.value}
                                          type="button"
                                          onClick={() => toggleLabDaySelection(slot.id, day.value)}
                                          title={day.label}
                                          className={`px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                                            slot.labDays.includes(day.value)
                                              ? 'bg-emerald-600 text-white shadow-md focus:ring-emerald-400'
                                              : isDarkMode
                                                ? 'bg-slate-700 text-slate-300 hover:bg-slate-600 focus:ring-slate-500'
                                                : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100 focus:ring-slate-400'
                                          }`}
                                        >
                                          {day.value}
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                  
                                  {/* Single Days */}
                                  <div className="mt-2">
                                    <p className={`text-xs mb-1.5 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Single Days (S+T = ST, M+W = MW, R+A = RA):</p>
                                    <div className="grid grid-cols-6 gap-2">
                                      {labSingleDays.map(day => (
                                        <button
                                          key={day.value}
                                          type="button"
                                          onClick={() => toggleLabDaySelection(slot.id, day.value)}
                                          title={day.label}
                                          className={`px-2 py-2 rounded-lg text-xs font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                                            slot.labDays.includes(day.value)
                                              ? 'bg-emerald-600 text-white shadow-md focus:ring-emerald-400'
                                              : isDarkMode
                                                ? 'bg-slate-700 text-slate-300 hover:bg-slate-600 focus:ring-slate-500'
                                                : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100 focus:ring-slate-400'
                                          }`}
                                        >
                                          {day.value}
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                  
                                  {/* Day Conflict Warning */}
                                  {getLabDayConflict(slot.labDays) && (
                                    <div className="mt-2 p-2.5 rounded-lg bg-red-100 dark:bg-red-900/40 border border-red-300 dark:border-red-600 flex items-center gap-2">
                                      <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0" strokeWidth={2} />
                                      <p className="text-xs text-red-800 dark:text-red-200 font-medium">
                                        {getLabDayConflict(slot.labDays)}
                                      </p>
                                    </div>
                                  )}
                                  
                                  {/* Show encoded result */}
                                  {slot.labDays.length > 0 && !getLabDayConflict(slot.labDays) && (
                                    <div className="mt-2 p-2.5 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 border border-emerald-300 dark:border-emerald-600 flex items-center gap-2">
                                      <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" strokeWidth={2} />
                                      <p className="text-xs text-emerald-800 dark:text-emerald-200 font-medium">
                                        Lab will be scheduled on: {encodeLabDays(slot.labDays).join(', ')}
                                      </p>
                                    </div>
                                  )}
                                </div>

                                {/* Lab Time Slot Selection */}
                                <div className="space-y-2">
                                  <label className={`text-xs font-semibold uppercase tracking-wide ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                    Lab Time Slots
                                  </label>
                                  <div className="space-y-3">
                                    {/* 3-hour slots */}
                                    <div>
                                      <p className={`text-xs mb-1.5 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>3-Hour Slots:</p>
                                      <div className="grid grid-cols-1 gap-1.5">
                                        {labTimeSlots.filter(t => t.duration === '3hr').map(time => (
                                          <button
                                            key={time.value}
                                            type="button"
                                            onClick={() => toggleLabTimeSelection(slot.id, time.value)}
                                            className={`px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                                              slot.labTimes.includes(time.value)
                                                ? 'bg-emerald-600 text-white shadow-md focus:ring-emerald-400'
                                                : isDarkMode
                                                  ? 'bg-slate-700 text-slate-300 hover:bg-slate-600 focus:ring-slate-500'
                                                  : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100 focus:ring-slate-400'
                                            }`}
                                          >
                                            {time.label}
                                          </button>
                                        ))}
                                      </div>
                                    </div>
                                    {/* 1.5-hour slots */}
                                    <div>
                                      <p className={`text-xs mb-1.5 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>1.5-Hour Slots:</p>
                                      <div className="grid grid-cols-2 gap-1.5">
                                        {labTimeSlots.filter(t => t.duration === '1.5hr').map(time => (
                                          <button
                                            key={time.value}
                                            type="button"
                                            onClick={() => toggleLabTimeSelection(slot.id, time.value)}
                                            className={`px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                                              slot.labTimes.includes(time.value)
                                                ? 'bg-emerald-600 text-white shadow-md focus:ring-emerald-400'
                                                : isDarkMode
                                                  ? 'bg-slate-700 text-slate-300 hover:bg-slate-600 focus:ring-slate-500'
                                                  : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100 focus:ring-slate-400'
                                            }`}
                                          >
                                            {time.label}
                                          </button>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                  
                                  {/* Time Conflict Warning */}
                                  {getLabTimeConflict(slot) && (
                                    <div className="mt-2 p-2.5 rounded-lg bg-amber-100 dark:bg-amber-900/40 border border-amber-300 dark:border-amber-600 flex items-start gap-2">
                                      <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" strokeWidth={2} />
                                      <p className="text-xs text-amber-800 dark:text-amber-200 font-medium">
                                        {getLabTimeConflict(slot)}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  onClick={addInstructorSlot}
                  className={`w-full py-3 rounded-xl border-2 border-dashed font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${isDarkMode
                    ? 'border-slate-600 text-slate-400 hover:border-slate-500 hover:text-slate-300 hover:bg-slate-700/30 focus:ring-slate-500'
                    : 'border-slate-300 text-slate-500 hover:border-slate-400 hover:text-slate-700 hover:bg-slate-50 focus:ring-slate-400'
                    }`}
                >
                  <Plus className="w-5 h-5 inline mr-2" strokeWidth={1.75} />
                  Add Another Instructor
                </button>

                <div className="flex gap-3">
                  <button
                    onClick={handleClose}
                    className={`flex-1 py-3 rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-[0.98] ${isDarkMode
                      ? 'bg-slate-700 hover:bg-slate-600 text-white focus:ring-slate-500'
                      : 'bg-slate-200 hover:bg-slate-300 text-slate-900 focus:ring-slate-400'
                      }`}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={generateScheduleWithAI}
                    disabled={isGenerating}
                    className={`flex-1 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-[0.98] ${isGenerating
                      ? 'bg-slate-400 cursor-not-allowed text-white'
                      : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white focus:ring-purple-400'
                      }`}
                  >
                    {isGenerating ? (
                      <div className="flex items-center justify-center gap-2">
                        <Loader className="w-5 h-5 animate-spin" strokeWidth={1.75} />
                        <span>Generating...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <Sparkles className="w-5 h-5" strokeWidth={1.75} />
                        <span>Generate Schedules</span>
                      </div>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              // Generated Schedules Display
              <div className="space-y-6">
                <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-emerald-900/20 border border-emerald-800' : 'bg-emerald-50 border border-emerald-200'
                  }`}>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle className="w-5 h-5 text-emerald-600" strokeWidth={1.75} />
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
                        {schedule.conflict && (
                          <div className="mt-2 px-3 py-1.5 bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-200 text-xs rounded-full inline-flex items-center gap-1.5 font-semibold border border-red-300 dark:border-red-600">
                            <AlertTriangle className="w-3.5 h-3.5" strokeWidth={2} />
                            {schedule.conflictMessage}
                          </div>
                        )}

                        {/* Workload Summary Table */}
                        {schedule.workload && (
                          <div className={`mt-4 rounded-xl overflow-hidden border ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                            <table className="w-full text-xs text-left">
                              <thead className={`${isDarkMode ? 'bg-slate-700/50 text-slate-300' : 'bg-slate-50 text-slate-600'} border-b ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                                <tr>
                                  <th className="px-3 py-2.5 font-bold uppercase tracking-wider">Instructor</th>
                                  <th className="px-3 py-2.5 font-bold uppercase tracking-wider">Sections</th>
                                </tr>
                              </thead>
                              <tbody className={`divide-y ${isDarkMode ? 'divide-slate-700' : 'divide-slate-100'}`}>
                                {schedule.workload.map((w, i) => (
                                  <tr key={i} className={isDarkMode ? 'bg-slate-800/50' : 'bg-white'}>
                                    <td className="px-3 py-2.5 font-medium">{w.name}</td>
                                    <td className="px-3 py-2.5 font-bold text-indigo-500">{w.count}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => handleApplySchedule(schedule)}
                        disabled={isSaving}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 active:scale-[0.98] ${
                          isSaving 
                            ? 'bg-slate-400 cursor-not-allowed text-white' 
                            : 'bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white'
                        }`}
                      >
                        {isSaving ? (
                          <>
                            <Loader className="w-4 h-4 animate-spin" strokeWidth={1.75} />
                            <span>Saving...</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-4 h-4" strokeWidth={1.75} />
                            <span>Apply This Schedule</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Error message display */}
                    {saveError && (
                      <div className={`mt-3 p-3 rounded-lg border ${isDarkMode ? 'bg-red-900/20 border-red-800 text-red-300' : 'bg-red-50 border-red-200 text-red-700'}`}>
                        <div className="flex items-center gap-2">
                          <XCircle className="w-4 h-4 flex-shrink-0" strokeWidth={1.75} />
                          <p className="text-sm font-medium">{saveError}</p>
                        </div>
                      </div>
                    )}

                    <div className={`mt-6 rounded-xl overflow-hidden border ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                      <table className="w-full text-sm text-left border-collapse">
                        <thead className={`${isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-700'} border-b ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                          <tr>
                            <th className="px-4 py-3 font-bold uppercase tracking-wider text-xs">Course</th>
                            <th className="px-4 py-3 font-bold uppercase tracking-wider text-xs">Section</th>
                            <th className="px-4 py-3 font-bold uppercase tracking-wider text-xs">Instructor</th>
                            <th className="px-4 py-3 font-bold uppercase tracking-wider text-xs">Day</th>
                            <th className="px-4 py-3 font-bold uppercase tracking-wider text-xs">Time</th>
                            <th className="px-4 py-3 font-bold uppercase tracking-wider text-xs">Room</th>
                          </tr>
                        </thead>
                        <tbody className={`divide-y ${isDarkMode ? 'divide-slate-700' : 'divide-slate-100'}`}>
                          {schedule.classes.map((cls, clsIdx) => (
                            <tr
                              key={clsIdx}
                              className={`${isDarkMode ? 'hover:bg-slate-800/50' : 'hover:bg-slate-50'} transition-colors duration-200 ${cls.courseCode === 'UNASSIGNED' ? 'bg-red-50/50 dark:bg-red-900/10' : ''
                                }`}
                            >
                              <td className={`px-4 py-3 font-bold ${cls.courseCode === 'UNASSIGNED' ? 'text-red-500' : isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                {cls.courseCode}
                              </td>
                              <td className="px-4 py-3 font-medium text-indigo-500">{cls.section}</td>
                              <td className={`px-4 py-3 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>{cls.faculty}</td>
                              <td className="px-4 py-3">
                                <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-700'}`}>
                                  {cls.days}
                                </span>
                              </td>
                              <td className="px-4 py-3">
                                <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-700'}`}>
                                  {cls.time}
                                </span>
                              </td>
                              <td className={`px-4 py-3 font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{cls.room}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}

                <button
                  onClick={handleClose}
                  className={`w-full py-3 rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-[0.98] ${isDarkMode
                    ? 'bg-slate-700 hover:bg-slate-600 text-white focus:ring-slate-500'
                    : 'bg-slate-200 hover:bg-slate-300 text-slate-900 focus:ring-slate-400'
                    }`}
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
  );
};

export default AIScheduleModal;
