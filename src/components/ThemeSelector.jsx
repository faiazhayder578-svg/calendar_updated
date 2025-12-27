import React, { useState } from 'react';
import { X, Palette, Check } from 'lucide-react';

const ThemeSelector = ({ isOpen, closeModal, currentTheme, setCurrentTheme, isDarkMode }) => {
  // Track selected theme before confirmation
  const [selectedTheme, setSelectedTheme] = useState(currentTheme);

  const themes = [
<<<<<<< HEAD
    { id: 'default', name: 'Classic Teal', colors: 'from-[#124d54] to-[#339fa7]' },
    { id: 'purple', name: 'Purple Pride', colors: 'from-purple-500 to-pink-600' },
    { id: 'emerald', name: 'Emerald Fresh', colors: 'from-emerald-500 to-teal-600' },
=======
    { id: 'default', name: 'Default Blue', colors: 'from-blue-500 to-indigo-600' },
    { id: 'purple', name: 'Purple Pride', colors: 'from-purple-500 to-pink-600' },
    { id: 'emerald', name: 'Emerald Fresh', colors: 'from-emerald-500 to-teal-600' },
    { id: 'ocean', name: 'Ocean Deep', colors: 'from-cyan-500 to-blue-700' },
>>>>>>> 9e987d0bc2b5e1ee9fd668c7dba32ea25ee440fe
    { id: 'sunset', name: 'Sunset Warm', colors: 'from-orange-500 to-red-600' },
    { id: 'midnight', name: 'Midnight Dark', colors: 'from-slate-700 to-slate-900' }
  ];

  // Reset selected theme when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setSelectedTheme(currentTheme);
    }
  }, [isOpen, currentTheme]);

  const handleThemeSelect = (themeId) => {
    setSelectedTheme(themeId);
  };

  const handleConfirm = () => {
    setCurrentTheme(selectedTheme);
    document.documentElement.setAttribute('data-theme', selectedTheme);
    closeModal();
  };

  const handleCancel = () => {
    setSelectedTheme(currentTheme);
    closeModal();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Enhanced backdrop with blur effect */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-backdrop-enter" onClick={handleCancel} />
      {/* Modal container with animation */}
      <div className={`relative w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-modal-enter ${isDarkMode ? 'bg-slate-800 shadow-slate-900/50' : 'bg-white shadow-slate-200'
        }`}>
        {/* Header with clear title and close button */}
<<<<<<< HEAD
        <div className={`px-6 py-4 border-b flex justify-between items-center ${isDarkMode ? 'border-teal-700 bg-gradient-to-r from-teal-900/30 to-emerald-900/30' : 'border-teal-100 bg-gradient-to-r from-teal-50 to-emerald-50'
          }`}>
          <div className="flex items-center gap-3">
            <Palette className="w-6 h-6 text-teal-600" strokeWidth={1.75} />
=======
        <div className={`px-6 py-4 border-b flex justify-between items-center ${isDarkMode ? 'border-slate-700 bg-gradient-to-r from-purple-900/30 to-pink-900/30' : 'border-slate-100 bg-gradient-to-r from-purple-50 to-pink-50'
          }`}>
          <div className="flex items-center gap-3">
            <Palette className="w-6 h-6 text-purple-600" strokeWidth={1.75} />
>>>>>>> 9e987d0bc2b5e1ee9fd668c7dba32ea25ee440fe
            <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Choose Your Theme
            </h3>
          </div>
          <button
            onClick={handleCancel}
            className={`p-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${isDarkMode
<<<<<<< HEAD
              ? 'text-slate-400 hover:text-white hover:bg-slate-700/50 focus:ring-teal-500'
              : 'text-slate-400 hover:text-slate-900 hover:bg-slate-100 focus:ring-teal-400'
=======
                ? 'text-slate-400 hover:text-white hover:bg-slate-700/50 focus:ring-purple-500'
                : 'text-slate-400 hover:text-slate-900 hover:bg-slate-100 focus:ring-purple-400'
>>>>>>> 9e987d0bc2b5e1ee9fd668c7dba32ea25ee440fe
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
                onClick={() => handleThemeSelect(theme.id)}
                className={`p-6 rounded-xl border-2 transition-all duration-200 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 ${selectedTheme === theme.id
<<<<<<< HEAD
                  ? 'border-teal-600 shadow-lg focus:ring-teal-400'
                  : isDarkMode
                    ? 'border-slate-700 hover:border-slate-600 focus:ring-slate-500'
                    : 'border-slate-200 hover:border-slate-300 focus:ring-slate-400'
=======
                    ? 'border-purple-600 shadow-lg focus:ring-purple-400'
                    : isDarkMode
                      ? 'border-slate-700 hover:border-slate-600 focus:ring-slate-500'
                      : 'border-slate-200 hover:border-slate-300 focus:ring-slate-400'
>>>>>>> 9e987d0bc2b5e1ee9fd668c7dba32ea25ee440fe
                  }`}
              >
                <div className={`w-full h-24 rounded-xl bg-gradient-to-br ${theme.colors} mb-4 flex items-center justify-center shadow-inner`}>
                  {selectedTheme === theme.id && (
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

        {/* Footer with Cancel and Confirm buttons */}
        <div className={`px-6 py-4 border-t flex justify-end gap-3 ${isDarkMode ? 'border-slate-700 bg-slate-800/50' : 'border-slate-100 bg-slate-50'
          }`}>
          <button
            onClick={handleCancel}
            className={`px-5 py-2.5 rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-[0.98] ${isDarkMode
<<<<<<< HEAD
              ? 'bg-slate-700 hover:bg-slate-600 text-white focus:ring-slate-500'
              : 'bg-slate-200 hover:bg-slate-300 text-slate-800 focus:ring-slate-400'
=======
                ? 'bg-slate-700 hover:bg-slate-600 text-white focus:ring-slate-500'
                : 'bg-slate-200 hover:bg-slate-300 text-slate-800 focus:ring-slate-400'
>>>>>>> 9e987d0bc2b5e1ee9fd668c7dba32ea25ee440fe
              }`}
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={selectedTheme === currentTheme}
            className={`px-5 py-2.5 rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-[0.98] ${selectedTheme === currentTheme
<<<<<<< HEAD
              ? 'bg-slate-400 text-white cursor-not-allowed'
              : 'bg-gradient-to-r from-[#124d54] to-[#339fa7] hover:from-[#094044] hover:to-[#124d54] text-white shadow-lg shadow-[#124d54]/30 focus:ring-teal-500'
=======
                ? 'bg-slate-400 text-white cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg shadow-purple-500/30 focus:ring-purple-500'
>>>>>>> 9e987d0bc2b5e1ee9fd668c7dba32ea25ee440fe
              }`}
          >
            Apply Theme
          </button>
        </div>
      </div>
    </div>
  );
};

export default ThemeSelector;
