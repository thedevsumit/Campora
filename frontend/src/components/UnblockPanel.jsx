import { useState, useEffect } from "react";
import { axiosInstance } from "../lib/axios";
import { getImageUrl } from "../lib/utils";
import Button from "./ui/Button";
import { ShieldOff, User, X, RefreshCw } from "lucide-react";
import { toast } from "react-toastify";

const UnblockPanel = ({ isOpen, onClose }) => {
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRemoving, setIsRemoving] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchBlockedUsers();
    }
  }, [isOpen]);

  const fetchBlockedUsers = async () => {
    setIsLoading(true);
    try {
      const res = await axiosInstance.get("/chats/blocked");
      setBlockedUsers(res.data.blockedUsers || []);
    } catch (err) {
      toast.error("Failed to load blocked users");
    } finally {
      setIsLoading(false);
    }
  };

  const unblockUser = async (userId) => {
    setIsRemoving(userId);
    try {
      await axiosInstance.post(`/chats/unblock/${userId}`);
      setBlockedUsers((prev) => prev.filter((u) => u.blocked._id !== userId));
      toast.success("User unblocked");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to unblock user");
    } finally {
      setIsRemoving(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl animate-scale-in overflow-hidden max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="relative bg-gradient-to-br from-rose-600 via-rose-700 to-rose-900 p-6 text-white overflow-hidden flex-shrink-0">
          <div className="absolute top-0 right-0 w-60 h-60 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-rose-400/20 rounded-full blur-3xl" />

          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="relative flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xl flex items-center justify-center">
              <ShieldOff className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold">Blocked Users</h2>
              <p className="text-rose-100 text-sm">Manage your blocked list</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="w-6 h-6 text-rose-500 animate-spin" />
            </div>
          ) : blockedUsers.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 mx-auto mb-4 bg-rose-100 dark:bg-rose-900/30 rounded-full flex items-center justify-center">
                <ShieldOff className="w-10 h-10 text-rose-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                No blocked users
              </h3>
              <p className="text-slate-500 text-sm">
                You haven't blocked anyone yet
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {blockedUsers.map(({ blocked, _id }) => (
                <div
                  key={_id}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500 to-rose-600 flex items-center justify-center text-white font-bold shadow-lg overflow-hidden">
                    {blocked.profilePic ? (
                      <img
                        src={getImageUrl(blocked.profilePic)}
                        alt={blocked.fullName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      blocked.fullName?.[0]
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900 dark:text-white truncate">
                      {blocked.fullName}
                    </p>
                    <p className="text-sm text-slate-500 truncate">
                      {blocked.email}
                    </p>
                  </div>
                  <Button
                    onClick={() => unblockUser(blocked._id)}
                    isLoading={isRemoving === blocked._id}
                    className="bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 shadow-lg shadow-rose-500/30"
                  >
                    Unblock
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UnblockPanel;