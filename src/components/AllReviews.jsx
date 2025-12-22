import React from 'react';
import { MessageSquare, Star, ArrowLeft, Calendar, User, BookOpen } from 'lucide-react';

const AllReviews = ({ reviews, classes, isDarkMode, setActiveView }) => {
    const getAllReviews = () => {
        const allReviews = [];
        Object.entries(reviews).forEach(([classId, classReviews]) => {
            const cls = classes.find(c => c.id.toString() === classId.toString());
            if (cls && classReviews) {
                classReviews.forEach(rev => {
                    allReviews.push({
                        ...rev,
                        courseCode: cls.courseCode,
                        faculty: cls.faculty,
                        section: cls.section
                    });
                });
            }
        });

        // Sort by ID (assuming ID is timestamp-based) or Date descending
        return allReviews.sort((a, b) => {
            // Primary sort by ID (usually creation order)
            if (b.id !== a.id) return b.id - a.id;
            // Fallback to date parsing if needed
            return new Date(b.date) - new Date(a.date);
        });
    };

    const sortedReviews = getAllReviews();

    return (
        <div className="space-y-6 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setActiveView('dashboard')}
                        className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'
                            }`}
                        title="Back to Dashboard"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                            Student Feedback Library
                        </h2>
                        <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                            Reviewing all {sortedReviews.length} student comments across all courses
                        </p>
                    </div>
                </div>
            </div>

            {sortedReviews.length === 0 ? (
                <div className={`rounded-2xl border border-dashed p-20 text-center ${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'
                    }`}>
                    <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
                        <MessageSquare className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                        No student feedback yet
                    </h3>
                    <p className={`mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        Student reviews will appear here once they start rating their classes.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {sortedReviews.map((rev) => (
                        <div
                            key={rev.id}
                            className={`rounded-xl border p-6 transition-all hover:shadow-md ${isDarkMode
                                    ? 'bg-slate-800 border-slate-700 hover:border-amber-900/50'
                                    : 'bg-white border-slate-200 hover:border-amber-200'
                                }`}
                        >
                            <div className="flex flex-col md:flex-row md:items-start gap-6">
                                {/* Course Info Header */}
                                <div className="md:w-48 flex-shrink-0">
                                    <div className={`p-3 rounded-lg mb-3 ${isDarkMode ? 'bg-slate-700/50' : 'bg-slate-50'}`}>
                                        <div className="flex items-center gap-2 mb-1">
                                            <BookOpen className="w-3.5 h-3.5 text-blue-500" />
                                            <span className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                                Course
                                            </span>
                                        </div>
                                        <p className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                            {rev.courseCode}
                                        </p>
                                        <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                            Section {rev.section}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-1.5 mb-1">
                                        <User className="w-3.5 h-3.5 text-slate-400" />
                                        <span className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                            {rev.faculty}
                                        </span>
                                    </div>
                                </div>

                                {/* Review Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-center mb-4">
                                        <div className="flex gap-1">
                                            {[1, 2, 3, 4, 5].map(star => (
                                                <Star
                                                    key={star}
                                                    className={`w-5 h-5 ${star <= rev.rating
                                                            ? 'text-amber-400 fill-amber-400'
                                                            : isDarkMode ? 'text-slate-700' : 'text-slate-200'
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-slate-400">
                                            <Calendar className="w-3.5 h-3.5" />
                                            {rev.date}
                                        </div>
                                    </div>

                                    <blockquote className={`text-lg italic font-medium leading-relaxed mb-4 ${isDarkMode ? 'text-slate-200' : 'text-slate-700'
                                        }`}>
                                        "{rev.text}"
                                    </blockquote>

                                    <div className="flex items-center justify-between border-t pt-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'
                                                }`}>
                                                {rev.reviewer.substring(0, 2).toUpperCase()}
                                            </div>
                                            <span className={`text-sm font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                                {rev.reviewer}
                                            </span>
                                        </div>
                                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${isDarkMode ? 'bg-amber-900/20 text-amber-500' : 'bg-amber-50 text-amber-600'
                                            }`}>
                                            Student Rating: {rev.rating}/5
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AllReviews;
