import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-toastify";

export const useNotificationStore = create((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  total: 0,
  currentPage: 1,

  fetchNotifications: async (page = 1) => {
    set({ isLoading: true });
    try {
      const { data } = await axios.get(`/notifications?page=${page}&limit=20`);
      set({
        notifications: data.notifications,
        total: data.total,
        currentPage: data.page,
        isLoading: false
      });
    } catch (error) {
      toast.error("Failed to fetch notifications");
      set({ isLoading: false });
    }
  },

  fetchUnreadCount: async () => {
    try {
      const { data } = await axios.get("/notifications/unread-count");
      set({ unreadCount: data.count });
    } catch (error) {
      console.error("Failed to fetch unread count");
    }
  },

  markAsRead: async (notifId) => {
    try {
      await axios.put(`/notifications/${notifId}/read`);
      set(state => ({
        notifications: state.notifications.map(n =>
          n._id === notifId ? { ...n, isRead: true } : n
        ),
        unreadCount: Math.max(0, state.unreadCount - 1)
      }));
    } catch (error) {
      toast.error("Failed to mark as read");
    }
  },

  markAllAsRead: async () => {
    try {
      await axios.put("/notifications/read-all");
      set(state => ({
        notifications: state.notifications.map(n => ({ ...n, isRead: true })),
        unreadCount: 0
      }));
      toast.success("All notifications marked as read");
    } catch (error) {
      toast.error("Failed to mark all as read");
    }
  },

  deleteNotification: async (notifId) => {
    try {
      await axios.delete(`/notifications/${notifId}`);
      set(state => ({
        notifications: state.notifications.filter(n => n._id !== notifId),
        unreadCount: state.notifications.find(n => n._id === notifId && !n.isRead)
          ? state.unreadCount - 1
          : state.unreadCount
      }));
    } catch (error) {
      toast.error("Failed to delete notification");
    }
  },

  clearAll: async () => {
    try {
      await axios.delete("/notifications/clear-all");
      set({ notifications: [], unreadCount: 0 });
      toast.success("All notifications cleared");
    } catch (error) {
      toast.error("Failed to clear notifications");
    }
  },

  addNotification: (notification) => {
    set(state => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + 1
    }));
  }
}));
