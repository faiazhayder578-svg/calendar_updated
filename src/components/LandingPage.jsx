import { useNavigate } from 'react-router-dom';
import { Calendar, Users, BookOpen, ArrowRight, LayoutDashboard, ShieldCheck, Clock } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-900 rounded-lg shadow-md">
              <Calendar className="w-6 h-6 text-white" strokeWidth={1.75} />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">NSU Class Scheduler</h1>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16 animate-fade-in">
          <span className="inline-block px-4 py-1.5 bg-slate-900/5 text-slate-700 text-sm font-medium rounded-full mb-6 tracking-wide uppercase">
            Academic Management Platform
          </span>
          <h2 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 tracking-tight leading-tight">
            Streamline Your Academic
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900">
              Scheduling
            </span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-12 leading-relaxed">
            A comprehensive platform for managing class schedules, instructor availability, 
            and academic calendars. Designed for efficiency and ease of use.
          </p>

          {/* Action Buttons */}
          <div className="flex items-center justify-center gap-6 flex-wrap">
            <button
              onClick={() => navigate('/student')}
              className="group flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-xl 
                hover:bg-slate-800 active:scale-[0.98] transition-all duration-200 
                shadow-lg hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2"
            >
              <Calendar className="w-5 h-5" strokeWidth={1.75} />
              <span className="font-semibold">View Schedule</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" strokeWidth={1.75} />
            </button>

            <button
              onClick={() => navigate('/login')}
              className="group flex items-center gap-3 px-8 py-4 bg-white text-slate-900 rounded-xl 
                hover:bg-slate-50 active:scale-[0.98] transition-all duration-200 
                shadow-lg hover:shadow-xl border-2 border-slate-200 hover:border-slate-300
                focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
            >
              <LayoutDashboard className="w-5 h-5" strokeWidth={1.75} />
              <span className="font-semibold">Admin Dashboard</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" strokeWidth={1.75} />
            </button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
          <div className="group bg-white rounded-xl p-8 shadow-sm border border-slate-200 
            hover:shadow-lg hover:border-slate-300 hover:-translate-y-1 
            transition-all duration-300 cursor-default">
            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-5
              group-hover:scale-110 group-hover:bg-blue-200 transition-all duration-300">
              <ShieldCheck className="w-7 h-7 text-blue-600" strokeWidth={1.75} />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3 tracking-tight">
              Conflict-Free Planning
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Say goodbye to overlaps. Our smart engine automatically detects time and room 
              conflicts to ensure a perfect schedule every time.
            </p>
          </div>

          <div className="group bg-white rounded-xl p-8 shadow-sm border border-slate-200 
            hover:shadow-lg hover:border-slate-300 hover:-translate-y-1 
            transition-all duration-300 cursor-default">
            <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-5
              group-hover:scale-110 group-hover:bg-green-200 transition-all duration-300">
              <Users className="w-7 h-7 text-green-600" strokeWidth={1.75} />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3 tracking-tight">
              Faculty Hub
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Real-time tracking of instructor availability and teaching loads. Prevent 
              double-bookings and optimize department resources instantly.
            </p>
          </div>

          <div className="group bg-white rounded-xl p-8 shadow-sm border border-slate-200 
            hover:shadow-lg hover:border-slate-300 hover:-translate-y-1 
            transition-all duration-300 cursor-default">
            <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-5
              group-hover:scale-110 group-hover:bg-purple-200 transition-all duration-300">
              <BookOpen className="w-7 h-7 text-purple-600" strokeWidth={1.75} />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3 tracking-tight">
              Live Course Catalog
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Access every detail in one place—from section capacities to room numbers—keeping 
              your academic data organized and accessible.
            </p>
          </div>
        </div>

        {/* Additional Info Section */}
        <div className="mt-20 bg-white rounded-2xl p-12 shadow-sm border border-slate-200 
          hover:shadow-md transition-shadow duration-300">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-3xl font-bold text-slate-900 mb-6 tracking-tight">
              Built for Academic Excellence
            </h3>
            <p className="text-lg text-slate-600 mb-10 leading-relaxed">
              Our platform provides a seamless experience for both administrators and students. 
              Administrators can manage schedules, track instructor availability, and generate 
              reports. Students can browse courses, view schedules, and plan their academic journey.
            </p>
            <div className="flex items-center justify-center gap-8 md:gap-12 text-slate-600 flex-wrap">
              <div className="group">
                <p className="text-4xl font-bold text-slate-900 group-hover:scale-110 transition-transform duration-200">100+</p>
                <p className="text-sm font-medium uppercase tracking-wide mt-1">Courses Managed</p>
              </div>
              <div className="w-px h-14 bg-slate-200 hidden md:block"></div>
              <div className="group">
                <p className="text-4xl font-bold text-slate-900 group-hover:scale-110 transition-transform duration-200">50+</p>
                <p className="text-sm font-medium uppercase tracking-wide mt-1">Instructors</p>
              </div>
              <div className="w-px h-14 bg-slate-200 hidden md:block"></div>
              <div className="group">
                <p className="text-4xl font-bold text-slate-900 group-hover:scale-110 transition-transform duration-200">1000+</p>
                <p className="text-sm font-medium uppercase tracking-wide mt-1">Students Served</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <p className="text-slate-600 text-sm">
              © 2024 NSU Class Scheduler. All rights reserved.
            </p>
            <div className="flex items-center gap-3">
              <div className="p-1.5 bg-slate-900 rounded-md shadow-sm">
                <Calendar className="w-4 h-4 text-white" strokeWidth={1.75} />
              </div>
              <span className="text-sm font-semibold text-slate-900 tracking-tight">NSU Class Scheduler</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
