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
import './App.css';

const App = () => {
  const [isStudentMode, setIsStudentMode] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [classes, setClasses] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
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
  const [academicEvents, setAcademicEvents] = useState([]);
  const [showCalendarModal, setShowCalendarModal] = useState(false);

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

  useEffect(() => {
    localStorage.setItem('academicEvents', JSON.stringify(academicEvents));
  }, [academicEvents]);

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
    return classes.some(cls => {
      if (excludeId && cls.id === excludeId) return false;
      return cls.days === newClass.days &&
        cls.time === newClass.time &&
        cls.room === newClass.room;
    });
  };

  const toggleStudentView = () => {
    setIsStudentMode(!isStudentMode);
    addNotification(
      !isStudentMode ? 'Switched to Student View' : 'Switched to Admin View',
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
    if (checkConflict(newClass, editingClass?.id)) {
      addNotification('Conflict detected! Another class is scheduled at the same time and room.', 'error');
      return false;
    }

    if (editingClass) {
      setClasses(prev => prev.map(cls =>
        cls.id === editingClass.id ? { ...newClass, id: cls.id } : cls
      ));
      addNotification(`${newClass.courseCode} updated successfully!`, 'success');
    } else {
      const classWithId = {
        id: Date.now(),
        ...newClass,
        enrolled: 0
      };
      setClasses(prev => [...prev, classWithId]);
      addNotification(`${newClass.courseCode} added successfully!`, 'success');
    }
    return true;
  };

  const handleDelete = (classId, courseName) => {
    if (window.confirm(`Are you sure you want to delete ${courseName}?`)) {
      setClasses(prev => prev.filter(cls => cls.id !== classId));
      addNotification(`${courseName} deleted successfully!`, 'success');
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
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const applyGeneratedSchedule = (scheduleClasses) => {
    const newClasses = scheduleClasses.map(cls => ({
      id: Date.now() + Math.random(),
      ...cls,
      maxCapacity: 35,
      enrolled: 0
    }));

    setClasses(prev => [...prev, ...newClasses]);
    addNotification(`Applied ${newClasses.length} classes from AI schedule!`, 'success');
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
            <Dashboard classes={classes} isDarkMode={isDarkMode} />
          ) : activeView === 'calendar' ? (
            <CalendarView
              classes={classes}
              enrolledClasses={enrolledClasses}
              isDarkMode={isDarkMode}
              academicEvents={academicEvents}
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
        }}
        isDarkMode={isDarkMode}
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
    </div>
  );
};

export default App;