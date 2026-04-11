import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useClubStore } from "../store/useClubStore";
import { userAuthStore } from "../store/useAuthStore";
import Navbar from "./Navbar";
import Button from "./ui/Button";
import Badge from "./ui/Badge";
import { Users, Heart, Calendar, MessageCircle, Crown, LogOut, ArrowRight, Sparkles } from "lucide-react";

const ClubDetailsPage = () => {
  const { clubId } = useParams();
  const navigate = useNavigate();
  const { authUser } = userAuthStore();

  const {
    selectedClub,
    getClubById,
    joinClub,
    followClub,
    leaveClub,
    unfollowClub,
    isFetchingClub,
  } = useClubStore();

  useEffect(() => {
    getClubById(clubId);
  }, [clubId, getClubById]);

  if (isFetchingClub || !selectedClub) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
            <p className="text-slate-500 animate-pulse">Loading club details...</p>
          </div>
        </div>
      </>
    );
  }

  const isOwner = selectedClub.createdBy?._id === authUser._id || selectedClub.createdBy === authUser._id;
  const isMember = selectedClub.members?.some((m) => m.user?._id === authUser._id);
  const isFollower = selectedClub.followers?.some((u) => u?._id === authUser._id);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-700 text-white py-20 overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary-400/20 rounded-full blur-3xl" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-secondary-500/10 rounded-full blur-3xl" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Club Icon */}
            <div className="relative">
              <div className="w-32 h-32 rounded-3xl overflow-hidden ring-4 ring-white/30 shadow-2xl">
                {selectedClub.clubIcon ? (
                  <img
                    src={`http://localhost:5000${selectedClub.clubIcon}`}
                    alt={selectedClub.clubName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center text-6xl font-bold">
                    {selectedClub.clubName?.[0]}
                  </div>
                )}
              </div>
              {isOwner && (
                <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center ring-4 ring-white">
                  <Crown className="w-6 h-6 text-white" />
                </div>
              )}
            </div>

            {/* Club Info */}
            <div className="text-center md:text-left flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-primary-200" />
                <span className="text-primary-200 text-sm font-medium capitalize">{selectedClub.category || "Campus Club"}</span>
              </div>
              <h1 className="text-4xl font-extrabold mb-3 animate-fade-in-up">
                {selectedClub.clubName}
              </h1>
              <p className="text-primary-100 text-lg max-w-2xl mb-4 animate-fade-in-up stagger-1">
                {selectedClub.description || "No description provided for this club yet."}
              </p>
              <div className="flex flex-wrap justify-center md:justify-start gap-3 animate-fade-in-up stagger-2">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-xl rounded-xl px-4 py-2">
                  <Users className="w-4 h-4 text-primary-200" />
                  <span className="font-medium">{selectedClub.members?.length || 0} members</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-xl rounded-xl px-4 py-2">
                  <Heart className="w-4 h-4 text-primary-200" />
                  <span className="font-medium">{selectedClub.followers?.length || 0} followers</span>
                </div>
              </div>
            </div>
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
        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 justify-center md:justify-start animate-fade-in-up">
          {!isMember && (
            <Button
              variant="secondary"
              onClick={() => joinClub(selectedClub._id, authUser)}
              className="shadow-lg shadow-secondary-500/30"
            >
              <Users className="w-4 h-4 mr-2" />
              Join Club
            </Button>
          )}
          {isMember && (
            <Button
              variant="primary"
              onClick={() => navigate(`/clubs/${selectedClub._id}/chat`)}
              className="shadow-lg shadow-primary-500/30"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Open Group Chat
            </Button>
          )}
          {!isMember && (
            isFollower ? (
              <Button
                variant="outline"
                onClick={() => unfollowClub(selectedClub._id, authUser)}
                className="border-white/50"
              >
                <Heart className="w-4 h-4 mr-2 fill-current" />
                Unfollow
              </Button>
            ) : (
              <Button
                variant="outline"
                onClick={() => followClub(selectedClub._id, authUser)}
                className="border-white/50"
              >
                <Heart className="w-4 h-4 mr-2" />
                Follow
              </Button>
            )
          )}
          {isMember && !isOwner && (
            <Button
              variant="danger"
              onClick={() => leaveClub(selectedClub._id, authUser)}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Leave Club
            </Button>
          )}
          {isOwner && (
            <Badge variant="warning" className="px-5 py-3 text-base">
              <Crown className="w-4 h-4 mr-1.5" />
              You are the Owner
            </Badge>
          )}
        </div>

        {/* Members Section */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 animate-fade-in-up">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-primary-500" />
              Members ({selectedClub.members?.length || 0})
            </h2>
          </div>

          {selectedClub.members?.length === 0 ? (
            <p className="text-slate-500 text-center py-8">No members yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {selectedClub.members.map((m) => (
                <div
                  key={m.user?._id}
                  onClick={() => navigate(`/profile/${m.user?._id}`)}
                  className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold overflow-hidden">
                    {m.user.profilePic ? (
                      <img src={`http://localhost:5000${m.user.profilePic}`} className="w-full h-full object-cover" alt={m.user.fullName} />
                    ) : (
                      <span className="text-xl">{m.user.fullName?.[0]}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900 dark:text-white truncate">{m.user?.fullName}</p>
                    <p className="text-sm text-slate-500">{m.role || "Member"}</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-300" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Followers Section */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 animate-fade-in-up">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Heart className="w-5 h-5 text-danger-500" />
              Followers ({selectedClub.followers?.length || 0})
            </h2>
          </div>

          {selectedClub.followers?.length === 0 ? (
            <p className="text-slate-500 text-center py-8">No followers yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {selectedClub.followers.map((user) => (
                <div
                  key={user?._id}
                  onClick={() => navigate(`/profile/${user?._id}`)}
                  className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-danger-500 to-amber-500 flex items-center justify-center text-white font-bold overflow-hidden">
                    {user.profilePic ? (
                      <img src={`http://localhost:5000${user.profilePic}`} className="w-full h-full object-cover" alt={user.fullName} />
                    ) : (
                      <span className="text-xl">{user.fullName?.[0]}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900 dark:text-white truncate">{user?.fullName}</p>
                    <p className="text-sm text-slate-500">Follower</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-300" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClubDetailsPage;
