import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-toastify";

export const useAnalyticsStore = create((set) => ({
  dashboard: null,
  eventAnalytics: null,
  clubAnalytics: null,
  resourceAnalytics: null,
  budgetAnalytics: null,
  userAnalytics: null,
  isLoading: false,
  error: null,

  fetchDashboard: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await axiosInstance.get("/analytics/dashboard");
      set({ dashboard: data, isLoading: false });
    } catch (error) {
      toast.error("Failed to fetch analytics dashboard");
      set({ error: "Failed to fetch dashboard", isLoading: false });
    }
  },

  fetchEventAnalytics: async (period = "30") => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await axiosInstance.get(`/analytics/events?period=${period}`);
      set({ eventAnalytics: data, isLoading: false });
    } catch (error) {
      toast.error("Failed to fetch event analytics");
      set({ error: "Failed to fetch event analytics", isLoading: false });
    }
  },

  fetchClubAnalytics: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await axiosInstance.get("/analytics/clubs");
      set({ clubAnalytics: data, isLoading: false });
    } catch (error) {
      toast.error("Failed to fetch club analytics");
      set({ error: "Failed to fetch club analytics", isLoading: false });
    }
  },

  fetchResourceAnalytics: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await axiosInstance.get("/analytics/resources");
      set({ resourceAnalytics: data, isLoading: false });
    } catch (error) {
      toast.error("Failed to fetch resource analytics");
      set({ error: "Failed to fetch resource analytics", isLoading: false });
    }
  },

  fetchBudgetAnalytics: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await axiosInstance.get("/analytics/budget");
      set({ budgetAnalytics: data, isLoading: false });
    } catch (error) {
      toast.error("Failed to fetch budget analytics");
      set({ error: "Failed to fetch budget analytics", isLoading: false });
    }
  },

  fetchUserAnalytics: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await axiosInstance.get("/analytics/users");
      set({ userAnalytics: data, isLoading: false });
    } catch (error) {
      toast.error("Failed to fetch user analytics");
      set({ error: "Failed to fetch user analytics", isLoading: false });
    }
  },

  clearAnalytics: () => {
    set({
      dashboard: null,
      eventAnalytics: null,
      clubAnalytics: null,
      resourceAnalytics: null,
      budgetAnalytics: null,
      userAnalytics: null,
      isLoading: false,
      error: null
    });
  }
}));
