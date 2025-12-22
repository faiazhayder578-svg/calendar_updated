import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import ScheduleView from './components/ScheduleView';
import AddClassModal from './components/AddClassModal';
import AIScheduleModal from './components/AIScheduleModal';
import CalendarView from './components/CalendarView';
import ReviewsModal from './components/ReviewsModal';
import WaitlistModal from './components/WaitlistModal';
import ThemeSelector from './components/ThemeSelector';
import QRCodeGenerator from './components/QRCodeGenerator';
import GradeCalculator from './components/GradeCalculator';
import AcademicCalendarModal from './components/AcademicCalendarModal';
import ConflictModal from './components/ConflictModal';
import UnreadReviewsModal from './components/UnreadReviewsModal';
import AllReviews from './components/AllReviews';
import './App.css';

const App = () => {
  const [isStudentMode, setIsStudentMode] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [classes, setClasses] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'desc' });

  const [activeView, setActiveView] = useState('schedule');
  const [editingClass, setEditingClass] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [enrolledClasses, setEnrolledClasses] = useState([]);

  // Feature states
  const [reviews, setReviews] = useState({});
  const [waitlists, setWaitlists] = useState({});
  const [currentTheme, setCurrentTheme] = useState('default');
  const [showReviewsModal, setShowReviewsModal] = useState(false);
  const [showWaitlistModal, setShowWaitlistModal] = useState(false);
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const [showQRGenerator, setShowQRGenerator] = useState(false);
  const [showGradeCalc, setShowGradeCalc] = useState(false);
  const [selectedClassForAction, setSelectedClassForAction] = useState(null);

  // Academic Calendar states
  const [academicEvents, setAcademicEventsState] = useState([]);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [lastReadReviewId, setLastReadReviewId] = useState(parseInt(localStorage.getItem('lastReadReviewId') || '0'));
  const [showUnreadModal, setShowUnreadModal] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Custom setter for academicEvents with deduplication
  const setAcademicEvents = (newEvents) => {
    setAcademicEventsState(prev => {
      const combined = typeof newEvents === 'function' ? newEvents(prev) : newEvents;

      // Filter out duplicate events (same title and date)
      const uniqueEvents = combined.filter((event, index, self) =>
        index === self.findIndex(e =>
          e.title.toLowerCase().trim() === event.title.toLowerCase().trim() &&
          e.startDate === event.startDate
        )
      );

      return uniqueEvents;
    });
  };

  // Conflict Modal State
  const [showConflictModal, setShowConflictModal] = useState(false);
  const [conflictDetails, setConflictDetails] = useState({ message: '', type: '' });

  // Load data from localStorage on mount
  useEffect(() => {
    const savedClasses = localStorage.getItem('classes');
    const savedFavorites = localStorage.getItem('favorites');
    const savedEnrolled = localStorage.getItem('enrolledClasses');
    const savedDarkMode = localStorage.getItem('darkMode');
    const savedReviews = localStorage.getItem('reviews');
    const savedWaitlists = localStorage.getItem('waitlists');
    const savedTheme = localStorage.getItem('theme');
    const savedEvents = localStorage.getItem('academicEvents');

    if (savedClasses) setClasses(JSON.parse(savedClasses));
    if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
    if (savedEnrolled) setEnrolledClasses(JSON.parse(savedEnrolled));
    if (savedDarkMode) setIsDarkMode(JSON.parse(savedDarkMode));
    if (savedReviews) setReviews(JSON.parse(savedReviews));
    if (savedWaitlists) setWaitlists(JSON.parse(savedWaitlists));
    if (savedTheme) setCurrentTheme(savedTheme);
    if (savedEvents) setAcademicEvents(JSON.parse(savedEvents));

    // Fetch classes from backend to override localStorage (Server is truth)
    const fetchClasses = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/classes');
        if (response.ok) {
          const data = await response.json();
          if (data && data.length > 0) setClasses(data);
        }
      } catch (error) {
        console.error('Failed to fetch classes:', error);
      }
    };
    fetchClasses();
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem('classes', JSON.stringify(classes));
  }, [classes]);

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('enrolledClasses', JSON.stringify(enrolledClasses));
  }, [enrolledClasses]);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem('reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('waitlists', JSON.stringify(waitlists));
  }, [waitlists]);

  useEffect(() => {
    localStorage.setItem('theme', currentTheme);
  }, [currentTheme]);

  // Save data to localStorage and sync academic events to backend
  useEffect(() => {
    localStorage.setItem('academicEvents', JSON.stringify(academicEvents));

    // Sync to backend if there are changes and it's not the initial mount
    const syncEvents = async () => {
      try {
        await fetch('http://localhost:5000/api/academic-events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(academicEvents)
        });
      } catch (error) {
        console.error('Failed to sync academic events to backend:', error);
      }
    };

    if (academicEvents.length > 0) {
      syncEvents();
    }
  }, [academicEvents]);

  // Sync reviews to backend
  useEffect(() => {
    const syncReviews = async () => {
      try {
        await fetch('http://localhost:5000/api/reviews', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(reviews)
        });
      } catch (error) {
        console.error('Failed to sync reviews to backend:', error);
      }
    };

    if (Object.keys(reviews).length > 0) {
      syncReviews();
    }
  }, [reviews]);

  // Initial fetch for academic events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/academic-events');
        if (response.ok) {
          const data = await response.json();
          if (data && data.length > 0) {
            setAcademicEvents(data);
          }
        }
      } catch (error) {
        console.error('Failed to fetch academic events:', error);
      }
    };
    fetchEvents();

    // Fetch reviews from backend
    const fetchReviews = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/reviews');
        if (response.ok) {
          const data = await response.json();
          if (data && Object.keys(data).length > 0) {
            setReviews(data);

            // Check for unread on initial load
            const allServerReviews = Object.values(data).flat();
            const maxServerId = Math.max(0, ...allServerReviews.map(r => r.id));
            if (maxServerId > lastReadReviewId && !isStudentMode) {
              const newUnreadCount = allServerReviews.filter(r => r.id > lastReadReviewId).length;
              setUnreadCount(newUnreadCount);
              setShowUnreadModal(true);
            }
          }
        }
      } catch (error) {
        console.error('Failed to fetch reviews:', error);
      }
    };
    fetchReviews();
  }, []);

  // Polling for new reviews (Admin notifications)
  useEffect(() => {
    const pollReviews = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/reviews');
        if (response.ok) {
          const data = await response.json();

          // Calculate total counts
          const allServerReviews = Object.values(data).flat();
          const serverCount = allServerReviews.length;
          const localCount = Object.values(reviews).flat().length;

          // If server has more reviews, it means new feedback was submitted
          if (serverCount > localCount) {
            setReviews(data);

            // Check for unread (ID based)
            const maxServerId = Math.max(0, ...allServerReviews.map(r => r.id));
            if (maxServerId > lastReadReviewId && !isStudentMode) {
              const newUnreadCount = allServerReviews.filter(r => r.id > lastReadReviewId).length;
              setUnreadCount(newUnreadCount);
              setShowUnreadModal(true);
            }
          }
        }
      } catch (error) {
        console.error('Failed to poll reviews:', error);
      }
    };

    const interval = setInterval(pollReviews, 30000); // 30 second polling
    return () => clearInterval(interval);
  }, [reviews, isStudentMode]);

  const addNotification = (message, type = 'info') => {
    const notification = {
      id: Date.now(),
      message,
      type,
      timestamp: new Date().toLocaleTimeString()
    };
    setNotifications(prev => [notification, ...prev].slice(0, 5));
  };

  const checkConflict = (newClass, excludeId = null) => {
    // Helper to check time overlap (assuming simple string match logic for now as per current codebase)
    // Detailed overlap logic (e.g. standardizing time formats) would be robust, 
    // but here we check exact matches on time strings as used elsewhere.

    // Check Room Conflict
    const roomConflict = classes.find(cls => {
      if (excludeId && cls.id === excludeId) return false;
      return cls.days === newClass.days &&
        cls.time === newClass.time &&
        cls.room === newClass.room;
    });

    if (roomConflict) return { conflict: true, type: 'room', message: `Conflict! Room ${newClass.room} is already booked by ${roomConflict.courseCode}.` };

    // Check Instructor Conflict
    const instructorConflict = classes.find(cls => {
      if (excludeId && cls.id === excludeId) return false;
      return cls.days === newClass.days &&
        cls.time === newClass.time &&
        cls.faculty.toLowerCase().trim() === newClass.faculty.toLowerCase().trim();
    });

    if (instructorConflict) return { conflict: true, type: 'instructor', message: `Conflict! Instructor ${newClass.faculty} is already teaching ${instructorConflict.courseCode} at this time.` };

    return { conflict: false };
  };

  const toggleStudentView = () => {
    const newMode = !isStudentMode;
    setIsStudentMode(newMode);

    // Set default sort by Course Code when entering student mode
    if (newMode) {
      setSortConfig({ key: 'courseCode', direction: 'asc' });
    } else {
      setSortConfig({ key: null, direction: null });
    }

    addNotification(
      newMode ? 'Switched to Student View' : 'Switched to Admin View',
      'info'
    );
  };

  const openModal = (classToEdit = null) => {
    if (classToEdit) {
      setEditingClass(classToEdit);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingClass(null);
  };

  const openAIModal = () => {
    setIsAIModalOpen(true);
  };

  const closeAIModal = () => {
    setIsAIModalOpen(false);
  };

  const handleAddClass = (newClass) => {
    const conflictCheck = checkConflict(newClass, editingClass?.id);
    if (conflictCheck.conflict) {
      // Show Conflict Modal instead of just a toast
      setConflictDetails({
        message: conflictCheck.message,
        type: conflictCheck.type
      });
      setShowConflictModal(true);
      return false;
    }

    if (editingClass) {
      // Update on backend
      const updateOnBackend = async () => {
        try {
          const response = await fetch(`http://localhost:5000/api/classes/${editingClass.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newClass)
          });
          if (response.ok) {
            const updated = await response.json();
            setClasses(prev => prev.map(cls =>
              cls.id === editingClass.id ? updated : cls
            ));
            addNotification(`${newClass.courseCode} updated successfully!`, 'success');
          }
        } catch (error) {
          addNotification('Failed to update class on server', 'error');
        }
      };
      updateOnBackend();
    } else {
      // Add on backend
      const addToBackend = async () => {
        try {
          const response = await fetch('http://localhost:5000/api/classes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...newClass, enrolled: 0 })
          });
          if (response.ok) {
            const added = await response.json();
            setClasses(prev => [...prev, added]);
            addNotification(`${newClass.courseCode} added successfully!`, 'success');
          }
        } catch (error) {
          addNotification('Failed to add class to server', 'error');
        }
      };
      addToBackend();
    }
    return true;
  };

  const handleDelete = (classId, courseName) => {
    if (window.confirm(`Are you sure you want to delete ${courseName}?`)) {
      const deleteFromBackend = async () => {
        try {
          const response = await fetch(`http://localhost:5000/api/classes/${classId}`, {
            method: 'DELETE'
          });
          if (response.ok) {
            setClasses(prev => prev.filter(cls => cls.id !== classId));
            addNotification(`${courseName} deleted successfully!`, 'success');
          }
        } catch (error) {
          addNotification('Failed to delete class from server', 'error');
        }
      };
      deleteFromBackend();
    }
  };

  const toggleFavorite = (classId) => {
    setFavorites(prev => {
      const isFavorite = prev.includes(classId);
      if (isFavorite) {
        addNotification('Removed from favorites', 'info');
        return prev.filter(id => id !== classId);
      } else {
        addNotification('Added to favorites', 'success');
        return [...prev, classId];
      }
    });
  };

  const handleEnrollment = (cls) => {
    const isEnrolled = enrolledClasses.includes(cls.id);

    if (isEnrolled) {
      setEnrolledClasses(prev => prev.filter(id => id !== cls.id));
      setClasses(prev => prev.map(c =>
        c.id === cls.id ? { ...c, enrolled: c.enrolled - 1 } : c
      ));
      addNotification(`Unenrolled from ${cls.courseCode}`, 'info');
    } else {
      if (cls.enrolled >= cls.maxCapacity) {
        setSelectedClassForAction(cls);
        setShowWaitlistModal(true);
        return;
      }

      const conflict = classes.find(c =>
        enrolledClasses.includes(c.id) &&
        c.days === cls.days &&
        c.time === cls.time
      );

      if (conflict) {
        addNotification(`Time conflict with ${conflict.courseCode}!`, 'error');
        return;
      }

      setEnrolledClasses(prev => [...prev, cls.id]);
      setClasses(prev => prev.map(c =>
        c.id === cls.id ? { ...c, enrolled: c.enrolled + 1 } : c
      ));
      addNotification(`Enrolled in ${cls.courseCode}`, 'success');
    }
  };

  const exportToCSV = () => {
    const headers = ['Course Code', 'Section', 'Instructor', 'Room', 'Time', 'Days', 'Enrolled', 'Capacity'];
    const rows = classes.map(cls => [
      cls.courseCode,
      cls.section,
      cls.faculty,
      cls.room,
      cls.time,
      cls.days,
      cls.enrolled,
      cls.maxCapacity
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `class-schedule-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    addNotification('Schedule exported successfully!', 'success');
  };

  const handleSort = (key) => {
    let direction = 'asc';
    // If it's a new sort by 'id' (Creation Order), default to descending (newest first)
    if (key === 'id' && sortConfig.key !== 'id') {
      direction = 'desc';
    } else if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const applyGeneratedSchedule = (scheduleClasses) => {
    const classesToSave = scheduleClasses.map(cls => ({
      ...cls,
      maxCapacity: 35,
      enrolled: 0
    }));

    const saveToBackend = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/classes/bulk', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(classesToSave)
        });
        if (response.ok) {
          const added = await response.json();
          setClasses(prev => [...prev, ...added]);
          addNotification(`Applied ${added.length} classes from AI schedule!`, 'success');
        }
      } catch (error) {
        addNotification('Failed to save AI schedule to server', 'error');
      }
    };
    saveToBackend();
  };

  return (
    <div className={`text-slate-800 h-screen flex overflow-hidden transition-colors duration-300 theme-${currentTheme} ${isDarkMode ? 'bg-slate-900' : 'bg-slate-50'
      }`}>
      <Sidebar
        isStudentMode={isStudentMode}
        isDarkMode={isDarkMode}
        activeView={activeView}
        setActiveView={setActiveView}
        toggleStudentView={toggleStudentView}
        setIsDarkMode={setIsDarkMode}
        addNotification={addNotification}
        setShowThemeSelector={setShowThemeSelector}
      />

      <main className={`flex-1 flex flex-col h-screen overflow-hidden relative transition-colors duration-300 ${isDarkMode ? 'bg-slate-900' : 'bg-slate-50/50'
        }`}>
        {isStudentMode && (
          <div className="bg-slate-900 text-white text-xs text-center py-1 font-medium tracking-wide">
            PREVIEWING AS STUDENT (READ ONLY)
          </div>
        )}

        <Header
          activeView={activeView}
          isDarkMode={isDarkMode}
          isStudentMode={isStudentMode}
          classes={classes}
          notifications={notifications}
          showNotifications={showNotifications}
          setShowNotifications={setShowNotifications}
          exportToCSV={exportToCSV}
          openAIModal={openAIModal}
          openModal={openModal}
          setShowCalendarModal={setShowCalendarModal}
        />

        <div className="flex-1 overflow-y-auto p-8">
          {activeView === 'dashboard' ? (
            <Dashboard classes={classes} reviews={reviews} isDarkMode={isDarkMode} />
          ) : activeView === 'calendar' ? (
            <CalendarView
              classes={classes}
              enrolledClasses={enrolledClasses}
              isDarkMode={isDarkMode}
              academicEvents={academicEvents}
            />
          ) : activeView === 'reviews' ? (
            <AllReviews
              reviews={reviews}
              classes={classes}
              isDarkMode={isDarkMode}
              setActiveView={setActiveView}
            />
          ) : (
            <ScheduleView
              classes={classes}
              isDarkMode={isDarkMode}
              isStudentMode={isStudentMode}
              favorites={favorites}
              enrolledClasses={enrolledClasses}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              sortConfig={sortConfig}
              handleSort={handleSort}
              toggleFavorite={toggleFavorite}
              handleEnrollment={handleEnrollment}
              openModal={openModal}
              handleDelete={handleDelete}
              setShowReviewsModal={setShowReviewsModal}
              setShowGradeCalc={setShowGradeCalc}
              setShowQRGenerator={setShowQRGenerator}
              setSelectedClassForAction={setSelectedClassForAction}
              reviews={reviews}
            />
          )}
        </div>
      </main>

      <AddClassModal
        isOpen={isModalOpen}
        closeModal={closeModal}
        editingClass={editingClass}
        handleAddClass={handleAddClass}
        isDarkMode={isDarkMode}
      />

      <AIScheduleModal
        isOpen={isAIModalOpen}
        closeModal={closeAIModal}
        isDarkMode={isDarkMode}
        addNotification={addNotification}
        applyGeneratedSchedule={applyGeneratedSchedule}
      />

      <ReviewsModal
        isOpen={showReviewsModal}
        closeModal={() => setShowReviewsModal(false)}
        selectedClass={selectedClassForAction}
        reviews={reviews[selectedClassForAction?.id] || []}
        addReview={(classId, review) => {
          setReviews(prev => ({
            ...prev,
            [classId]: [...(prev[classId] || []), review]
          }));
          addNotification('Review submitted successfully!', 'success');
          setActiveView('schedule');
        }}
        isDarkMode={isDarkMode}
        isStudentMode={isStudentMode}
      />

      <WaitlistModal
        isOpen={showWaitlistModal}
        closeModal={() => setShowWaitlistModal(false)}
        selectedClass={selectedClassForAction}
        waitlist={waitlists[selectedClassForAction?.id] || []}
        joinWaitlist={(classId, studentInfo) => {
          setWaitlists(prev => ({
            ...prev,
            [classId]: [...(prev[classId] || []), studentInfo]
          }));
          addNotification('Added to waitlist successfully!', 'success');
          setShowWaitlistModal(false);
        }}
        isDarkMode={isDarkMode}
      />

      <ThemeSelector
        isOpen={showThemeSelector}
        closeModal={() => setShowThemeSelector(false)}
        currentTheme={currentTheme}
        setCurrentTheme={setCurrentTheme}
        isDarkMode={isDarkMode}
      />

      <QRCodeGenerator
        isOpen={showQRGenerator}
        closeModal={() => setShowQRGenerator(false)}
        selectedClass={selectedClassForAction}
        isDarkMode={isDarkMode}
      />

      <GradeCalculator
        isOpen={showGradeCalc}
        closeModal={() => setShowGradeCalc(false)}
        selectedClass={selectedClassForAction}
        isDarkMode={isDarkMode}
      />

      <AcademicCalendarModal
        isOpen={showCalendarModal}
        closeModal={() => setShowCalendarModal(false)}
        academicEvents={academicEvents}
        setAcademicEvents={setAcademicEvents}
        isDarkMode={isDarkMode}
        addNotification={addNotification}
        goToCalendar={() => setActiveView('calendar')}
      />

      <ConflictModal
        isOpen={showConflictModal}
        onClose={() => setShowConflictModal(false)}
        message={conflictDetails.message}
        type={conflictDetails.type}
      />

      <UnreadReviewsModal
        isOpen={showUnreadModal}
        closeModal={() => {
          setShowUnreadModal(false);
          // Mark as read
          const allReviews = Object.values(reviews).flat();
          const maxId = Math.max(0, ...allReviews.map(r => r.id));
          setLastReadReviewId(maxId);
          localStorage.setItem('lastReadReviewId', maxId.toString());
        }}
        unreadCount={unreadCount}
        isDarkMode={isDarkMode}
        onView={() => {
          setShowUnreadModal(false);
          const allReviews = Object.values(reviews).flat();
          const maxId = Math.max(0, ...allReviews.map(r => r.id));
          setLastReadReviewId(maxId);
          localStorage.setItem('lastReadReviewId', maxId.toString());
          setActiveView('reviews');
        }}
      />
    </div>
  );
};

export default App;