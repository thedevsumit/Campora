import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { axiosInstance } from "../lib/axios";
import { getImageUrl } from "../lib/utils";
import { socket } from "../lib/socket";
import { userAuthStore } from "../store/useAuthStore";
import Navbar from "../components/Navbar";
import Button from "../components/ui/Button";
import Loader from "../components/ui/Loader";
import { toast } from "react-toastify";
import { useNotificationStore } from "../store/useNotificationStore";
import {
  Send,
  ArrowLeft,
  MessageCircle,
  Circle,
  Smile,
  Paperclip,
  MoreVertical,
  Phone,
  Video,
  Image,
  X,
  User,
  Ban,
  AlertTriangle,
} from "lucide-react";

const formatTime = (d) =>
  new Date(d).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const formatDate = (d) => {
  const date = new Date(d);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
  return date.toLocaleDateString([], {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
};

const Avatar = ({ src, name, size = "md" }) => {
  const sizeClasses =
    size === "sm" ? "w-8 h-8" : size === "lg" ? "w-14 h-14" : "w-12 h-12";
  return src ? (
    <img
      src={getImageUrl(src)}
      className={`${sizeClasses} rounded-xl object-cover`}
      alt={name}
    />
  ) : (
    <div
      className={`${sizeClasses} bg-gradient-to-br from-primary-500 to-secondary-500 text-white rounded-xl flex items-center justify-center text-sm font-bold`}
    >
      {name?.[0]}
    </div>
  );
};

const DateSeparator = ({ date }) => (
  <div className="flex items-center gap-3 py-3">
    <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
    <span className="text-xs text-slate-400 font-medium px-4 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-full">
      {formatDate(date)}
    </span>
    <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
  </div>
);

const MessageBubble = ({ message, isMe, authUser }) => {
  const senderAvatar = message.sender?.profilePic;
  const senderName = message.sender?.fullName;
  const hasImage = message.isImage || message.imageUrl;

  return (
    <div
      className={`flex gap-3 ${isMe ? "justify-end" : "justify-start"} animate-fade-in`}
    >
      {!isMe && <Avatar src={senderAvatar} name={senderName} size="sm" />}
      <div className={`flex flex-col ${isMe ? "items-end" : "items-start"} max-w-[70%]`}>
        {!isMe && (
          <span className="text-xs text-slate-500 mb-1.5 ml-1 font-medium">
            {senderName}
          </span>
        )}
        <div
          className={`relative overflow-hidden ${
            hasImage ? "p-1" : "px-5 py-3.5"
          } shadow-md ${
            isMe
              ? "bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-2xl rounded-br-sm"
              : "bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-100 dark:border-slate-700 rounded-2xl rounded-bl-sm"
          }`}
        >
          {hasImage ? (
            <img
              src={getImageUrl(message.imageUrl)}
              alt="Shared"
              className="max-w-[250px] max-h-[250px] rounded-xl object-cover cursor-pointer hover:opacity-95 transition-opacity"
              onClick={() => window.open(getImageUrl(message.imageUrl), "_blank")}
            />
          ) : (
            <p className="text-sm leading-relaxed">{message.content}</p>
          )}
          {/* Message tail */}
          {!hasImage && (
            <div
              className={`absolute top-0 w-4 h-4 ${isMe ? "-right-2" : "-left-2"} ${
                isMe ? "bg-primary-500" : "bg-white dark:bg-slate-800"
              }`}
              style={{
                clipPath: isMe
                  ? "polygon(0 0, 0 100%, 100% 100%)"
                  : "polygon(100% 0, 0 100%, 100% 100%)",
              }}
            />
          )}
        </div>
        <span className="mt-1.5 text-[11px] text-slate-400 mx-1 flex items-center gap-1.5">
          {formatTime(message.createdAt)}
          {isMe && (
            <Circle className="w-3 h-3 fill-primary-400 text-primary-400" />
          )}
        </span>
      </div>
      {isMe && <Avatar src={authUser.profilePic} name={authUser.fullName} size="sm" />}
    </div>
  );
};

export default function PrivateChatPage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { authUser } = userAuthStore();
  const addNotification = useNotificationStore((state) => state.addNotification);
  const [otherUser, setOtherUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [isOnline, setIsOnline] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [showBlockConfirm, setShowBlockConfirm] = useState(false);
  const fileInputRef = useRef();
  const bottomRef = useRef();
  const menuRef = useRef();
  const lastNotifRef = useRef(0);
  const NOTIFICATION_COOLDOWN = 60000; // 1 minute

  useEffect(() => {
    setIsLoading(true);
    Promise.all([
      axiosInstance.get(`/users/${userId}/profile`),
      axiosInstance.post("/users/online-status", { userIds: [userId] }),
      axiosInstance.get(`/chats/messages/${userId}`)
    ])
      .then(([profileRes, statusRes, messagesRes]) => {
        setOtherUser(profileRes.data.user || { fullName: "User" });
        const status = statusRes.data.result?.find((r) => r.userId === userId);
        if (status) setIsOnline(status.isOnline);
        setMessages(messagesRes.data.messages || []);
      })
      .catch(() => {
        setOtherUser({ fullName: "User" });
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [userId]);

  useEffect(() => {
    socket.emit("join", authUser._id);

    const messageHandler = (msg) => {
      console.log("MSG received:", msg);
      // Ignore if message is from self or auth not loaded
      if (!authUser?._id) { console.log("no auth"); return; }
      if (!msg.sender?._id) { console.log("no sender"); return; }

      const senderId = msg.sender._id.toString();
      console.log("senderId:", senderId, "authUserId:", authUser._id.toString());
      const isOwnMessage = senderId === authUser._id.toString();
      console.log("isOwnMessage:", isOwnMessage);
      if (isOwnMessage) return;

      // Add message to chat
      setMessages((prev) => [...prev, msg]);

      // Rate limit: only notify once per minute
      const now = Date.now();
      if (now - lastNotifRef.current < NOTIFICATION_COOLDOWN) {
        console.log("Notification suppressed (rate limit)", { timeSinceLast: now - lastNotifRef.current });
        return;
      }

      lastNotifRef.current = now;

      // Play notification sound
      try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        oscillator.frequency.value = 800;
        oscillator.type = "sine";
        gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
        oscillator.start(audioCtx.currentTime);
        oscillator.stop(audioCtx.currentTime + 0.3);
      } catch (e) {
        console.error("Audio error:", e);
      }

      // Add to notification store
      addNotification({
        _id: `chat-${msg._id}-${now}`,
        type: "message",
        title: msg.sender.fullName || "New Message",
        message: msg.content || "Sent you an image",
        isRead: false,
        createdAt: new Date().toISOString(),
        actionUrl: `/chat/${senderId}`,
        actionLabel: "View Chat",
      });

      toast.info(msg.content ? `${msg.sender.fullName}: ${msg.content.substring(0, 50)}...` : `${msg.sender.fullName} sent an image`, {
        icon: "💬",
        autoClose: 3000,
      });
    };

    const statusHandler = ({ userId: uid, status }) => {
      if (uid === userId) {
        setIsOnline(status === "online");
      }
    };

    socket.on("receiveMessage", messageHandler);
    socket.on("userStatus", statusHandler);
    return () => {
      socket.off("receiveMessage", messageHandler);
      socket.off("userStatus", statusHandler);
    };
  }, [authUser._id, userId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }
      setSelectedImage(file);
      setShowImagePreview(true);
    }
  };

  const handleImageSend = async () => {
    if (!selectedImage) return;

    const formData = new FormData();
    formData.append("image", selectedImage);
    formData.append("content", "📷 Image");

    // Clear preview immediately
    setShowImagePreview(false);
    setSelectedImage(null);

    const tempMessage = {
      content: "📷 Sending image...",
      sender: authUser,
      createdAt: new Date(),
      _id: "temp_img_" + Date.now(),
      isImage: true,
      imageUrl: URL.createObjectURL(selectedImage),
    };

    setMessages((prev) => [...prev, tempMessage]);

    try {
      const res = await axiosInstance.post(`/chats/messages/${userId}/image`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessages((prev) =>
        prev.map((m) => (m._id === tempMessage._id ? res.data.message : m))
      );
    } catch (err) {
      toast.error("Failed to send image");
      setMessages((prev) => prev.filter((m) => m._id !== tempMessage._id));
    }
  };

  const handleCall = (type) => {
    toast.info(`${type === "audio" ? "Audio" : "Video"} calling is coming soon! 🚀`);
  };

  const handleViewProfile = () => {
    navigate(`/profile/${userId}`);
  };

  const handleBlockUser = async () => {
    try {
      await axiosInstance.post(`/chats/block/${userId}`);
      toast.success(`You have blocked ${otherUser?.fullName}`);
      setShowBlockConfirm(false);
      navigate(-1);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to block user");
    }
  };

  const handleSend = async () => {
    if (!text.trim()) return;

    const content = text.trim();
    const tempMessage = {
      content,
      sender: authUser,
      createdAt: new Date(),
      _id: "temp_" + Date.now(),
    };

    // Clear text immediately for responsive feel
    setText("");
    setMessages((prev) => [...prev, tempMessage]);

    try {
      const res = await axiosInstance.post(`/chats/messages/${userId}`, { content });
      setMessages((prev) =>
        prev.map((m) => (m._id === tempMessage._id ? res.data.message : m))
      );
    } catch (err) {
      setMessages((prev) => prev.filter((m) => m._id !== tempMessage._id));
      setText(content);
      console.error("Failed to send message:", err);
    }
  };

  // Group messages by date
  const groupedMessages = messages.reduce((groups, message) => {
    const date = new Date(message.createdAt).toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {});

  if (isLoading) {
    return (
      <>
        <Navbar />
        <Loader
          variant="page"
          text="Loading conversation..."
          className="!relative !bg-slate-100 dark:!bg-slate-950 !min-h-[calc(100vh-64px)]"
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex flex-col">
      <Navbar />

      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 px-4 py-3 flex items-center gap-4 sticky top-16 z-30 shadow-sm">
        <button
          onClick={() => navigate(-1)}
          className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
        </button>
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="relative flex-shrink-0">
            <Avatar
              src={otherUser?.profilePic}
              name={otherUser?.fullName}
              size="md"
            />
            {isOnline && (
              <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-white dark:border-slate-900 animate-pulse" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-base font-bold text-slate-900 dark:text-white truncate">
              {otherUser?.fullName || "User"}
            </h1>
            <p className="text-xs text-slate-500 flex items-center gap-1.5">
              {isOnline ? (
                <>
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-green-500 font-medium">Online</span>
                </>
              ) : (
                <>
                  <span className="w-2 h-2 bg-red-400 rounded-full" />
                  <span className="text-slate-400 font-medium">Offline</span>
                </>
              )}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleCall("audio")}
            className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-primary-500 transition-colors"
            title="Audio Call"
          >
            <Phone className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleCall("video")}
            className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-primary-500 transition-colors"
            title="Video Call"
          >
            <Video className="w-5 h-5" />
          </button>
          <div ref={menuRef} className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-primary-500 transition-colors"
              title="More Options"
            >
              <MoreVertical className="w-5 h-5" />
            </button>

            {/* Dropdown Menu */}
            {showMenu && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700 z-50 animate-scale-in overflow-hidden">
                <button
                  onClick={() => {
                    handleViewProfile();
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors text-left"
                >
                  <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                    <User className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                  </div>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200">View Profile</span>
                </button>
                <div className="h-px bg-slate-100 dark:bg-slate-700" />
                <button
                  onClick={() => {
                    setShowBlockConfirm(true);
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-left"
                >
                  <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                    <Ban className="w-4 h-4 text-red-600 dark:text-red-400" />
                  </div>
                  <span className="text-sm font-medium text-red-600 dark:text-red-400">Block User</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-slate-100 to-slate-50 dark:from-slate-950 dark:to-slate-900">
        <div className="max-w-3xl mx-auto space-y-1">
          {messages.length === 0 && (
            <div className="text-center py-20">
              <div className="w-24 h-24 mx-auto mb-6 bg-white dark:bg-slate-800 rounded-3xl flex items-center justify-center shadow-xl">
                <MessageCircle className="w-12 h-12 text-slate-300 dark:text-slate-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                No messages yet
              </h3>
              <p className="text-slate-500 max-w-md mx-auto leading-relaxed">
                Start the conversation by sending a message below!
              </p>
            </div>
          )}

          {Object.entries(groupedMessages).map(([date, dateMessages]) => (
            <div key={date}>
              <DateSeparator date={dateMessages[0].createdAt} />
              <div className="space-y-4 pt-2">
                {dateMessages.map((m, i) => {
                  const me = m.sender._id === authUser._id;
                  return (
                    <MessageBubble
                      key={i}
                      message={m}
                      isMe={me}
                      authUser={authUser}
                    />
                  );
                })}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Image Preview Modal */}
      {showImagePreview && selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => {
              setShowImagePreview(false);
              setSelectedImage(null);
            }}
          />
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-6 animate-scale-in">
            <button
              onClick={() => {
                setShowImagePreview(false);
                setSelectedImage(null);
              }}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center">
                <Image className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Send Photo</h3>
              <p className="text-sm text-slate-500">Preview before sending</p>
            </div>

            <div className="mb-6 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800">
              <img
                src={URL.createObjectURL(selectedImage)}
                alt="Preview"
                className="w-full max-h-[300px] object-contain"
              />
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowImagePreview(false);
                  setSelectedImage(null);
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleImageSend}
                className="flex-1 bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600"
              >
                <Send className="w-4 h-4 mr-2" />
                Send Photo
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Block Confirmation Modal */}
      {showBlockConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setShowBlockConfirm(false)}
          />
          <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-6 animate-scale-in">
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Block User?</h3>
              <p className="text-sm text-slate-500">
                Are you sure you want to block{" "}
                <span className="font-semibold text-slate-700 dark:text-slate-300">{otherUser?.fullName}</span>?
              </p>
              <p className="text-xs text-slate-400 mt-2">
                They won&#39;t be able to message you anymore.
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowBlockConfirm(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleBlockUser}
                className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
              >
                <Ban className="w-4 h-4 mr-2" />
                Block
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 px-4 py-4 shadow-lg">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-end gap-3">
            <div className="flex items-center gap-1">
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageSelect}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-primary-500 transition-colors flex-shrink-0"
                title="Send Photo"
              >
                <Image className="w-5 h-5" />
              </button>
              <button className="p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-primary-500 transition-colors flex-shrink-0">
                <Paperclip className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 relative">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Type a message..."
                rows={1}
                className="w-full px-5 py-3.5 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all resize-none"
                style={{ minHeight: "48px", maxHeight: "120px" }}
              />
            </div>
            <Button
              onClick={handleSend}
              disabled={!text.trim()}
              className="px-5 py-3.5 shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 transition-shadow flex-shrink-0"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
