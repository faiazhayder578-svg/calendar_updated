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
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={closeModal} />
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden ${
        isDarkMode ? 'bg-slate-800' : 'bg-white'
      }`}>
        <div className={`px-6 py-4 border-b flex justify-between items-center ${
          isDarkMode ? 'border-slate-700 bg-gradient-to-r from-purple-900/30 to-pink-900/30' : 'border-slate-100 bg-gradient-to-r from-purple-50 to-pink-50'
        }`}>
          <div className="flex items-center gap-3">
            <Palette className="w-6 h-6 text-purple-600" />
            <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Choose Your Theme
            </h3>
          </div>
          <button onClick={closeModal} className={`${isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-400 hover:text-slate-900'}`}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-2 gap-4">
            {themes.map(theme => (
              <button
                key={theme.id}
                onClick={() => handleThemeChange(theme.id)}
                className={`p-6 rounded-xl border-2 transition-all hover:scale-105 ${
                  currentTheme === theme.id
                    ? 'border-purple-600 shadow-lg'
                    : isDarkMode ? 'border-slate-700 hover:border-slate-600' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className={`w-full h-24 rounded-lg bg-gradient-to-br ${theme.colors} mb-4 flex items-center justify-center`}>
                  {currentTheme === theme.id && (
                    <Check className="w-12 h-12 text-white" />
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
