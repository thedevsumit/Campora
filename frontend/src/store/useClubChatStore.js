import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { socket } from "../lib/socket";
import { userAuthStore } from "./useAuthStore";

export const useClubChatStore = create((set, get) => ({
  activeClubId: null,
  messages: [],
  loading: false,

  /* ================= SET ACTIVE CLUB ================= */
  setActiveClub: (clubId) => {
    const prevClub = get().activeClubId;

    if (prevClub) {
      socket.emit("leaveClub", prevClub);
    }

    socket.emit("joinClub", clubId);

    set({ activeClubId: clubId });
  },

  /* ================= FETCH MESSAGES ================= */
  fetchMessages: async (clubId) => {
    set({ loading: true });

    try {
      const res = await axiosInstance.get(`/clubs/${clubId}/messages`);

      set((state) => ({
        messages: res.data.messages ?? [],
        loading: false,
      }));
    } catch (err) {
      console.error("❌ fetch club messages error", err);
      set({ loading: false });
    }
  },

  /* ================= SEND MESSAGE ================= */
  sendMessage: async (content) => {
    if (!content.trim()) return;

    const { activeClubId } = get();
    const { authUser } = userAuthStore.getState();

    if (!activeClubId) return;

    const tempId = `temp-${Date.now()}`;

    // optimistic message
    const tempMessage = {
      _id: tempId,
      club: activeClubId,
      sender: {
        _id: authUser._id,
        fullName: authUser.fullName,
        profilePic: authUser.profilePic,
      },
      content,
      createdAt: new Date(),
    };

    set((state) => ({
      messages: [...state.messages, tempMessage],
    }));

    try {
      await axiosInstance.post(`/clubs/${activeClubId}/messages`, { content });
    } catch (err) {
      console.error("❌ send club message error", err);
    }
  },

  /* ================= SOCKET LISTENER ================= */
  listenToClubMessages: () => {
    socket.off("receiveClubMessage");

    socket.on("receiveClubMessage", (message) => {
      const { activeClubId } = get();

      // normalize clubId comparison
      const msgClubId =
        typeof message.club === "object"
          ? message.club._id?.toString()
          : message.club?.toString();

      if (msgClubId !== activeClubId) return;

      set((state) => {
        // prevent duplicates
        if (state.messages.some((m) => m._id === message._id)) {
          return state;
        }

        // remove optimistic temp message from same sender + content
        const cleaned = state.messages.filter(
          (m) =>
            !(
              m._id.toString().startsWith("temp-") &&
              m.sender._id === message.sender._id &&
              m.content === message.content
            ),
        );

        return {
          messages: [...cleaned, message],
        };
      });
    });
  },

  /* ================= CLEANUP ================= */
  clearClubChat: () => {
    const clubId = get().activeClubId;
    if (clubId) {
      socket.emit("leaveClub", clubId);
    }

    set({
      activeClubId: null,
      messages: [],
    });
  },
}));
