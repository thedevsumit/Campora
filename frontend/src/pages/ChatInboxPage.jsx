import { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Button from "../components/ui/Button";
import {
  MessageCircle,
  Users,
  Sparkles,
  ArrowRight,
  UserCheck,
  X,
  Inbox,
  Send,
  Clock,
  MessageSquare,
  Heart,
  Zap,
} from "lucide-react";

const ChatInboxPage = () => {
  const [users, setUsers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      axiosInstance.get("/chat/conversations"),
      axiosInstance.get("/chat/requests").catch(() => ({ data: { requests: [] } })),
    ])
      .then(([convsRes, reqsRes]) => {
        const uniqueUsers = Array.from(
          new Map(convsRes.data.users.map((u) => [u._id, u])).values(),
        );
        setUsers(uniqueUsers);
        setRequests(reqsRes.data.requests || []);
      })
      .catch(() => console.error("Failed to load chats"))
      .finally(() => setIsLoading(false));
  }, []);

  const acceptRequest = async (req) => {
    await axiosInstance.post(`/chat/accept/${req._id}`);
    setRequests((prev) => prev.filter((r) => r._id !== req._id));
    navigate(`/chat/${req.sender._id}`);
  };

  const rejectRequest = async (reqId) => {
    await axiosInstance.post(`/chat/reject/${reqId}`);
    setRequests((prev) => prev.filter((r) => r._id !== reqId));
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-700 text-white py-24 overflow-hidden">
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
                <MessageCircle className="w-5 h-5 text-primary-200" />
                <span className="text-primary-200 text-sm font-medium uppercase tracking-wider">
                  Private Messages
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-5 animate-fade-in-up leading-tight">
                Your{" "}
                <span className="bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-200 bg-clip-text text-transparent">
                  Conversations
                </span>
              </h1>

              <p className="text-primary-100 text-lg md:text-xl animate-fade-in-up stagger-1 max-w-xl leading-relaxed">
                Connect with fellow campus members through private messages.
                Accept requests to start chatting with people who want to reach
                out to you.
              </p>

              <div className="flex flex-wrap items-center gap-6 mt-8 justify-center md:justify-start animate-fade-in-up stagger-2">
                <div className="flex items-center gap-4 bg-white/15 backdrop-blur-xl px-6 py-4 rounded-2xl border border-white/20 shadow-xl">
                  <div className="p-3 bg-gradient-to-br from-amber-400 to-amber-500 rounded-xl shadow-lg">
                    <MessageSquare className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-3xl font-extrabold text-white">
                      {users.length}
                    </p>
                    <p className="text-primary-200 text-sm font-medium">
                      {users.length === 1 ? "Conversation" : "Conversations"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 bg-white/15 backdrop-blur-xl px-6 py-4 rounded-2xl border border-white/20 shadow-xl">
                  <div className="p-3 bg-gradient-to-br from-secondary-400 to-secondary-500 rounded-xl shadow-lg">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-3xl font-extrabold text-white">
                      {users.length + 1}
                    </p>
                    <p className="text-primary-200 text-sm font-medium">
                      People Connected
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 bg-white/15 backdrop-blur-xl px-6 py-4 rounded-2xl border border-white/20 shadow-xl">
                  <div className="p-3 bg-gradient-to-br from-rose-400 to-rose-500 rounded-xl shadow-lg">
                    <Inbox className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-3xl font-extrabold text-white">
                      {requests.length}
                    </p>
                    <p className="text-primary-200 text-sm font-medium">
                      {requests.length === 1 ? "Request" : "Requests"} Pending
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Card */}
            <div className="flex flex-col items-center gap-4 animate-fade-in-up stagger-3">
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 text-center max-w-sm">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Start a Conversation
                </h3>
                <p className="text-primary-100 text-sm leading-relaxed mb-4">
                  Want to chat with someone? Browse campus members and send
                  them a chat request to connect.
                </p>
              </div>
              <Button
                variant="outline"
                className="border-white/80 text-white w-full hover:bg-white/20 hover:border-white"
              >
                <Users className="w-5 h-5 mr-2" />
                Browse Members
              </Button>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10 pb-10">

        {/* Incoming Requests Section */}
        {requests.length > 0 && (
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl shadow-lg shadow-amber-500/30">
                <Inbox className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Incoming Requests</h2>
                <p className="text-slate-500 text-sm">People who want to connect with you</p>
              </div>
              <span className="ml-auto px-3 py-1.5 bg-amber-100 dark:bg-amber-900/30 text-amber-600 text-sm font-bold rounded-full">
                {requests.length} {requests.length === 1 ? "request" : "requests"}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {requests.map((req, idx) => (
                <div
                  key={req._id}
                  className="group relative bg-white dark:bg-slate-900 rounded-3xl p-6 border border-amber-200 dark:border-amber-800/50 shadow-sm hover:shadow-2xl hover:shadow-amber-500/10 hover:-translate-y-2 transition-all duration-500 overflow-hidden"
                  style={{ animationDelay: `${idx * 75}ms` }}
                >
                  {/* Animated gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-transparent to-orange-50 dark:from-amber-900/20 dark:via-transparent dark:to-orange-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Top accent bar */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 to-orange-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

                  <div className="relative">
                    {/* Avatar */}
                    <div className="flex items-center gap-4 mb-4">
                      <div className="relative">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold text-xl shadow-lg overflow-hidden">
                          {req.sender?.profilePic ? (
                            <img src={`http://localhost:5000${req.sender.profilePic}`} className="w-full h-full object-cover" alt={req.sender.fullName} />
                          ) : (
                            req.sender?.fullName?.[0]
                          )}
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-amber-400 rounded-full flex items-center justify-center text-[10px] font-bold text-white border-2 border-white dark:border-slate-900">
                          ?
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-slate-900 dark:text-white text-lg truncate group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                          {req.sender?.fullName}
                        </p>
                        <p className="text-sm text-slate-500 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          wants to connect
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                      <button
                        onClick={() => acceptRequest(req)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-secondary-500 to-secondary-600 hover:from-secondary-600 hover:to-secondary-700 text-white rounded-xl shadow-lg shadow-secondary-500/30 transition-all hover:scale-105 active:scale-95"
                      >
                        <UserCheck className="w-5 h-5" />
                        <span className="font-semibold">Accept</span>
                      </button>
                      <button
                        onClick={() => rejectRequest(req._id)}
                        className="flex items-center justify-center p-3 bg-slate-100 dark:bg-slate-700 hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-500 hover:text-red-500 rounded-xl transition-all"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Decorative corner */}
                  <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-amber-400/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Active Conversations Section */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl shadow-lg">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Conversations</h2>
                <p className="text-sm text-slate-500">Click on a conversation to start chatting</p>
              </div>
            </div>
          </div>

          {/* Chat list */}
          <div>
            {isLoading && (
              <div className="flex items-center justify-center py-24">
                <div className="flex flex-col items-center gap-5">
                  <div className="w-14 h-14 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
                  <p className="text-slate-500 animate-pulse text-lg">
                    Loading conversations...
                  </p>
                </div>
              </div>
            )}

            {!isLoading && users.length === 0 && (
              <div className="text-center py-24">
                <div className="w-24 h-24 mx-auto mb-6 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center">
                  <MessageCircle className="w-12 h-12 text-slate-300 dark:text-slate-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">No conversations yet</h3>
                <p className="text-slate-500 mb-8 max-w-md mx-auto leading-relaxed">
                  You haven't started any conversations yet. Accept chat requests or browse members to start connecting!
                </p>
                <Button>
                  <Users className="w-4 h-4 mr-2" />
                  Browse Members
                </Button>
              </div>
            )}

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {users.map((user, idx) => (
                <div
                  key={user._id}
                  onClick={() => navigate(`/chat/${user._id}`)}
                  className="group flex items-center gap-4 p-5 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold text-xl shadow-lg overflow-hidden">
                      {user.profilePic ? (
                        <img src={`http://localhost:5000${user.profilePic}`} className="w-full h-full object-cover" alt={user.fullName} />
                      ) : (
                        user.fullName?.charAt(0).toUpperCase()
                      )}
                    </div>
                    {/* Online indicator */}
                    <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-400 rounded-full border-2 border-white dark:border-slate-900" />
                  </div>

                  {/* Name */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900 dark:text-white text-lg truncate group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      {user.fullName}
                    </p>
                    <p className="text-sm text-slate-500 flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 text-green-500" />
                      Click to open chat
                    </p>
                  </div>

                  <div className="flex-shrink-0 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 group-hover:bg-gradient-to-br group-hover:from-primary-500 group-hover:to-secondary-500 transition-all duration-300">
                    <Send className="w-5 h-5 text-primary-600 dark:text-primary-400 group-hover:text-white transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInboxPage;
