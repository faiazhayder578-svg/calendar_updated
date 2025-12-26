import React, { useState } from 'react';
import { QrCode, X, Download, CheckCircle } from 'lucide-react';

const QRCodeGenerator = ({ isOpen, closeModal, selectedClass, isDarkMode }) => {
  const [attendanceCode] = useState(Math.random().toString(36).substring(7).toUpperCase());

  const generateQRCode = () => {
    // In a real app, this would generate an actual QR code
    const qrData = `CLASS:${selectedClass?.courseCode}-${selectedClass?.section}|CODE:${attendanceCode}|TIME:${new Date().toISOString()}`;
    return qrData;
  };

  if (!isOpen || !selectedClass) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Enhanced backdrop with blur effect */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-backdrop-enter" onClick={closeModal} />
      {/* Modal container with animation */}
      <div className={`relative w-full max-w-md rounded-2xl shadow-2xl animate-modal-enter ${
        isDarkMode ? 'bg-slate-800 shadow-slate-900/50' : 'bg-white shadow-slate-200'
      }`}>
        {/* Header with clear title and close button */}
        <div className={`px-6 py-4 border-b flex justify-between items-center ${
          isDarkMode ? 'border-slate-700' : 'border-slate-100'
        }`}>
          <div className="flex items-center gap-3">
            <QrCode className="w-6 h-6 text-blue-600" strokeWidth={1.75} />
            <div>
              <h3 className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                Attendance QR Code
              </h3>
              <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                {selectedClass.courseCode} - {selectedClass.section}
              </p>
            </div>
          </div>
          <button 
            onClick={closeModal} 
            className={`p-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              isDarkMode 
                ? 'text-slate-400 hover:text-white hover:bg-slate-700/50 focus:ring-blue-500' 
                : 'text-slate-400 hover:text-slate-900 hover:bg-slate-100 focus:ring-blue-400'
            }`}
          >
            <X className="w-5 h-5" strokeWidth={1.75} />
          </button>
        </div>

        <div className="px-6 py-5 text-center">
          {/* QR Code Placeholder */}
          <div className={`w-64 h-64 mx-auto mb-5 rounded-2xl border-4 border-dashed flex items-center justify-center ${
            isDarkMode ? 'border-slate-600 bg-slate-700/30' : 'border-slate-300 bg-slate-50'
          }`}>
            <div className="text-center">
              <QrCode className={`w-32 h-32 mx-auto mb-2 ${isDarkMode ? 'text-slate-600' : 'text-slate-300'}`} strokeWidth={1.5} />
              <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Scan to check in
              </p>
            </div>
          </div>

          {/* Attendance Code */}
          <div className={`p-4 rounded-xl mb-5 ${isDarkMode ? 'bg-blue-900/20' : 'bg-blue-50'}`}>
            <p className={`text-xs mb-1.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Manual Code:
            </p>
            <p className={`text-2xl font-bold tracking-widest ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
              {attendanceCode}
            </p>
          </div>

          {/* Info */}
          <div className={`flex items-start gap-2.5 p-3.5 rounded-xl mb-5 ${isDarkMode ? 'bg-emerald-900/20' : 'bg-emerald-50'}`}>
            <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" strokeWidth={1.75} />
            <p className={`text-xs text-left leading-relaxed ${isDarkMode ? 'text-emerald-300' : 'text-emerald-700'}`}>
              This code expires in 15 minutes. Students can scan the QR code or enter the manual code to mark attendance.
            </p>
          </div>

          {/* Actions */}
          <button className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold inline-flex items-center justify-center gap-2 transition-all duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 active:scale-[0.98]">
            <Download className="w-4 h-4" strokeWidth={1.75} />
            Download QR Code
          </button>
        </div>
      </div>
    </div>
  );
};

export default QRCodeGenerator;
