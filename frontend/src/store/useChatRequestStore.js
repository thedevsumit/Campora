import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-toastify";

export const useChatRequestStore = create((set) => ({
  requests: [],
  isLoading: false,

  // Fetch incoming chat requests
  fetchRequests: async () => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get("/chat/requests");
      set({ requests: res.data.requests });
    } catch (err) {
      toast.error("Failed to load chat requests");
    } finally {
      set({ isLoading: false });
    }
  },

  acceptRequest: async (requestId) => {
    try {
      await axiosInstance.post(`/chat/accept/${requestId}`);
      set((state) => ({
        requests: state.requests.filter((r) => r._id !== requestId),
      }));
      toast.success("Chat request accepted");
    } catch {
      toast.error("Failed to accept request");
    }
  },

  rejectRequest: async (requestId) => {
    try {
      await axiosInstance.post(`/chat/reject/${requestId}`);
      set((state) => ({
        requests: state.requests.filter((r) => r._id !== requestId),
      }));
      toast.info("Chat request declined");
    } catch {
      toast.error("Failed to decline request");
    }
  },
}));
    