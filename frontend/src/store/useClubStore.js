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

    /* ================= PROFILE ================= */

  joinedClubs: [],
  followedClubs: [],
  createdClubs: [],
  attendedEvents: [],

  isFetchingProfileClubs: false,
  isFetchingProfileEvents: false,

  /* ================= FETCH ================= */

  getAllClubs: async () => {
    set({ isFetchingClubs: true });
    try {
      const resp = await axiosInstance.get("/clubs");
      set({ clubs: resp.data.clubs || [] });
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch clubs");
    } finally {
      set({ isFetchingClubs: false });
    }
  },

  getClubById: async (clubId) => {
    set({ isFetchingClub: true });
    try {
      const resp = await axiosInstance.get(`/clubs/${clubId}`);
      set({ selectedClub: resp.data.club });
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch club");
    } finally {
      set({ isFetchingClub: false });
    }
  },

  /* ================= CRUD ================= */

  createClub: async (data) => {
    set({ isCreatingClub: true });
    try {
      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        if (data[key] !== undefined && data[key] !== null) {
          formData.append(key, data[key]);
        }
      });

      const resp = await axiosInstance.post("/clubs", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      set((state) => ({
        clubs: [resp.data.club, ...state.clubs],
      }));

      toast.success("Club created");
    } catch (error) {
      console.error(error);
      toast.error("Failed to create club");
    } finally {
      set({ isCreatingClub: false });
    }
  },

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

      toast.success("Club updated");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update club");
    } finally {
      set({ isUpdatingClub: false });
    }
  },

  deleteClub: async (clubId) => {
    set({ isDeletingClub: true });
    try {
      await axiosInstance.delete(`/clubs/${clubId}`);

      set((state) => ({
        clubs: state.clubs.filter((c) => c._id !== clubId),
        selectedClub:
          state.selectedClub?._id === clubId ? null : state.selectedClub,
      }));

      toast.success("Club deleted");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete club");
    } finally {
      set({ isDeletingClub: false });
    }
  },

  /* ================= MEMBERSHIP ================= */

  joinClub: async (clubId, user) => {
    try {
      await axiosInstance.post(`/clubs/${clubId}/join`);

      const { selectedClub } = get();

      set({
        selectedClub: {
          ...selectedClub,
          members: [...selectedClub.members, { user, role: "Member" }],
          followers: selectedClub.followers.filter((u) => u?._id !== user._id),
        },
      });

      toast.success("Joined club");
    } catch (err) {
      console.error(err);
      toast.error("Failed to join club");
    }
  },

  leaveClub: async (clubId, user) => {
    try {
      await axiosInstance.post(`/clubs/${clubId}/leave`);

      const { selectedClub } = get();

      set({
        selectedClub: {
          ...selectedClub,
          members: selectedClub.members.filter((m) => m.user?._id !== user._id),
        },
      });

      toast.success("Left club");
    } catch (err) {
      console.error(err);
      toast.error("Failed to leave club");
    }
  },

  followClub: async (clubId, user) => {
    try {
      await axiosInstance.post(`/clubs/${clubId}/follow`);

      const { selectedClub } = get();

      set({
        selectedClub: {
          ...selectedClub,
          followers: [...selectedClub.followers, user],
        },
      });

      toast.success("Followed club");
    } catch (err) {
      console.error(err);
      toast.error("Failed to follow");
    }
  },

  unfollowClub: async (clubId, user) => {
    try {
      await axiosInstance.post(`/clubs/${clubId}/unfollow`);

      const { selectedClub } = get();

      set({
        selectedClub: {
          ...selectedClub,
          followers: selectedClub.followers.filter((u) => u?._id !== user._id),
        },
      });

      toast.success("Unfollowed club");
    } catch (err) {
      console.error(err);
      toast.error("Failed to unfollow");
    }
  },

  clearSelectedClub: () => set({ selectedClub: null }),

    /* ================= PROFILE FETCH ================= */

  getJoinedClubs: async () => {
    set({ isFetchingProfileClubs: true });
    try {
      const resp = await axiosInstance.get("/users/me/clubs/joined");
      set({ joinedClubs: resp.data.clubs || [] });
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch joined clubs");
    } finally {
      set({ isFetchingProfileClubs: false });
    }
  },

  getFollowedClubs: async () => {
    set({ isFetchingProfileClubs: true });
    try {
      const resp = await axiosInstance.get("/users/me/clubs/followed");
      set({ followedClubs: resp.data.clubs || [] });
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch followed clubs");
    } finally {
      set({ isFetchingProfileClubs: false });
    }
  },

  getAttendedEvents: async () => {
    set({ isFetchingProfileEvents: true });
    try {
      const resp = await axiosInstance.get("/users/me/events/attended");
      set({ attendedEvents: resp.data.events || [] });
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch attended events");
    } finally {
      set({ isFetchingProfileEvents: false });
    }
  },

  getCreatedClubs: async () => {
    set({ isFetchingProfileClubs: true });
    try {
      const resp = await axiosInstance.get("/clubs/users/me/clubs/created");
      set({ createdClubs: resp.data.clubs || [] });
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch created clubs");
    } finally {
      set({ isFetchingProfileClubs: false });
    }
  },


}));
