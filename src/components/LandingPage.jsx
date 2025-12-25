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
            <div className="p-2 bg-slate-900 rounded-lg">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">NSU Class Scheduler</h1>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-slate-900 mb-6">
            Streamline Your Academic Scheduling
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-12">
            A comprehensive platform for managing class schedules, instructor availability, 
            and academic calendars. Designed for efficiency and ease of use.
          </p>

          {/* Action Buttons */}
          <div className="flex items-center justify-center gap-6">
            <button
              onClick={() => navigate('/student')}
              className="group flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl"
            >
              <Calendar className="w-5 h-5" />
              <span className="font-semibold">View Schedule</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => navigate('/login')}
              className="group flex items-center gap-3 px-8 py-4 bg-white text-slate-900 rounded-xl hover:bg-slate-50 transition-all shadow-lg hover:shadow-xl border-2 border-slate-200"
            >
              <LayoutDashboard className="w-5 h-5" />
              <span className="font-semibold">Admin Dashboard</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
          <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">
              Conflict-Free Planning
            </h3>
            <p className="text-slate-600">
              Say goodbye to overlaps. Our smart engine automatically detects time and room 
              conflicts to ensure a perfect schedule every time.
            </p>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">
              Faculty Hub
            </h3>
            <p className="text-slate-600">
              Real-time tracking of instructor availability and teaching loads. Prevent 
              double-bookings and optimize department resources instantly.
            </p>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <BookOpen className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">
              Live Course Catalog
            </h3>
            <p className="text-slate-600">
              Access every detail in one place—from section capacities to room numbers—keeping 
              your academic data organized and accessible.
            </p>
          </div>
        </div>

        {/* Additional Info Section */}
        <div className="mt-20 bg-white rounded-2xl p-12 shadow-sm border border-slate-200">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-3xl font-bold text-slate-900 mb-6">
              Built for Academic Excellence
            </h3>
            <p className="text-lg text-slate-600 mb-8">
              Our platform provides a seamless experience for both administrators and students. 
              Administrators can manage schedules, track instructor availability, and generate 
              reports. Students can browse courses, view schedules, and plan their academic journey.
            </p>
            <div className="flex items-center justify-center gap-8 text-slate-600">
              <div>
                <p className="text-3xl font-bold text-slate-900">100+</p>
                <p className="text-sm">Courses Managed</p>
              </div>
              <div className="w-px h-12 bg-slate-200"></div>
              <div>
                <p className="text-3xl font-bold text-slate-900">50+</p>
                <p className="text-sm">Instructors</p>
              </div>
              <div className="w-px h-12 bg-slate-200"></div>
              <div>
                <p className="text-3xl font-bold text-slate-900">1000+</p>
                <p className="text-sm">Students Served</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <p className="text-slate-600 text-sm">
              © 2024 NSU Class Scheduler. All rights reserved.
            </p>
            <div className="flex items-center gap-3">
              <div className="p-1.5 bg-slate-900 rounded-md">
                <Calendar className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-semibold text-slate-900">NSU Class Scheduler</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
