import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { axiosInstance } from "../lib/axios";
import { userAuthStore } from "../store/useAuthStore";
import { socket } from "../lib/socket";
import Navbar from "../components/Navbar";

const PrivateChatPage = () => {
  const { userId } = useParams();
  const { authUser } = userAuthStore();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const bottomRef = useRef(null);

  /* ================= LOAD OLD MESSAGES ================= */
  useEffect(() => {
    axiosInstance
      .get(`/chats/messages/${userId}`)
      .then((res) => setMessages(res.data.messages))
      .catch(() => console.error("Failed to load messages"));
  }, [userId]);

  /* ================= SOCKET LISTENER ================= */
  useEffect(() => {
    const handleReceiveMessage = (message) => {
      // ignore messages sent by self (safety)
      if (message.sender === authUser._id) return;

      setMessages((prev) => [...prev, message]);
    };

    socket.on("receiveMessage", handleReceiveMessage);

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, [authUser._id]);

  /* ================= AUTO SCROLL ================= */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ================= SEND MESSAGE ================= */
  const sendMessage = async () => {
    if (!text.trim()) return;

    // optimistic UI (sender only)
    const tempMessage = {
      _id: Date.now(),
      sender: authUser._id,
      receiver: userId,
      content: text,
      createdAt: new Date(),
    };

    setMessages((prev) => [...prev, tempMessage]);
    setText("");

    try {
      await axiosInstance.post(`/chats/messages/${userId}`, {
        content: text,
      });
    } catch (err) {
      console.error("Failed to send message", err);
    }
  };

  return (
    <>
      <Navbar />

      {/* Page */}
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
        {/* Chat area */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-2xl mx-auto space-y-2">
            {messages.map((m) => {
              const isMe = m.sender === authUser._id;

              return (
                <div
                  key={m._id}
                  className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`px-4 py-2 rounded-2xl max-w-xs break-words shadow
                      ${
                        isMe
                          ? "bg-emerald-600 text-white rounded-br-sm"
                          : "bg-white text-gray-800 rounded-bl-sm"
                      }`}
                  >
                    {m.content}
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>
        </div>

        {/* Input bar */}
        <div className="bg-white border-t p-4">
          <div className="max-w-2xl mx-auto flex gap-2">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 rounded-full border
                         focus:outline-none focus:ring-2 focus:ring-emerald-400"
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button
              onClick={sendMessage}
              className="bg-emerald-600 hover:bg-emerald-700
                         text-white px-6 rounded-full transition"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default PrivateChatPage;
