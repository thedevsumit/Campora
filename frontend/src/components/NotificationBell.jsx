import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useNotificationStore } from "../store/useNotificationStore";
import { Bell, CheckCheck, BellRing, Calendar, CreditCard, X } from "lucide-react";

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, fetchUnreadCount, fetchNotifications, markAsRead, markAllAsRead } = useNotificationStore();
  const navigate = useNavigate();

  const fetchCount = useCallback(async () => {
    try {
      await fetchUnreadCount();
    } catch {
      // Silently fail - notification count is not critical
    }
  }, [fetchUnreadCount]);

  useEffect(() => {
    fetchCount();
    // Poll every 60 seconds instead of 30 to reduce API spam
    const interval = setInterval(fetchCount, 60000);
    return () => clearInterval(interval);
  }, [fetchCount]);

  const handleOpen = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      fetchNotifications(1);
    }
  };

  const handleNotifClick = (notif) => {
    if (!notif.isRead) {
      markAsRead(notif._id);
    }
    if (notif.actionUrl) {
      navigate(notif.actionUrl);
    }
    setIsOpen(false);
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "event_approval": return Calendar;
      case "event_rejection": return Calendar;
      case "booking_approved": return CreditCard;
      case "booking_rejected": return CreditCard;
      case "announcement": return BellRing;
      default: return Bell;
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleOpen}
        className="relative p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
      >
        <Bell className="w-5 h-5 text-slate-600 dark:text-slate-400" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[20px] h-[20px] bg-gradient-to-br from-danger-500 to-danger-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-lg shadow-danger-500/30 animate-pulse-glow">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200/50 dark:border-slate-700/50 z-50 animate-scale-in overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white">Notifications</h3>
                <p className="text-xs text-slate-500">{unreadCount} unread</p>
              </div>
              <div className="flex items-center gap-1">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="p-2 rounded-xl hover:bg-white dark:hover:bg-slate-800 transition-colors"
                    title="Mark all as read"
                  >
                    <CheckCheck className="w-4 h-4 text-primary-600" />
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-xl hover:bg-white dark:hover:bg-slate-800 transition-colors"
                >
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            </div>

            <div className="max-h-80 overflow-y-auto scrollbar-thin">
              {notifications.length === 0 ? (
                <div className="px-5 py-12 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
                    <Bell className="w-8 h-8 text-slate-300 dark:text-slate-600" />
                  </div>
                  <p className="text-slate-500 text-sm font-medium">No notifications yet</p>
                  <p className="text-slate-400 text-xs mt-1">You're all caught up!</p>
                </div>
              ) : (
                notifications.slice(0, 8).map((notif) => {
                  const Icon = getTypeIcon(notif.type);
                  return (
                    <div
                      key={notif._id}
                      onClick={() => handleNotifClick(notif)}
                      className={`px-5 py-4 border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors ${
                        !notif.isRead ? "bg-primary-50/50 dark:bg-primary-900/10" : ""
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2.5 rounded-xl ${
                          !notif.isRead
                            ? "bg-primary-100 dark:bg-primary-900/40"
                            : "bg-slate-100 dark:bg-slate-800"
                        }`}>
                          <Icon className={`w-4 h-4 ${
                            !notif.isRead ? "text-primary-600 dark:text-primary-400" : "text-slate-400"
                          }`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                              {notif.title}
                            </p>
                            {!notif.isRead && (
                              <span className="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0 animate-pulse" />
                            )}
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">
                            {notif.message}
                          </p>
                          <p className="text-xs text-slate-400 mt-1.5">
                            {new Date(notif.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              hour: "numeric",
                              minute: "2-digit"
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {notifications.length > 0 && (
              <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                <button
                  onClick={() => { navigate("/notifications"); setIsOpen(false); }}
                  className="w-full text-center text-sm text-primary-600 hover:text-primary-700 font-semibold transition-colors"
                >
                  View all notifications
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationBell;
