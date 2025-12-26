import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import Dashboard from './Dashboard';
import ScheduleView from './ScheduleView';
import AddClassModal from './AddClassModal';
import CalendarView from './CalendarView';
import InstructorAvailability from './InstructorAvailability';
import ThemeSelector from './ThemeSelector';
import AcademicCalendarModal from './AcademicCalendarModal';
import ConflictModal from './ConflictModal';
import ChangePasswordModal from './ChangePasswordModal';
import AIScheduleModal from './AIScheduleModal';
import { logout, changePassword, checkAuth } from '../api';

const AdminLayout = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  
  const [isStudentMode, setIsStudentMode] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [classes, setClasses] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'desc' });

  const [activeView, setActiveView] = useState('schedule');
  const [editingClass, setEditingClass] = useState(null);
  
  /* ============================================
     THEME STATE - System Detection + Manual Toggle
     ============================================ */
  // Initialize dark mode: check localStorage first, then system preference
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check if user has a stored preference (manual override)
    const storedPreference = localStorage.getItem('darkMode');
    if (storedPreference !== null) {
      return JSON.parse(storedPreference);
    }
    // Fall back to system preference on first load only
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });
  
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [enrolledClasses, setEnrolledClasses] = useState([]);

  const [waitlists, setWaitlists] = useState({});
  const [currentTheme, setCurrentTheme] = useState('default');
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const [selectedClassForAction, setSelectedClassForAction] = useState(null);

  const [academicEvents, setAcademicEventsState] = useState([]);
  const [showCalendarModal, setShowCalendarModal] = useState(false);

  const [showConflictModal, setShowConflictModal] = useState(false);
  const [conflictDetails, setConflictDetails] = useState({ message: '', type: '' });
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);

  const setAcademicEvents = (newEvents) => {
    setAcademicEventsState(prev => {
      const combined = typeof newEvents === 'function' ? newEvents(prev) : newEvents;
      const uniqueEvents = combined.filter((event, index, self) =>
        index === self.findIndex(e =>
          e.title.toLowerCase().trim() === event.title.toLowerCase().trim() &&
          e.startDate === event.startDate
        )
      );
      return uniqueEvents;
    });
  };

  // Check authentication on mount
  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const response = await checkAuth();
        
        if (response.authenticated) {
          setCurrentUser(response.user);
        } else {
          navigate('/login', { replace: true });
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        navigate('/login', { replace: true });
      }
    };
    verifyAuth();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleChangePassword = async (currentPassword, newPassword) => {
    await changePassword(currentPassword, newPassword);
    addNotification('Password changed successfully', 'success');
  };

  // Load data from localStorage on mount
  useEffect(() => {
    const savedClasses = localStorage.getItem('classes');
    const savedFavorites = localStorage.getItem('favorites');
    const savedEnrolled = localStorage.getItem('enrolledClasses');
    // Note: darkMode is initialized in useState with system detection
    const savedWaitlists = localStorage.getItem('waitlists');
    const savedTheme = localStorage.getItem('theme');
    const savedEvents = localStorage.getItem('academicEvents');

    if (savedClasses) setClasses(JSON.parse(savedClasses));
    if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
    if (savedEnrolled) setEnrolledClasses(JSON.parse(savedEnrolled));
    // darkMode already handled in useState initialization
    if (savedWaitlists) setWaitlists(JSON.parse(savedWaitlists));
    if (savedTheme) setCurrentTheme(savedTheme);
    if (savedEvents) setAcademicEvents(JSON.parse(savedEvents));

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
    // Apply dark class to document for global CSS selectors
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem('waitlists', JSON.stringify(waitlists));
  }, [waitlists]);

  useEffect(() => {
    localStorage.setItem('theme', currentTheme);
  }, [currentTheme]);

  useEffect(() => {
    localStorage.setItem('academicEvents', JSON.stringify(academicEvents));

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
  }, []);

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
    const roomConflict = classes.find(cls => {
      if (excludeId && cls.id === excludeId) return false;
      return cls.days === newClass.days &&
        cls.time === newClass.time &&
        cls.room === newClass.room;
    });

    if (roomConflict) return { conflict: true, type: 'room', message: `Conflict! Room ${newClass.room} is already booked by ${roomConflict.courseCode}.` };

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

  const openAIModal = () => setIsAIModalOpen(true);
  const closeAIModal = () => setIsAIModalOpen(false);

  const applyGeneratedSchedule = async (generatedClasses) => {
    for (const cls of generatedClasses) {
      try {
        const response = await fetch('http://localhost:5000/api/classes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...cls, enrolled: 0, maxCapacity: 40 })
        });
        if (response.ok) {
          const added = await response.json();
          setClasses(prev => [...prev, added]);
        }
      } catch (error) {
        console.error('Failed to add generated class:', error);
      }
    }
    addNotification(`Applied ${generatedClasses.length} classes from Auto schedule!`, 'success');
  };

  const handleAddClass = (newClass) => {
    const conflictCheck = checkConflict(newClass, editingClass?.id);
    if (conflictCheck.conflict) {
      setConflictDetails({
        message: conflictCheck.message,
        type: conflictCheck.type
      });
      setShowConflictModal(true);
      return false;
    }

    if (editingClass) {
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
        addNotification(`${cls.courseCode} is full. Waitlist feature not available.`, 'error');
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
    if (key === 'id' && sortConfig.key !== 'id') {
      direction = 'desc';
    } else if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  if (!currentUser) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        isDarkMode ? 'bg-slate-900' : 'bg-slate-50'
      }`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-600 mx-auto mb-4"></div>
          <p className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`text-slate-800 h-screen flex overflow-hidden transition-colors duration-300 theme-${currentTheme} ${isDarkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>
      <Sidebar
        isStudentMode={isStudentMode}
        isDarkMode={isDarkMode}
        activeView={activeView}
        setActiveView={setActiveView}
        toggleStudentView={toggleStudentView}
        setIsDarkMode={setIsDarkMode}
        addNotification={addNotification}
        setShowThemeSelector={setShowThemeSelector}
        currentUser={currentUser}
        onLogout={handleLogout}
        onChangePassword={() => setShowChangePasswordModal(true)}
      />

      <main className={`flex-1 flex flex-col h-screen overflow-hidden relative transition-colors duration-300 ${isDarkMode ? 'bg-slate-900' : 'bg-slate-50/50'}`}>
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
          openModal={openModal}
          setShowCalendarModal={setShowCalendarModal}
          openAIModal={openAIModal}
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
          ) : activeView === 'instructors' ? (
            <InstructorAvailability isDarkMode={isDarkMode} />
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

      <ThemeSelector
        isOpen={showThemeSelector}
        closeModal={() => setShowThemeSelector(false)}
        currentTheme={currentTheme}
        setCurrentTheme={setCurrentTheme}
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

      <ChangePasswordModal
        isOpen={showChangePasswordModal}
        closeModal={() => setShowChangePasswordModal(false)}
        onChangePassword={handleChangePassword}
        isDarkMode={isDarkMode}
      />

      <AIScheduleModal
        isOpen={isAIModalOpen}
        closeModal={closeAIModal}
        isDarkMode={isDarkMode}
        addNotification={addNotification}
        applyGeneratedSchedule={applyGeneratedSchedule}
      />
    </div>
  );
};

export default AdminLayout;
