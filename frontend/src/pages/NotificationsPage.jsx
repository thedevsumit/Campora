import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useNotificationStore } from "../store/useNotificationStore";
import { userAuthStore } from "../store/useAuthStore";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-toastify";
import Button from "../components/ui/Button";
import { Bell, Check, Trash2, CheckCheck, BellRing, Calendar, CreditCard, MessageCircle, Users, CheckCircle2, XCircle, Mail, ThumbsUp, ThumbsDown } from "lucide-react";

const NotificationsPage = () => {
  const { notifications, unreadCount, isLoading, fetchNotifications, markAsRead, markAllAsRead, deleteNotification, clearAll } = useNotificationStore();
  const { authUser } = userAuthStore();
  const [filter, setFilter] = useState("all");
  const [processingId, setProcessingId] = useState(null);

  const isAdmin = authUser?.userRole === "admin" || authUser?.role === "superAdmin";

  const handleApprove = async (notif) => {
    if (!notif.relatedBooking) return;
    setProcessingId(notif._id);
    try {
      await axiosInstance.put(`/bookings/${notif.relatedBooking}/approve`);
      await deleteNotification(notif._id);
      toast.success("Booking approved!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to approve booking");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (notif) => {
    if (!notif.relatedBooking) return;
    setProcessingId(notif._id);
    try {
      await axiosInstance.put(`/bookings/${notif.relatedBooking}/reject`, { rejectionReason: "Declined via notification" });
      await deleteNotification(notif._id);
      toast.success("Booking rejected");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to reject booking");
    } finally {
      setProcessingId(null);
    }
  };

  useEffect(() => {
    fetchNotifications(1);
  }, [fetchNotifications]);

  const filteredNotifications = filter === "unread"
    ? notifications.filter(n => !n.isRead)
    : notifications;

  const getTypeColor = (type) => {
    switch (type) {
      case "event_approval": return "success";
      case "event_rejection": return "danger";
      case "booking_request": return "warning";
      case "booking_approved": return "success";
      case "booking_rejected": return "danger";
      case "club_approved": return "success";
      case "club_rejected": return "danger";
      case "dm_request": return "info";
      case "dm_received": return "info";
      case "chat_request_accepted": return "success";
      case "chat_request_rejected": return "danger";
      case "announcement": return "info";
      default: return "default";
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "event_approval": return CheckCircle2;
      case "event_rejection": return XCircle;
      case "booking_request": return Calendar;
      case "booking_approved": return CheckCircle2;
      case "booking_rejected": return XCircle;
      case "club_approved": return Users;
      case "club_rejected": return XCircle;
      case "dm_request": return Mail;
      case "dm_received": return MessageCircle;
      case "chat_request_accepted": return CheckCircle2;
      case "chat_request_rejected": return XCircle;
      case "announcement": return BellRing;
      default: return Bell;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-700 text-white py-16 overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary-400/20 rounded-full blur-3xl" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4 animate-fade-in">
            <Bell className="w-5 h-5 text-primary-200" />
            <span className="text-primary-200 font-medium">Stay Updated</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 animate-fade-in-up">
            Notifications
          </h1>
          <p className="text-xl text-primary-100 animate-fade-in-up stagger-1">
            {unreadCount > 0 ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-2.5 h-2.5 bg-secondary-400 rounded-full animate-pulse" />
                {unreadCount} unread notification{unreadCount > 1 ? "s" : ""}
              </span>
            ) : (
              "All caught up!"
            )}
          </p>
        </div>

        {/* Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 80L60 70C120 60 240 40 360 35C480 30 600 30 720 35C840 40 960 50 1080 55C1200 60 1320 60 1380 60L1440 60V80H1380C1320 80 1200 80 1080 80C960 80 840 80 720 80C600 80 480 80 360 80C240 80 120 80 60 80H0Z" className="fill-slate-50 dark:fill-slate-950" />
          </svg>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10 space-y-6 pb-10">
        {/* Filters & Actions */}
        <div className="flex items-center justify-between bg-white dark:bg-slate-900 rounded-2xl shadow-xl shadow-primary-500/5 p-4 border border-slate-100 dark:border-slate-800 animate-fade-in-up">
          <div className="flex gap-2">
            <Button
              variant={filter === "all" ? "primary" : "outline"}
              size="sm"
              onClick={() => setFilter("all")}
            >
              All
            </Button>
            <Button
              variant={filter === "unread" ? "primary" : "outline"}
              size="sm"
              onClick={() => setFilter("unread")}
            >
              Unread
            </Button>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" icon={CheckCheck} onClick={markAllAsRead}>
              Mark all read
            </Button>
            <Button variant="ghost" size="sm" icon={Trash2} onClick={clearAll}>
              Clear all
            </Button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="text-center py-16 animate-fade-in">
              <div className="w-24 h-24 mx-auto mb-6 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
                <Bell className="w-10 h-10 text-slate-300 dark:text-slate-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                {filter === "unread" ? "No unread notifications" : "All caught up!"}
              </h3>
              <p className="text-slate-500 max-w-md mx-auto">
                {filter === "unread" ? "Check back later for new updates" : "You're all caught up! Check back later for new notifications."}
              </p>
            </div>
          ) : (
            filteredNotifications.map((notif, idx) => {
              const IconComponent = getTypeIcon(notif.type);
              const colorVariant = getTypeColor(notif.type);
              return (
                <div
                  key={notif._id}
                  className={`bg-white dark:bg-slate-900 rounded-2xl shadow-sm border transition-all duration-300 hover:shadow-lg animate-fade-in-up ${
                    !notif.isRead
                      ? "border-l-4 border-l-primary-500 border-slate-100 dark:border-slate-800"
                      : "border-slate-100 dark:border-slate-800"
                  }`}
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <div className="p-5 flex items-start gap-4">
                    {/* Icon */}
                    <div className={`p-3 rounded-2xl flex-shrink-0 ${
                      colorVariant === "success" ? "bg-secondary-100 dark:bg-secondary-900/30" :
                      colorVariant === "danger" ? "bg-danger-100 dark:bg-danger-900/30" :
                      "bg-primary-100 dark:bg-primary-900/30"
                    }`}>
                      <IconComponent className={`w-5 h-5 ${
                        colorVariant === "success" ? "text-secondary-600 dark:text-secondary-400" :
                        colorVariant === "danger" ? "text-danger-600 dark:text-danger-400" :
                        "text-primary-600 dark:text-primary-400"
                      }`} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-slate-900 dark:text-white">{notif.title}</h3>
                        {!notif.isRead && (
                          <span className="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {notif.message}
                      </p>
                      <p className="text-xs text-slate-400 mt-2">
                        {new Date(notif.createdAt).toLocaleString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "numeric",
                          minute: "2-digit"
                        })}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 flex-shrink-0">
                      {notif.type === "booking_request" && (isAdmin || notif.recipient === authUser?._id) && (
                        <>
                          <button
                            onClick={() => handleApprove(notif)}
                            disabled={processingId === notif._id}
                            className="p-2.5 hover:bg-secondary-50 dark:hover:bg-secondary-900/20 rounded-xl transition-colors disabled:opacity-50"
                            title="Approve"
                          >
                            <ThumbsUp className="w-4 h-4 text-secondary-600 dark:text-secondary-400" />
                          </button>
                          <button
                            onClick={() => handleReject(notif)}
                            disabled={processingId === notif._id}
                            className="p-2.5 hover:bg-danger-50 dark:hover:bg-danger-900/20 rounded-xl transition-colors disabled:opacity-50"
                            title="Reject"
                          >
                            <ThumbsDown className="w-4 h-4 text-danger-600 dark:text-danger-400" />
                          </button>
                        </>
                      )}
                      {!notif.isRead && (
                        <button
                          onClick={() => markAsRead(notif._id)}
                          className="p-2.5 hover:bg-secondary-50 dark:hover:bg-secondary-900/20 rounded-xl transition-colors"
                          title="Mark as read"
                        >
                          <Check className="w-4 h-4 text-secondary-600 dark:text-secondary-400" />
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notif._id)}
                        className="p-2.5 hover:bg-danger-50 dark:hover:bg-danger-900/20 rounded-xl transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4 text-danger-600 dark:text-danger-400" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
