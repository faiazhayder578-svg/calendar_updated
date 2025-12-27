import { useNavigate } from 'react-router-dom';
import { Calendar, Users, BookOpen, ArrowRight, LayoutDashboard, ShieldCheck, Sparkles, Zap, GraduationCap } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-50 pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-[#124d54]/30 via-[#166b74]/20 to-[#339fa7]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-[#094044]/25 via-[#124d54]/15 to-transparent rounded-full blur-3xl translate-y-1/2 -translate-x-1/3 pointer-events-none"></div>

      {/* Floating Decorative Elements */}
      <div className="absolute top-32 left-20 w-16 h-16 bg-gradient-to-br from-[#124d54] to-[#166b74] rounded-2xl opacity-20 animate-float pointer-events-none"></div>
      <div className="absolute top-64 right-32 w-12 h-12 bg-gradient-to-br from-[#339fa7] to-[#66b7bd] rounded-xl opacity-20 animate-float-delayed pointer-events-none"></div>
      <div className="absolute bottom-48 left-1/4 w-10 h-10 bg-gradient-to-br from-[#094044] to-[#124d54] rounded-lg opacity-20 animate-float pointer-events-none"></div>

      {/* Header */}
      <header className="relative bg-white/70 backdrop-blur-xl border-b border-white/50 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="landing-logo-icon p-2.5 rounded-xl shadow-lg text-white">
                <Calendar className="w-6 h-6" strokeWidth={1.75} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">NSU Class Scheduler</h1>
                <p className="landing-subtitle text-[10px] font-semibold uppercase tracking-wider">Academic Management</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/student')}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
              >
                Browse Courses
              </button>
              <button
                onClick={() => navigate('/login')}
                className="landing-btn-primary px-5 py-2.5 text-sm font-semibold text-white rounded-xl shadow-lg hover:scale-105 active:scale-100 transition-all duration-200"
              >
                Admin Login
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-12 sm:pt-20 pb-20 sm:pb-32">
        <div className="text-center mb-12 sm:mb-20 animate-fade-in-up">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-[#124d54]/20 rounded-full shadow-sm mb-8">
            <Sparkles className="w-4 h-4 text-[#124d54]" strokeWidth={2} />
            <span className="text-sm font-semibold text-slate-700">Smart Academic Scheduling</span>
          </div>

          {/* Main Heading */}
          <h2 className="text-3xl sm:text-5xl md:text-7xl font-bold text-slate-900 mb-4 sm:mb-6 tracking-tight leading-[1.1]">
            Streamline Your
            <span className="block mt-2 bg-gradient-to-r from-[#094044] via-[#124d54] to-[#339fa7] bg-clip-text text-transparent">
              Academic Scheduling
            </span>
          </h2>

          {/* Subheading */}
          <p className="text-base sm:text-xl text-slate-600 max-w-2xl mx-auto mb-8 sm:mb-12 leading-relaxed px-4 sm:px-0">
            A comprehensive platform for managing class schedules, instructor availability,
            and academic calendars. Built for efficiency, designed for simplicity.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto px-4 sm:px-0">
            <button
              onClick={() => navigate('/student')}
              className="landing-btn-primary group flex items-center justify-center gap-3 px-6 sm:px-8 py-3 sm:py-4 w-full sm:w-auto text-white rounded-2xl 
                active:scale-[0.98] transition-all duration-200 shadow-xl hover:-translate-y-1
                focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            >
              <Calendar className="w-5 h-5" strokeWidth={1.75} />
              <span className="font-semibold">View Schedule</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" strokeWidth={1.75} />
            </button>

            <button
              onClick={() => navigate('/login')}
              className="group flex items-center justify-center gap-3 px-6 sm:px-8 py-3 sm:py-4 w-full sm:w-auto bg-white text-slate-900 rounded-2xl 
                hover:bg-slate-50 active:scale-[0.98] transition-all duration-200 
                shadow-xl shadow-slate-200/50 hover:shadow-slate-300/50 hover:-translate-y-1
                border border-slate-200 hover:border-slate-300
                focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
            >
              <LayoutDashboard className="w-5 h-5" strokeWidth={1.75} />
              <span className="font-semibold">Admin Dashboard</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" strokeWidth={1.75} />
            </button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24">
          {/* Feature 1 */}
          <div className="group relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 
            border border-slate-200/50 hover:border-[#124d54]/30
            shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-[#124d54]/20
            hover:-translate-y-2 transition-all duration-300 cursor-default overflow-hidden">
            {/* Gradient Overlay on Hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#124d54]/5 to-[#339fa7]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            <div className="relative">
              <div className="w-14 h-14 bg-gradient-to-br from-[#124d54] to-[#094044] rounded-2xl flex items-center justify-center mb-6
                shadow-lg shadow-[#124d54]/30 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <ShieldCheck className="w-7 h-7 text-white" strokeWidth={1.75} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3 tracking-tight">
                Conflict-Free Planning
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Say goodbye to overlaps. Our smart engine automatically detects time and room
                conflicts to ensure a perfect schedule every time.
              </p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="group relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 
            border border-slate-200/50 hover:border-emerald-200
            shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-emerald-200/30
            hover:-translate-y-2 transition-all duration-300 cursor-default overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-teal-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            <div className="relative">
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mb-6
                shadow-lg shadow-emerald-500/30 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <Users className="w-7 h-7 text-white" strokeWidth={1.75} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3 tracking-tight">
                Faculty Hub
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Real-time tracking of instructor availability and teaching loads. Prevent
                double-bookings and optimize department resources instantly.
              </p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="group relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 
            border border-slate-200/50 hover:border-[#339fa7]/30
            shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-[#339fa7]/20
            hover:-translate-y-2 transition-all duration-300 cursor-default overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#339fa7]/5 to-[#66b7bd]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            <div className="relative">
              <div className="w-14 h-14 bg-gradient-to-br from-[#166b74] to-[#339fa7] rounded-2xl flex items-center justify-center mb-6
                shadow-lg shadow-[#166b74]/30 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <BookOpen className="w-7 h-7 text-white" strokeWidth={1.75} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3 tracking-tight">
                Live Course Catalog
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Access every detail in one place—from section capacities to room numbers—keeping
                your academic data organized and accessible.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-24 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-[#124d54] to-[#094044] rounded-3xl pointer-events-none"></div>
          <div className="absolute inset-0 bg-grid-pattern opacity-10 rounded-3xl pointer-events-none"></div>

          <div className="relative bg-gradient-to-r from-[#124d54] to-[#094044] backdrop-blur-sm rounded-3xl p-12 shadow-2xl shadow-[#124d54]/30">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-10">
                <h3 className="text-3xl font-bold text-white mb-3 tracking-tight">
                  Built for Academic Excellence
                </h3>
                <p className="text-[#99cfd3] text-lg max-w-2xl mx-auto">
                  Trusted by administrators and students for seamless schedule management
                </p>
              </div>

              <div className="grid grid-cols-3 gap-8">
                <div className="text-center group">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    <BookOpen className="w-8 h-8 text-white" strokeWidth={1.5} />
                  </div>
                  <p className="text-4xl font-bold text-white mb-1">100+</p>
                  <p className="text-sm font-medium text-[#99cfd3] uppercase tracking-wider">Courses Managed</p>
                </div>

                <div className="text-center group">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    <GraduationCap className="w-8 h-8 text-white" strokeWidth={1.5} />
                  </div>
                  <p className="text-4xl font-bold text-white mb-1">50+</p>
                  <p className="text-sm font-medium text-[#99cfd3] uppercase tracking-wider">Instructors</p>
                </div>

                <div className="text-center group">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Zap className="w-8 h-8 text-white" strokeWidth={1.5} />
                  </div>
                  <p className="text-4xl font-bold text-white mb-1">1000+</p>
                  <p className="text-sm font-medium text-[#99cfd3] uppercase tracking-wider">Students Served</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative bg-white/70 backdrop-blur-xl border-t border-slate-200/50">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <p className="text-slate-500 text-sm">
              © 2024 NSU Class Scheduler. All rights reserved.
            </p>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-[#124d54] to-[#094044] rounded-lg shadow-md shadow-[#124d54]/20">
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