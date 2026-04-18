import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-toastify";

export const useNotificationStore = create((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  total: 0,
  currentPage: 1,
  isBellOpen: false,

  setBellOpen: (open) => set({ isBellOpen: open }),

  fetchNotifications: async (page = 1) => {
    set({ isLoading: true });
    try {
      const { data } = await axiosInstance.get(`/notifications?page=${page}&limit=20`);
      set({
        notifications: data.notifications || [],
        total: data.total || 0,
        currentPage: data.page || 1,
        isLoading: false
      });
    } catch (error) {
      toast.error("Failed to fetch notifications");
      set({ isLoading: false });
    }
  },

  fetchUnreadCount: async () => {
    try {
      const { data } = await axiosInstance.get("/notifications/unread-count");
      set({ unreadCount: data.count || 0 });
    } catch (error) {
      // Silently fail - don't spam console on every poll
    }
  },

  markAsRead: async (notifId) => {
    try {
      await axiosInstance.put(`/notifications/${notifId}/read`);
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
      await axiosInstance.put("/notifications/read-all");
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
      await axiosInstance.delete(`/notifications/${notifId}`);
      set(state => {
        const notification = state.notifications.find(n => n._id === notifId);
        return {
          notifications: state.notifications.filter(n => n._id !== notifId),
          unreadCount: notification && !notification.isRead
            ? Math.max(0, state.unreadCount - 1)
            : state.unreadCount
        };
      });
    } catch (error) {
      toast.error("Failed to delete notification");
    }
  },

  clearAll: async () => {
    // Optimistic clear — clear UI immediately, then sync with server
    set({ notifications: [], unreadCount: 0 });
    try {
      const baseURL = axiosInstance.defaults.baseURL;
      const token = localStorage.getItem("campora_token");
      await fetch(`${baseURL}/notifications/clear-all`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: "include",
      });
      toast.success("All notifications cleared");
    } catch (error) {
      // Silently fail — UI is already cleared
    }
  },

  addNotification: (notification) => {
    set(state => {
      // Prevent duplicate notifications (same ID already exists)
      if (state.notifications.some(n => n._id === notification._id)) {
        return state;
      }
      return {
        notifications: [notification, ...state.notifications],
        unreadCount: state.unreadCount + 1,
      };
    });
  }
}));
