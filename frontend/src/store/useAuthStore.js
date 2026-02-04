import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-toastify";
import { socket } from "../lib/socket";

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

    if (!socket.connected) {
      socket.connect();
      socket.emit("join", authUser._id);
      console.log("🟢 Socket connected & joined:", authUser._id);
    }
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
      const resp = await axiosInstance.get("/auth/check");
      set({ authUser: resp.data });
      get().connectSocket(); // ✅ connect after auth
    } catch (error) {
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  loginAuth: async (data) => {
    set({ isLoggingIn: true });
    try {
      const resp = await axiosInstance.post("/auth/login", data);
      set({ authUser: resp.data });
      toast.success("Logged in successfully!");
      get().connectSocket(); // ✅ connect on login
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
      set({ authUser: resp.data });
      toast.success("Account created successfully!");
      get().connectSocket(); // ✅ connect on signup
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
      get().disconnectSocket(); // ✅ disconnect on logout
      set({ authUser: null });
      toast.success("Logged out successfully!");
    } catch (error) {
      const msg = error.response?.data?.msg || "Logout failed";
      toast.error(msg);
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
