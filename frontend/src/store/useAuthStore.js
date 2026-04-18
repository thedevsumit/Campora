import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-toastify";
import { socket } from "../lib/socket";
import { useNotificationStore } from "./useNotificationStore";

const TOKEN_KEY = "campora_token";

// Helper to get token from URL (OAuth flow)
const getTokenFromUrl = () => {
  const params = new URLSearchParams(window.location.search);
  const urlToken = params.get("token");
  if (urlToken) {
    localStorage.setItem(TOKEN_KEY, urlToken);
    // Clean URL
    window.history.replaceState({}, document.title, window.location.pathname);
    return urlToken;
  }
  return null;
};

export const userAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,

  /* ================= SOCKET HELPERS ================= */
  connectSocket: () => {
    const { authUser } = get();
    if (!authUser?._id) return;

    if (socket.connected) {
      socket.emit("join", authUser._id);
      socket.emit("joinNotifications", authUser._id);
      return;
    }

    // Remove all event listeners to prevent duplicates
    socket.removeAllListeners();

    socket.connect();

    socket.on("connect", () => {
      socket.emit("join", authUser._id);
      socket.emit("joinNotifications", authUser._id);
      console.log("🟢 Socket reconnected & joined:", authUser._id);
    });

    socket.on("receiveNotification", (notification) => {
      useNotificationStore.getState().addNotification(notification);
      toast.info(notification.title);
    });

    socket.on("newChatRequest", (request) => {
      toast.info(`New message request from ${request.sender.fullName}`);
    });

    socket.on("chatRequestAccepted", ({ fullName }) => {
      toast.success(`${fullName} accepted your chat request!`);
    });

    socket.on("chatRequestRejected", () => {
      toast.info("Your chat request was declined");
    });

    console.log("🟢 Socket connected & joined:", authUser._id);
  },

  disconnectSocket: () => {
    if (socket.connected) {
      socket.disconnect();
      console.log("🔴 Socket disconnected");
    }
  },

  /* ================= AUTH ================= */
  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      // Check URL first (OAuth flow) and store if present
      getTokenFromUrl();

      // Set Authorization header from localStorage as default for all requests
      const storedToken = localStorage.getItem(TOKEN_KEY);
      if (storedToken) {
        axiosInstance.defaults.headers.common.Authorization = `Bearer ${storedToken}`;
      }

      const resp = await axiosInstance.get("/auth/check");
      set({ authUser: resp.data });
      get().connectSocket();
    } catch (error) {
      // If cookie auth fails and no localStorage token, clear
      if (!localStorage.getItem(TOKEN_KEY)) {
        set({ authUser: null });
      }
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  loginAuth: async (data) => {
    set({ isLoggingIn: true });
    try {
      const resp = await axiosInstance.post("/auth/login", data);
      const { token, ...userData } = resp.data;
      if (token) {
        localStorage.setItem(TOKEN_KEY, token);
        axiosInstance.defaults.headers.common.Authorization = `Bearer ${token}`;
      }
      set({ authUser: userData });
      toast.success("Logged in successfully!");
      get().connectSocket();
    } catch (error) {
      const msg = error.response?.data?.msg || "Login failed";
      toast.error(msg);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  signupAuth: async (data) => {
    set({ isSigningUp: true });
    try {
      const resp = await axiosInstance.post("/auth/signup", data);
      const { token, ...userData } = resp.data;
      if (token) {
        localStorage.setItem(TOKEN_KEY, token);
        axiosInstance.defaults.headers.common.Authorization = `Bearer ${token}`;
      }
      set({ authUser: userData });
      toast.success("Account created successfully!");
      get().connectSocket();
    } catch (error) {
      const msg = error.response?.data?.msg || "Signup failed";
      toast.error(msg);
    } finally {
      set({ isSigningUp: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
    } catch (error) {
      // Ignore logout errors
    } finally {
      localStorage.removeItem(TOKEN_KEY);
      delete axiosInstance.defaults.headers.common.Authorization;
      get().disconnectSocket();
      set({ authUser: null });
      toast.success("Logged out successfully!");
    }
  },

  /* ================= PROFILE ================= */
  updateProfile: async (data) => {
    try {
      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        if (data[key]) formData.append(key, data[key]);
      });

      const res = await axiosInstance.patch("/users/me", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      set({ authUser: res.data.user });
      toast.success("Profile updated");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile");
    }
  },
}));
