import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-toastify";

export const useEventStore = create((set) => ({
  events: [],
  clubEvents: [],
  loading: false,

  /* ================= GET ALL EVENTS (student page) ================= */
  fetchAllEvents: async () => {
    set({ loading: true });
    try {
      const res = await axiosInstance.get("/events");
      set({ events: res.data.events });
    } catch (err) {
      toast.error("Failed to load events");
    } finally {
      set({ loading: false });
    }
  },

  /* ================= GET EVENTS OF A CLUB (admin) ================= */
  fetchClubEvents: async (clubId) => {
    if (!clubId) return;

    set({ loading: true });
    try {
      const res = await axiosInstance.get(`/events/club/${clubId}`);
      set({ clubEvents: res.data.events });
    } catch (err) {
      toast.error("Failed to load club events");
    } finally {
      set({ loading: false });
    }
  },

  /* ================= CREATE EVENT ================= */
  createEvent: async (clubId, data) => {
    try {
      const res = await axiosInstance.post(`/events/club/${clubId}`, data);

      set((state) => ({
        clubEvents: [res.data.event, ...state.clubEvents],
        events: [res.data.event, ...state.events],
      }));

      toast.success("Event created");
    } catch (err) {
      toast.error("Failed to create event");
    }
  },

  /* ================= REGISTER FOR EVENT ================= */
  registerForEvent: async (eventId, formData) => {
    try {
      await axiosInstance.post(`/events/register/${eventId}`, formData);

      set((state) => ({
        events: state.events.map((e) =>
          e._id === eventId
            ? { ...e, registeredCount: e.registeredCount + 1 }
            : e
        ),
      }));

      toast.success("Registered successfully");
    } catch (err) {
      toast.error("Registration failed");
    }
  },
}));
