import { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const ChatRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance
      .get("/chat/requests")
      .then((res) => setRequests(res.data.requests))
      .catch(() => console.error("Failed to load requests"));
  }, []);

  const acceptRequest = async (req) => {
    await axiosInstance.post(`/chat/accept/${req._id}`);
    navigate(`/chat/${req.sender._id}`);
  };

  const rejectRequest = async (reqId) => {
    await axiosInstance.post(`/chat/reject/${reqId}`);
    setRequests((prev) => prev.filter((r) => r._id !== reqId));
  };

  return (
    <>
      <Navbar />

      {/* Background */}
      <div className="min-h-screen bg-gradient-to-br from-emerald-100 via-sky-100 to-indigo-100 p-6">
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-emerald-600 text-white p-4">
            <h2 className="text-xl font-semibold">📨 Chat Requests</h2>
            <p className="text-sm text-emerald-100">
              People who want to connect with you
            </p>
          </div>

          {/* Empty state */}
          {requests.length === 0 && (
            <p className="p-6 text-center text-gray-500">
              No pending requests ✨
            </p>
          )}

          {/* Requests */}
          <div className="divide-y">
            {requests.map((req) => (
              <div
                key={req._id}
                className="flex items-center justify-between p-4 hover:bg-emerald-50 transition"
              >
                {/* User */}
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full bg-emerald-500
                                  flex items-center justify-center
                                  text-white font-semibold"
                  >
                    {req.sender.fullName?.charAt(0).toUpperCase()}
                  </div>

                  <p className="font-medium text-gray-800">
                    {req.sender.fullName}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => acceptRequest(req)}
                    className="bg-emerald-600 hover:bg-emerald-700
                               text-white px-3 py-1 rounded-lg text-sm transition"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => rejectRequest(req._id)}
                    className="bg-red-100 hover:bg-red-200
                               text-red-700 px-3 py-1 rounded-lg text-sm transition"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatRequestsPage;
