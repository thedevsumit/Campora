import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import { useEventStore } from "../store/useEventStore";
import Button from "./ui/Button";
import Badge from "./ui/Badge";
import Modal from "./ui/Modal";
import Input from "./ui/Input";
import { Calendar, Clock, MapPin, Users, Search, ChevronRight, PartyPopper, Sparkles, Ticket } from "lucide-react";

export default function EventsPage() {
  const { events, loading, fetchAllEvents, registerForEvent } = useEventStore();
  const [filterCategory, setFilterCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const [registrationData, setRegistrationData] = useState({
    name: "",
    email: "",
    phone: "",
    year: "",
  });

  useEffect(() => {
    fetchAllEvents();
  }, [fetchAllEvents]);

  const handleRegister = (event) => {
    setSelectedEvent(event);
    setShowRegisterModal(true);
  };

  const handleRegistrationSubmit = async () => {
    if (!registrationData.name || !registrationData.email) {
      return;
    }
    await registerForEvent(selectedEvent._id, registrationData);
    setShowRegisterModal(false);
    setRegistrationData({ name: "", email: "", phone: "", year: "" });
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
      <div className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-700 text-white py-24 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary-400/20 rounded-full blur-3xl" />
        <div className="absolute top-20 right-20 w-40 h-40 border border-white/10 rounded-full" />
        <div className="absolute top-40 left-40 w-20 h-20 border border-white/10 rounded-full" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-6 animate-fade-in">
            <Sparkles className="w-5 h-5 text-primary-200" />
            <span className="text-primary-200 font-medium">Campus Events</span>
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 animate-fade-in-up">
            Upcoming <span className="bg-gradient-to-r from-primary-200 to-secondary-200 bg-clip-text text-transparent">Events</span>
          </h1>
          <p className="text-xl text-primary-100 mb-10 animate-fade-in-up stagger-1 max-w-2xl mx-auto">
            Discover and join amazing campus events. Connect, learn, and create memories.
          </p>

          {/* Search */}
          <div className="max-w-xl mx-auto animate-fade-in-up stagger-2">
            <div className="relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-300" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-5 py-4 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 text-white placeholder-primary-200 focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/20 transition-all text-base"
              />
            </div>
          </div>
        </div>

        {/* Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 50L48 45.8C96 41.7 192 33.3 288 30C384 26.7 480 28.3 576 33.3C672 38.3 768 46.7 864 48.3C960 50 1056 45 1152 40C1248 35 1344 30 1392 27.5L1440 25V100H1392C1344 100 1248 100 1152 100C1056 100 960 100 864 100C768 100 672 100 576 100C480 100 384 100 288 100C192 100 96 100 48 100H0V50Z" className="fill-slate-50 dark:fill-slate-950" />
          </svg>
        </div>
      </div>

      {/* Category Filters */}
      <div className="sticky top-16 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border-b border-slate-200/50 dark:border-slate-700/50 py-4">
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
                {c}
              </button>
            ))}
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
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">No events found</h3>
            <p className="text-slate-500 max-w-md mx-auto">
              {searchQuery ? "Try adjusting your search or filters" : "Check back later for upcoming events!"}
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event, idx) => {
              const registered = event.registrations?.length || 0;
              const percent = (registered / event.maxParticipants) * 100 || 0;
              const isFull = registered >= event.maxParticipants;

              return (
                <div
                  key={event._id}
                  className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:shadow-primary-500/10 transition-all duration-500 hover:-translate-y-2 group animate-fade-in-up"
                  style={{ animationDelay: `${idx * 75}ms` }}
                >
                  {/* Event Image */}
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={event.image || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800"}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex gap-2">
                      <Badge variant="primary" className="backdrop-blur-xl bg-white/20 text-white border border-white/30">
                        {event.category || "General"}
                      </Badge>
                    </div>
                    {isFull && (
                      <div className="absolute top-4 right-4">
                        <Badge variant="danger" className="bg-white/20 backdrop-blur-xl border border-white/30">
                          Event Full
                        </Badge>
                      </div>
                    )}

                    {/* Date */}
                    <div className="absolute bottom-4 left-4 text-white">
                      <div className="flex items-center gap-2 bg-white/10 backdrop-blur-xl rounded-xl px-3 py-2 border border-white/20">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm font-medium">
                          {event.date ? new Date(event.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "TBA"}
                        </span>
                        {event.time && (
                          <>
                            <Clock className="w-4 h-4 ml-1" />
                            <span className="text-sm">{event.time}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-1">
                      {event.title}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                      {event.description}
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
                          <Users className="w-3.5 h-3.5" /> {registered} registered
                        </span>
                        <span className="font-medium">{Math.round(percent)}%</span>
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
                        {event.club?.clubIcon && (
                          <img
                            src={`http://localhost:5000${event.club.clubIcon}`}
                            className="w-6 h-6 rounded-full ring-2 ring-white dark:ring-slate-900"
                            alt="club"
                          />
                        )}
                        <span className="text-sm text-slate-500">{event.club?.clubName || "Club"}</span>
                      </div>
                      <Button
                        size="sm"
                        variant={isFull ? "ghost" : "primary"}
                        onClick={() => handleRegister(event)}
                        disabled={isFull}
                        className="gap-1.5"
                      >
                        {isFull ? (
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

      {/* Register Modal */}
      <Modal isOpen={showRegisterModal} onClose={() => setShowRegisterModal(false)} title={`Register for ${selectedEvent?.title}`} size="md">
        <div className="space-y-5">
          <Input
            label="Full Name"
            value={registrationData.name}
            onChange={(e) => setRegistrationData({ ...registrationData, name: e.target.value })}
            placeholder="Enter your full name"
          />
          <Input
            label="Email"
            type="email"
            value={registrationData.email}
            onChange={(e) => setRegistrationData({ ...registrationData, email: e.target.value })}
            placeholder="your@email.com"
          />
          <Input
            label="Phone (Optional)"
            value={registrationData.phone}
            onChange={(e) => setRegistrationData({ ...registrationData, phone: e.target.value })}
            placeholder="+91 XXXXX XXXXX"
          />
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Year
            </label>
            <select
              value={registrationData.year}
              onChange={(e) => setRegistrationData({ ...registrationData, year: e.target.value })}
              className="w-full px-4 py-3.5 border-2 border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all appearance-none cursor-pointer"
            >
              <option value="">Select year</option>
              <option value="1st">1st Year</option>
              <option value="2nd">2nd Year</option>
              <option value="3rd">3rd Year</option>
              <option value="4th">4th Year</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button variant="ghost" onClick={() => setShowRegisterModal(false)}>Cancel</Button>
            <Button onClick={handleRegistrationSubmit}>Complete Registration</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
