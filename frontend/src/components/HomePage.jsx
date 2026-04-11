import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Button from "./ui/Button";
import Badge from "./ui/Badge";
import StatCard from "./ui/StatCard";
import { useClubStore } from "../store/useClubStore";
import { useEventStore } from "../store/useEventStore";
import { userAuthStore } from "../store/useAuthStore";
import {
  Sparkles, Users, Calendar, LayoutGrid, ArrowRight,
  TrendingUp, Star, ChevronRight, Zap, Globe, Rocket
} from "lucide-react";

export default function HomePage() {
  const navigate = useNavigate();
  const { clubs, getAllClubs } = useClubStore();
  const { events, fetchAllEvents } = useEventStore();
  const { authUser } = userAuthStore();

  useEffect(() => {
    getAllClubs();
    fetchAllEvents();
  }, [getAllClubs, fetchAllEvents]);

  const featuredClubs = clubs.slice(0, 4);
  const upcomingEvents = events.slice(0, 3);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-700 via-30% to-secondary-700" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.15)_0%,transparent_50%)]" />

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-10 right-20 w-96 h-96 bg-secondary-400/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
        <div className="absolute top-40 right-40 w-32 h-32 border border-white/10 rounded-full animate-pulse" />
        <div className="absolute bottom-40 left-40 w-20 h-20 border border-white/10 rounded-full animate-pulse" style={{ animationDelay: "1s" }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-xl rounded-full border border-white/20 animate-fade-in">
                <Zap className="w-4 h-4 text-amber-400" />
                <span className="text-white/90 text-sm font-medium">Campus Community Platform</span>
              </div>

              {/* Heading */}
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight animate-fade-in-up">
                  Connect.
                  <span className="block bg-gradient-to-r from-primary-200 to-secondary-200 bg-clip-text text-transparent">
                    Collaborate.
                  </span>
                  <span className="block">Grow Together.</span>
                </h1>
                <p className="text-lg md:text-xl text-primary-100 max-w-xl mx-auto lg:mx-0 animate-fade-in-up stagger-1">
                  Join clubs, attend events, book resources, and connect with students across your campus community.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in-up stagger-2">
                <Button
                   variant="outline"
                  size="xl"
                  className="border-white/80 text-white hover:bg-white/20 hover:border-white"
                  onClick={() => navigate('/clubs')}
                >
                  <Rocket className="w-5 h-5 mr-2" />
                  Explore Clubs
                </Button>
                <Button
                  variant="outline"
                  size="xl"
                  className="border-white/80 text-white hover:bg-white/20 hover:border-white"
                  onClick={() => navigate('/events')}
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  Browse Events
                </Button>
              </div>

              {/* Quick Stats */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-8 pt-4 animate-fade-in-up stagger-3">
                <div className="text-center">
                  <p className="text-3xl font-bold text-white">{clubs.length}+</p>
                  <p className="text-primary-200 text-sm">Active Clubs</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-white">{events.length}+</p>
                  <p className="text-primary-200 text-sm">Events</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-white">500+</p>
                  <p className="text-primary-200 text-sm">Students</p>
                </div>
              </div>
            </div>

            {/* Right Content - Visual */}
            <div className="hidden lg:flex justify-center animate-fade-in-up stagger-2">
              <div className="relative">
                {/* Main Card */}
                <div className="w-80 h-[420px] bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl overflow-hidden">
                  {/* Header */}
                  <div className="h-2/5 bg-gradient-to-br from-primary-500 via-primary-600 to-secondary-600 flex flex-col items-center justify-center px-6">
                    <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-xl flex items-center justify-center mb-4 border border-white/30">
                      <Globe className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-white font-bold text-lg">Campora</h3>
                    <p className="text-white/70 text-sm">Your Campus Hub</p>
                  </div>
                  {/* Stats */}
                  <div className="h-3/5 p-5 space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg">
                        <Users className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-white font-bold text-lg">50+</p>
                        <p className="text-white/60 text-sm">Active Clubs</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary-500 to-secondary-600 flex items-center justify-center shadow-lg">
                        <Calendar className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-white font-bold text-lg">Weekly</p>
                        <p className="text-white/60 text-sm">Events</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg">
                        <LayoutGrid className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-white font-bold text-lg">10+</p>
                        <p className="text-white/60 text-sm">Bookable Spaces</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Cards */}
                <div className="absolute -top-4 -right-12 w-48 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl shadow-2xl p-4 animate-float text-white" style={{ animationDelay: "1s" }}>
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="w-5 h-5" />
                    <span className="text-sm font-semibold">Growing Fast</span>
                  </div>
                  <p className="text-3xl font-bold">+120%</p>
                  <p className="text-xs text-emerald-100 mt-1">Club Activity</p>
                </div>

                <div className="absolute -bottom-4 -left-10 w-44 bg-gradient-to-br from-violet-600 to-purple-700 rounded-2xl shadow-2xl p-4 animate-float text-white" style={{ animationDelay: "2s" }}>
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="w-5 h-5 text-amber-400" />
                    <span className="text-sm font-semibold">Top Rated</span>
                  </div>
                  <p className="text-base font-bold">Computer Society</p>
                  <p className="text-xs text-violet-200 mt-1">Best Campus Club 2026</p>
                </div>

                <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-36 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl shadow-2xl p-3 animate-float text-white" style={{ animationDelay: "0.5s" }}>
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="w-4 h-4" />
                    <span className="text-xs font-semibold">New</span>
                  </div>
                  <p className="text-sm font-bold">Resource Booking</p>
                  <p className="text-[10px] text-amber-100">Now Available</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave Bottom */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 50L48 45.8C96 41.7 192 33.3 288 30C384 26.7 480 28.3 576 33.3C672 38.3 768 46.7 864 48.3C960 50 1056 45 1152 40C1248 35 1344 30 1392 27.5L1440 25V100H1392C1344 100 1248 100 1152 100C1056 100 960 100 864 100C768 100 672 100 576 100C480 100 384 100 288 100C192 100 96 100 48 100H0V50Z" className="fill-slate-50 dark:fill-slate-950" />
          </svg>
        </div>
      </section>

      {/* Featured Clubs Section */}
      <section className="py-20 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-primary-600" />
                <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider">Discover</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white">
                Featured Clubs
              </h2>
            </div>
            <Button
              variant="ghost"
              className="hidden sm:flex items-center gap-1 text-primary-600"
              onClick={() => navigate('/clubs')}
            >
              View All <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredClubs.map((club, idx) => (
              <div
                key={club._id}
                onClick={() => navigate(`/clubs/${club._id}`)}
                className="group bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 hover:shadow-2xl hover:shadow-primary-500/10 transition-all duration-500 hover:-translate-y-2 cursor-pointer animate-fade-in-up"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                {/* Club Icon */}
                <div className="relative mb-5">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl blur-lg opacity-0 group-hover:opacity-30 transition-opacity" />
                  <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                    {club.clubIcon ? (
                      <img src={`http://localhost:5000${club.clubIcon}`} className="w-full h-full object-cover" alt={club.clubName} />
                    ) : (
                      club.clubName?.[0]
                    )}
                  </div>
                </div>

                {/* Club Info */}
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-primary-600 transition-colors">
                  {club.clubName}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-4">
                  {club.description}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-slate-400" />
                    <span className="text-xs text-slate-500">{club.members?.length || 0} members</span>
                  </div>
                  <ArrowRight className="w-5 h-5 text-primary-500 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                </div>
              </div>
            ))}
          </div>

          <Button
            variant="outline"
            className="w-full mt-8 sm:hidden"
            onClick={() => navigate('/clubs')}
          >
            View All Clubs <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="w-5 h-5 text-secondary-600" />
                <span className="text-secondary-600 font-semibold text-sm uppercase tracking-wider">Happening Soon</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white">
                Upcoming Events
              </h2>
            </div>
            <Button
              variant="ghost"
              className="hidden sm:flex items-center gap-1 text-secondary-600"
              onClick={() => navigate('/events')}
            >
              View All <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {upcomingEvents.map((event, idx) => (
              <div
                key={event._id}
                className="group bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800 overflow-hidden hover:shadow-2xl hover:shadow-secondary-500/10 transition-all duration-500 animate-fade-in-up"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                {/* Event Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={event.image || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800"}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-white/20 backdrop-blur-xl text-white border border-white/30">
                      {event.category || "General"}
                    </Badge>
                  </div>
                </div>

                {/* Event Info */}
                <div className="p-6">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 line-clamp-1">
                    {event.title}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-4">
                    {event.description}
                  </p>

                  <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-secondary-500" />
                      <span>{event.date ? new Date(event.date).toLocaleDateString() : "TBA"}</span>
                    </div>
                    {event.venue && (
                      <div className="flex items-center gap-1.5">
                        <LayoutGrid className="w-4 h-4 text-primary-500" />
                        <span className="truncate">{event.venue}</span>
                      </div>
                    )}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full group/btn"
                    onClick={() => navigate('/events')}
                  >
                    Register
                    <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(255,255,255,0.1)_0%,transparent_50%)]" />
        <div className="absolute top-10 right-20 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-20 w-96 h-96 bg-secondary-400/20 rounded-full blur-3xl" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-xl rounded-full border border-white/20 mb-6 animate-fade-in">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-white/90 text-sm font-medium">Ready to get started?</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 animate-fade-in-up">
            Join Your Campus
            <span className="block bg-gradient-to-r from-primary-200 to-secondary-200 bg-clip-text text-transparent">
              Community Today
            </span>
          </h2>

          <p className="text-xl text-primary-100 mb-10 max-w-2xl mx-auto animate-fade-in-up stagger-1">
            Create an account to join clubs, attend events, book resources, and connect with students across campus.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up stagger-2">
            {!authUser ? (
              <>
                <Button
                  size="xl"
                  className="bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700 shadow-2xl shadow-primary-500/30"
                  onClick={() => navigate('/signup')}
                >
                  Get Started Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button
                  variant="outline"
                  size="xl"
                  className="border-white/80 text-white hover:bg-white/20 hover:border-white"
                  onClick={() => navigate('/login')}
                >
                  Sign In
                </Button>
              </>
            ) : (
              <Button
                size="xl"
                className="bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700 shadow-2xl shadow-primary-500/30"
                onClick={() => navigate('/clubs')}
              >
                Explore Clubs
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <span className="text-xl font-bold">Campora</span>
            </div>
            <p className="text-slate-400 text-sm">
              &copy; 2026 Campora. Connecting campus communities.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
