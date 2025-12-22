import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

const ConflictModal = ({ isOpen, onClose, message, type }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100 border border-slate-200 dark:border-slate-700">

                {/* Header with Red Warning Background */}
                <div className="bg-red-50 dark:bg-red-900/20 p-6 flex flex-col items-center justify-center border-b border-red-100 dark:border-red-900/30">
                    <div className="w-16 h-16 bg-red-100 dark:bg-red-800/30 rounded-full flex items-center justify-center mb-4 ring-8 ring-red-50 dark:ring-red-900/20">
                        <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
                    </div>
                    <h3 className="text-xl font-bold text-red-700 dark:text-red-400 text-center">
                        {type === 'room' ? 'Room Conflict Detected' : 'Instructor Conflict Detected'}
                    </h3>
                </div>

                {/* Body */}
                <div className="p-6 text-center">
                    <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed">
                        {message}
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-4">
                        Please resolve this conflict before adding the class.
                    </p>
                </div>

                {/* Footer */}
                <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-700 flex justify-center">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 bg-slate-900 dark:bg-slate-700 text-white dark:text-white rounded-lg font-medium hover:bg-slate-800 dark:hover:bg-slate-600 transition-all shadow-lg hover:shadow-xl active:scale-95"
                    >
                        I Understand
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConflictModal;
