import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, AlertCircle } from 'lucide-react';

const LoginPage = ({ onLogin, isDarkMode }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }

    setLoading(true);
    try {
      await onLogin(username, password);
      navigate('/admin', { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${
      isDarkMode ? 'bg-slate-900' : 'bg-slate-50'
    }`}>
      <div className={`w-full max-w-md p-8 rounded-lg shadow-lg transition-colors duration-300 ${
        isDarkMode ? 'bg-slate-800 text-white' : 'bg-white text-slate-800'
      }`}>
        <div className="text-center mb-8">
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
            isDarkMode ? 'bg-slate-700' : 'bg-slate-100'
          }`}>
            <LogIn className="w-8 h-8 text-slate-600" />
          </div>
          <h1 className="text-2xl font-bold mb-2">NSU Class Scheduler</h1>
          <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Admin Login
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <div>
            <label className={`block text-sm font-medium mb-2 ${
              isDarkMode ? 'text-slate-300' : 'text-slate-700'
            }`}>
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={`w-full px-4 py-2 rounded-lg border transition-colors duration-200 ${
                isDarkMode
                  ? 'bg-slate-700 border-slate-600 text-white focus:border-slate-500'
                  : 'bg-white border-slate-300 text-slate-800 focus:border-slate-400'
              } focus:outline-none focus:ring-2 focus:ring-slate-500/20`}
              placeholder="Enter username"
              autoComplete="username"
              disabled={loading}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${
              isDarkMode ? 'text-slate-300' : 'text-slate-700'
            }`}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full px-4 py-2 rounded-lg border transition-colors duration-200 ${
                isDarkMode
                  ? 'bg-slate-700 border-slate-600 text-white focus:border-slate-500'
                  : 'bg-white border-slate-300 text-slate-800 focus:border-slate-400'
              } focus:outline-none focus:ring-2 focus:ring-slate-500/20`}
              placeholder="Enter password"
              autoComplete="current-password"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-medium transition-all duration-200 ${
              loading
                ? 'bg-slate-400 cursor-not-allowed'
                : isDarkMode
                ? 'bg-slate-700 hover:bg-slate-600 text-white'
                : 'bg-slate-800 hover:bg-slate-700 text-white'
            }`}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
