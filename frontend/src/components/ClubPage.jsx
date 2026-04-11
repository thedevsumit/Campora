import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useClubStore } from "../store/useClubStore";
import ClubCard from "../components/ClubCard";
import Navbar from "./Navbar";
import Button from "./ui/Button";
import Input from "./ui/Input";
import { Search, Plus, Users, Sparkles, Folders } from "lucide-react";

const ClubsPage = () => {
  const { clubs, getAllClubs, isFetchingClubs } = useClubStore();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    getAllClubs();
  }, [getAllClubs]);

  const filteredClubs = clubs.filter(club =>
    club.clubName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    club.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white py-20 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary-400/20 rounded-full blur-3xl" />
        <div className="absolute top-20 left-20 w-72 h-72 border border-white/10 rounded-full" />
        <div className="absolute top-40 right-40 w-32 h-32 border border-white/10 rounded-full" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
                <Folders className="w-6 h-6 text-primary-200" />
                <span className="text-primary-200 font-medium">Campus Life</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 animate-fade-in-up">
                Discover <span className="bg-gradient-to-r from-primary-200 to-secondary-200 bg-clip-text text-transparent">Clubs</span>
              </h1>
              <p className="text-primary-100 text-lg md:text-xl animate-fade-in-up stagger-1">
                Find your community and make lasting connections
              </p>
            </div>

            <div className="flex items-center gap-4 animate-fade-in-up stagger-2">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-xl px-5 py-3 rounded-2xl border border-white/20">
                <Users className="w-5 h-5 text-primary-200" />
                <span className="font-semibold">{clubs.length} clubs</span>
              </div>
              <Button
                variant="outline"
                className="border-white/50 text-white hover:bg-white/20 backdrop-blur-xl"
                onClick={() => navigate("/create-club")}
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Club
              </Button>
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

      {/* Search */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl shadow-primary-500/5 p-2 border border-slate-200/50 dark:border-slate-800">
          <div className="relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search clubs by name or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-5 py-4 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-transparent dark:border-transparent text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-primary-500 focus:bg-white dark:focus:bg-slate-900 transition-all text-base"
            />
          </div>
        </div>
      </div>

      {/* Clubs Grid */}
      <div className="max-w-7xl mx-auto p-6 sm:p-8 lg:p-10">
        {isFetchingClubs ? (
          <div className="flex items-center justify-center py-24">
            <div className="flex flex-col items-center gap-5">
              <div className="w-14 h-14 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
              <p className="text-slate-500 animate-pulse text-lg">Loading clubs...</p>
            </div>
          </div>
        ) : filteredClubs.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-24 h-24 mx-auto mb-6 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
              <Sparkles className="w-10 h-10 text-slate-300 dark:text-slate-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">No clubs found</h3>
            <p className="text-slate-500 mb-8 max-w-md mx-auto">
              {searchQuery ? "Try adjusting your search terms" : "Be the first to create a club on campus!"}
            </p>
            {!searchQuery && (
              <Button onClick={() => navigate("/create-club")}>
                <Plus className="w-4 h-4 mr-2" />
                Create First Club
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
    </div>
  );
};

export default ClubsPage;
