import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import { getImageUrl } from "../lib/utils";
import { useEventStore } from "../store/useEventStore";
import { userAuthStore } from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import Button from "./ui/Button";
import Badge from "./ui/Badge";
import Modal from "./ui/Modal";
import Input from "./ui/Input";
import {
  Calendar, Clock, MapPin, Users, Search, ChevronRight,
  PartyPopper, Sparkles, Ticket, Star, ArrowRight, Globe,
  Trophy, Zap, Heart, Code, CheckCircle, Loader2, Plus, X
} from "lucide-react";

const whyAttendItems = [
  {
    icon: Zap,
    title: "Learn & Grow",
    desc: "Gain new skills through workshops, hackathons, and hands-on sessions led by industry experts and senior campus leaders.",
    color: "primary",
  },
  {
    icon: Users,
    title: "Expand Your Network",
    desc: "Meet students from different departments and years. Build connections that last beyond graduation day.",
    color: "secondary",
  },
  {
    icon: Trophy,
    title: "Compete & Win",
    desc: "Test your skills against the best. Win prizes, certificates, and recognition that stand out on your resume.",
    color: "amber",
  },
];

const eventTypes = [
  { icon: Code, label: "Hackathon", count: 5 },
  { icon: Users, label: "Workshops", count: 8 },
  { icon: Globe, label: "Seminars", count: 4 },
  { icon: Trophy, label: "Competitions", count: 6 },
];

export default function EventsPage() {
  const { events, loading, fetchAllEvents, registerForEvent } = useEventStore();
  const { authUser } = userAuthStore();
  const navigate = useNavigate();
  const [filterCategory, setFilterCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const [registrationData, setRegistrationData] = useState({
    name: authUser?.fullName || "",
    email: authUser?.email || "",
    phone: authUser?.phone || "",
    year: "",
  });
  const [teamMembers, setTeamMembers] = useState([]);

  useEffect(() => {
    fetchAllEvents();
  }, [fetchAllEvents]);

  const handleRegister = (event) => {
    setSelectedEvent(event);
    setShowConfirmation(false);
    setRegistrationData({
      name: authUser?.fullName || "",
      email: authUser?.email || "",
      phone: authUser?.phone || "",
      year: "",
    });
    setTeamMembers([]);
    setShowRegisterModal(true);
  };

  const handleViewParticipants = async (event) => {
    // Fetch full event details (including participants) before showing modal
    try {
      const detailed = await fetchEventById(event._id);
      setSelectedEvent(detailed || event);
    } catch (e) {
      // Fallback to the passed event if fetch fails
      console.error('Failed to fetch event details:', e);
      setSelectedEvent(event);
    }
  };
  

  const addTeamMember = () => {
    setTeamMembers([...teamMembers, { name: "", email: "" }]);
  };

  const removeTeamMember = (index) => {
    setTeamMembers(teamMembers.filter((_, i) => i !== index));
  };

  const updateTeamMember = (index, field, value) => {
    const updated = [...teamMembers];
    updated[index][field] = value;
    setTeamMembers(updated);
  };

  const handleRegistrationSubmit = async () => {
    if (!registrationData.name || !registrationData.email) {
      return;
    }
    // Show confirmation screen
    setShowConfirmation(true);
  };

  const confirmRegistration = async () => {
    if (!selectedEvent) return;
    setIsRegistering(true);
    try {
      const data = {
        ...registrationData,
        teamMembers: selectedEvent?.registrationType === "group" ? teamMembers : [],
      };
      console.log("bruh ")
      await registerForEvent(selectedEvent._id, data);
      setShowRegisterModal(false);
      setShowConfirmation(false);
      setRegistrationData({ name: authUser?.fullName || "", email: authUser?.email || "", phone: authUser?.phone || "", year: "" });
      setTeamMembers([]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsRegistering(false);
    }
  };

  const filteredEvents = events.filter((e) => {
    const matchesCategory = filterCategory === "all" || e.category === filterCategory;
    const matchesSearch = !searchQuery || e.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  

  const categories = ["all", "Technical", "Cultural", "Sports", "Competition", "Workshop", "Seminar", "Hackathon"];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-5">
          <div className="w-14 h-14 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
          <p className="text-slate-500 animate-pulse text-lg">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-700 text-white py-28 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/5 rounded-full" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary-400/20 rounded-full" />
        <div className="absolute top-20 right-20 w-40 h-40 border border-white/10 rounded-full" />
        <div className="absolute top-40 left-40 w-20 h-20 border border-white/10 rounded-full" />
        <div className="absolute top-1/2 left-10 w-4 h-4 bg-amber-400/60 rounded-full" />
        <div className="absolute bottom-20 right-30 w-3 h-3 bg-white/40 rounded-full" />
        <div className="absolute top-30 right-60 w-32 h-32 border border-white/5 rounded-full" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-2 mb-6 animate-fade-in">
                <Sparkles className="w-5 h-5 text-amber-300" />
                <span className="text-amber-200 font-semibold text-sm uppercase tracking-wider">
                  Campus Events
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 animate-fade-in-up leading-tight">
                Discover{" "}
                <span
                  style={{
                    background: "linear-gradient(to right, #fbbf24, #f59e0b)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Amazing
                </span>{" "}
                <br />
                Campus Events
              </h1>

              <p className="text-primary-100 text-lg md:text-xl mb-8 animate-fade-in-up stagger-1 max-w-xl leading-relaxed">
                From hackathons to cultural nights, there's always something
                exciting happening on campus. Find events that match your
                passion, learn from experts, and create unforgettable memories
                with fellow students.
              </p>

              {/* Stats Row */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-5 mb-8 animate-fade-in-up stagger-2">
                <div className="flex items-center gap-3 bg-white/15 backdrop-blur-xl px-5 py-3 rounded-2xl border border-white/20">
                  <Calendar className="w-5 h-5 text-amber-300" />
                  <div className="text-left">
                    <p className="text-xl font-bold">{events.length}+</p>
                    <p className="text-primary-200 text-xs">Events</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-white/15 backdrop-blur-xl px-5 py-3 rounded-2xl border border-white/20">
                  <Users className="w-5 h-5 text-secondary-300" />
                  <div className="text-left">
                    <p className="text-xl font-bold">500+</p>
                    <p className="text-primary-200 text-xs">Participants</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-white/15 backdrop-blur-xl px-5 py-3 rounded-2xl border border-white/20">
                  <Trophy className="w-5 h-5 text-rose-300" />
                  <div className="text-left">
                    <p className="text-xl font-bold">50+</p>
                    <p className="text-primary-200 text-xs">Workshops</p>
                  </div>
                </div>
              </div>

              {/* Search */}
              <div className="max-w-xl mx-auto lg:mx-0 animate-fade-in-up stagger-3">
                <div className="relative">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-300" />
                  <input
                    type="text"
                    placeholder="Search events by name, category, or club..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-14 pr-5 py-4 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 text-white placeholder-primary-200/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/20 transition-all text-base"
                  />
                </div>
              </div>
            </div>

            {/* Right SVG Illustration */}
            <div className="hidden lg:flex justify-center animate-fade-in-up stagger-2">
              <svg
                viewBox="0 0 400 350"
                className="w-[400px] h-[350px]"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Background circles */}
                <circle
                  cx="200"
                  cy="175"
                  r="140"
                  fill="url(#heroGrad)"
                  opacity="0.1"
                />
                <circle
                  cx="200"
                  cy="175"
                  r="100"
                  fill="url(#heroGrad)"
                  opacity="0.05"
                />

                <defs>
                  <linearGradient
                    id="heroGrad"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#7c3aed" />
                    <stop offset="100%" stopColor="#059669" />
                  </linearGradient>
                  <linearGradient
                    id="calGrad"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#fbbf24" />
                    <stop offset="100%" stopColor="#f59e0b" />
                  </linearGradient>
                </defs>

                {/* Large Calendar Card */}
                <rect
                  x="80"
                  y="60"
                  width="240"
                  height="200"
                  rx="20"
                  fill="white"
                  opacity="0.15"
                />
                <rect
                  x="90"
                  y="70"
                  width="220"
                  height="180"
                  rx="16"
                  fill="white"
                  opacity="0.2"
                />
                <rect
                  x="100"
                  y="80"
                  width="200"
                  height="160"
                  rx="12"
                  fill="white"
                  opacity="0.95"
                />

                {/* Calendar Header */}
                <rect
                  x="100"
                  y="80"
                  width="200"
                  height="40"
                  rx="12"
                  fill="url(#calGrad)"
                />
                <circle cx="130" cy="100" r="6" fill="white" opacity="0.8" />
                <circle cx="150" cy="100" r="6" fill="white" opacity="0.8" />
                <circle cx="170" cy="100" r="6" fill="white" opacity="0.8" />

                {/* Calendar Body */}
                <rect
                  x="115"
                  y="135"
                  width="30"
                  height="25"
                  rx="4"
                  fill="#7c3aed"
                  opacity="0.3"
                />
                <rect
                  x="155"
                  y="135"
                  width="30"
                  height="25"
                  rx="4"
                  fill="#7c3aed"
                  opacity="0.6"
                />
                <rect
                  x="195"
                  y="135"
                  width="30"
                  height="25"
                  rx="4"
                  fill="#7c3aed"
                  opacity="0.3"
                />
                <rect
                  x="235"
                  y="135"
                  width="30"
                  height="25"
                  rx="4"
                  fill="#059669"
                  opacity="0.5"
                />

                <rect
                  x="115"
                  y="170"
                  width="30"
                  height="25"
                  rx="4"
                  fill="#059669"
                  opacity="0.4"
                />
                <rect
                  x="155"
                  y="170"
                  width="30"
                  height="25"
                  rx="4"
                  fill="#7c3aed"
                  opacity="0.8"
                />
                <rect
                  x="195"
                  y="170"
                  width="30"
                  height="25"
                  rx="4"
                  fill="#059669"
                  opacity="0.3"
                />
                <rect
                  x="235"
                  y="170"
                  width="30"
                  height="25"
                  rx="4"
                  fill="#7c3aed"
                  opacity="0.3"
                />

                <rect
                  x="115"
                  y="205"
                  width="30"
                  height="25"
                  rx="4"
                  fill="#7c3aed"
                  opacity="0.3"
                />
                <rect
                  x="155"
                  y="205"
                  width="30"
                  height="25"
                  rx="4"
                  fill="#059669"
                  opacity="0.4"
                />
                <rect
                  x="195"
                  y="205"
                  width="30"
                  height="25"
                  rx="4"
                  fill="#7c3aed"
                  opacity="0.3"
                />
                <rect
                  x="235"
                  y="205"
                  width="30"
                  height="25"
                  rx="4"
                  fill="#fbbf24"
                  opacity="0.8"
                />

                {/* Stars */}
                <path
                  d="M50 150 l2 4 5 1 -4 3 1 5 -4-2 -4 2 1-5 -4-3 5-1z"
                  fill="#fbbf24"
                />
                <path
                  d="M350 120 l2 4 5 1 -4 3 1 5 -4-2 -4 2 1-5 -4-3 5-1z"
                  fill="#fbbf24"
                />
                <path
                  d="M60 250 l1.5 3 4 0.5 -3 2.5 0.5 4 -3-1.5 -3 1.5 0.5-4 -3-2.5 4-0.5z"
                  fill="#fcd34d"
                />
                <path
                  d="M340 220 l1.5 3 4 0.5 -3 2.5 0.5 4 -3-1.5 -3 1.5 0.5-4 -3-2.5 4-0.5z"
                  fill="#fcd34d"
                />

                {/* Dots */}
                <circle cx="45" cy="100" r="3" fill="white" opacity="0.4" />
                <circle cx="60" cy="130" r="2" fill="white" opacity="0.3" />
                <circle cx="355" cy="180" r="3" fill="white" opacity="0.4" />
                <circle cx="340" cy="280" r="2" fill="white" opacity="0.3" />
              </svg>
            </div>
          </div>
        </div>

        {/* Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 50L48 45.8C96 41.7 192 33.3 288 30C384 26.7 480 28.3 576 33.3C672 38.3 768 46.7 864 48.3C960 50 1056 45 1152 40C1248 35 1344 30 1392 27.5L1440 25V100H1392C1344 100 1248 100 1152 100C1056 100 960 100 864 100C768 100 672 100 576 100C480 100 384 100 288 100C192 100 96 100 48 100H0V50Z"
              className="fill-slate-50 dark:fill-slate-950"
            />
          </svg>
        </div>
      </div>
      {/* Category Filters */}
      <div className="sticky top-16 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl border-b border-slate-200/50 dark:border-slate-700/50 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setFilterCategory(c)}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-300 ${
                  filterCategory === c
                    ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                {c === "all" ? "All Events" : c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Events Count */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              {filteredEvents.length}{" "}
              {filteredEvents.length === 1 ? "Event" : "Events"} Found
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              {searchQuery
                ? `Showing results for "${searchQuery}"`
                : "Explore and find your next adventure"}
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Calendar className="w-4 h-4" />
            <span>Sorted by date</span>
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div className="max-w-7xl mx-auto p-6 sm:p-8 lg:p-10">
        {filteredEvents.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-24 h-24 mx-auto mb-6 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
              <PartyPopper className="w-10 h-10 text-slate-300 dark:text-slate-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
              {searchQuery
                ? "No events match your search"
                : "No events available"}
            </h3>
            <p className="text-slate-500 max-w-md mx-auto mb-6 leading-relaxed">
              {searchQuery
                ? "We couldn't find any events matching your search. Try different keywords or clear the search to explore all events."
                : "It looks like there are no events right now. Check back soon or create your own event!"}
            </p>
            {searchQuery && (
              <Button variant="outline" onClick={() => setSearchQuery("")}>
                Clear Search
              </Button>
            )}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event, idx) => {
              const registered = event.registrations?.length || 0;
              const percent = (registered / event.maxParticipants) * 100 || 0;
              const isFull = registered >= event.maxParticipants;

              const isRegistered = event.registrations?.some(
                (reg) => reg.email === authUser.email,
              );

              console.log(event);

              return (
                <div
                  key={event._id}
                  className="group relative bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:shadow-primary-500/10 transition-all duration-500 hover:-translate-y-2 animate-fade-in-up"
                  style={{ animationDelay: `${idx * 75}ms` }}
                >
                  {/* Top accent bar */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

                  {/* Event Image */}
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={getImageUrl(event.coverImage)}
                      // alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex gap-2 flex-wrap">
                      <Badge
                        variant="primary"
                        className="backdrop-blur-xl bg-white/20 text-white border border-white/30 font-medium"
                      >
                        {event.category || "General"}
                      </Badge>
                      {event.registrationType === "group" && (
                        <Badge className="bg-amber-500/80 backdrop-blur-xl text-white border border-amber-300/50 font-medium">
                          <Users className="w-3 h-3 mr-1" /> Group
                        </Badge>
                      )}
                      {event.registrationType === "solo" && (
                        <Badge className="bg-blue-500/80 backdrop-blur-xl text-white border border-blue-300/50 font-medium">
                          Solo
                        </Badge>
                      )}
                    </div>
                    {isFull && (
                      <div className="absolute top-4 right-4">
                        <Badge
                          variant="danger"
                          className="bg-white/20 backdrop-blur-xl border border-white/30 font-medium"
                        >
                          Event Full
                        </Badge>
                      </div>
                    )}

                    {/* Date Badge */}
                    <div className="absolute bottom-4 left-4">
                      <div className="flex items-center gap-2 bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl px-4 py-3 shadow-lg">
                        <Calendar className="w-5 h-5 text-white" />
                        <div>
                          <p className="text-xs text-primary-200 font-medium">
                            {event.startDate
                              ? new Date(event.startDate).toLocaleDateString(
                                  "en-US",
                                  { month: "short" },
                                )
                              : "TBA"}
                          </p>
                          <p className="text-lg font-bold text-white leading-tight">
                            {event.startDate
                              ? new Date(event.startDate).getDate()
                              : "-"}
                          </p>
                        </div>
                        {event.time && (
                          <div className="border-l border-white/20 pl-2 ml-1">
                            <p className="text-xs text-primary-200">
                              {event.time}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-1">
                      {event.title}
                      {isRegistered && (
                        <span className="ml-2 inline-flex items-center rounded-full bg-green-500 px-2 py-0.5 text-xs font-medium text-white">
                          Registered
                        </span>
                      )}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-5 leading-relaxed">
                      {event.description ||
                        "An exciting event you don't want to miss. Join us for an unforgettable experience!"}
                    </p>

                    {event.venue && (
                      <div className="flex items-center gap-2 text-sm text-slate-500 mb-5">
                        <MapPin className="w-4 h-4 text-primary-500" />
                        <span className="truncate">{event.venue}</span>
                      </div>
                    )}

                    {/* Progress */}
                    <div className="mb-5">
                      <div className="flex justify-between text-xs text-slate-500 mb-2">
                        <span className="flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5" /> {registered}{" "}
                          registered
                        </span>
                        <span className="font-semibold text-primary-600">
                          {Math.round(percent)}% filled
                        </span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${
                            percent > 80
                              ? "bg-gradient-to-r from-danger-500 to-danger-600"
                              : "bg-gradient-to-r from-primary-500 to-secondary-500"
                          }`}
                          style={{ width: `${Math.min(percent, 100)}%` }}
                        />
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-2">
                        {event.club?.clubIcon ? (
                          <img
                            src={getImageUrl(event.club.clubIcon)}
                            className="w-8 h-8 rounded-full ring-2 ring-white dark:ring-slate-900"
                            alt="club"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white text-xs font-bold">
                            {event.club?.clubName?.[0] || "C"}
                          </div>
                        )}
                        <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                          {event.club?.clubName || "Campus"}
                        </span>
                      </div>
                      <Button
                        size="sm"
                        variant={
                          isRegistered
                            ? "outline"
                            : isFull
                              ? "ghost"
                              : "primary"
                        }
                        onClick={() =>
                          isRegistered
                            ? handleViewParticipants(event)
                            : handleRegister(event)
                        }
                        disabled={!isRegistered && isFull}
                        className="gap-1.5 font-semibold"
                      >
                        {isRegistered ? (
                          "Event Info"
                        ) : isFull ? (
                          "Full"
                        ) : (
                          <>
                            <Ticket className="w-4 h-4" />
                            Register
                          </>
                        )}
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      {/* Why Attend Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full text-sm font-semibold mb-4">
            <Star className="w-4 h-4" />
            Benefits
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">
            Why{" "}
            <span
              style={{
                background: "linear-gradient(to right, #fbbf24, #f59e0b)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Attend Events?
            </span>
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto text-lg leading-relaxed">
            Campus events are more than just activities — they're opportunities
            to learn, grow, and connect. Here's what you gain by participating.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {whyAttendItems.map((item, i) => (
            <div
              key={i}
              className="group relative bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-slate-50/0 to-slate-50/0 group-hover:from-primary-50/50 group-hover:to-secondary-50/50 transition-all duration-500" />

              {/* Number badge */}
              <div
                className={`absolute top-6 right-6 w-10 h-10 rounded-xl bg-gradient-to-br ${
                  item.color === "primary"
                    ? "from-primary-500 to-primary-600"
                    : item.color === "secondary"
                      ? "from-secondary-500 to-secondary-600"
                      : "from-amber-500 to-amber-600"
                } flex items-center justify-center text-white font-bold text-lg shadow-lg opacity-50 group-hover:opacity-100 transition-opacity`}
              >
                {i + 1}
              </div>

              <div
                className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${
                  item.color === "primary"
                    ? "from-primary-500 to-primary-600"
                    : item.color === "secondary"
                      ? "from-secondary-500 to-secondary-600"
                      : "from-amber-500 to-amber-600"
                } flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}
              >
                <item.icon className="w-8 h-8 text-white" />
              </div>

              <div className="relative">
                <h3 className="font-bold text-slate-900 dark:text-white text-xl mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  {item.title}
                </h3>
                <p className="text-slate-500 text-base leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <div className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-700 rounded-3xl p-10 text-white text-center overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-60 h-60 bg-white/5 rounded-full" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-secondary-400/20 rounded-full" />
          <div className="absolute top-10 left-10 w-32 h-32 border border-white/10 rounded-full" />
          <div className="absolute bottom-10 right-10 w-20 h-20 border border-white/10 rounded-full" />

          <div className="relative">
            <Sparkles className="w-8 h-8 text-amber-300 mx-auto mb-4" />
            <h2 className="text-3xl font-extrabold mb-3">
              Want to Organize Your Own Event?
            </h2>
            <p className="text-primary-100 text-lg max-w-xl mx-auto mb-6 leading-relaxed">
              Clubs can create and manage their own events. Reach out to your
              club admin or check the resource booking page to get started!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                className="bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-900 font-bold shadow-xl"
                onClick={() => navigate("/resources")}
              >
                Book Resources
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button
                variant="outline"
                className="border-white/80 text-white hover:bg-white/20"
                onClick={() => navigate("/clubs")}
              >
                Explore Clubs
              </Button>
            </div>
          </div>
        </div>
      </div>

      {selectedEvent && !showRegisterModal && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedEvent(null)}
          title="Event Participants"
          size="md"
        >
          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {selectedEvent.registrations?.length > 0 ? (
              selectedEvent.registrations.map((user, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center p-3 rounded-xl bg-slate-100 dark:bg-slate-800"
                >
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {user.name}
                    </p>
                    <p className="text-sm text-slate-500">{user.email}</p>
                  </div>

                  {user.email === authUser.email && (
                    <span className="text-xs text-green-500 font-semibold">
                      You
                    </span>
                  )}
                </div>
              ))
            ) : (
              <p className="text-center text-slate-500">No participants yet</p>
            )}
          </div>
        </Modal>
      )}

      {/* Register Modal */}
      <Modal
        isOpen={showRegisterModal}
        onClose={() => {
          setShowRegisterModal(false);
          setShowConfirmation(false);
        }}
        title={
          showConfirmation
            ? "Confirm Registration"
            : `Register for ${selectedEvent?.title}`
        }
        size="lg"
      >
        {!showConfirmation ? (
          /* Step 1: Form Entry */
          <div className="space-y-5">
            {/* Event Preview with Cover Image */}
            {selectedEvent?.coverImage && (
              <div className="relative rounded-2xl overflow-hidden h-48 -mx-6 mt-[-1.5rem]">
                <img
                  src={getImageUrl(selectedEvent.coverImage)}
                  alt={selectedEvent.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                  <Badge className="bg-white/20 backdrop-blur-xl text-white border border-white/30">
                    {selectedEvent.category || "Event"}
                  </Badge>
                  {selectedEvent.registrationType === "group" && (
                    <Badge className="bg-amber-500/90 backdrop-blur-xl text-white border border-amber-400/50">
                      <Users className="w-3 h-3 mr-1" />
                      Group Event
                    </Badge>
                  )}
                  {selectedEvent.registrationType === "solo" && (
                    <Badge className="bg-blue-500/90 backdrop-blur-xl text-white border border-blue-400/50">
                      Solo Event
                    </Badge>
                  )}
                </div>
              </div>
            )}

            <div className="bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-2xl p-4 border border-primary-100 dark:border-primary-800">
              <p className="font-bold text-slate-900 dark:text-white text-lg">
                {selectedEvent?.title}
              </p>
              <div className="flex items-center gap-3 mt-2 text-sm text-slate-500">
                <Calendar className="w-4 h-4" />
                <span>
                  {selectedEvent?.startDate
                    ? new Date(selectedEvent.startDate).toLocaleDateString(
                        "en-US",
                        { month: "long", day: "numeric", year: "numeric" },
                      )
                    : "Date TBA"}
                </span>
                {selectedEvent?.venue && (
                  <>
                    <span className="text-slate-300">|</span>
                    <MapPin className="w-4 h-4" />
                    <span>{selectedEvent.venue}</span>
                  </>
                )}
              </div>
              {selectedEvent?.registrationType === "group" &&
                selectedEvent?.maxTeamSize && (
                  <p className="text-xs text-amber-600 dark:text-amber-400 mt-2 flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    Team size: Up to {selectedEvent.maxTeamSize} members
                  </p>
                )}
            </div>

            {/* Main Registrant Info */}
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4">
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                Your Details
              </p>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  value={registrationData.name}
                  onChange={(e) =>
                    setRegistrationData({
                      ...registrationData,
                      name: e.target.value,
                    })
                  }
                  placeholder="Enter your full name"
                />
                <Input
                  label="Email"
                  type="email"
                  value={registrationData.email}
                  onChange={(e) =>
                    setRegistrationData({
                      ...registrationData,
                      email: e.target.value,
                    })
                  }
                  placeholder="your@email.com"
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <Input
                  label="Phone (Optional)"
                  value={registrationData.phone}
                  onChange={(e) =>
                    setRegistrationData({
                      ...registrationData,
                      phone: e.target.value,
                    })
                  }
                  placeholder="+91 XXXXX XXXXX"
                />
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Year
                  </label>
                  <select
                    value={registrationData.year}
                    onChange={(e) =>
                      setRegistrationData({
                        ...registrationData,
                        year: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border-2 border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-primary-500"
                  >
                    <option value="">Select year</option>
                    <option value="1st">1st Year</option>
                    <option value="2nd">2nd Year</option>
                    <option value="3rd">3rd Year</option>
                    <option value="4th">4th Year</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Team Members for Group Events */}
            {selectedEvent?.registrationType === "group" && (
              <div className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl p-4 border border-amber-200 dark:border-amber-800">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold text-amber-700 dark:text-amber-400">
                    Team Members
                  </p>
                  {selectedEvent?.maxTeamSize &&
                    teamMembers.length < selectedEvent.maxTeamSize - 1 && (
                      <button
                        onClick={addTeamMember}
                        className="text-xs text-amber-600 dark:text-amber-400 hover:text-amber-700 flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" /> Add Member
                      </button>
                    )}
                </div>
                {teamMembers.length === 0 ? (
                  <p className="text-sm text-slate-500">
                    No additional team members added yet. You can add up to{" "}
                    {selectedEvent?.maxTeamSize
                      ? selectedEvent.maxTeamSize - 1
                      : 4}{" "}
                    members.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {teamMembers.map((member, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Input
                          placeholder="Member name"
                          value={member.name}
                          onChange={(e) =>
                            updateTeamMember(index, "name", e.target.value)
                          }
                          className="flex-1"
                        />
                        <Input
                          placeholder="Member email"
                          type="email"
                          value={member.email}
                          onChange={(e) =>
                            updateTeamMember(index, "email", e.target.value)
                          }
                          className="flex-1"
                        />
                        <button
                          onClick={() => removeTeamMember(index)}
                          className="p-2 hover:bg-amber-100 dark:hover:bg-amber-900/30 rounded-lg text-amber-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <Button
                variant="ghost"
                onClick={() => setShowRegisterModal(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleRegistrationSubmit}
                disabled={
                  !registrationData.name ||
                  !registrationData.email ||
                  !registrationData.year
                }
              >
                Review Registration
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        ) : (
          /* Step 2: Confirmation */
          <div className="space-y-5">
            <div className="bg-gradient-to-br from-secondary-50 to-primary-50 dark:from-secondary-900/20 dark:to-primary-900/20 rounded-2xl p-5 border border-secondary-100 dark:border-secondary-800 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                Confirm Your Registration
              </h3>
              <p className="text-slate-500 text-sm">
                Please review your details before confirming
              </p>
            </div>

            {/* Event Cover Image in Confirmation */}
            {selectedEvent?.coverImage && (
              <div className="relative rounded-xl overflow-hidden h-32">
                <img
                  src={getImageUrl(selectedEvent.coverImage)}
                  alt={selectedEvent.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <p className="absolute bottom-3 left-4 font-semibold text-white">
                  {selectedEvent.title}
                </p>
              </div>
            )}

            {/* Registration Summary */}
            <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-5 space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                  {registrationData.name?.[0] || "?"}
                </div>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">
                    {registrationData.name}
                  </p>
                  <p className="text-sm text-slate-500">
                    {registrationData.email}
                  </p>
                  {registrationData.phone && (
                    <p className="text-sm text-slate-500">
                      {registrationData.phone}
                    </p>
                  )}
                </div>
              </div>
              <div className="border-t border-slate-200 dark:border-slate-700 pt-3 space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-secondary-500" />
                  <span className="text-slate-600 dark:text-slate-400">
                    Event:
                  </span>
                  <span className="font-medium text-slate-900 dark:text-white">
                    {selectedEvent?.title}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="w-4 h-4 text-primary-500" />
                  <span className="text-slate-600 dark:text-slate-400">
                    Year:
                  </span>
                  <span className="font-medium text-slate-900 dark:text-white">
                    {registrationData.year}
                  </span>
                </div>
                {selectedEvent?.registrationType === "group" &&
                  teamMembers.length > 0 && (
                    <div className="flex items-start gap-2 text-sm">
                      <Users className="w-4 h-4 text-amber-500 mt-0.5" />
                      <div>
                        <span className="text-slate-600 dark:text-slate-400">
                          Team ({teamMembers.length + 1} members):
                        </span>
                        <p className="font-medium text-slate-900 dark:text-white">
                          {registrationData.name},{" "}
                          {teamMembers.map((m) => m.name).join(", ")}
                        </p>
                      </div>
                    </div>
                  )}
              </div>
            </div>

            <div className="flex items-center gap-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl px-4 py-3 border border-amber-200 dark:border-amber-800">
              <Sparkles className="w-5 h-5 text-amber-500 flex-shrink-0" />
              <p className="text-sm text-amber-700 dark:text-amber-400">
                {selectedEvent?.registrationType === "group"
                  ? "Team registration will be confirmed once you submit."
                  : "You'll receive a notification once your registration is confirmed."}
              </p>
            </div>

            <div className="flex justify-between gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <Button
                variant="ghost"
                onClick={() => setShowConfirmation(false)}
              >
                <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
                Back
              </Button>
              <Button
                onClick={confirmRegistration}
                isLoading={isRegistering}
                className="bg-gradient-to-r from-secondary-500 to-secondary-600 hover:from-secondary-600 hover:to-secondary-700"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Confirm Registration
              </Button>
            </div>
          </div>
        )}
      </Modal>
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