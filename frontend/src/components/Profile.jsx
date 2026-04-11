import React, { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import EditProfileModal from "../components/EditProfile";
import { userAuthStore } from "../store/useAuthStore";
import { useClubStore } from "../store/useClubStore";
import Navbar from "./Navbar";
import StatCard from "./ui/StatCard";
import Button from "./ui/Button";
import Badge from "./ui/Badge";
import { LogOut, Users, Calendar, Heart, Settings, Sparkles, ArrowRight } from "lucide-react";

const ProfilePage = () => {
  const { authUser, logout } = userAuthStore();
  const navigate = useNavigate();
  const {
    joinedClubs,
    followedClubs,
    isFetchingProfileClubs,
    attendedEvents,
    getJoinedClubs,
    getFollowedClubs,
    getAttendedEvents,
    createdClubs,
    getCreatedClubs,
  } = useClubStore();

  useEffect(() => {
    getJoinedClubs();
    getFollowedClubs();
    getAttendedEvents();
    getCreatedClubs();
  }, []);

  const [showEditProfile, setShowEditProfile] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />

      {/* Hero Header */}
      <div className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-700 text-white py-20 overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary-400/20 rounded-full blur-3xl" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Avatar */}
            <div className="relative">
              <div className="w-32 h-32 rounded-3xl overflow-hidden ring-4 ring-white/30 shadow-2xl">
                {authUser.profilePic ? (
                  <img
                    src={`http://localhost:5000${authUser.profilePic}`}
                    alt={authUser.fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center text-5xl font-bold">
                    {authUser.fullName?.[0]}
                  </div>
                )}
              </div>
              <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-secondary-500 rounded-full flex items-center justify-center ring-4 ring-white">
                <span className="text-xs font-bold">{authUser.userRole || "User"}</span>
              </div>
            </div>

            {/* Info */}
            <div className="text-center md:text-left flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-primary-200" />
                <span className="text-primary-200 text-sm font-medium">Campus Member</span>
              </div>
              <h1 className="text-4xl font-extrabold mb-2 animate-fade-in-up">
                {authUser?.fullName || "User Name"}
              </h1>
              <p className="text-primary-100 text-lg mb-3 animate-fade-in-up stagger-1">
                {authUser?.email || "user@email.com"}
              </p>
              <div className="flex flex-wrap justify-center md:justify-start gap-2 animate-fade-in-up stagger-2">
                <Badge variant="default" className="bg-white/20 text-white border-0">
                  {authUser?.dept || "Department"}
                </Badge>
                {authUser?.year && (
                  <Badge variant="default" className="bg-white/20 text-white border-0">
                    Year {authUser.year}
                  </Badge>
                )}
              </div>
            </div>

            {/* Edit Button */}
            <Button
              variant="outline"
              className="border-white/50 text-white hover:bg-white/20"
              onClick={() => setShowEditProfile(true)}
            >
              <Settings className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        </div>

        {/* Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 80L60 70C120 60 240 40 360 35C480 30 600 30 720 35C840 40 960 50 1080 55C1200 60 1320 60 1380 60L1440 60V80H1380C1320 80 1200 80 1080 80C960 80 840 80 720 80C600 80 480 80 360 80C240 80 120 80 60 80H0Z" className="fill-slate-50 dark:fill-slate-950" />
          </svg>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10 space-y-6 pb-10">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <StatCard title="Clubs Joined" value={joinedClubs?.length || 0} icon={Users} className="animate-fade-in-up stagger-1" />
          <StatCard title="Clubs Followed" value={followedClubs?.length || 0} icon={Heart} className="animate-fade-in-up stagger-2" />
          <StatCard title="Events Attended" value={attendedEvents?.length || 0} icon={Calendar} className="animate-fade-in-up stagger-3" />
        </div>

        {/* About */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 animate-fade-in-up">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary-500" />
            About
          </h2>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            {authUser?.about || "No bio added yet."}
          </p>
        </div>

        {/* My Clubs */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 animate-fade-in-up">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-primary-500" />
              My Clubs
            </h2>
            <Badge variant="primary">{joinedClubs?.length || 0}</Badge>
          </div>

          {isFetchingProfileClubs ? (
            <p className="text-slate-500">Loading...</p>
          ) : joinedClubs.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-slate-500 mb-4">You haven't joined any clubs yet.</p>
              <Button variant="outline" size="sm" onClick={() => navigate('/clubs')}>
                Browse Clubs
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {joinedClubs.map((club) => (
                <div
                  key={club._id}
                  onClick={() => navigate(`/clubs/${club._id}`)}
                  className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                >
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-gradient-to-br from-primary-500 to-secondary-500 flex-shrink-0">
                    {club.clubIcon ? (
                      <img src={`http://localhost:5000${club.clubIcon}`} className="w-full h-full object-cover" alt={club.clubName} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white text-xl font-bold">
                        {club.clubName?.[0]}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-900 dark:text-white truncate">{club.clubName}</h3>
                    <p className="text-sm text-slate-500 line-clamp-1">{club.description}</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-300" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Followed Clubs */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 animate-fade-in-up">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Heart className="w-5 h-5 text-danger-500" />
              Followed Clubs
            </h2>
            <Badge variant="danger">{followedClubs?.length || 0}</Badge>
          </div>

          {followedClubs.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-slate-500 mb-4">You're not following any clubs.</p>
              <Button variant="outline" size="sm" onClick={() => navigate('/clubs')}>
                Discover Clubs
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {followedClubs.map((club) => (
                <div
                  key={club._id}
                  onClick={() => navigate(`/clubs/${club._id}`)}
                  className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                >
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-gradient-to-br from-danger-500 to-amber-500 flex-shrink-0">
                    {club.clubIcon ? (
                      <img src={`http://localhost:5000${club.clubIcon}`} className="w-full h-full object-cover" alt={club.clubName} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white text-xl font-bold">
                        {club.clubName?.[0]}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-900 dark:text-white truncate">{club.clubName}</h3>
                    <p className="text-sm text-slate-500 line-clamp-1">{club.description}</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-300" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Created Clubs */}
        {createdClubs?.length > 0 && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 animate-fade-in-up">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                Created Clubs
              </h2>
              <Badge variant="warning">{createdClubs?.length || 0}</Badge>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {createdClubs.map((club) => (
                <div
                  key={club._id}
                  onClick={() => navigate(`/clubs/${club._id}/admin`)}
                  className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                >
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-gradient-to-br from-amber-500 to-amber-600 flex-shrink-0">
                    {club.clubIcon ? (
                      <img src={`http://localhost:5000${club.clubIcon}`} className="w-full h-full object-cover" alt={club.clubName} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white text-xl font-bold">
                        {club.clubName?.[0]}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-900 dark:text-white truncate">{club.clubName}</h3>
                    <p className="text-sm text-slate-500 line-clamp-1">{club.description}</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-300" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Account Actions */}
        <div className="flex justify-center pt-4 animate-fade-in-up">
          <Button
            variant="danger"
            onClick={logout}
            className="shadow-lg shadow-danger-500/20"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      <EditProfileModal
        show={showEditProfile}
        onClose={() => setShowEditProfile(false)}
      />
    </div>
  );
};

export default ProfilePage;
