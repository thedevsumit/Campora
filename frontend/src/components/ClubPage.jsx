import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useClubStore } from "../store/useClubStore";
import ClubCard from "../components/ClubCard";
import Navbar from "./Navbar";
import Button from "./ui/Button";
import { Search, Plus, Users, Sparkles, Folders, Zap, Globe, ArrowRight, Star, Heart, Trophy } from "lucide-react";

const categories = ["All", "Technical", "Cultural", "Sports", "Arts", "Business", "Social"];

const whyJoinItems = [
  {
    icon: Zap,
    title: "Learn New Skills",
    desc: "Sharpen your abilities through exclusive workshops, hackathons, and hands-on sessions led by industry experts and senior campus leaders.",
    color: "primary",
  },
  {
    icon: Users,
    title: "Build Meaningful Connections",
    desc: "Find your people! Network with like-minded students, collaborate on exciting projects, and forge friendships that last far beyond graduation.",
    color: "secondary",
  },
  {
    icon: Sparkles,
    title: "Grow &level Up",
    desc: "Challenge yourself by participating in inter-college events, competitions, fests, and leadership opportunities that shape your future.",
    color: "amber",
  },
];

const clubTypes = [
  { icon: Trophy, label: "Technical", desc: "Coding, robotics, AI, development", count: 12 },
  { icon: Star, label: "Cultural", desc: "Music, dance, drama, literature", count: 8 },
  { icon: Zap, label: "Sports", desc: "Cricket, football, badminton, esports", count: 6 },
  { icon: Heart, label: "Social", desc: "Social causes, welfare, volunteering", count: 5 },
];

const ClubsPage = () => {
  const { clubs, getAllClubs, isFetchingClubs } = useClubStore();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    getAllClubs();
  }, [getAllClubs]);

  const filteredClubs = clubs.filter((club) => {
    const matchesSearch =
      club.clubName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      club.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const totalMembers = clubs.reduce(
    (sum, club) => sum + (club.memberCount || club.members?.length || 0),
    0
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white py-24 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary-400/20 rounded-full blur-3xl" />
        <div className="absolute top-20 left-20 w-72 h-72 border border-white/10 rounded-full" />
        <div className="absolute top-40 right-40 w-32 h-32 border border-white/10 rounded-full" />
        <div className="absolute bottom-40 left-60 w-20 h-20 bg-amber-400/20 rounded-full blur-2xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="text-center md:text-left max-w-2xl">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-5">
                <Globe className="w-5 h-5 text-primary-200" />
                <span className="text-primary-200 text-sm font-medium uppercase tracking-wider">
                  Campus Life
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-5 animate-fade-in-up leading-tight">
                Discover Your{" "}
                <span className="bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-200 bg-clip-text text-transparent">
                  Tribe
                </span>{" "}
                on Campus
              </h1>

              <p className="text-primary-100 text-lg md:text-xl animate-fade-in-up stagger-1 max-w-xl leading-relaxed">
                Every student deserves a community that fuels their passion.
                Browse through our diverse range of clubs — from technical
                powerhouses to cultural hotspots — and find where you truly
                belong. Your next great adventure is just one click away.
              </p>

              <div className="flex flex-wrap items-center gap-6 mt-8 justify-center md:justify-start animate-fade-in-up stagger-2">
                <div className="flex items-center gap-4 bg-white/15 backdrop-blur-xl px-6 py-4 rounded-2xl border border-white/20 shadow-xl">
                  <div className="p-3 bg-gradient-to-br from-amber-400 to-amber-500 rounded-xl shadow-lg">
                    <Trophy className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-3xl font-extrabold text-white">
                      {clubs.length}+
                    </p>
                    <p className="text-primary-200 text-sm font-medium">
                      Active Clubs
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 bg-white/15 backdrop-blur-xl px-6 py-4 rounded-2xl border border-white/20 shadow-xl">
                  <div className="p-3 bg-gradient-to-br from-secondary-400 to-secondary-500 rounded-xl shadow-lg">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-3xl font-extrabold text-white">
                      {totalMembers}+
                    </p>
                    <p className="text-primary-200 text-sm font-medium">
                      Total Members
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 bg-white/15 backdrop-blur-xl px-6 py-4 rounded-2xl border border-white/20 shadow-xl">
                  <div className="p-3 bg-gradient-to-br from-rose-400 to-rose-500 rounded-xl shadow-lg">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-3xl font-extrabold text-white">100+</p>
                    <p className="text-primary-200 text-sm font-medium">
                      Events Hosted
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center gap-4 animate-fade-in-up stagger-3">
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 text-center max-w-sm">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Plus className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Can't Find Your Club?
                </h3>
                <p className="text-primary-100 text-sm leading-relaxed mb-4">
                  Nothing speaking to you? Start your own! Lead a community
                  around your passion and become the voice of change.
                </p>
              </div>
              <Button
                onClick={() => navigate("/create-club")}
                variant="outline"
                className="border-white/80 text-white w-full hover:bg-white/20 hover:border-white"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create Your Own Club
              </Button>
              <p className="text-white/60 text-xs text-center max-w-xs">
                It takes less than 5 minutes to launch your club and start
                recruiting members
              </p>
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

      {/* Browse by Category Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full text-sm font-semibold mb-4">
            <Globe className="w-4 h-4" />
            Explore Categories
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">
            Find Clubs That Match Your{" "}
            <span className="bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
              Passion
            </span>
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto text-lg leading-relaxed">
            From coding marathons to cultural festivals, there's a club for
            every interest. Click on a category to explore clubs that align with
            your passion and start your journey today.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {clubTypes.map((type, i) => (
            <div
              key={i}
              className="group relative bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:shadow-primary-500/10 hover:-translate-y-2 transition-all duration-500 cursor-pointer overflow-hidden"
              onClick={() => setActiveCategory(type.label)}
            >
              {/* Animated gradient overlay */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${
                  i === 0
                    ? "from-primary-500/5 to-transparent"
                    : i === 1
                      ? "from-secondary-500/5 to-transparent"
                      : i === 2
                        ? "from-amber-500/5 to-transparent"
                        : "from-rose-500/5 to-transparent"
                } opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
              />

              {/* Top accent bar */}
              <div
                className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${
                  i === 0
                    ? "from-primary-500 to-primary-400"
                    : i === 1
                      ? "from-secondary-500 to-secondary-400"
                      : i === 2
                        ? "from-amber-500 to-amber-400"
                        : "from-rose-500 to-rose-400"
                } transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`}
              />

              {/* Icon */}
              <div
                className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${
                  i === 0
                    ? "from-primary-500 to-primary-600"
                    : i === 1
                      ? "from-secondary-500 to-secondary-600"
                      : i === 2
                        ? "from-amber-500 to-amber-600"
                        : "from-rose-500 to-rose-600"
                } flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}
              >
                <type.icon className="w-8 h-8 text-white" />
              </div>

              {/* Content */}
              <div className="relative">
                <h3 className="font-bold text-slate-900 dark:text-white text-xl mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  {type.label}
                </h3>
                <p className="text-slate-500 text-sm mb-4 leading-relaxed">
                  {type.desc}
                </p>

                {/* Stats */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-slate-400" />
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      {type.count} clubs
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-primary-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-sm font-semibold">Explore</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>

              {/* Decorative corner */}
              <div
                className={`absolute -bottom-4 -right-4 w-20 h-20 rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-500 ${
                  i === 0
                    ? "bg-primary-500"
                    : i === 1
                      ? "bg-secondary-500"
                      : i === 2
                        ? "bg-amber-500"
                        : "bg-rose-500"
                }`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Search & Filter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4 relative z-10">
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl shadow-primary-500/5 p-4 border border-slate-200/50 dark:border-slate-800">
          <div className="relative mb-3">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search clubs by name, description, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-5 py-4 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-transparent dark:border-transparent text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-primary-500 focus:bg-white dark:focus:bg-slate-900 transition-all text-base"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  activeCategory === cat
                    ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/30"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 sm:p-8 lg:p-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              {filteredClubs.length}{" "}
              {filteredClubs.length === 1 ? "Club" : "Clubs"} Available
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              {searchQuery
                ? `Showing results for "${searchQuery}"`
                : "Explore and find your perfect match"}
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Folders className="w-4 h-4" />
            <span>Sorted by newest</span>
          </div>
        </div>

        {isFetchingClubs ? (
          <div className="flex items-center justify-center py-24">
            <div className="flex flex-col items-center gap-5">
              <div className="w-14 h-14 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
              <p className="text-slate-500 animate-pulse text-lg">
                Loading clubs...
              </p>
            </div>
          </div>
        ) : filteredClubs.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-24 h-24 mx-auto mb-6 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
              <Sparkles className="w-10 h-10 text-slate-300 dark:text-slate-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
              {searchQuery ? "No clubs match your search" : "No clubs yet"}
            </h3>
            <p className="text-slate-500 mb-8 max-w-md mx-auto leading-relaxed">
              {searchQuery
                ? "We couldn't find any clubs matching your search. Try different keywords or clear the search to browse all clubs."
                : "The campus is quiet for now. Be the pioneer — create the first club and inspire your entire campus community!"}
            </p>
            {!searchQuery && (
              <Button onClick={() => navigate("/create-club")}>
                <Plus className="w-4 h-4 mr-2" />
                Create First Club
              </Button>
            )}
            {searchQuery && (
              <Button
                variant="outline"
                onClick={() => setSearchQuery("")}
                className="mt-3"
              >
                Clear Search
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClubs.map((club, idx) => (
              <div
                key={club._id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${idx * 75}ms` }}
              >
                <ClubCard
                  club={club}
                  onClick={() => navigate(`/clubs/${club._id}`)}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Why Join Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-secondary-100 dark:bg-secondary-900/30 text-secondary-600 dark:text-secondary-400 rounded-full text-sm font-semibold mb-4">
            <Star className="w-4 h-4" />
            Benefits
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">
            Why{" "}
            <span className="bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
              Join a Club?
            </span>
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto text-lg leading-relaxed">
            Clubs are more than just activities — they're launchpads for your
            personal and professional growth. Here's what awaits you as a member
            of our vibrant campus community.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {whyJoinItems.map((item, i) => (
            <div
              key={i}
              className="group relative bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden"
            >
              {/* Animated gradient overlay */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${
                  item.color === "primary"
                    ? "from-primary-50/80 to-transparent"
                    : item.color === "secondary"
                      ? "from-secondary-50/80 to-transparent"
                      : "from-amber-50/80 to-transparent"
                } opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
              />

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

              {/* Icon */}
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

              {/* Content */}
              <div className="relative">
                <h3 className="font-bold text-slate-900 dark:text-white text-xl mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  {item.title}
                </h3>
                <p className="text-slate-500 text-base leading-relaxed mb-5">
                  {item.desc}
                </p>

                {/* Decorative bottom line */}
                <div
                  className={`h-1 w-16 rounded-full bg-gradient-to-r ${
                    item.color === "primary"
                      ? "from-primary-500 to-primary-300"
                      : item.color === "secondary"
                        ? "from-secondary-500 to-secondary-300"
                        : "from-amber-500 to-amber-300"
                  } transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-10 text-center">
          <p className="text-slate-500 text-base mb-4">
            Ready to unlock these benefits and more?
          </p>
          <Button
            onClick={() => navigate("/clubs")}
            variant="outline"
            className="font-semibold"
          >
            Explore All Clubs
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>

      {/* Featured Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <div className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-700 rounded-3xl p-10 text-white text-center overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-60 h-60 bg-white/5 rounded-full" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-secondary-400/20 rounded-full" />
          <div className="absolute top-10 left-10 w-32 h-32 border border-white/10 rounded-full" />
          <div className="absolute bottom-10 right-10 w-20 h-20 border border-white/10 rounded-full" />
          <div className="absolute top-1/2 left-8 w-4 h-4 bg-amber-400 rounded-full" />
          <div className="absolute top-20 right-20 w-3 h-3 bg-white/60 rounded-full" />

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/15 rounded-full border border-white/20 mb-6 animate-fade-in">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span className="text-white/90 text-sm font-medium">
              Start Your Journey
            </span>
          </div>

          {/* Content */}
          <div className="relative">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-3">
              Ready to{" "}
              <span
                style={{
                  background: "linear-gradient(to right, #fbbf24, #f59e0b)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Make a Difference?
              </span>
            </h2>
            <p className="text-primary-100 text-lg max-w-2xl mx-auto mb-6 leading-relaxed">
              Every great journey begins with a single step. Whether you join an
              existing club or create your own, you're about to unlock a world
              of opportunities, friendships, and experiences that will shape
              your campus legacy.
            </p>

            {/* Stats Row */}
            <div className="flex flex-wrap justify-center gap-6 mb-8">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-xl px-5 py-3 rounded-2xl border border-white/20">
                <Users className="w-5 h-5 text-amber-300" />
                <span className="font-semibold">Join 500+ Students</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-xl px-5 py-3 rounded-2xl border border-white/20">
                <Star className="w-5 h-5 text-amber-300" />
                <span className="font-semibold">50+ Active Clubs</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-xl px-5 py-3 rounded-2xl border border-white/20">
                <Trophy className="w-5 h-5 text-amber-300" />
                <span className="font-semibold">100+ Events Yearly</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                className="bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-900 font-bold shadow-xl shadow-amber-500/30"
                onClick={() => navigate("/create-club")}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Create Your Club
              </Button>
              <Button
                variant="outline"
                className="border-white/80 text-white hover:bg-white/20"
                onClick={() => navigate("/clubs")}
              >
                Browse Clubs
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>

          {/* Decorative corner glow */}
          <div className="relative -bottom-4 left-[90%] w-32 h-32 bg-amber-400/20 rounded-full" />
        </div>
      </div>

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
};

export default ClubsPage;