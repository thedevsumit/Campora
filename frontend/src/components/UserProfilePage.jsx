import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "./Navbar";
import { axiosInstance } from "../lib/axios";
import { userAuthStore } from "../store/useAuthStore";
import Button from "./ui/Button";
import Badge from "./ui/Badge";
import StatCard from "./ui/StatCard";
import { Users, Heart, Calendar, MessageCircle, ArrowRight, Sparkles, User } from "lucide-react";

const UserProfilePage = () => {
  const { authUser } = userAuthStore();
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance
      .get(`/users/${userId}/profile`)
      .then((res) => setUser(res.data.user))
      .catch(() => console.error("Failed to load profile"))
      .finally(() => setLoading(false));
  }, [userId]);

  const sendChatRequest = async () => {
    try {
      setLoading(true);
      await axiosInstance.post(`/chat/request/${user._id}`);
      setShowPopup(false);
      alert("Chat request sent!");
    } catch (err) {
      console.error(err);
      alert("Failed to send request");
    } finally {
      setLoading(false);
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

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-700 text-white py-20 overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary-400/20 rounded-full blur-3xl" />

          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Avatar */}
              <div className="w-28 h-28 rounded-3xl overflow-hidden ring-4 ring-white/30 shadow-2xl">
                {user.profilePic ? (
                  <img
                    src={`http://localhost:5000${user.profilePic}`}
                    alt={user.fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center text-5xl font-bold">
                    {user.fullName?.[0]}
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="text-center md:text-left flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-primary-200" />
                  <span className="text-primary-200 text-sm font-medium">Campus Member</span>
                </div>
                <h1 className="text-4xl font-extrabold mb-2 animate-fade-in-up">
                  {user.fullName}
                </h1>
                <p className="text-primary-100 text-lg mb-3 animate-fade-in-up stagger-1">
                  {user.email}
                </p>
                <div className="flex flex-wrap justify-center md:justify-start gap-2 animate-fade-in-up stagger-2">
                  <Badge variant="default" className="bg-white/20 text-white border-0">
                    {user.dept || "Department"}
                  </Badge>
                </div>
              </div>

              {/* Message Button */}
              {userId !== authUser?._id && (
                <Button
                  variant="outline"
                  className="border-white/50 text-white hover:bg-white/20"
                  onClick={() => setShowPopup(true)}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Message
                </Button>
              )}
            </div>
          </div>

          {/* Wave */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 80L60 70C120 60 240 40 360 35C480 30 600 30 720 35C840 40 960 50 1080 55C1200 60 1320 60 1380 60L1440 60V80H1380C1320 80 1200 80 1080 80C960 80 840 80 720 80C600 80 480 80 360 80C240 80 120 80 60 80H0Z" className="fill-slate-50 dark:fill-slate-950" />
            </svg>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10 space-y-6 pb-10">
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <StatCard title="Clubs Joined" value={user.joinedClubs?.length || 0} icon={Users} className="animate-fade-in-up stagger-1" />
            <StatCard title="Clubs Followed" value={user.followedClubs?.length || 0} icon={Heart} className="animate-fade-in-up stagger-2" />
            <StatCard title="Events Attended" value={0} icon={Calendar} className="animate-fade-in-up stagger-3" />
          </div>

          {/* About */}
          {user.about && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 animate-fade-in-up">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary-500" />
                About
              </h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {user.about}
              </p>
            </div>
          )}

          {/* Clubs */}
          <ClubSection title="My Clubs" clubs={user.joinedClubs || []} />
          <ClubSection title="Followed Clubs" clubs={user.followedClubs || []} />
        </div>
      </div>

      {/* Message Popup */}
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowPopup(false)} />
          <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl shadow-2xl animate-scale-in overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Start Chat?</h3>
              <p className="text-slate-500 text-sm mt-1">
                Send a chat request to <span className="font-semibold">{user.fullName}</span>.
              </p>
            </div>
            <div className="p-6 flex gap-3">
              <Button variant="ghost" onClick={() => setShowPopup(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={sendChatRequest} isLoading={loading} className="flex-1">
                Send Request
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const ClubSection = ({ title, clubs }) => (
  <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 animate-fade-in-up">
    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-5 flex items-center gap-2">
      <Users className="w-5 h-5 text-primary-500" />
      {title}
    </h2>

    {clubs.length === 0 ? (
      <p className="text-slate-500 text-center py-8">None yet</p>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {clubs.map((club) => (
          <div
            key={club._id}
            className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
          >
            <div className="w-12 h-12 rounded-xl overflow-hidden bg-gradient-to-br from-primary-500 to-secondary-500 flex-shrink-0">
              {club.clubIcon ? (
                <img src={`http://localhost:5000${club.clubIcon}`} className="w-full h-full object-cover" alt={club.clubName} />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white text-lg font-bold">
                  {club.clubName?.[0]}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-slate-900 dark:text-white truncate">{club.clubName}</p>
              <p className="text-sm text-slate-500 line-clamp-2">{club.description}</p>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-300" />
          </div>
        ))}
      </div>
    )}
  </div>
);

export default UserProfilePage;
