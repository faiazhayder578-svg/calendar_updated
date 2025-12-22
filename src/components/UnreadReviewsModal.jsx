import React from 'react';
import { MessageSquare, ArrowRight, X } from 'lucide-react';

const UnreadReviewsModal = ({ isOpen, closeModal, unreadCount, isDarkMode, onView }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div
                className={`w-full max-w-md rounded-2xl shadow-2xl border transform transition-all animate-in zoom-in-95 duration-300 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
                    }`}
            >
                <div className="p-6">
                    <div className="flex justify-between items-start mb-6">
                        <div className={`p-3 rounded-xl ${isDarkMode ? 'bg-amber-900/40' : 'bg-amber-50'}`}>
                            <MessageSquare className={`w-8 h-8 ${isDarkMode ? 'text-amber-400' : 'text-amber-600'}`} />
                        </div>
                        <button
                            onClick={closeModal}
                            className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-400'
                                }`}
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="space-y-2 mb-8">
                        <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                            New Student Feedback!
                        </h2>
                        <p className={`${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                            You have <span className="font-bold text-amber-500">{unreadCount}</span> new unread review{unreadCount !== 1 ? 's' : ''} from students.
                        </p>
                    </div>

                    <div className="flex flex-col gap-3">
                        <button
                            onClick={onView}
                            className="w-full py-3.5 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-all flex items-center justify-center gap-2 group shadow-lg shadow-slate-900/20"
                        >
                            <span>View New Feedback</span>
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </button>
                        <button
                            onClick={closeModal}
                            className={`w-full py-3.5 rounded-xl font-medium transition-all ${isDarkMode
                                    ? 'text-slate-400 hover:text-white hover:bg-slate-700'
                                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                                }`}
                        >
                            Dismiss
                        </button>
                    </div>
                </div>

                <div className={`px-6 py-4 border-t text-[11px] font-medium text-center uppercase tracking-wider ${isDarkMode ? 'border-slate-700 text-slate-500' : 'border-slate-100 text-slate-400'
                    }`}>
                    Administrator Notification System
                </div>
            </div>
        </div>
    );
};

export default UnreadReviewsModal;
