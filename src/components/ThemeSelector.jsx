import React from 'react';
import { X, Palette, Check } from 'lucide-react';

const ThemeSelector = ({ isOpen, closeModal, currentTheme, setCurrentTheme, isDarkMode }) => {
  const themes = [
    { id: 'default', name: 'Default Blue', colors: 'from-blue-500 to-indigo-600' },
    { id: 'purple', name: 'Purple Pride', colors: 'from-purple-500 to-pink-600' },
    { id: 'emerald', name: 'Emerald Fresh', colors: 'from-emerald-500 to-teal-600' },
    { id: 'ocean', name: 'Ocean Deep', colors: 'from-cyan-500 to-blue-700' },
    { id: 'sunset', name: 'Sunset Warm', colors: 'from-orange-500 to-red-600' },
    { id: 'midnight', name: 'Midnight Dark', colors: 'from-slate-700 to-slate-900' }
  ];

  const handleThemeChange = (themeId) => {
    setCurrentTheme(themeId);
    document.documentElement.setAttribute('data-theme', themeId);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Enhanced backdrop with blur effect */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-backdrop-enter" onClick={closeModal} />
      {/* Modal container with animation */}
      <div className={`relative w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-modal-enter ${
        isDarkMode ? 'bg-slate-800 shadow-slate-900/50' : 'bg-white shadow-slate-200'
      }`}>
        {/* Header with clear title and close button */}
        <div className={`px-6 py-4 border-b flex justify-between items-center ${
          isDarkMode ? 'border-slate-700 bg-gradient-to-r from-purple-900/30 to-pink-900/30' : 'border-slate-100 bg-gradient-to-r from-purple-50 to-pink-50'
        }`}>
          <div className="flex items-center gap-3">
            <Palette className="w-6 h-6 text-purple-600" strokeWidth={1.75} />
            <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Choose Your Theme
            </h3>
          </div>
          <button 
            onClick={closeModal} 
            className={`p-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              isDarkMode 
                ? 'text-slate-400 hover:text-white hover:bg-slate-700/50 focus:ring-purple-500' 
                : 'text-slate-400 hover:text-slate-900 hover:bg-slate-100 focus:ring-purple-400'
            }`}
          >
            <X className="w-5 h-5" strokeWidth={1.75} />
          </button>
        </div>

        <div className="px-6 py-5 max-h-[60vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            {themes.map(theme => (
              <button
                key={theme.id}
                onClick={() => handleThemeChange(theme.id)}
                className={`p-6 rounded-xl border-2 transition-all duration-200 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  currentTheme === theme.id
                    ? 'border-purple-600 shadow-lg focus:ring-purple-400'
                    : isDarkMode 
                      ? 'border-slate-700 hover:border-slate-600 focus:ring-slate-500' 
                      : 'border-slate-200 hover:border-slate-300 focus:ring-slate-400'
                }`}
              >
                <div className={`w-full h-24 rounded-xl bg-gradient-to-br ${theme.colors} mb-4 flex items-center justify-center shadow-inner`}>
                  {currentTheme === theme.id && (
                    <Check className="w-12 h-12 text-white drop-shadow-md" strokeWidth={2} />
                  )}
                </div>
                <p className={`font-semibold text-center ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  {theme.name}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeSelector;
