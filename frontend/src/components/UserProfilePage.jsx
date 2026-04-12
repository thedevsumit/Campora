import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { axiosInstance } from "../lib/axios";
import { userAuthStore } from "../store/useAuthStore";
import Button from "./ui/Button";
import Badge from "./ui/Badge";
import {
  Users,
  Heart,
  Calendar,
  MessageCircle,
  Sparkles,
  Globe,
  ArrowRight,
  Send,
  X,
  Trophy,
  Star,
} from "lucide-react";

const UserProfilePage = () => {
  const { authUser } = userAuthStore();
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    axiosInstance
      .get(`/users/${userId}/profile`)
      .then((res) => setUser(res.data.user))
      .catch(() => console.error("Failed to load profile"))
      .finally(() => setLoading(false));
  }, [userId]);

  const sendChatRequest = async () => {
    try {
      setSending(true);
      await axiosInstance.post(`/chat/request/${user._id}`);
      setShowPopup(false);
      alert("Chat request sent!");
    } catch (err) {
      console.error(err);
      alert("Failed to send request");
    } finally {
      setSending(false);
    }
  };

  if (loading || !user) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
            <p className="text-slate-500 animate-pulse">Loading profile...</p>
          </div>
        </div>
      </>
    );
  }

  const ClubSection = ({ title, clubs, color, icon: Icon }) => {
    const colorMap = {
      primary: "from-primary-500 to-primary-600",
      secondary: "from-secondary-500 to-secondary-600",
      amber: "from-amber-500 to-amber-600",
    };

    return (
      <div className="group relative bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden">
        <div
          className={`absolute inset-0 bg-gradient-to-br ${
            color === "primary"
              ? "from-primary-50/80 to-transparent"
              : color === "secondary"
                ? "from-secondary-50/80 to-transparent"
                : "from-amber-50/80 to-transparent"
          } opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
        />

        <div
          className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${colorMap[color]} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`}
        />

        <div className="relative">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colorMap[color]} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}
              >
                <Icon className="w-5 h-5 text-white" />
              </div>
              {title}
            </h2>
            <Badge variant={color === "primary" ? "primary" : "secondary"}>
              {clubs.length}
            </Badge>
          </div>

          {clubs.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-slate-500">None yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {clubs.map((club) => (
                <div
                  key={club._id}
                  onClick={() => navigate(`/clubs/${club._id}`)}
                  className="group/card relative flex items-center gap-4 p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden"
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${
                      color === "primary"
                        ? "from-primary-50/50 to-transparent"
                        : color === "secondary"
                          ? "from-secondary-50/50 to-transparent"
                          : "from-amber-50/50 to-transparent"
                    } opacity-0 group-hover/card:opacity-100 transition-opacity duration-300`}
                  />

                  <div
                    className={`relative w-14 h-14 rounded-xl overflow-hidden bg-gradient-to-br ${colorMap[color]} flex-shrink-0 shadow-lg group-hover/card:scale-105 transition-transform`}
                  >
                    {club.clubIcon ? (
                      <img
                        src={`http://localhost:5000${club.clubIcon}`}
                        className="w-full h-full object-cover"
                        alt={club.clubName}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white text-xl font-bold">
                        {club.clubName?.[0]}
                      </div>
                    )}
                  </div>

                  <div className="relative flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-900 dark:text-white truncate group-hover/card:text-primary-600 dark:group-hover/card:text-primary-400 transition-colors">
                      {club.clubName}
                    </h3>
                    <p className="text-sm text-slate-500 line-clamp-1">
                      {club.description}
                    </p>
                  </div>

                  <ArrowRight className="w-5 h-5 text-slate-300 group-hover/card:text-primary-500 group-hover/card:translate-x-1 transition-all flex-shrink-0" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white py-24 overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary-400/20 rounded-full blur-3xl" />
          <div className="absolute top-20 left-20 w-72 h-72 border border-white/10 rounded-full" />
          <div className="absolute top-40 right-40 w-32 h-32 border border-white/10 rounded-full" />
          <div className="absolute bottom-40 left-60 w-20 h-20 bg-amber-400/20 rounded-full blur-2xl" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row items-center gap-10">
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div className="w-36 h-36 rounded-3xl overflow-hidden ring-4 ring-white/30 shadow-2xl">
                  {user.profilePic ? (
                    <img
                      src={`http://localhost:5000${user.profilePic}`}
                      alt={user.fullName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center text-6xl font-bold">
                      {user.fullName?.[0]}
                    </div>
                  )}
                </div>
              </div>

              {/* Info */}
              <div className="text-center lg:text-left flex-1 max-w-2xl">
                <div className="flex items-center justify-center lg:justify-start gap-2 mb-4">
                  <Globe className="w-5 h-5 text-primary-200" />
                  <span className="text-primary-200 text-sm font-medium uppercase tracking-wider">
                    Campus Member
                  </span>
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold mb-4 animate-fade-in-up leading-tight">
                  {user.fullName}
                </h1>
                <p className="text-primary-100 text-lg md:text-xl mb-5 animate-fade-in-up stagger-1">
                  {user.email}
                </p>
                <div className="flex flex-wrap justify-center lg:justify-start gap-3 animate-fade-in-up stagger-2">
                  <Badge
                    variant="default"
                    className="bg-white/20 text-white border-0 px-4 py-2 text-sm font-medium"
                  >
                    {user.dept || "Department"}
                  </Badge>
                  {user.year && (
                    <Badge
                      variant="default"
                      className="bg-white/20 text-white border-0 px-4 py-2 text-sm font-medium"
                    >
                      Year {user.year}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Message Button */}
              {userId !== authUser?._id && (
                <div className="flex flex-col items-center gap-4 animate-fade-in-up stagger-3">
                  <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 text-center">
                    <div className="w-14 h-14 bg-gradient-to-br from-secondary-400 to-secondary-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <MessageCircle className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      Start Chatting
                    </h3>
                    <p className="text-primary-200 text-sm">Connect with this member</p>
                  </div>
                  <Button
                    variant="outline"
                    className="border-white/80 text-white hover:bg-white/20 w-full justify-center"
                    onClick={() => setShowPopup(true)}
                  >
                    <Send className="w-5 h-5 mr-2" />
                    Send Message
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Wave */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 50L48 45.8C96 41.7 192 33.3 288 30C384 26.7 480 28.3 576 33.3C672 38.3 768 46.7 864 48.3C960 50 1056 45 1152 40C1248 35 1344 30 1392 27.5L1440 25V100H1392C1344 100 1248 100 1152 100C1056 100 960 100 864 100C768 100 672 100 576 100C480 100 384 100 288 100C192 100 96 100 48 100H0V50Z" className="fill-slate-50 dark:fill-slate-950" />
            </svg>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10 pb-10">
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
            <div className="group relative bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:shadow-primary-500/10 hover:-translate-y-2 transition-all duration-500 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-50/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 to-primary-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              <div className="relative flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <Users className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="text-3xl font-extrabold text-slate-900 dark:text-white">
                    {user.joinedClubs?.length || 0}
                  </p>
                  <p className="text-slate-500 text-sm font-medium">Clubs Joined</p>
                </div>
              </div>
            </div>

            <div className="group relative bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:shadow-secondary-500/10 hover:-translate-y-2 transition-all duration-500 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-secondary-50/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-secondary-500 to-secondary-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              <div className="relative flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-secondary-500 to-secondary-600 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <Heart className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="text-3xl font-extrabold text-slate-900 dark:text-white">
                    {user.followedClubs?.length || 0}
                  </p>
                  <p className="text-slate-500 text-sm font-medium">Clubs Followed</p>
                </div>
              </div>
            </div>

            <div className="group relative bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:shadow-amber-500/10 hover:-translate-y-2 transition-all duration-500 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-50/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-amber-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              <div className="relative flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <Calendar className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="text-3xl font-extrabold text-slate-900 dark:text-white">
                    {0}
                  </p>
                  <p className="text-slate-500 text-sm font-medium">Events Attended</p>
                </div>
              </div>
            </div>
          </div>

          {/* About */}
          {user.about && (
            <div className="group relative bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 p-8 mb-10 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              <div className="relative">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  About
                </h2>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg">
                  {user.about}
                </p>
              </div>
            </div>
          )}

          {/* Clubs */}
          <ClubSection
            title="My Clubs"
            clubs={user.joinedClubs || []}
            color="primary"
            icon={Users}
          />
          <div className="mt-6">
            <ClubSection
              title="Followed Clubs"
              clubs={user.followedClubs || []}
              color="secondary"
              icon={Heart}
            />
          </div>
        </div>
      </div>

      {/* Message Popup */}
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setShowPopup(false)}
          />
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl animate-scale-in overflow-hidden">
            <div className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-700 p-8 text-white">
              <button
                onClick={() => setShowPopup(false)}
                className="absolute top-4 right-4 p-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-xl flex items-center justify-center">
                  <MessageCircle className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Start Chat?</h3>
                  <p className="text-primary-100 text-sm">Send a connection request</p>
                </div>
              </div>
            </div>

            <div className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg overflow-hidden">
                  {user.profilePic ? (
                    <img
                      src={`http://localhost:5000${user.profilePic}`}
                      className="w-full h-full object-cover"
                      alt={user.fullName}
                    />
                  ) : (
                    user.fullName?.[0]
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-slate-900 dark:text-white text-lg">
                    {user.fullName}
                  </p>
                  <p className="text-sm text-slate-500">wants to connect with you</p>
                </div>
              </div>

              <p className="text-slate-600 dark:text-slate-400 mb-8 text-base">
                Send a chat request to start a conversation with{" "}
                <span className="font-semibold text-primary-600 dark:text-primary-400">
                  {user.fullName}
                </span>
                .
              </p>

              <div className="flex gap-4">
                <Button
                  variant="ghost"
                  onClick={() => setShowPopup(false)}
                  className="flex-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700"
                >
                  Cancel
                </Button>
                <Button
                  onClick={sendChatRequest}
                  isLoading={sending}
                  className="flex-1 shadow-lg shadow-primary-500/30 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Send Request
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserProfilePage;
