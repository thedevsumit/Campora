import { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import { MessageCircle, UserCheck, X, Sparkles } from "lucide-react";

const ChatRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance
      .get("/chat/requests")
      .then((res) => setRequests(res.data.requests))
      .catch(() => console.error("Failed to load requests"));
  }, []);

  const acceptRequest = async (req) => {
    await axiosInstance.post(`/chat/accept/${req._id}`);
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

        <div className="relative max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4 animate-fade-in">
            <MessageCircle className="w-6 h-6 text-primary-200" />
            <span className="text-primary-200 font-medium">Private Messages</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 animate-fade-in-up">
            Chat Requests
          </h1>
          <p className="text-xl text-primary-100 animate-fade-in-up stagger-1">
            People who want to connect with you
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
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden">
          {requests.length === 0 && (
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto mb-6 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
                <UserCheck className="w-10 h-10 text-slate-300 dark:text-slate-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No pending requests</h3>
              <p className="text-slate-500">You're all caught up!</p>
            </div>
          )}

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {requests.map((req) => (
              <div key={req._id} className="p-5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white text-xl font-bold shadow-lg">
                    {req.sender?.fullName?.[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">{req.sender?.fullName}</p>
                    <p className="text-sm text-slate-500">wants to connect with you</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => acceptRequest(req)}
                    className="p-3 bg-secondary-500 hover:bg-secondary-600 text-white rounded-xl shadow-lg shadow-secondary-500/30 transition-all hover:scale-105"
                  >
                    <UserCheck className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => rejectRequest(req._id)}
                    className="p-3 bg-slate-100 dark:bg-slate-800 hover:bg-danger-50 dark:hover:bg-danger-900/20 text-slate-500 hover:text-danger-500 rounded-xl transition-all"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatRequestsPage;
