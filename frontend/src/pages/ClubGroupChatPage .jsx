import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useClubChatStore } from "../store/useClubChatStore";
import { userAuthStore } from "../store/useAuthStore";

/* HELPERS */
const formatTime = (d) =>
  new Date(d).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

const getImageUrl = (path) =>
  path?.startsWith("http")
    ? path
    : path
      ? `http://localhost:5000${path}`
      : null;

const Avatar = ({ src, name }) =>
  src ? (
    <img src={getImageUrl(src)} className="w-8 h-8 rounded-full object-cover" />
  ) : (
    <div className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
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
    setActiveClub,
    fetchMessages,
    sendMessage,
    listenToClubMessages,
    clearClubChat,
  } = useClubChatStore();

  /* INIT */
  useEffect(() => {
    setActiveClub(clubId);
    fetchMessages(clubId);
    listenToClubMessages();

    return () => clearClubChat();
  }, [clubId]);

  /* SCROLL */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* SEND */
  const handleSend = () => {
    if (!text.trim()) return;
    sendMessage(text);
    setText("");
  };

  return (
    <>
      <Navbar />

      <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-100 via-gray-100 to-slate-200">
        {/* HEADER */}
        <div className="bg-white border-b px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            ← Back
          </button>

          <h1 className="text-lg font-semibold text-gray-900">
            Club Group Chat
          </h1>
        </div>

        {/* CHAT AREA */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="max-w-3xl mx-auto space-y-4">
            {messages.map((m) => {
              const me = m.sender._id === authUser._id;

              return (
                <div
                  key={m._id}
                  className={`flex gap-2 ${
                    me ? "justify-end" : "justify-start"
                  }`}
                >
                  {!me && (
                    <Avatar
                      src={m.sender.profilePic}
                      name={m.sender.fullName}
                    />
                  )}

                  <div
                    className={`flex flex-col ${
                      me ? "items-end" : "items-start"
                    }`}
                  >
                    {/* Sender name (group chat only) */}
                    {!me && (
                      <span className="text-xs text-gray-500 mb-1">
                        {m.sender.fullName}
                      </span>
                    )}

                    <div
                      className={`px-4 py-2 rounded-2xl max-w-xs shadow-sm ${
                        me
                          ? "bg-emerald-600 text-white rounded-br-sm"
                          : "bg-gray-200 text-gray-900 border border-gray-300 rounded-bl-sm"
                      }`}
                    >
                      <p>{m.content}</p>
                    </div>

                    <span className="mt-1 text-[11px] text-gray-500">
                      {formatTime(m.createdAt)}
                    </span>
                  </div>

                  {me && (
                    <Avatar
                      src={authUser.profilePic}
                      name={authUser.fullName}
                    />
                  )}
                </div>
              );
            })}

            <div ref={bottomRef} />
          </div>
        </div>

        {/* INPUT */}
        <div className="bg-white border-t px-4 py-3">
          <div className="max-w-3xl mx-auto flex gap-2">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Message the club…"
              className="flex-1 h-10 px-4 rounded-full border border-gray-300
                         focus:outline-none focus:ring-2 focus:ring-emerald-400 text-black"
            />
            <button
              onClick={handleSend}
              className="h-10 px-5 rounded-full bg-emerald-600 text-white
                         hover:bg-emerald-700 transition"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ClubGroupChatPage;
