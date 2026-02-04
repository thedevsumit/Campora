import { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const ChatInboxPage = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance
      .get("/chat/conversations")
      .then((res) => {
        const uniqueUsers = Array.from(
          new Map(res.data.users.map((u) => [u._id, u])).values(),
        );
        setUsers(uniqueUsers);
      })
      .catch(() => console.error("Failed to load chats"));
  }, []);

  return (
    <>
      <Navbar />

      {/* Background */}
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 p-6">
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-indigo-600 text-white p-4">
            <h2 className="text-xl font-semibold">💬 Chats</h2>
            <p className="text-sm text-indigo-100">
              Tap a conversation to start chatting
            </p>
          </div>

          {/* Chat list */}
          {users.length === 0 && (
            <p className="p-6 text-center text-gray-500">No chats yet 🚫</p>
          )}

          <div className="divide-y">
            {users.map((user) => (
              <div
                key={user._id}
                onClick={() => navigate(`/chat/${user._id}`)}
                className="flex items-center gap-4 p-4 cursor-pointer
                           hover:bg-indigo-50 transition"
              >
                {/* Avatar */}
                <div
                  className="w-10 h-10 rounded-full bg-indigo-500
                                flex items-center justify-center
                                text-white font-semibold"
                >
                  {user.fullName?.charAt(0).toUpperCase()}
                </div>

                {/* Name */}
                <div>
                  <p className="font-medium text-gray-800">{user.fullName}</p>
                  <p className="text-sm text-gray-500">Tap to open chat</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatInboxPage;
