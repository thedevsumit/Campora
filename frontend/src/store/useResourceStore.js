import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-toastify";

export const useResourceStore = create((set, get) => ({
  resources: [],
  scheduledResources: [],
  bookings: [],
  selectedResource: null,
  isLoading: false,
  isBooking: false,

  fetchResources: async (filters = {}) => {
    set({ isLoading: true });
    try {
      const params = new URLSearchParams(filters).toString();
      const [resourcesRes, bookingsRes] = await Promise.all([
        axiosInstance.get(`/resources${params ? `?${params}` : ""}`),
        axiosInstance.get("/bookings"),
      ]);
      set({
        resources: resourcesRes.data.resources || [],
        bookings: bookingsRes.data.bookings || [],
        isLoading: false,
      });
    } catch (error) {
      toast.error("Failed to fetch resources");
      set({ isLoading: false });
    }
  },

  fetchScheduledResources: async () => {
    try {
      const { data } = await axiosInstance.get("/resources/scheduled/all");
      set({ scheduledResources: data.resources || [] });
      return data.resources;
    } catch (error) {
      toast.error("Failed to fetch scheduled resources");
      throw error;
    }
  },

  getResourceById: async (resourceId) => {
    set({ isLoading: true });
    try {
      const { data } = await axiosInstance.get(`/resources/${resourceId}`);
      set({ selectedResource: data.resource, isLoading: false });
      return data.resource;
    } catch (error) {
      toast.error("Failed to fetch resource");
      set({ isLoading: false });
    }
  },

  createResource: async (resourceData) => {
    try {
      const { data } = await axiosInstance.post("/resources", resourceData);
      set(state => ({ resources: [...state.resources, data.resource] }));
      toast.success("Resource created successfully");
      return data.resource;
    } catch (error) {
      toast.error("Failed to create resource");
      throw error;
    }
  },

  fetchBookings: async () => {
    set({ isLoading: true });
    try {
      const { data } = await axiosInstance.get("/bookings");
      set({ bookings: data.bookings || [], isLoading: false });
    } catch (error) {
      toast.error("Failed to fetch bookings");
      set({ isLoading: false });
    }
  },

  createBooking: async (bookingData) => {
    set({ isBooking: true });
    try {
      const { data } = await axiosInstance.post("/bookings", bookingData);
      set(state => ({ bookings: [data.booking, ...state.bookings], isBooking: false }));
      return data.booking;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create booking");
      set({ isBooking: false });
      throw error;
    }
  },

  cancelBooking: async (bookingId) => {
    try {
      await axiosInstance.delete(`/bookings/${bookingId}`);
      set(state => ({
        bookings: state.bookings.map(b =>
          b._id === bookingId ? { ...b, status: "cancelled" } : b
        )
      }));
      toast.success("Booking cancelled");
    } catch (error) {
      toast.error("Failed to cancel booking");
    }
  },

  approveBooking: async (bookingId) => {
    try {
      const { data } = await axiosInstance.put(`/bookings/${bookingId}/approve`);
      set(state => ({
        bookings: state.bookings.map(b =>
          b._id === bookingId ? { ...b, status: "approved" } : b
        )
      }));
      toast.success("Booking approved");
      return data.booking;
    } catch (error) {
      toast.error("Failed to approve booking");
      throw error;
    }
  },

  rejectBooking: async (bookingId, reason) => {
    try {
      const { data } = await axiosInstance.put(`/bookings/${bookingId}/reject`, { rejectionReason: reason });
      set(state => ({
        bookings: state.bookings.map(b =>
          b._id === bookingId ? { ...b, status: "rejected" } : b
        )
      }));
      toast.success("Booking rejected");
      return data.booking;
    } catch (error) {
      toast.error("Failed to reject booking");
      throw error;
    }
  }
}));
