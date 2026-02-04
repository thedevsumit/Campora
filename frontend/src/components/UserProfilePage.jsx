import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "./Navbar";
import { axiosInstance } from "../lib/axios";

const UserProfilePage = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axiosInstance
      .get(`/users/${userId}/profile`)
      .then((res) => setUser(res.data.user))
      .catch(() => console.error("Failed to load profile"));
  }, [userId]);

  const sendChatRequest = async () => {
    try {
      setLoading(true);
      await axiosInstance.post(`/chat/request/${user._id}`);
      setShowPopup(false);
      alert("Chat request sent!");
    } catch (err) {
      console.error(err);
      alert("Failed to send request");
    } finally {
      setLoading(false);
    }
  };

  if (!user)
    return (
      <>
        <Navbar />
        <p className="p-8 text-gray-700">Loading profile...</p>
      </>
    );

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-100 p-8 text-gray-900">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* ================= HEADER ================= */}
          <div className="bg-white p-6 rounded-xl shadow flex items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-green-600 text-white flex items-center justify-center text-3xl font-bold overflow-hidden">
                {user.profilePic ? (
                  <img
                    src={`http://localhost:5000${user.profilePic}`}
                    alt={user.fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>{user.fullName?.[0]}</span>
                )}
              </div>

              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {user.fullName}
                </h1>
                <p className="text-gray-700">{user.email}</p>
                <p className="text-gray-600">{user.dept}</p>
              </div>
            </div>

            <button
              onClick={() => setShowPopup(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg transition"
            >
              Message
            </button>
          </div>

          {/* ================= STATS ================= */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <StatCard label="Clubs Joined" value={user.joinedClubs.length} />
            <StatCard
              label="Clubs Followed"
              value={user.followedClubs.length}
            />
            <StatCard label="Events Attended" value={0} />
          </div>

          {/* ================= CLUB SECTIONS ================= */}
          <ClubSection title="My Clubs" clubs={user.joinedClubs} />
          <ClubSection title="Followed Clubs" clubs={user.followedClubs} />
        </div>
      </div>

      {/* ================= MESSAGE POPUP ================= */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-bold text-gray-900">Start Chat?</h3>
            <p className="text-gray-600 mt-2">
              Send a chat request to{" "}
              <span className="font-semibold">{user.fullName}</span>.
            </p>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowPopup(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={sendChatRequest}
                disabled={loading}
                className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-60"
              >
                {loading ? "Sending..." : "Send Request"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const StatCard = ({ label, value }) => (
  <div className="bg-white p-6 rounded-xl shadow text-center">
    <p className="text-3xl font-bold text-green-600">{value}</p>
    <p className="text-gray-700 mt-1">{label}</p>
  </div>
);

const ClubSection = ({ title, clubs }) => (
  <div className="bg-white p-6 rounded-xl shadow">
    <h2 className="text-xl font-bold text-gray-900 mb-4">{title}</h2>

    {clubs.length === 0 ? (
      <p className="text-gray-600">None yet</p>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {clubs.map((club) => (
          <div
            key={club._id}
            className="flex items-center gap-4 border border-gray-200 p-4 rounded-lg hover:bg-gray-50 transition"
          >
            <img
              src={
                club.clubIcon
                  ? `http://localhost:5000${club.clubIcon}`
                  : "/placeholder.png"
              }
              className="w-12 h-12 rounded-lg object-cover"
              alt="Club"
            />

            <div className="min-w-0">
              <p className="font-semibold text-gray-900 truncate">
                {club.clubName}
              </p>
              <p className="text-sm text-gray-600 line-clamp-2">
                {club.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

export default UserProfilePage;
