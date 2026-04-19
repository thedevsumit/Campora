import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-toastify";

export const useEventStore = create((set) => ({
  events: [],
  clubEvents: [],
  loading: false,
  currentEvent: null,

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

  /* ================= GET EVENT BY ID (with participants) ================= */
  fetchEventById: async (eventId) => {
    set({ loading: true });
    try {
      const res = await axiosInstance.get(`/events/${eventId}`);
      set({ currentEvent: res.data.event });
      return res.data.event;
    } catch (err) {
      toast.error("Failed to load event details");
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
  createEvent: async (clubId, formData) => {
    try {
      const res = await axiosInstance.post(`/events/club/${clubId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      set((state) => ({
        clubEvents: [res.data.event, ...state.clubEvents],
        events: [res.data.event, ...state.events],
      }));

      toast.success("Event created successfully");
    } catch (err) {
      toast.error("Failed to create event");
      throw err;
    }
  },

  /* ================= REGISTER FOR EVENT ================= */
  registerForEvent: async (eventId, formData) => {
    try {
      await axiosInstance.post(`/events/${eventId}/register`, formData); 
    // console.log("HIT REGISTER ROUTE");
      set((state) => ({
        events: state.events.map((e) =>
          e._id === eventId
            ? { ...e, registeredCount: e.registeredCount + 1 }
            : e
        ),
      }));

      toast.success("Registered successfully");
    } catch (err) {
      console.log(err)
      toast.error("Registration failed");
    }
  },

  /* ================= DELETE EVENT ================= */
  deleteEvent: async (eventId) => {
    try {
      await axiosInstance.delete(`/events/${eventId}`);
      set((state) => ({
        clubEvents: state.clubEvents.filter((e) => e._id !== eventId),
        events: state.events.filter((e) => e._id !== eventId),
      }));
      toast.success("Event deleted");
    } catch (err) {
      toast.error("Failed to delete event");
      throw err;
    }
  },
}));
