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
    await axiosInstance.post(`/clubs/admin/${clubId}/members`, data);
    toast.success("Member added");
  },

  removeMember: async (clubId, memberId) => {
    await axiosInstance.delete(`/clubs/admin/${clubId}/members/${memberId}`);
    toast.success("Member removed");
  },

  changeRole: async (clubId, memberId, role) => {
    await axiosInstance.patch(`/clubs/admin/${clubId}/members/${memberId}`, { role });
    toast.success("Role updated");
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
    `/clubs/${clubId}/admin/announcements/${announcementId}`
  );
  toast.success("Announcement deleted");

},

}));
