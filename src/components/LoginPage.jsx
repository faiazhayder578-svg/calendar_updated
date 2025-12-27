import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, AlertCircle, Loader2, Calendar, Eye, EyeOff } from 'lucide-react';

const LoginPage = ({ onLogin, isDarkMode }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
    <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 page-background ${isDarkMode ? 'bg-slate-900' : 'bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200'
      }`}>
      {/* Background Decorative Elements */}
      <div className="page-bg-blur-1"></div>
      <div className="page-bg-blur-2"></div>
      <div className="page-bg-shape-1"></div>
      <div className="page-bg-shape-2"></div>
      <div className="page-bg-shape-3"></div>

      <div className={`relative z-10 w-full max-w-md p-8 rounded-2xl shadow-xl transition-all duration-300 animate-fade-in-up ${isDarkMode ? 'bg-slate-800/90 backdrop-blur-xl text-white border border-slate-700' : 'bg-white/90 backdrop-blur-xl text-slate-800 border border-slate-200'
        }`}>
        <div className="text-center mb-8 animate-fade-in-up-delay-1">
          <div className="login-logo-icon inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 shadow-md text-white">
            <Calendar className="w-8 h-8" strokeWidth={1.75} />
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

          <div className="animate-fade-in-up-delay-2">
            <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'
              }`}>
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 ${isDarkMode
                ? 'bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-slate-400 focus:bg-slate-700'
                : 'bg-slate-50 border-slate-200 text-slate-800 placeholder:text-slate-500 focus:border-slate-400 focus:bg-white'
                } focus:outline-none focus:ring-4 focus:ring-slate-500/10`}
              placeholder="Enter username"
              autoComplete="username"
              disabled={loading}
              aria-describedby={error ? 'login-error' : undefined}
            />
          </div>

          <div className="animate-fade-in-up-delay-3">
            <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'
              }`}>
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-4 py-3 pr-12 rounded-xl border-2 transition-all duration-200 ${isDarkMode
                  ? 'bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-slate-400 focus:bg-slate-700'
                  : 'bg-slate-50 border-slate-200 text-slate-800 placeholder:text-slate-500 focus:border-slate-400 focus:bg-white'
                  } focus:outline-none focus:ring-4 focus:ring-slate-500/10`}
                placeholder="Enter password"
                autoComplete="current-password"
                disabled={loading}
                aria-describedby={error ? 'login-error' : undefined}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-colors ${isDarkMode
                  ? 'text-slate-400 hover:text-white hover:bg-slate-600'
                  : 'text-slate-400 hover:text-slate-700 hover:bg-slate-200'
                  }`}
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" strokeWidth={1.75} />
                ) : (
                  <Eye className="w-5 h-5" strokeWidth={1.75} />
                )}
              </button>
            </div>
          </div>

          <div className="animate-fade-in-up-delay-4">
            <button
              type="submit"
              disabled={loading}
              className={`login-btn-primary w-full py-3.5 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${loading
                ? 'bg-slate-400 cursor-not-allowed text-slate-200'
                : 'text-white active:scale-[0.98]'
                } focus:outline-none focus:ring-2 focus:ring-offset-2`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" strokeWidth={1.75} />
                  <span>Logging in...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-5 h.5" strokeWidth={1.75} />
                  <span>Login</span>
                </>
              )}
            </button>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700 animate-fade-in-up-delay-5">
          <p className={`text-center text-sm ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>
            Need help? Contact your administrator
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
