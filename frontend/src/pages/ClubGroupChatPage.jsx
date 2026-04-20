import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useClubChatStore } from "../store/useClubChatStore";
import { getImageUrl } from "../lib/utils";
import { userAuthStore } from "../store/useAuthStore";
import Button from "../components/ui/Button";
import Loader from "../components/ui/Loader";
import { Send, ArrowLeft, MessageCircle, Sparkles } from "lucide-react";

const formatTime = (d) =>
  new Date(d).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const Avatar = ({ src, name }) =>
  src ? (
    <img src={getImageUrl(src)} className="w-10 h-10 rounded-xl object-cover" alt={name} />
  ) : (
    <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 text-white rounded-xl flex items-center justify-center text-sm font-bold">
      {name?.[0]}
    </div>
  );

const ClubGroupChatPage = () => {
  const { clubId } = useParams();
  const navigate = useNavigate();
  const bottomRef = useRef();
  const [text, setText] = useState("");

  const { authUser } = userAuthStore();

  const {
    messages,
    loading,
    setActiveClub,
    fetchMessages,
    sendMessage,
    listenToClubMessages,
    clearClubChat,
  } = useClubChatStore();

  useEffect(() => {
    setActiveClub(clubId);
    fetchMessages(clubId);
    listenToClubMessages();
    return () => clearClubChat();
  }, [clubId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!text.trim()) return;
    sendMessage(text);
    setText("");
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <Loader
          variant="page"
          text="Loading club chat..."
          className="!relative !bg-slate-50 dark:!bg-slate-950 !min-h-[calc(100vh-64px)]"
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      <Navbar />

      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 px-4 py-4 flex items-center gap-4 sticky top-16 z-30">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
        </button>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl">
            <MessageCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 dark:text-white">Club Group Chat</h1>
            <p className="text-xs text-slate-500">Chat with club members</p>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto mb-6 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
                <MessageCircle className="w-10 h-10 text-slate-300 dark:text-slate-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No messages yet</h3>
              <p className="text-slate-500">Start the conversation!</p>
            </div>
          )}

          {messages.map((m) => {
            const me = m.sender._id === authUser._id;
            return (
              <div
                key={m._id}
                className={`flex gap-3 ${me ? "justify-end" : "justify-start"} animate-fade-in`}
              >
                {!me && (
                  <Avatar src={m.sender.profilePic} name={m.sender.fullName} />
                )}

                <div className={`flex flex-col ${me ? "items-end" : "items-start"} max-w-[70%]`}>
                  {!me && (
                    <span className="text-xs text-slate-500 mb-1 ml-1 font-medium">
                      {m.sender.fullName}
                    </span>
                  )}
                  <div
                    className={`px-5 py-3 rounded-2xl shadow-sm ${
                      me
                        ? "bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-br-sm"
                        : "bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-100 dark:border-slate-700 rounded-bl-sm"
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{m.content}</p>
                  </div>
                  <span className="mt-1 text-[11px] text-slate-400 mx-1">
                    {formatTime(m.createdAt)}
                  </span>
                </div>

                {me && (
                  <Avatar src={authUser.profilePic} name={authUser.fullName} />
                )}
              </div>
            );
          })}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input */}
      <div className="bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 px-4 py-4">
        <div className="max-w-3xl mx-auto flex gap-3">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Message the club..."
            className="flex-1 px-5 py-3.5 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all"
          />
          <Button
            onClick={handleSend}
            disabled={!text.trim()}
            className="px-6 shadow-lg shadow-primary-500/30"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ClubGroupChatPage;
