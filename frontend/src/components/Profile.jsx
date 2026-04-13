import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import EditProfileModal from "../components/EditProfile";
import { getImageUrl } from "../lib/utils";
import { userAuthStore } from "../store/useAuthStore";
import { useClubStore } from "../store/useClubStore";
import Navbar from "./Navbar";
import Button from "./ui/Button";
import Badge from "./ui/Badge";
import {
  LogOut,
  Users,
  Calendar,
  Heart,
  Settings,
  Sparkles,
  ArrowRight,
  Trophy,
  Star,
  Globe,
  Edit3,
  Plus,
  Award,
  TrendingUp,
  Clock,
} from "lucide-react";

const whyJoinItems = [
  {
    icon: Users,
    title: "Build Your Network",
    desc: "Connect with like-minded students, industry experts, and campus leaders to build relationships that last a lifetime.",
    color: "primary",
  },
  {
    icon: TrendingUp,
    title: "Level Up Skills",
    desc: "Access exclusive workshops, hackathons, and hands-on projects that sharpen your abilities and boost your career.",
    color: "secondary",
  },
  {
    icon: Award,
    title: "Earn Recognition",
    desc: "Participate in competitions, earn certificates, and build a portfolio that stands out to future employers.",
    color: "amber",
  },
];

const ClubSection = ({ title, clubs, color, icon: Icon, colorClass, onClubClick }) => {
  const colorMap = {
    primary: "from-primary-500 to-primary-600",
    secondary: "from-secondary-500 to-secondary-600",
    amber: "from-amber-500 to-amber-600",
    rose: "from-rose-500 to-rose-600",
  };

  const colorSecondary = {
    primary: "to-primary-400",
    secondary: "to-secondary-400",
    amber: "to-amber-400",
    rose: "to-rose-400",
  };

  return (
    <div className="group relative bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden">
      <div
        className={`absolute inset-0 bg-gradient-to-br ${
          color === "primary"
            ? "from-primary-50/80 to-transparent"
            : color === "secondary"
              ? "from-secondary-50/80 to-transparent"
              : color === "amber"
                ? "from-amber-50/80 to-transparent"
                : "from-rose-50/80 to-transparent"
        } opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
      />

      <div
        className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${
          colorMap[color]
        } ${colorSecondary[color]} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`}
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
          <Badge
            variant={
              color === "primary"
                ? "primary"
                : color === "secondary"
                  ? "secondary"
                  : color === "amber"
                    ? "warning"
                    : "danger"
            }
          >
            {clubs.length}
          </Badge>
        </div>

        {clubs.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto mb-6 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center">
              <Icon className="w-10 h-10 text-slate-300 dark:text-slate-600" />
            </div>
            <p className="text-slate-500 mb-6 text-lg">No clubs yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {clubs.map((club, idx) => (
              <div
                key={club._id}
                onClick={() => onClubClick(club._id)}
                className="group/card relative flex items-center gap-4 p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden"
                style={{ animationDelay: `${idx * 75}ms` }}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${
                    color === "primary"
                      ? "from-primary-50/50 to-transparent"
                      : color === "secondary"
                        ? "from-secondary-50/50 to-transparent"
                        : color === "amber"
                          ? "from-amber-50/50 to-transparent"
                          : "from-rose-50/50 to-transparent"
                  } opacity-0 group-hover/card:opacity-100 transition-opacity duration-300`}
                />

                <div
                  className={`relative w-14 h-14 rounded-xl overflow-hidden bg-gradient-to-br ${colorMap[color]} flex-shrink-0 shadow-lg group-hover/card:scale-105 transition-transform duration-300`}
                >
                  {club.clubIcon ? (
                    <img
                      src={getImageUrl(club.clubIcon)}
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

  const totalClubs = (joinedClubs?.length || 0) + (followedClubs?.length || 0);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />

      {/* Hero Header */}
      <div className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white py-24 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary-400/20 rounded-full blur-3xl" />
        <div className="absolute top-20 left-20 w-72 h-72 border border-white/10 rounded-full" />
        <div className="absolute top-40 right-40 w-32 h-32 border border-white/10 rounded-full" />
        <div className="absolute bottom-40 left-60 w-20 h-20 bg-amber-400/20 rounded-full blur-2xl" />
        <div className="absolute top-1/2 left-8 w-4 h-4 bg-amber-400 rounded-full" />
        <div className="absolute top-20 right-20 w-3 h-3 bg-white/60 rounded-full" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-10">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-36 h-36 rounded-3xl overflow-hidden ring-4 ring-white/30 shadow-2xl relative group">
                {authUser.profilePic ? (
                  <img
                    src={getImageUrl(authUser.profilePic)}
                    alt={authUser.fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center text-6xl font-bold">
                    {authUser.fullName?.[0]}
                  </div>
                )}
                {/* Hover overlay with edit */}
                <div
                  className="absolute inset-0 bg-slate-900/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                  onClick={() => setShowEditProfile(true)}
                >
                  <Edit3 className="w-8 h-8 text-white" />
                </div>
              </div>
              {/* Role badge */}
              <div className="absolute -bottom-3 -right-3 w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-500 rounded-2xl flex items-center justify-center shadow-lg ring-4 ring-white">
                <Trophy className="w-6 h-6 text-white" />
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
                {authUser?.fullName || "User Name"}
              </h1>
              <p className="text-primary-100 text-lg md:text-xl mb-5 animate-fade-in-up stagger-1">
                {authUser?.email || "user@email.com"}
              </p>
              <div className="flex flex-wrap justify-center lg:justify-start gap-3 animate-fade-in-up stagger-2">
                <Badge
                  variant="default"
                  className="bg-white/20 text-white border-0 px-4 py-2 text-sm font-medium"
                >
                  {authUser?.dept || "Department"}
                </Badge>
                {authUser?.year && (
                  <Badge
                    variant="default"
                    className="bg-white/20 text-white border-0 px-4 py-2 text-sm font-medium"
                  >
                    Year {authUser.year}
                  </Badge>
                )}
                <Badge
                  variant="default"
                  className="bg-amber-400/90 text-slate-900 border-0 px-4 py-2 text-sm font-bold"
                >
                  <Trophy className="w-4 h-4 mr-1.5" />
                  {authUser.userRole || "Member"}
                </Badge>
              </div>
            </div>

            {/* Edit Button Card */}
            <div className="flex flex-col items-center gap-4 animate-fade-in-up stagger-3">
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 text-center">
                <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Edit3 className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Edit Profile</h3>
                <p className="text-primary-200 text-sm">Update your information</p>
              </div>
              <Button
                variant="outline"
                className="border-white/80 text-white hover:bg-white/20 w-full justify-center"
                onClick={() => setShowEditProfile(true)}
              >
                <Settings className="w-5 h-5 mr-2" />
                Edit Profile
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10 pb-10">

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <div className="group relative bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:shadow-primary-500/10 hover:-translate-y-2 transition-all duration-500 overflow-hidden cursor-pointer" onClick={() => navigate('/profile#clubs')}>
            <div className="absolute inset-0 bg-gradient-to-br from-primary-50/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 to-primary-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
            <div className="relative flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <Users className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-3xl font-extrabold text-slate-900 dark:text-white">{joinedClubs?.length || 0}</p>
                <p className="text-slate-500 text-sm font-medium">Clubs Joined</p>
              </div>
            </div>
          </div>

          <div className="group relative bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:shadow-secondary-500/10 hover:-translate-y-2 transition-all duration-500 overflow-hidden cursor-pointer" onClick={() => navigate('/profile#followed')}>
            <div className="absolute inset-0 bg-gradient-to-br from-secondary-50/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-secondary-500 to-secondary-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
            <div className="relative flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-secondary-500 to-secondary-600 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <Heart className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-3xl font-extrabold text-slate-900 dark:text-white">{followedClubs?.length || 0}</p>
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
                <p className="text-3xl font-extrabold text-slate-900 dark:text-white">{attendedEvents?.length || 0}</p>
                <p className="text-slate-500 text-sm font-medium">Events Attended</p>
              </div>
            </div>
          </div>
        </div>

        {/* About */}
        <div className="group relative bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 p-8 mb-10 animate-fade-in-up overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
          <div className="relative">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              About Me
            </h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg">
              {authUser?.about || "No bio added yet. Click Edit Profile to tell others about yourself!"}
            </p>
          </div>
        </div>

        {/* Why Join Section - Benefits of Campus Life */}
        <div className="mb-10">
          <div className="text-center mb-8">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-secondary-100 dark:bg-secondary-900/30 text-secondary-600 dark:text-secondary-400 rounded-full text-sm font-semibold mb-4">
              <Star className="w-4 h-4" />
              Campus Life
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">
              Make the Most of{" "}
              <span className="bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
                Your Profile
              </span>
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg leading-relaxed">
              Your profile is your digital identity on campus. Here's how to make it stand out and connect with the community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {whyJoinItems.map((item, i) => (
              <div
                key={i}
                className="group relative bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${
                    item.color === "primary"
                      ? "from-primary-50/80 to-transparent"
                      : item.color === "secondary"
                        ? "from-secondary-50/80 to-transparent"
                        : "from-amber-50/80 to-transparent"
                  } opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                />

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
                  className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${
                    item.color === "primary"
                      ? "from-primary-500 to-primary-600"
                      : item.color === "secondary"
                        ? "from-secondary-500 to-secondary-600"
                        : "from-amber-500 to-amber-600"
                  } flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}
                >
                  <item.icon className="w-7 h-7 text-white" />
                </div>

                <div className="relative">
                  <h3 className="font-bold text-slate-900 dark:text-white text-xl mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-slate-500 text-base leading-relaxed">
                    {item.desc}
                  </p>

                  <div
                    className={`h-1 w-16 rounded-full bg-gradient-to-r mt-5 ${
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
        </div>

        {/* My Clubs */}
        <ClubSection
          title="My Clubs"
          clubs={joinedClubs || []}
          color="primary"
          icon={Users}
          onClubClick={(id) => navigate(`/clubs/${id}`)}
        />

        {/* Followed Clubs */}
        <div className="mt-6">
          <ClubSection
            title="Followed Clubs"
            clubs={followedClubs || []}
            color="secondary"
            icon={Heart}
            onClubClick={(id) => navigate(`/clubs/${id}`)}
          />
        </div>

        {/* Created Clubs */}
        {createdClubs?.length > 0 && (
          <div className="mt-6">
            <ClubSection
              title="Created Clubs"
              clubs={createdClubs || []}
              color="amber"
              icon={Trophy}
              onClubClick={(id) => navigate(`/clubs/${id}/admin`)}
            />
          </div>
        )}

        {/* Logout Banner */}
        <div className="mt-10 relative bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-700 rounded-3xl p-10 text-white text-center overflow-hidden">
          <div className="absolute top-0 right-0 w-60 h-60 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary-400/20 rounded-full blur-3xl" />
          <div className="absolute top-10 left-10 w-32 h-32 border border-white/10 rounded-full" />
          <div className="absolute bottom-10 right-10 w-20 h-20 border border-white/10 rounded-full" />

          <div className="relative">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center mx-auto mb-6">
              <LogOut className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Ready to Leave?</h3>
            <p className="text-primary-100 mb-8 max-w-md mx-auto leading-relaxed">
              We're sorry to see you go. You can always come back and reconnect with your campus community anytime.
            </p>
            <Button
              variant="danger"
              onClick={logout}
              className="shadow-xl shadow-danger-500/30 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 px-8 py-4"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Logout
            </Button>
          </div>
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
