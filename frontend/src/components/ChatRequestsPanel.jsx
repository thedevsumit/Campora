import React, { useEffect } from "react";
import { useChatRequestStore } from "../store/useChatRequestStore";
import { getImageUrl } from "../lib/utils";
import { useNavigate } from "react-router-dom";
import Button from "./ui/Button";
import { MessageCircle, UserCheck, X } from "lucide-react";

const ChatRequestsPanel = () => {
  const { requests, fetchRequests, acceptRequest, rejectRequest, isLoading } = useChatRequestStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleAccept = async (request) => {
    await acceptRequest(request._id);
    navigate(`/chats/${request.sender._id}`);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-xl">
          <MessageCircle className="w-5 h-5 text-primary-600" />
        </div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Chat Requests</h2>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <div className="w-8 h-8 border-3 border-primary-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {!isLoading && requests.length === 0 && (
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
            <UserCheck className="w-8 h-8 text-slate-300" />
          </div>
          <p className="text-slate-500 font-medium">No pending requests</p>
        </div>
      )}

      <div className="space-y-3">
        {requests.map((req) => (
          <div
            key={req._id}
            className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold shadow-lg">
                {req.sender.profilePic ? (
                  <img src={getImageUrl(req.sender.profilePic)} className="w-full h-full object-cover rounded-2xl" alt={req.sender.fullName} />
                ) : (
                  req.sender.fullName?.[0]
                )}
              </div>
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">{req.sender.fullName}</p>
                <p className="text-sm text-slate-500">wants to chat</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleAccept(req)}
                className="p-2.5 bg-secondary-500 hover:bg-secondary-600 text-white rounded-xl shadow-lg shadow-secondary-500/30 transition-all hover:scale-105"
              >
                <UserCheck className="w-4 h-4" />
              </button>
              <button
                onClick={() => rejectRequest(req._id)}
                className="p-2.5 bg-slate-100 dark:bg-slate-700 hover:bg-danger-50 dark:hover:bg-danger-900/20 text-slate-500 hover:text-danger-500 rounded-xl transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatRequestsPanel;
