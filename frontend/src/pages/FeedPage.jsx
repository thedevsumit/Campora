import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Modal from "../components/ui/Modal";
import Input from "../components/ui/Input";
import { axiosInstance } from "../lib/axios";
import { getImageUrl } from "../lib/utils";
import { userAuthStore } from "../store/useAuthStore";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import PageLoader from "../components/ui/Loader";
import {
  Calendar,
  Megaphone,
  Users,
  Clock,
  MapPin,
  Loader,
  ChevronRight,
  ArrowRight,
  MessageCircle,
  Edit3,
  Crown,
  Shield,
  Send,
  X,
  Sparkles,
  TrendingUp,
  Bell,
  Star,
  Zap,
  Eye,
  Heart,
} from "lucide-react";

const formatDate = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

const AnimatedSVG = ({ type }) => {
  const svgs = {
    event: (
      <svg className="w-12 h-12" viewBox="0 0 48 48" fill="none">
        <rect
          x="4"
          y="8"
          width="40"
          height="36"
          rx="4"
          fill="currentColor"
          fillOpacity="0.1"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path d="M4 16h40" stroke="currentColor" strokeWidth="2" />
        <circle cx="12" cy="12" r="2" fill="currentColor" />
        <circle cx="36" cy="12" r="2" fill="currentColor" />
        <rect
          x="12"
          y="24"
          width="8"
          height="8"
          rx="1"
          fill="currentColor"
          fillOpacity="0.3"
        />
        <rect
          x="24"
          y="24"
          width="8"
          height="8"
          rx="1"
          fill="currentColor"
          fillOpacity="0.3"
        />
        <rect
          x="12"
          y="34"
          width="8"
          height="6"
          rx="1"
          fill="currentColor"
          fillOpacity="0.3"
        />
        <rect
          x="24"
          y="34"
          width="8"
          height="6"
          rx="1"
          fill="currentColor"
          fillOpacity="0.3"
        />
      </svg>
    ),
    announcement: (
      <svg className="w-12 h-12" viewBox="0 0 48 48" fill="none">
        <path
          d="M24 4L40 12V24C40 32.836 32.836 40 24 44C15.164 40 8 32.836 8 24V12L24 4Z"
          fill="currentColor"
          fillOpacity="0.1"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M24 14V28M24 32V34"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
    ),
    empty: (
      <svg className="w-24 h-24" viewBox="0 0 96 96" fill="none">
        <circle
          cx="48"
          cy="48"
          r="40"
          fill="currentColor"
          fillOpacity="0.05"
          stroke="currentColor"
          strokeWidth="2"
          strokeDasharray="4 4"
        />
        <path
          d="M48 24V48L64 64"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeOpacity="0.5"
        />
        <circle cx="48" cy="48" r="4" fill="currentColor" fillOpacity="0.3" />
        <circle cx="32" cy="36" r="2" fill="currentColor" fillOpacity="0.2" />
        <circle cx="64" cy="36" r="2" fill="currentColor" fillOpacity="0.2" />
        <circle cx="36" cy="64" r="2" fill="currentColor" fillOpacity="0.2" />
        <circle cx="60" cy="64" r="2" fill="currentColor" fillOpacity="0.2" />
      </svg>
    ),
    club: (
      <svg className="w-16 h-16" viewBox="0 0 64 64" fill="none">
        <circle
          cx="32"
          cy="32"
          r="28"
          fill="currentColor"
          fillOpacity="0.08"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M32 16C22 16 22 28 22 32C22 40 28 46 32 48C36 46 42 40 42 32C42 28 42 16 32 16Z"
          fill="currentColor"
          fillOpacity="0.15"
        />
        <circle cx="32" cy="32" r="8" fill="currentColor" fillOpacity="0.2" />
        <path
          d="M20 52C20 46 26 42 32 42C38 42 44 46 44 52"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          fillOpacity="0.1"
        />
      </svg>
    ),
  };
  return svgs[type] || null;
};

const EventCard = ({ item, clubStatus, onClubClick }) => {
  const navigate = useNavigate();
  
  console.log("Event item:", item.image); 
  
  return (
    <div className="group relative bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 overflow-hidden hover:shadow-2xl hover:shadow-primary-500/10 transition-all duration-500 hover:-translate-y-1">
      {item.image && (
        <div className="relative h-52 overflow-hidden">
          <img
            src={getImageUrl(item.image)}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <Badge className="bg-white/20 backdrop-blur-xl text-white border border-white/30 backdrop-blur-sm">
              {item.category || "Event"}
            </Badge>
            {clubStatus.isOwner && (
              <Badge
                variant="warning"
                className="bg-amber-500/90 backdrop-blur-xl text-white border border-amber-400/50"
              >
                <Crown className="w-3 h-3 mr-1" />
                Owner
              </Badge>
            )}
            {clubStatus.isModerator && !clubStatus.isOwner && (
              <Badge
                variant="info"
                className="bg-blue-500/90 backdrop-blur-xl text-white border border-blue-400/50"
              >
                <Shield className="w-3 h-3 mr-1" />
                Mod
              </Badge>
            )}
          </div>
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center gap-2 text-white/90 text-sm">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(item.date)}</span>
              {item.venue && (
                <>
                  <span className="opacity-50">·</span>
                  <MapPin className="w-4 h-4" />
                  <span>{item.venue}</span>
                </>
              )}
            </div>
          </div>
        </div>
      )}
      <div className="p-6">
        <div
          className="flex items-center gap-3 mb-4 cursor-pointer group/club"
          onClick={() => onClubClick(item.club?._id)}
        >
          {item.club?.clubIcon ? (
            <img
              src={getImageUrl(item.club.clubIcon)}
              className="w-10 h-10 rounded-xl object-cover ring-2 ring-slate-100 dark:ring-slate-800"
              alt=""
            />
          ) : (
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white text-sm font-bold ring-2 ring-slate-100 dark:ring-slate-800">
              {item.club?.clubName?.[0] || "C"}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-900 dark:text-white group-hover/club:text-primary-600 dark:group-hover/club:text-primary-400 transition-colors">
              {item.club?.clubName}
            </p>
            <p className="text-xs text-slate-400 flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {item.registrations} registered
            </p>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 opacity-0 group-hover/club:opacity-100 group-hover/club:translate-x-1 transition-all" />
        </div>

        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 line-clamp-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
          {item.title}
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-5">
          {item.description}
        </p>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 group/btn"
            onClick={() => navigate(`/events`)}
          >
            View Details
            <ChevronRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
          </Button>
         
        </div>
      </div>
    </div>
  );
};

const AnnouncementCard = ({ item, clubStatus, onClubClick }) => {
  return (
    <div
      className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden hover:shadow-xl hover:shadow-primary-500/10 transition-all duration-500 cursor-pointer group"
      onClick={() => onClubClick(item.club?._id)}
    >
      {item.image && (
        <div className="relative h-40 overflow-hidden">
          <img
            src={getImageUrl(item.image)}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </div>
      )}
      <div className="p-6">
        <div className="flex items-start gap-4 mb-4">
          {!item.image && (
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400/20 to-orange-400/20 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
              <Megaphone className="w-6 h-6 text-amber-500" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              {item.club?.clubIcon ? (
                <img
                  src={getImageUrl(item.club.clubIcon)}
                  className="w-6 h-6 rounded-lg object-cover"
                  alt=""
                />
              ) : (
                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white text-xs font-bold">
                  {item.club?.clubName?.[0] || "C"}
                </div>
              )}
              <span className="text-sm font-semibold text-slate-900 dark:text-white">
                {item.club?.clubName}
              </span>
              {clubStatus.isOwner && (
                <Badge
                  variant="warning"
                  size="sm"
                  className="bg-amber-100 dark:bg-amber-900/30 text-amber-600"
                >
                  <Crown className="w-3 h-3 mr-1" />
                  Owner
                </Badge>
              )}
              {clubStatus.isModerator && !clubStatus.isOwner && (
                <Badge
                  variant="info"
                  size="sm"
                  className="bg-blue-100 dark:bg-blue-900/30 text-blue-600"
                >
                  <Shield className="w-3 h-3 mr-1" />
                  Mod
                </Badge>
              )}
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatDate(item.createdAt)}
            </p>
          </div>
        </div>
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
          {item.title}
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-3">
          {item.message}
        </p>
      </div>
    </div>
  );
};

const ClubMiniCard = ({
  club,
  navigate,
  clubStatus,
  onClubClick,
  isSelected,
}) => (
  <div
    onClick={() => onClubClick(club._id)}
    className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all group ${isSelected ? "bg-primary-50 dark:bg-primary-900/20 ring-2 ring-primary-500" : "hover:bg-slate-100 dark:hover:bg-slate-800"}`}
  >
    {club.clubIcon ? (
      <img
        src={getImageUrl(club.clubIcon)}
        className="w-10 h-10 rounded-xl object-cover ring-2 ring-slate-100 dark:ring-slate-800"
        alt={club.clubName}
      />
    ) : (
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold ring-2 ring-slate-100 dark:ring-slate-800">
        {club.clubName?.[0]}
      </div>
    )}
    <div className="flex-1 min-w-0">
      <p className="text-sm font-semibold text-slate-900 dark:text-white truncate flex items-center gap-1">
        {club.clubName}
        {clubStatus?.isOwner && (
          <Crown className="w-3 h-3 text-amber-500 flex-shrink-0" />
        )}
        {clubStatus?.isModerator && !clubStatus?.isOwner && (
          <Shield className="w-3 h-3 text-blue-500 flex-shrink-0" />
        )}
      </p>
      <p className="text-xs text-slate-500">
        {club.members?.length || 0} members · {club.followers?.length || 0}{" "}
        followers
      </p>
    </div>
    <ArrowRight
      className={`w-4 h-4 text-slate-400 transition-transform ${isSelected ? "translate-x-0" : "opacity-0 group-hover:opacity-100 group-hover:translate-x-1"}`}
    />
  </div>
);

export default function FeedPage() {
  const [feed, setFeed] = useState([]);
  const [myClubs, setMyClubs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { authUser } = userAuthStore();

  const selectedClubId = searchParams.get("clubId");

  const fetchFeed = async () => {
    try {
      const res = await axiosInstance.get("/feed");
      console.log("res" , res.data)
      setFeed(res.data.feed || []);
      setMyClubs(res.data.myClubs || []);
    } catch (err) {
      console.error("Feed fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFeed();
  }, []);

  const handleClubClick = (clubId) => {
    navigate(`/feed?clubId=${clubId}`);
  };

  const filteredFeed = selectedClubId
    ? feed.filter((item) => item.club?._id === selectedClubId)
    : feed;
  console.log("Ff",feed)
  const selectedClubData = myClubs.find((c) => c._id === selectedClubId);

  const getClubAdminStatus = (club) => {
    if (!club) return { isOwner: false, isModerator: false, isAdmin: false };
    const isOwner =
      club.createdBy === authUser?._id || club.createdBy?._id === authUser?._id;
    const memberObj = club.members?.find(
      (m) => m.user?._id === authUser?._id || m.user === authUser?._id,
    );
    const isModerator = memberObj?.role === "moderator";
    const isAdmin = memberObj?.role === "admin";
    return { isOwner, isModerator, isAdmin };
  };

  const selectedClubStatus = getClubAdminStatus(selectedClubData);
  const isSelectedClubAdmin =
    selectedClubStatus.isOwner ||
    selectedClubStatus.isAdmin ||
    selectedClubStatus.isModerator;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-primary-50/30 to-slate-50 dark:from-slate-950 dark:via-primary-950/20 dark:to-slate-950">
      <Navbar />

      {/* Hero */}
      <div className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-700 text-white py-20 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-20 left-20 w-40 h-40 border border-white/10 rounded-full" />
        <div className="absolute top-40 right-40 w-24 h-24 border border-white/10 rounded-full" />
        <div className="absolute bottom-40 left-60 w-16 h-16 bg-amber-400/20 rounded-full blur-2xl" />
        <div className="absolute top-1/2 left-8 w-4 h-4 bg-amber-400 rounded-full" />
        <div className="absolute top-20 right-20 w-3 h-3 bg-white/60 rounded-full" />

        {/* Floating Icons */}
        <div className="absolute top-32 right-60 opacity-20 animate-bounce">
          <svg className="w-16 h-16" viewBox="0 0 64 64" fill="currentColor">
            <rect
              x="8"
              y="12"
              width="48"
              height="44"
              rx="4"
              fillOpacity="0.2"
            />
            <path
              d="M8 20h48M16 8v8M48 8v8"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
        </div>
        <div className="absolute bottom-40 right-80 opacity-20 animate-pulse">
          <svg className="w-12 h-12" viewBox="0 0 48 48" fill="currentColor">
            <path
              d="M24 4L40 12V24C40 32.836 32.836 40 24 44C15.164 40 8 32.836 8 24V12L24 4Z"
              fillOpacity="0.2"
            />
          </svg>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-white/10 backdrop-blur-xl rounded-full border border-white/20">
            <Zap className="w-4 h-4 text-amber-300" />
            <span className="text-primary-200 font-medium text-sm">
              Activity Feed
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-5 animate-fade-in-up">
            {selectedClubData ? (
              <>
                <span className="bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-200 bg-clip-text text-transparent">
                  {selectedClubData.clubName}
                </span>
                <span className="text-white"> Feed</span>
              </>
            ) : (
              <>
                My Clubs{" "}
                <span className="bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-200 bg-clip-text text-transparent">
                  Feed
                </span>
              </>
            )}
          </h1>
          <p className="text-xl text-primary-100 animate-fade-in-up stagger-1 max-w-2xl mx-auto">
            {selectedClubData
              ? `Stay updated with latest events and announcements from ${selectedClubData.clubName}`
              : "Stay updated with events and announcements from clubs you've joined or follow."}
          </p>

          {/* Stats Row */}
          <div className="flex items-center justify-center gap-8 mt-8 animate-fade-in-up stagger-2">
            <div className="text-center">
              <p className="text-3xl font-extrabold text-white">
                {myClubs.length}
              </p>
              <p className="text-primary-200 text-sm">Clubs</p>
            </div>
            <div className="w-px h-10 bg-white/20" />
            <div className="text-center">
              <p className="text-3xl font-extrabold text-white">
                {filteredFeed.filter((f) => f.type === "event").length}
              </p>
              <p className="text-primary-200 text-sm">Events</p>
            </div>
            <div className="w-px h-10 bg-white/20" />
            <div className="text-center">
              <p className="text-3xl font-extrabold text-white">
                {filteredFeed.filter((f) => f.type === "announcement").length}
              </p>
              <p className="text-primary-200 text-sm">Announcements</p>
            </div>
          </div>
        </div>

        {/* Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 100" fill="none">
            <path
              d="M0 50L48 45.8C96 41.7 192 33.3 288 30C384 26.7 480 28.3 576 33.3C672 38.3 768 46.7 864 48.3C960 50 1056 45 1152 40C1248 35 1344 30 1392 27.5L1440 25V100H1392C1344 100 1248 100 1152 100C1056 100 960 100 864 100C768 100 672 100 576 100C480 100 384 100 288 100C192 100 96 100 48 100H0V50Z"
              fill="currentColor"
              className="fill-slate-50 dark:fill-slate-950"
            />
          </svg>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-10 pb-16">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar - My Clubs */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xl shadow-primary-500/5 overflow-hidden sticky top-24">
              <div className="p-5 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-primary-50/50 to-secondary-50/50 dark:from-primary-900/20 dark:to-secondary-900/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center shadow-lg shadow-primary-500/20">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="font-bold text-slate-900 dark:text-white">
                      My Clubs
                    </h2>
                    <p className="text-xs text-slate-500">
                      {myClubs.length} clubs joined
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-2 max-h-[500px] overflow-y-auto">
                {myClubs.length === 0 ? (
                  <div className="text-center py-10 px-4">
                    <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center">
                      <svg
                        className="w-8 h-8 text-slate-400"
                        viewBox="0 0 32 32"
                        fill="none"
                      >
                        <circle
                          cx="16"
                          cy="16"
                          r="14"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeDasharray="4 4"
                        />
                        <path
                          d="M16 8v16M8 16h16"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                    <p className="text-slate-500 text-sm mb-4">
                      You haven't joined any clubs yet.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate("/clubs")}
                    >
                      Explore Clubs <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                ) : (
                  <>
                    {/* All Clubs Option */}
                    <div
                      onClick={() => navigate("/feed")}
                      className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all mb-2 ${!selectedClubId ? "bg-primary-50 dark:bg-primary-900/20 ring-2 ring-primary-500" : "hover:bg-slate-100 dark:hover:bg-slate-800"}`}
                    >
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-500 to-slate-600 flex items-center justify-center text-white font-bold">
                        <MessageCircle className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">
                          All Clubs
                        </p>
                        <p className="text-xs text-slate-500">
                          View all activity
                        </p>
                      </div>
                      {selectedClubId && (
                        <ArrowRight className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                    {myClubs.map((club) => {
                      const clubStatus = getClubAdminStatus(club);
                      return (
                        <ClubMiniCard
                          key={club._id}
                          club={club}
                          navigate={navigate}
                          clubStatus={clubStatus}
                          onClubClick={handleClubClick}
                          isSelected={selectedClubId === club._id}
                        />
                      );
                    })}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Feed */}
          <div className="lg:col-span-3 space-y-6">
            {/* Feed Header */}
            {selectedClubData && (
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 shadow-lg">
                <div className="flex items-center gap-4">
                  {selectedClubData.clubIcon ? (
                    <img
                      src={getImageUrl(selectedClubData.clubIcon)}
                      className="w-16 h-16 rounded-2xl object-cover ring-4 ring-slate-100 dark:ring-slate-800"
                      alt={selectedClubData.clubName}
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white text-2xl font-bold ring-4 ring-slate-100 dark:ring-slate-800">
                      {selectedClubData.clubName?.[0]}
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                        {selectedClubData.clubName}
                      </h2>
                      {selectedClubStatus.isOwner && (
                        <Badge
                          variant="warning"
                          size="sm"
                          className="bg-amber-100 dark:bg-amber-900/30 text-amber-600"
                        >
                          <Crown className="w-3 h-3 mr-1" />
                          Owner
                        </Badge>
                      )}
                      {selectedClubStatus.isModerator &&
                        !selectedClubStatus.isOwner && (
                          <Badge
                            variant="info"
                            size="sm"
                            className="bg-blue-100 dark:bg-blue-900/30 text-blue-600"
                          >
                            <Shield className="w-3 h-3 mr-1" />
                            Moderator
                          </Badge>
                        )}
                    </div>
                    <p className="text-sm text-slate-500 line-clamp-1">
                      {selectedClubData.description || "No description"}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {selectedClubData.members?.length || 0} members
                      </span>
                      <span>·</span>
                      <span>
                        {selectedClubData.followers?.length || 0} followers
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/clubs/${selectedClubId}`)}
                    className="flex items-center gap-2"
                  >
                    View Club <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}

            {isLoading ? (
              <PageLoader
                fullPage={false}
                variant="page"
                text="Loading your feed..."
                className="!relative !bg-transparent !min-h-[400px]"
              />
            ) : filteredFeed.length === 0 ? (
              <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
                <div className="w-24 h-24 mx-auto mb-6 text-slate-300 dark:text-slate-600">
                  <AnimatedSVG type="empty" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                  {selectedClubId ? "No activity yet" : "No feed items"}
                </h3>
                <p className="text-slate-500 mb-6 max-w-md mx-auto">
                  {selectedClubId
                    ? "This club hasn't posted any events or announcements yet."
                    : "Join or follow some clubs to see their events and announcements here."}
                </p>
                <div className="flex items-center justify-center gap-3">
                  <Button variant="outline" onClick={() => navigate("/clubs")}>
                    Explore Clubs
                  </Button>
                  {selectedClubId && (
                    <Button onClick={() => navigate("/feed")}>
                      View All Clubs Feed
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              filteredFeed.map((item, idx) => {
                const clubStatus = getClubAdminStatus(item.club);
                return (
                  <div
                    key={item._id}
                    className="animate-fade-in-up"
                    style={{ animationDelay: `${idx * 50}ms` }}
                  >
                    {item.type === "event" ? (
                      <EventCard
                        item={item}
                        clubStatus={clubStatus}
                        onClubClick={handleClubClick}
                      />
                    ) : (
                      <AnnouncementCard
                        item={item}
                        clubStatus={clubStatus}
                        onClubClick={handleClubClick}
                      />
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    <footer className="bg-slate-100 dark:bg-slate-800 py-4">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-slate-600 dark:text-slate-400">
    © {new Date().getFullYear()} Campus. All rights reserved. • <a href="/terms" className="underline hover:text-primary-600">Terms</a> • <a href="/privacy" className="underline hover:text-primary-600">Privacy</a>
  </div>
</footer>
</div>
  );
}
