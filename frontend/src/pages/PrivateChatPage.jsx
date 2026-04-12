import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { axiosInstance } from "../lib/axios";
import { socket } from "../lib/socket";
import { userAuthStore } from "../store/useAuthStore";
import Navbar from "../components/Navbar";
import Button from "../components/ui/Button";
import { Send, ArrowLeft, MessageCircle, Circle } from "lucide-react";

const formatTime = (d) =>
  new Date(d).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const formatDate = (d) => {
  const date = new Date(d);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
  return date.toLocaleDateString([], { weekday: "long", month: "short", day: "numeric" });
};

const getImageUrl = (path) =>
  path?.startsWith("http") ? path : path ? `http://localhost:5000${path}` : null;

const Avatar = ({ src, name, size = "md" }) => {
  const sizeClasses = size === "sm" ? "w-8 h-8" : size === "lg" ? "w-14 h-14" : "w-10 h-10";
  return src ? (
    <img src={getImageUrl(src)} className={`${sizeClasses} rounded-xl object-cover`} alt={name} />
  ) : (
    <div className={`${sizeClasses} bg-gradient-to-br from-primary-500 to-secondary-500 text-white rounded-xl flex items-center justify-center text-sm font-bold`}>
      {name?.[0]}
    </div>
  );
};

const DateSeparator = ({ date }) => (
  <div className="flex items-center gap-3 py-2">
    <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
    <span className="text-xs text-slate-400 font-medium px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full">
      {formatDate(date)}
    </span>
    <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
  </div>
);

const MessageBubble = ({ message, isMe, authUser }) => {
  const tailClass = isMe ? "rounded-br-sm" : "rounded-bl-sm";
  const senderAvatar = message.sender?.profilePic;
  const senderName = message.sender?.fullName;

  return (
    <div className={`flex gap-3 ${isMe ? "justify-end" : "justify-start"} animate-fade-in`}>
      {!isMe && <Avatar src={senderAvatar} name={senderName} size="sm" />}
      <div className={`flex flex-col ${isMe ? "items-end" : "items-start"} max-w-[75%]`}>
        {!isMe && (
          <span className="text-xs text-slate-500 mb-1 ml-1 font-medium">{senderName}</span>
        )}
        <div
          className={`relative px-4 py-3 shadow-sm ${tailClass} ${
            isMe
              ? "bg-gradient-to-br from-primary-500 to-primary-600 text-white"
              : "bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-100 dark:border-slate-700"
          }`}
        >
          <p className="text-sm leading-relaxed">{message.content}</p>
          {/* Message tail */}
          <div
            className={`absolute top-0 w-3 h-3 ${isMe ? "-right-1.5" : "-left-1.5"} ${
              isMe ? "bg-primary-500" : "bg-white dark:bg-slate-800"
            }`}
            style={{
              clipPath: isMe
                ? "polygon(0 0, 0 100%, 100% 100%)"
                : "polygon(100% 0, 0 100%, 100% 100%)",
            }}
          />
        </div>
        <span className="mt-1 text-[11px] text-slate-400 mx-1 flex items-center gap-1">
          {formatTime(message.createdAt)}
          {isMe && (
            <Circle className="w-3 h-3 fill-primary-500 text-primary-500" />
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
  const [otherUser, setOtherUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [isOnline] = useState(true);
  const bottomRef = useRef();

  useEffect(() => {
    // Fetch other user info
    axiosInstance.get(`/users/${userId}`).then((res) => {
      setOtherUser(res.data.user);
    }).catch(() => {
      setOtherUser({ fullName: "User" });
    });
  }, [userId]);

  useEffect(() => {
    axiosInstance
      .get(`/chats/messages/${userId}`)
      .then((res) => setMessages(res.data.messages));
  }, [userId]);

  useEffect(() => {
    socket.emit("join", authUser._id);

    const handler = (msg) => {
      if (msg.sender._id === authUser._id) return;
      setMessages((prev) => [...prev, msg]);
    };

    socket.on("private-message", handler);
    return () => socket.off("private-message", handler);
  }, [authUser._id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!text.trim()) return;
    socket.emit("private-message", { to: userId, content: text });
    setMessages((prev) => [...prev, { content: text, sender: authUser, createdAt: new Date() }]);
    setText("");
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

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex flex-col">
      <Navbar />

      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 px-4 py-3 flex items-center gap-4 sticky top-16 z-30 shadow-sm">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
        </button>
        <div className="flex items-center gap-3 flex-1">
          <div className="relative">
            <Avatar src={otherUser?.profilePic} name={otherUser?.fullName} size="md" />
            {isOnline && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white dark:border-slate-900" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-base font-bold text-slate-900 dark:text-white truncate">{otherUser?.fullName || "User"}</h1>
            <p className="text-xs text-slate-500 flex items-center gap-1">
              {isOnline ? (
                <>
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  Online
                </>
              ) : (
                "Offline"
              )}
            </p>
          </div>
        </div>
        <div className="p-2 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl">
          <MessageCircle className="w-5 h-5 text-white" />
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-slate-100 dark:bg-slate-950">
        <div className="max-w-3xl mx-auto space-y-1">
          {messages.length === 0 && (
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto mb-6 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center shadow-lg">
                <MessageCircle className="w-10 h-10 text-slate-300 dark:text-slate-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No messages yet</h3>
              <p className="text-slate-500">Start the conversation!</p>
            </div>
          )}

          {Object.entries(groupedMessages).map(([date, dateMessages]) => (
            <div key={date}>
              <DateSeparator date={dateMessages[0].createdAt} />
              <div className="space-y-3 pt-2">
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

      {/* Input */}
      <div className="bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 px-4 py-4 shadow-lg">
        <div className="max-w-3xl mx-auto flex gap-3">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type a message..."
            className="flex-1 px-5 py-3.5 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all"
          />
          <Button
            onClick={handleSend}
            disabled={!text.trim()}
            className="px-6 shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 transition-shadow"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
