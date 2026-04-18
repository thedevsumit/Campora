import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Modal from "../components/ui/Modal";
import Input from "../components/ui/Input";
import { axiosInstance } from "../lib/axios";
import { getImageUrl } from "../lib/utils";
import { userAuthStore } from "../store/useAuthStore";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import {
  Calendar, Megaphone, Users, Clock, MapPin, Loader, ChevronRight, ArrowRight, MessageCircle,
  Plus, Edit3, Crown, Send, X
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

const EventCard = ({ item, isOwner }) => {
  const navigate = useNavigate();
  return (
    <div className="group relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden hover:shadow-xl hover:shadow-primary-500/10 transition-all duration-500">
      {item.image && (
        <div className="relative h-48 overflow-hidden">
          <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <Badge className="bg-white/20 backdrop-blur-xl text-white border border-white/30">
              {item.category || "Event"}
            </Badge>
            {isOwner && (
              <Badge variant="warning" className="bg-amber-500/90 backdrop-blur-xl text-white border border-amber-400/50">
                <Crown className="w-3 h-3 mr-1" />
                Your Club
              </Badge>
            )}
          </div>
        </div>
      )}
      <div className="p-6">
        <div className="flex items-center gap-2 mb-3">
          {item.club?.clubIcon ? (
            <img src={getImageUrl(item.club.clubIcon)} className="w-7 h-7 rounded-lg object-cover" alt="" />
          ) : (
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white text-xs font-bold">
              {item.club?.clubName?.[0] || "C"}
            </div>
          )}
          <span className="text-xs text-slate-500 font-medium">{item.club?.clubName}</span>
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 line-clamp-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{item.title}</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-4">{item.description}</p>
        <div className="flex items-center gap-4 text-xs text-slate-400 mb-5">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(item.date)}</span>
          </div>
          {item.venue && (
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4" />
              <span>{item.venue}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4" />
            <span>{item.registrations} registered</span>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => navigate(`/events`)}
        >
          View Details <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

const AnnouncementCard = ({ item }) => {
  const navigate = useNavigate();
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-5 hover:shadow-xl hover:shadow-primary-500/10 transition-all duration-500">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center">
          <Megaphone className="w-4 h-4 text-white" />
        </div>
        <div>
          {item.club?.clubIcon ? (
            <img src={getImageUrl(item.club.clubIcon)} className="w-8 h-8 rounded-xl object-cover" alt="" />
          ) : (
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white text-sm font-bold">
              {item.club?.clubName?.[0] || "C"}
            </div>
          )}
        </div>
        <div>
          <p className="text-xs text-slate-500 font-medium">{item.club?.clubName}</p>
          <p className="text-xs text-slate-400 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {formatDate(item.createdAt)}
          </p>
        </div>
      </div>
      <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">{item.title}</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-3">{item.message}</p>
    </div>
  );
};

const ClubMiniCard = ({ club, navigate, isOwner, onCreateAnnouncement }) => (
  <div
    onClick={() => navigate(`/clubs/${club._id}`)}
    className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors group"
  >
    {club.clubIcon ? (
      <img src={getImageUrl(club.clubIcon)} className="w-10 h-10 rounded-xl object-cover" alt={club.clubName} />
    ) : (
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold">
        {club.clubName?.[0]}
      </div>
    )}
    <div className="flex-1 min-w-0">
      <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{club.clubName}</p>
      <p className="text-xs text-slate-500">{club.members?.length || 0} members · {club.followers?.length || 0} followers</p>
    </div>
    {isOwner && (
      <button
        onClick={(e) => { e.stopPropagation(); onCreateAnnouncement(club); }}
        className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-600 hover:bg-amber-200 dark:hover:bg-amber-900/50 opacity-0 group-hover:opacity-100 transition-all"
        title="Create Announcement"
      >
        <Plus className="w-4 h-4" />
      </button>
    )}
    <ArrowRight className="w-4 h-4 text-slate-400" />
  </div>
);

export default function FeedPage() {
  const [feed, setFeed] = useState([]);
  const [myClubs, setMyClubs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [selectedClub, setSelectedClub] = useState(null);
  const [announcementForm, setAnnouncementForm] = useState({ title: "", message: "" });
  const [isPosting, setIsPosting] = useState(false);
  const navigate = useNavigate();
  const { authUser } = userAuthStore();

  const fetchFeed = async () => {
    try {
      const res = await axiosInstance.get("/feed");
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

  const handleCreateAnnouncement = (club) => {
    setSelectedClub(club);
    setShowAnnouncementModal(true);
  };

  const handlePostAnnouncement = async () => {
    if (!announcementForm.title || !announcementForm.message) return;
    setIsPosting(true);
    try {
      await axiosInstance.post(`/clubs/${selectedClub._id}/admin/announcements`, announcementForm);
      setShowAnnouncementModal(false);
      setAnnouncementForm({ title: "", message: "" });
      fetchFeed();
    } catch (err) {
      console.error("Post announcement error:", err);
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />

      {/* Hero */}
      <div className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-700 text-white py-16 overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary-400/20 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 mb-4">
            <MessageCircle className="w-5 h-5 text-primary-200" />
            <span className="text-primary-200 font-medium">Your Activity Feed</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 animate-fade-in-up">My Clubs Feed</h1>
          <p className="text-xl text-primary-100 animate-fade-in-up stagger-1">
            Stay updated with events and announcements from clubs you've joined or followed.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none">
            <path d="M0 80L60 70C120 60 240 40 360 35C480 30 600 30 720 35C840 40 960 50 1080 55C1200 60 1320 60 1380 60L1440 60V80H1380C1320 80 1200 80 1080 80C960 80 840 80 720 80C600 80 480 80 360 80C240 80 120 80 60 80H0Z" className="fill-slate-50 dark:fill-slate-950" />
          </svg>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10 pb-10">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar - My Clubs */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden sticky top-24">
              <div className="p-5 border-b border-slate-100 dark:border-slate-800">
                <h2 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary-500" />
                  My Clubs ({myClubs.length})
                </h2>
              </div>
              <div className="p-2 max-h-[500px] overflow-y-auto">
                {myClubs.length === 0 ? (
                  <div className="text-center py-8 px-4">
                    <p className="text-slate-500 text-sm mb-3">You haven't joined or followed any clubs yet.</p>
                    <Button variant="outline" size="sm" onClick={() => navigate("/clubs")}>
                      Explore Clubs <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                ) : (
                  myClubs.map(club => {
                    const isOwner = club.createdBy === authUser?._id || club.createdBy?._id === authUser?._id;
                    return (
                      <ClubMiniCard
                        key={club._id}
                        club={club}
                        navigate={navigate}
                        isOwner={isOwner}
                        onCreateAnnouncement={handleCreateAnnouncement}
                      />
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Feed */}
          <div className="lg:col-span-3 space-y-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader className="w-8 h-8 text-primary-500 animate-spin" />
              </div>
            ) : feed.length === 0 ? (
              <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
                <div className="w-20 h-20 mx-auto mb-6 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
                  <Megaphone className="w-10 h-10 text-slate-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">No feed yet</h3>
                <p className="text-slate-500 mb-6">Join or follow some clubs to see their events and announcements here.</p>
                <Button onClick={() => navigate("/clubs")}>Explore Clubs</Button>
              </div>
            ) : (
              feed.map((item, idx) => {
                const isOwner = item.club?.createdBy === authUser?._id || item.club?.createdBy?._id === authUser?._id;
                return (
                  <div key={item._id} className="animate-fade-in-up" style={{ animationDelay: `${idx * 50}ms` }}>
                    {item.type === "event" ? (
                      <EventCard item={item} isOwner={isOwner} />
                    ) : (
                      <AnnouncementCard item={item} />
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Announcement Creation Modal */}
      <Modal isOpen={showAnnouncementModal} onClose={() => setShowAnnouncementModal(false)} title={`Post Announcement — ${selectedClub?.clubName}`} size="md">
        <div className="space-y-5">
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl px-4 py-3 border border-amber-200 dark:border-amber-800 flex items-start gap-3">
            <Megaphone className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-700 dark:text-amber-400">
              Your announcement will be visible to all club members and followers in their feed.
            </p>
          </div>
          <Input
            label="Title"
            value={announcementForm.title}
            onChange={(e) => setAnnouncementForm({ ...announcementForm, title: e.target.value })}
            placeholder="Important update, upcoming event..."
          />
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Message
            </label>
            <textarea
              value={announcementForm.message}
              onChange={(e) => setAnnouncementForm({ ...announcementForm, message: e.target.value })}
              placeholder="Share what's happening with your club..."
              rows={4}
              className="w-full px-4 py-3.5 border-2 border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all resize-none"
            />
          </div>
          <div className="flex justify-end gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
            <Button variant="ghost" onClick={() => setShowAnnouncementModal(false)}>Cancel</Button>
            <Button
              onClick={handlePostAnnouncement}
              isLoading={isPosting}
              disabled={!announcementForm.title || !announcementForm.message}
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
            >
              <Send className="w-4 h-4 mr-2" />
              Post Announcement
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
