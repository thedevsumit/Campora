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
                  <span style={{ background: 'linear-gradient(to right, #a78bfa, #10b981)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }} className="block">
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

            {/* Right Content - SVG Illustration */}
            <div className="hidden lg:flex justify-center animate-fade-in-up stagger-2">
              <svg viewBox="0 0 500 450" className="w-[500px] h-[450px] drop-shadow-2xl" xmlns="http://www.w3.org/2000/svg">
                {/* Background Circle */}
                <circle cx="250" cy="225" r="180" fill="url(#bgGrad)" opacity="0.15"/>

                {/* Gradients */}
                <defs>
                  <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#7c3aed"/>
                    <stop offset="100%" stop-color="#059669"/>
                  </linearGradient>
                  <linearGradient id="primaryGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#7c3aed"/>
                    <stop offset="100%" stop-color="#6d28d9"/>
                  </linearGradient>
                  <linearGradient id="secondaryGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#059669"/>
                    <stop offset="100%" stop-color="#047857"/>
                  </linearGradient>
                  <linearGradient id="amberGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#d97706"/>
                    <stop offset="100%" stop-color="#b45309"/>
                  </linearGradient>
                </defs>

                {/* Main Building - Campus Center */}
                <rect x="150" y="140" width="200" height="180" rx="12" fill="url(#primaryGrad)" opacity="0.9"/>
                <rect x="160" y="150" width="60" height="50" rx="6" fill="white" opacity="0.3"/>
                <rect x="230" y="150" width="60" height="50" rx="6" fill="white" opacity="0.3"/>
                <rect x="300" y="150" width="40" height="50" rx="6" fill="white" opacity="0.3"/>
                <rect x="160" y="210" width="60" height="50" rx="6" fill="white" opacity="0.2"/>
                <rect x="230" y="210" width="60" height="50" rx="6" fill="white" opacity="0.2"/>
                <rect x="300" y="210" width="40" height="50" rx="6" fill="white" opacity="0.2"/>
                <rect x="190" y="280" width="120" height="40" rx="8" fill="white" opacity="0.4"/>
                <text x="250" y="306" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">CAMPUS</text>

                {/* Left Building - Lab */}
                <rect x="60" y="200" width="100" height="120" rx="10" fill="url(#secondaryGrad)" opacity="0.85"/>
                <rect x="70" y="215" width="35" height="30" rx="4" fill="white" opacity="0.25"/>
                <rect x="115" y="215" width="35" height="30" rx="4" fill="white" opacity="0.25"/>
                <rect x="70" y="255" width="35" height="30" rx="4" fill="white" opacity="0.2"/>
                <rect x="115" y="255" width="35" height="30" rx="4" fill="white" opacity="0.2"/>
                <rect x="85" y="295" width="50" height="25" rx="5" fill="white" opacity="0.35"/>

                {/* Right Building - Event Hall */}
                <rect x="340" y="180" width="110" height="140" rx="10" fill="url(#amberGrad)" opacity="0.85"/>
                <path d="M340 180 Q395 140 450 180" fill="url(#amberGrad)" opacity="0.9"/>
                <rect x="355" y="200" width="40" height="35" rx="4" fill="white" opacity="0.25"/>
                <rect x="405" y="200" width="35" height="35" rx="4" fill="white" opacity="0.25"/>
                <rect x="355" y="245" width="40" height="35" rx="4" fill="white" opacity="0.2"/>
                <rect x="405" y="245" width="35" height="35" rx="4" fill="white" opacity="0.2"/>
                <circle cx="395" cy="295" r="20" fill="white" opacity="0.35"/>

                {/* People - Left Group */}
                <circle cx="90" cy="350" r="18" fill="#7c3aed"/>
                <circle cx="90" cy="335" r="10" fill="#fce7f3"/>
                <rect x="75" y="365" width="30" height="35" rx="8" fill="#7c3aed"/>

                <circle cx="130" cy="355" r="16" fill="#059669"/>
                <circle cx="130" cy="342" r="9" fill="#fce7f3"/>
                <rect x="117" y="368" width="26" height="30" rx="7" fill="#059669"/>

                <circle cx="165" cy="358" r="15" fill="#d97706"/>
                <circle cx="165" cy="346" r="8" fill="#fce7f3"/>
                <rect x="153" y="370" width="24" height="28" rx="6" fill="#d97706"/>

                {/* People - Right Group */}
                <circle cx="420" cy="355" r="17" fill="#7c3aed"/>
                <circle cx="420" cy="341" r="9" fill="#fce7f3"/>
                <rect x="407" y="369" width="26" height="32" rx="7" fill="#7c3aed"/>

                <circle cx="455" cy="362" r="15" fill="#059669"/>
                <circle cx="455" cy="350" r="8" fill="#fce7f3"/>
                <rect x="444" y="374" width="22" height="26" rx="6" fill="#059669"/>

                {/* People - Center Bottom */}
                <circle cx="220" cy="370" r="20" fill="#7c3aed"/>
                <circle cx="220" cy="353" r="11" fill="#fce7f3"/>
                <rect x="202" y="387" width="36" height="40" rx="10" fill="#7c3aed"/>

                <circle cx="275" cy="375" r="18" fill="#059669"/>
                <circle cx="275" cy="360" r="10" fill="#fce7f3"/>
                <rect x="259" y="390" width="32" height="35" rx="8" fill="#059669"/>

                {/* Connection Lines */}
                <path d="M160 250 Q200 280 220 320" stroke="white" strokeWidth="2" strokeDasharray="6,4" fill="none" opacity="0.4"/>
                <path d="M340 250 Q300 280 280 320" stroke="white" strokeWidth="2" strokeDasharray="6,4" fill="none" opacity="0.4"/>

                {/* Floating Icons */}
                {/* Calendar Icon */}
                <rect x="40" y="80" width="50" height="45" rx="8" fill="white" opacity="0.9"/>
                <rect x="40" y="80" width="50" height="15" rx="8" fill="#7c3aed"/>
                <rect x="52" y="72" width="6" height="12" rx="2" fill="#7c3aed"/>
                <rect x="62" y="72" width="6" height="12" rx="2" fill="#7c3aed"/>
                <rect x="72" y="72" width="6" height="12" rx="2" fill="#7c3aed"/>
                <circle cx="55" cy="108" r="4" fill="#7c3aed"/>
                <circle cx="65" cy="108" r="4" fill="#7c3aed"/>
                <circle cx="75" cy="108" r="4" fill="#7c3aed"/>

                {/* Users Icon */}
                <circle cx="420" cy="70" r="14" fill="white" opacity="0.9"/>
                <circle cx="420" cy="62" r="8" fill="#059669"/>
                <circle cx="440" cy="78" r="10" fill="white" opacity="0.7"/>
                <circle cx="440" cy="72" r="6" fill="#059669"/>
                <circle cx="400" cy="78" r="10" fill="white" opacity="0.7"/>
                <circle cx="400" cy="72" r="6" fill="#059669"/>

                {/* Rocket Icon */}
                <ellipse cx="470" cy="130" rx="18" ry="25" fill="white" opacity="0.9"/>
                <ellipse cx="470" cy="120" rx="10" ry="12" fill="#d97706"/>
                <path d="M455 145 Q470 165 485 145" fill="#d97706"/>
                <circle cx="470" cy="115" r="5" fill="white"/>

                {/* Stars */}
                <path d="M50 180 l3 6 7 1 -5 5 1 7 -6-3 -6 3 1-7 -5-5 7-1z" fill="#fbbf24"/>
                <path d="M450 200 l2 5 6 1 -4 4 1 6 -5-3 -5 3 1-6 -4-4 6-1z" fill="#fbbf24"/>
                <path d="M280 60 l2 4 5 1 -4 3 1 5 -4-2 -4 2 1-5 -4-3 5-1z" fill="#fbbf24"/>

                {/* Dots Pattern */}
                <circle cx="30" cy="150" r="3" fill="white" opacity="0.3"/>
                <circle cx="50" cy="160" r="2" fill="white" opacity="0.3"/>
                <circle cx="40" cy="180" r="2.5" fill="white" opacity="0.3"/>
                <circle cx="470" cy="180" r="3" fill="white" opacity="0.3"/>
                <circle cx="450" cy="170" r="2" fill="white" opacity="0.3"/>
                <circle cx="460" cy="200" r="2.5" fill="white" opacity="0.3"/>
              </svg>
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
          <div className="flex items-end justify-between mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-primary-600" />
                <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider">Explore</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-3">
                Discover Campus{" "}
                <span style={{ background: 'linear-gradient(to right, #8b5cf6, #10b981)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Communities</span>
              </h2>
              <p className="text-slate-500 text-base max-w-xl">
                From coding clubs to cultural societies, find the perfect community that matches your interests and passion. Each club is a gateway to new experiences and lifelong friendships.
              </p>
            </div>
            <Button
              variant="ghost"
              className="hidden sm:flex items-center gap-1 text-primary-600 font-semibold"
              onClick={() => navigate('/clubs')}
            >
              View All Clubs <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredClubs.map((club, idx) => (
              <div
                key={club._id}
                onClick={() => navigate(`/clubs/${club._id}`)}
                className="group relative bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 hover:shadow-2xl hover:shadow-primary-500/10 transition-all duration-500 hover:-translate-y-2 cursor-pointer animate-fade-in-up overflow-hidden"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                {/* Animated gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary-50/0 to-secondary-50/0 group-hover:from-primary-50/50 group-hover:to-secondary-50/50 transition-all duration-500" />

                {/* Top accent bar */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

                {/* Club Icon */}
                <div className="relative mb-5">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl blur-lg opacity-0 group-hover:opacity-30 transition-opacity" />
                  <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg group-hover:scale-110 transition-transform duration-300">
                    {club.clubIcon ? (
                      <img src={`http://localhost:5000${club.clubIcon}`} className="w-full h-full object-cover" alt={club.clubName} />
                    ) : (
                      club.clubName?.[0]
                    )}
                  </div>
                </div>

                {/* Club Info */}
                <div className="relative">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {club.clubName}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-4">
                    {club.description || "A vibrant campus community waiting for you to join."}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-slate-400" />
                      <span className="text-xs text-slate-500">{club.members?.length || 0} members</span>
                    </div>
                    <ArrowRight className="w-5 h-5 text-primary-500 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                  </div>
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
      <section className="py-20 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5 text-secondary-600" />
                <span className="text-secondary-600 font-semibold text-sm uppercase tracking-wider">Don't Miss</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-3">
                Happening{" "}
                <span style={{ background: 'linear-gradient(to right, #10b981, #059669)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Now</span> & Upcoming
              </h2>
              <p className="text-slate-500 text-base max-w-xl">
                Mark your calendar! These upcoming events bring together students across campus for unforgettable experiences — workshops, competitions, cultural nights, and so much more.
              </p>
            </div>
            <Button
              variant="ghost"
              className="hidden sm:flex items-center gap-1 text-secondary-600 font-semibold"
              onClick={() => navigate('/events')}
            >
              View All Events <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {upcomingEvents.map((event, idx) => (
              <div
                key={event._id}
                className="group relative bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800 overflow-hidden hover:shadow-2xl hover:shadow-secondary-500/10 transition-all duration-500 hover:-translate-y-2 animate-fade-in-up"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                {/* Event Image */}
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={event.image || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800"}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-white/20 backdrop-blur-xl text-white border border-white/30 font-medium">
                      {event.category || "General"}
                    </Badge>
                  </div>

                  {/* Date overlay */}
                  <div className="absolute top-4 right-4 bg-gradient-to-br from-secondary-500 to-secondary-600 text-white rounded-xl px-3 py-2 text-center shadow-lg">
                    <p className="text-xs font-medium opacity-80">
                      {event.date ? new Date(event.date).toLocaleDateString('en-US', { month: 'short' }) : 'TBA'}
                    </p>
                    <p className="text-lg font-bold leading-tight">
                      {event.date ? new Date(event.date).getDate() : '-'}
                    </p>
                  </div>
                </div>

                {/* Event Info */}
                <div className="p-6">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 line-clamp-1 group-hover:text-secondary-600 transition-colors">
                    {event.title}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-4">
                    {event.description || "An exciting event you don't want to miss!"}
                  </p>

                  <div className="flex items-center gap-4 text-sm text-slate-500 mb-5">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-secondary-500" />
                      <span>{event.date ? new Date(event.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric' }) : "Date TBA"}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {event.venue && (
                      <div className="flex items-center gap-1.5 text-sm text-slate-500">
                        <LayoutGrid className="w-4 h-4 text-primary-500" />
                        <span className="truncate">{event.venue}</span>
                      </div>
                    )}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-4 group/btn border-secondary-200 text-secondary-600 hover:bg-secondary-50 dark:hover:bg-secondary-900/20"
                    onClick={() => navigate('/events')}
                  >
                    Register Now
                    <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="mt-10 text-center">
            <p className="text-slate-500 text-sm mb-3">
              Want to explore more events happening on campus?
            </p>
            <Button
              variant="outline"
              className="font-semibold"
              onClick={() => navigate('/events')}
            >
              Browse All Events
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
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
