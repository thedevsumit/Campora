import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-toastify";

export const useClubAdminStore = create((set) => ({
  adminClub: null,
  loading: false,
  announcements: [],

  fetchAdminClub: async (clubId) => {
    set({ loading: true });
    try {
      const res = await axiosInstance.get(`/clubs/admin/${clubId}`);
      set({ adminClub: res.data.club });
    } catch {
      toast.error("Not authorized");
    } finally {
      set({ loading: false });
    }
  },

  addMember: async (clubId, data) => {
    try {
      // First find user by email
      const userRes = await axiosInstance.get(`/users/by-email/${data.email}`);

      const userId = userRes.data._id;

      await axiosInstance.put(`/clubs/${clubId}/add-member`, {
        userId,
        role: data.role,
      });
    } catch (err) {
      console.error(err);
      alert("Failed to add member");
    }
  },
  removeMember: async (clubId, memberId) => {
    try {
      await axiosInstance.put(`/clubs/${clubId}/remove-member`, {
        userId: memberId,
      });
    } catch (err) {
      console.error(err);
      alert("Failed to remove member");
    }
  },

  changeRole: async (clubId, memberId, role) => {
    try {
      await axiosInstance.put(`/clubs/${clubId}/update-role`, {
        userId: memberId,
        newRole: role,
      });
    } catch (err) {
      console.error(err);
      alert("Failed to update role");
    }
  },

  createAnnouncement: async (clubId, data) => {
    await axiosInstance.post(`/clubs/${clubId}/admin/announcements`, data);
    toast.success("Announcement created");
  },

  fetchAnnouncements: async (clubId) => {
    const res = await axiosInstance.get(`/clubs/${clubId}/announcements`);
    set({ announcements: res.data.announcements });
  },

  deleteAnnouncement: async (clubId, announcementId) => {
    await axiosInstance.delete(
      `/clubs/${clubId}/admin/announcements/${announcementId}`,
    );
    toast.success("Announcement deleted");
  },
}));
