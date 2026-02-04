import React, { useEffect } from "react";
import { useChatRequestStore } from "../store/useChatRequestStore";
import { useNavigate } from "react-router-dom";

const ChatRequestsPanel = () => {
  const { requests, fetchRequests, acceptRequest, rejectRequest, isLoading } =
    useChatRequestStore();

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const navigate = useNavigate();

  const handleAccept = async (request) => {
    await acceptRequest(request._id);
    navigate(`/chats/${request.sender._id}`);
  };

  return (
    <div className="bg-white rounded-xl shadow p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Chat Requests</h2>

      {isLoading && <p className="text-gray-600">Loading requests...</p>}

      {!isLoading && requests.length === 0 && (
        <p className="text-gray-600">No pending requests</p>
      )}

      <div className="space-y-4">
        {requests.map((req) => (
          <div
            key={req._id}
            className="flex items-center justify-between border border-gray-200 p-4 rounded-lg"
          >
            {/* USER INFO */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center font-semibold overflow-hidden">
                {req.sender.profilePic ? (
                  <img
                    src={`http://localhost:5000${req.sender.profilePic}`}
                    alt={req.sender.fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  req.sender.fullName[0]
                )}
              </div>

              <div>
                <p className="font-semibold text-gray-900">
                  {req.sender.fullName}
                </p>
                <p className="text-sm text-gray-600">wants to chat</p>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="flex gap-2">
              <button
                onClick={() => handleAccept(req)}
                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-sm"
              >
                Accept
              </button>
              <button
                onClick={() => rejectRequest(req._id)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded-md text-sm"
              >
                Decline
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatRequestsPanel;
