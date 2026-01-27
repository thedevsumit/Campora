import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-toastify";

export const useClubStore = create((set, get) => ({
  clubs: [],
  selectedClub: null,

  isCreatingClub: false,
  isFetchingClubs: false,
  isFetchingClub: false,
  isUpdatingClub: false,
  isDeletingClub: false,

  // ✅ GET ALL CLUBS
  getAllClubs: async () => {
    set({ isFetchingClubs: true });
    try {
      const resp = await axiosInstance.get("/clubs");
      set({ clubs: resp.data.clubs || [] });
    } catch (error) {
      console.log(error);
      const msg = error.response?.data?.msg || "Failed to fetch clubs";
      toast.error(msg);
    } finally {
      set({ isFetchingClubs: false });
    }
  },

  // ✅ GET CLUB BY ID
  getClubById: async (clubId) => {
    set({ isFetchingClub: true });
    try {
      const resp = await axiosInstance.get(`/clubs/${clubId}`);
      set({ selectedClub: resp.data.club });
    } catch (error) {
      console.log(error);
      const msg = error.response?.data?.msg || "Failed to fetch club";
      toast.error(msg);
    } finally {
      set({ isFetchingClub: false });
    }
  },

  // ✅ CREATE CLUB
  createClub: async (data) => {
    set({ isCreatingClub: true });
    try {
      const resp = await axiosInstance.post("/clubs", data);

      // add new club to top
      set((state) => ({
        clubs: [resp.data.club, ...state.clubs],
      }));

      toast.success("Club created successfully ✅");
    } catch (error) {
      console.log(error);
      const msg = error.response?.data?.msg || "Failed to create club";
      toast.error(msg);
    } finally {
      set({ isCreatingClub: false });
    }
  },

  // ✅ UPDATE CLUB
  updateClub: async (clubId, data) => {
    set({ isUpdatingClub: true });
    try {
      const resp = await axiosInstance.patch(`/clubs/${clubId}`, data);

      set((state) => ({
        clubs: state.clubs.map((c) => (c._id === clubId ? resp.data.club : c)),
        selectedClub:
          state.selectedClub?._id === clubId
            ? resp.data.club
            : state.selectedClub,
      }));

      toast.success("Club updated ✅");
    } catch (error) {
      console.log(error);
      const msg = error.response?.data?.msg || "Failed to update club";
      toast.error(msg);
    } finally {
      set({ isUpdatingClub: false });
    }
  },

  // ✅ DELETE CLUB
  deleteClub: async (clubId) => {
    set({ isDeletingClub: true });
    try {
      await axiosInstance.delete(`/clubs/${clubId}`);

      set((state) => ({
        clubs: state.clubs.filter((c) => c._id !== clubId),
        selectedClub:
          state.selectedClub?._id === clubId ? null : state.selectedClub,
      }));

      toast.success("Club deleted ✅");
    } catch (error) {
      console.log(error);
      const msg = error.response?.data?.msg || "Failed to delete club";
      toast.error(msg);
    } finally {
      set({ isDeletingClub: false });
    }
  },

  // ✅ OPTIONAL: clear selected club
  clearSelectedClub: () => {
    set({ selectedClub: null });
  },
}));
