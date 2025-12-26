import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, AlertCircle, Loader2, Calendar } from 'lucide-react';

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
      isDarkMode ? 'bg-slate-900' : 'bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200'
    }`}>
      <div className={`w-full max-w-md p-8 rounded-2xl shadow-xl transition-all duration-300 animate-fade-in ${
        isDarkMode ? 'bg-slate-800 text-white border border-slate-700' : 'bg-white text-slate-800 border border-slate-200'
      }`}>
        <div className="text-center mb-8">
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 shadow-md ${
            isDarkMode ? 'bg-slate-700' : 'bg-slate-900'
          }`}>
            <Calendar className={`w-8 h-8 ${isDarkMode ? 'text-slate-300' : 'text-white'}`} strokeWidth={1.75} />
          </div>
          <h1 className="text-2xl font-bold mb-2 tracking-tight">NSU Class Scheduler</h1>
          <p className={`text-sm font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            Admin Login
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div 
              id="login-error"
              role="alert"
              className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 animate-shake"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-red-500" strokeWidth={1.75} aria-hidden="true" />
              </div>
              <span className="text-sm font-medium text-red-600 dark:text-red-400">{error}</span>
            </div>
          )}

          <div>
            <label className={`block text-sm font-semibold mb-2 ${
              isDarkMode ? 'text-slate-300' : 'text-slate-700'
            }`}>
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                isDarkMode
                  ? 'bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-slate-400 focus:bg-slate-700'
                  : 'bg-slate-50 border-slate-200 text-slate-800 placeholder:text-slate-500 focus:border-slate-400 focus:bg-white'
              } focus:outline-none focus:ring-4 focus:ring-slate-500/10`}
              placeholder="Enter username"
              autoComplete="username"
              disabled={loading}
              aria-describedby={error ? 'login-error' : undefined}
            />
          </div>

          <div>
            <label className={`block text-sm font-semibold mb-2 ${
              isDarkMode ? 'text-slate-300' : 'text-slate-700'
            }`}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                isDarkMode
                  ? 'bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-slate-400 focus:bg-slate-700'
                  : 'bg-slate-50 border-slate-200 text-slate-800 placeholder:text-slate-500 focus:border-slate-400 focus:bg-white'
              } focus:outline-none focus:ring-4 focus:ring-slate-500/10`}
              placeholder="Enter password"
              autoComplete="current-password"
              disabled={loading}
              aria-describedby={error ? 'login-error' : undefined}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3.5 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
              loading
                ? 'bg-slate-400 cursor-not-allowed text-slate-200'
                : isDarkMode
                ? 'bg-slate-700 hover:bg-slate-600 active:scale-[0.98] text-white shadow-lg hover:shadow-xl'
                : 'bg-slate-900 hover:bg-slate-800 active:scale-[0.98] text-white shadow-lg hover:shadow-xl'
            } focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 ${isDarkMode ? 'focus:ring-offset-slate-800' : 'focus:ring-offset-white'}`}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" strokeWidth={1.75} />
                <span>Logging in...</span>
              </>
            ) : (
              <>
                <LogIn className="w-5 h-5" strokeWidth={1.75} />
                <span>Login</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
          <p className={`text-center text-sm ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>
            Need help? Contact your administrator
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
