import { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Button from "../components/ui/Button";
import { MessageCircle, User, Sparkles, ArrowRight, UserCheck, X, Inbox } from "lucide-react";

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
      <div className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-700 text-white py-16 overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary-400/20 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4 animate-fade-in">
            <MessageCircle className="w-6 h-6 text-primary-200" />
            <span className="text-primary-200 font-medium">Private Messages</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 animate-fade-in-up">
            Your Chats
          </h1>
          <p className="text-xl text-primary-100 animate-fade-in-up stagger-1">
            Connect with other campus members
          </p>
        </div>

        {/* Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 80L60 70C120 60 240 40 360 35C480 30 600 30 720 35C840 40 960 50 1080 55C1200 60 1320 60 1380 60L1440 60V80H1380C1320 80 1200 80 1080 80C960 80 840 80 720 80C600 80 480 80 360 80C240 80 120 80 60 80H0Z" className="fill-slate-50 dark:fill-slate-950" />
          </svg>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10 pb-10">

        {/* Incoming Requests Section */}
        {requests.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-xl">
                <Inbox className="w-5 h-5 text-amber-600" />
              </div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Incoming Requests</h2>
              <span className="ml-auto px-2.5 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-600 text-xs font-bold rounded-full">
                {requests.length}
              </span>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-amber-200 dark:border-amber-800/50 overflow-hidden">
              <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-b border-amber-100 dark:border-amber-800/30">
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  People who want to connect with you
                </p>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {requests.map((req) => (
                  <div
                    key={req._id}
                    className="flex items-center gap-4 p-4 hover:bg-amber-50 dark:hover:bg-amber-900/10 transition-colors"
                  >
                    <div className="relative">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                        {req.sender?.profilePic ? (
                          <img src={`http://localhost:5000${req.sender.profilePic}`} className="w-full h-full object-cover rounded-2xl" alt={req.sender.fullName} />
                        ) : (
                          req.sender?.fullName?.[0]
                        )}
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-amber-400 rounded-full flex items-center justify-center text-[10px] font-bold text-white border-2 border-white dark:border-slate-900">
                        ?
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-900 dark:text-white">{req.sender?.fullName}</p>
                      <p className="text-sm text-slate-500">wants to connect</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => acceptRequest(req)}
                        className="p-2.5 bg-secondary-500 hover:bg-secondary-600 text-white rounded-xl shadow-lg shadow-secondary-500/30 transition-all hover:scale-105 active:scale-95"
                      >
                        <UserCheck className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => rejectRequest(req._id)}
                        className="p-2.5 bg-slate-100 dark:bg-slate-700 hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-500 hover:text-red-500 rounded-xl transition-all"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Active Conversations Section */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden">
          {/* Header */}
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-primary-600" />
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Conversations</h2>
            </div>
          </div>

          {/* Chat list */}
          <div>
            {isLoading && (
              <div className="flex items-center justify-center py-16">
                <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
              </div>
            )}

            {!isLoading && users.length === 0 && (
              <div className="text-center py-16">
                <div className="w-20 h-20 mx-auto mb-6 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-10 h-10 text-slate-300 dark:text-slate-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No chats yet</h3>
                <p className="text-slate-500">Start a conversation with someone!</p>
              </div>
            )}

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {users.map((user) => (
                <div
                  key={user._id}
                  onClick={() => navigate(`/chat/${user._id}`)}
                  className="flex items-center gap-4 p-5 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
                >
                  {/* Avatar */}
                  <div className="relative">
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
                    <p className="font-semibold text-slate-900 dark:text-white">{user.fullName}</p>
                    <p className="text-sm text-slate-500">Tap to start chatting</p>
                  </div>

                  <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-primary-500 transition-colors" />
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
