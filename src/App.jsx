import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import StudentLayout from './components/StudentLayout';
import AdminLayout from './components/AdminLayout';
import { login } from './api';
import './App.css';

const App = () => {
  const handleLogin = async (username, password) => {
    await login(username, password);
  };

  return (
    <Router>
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Login Page */}
        <Route 
          path="/login" 
          element={<LoginPage onLogin={handleLogin} isDarkMode={false} />} 
        />
        
        {/* Student View */}
        <Route path="/student" element={<StudentLayout />} />
        
        {/* Admin Dashboard */}
        <Route path="/admin" element={<AdminLayout />} />
        
        {/* Redirect unknown routes to landing */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
