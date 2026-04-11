import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-toastify";

export const useResourceStore = create((set, get) => ({
  resources: [],
  bookings: [],
  selectedResource: null,
  isLoading: false,
  isBooking: false,

  fetchResources: async (filters = {}) => {
    set({ isLoading: true });
    try {
      const params = new URLSearchParams(filters).toString();
      const { data } = await axios.get(`/resources${params ? `?${params}` : ""}`);
      set({ resources: data.resources, isLoading: false });
    } catch (error) {
      toast.error("Failed to fetch resources");
      set({ isLoading: false });
    }
  },

  getResourceById: async (resourceId) => {
    set({ isLoading: true });
    try {
      const { data } = await axios.get(`/resources/${resourceId}`);
      set({ selectedResource: data.resource, isLoading: false });
      return data.resource;
    } catch (error) {
      toast.error("Failed to fetch resource");
      set({ isLoading: false });
    }
  },

  createResource: async (resourceData) => {
    try {
      const { data } = await axios.post("/resources", resourceData);
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
      const { data } = await axios.get("/bookings");
      set({ bookings: data.bookings, isLoading: false });
    } catch (error) {
      toast.error("Failed to fetch bookings");
      set({ isLoading: false });
    }
  },

  createBooking: async (bookingData) => {
    set({ isBooking: true });
    try {
      const { data } = await axios.post("/bookings", bookingData);
      toast.success(data.booking.status === "approved" ? "Booking confirmed!" : "Booking request submitted!");
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
      await axios.delete(`/bookings/${bookingId}`);
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
      const { data } = await axios.put(`/bookings/${bookingId}/approve`);
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
      const { data } = await axios.put(`/bookings/${bookingId}/reject`, { rejectionReason: reason });
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
