import { useState, useEffect } from 'react';
import { X, AlertCircle, FlaskConical, ChevronDown, User, Clock } from 'lucide-react';
import { checkInstructorAvailability, getAvailableSections, getClasses } from '../api';
import AddLabClassModal from './AddLabClassModal';
import RoomSelector from './RoomSelector';

// Time slot code to actual time mapping
const timeSlotToTime = {
  '1': '08:00 AM - 09:30 AM',
  '2': '09:40 AM - 11:10 AM',
  '3': '11:20 AM - 12:50 PM',
  '4': '01:00 PM - 02:30 PM',
  '5': '02:40 PM - 04:10 PM',
  '6': '04:20 PM - 05:50 PM'
};

// Parse time slot code (e.g., "ST1" -> { days: "ST", time: "08:00 AM - 09:30 AM" })
const parseTimeSlotCode = (code) => {
  const match = code.match(/^(ST|MW|RA)(\d)$/);
  if (match) {
    return {
      days: match[1],
      timeSlot: match[2],
      time: timeSlotToTime[match[2]] || null,
      code: code
    };
  }
  return null;
};

// Extract unique days from time slot codes
const extractAvailableDays = (timeSlots) => {
  const days = new Set();
  timeSlots.forEach(slot => {
    const parsed = parseTimeSlotCode(slot);
    if (parsed) {
      days.add(parsed.days);
    }
  });
  return Array.from(days);
};

// Extract available times for a specific day from time slot codes
const extractAvailableTimes = (timeSlots, selectedDays) => {
  const times = [];
  timeSlots.forEach(slot => {
    const parsed = parseTimeSlotCode(slot);
    if (parsed && parsed.days === selectedDays && parsed.time) {
      times.push(parsed.time);
    }
  });
  return times;
};

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

  const [availabilityStatus, setAvailabilityStatus] = useState(null);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [availableSections, setAvailableSections] = useState([]);
  const [allSectionsOccupied, setAllSectionsOccupied] = useState(false);
  const [manualSectionInput, setManualSectionInput] = useState(false);
  const [showLabModal, setShowLabModal] = useState(false);
  const [existingClasses, setExistingClasses] = useState([]);

  // Instructor dropdown state
  const [showInstructorDropdown, setShowInstructorDropdown] = useState(false);
  const [instructorData, setInstructorData] = useState([]);
  const [matchingInstructors, setMatchingInstructors] = useState([]);
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const [selectedInstructorSlot, setSelectedInstructorSlot] = useState(null);

  // Available days and times based on selected instructor
  const [availableDaysForInstructor, setAvailableDaysForInstructor] = useState([]);
  const [availableTimesForInstructor, setAvailableTimesForInstructor] = useState([]);

  // Load instructor availability data from API
  useEffect(() => {
    const loadInstructorData = async () => {
      try {
        console.log('Fetching instructor data from API...');
        const response = await fetch('http://localhost:5000/api/instructor-preferences');
        console.log('API Response status:', response.status);
        if (response.ok) {
          const data = await response.json();
          console.log('Instructor data loaded:', data);
          setInstructorData(data);
        } else {
          console.error('API returned error:', response.status);
        }
      } catch (error) {
        console.error('Failed to fetch instructor data:', error);
      }
    };
    loadInstructorData();

    // Set up auto-refresh every 5 seconds to catch new instructors added to database
    const intervalId = setInterval(loadInstructorData, 5000);

    // Cleanup interval on unmount
    return () => clearInterval(intervalId);
  }, []);

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

    const fetchInstructors = async () => {
      try {
        console.log('Modal opened - fetching instructors...');
        const response = await fetch('http://localhost:5000/api/instructor-preferences');
        if (response.ok) {
          const data = await response.json();
          console.log('Instructors fetched on modal open:', data);
          setInstructorData(data);
        }
      } catch (error) {
        console.error('Failed to fetch instructor data:', error);
      }
    };

    if (isOpen) {
      fetchClasses();
      fetchInstructors();
    }
  }, [isOpen]);

  useEffect(() => {
    if (editingClass) {
      setFormData(editingClass);
      setManualSectionInput(false);
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
      setManualSectionInput(false);
    }
    setAvailabilityStatus(null);
    setAvailableSections([]);
    setAllSectionsOccupied(false);
    setSelectedInstructor(null);
    setSelectedInstructorSlot(null);
    setShowInstructorDropdown(false);
    setAvailableDaysForInstructor([]);
    setAvailableTimesForInstructor([]);
  }, [editingClass, isOpen]);

  // Find matching instructors when course code changes
  useEffect(() => {
    if (!formData.courseCode) {
      setMatchingInstructors([]);
      return;
    }

    const courseCode = formData.courseCode.toUpperCase().trim();

    // Find instructors whose preferable courses include this course
    // Find matching instructors when course code changes
    const matches = instructorData.filter(instructor => {
      // FIX: Check for BOTH camelCase (old data) and snake_case (database data)
      const coursesStr = instructor.preferableCourses || instructor.preferable_courses || '';

      // Safety check: ensure it's a string before splitting
      const courses = typeof coursesStr === 'string'
        ? coursesStr.split(',').map(c => c.trim().toUpperCase()).filter(c => c)
        : [];

      console.log(`Checking instructor ${instructor.initials}:`, {
        coursesStr,
        courses,
        courseCode,
        // FIX: Do the same for times (check preferable_times)
        preferableTimes: instructor.preferableTimes || instructor.preferable_times
      });

      // ... rest of your matching logic ...
      return courses.some(c => {
        // (Your existing match logic here)
        if (c === courseCode) return true;
        if (courseCode.includes(c) && c.length >= 3) return true;
        if (c.includes(courseCode) && courseCode.length >= 3) return true;
        return false;
      });
    });

    console.log('=== INSTRUCTOR MATCHING ===');
    console.log('Course code entered:', courseCode);
    console.log('All instructors from API:', instructorData);
    console.log('Matching instructors:', matches);
    console.log('===========================');

    setMatchingInstructors(matches);

    // Reset instructor selection if course changes
    if (selectedInstructor && !matches.find(m => m.id === selectedInstructor.id)) {
      setSelectedInstructor(null);
      setAvailableDaysForInstructor([]);
      setAvailableTimesForInstructor([]);
    }
  }, [formData.courseCode, instructorData, selectedInstructor]);

  // Update available days when instructor is selected
  useEffect(() => {
    if (selectedInstructor) {
      const days = extractAvailableDays(selectedInstructor.preferableTimes);
      setAvailableDaysForInstructor(days);

      // If current days selection is not available, reset to first available
      if (days.length > 0 && !days.includes(formData.days)) {
        setFormData(prev => ({ ...prev, days: days[0] }));
      }
    } else {
      setAvailableDaysForInstructor([]);
    }
  }, [selectedInstructor]);

  // Update available times when days change
  useEffect(() => {
    if (selectedInstructor && formData.days) {
      const times = extractAvailableTimes(selectedInstructor.preferableTimes, formData.days);
      setAvailableTimesForInstructor(times);

      // If current time selection is not available, reset to first available
      if (times.length > 0 && !times.includes(formData.time)) {
        setFormData(prev => ({ ...prev, time: times[0] }));
      }
    } else {
      setAvailableTimesForInstructor([]);
    }
  }, [selectedInstructor, formData.days]);

  // Fetch available sections when course code changes
  useEffect(() => {
    const fetchSections = async () => {
      if (!formData.courseCode || editingClass) {
        setAvailableSections([]);
        setAllSectionsOccupied(false);
        setManualSectionInput(false);
        return;
      }

      try {
        const result = await getAvailableSections(formData.courseCode);
        setAvailableSections(result.availableSections);
        setAllSectionsOccupied(result.allStandardOccupied);

        // Auto-select first available section
        if (result.availableSections.length > 0) {
          setFormData(prev => ({ ...prev, section: result.availableSections[0] }));
          setManualSectionInput(false);
        } else if (result.allStandardOccupied) {
          // Enable manual input if all standard sections are occupied
          setManualSectionInput(true);
          setFormData(prev => ({ ...prev, section: '11' }));
        }
      } catch (error) {
        console.error('Error fetching sections:', error);
      }
    };

    const timeoutId = setTimeout(fetchSections, 300);
    return () => clearTimeout(timeoutId);
  }, [formData.courseCode, editingClass]);

  // Check instructor availability when faculty, days, or time changes
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
          editingClass?.id
        );
        setAvailabilityStatus(result);
      } catch (error) {
        console.error('Error checking availability:', error);
        setAvailabilityStatus(null);
      } finally {
        setCheckingAvailability(false);
      }
    };

    // Debounce the availability check
    const timeoutId = setTimeout(checkAvailability, 500);
    return () => clearTimeout(timeoutId);
  }, [formData.faculty, formData.days, formData.time, editingClass?.id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear selected instructor if faculty is manually changed
    if (name === 'faculty' && selectedInstructor && value !== selectedInstructor.fullName) {
      setSelectedInstructor(null);
      setAvailableDaysForInstructor([]);
      setAvailableTimesForInstructor([]);
    }
  };

  const handleSelectInstructor = (instructor) => {
    setSelectedInstructor(instructor);
    setFormData(prev => ({
      ...prev,
      faculty: instructor.fullName
    }));
    setShowInstructorDropdown(false);
  };

  const handleSelectInstructorSlot = (instructor, slotCode) => {
    const parsed = parseTimeSlotCode(slotCode);
    if (parsed) {
      setSelectedInstructorSlot({ instructor, slotCode });
      setFormData(prev => ({
        ...prev,
        faculty: instructor.fullName,
        days: parsed.days,
        time: parsed.time
      }));
      setSelectedInstructor(instructor);
      setShowInstructorDropdown(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = handleAddClass(formData);
    if (success) {
      closeModal();
    }
  };

  if (!isOpen) return null;

  // Day labels
  const dayLabels = {
    'ST': 'ST (Sun-Tue)',
    'MW': 'MW (Mon-Wed)',
    'RA': 'RA (Thu-Sat)'
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Enhanced backdrop with blur effect */}
        <div
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-backdrop-enter"
          onClick={closeModal}
        />
        {/* Modal container with animation */}
        <div className={`relative w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden animate-modal-enter ${isDarkMode ? 'bg-slate-800 shadow-slate-900/50' : 'bg-white shadow-slate-200'
          }`}>
          {/* Modal header with clear title and close button */}
          <div className={`px-6 py-4 border-b flex justify-between items-center ${isDarkMode ? 'border-slate-700' : 'border-slate-100'
            }`}>
            <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              {editingClass ? 'Edit Class' : 'Add New Class Manually'}
            </h3>
            <button
              onClick={closeModal}
              className={`p-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${isDarkMode
                ? 'text-slate-400 hover:text-white hover:bg-slate-700 focus:ring-slate-500'
                : 'text-slate-400 hover:text-slate-900 hover:bg-slate-100 focus:ring-slate-400'
                }`}
            >
              <X className="w-5 h-5" strokeWidth={1.75} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5 max-h-[85vh] overflow-y-auto">
            <div className="grid grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className={`text-xs font-semibold uppercase tracking-wide ${isDarkMode ? 'text-slate-400' : 'text-slate-500'
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
                  className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all duration-200 ${isDarkMode
                    ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:ring-slate-500 focus:border-transparent'
                    : 'bg-white border-slate-200 placeholder-slate-400 focus:ring-slate-500 focus:border-transparent'
                    }`}
                />
              </div>
              <div className="space-y-1.5">
                <label className={`text-xs font-semibold uppercase tracking-wide ${isDarkMode ? 'text-slate-400' : 'text-slate-500'
                  }`}>
                  Section
                </label>
                {!editingClass && manualSectionInput ? (
                  <div>
                    <input
                      type="text"
                      name="section"
                      value={formData.section}
                      onChange={handleInputChange}
                      placeholder="e.g. 11, 12"
                      className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all duration-200 ${isDarkMode
                        ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:ring-slate-500 focus:border-transparent'
                        : 'bg-white border-slate-200 placeholder-slate-400 focus:ring-slate-500 focus:border-transparent'
                        }`}
                    />
                    <p className={`text-xs mt-1.5 ${isDarkMode ? 'text-amber-400' : 'text-amber-600'}`}>
                      All standard sections (01-10) are occupied. Enter custom section number.
                    </p>
                  </div>
                ) : !editingClass && availableSections.length > 0 ? (
                  <select
                    name="section"
                    value={formData.section}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all duration-200 appearance-none cursor-pointer ${isDarkMode
                      ? 'bg-slate-700 border-slate-600 text-white focus:ring-slate-500 focus:border-transparent'
                      : 'bg-white border-slate-200 focus:ring-slate-500 focus:border-transparent'
                      }`}
                  >
                    {availableSections.map(sec => (
                      <option key={sec} value={sec}>Section {sec}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    name="section"
                    value={formData.section}
                    onChange={handleInputChange}
                    placeholder="e.g. 01"
                    className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all duration-200 ${isDarkMode
                      ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:ring-slate-500 focus:border-transparent'
                      : 'bg-white border-slate-200 placeholder-slate-400 focus:ring-slate-500 focus:border-transparent'
                      }`}
                  />
                )}
              </div>
            </div>

            {/* Faculty Name with Dropdown */}
            <div className="space-y-1.5 relative">
              <label className={`text-xs font-semibold uppercase tracking-wide ${isDarkMode ? 'text-slate-400' : 'text-slate-500'
                }`}>
                Faculty Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="faculty"
                  value={formData.faculty}
                  onChange={handleInputChange}
                  onFocus={() => matchingInstructors.length > 0 && setShowInstructorDropdown(true)}
                  required
                  placeholder="e.g. Dr. Rezwanul Huq"
                  className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all duration-200 pr-10 ${isDarkMode
                    ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:ring-slate-500 focus:border-transparent'
                    : 'bg-white border-slate-200 placeholder-slate-400 focus:ring-slate-500 focus:border-transparent'
                    }`}
                />
                {matchingInstructors.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setShowInstructorDropdown(!showInstructorDropdown)}
                    className={`absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-slate-400 ${isDarkMode ? 'hover:bg-slate-600 text-slate-400' : 'hover:bg-slate-100 text-slate-500'
                      }`}
                  >
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showInstructorDropdown ? 'rotate-180' : ''}`} strokeWidth={1.75} />
                  </button>
                )}
              </div>

              {/* Instructor Dropdown - Only show initials */}
              {showInstructorDropdown && matchingInstructors.length > 0 && (
                <div className={`absolute z-20 w-full mt-1 rounded-xl shadow-xl border max-h-64 overflow-y-auto animate-modal-enter ${isDarkMode ? 'bg-slate-700 border-slate-600' : 'bg-white border-slate-200'
                  }`}>
                  <div className={`px-4 py-2.5 border-b text-xs font-semibold uppercase tracking-wide ${isDarkMode ? 'border-slate-600 text-slate-400 bg-slate-800' : 'border-slate-100 text-slate-500 bg-slate-50'
                    }`}>
                    Available Instructors for {formData.courseCode.toUpperCase()}
                  </div>
                  {matchingInstructors.map((instructor) => (
                    <div key={instructor.id} className={`border-b last:border-b-0 ${isDarkMode ? 'border-slate-600' : 'border-slate-100'
                      }`}>
                      <div className={`px-4 py-2.5 flex items-center gap-2 ${isDarkMode ? 'bg-slate-700/50' : 'bg-slate-50'
                        }`}>
                        <User className="w-4 h-4" strokeWidth={1.75} />
                        <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                          {instructor.initials}
                        </span>
                        <span className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                          - {instructor.fullName}
                        </span>
                      </div>
                      <div className="px-4 py-2.5 flex flex-wrap gap-2">
                        {instructor.preferableTimes.map((slotCode) => {
                          const parsed = parseTimeSlotCode(slotCode);
                          const isSelected = selectedInstructorSlot?.instructor.id === instructor.id &&
                            selectedInstructorSlot?.slotCode === slotCode;
                          return (
                            <button
                              key={slotCode}
                              type="button"
                              onClick={() => handleSelectInstructorSlot(instructor, slotCode)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 ${isSelected
                                  ? isDarkMode
                                    ? 'bg-emerald-600 text-white focus:ring-emerald-400'
                                    : 'bg-emerald-500 text-white focus:ring-emerald-400'
                                  : isDarkMode
                                    ? 'bg-slate-600 text-emerald-400 hover:bg-slate-500 focus:ring-slate-400'
                                    : 'bg-slate-100 text-emerald-700 hover:bg-slate-200 focus:ring-slate-400'
                                }`}
                              title={parsed ? `${parsed.days} - ${parsed.time}` : slotCode}
                            >
                              {slotCode}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setShowInstructorDropdown(false)}
                    className={`w-full px-4 py-2.5 text-xs text-center transition-colors duration-200 ${isDarkMode ? 'text-slate-400 hover:bg-slate-600' : 'text-slate-500 hover:bg-slate-50'
                      }`}
                  >
                    Close or type manually
                  </button>
                </div>
              )}

              {/* Show selected slot info */}
              {selectedInstructorSlot && (
                <p className={`text-xs mt-1.5 flex items-center gap-1.5 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
                  <Clock className="w-3.5 h-3.5" strokeWidth={1.75} />
                  Selected: {selectedInstructorSlot.instructor.initials} - {selectedInstructorSlot.slotCode} ({formData.days} {formData.time})
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className={`text-xs font-semibold uppercase tracking-wide ${isDarkMode ? 'text-slate-400' : 'text-slate-500'
                  }`}>
                  Days
                </label>
                <select
                  name="days"
                  value={formData.days}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all duration-200 appearance-none cursor-pointer ${isDarkMode
                    ? 'bg-slate-700 border-slate-600 text-white focus:ring-slate-500 focus:border-transparent'
                    : 'bg-white border-slate-200 focus:ring-slate-500 focus:border-transparent'
                    }`}
                >
                  <option value="ST">ST (Sun-Tue)</option>
                  <option value="MW">MW (Mon-Wed)</option>
                  <option value="RA">RA (Thu-Sat)</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className={`text-xs font-semibold uppercase tracking-wide ${isDarkMode ? 'text-slate-400' : 'text-slate-500'
                  }`}>
                  Time
                </label>
                <select
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all duration-200 appearance-none cursor-pointer ${isDarkMode
                    ? 'bg-slate-700 border-slate-600 text-white focus:ring-slate-500 focus:border-transparent'
                    : 'bg-white border-slate-200 focus:ring-slate-500 focus:border-transparent'
                    }`}
                >
                  <option value="08:00 AM - 09:30 AM">08:00 AM - 09:30 AM</option>
                  <option value="09:40 AM - 11:10 AM">09:40 AM - 11:10 AM</option>
                  <option value="11:20 AM - 12:50 PM">11:20 AM - 12:50 PM</option>
                  <option value="01:00 PM - 02:30 PM">01:00 PM - 02:30 PM</option>
                  <option value="02:40 PM - 04:10 PM">02:40 PM - 04:10 PM</option>
                  <option value="04:20 PM - 05:50 PM">04:20 PM - 05:50 PM</option>
                </select>
              </div>
            </div>

            {/* Instructor Availability Status */}
            {formData.faculty && (
              <div className="mt-2">
                {checkingAvailability ? (
                  <div className={`flex items-center gap-2.5 p-3.5 rounded-xl ${isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'
                    }`}>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-slate-400 border-t-transparent"></div>
                    <span className="text-sm">Checking instructor availability...</span>
                  </div>
                ) : availabilityStatus && !availabilityStatus.available ? (
                  <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500">
                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" strokeWidth={1.75} />
                    <div className="flex-1">
                      <p className="text-sm font-semibold">Instructor Not Available</p>
                      <p className="text-xs mt-1 opacity-90">{availabilityStatus.message}</p>
                    </div>
                  </div>
                ) : availabilityStatus && availabilityStatus.available ? (
                  <div className={`flex items-center gap-2.5 p-3.5 rounded-xl ${isDarkMode ? 'bg-green-900/20 border border-green-500/20 text-green-400' : 'bg-green-50 border border-green-200 text-green-700'
                    }`}>
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                    <span className="text-sm font-medium">Instructor is available for this slot</span>
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
                editingClassId={editingClass?.id}
                isLabClass={false}
              />
              <div className="space-y-1.5">
                <label className={`text-xs font-semibold uppercase tracking-wide ${isDarkMode ? 'text-slate-400' : 'text-slate-500'
                  }`}>
                  Max Cap
                </label>
                <input
                  type="number"
                  name="maxCapacity"
                  value={formData.maxCapacity}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all duration-200 ${isDarkMode
                    ? 'bg-slate-700 border-slate-600 text-white focus:ring-slate-500 focus:border-transparent'
                    : 'bg-white border-slate-200 focus:ring-slate-500 focus:border-transparent'
                    }`}
                />
              </div>
            </div>

            {/* Modal footer with buttons */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-700 space-y-3">
              <button
                type="submit"
                disabled={availabilityStatus && !availabilityStatus.available}
                className={`w-full inline-flex items-center justify-center gap-2 font-semibold py-3 px-4 rounded-xl transition-all duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${availabilityStatus && !availabilityStatus.available
                    ? 'bg-slate-400 cursor-not-allowed text-slate-200'
                    : isDarkMode
                      ? 'bg-gradient-to-r from-[#124d54] to-[#339fa7] hover:from-[#094044] hover:to-[#124d54] text-white active:scale-[0.98] focus:ring-teal-500'
                      : 'bg-gradient-to-r from-[#124d54] to-[#339fa7] hover:from-[#094044] hover:to-[#124d54] text-white active:scale-[0.98] focus:ring-teal-500'
                  }`}
              >
                {editingClass ? 'Update Class' : 'Create Entry'}
              </button>

              {/* Add Lab Class Button - Only show when not editing */}
              {!editingClass && (
                <button
                  type="button"
                  onClick={() => setShowLabModal(true)}
                  className={`w-full inline-flex items-center justify-center gap-2 font-semibold py-3 px-4 rounded-xl transition-all duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-[0.98] ${isDarkMode
                      ? 'bg-purple-900/30 hover:bg-purple-900/50 text-purple-300 border-2 border-purple-700 focus:ring-purple-500'
                      : 'bg-purple-50 hover:bg-purple-100 text-purple-700 border-2 border-purple-200 focus:ring-purple-400'
                    }`}
                >
                  <FlaskConical className="w-5 h-5" strokeWidth={1.75} />
                  Add Lab Class
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Lab Class Modal - Side by Side */}
      {showLabModal && (
        <AddLabClassModal
          isOpen={showLabModal}
          closeModal={() => setShowLabModal(false)}
          theoryCourse={formData}
          handleAddClass={handleAddClass}
          isDarkMode={isDarkMode}
        />
      )}
    </>
  );
};

export default AddClassModal;
