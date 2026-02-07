import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { axiosInstance } from "../lib/axios";
import { socket } from "../lib/socket";
import { userAuthStore } from "../store/useAuthStore";
import Navbar from "../components/Navbar";

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
    <img src={getImageUrl(src)} className="w-9 h-9 rounded-full object-cover" />
  ) : (
    <div className="w-9 h-9 bg-emerald-600 text-white rounded-full flex items-center justify-center">
      {name?.[0]}
    </div>
  );

export default function PrivateChatPage() {
  const { userId } = useParams();
  const { authUser } = userAuthStore();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const bottomRef = useRef();

  /* LOAD */
  useEffect(() => {
    axiosInstance
      .get(`/chats/messages/${userId}`)
      .then((res) => setMessages(res.data.messages));
  }, [userId]);

  /* SOCKET */
  useEffect(() => {
    socket.emit("join", authUser._id);

    const handler = (msg) => {
      if (msg.sender._id === authUser._id) return;
      setMessages((p) => (p.some((m) => m._id === msg._id) ? p : [...p, msg]));
    };

    socket.on("receiveMessage", handler);
    return () => socket.off("receiveMessage", handler);
  }, [authUser._id]);

  /* SCROLL */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* SEND */
  const send = async () => {
    if (!text.trim()) return;

    setMessages((p) => [
      ...p,
      {
        _id: Date.now(),
        sender: authUser,
        content: text,
        createdAt: new Date(),
      },
    ]);

    setText("");
    await axiosInstance.post(`/chats/messages/${userId}`, {
      content: text,
    });
  };

  return (
    <>
      <Navbar />

      <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-100 via-gray-100 to-slate-200">
        {/* CHAT AREA */}
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="max-w-2xl mx-auto space-y-3">
            {messages.map((m) => {
              const me = m.sender._id === authUser._id;

              return (
                <div
                  key={m._id}
                  className={`flex items-end gap-2 ${
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
                    className={`px-4 py-2 rounded-2xl max-w-xs shadow-sm ${
                      me
                        ? "bg-emerald-600 text-white rounded-br-sm"
                        : "bg-gray-200 text-gray-900 border border-gray-300 rounded-bl-sm"
                    }`}
                  >
                    <p className="leading-snug">{m.content}</p>
                    <span className="block text-[11px] mt-1 opacity-60 text-right">
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

        {/* INPUT BAR */}
        <div className=" border-t px-4 py-2">
          <div className="max-w-2xl mx-auto flex items-center gap-2">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="flex-1 h-10 px-4 rounded-full border border-gray-300
                       focus:outline-none focus:ring-2 focus:ring-emerald-400 text-black"
              placeholder="Type a message…"
              onKeyDown={(e) => e.key === "Enter" && send()}
            />
            <button
              onClick={send}
              className="h-10 px-5 rounded-full bg-emerald-600
                       text-white hover:bg-emerald-700 transition"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </>
  );

}
