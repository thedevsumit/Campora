import React, { useEffect } from "react";
import { useState } from "react";
import EditProfileModal from "../components/EditProfile";

import { userAuthStore } from "../store/useAuthStore";
// import Navbar from "./Navbar";
import { useClubStore } from "../store/useClubStore";
import Navbar from "./Navbar";
// import Navbar from "./Navbar";

const ProfilePage = () => {
  const { authUser, logout, updateProfile } = userAuthStore();
  const {
    joinedClubs,
    followedClubs,
    isFetchingProfileClubs,
    attendedEvents,
    getJoinedClubs,
    getFollowedClubs,
    getAttendedEvents,
  } = useClubStore();

  useEffect(() => {
    getJoinedClubs();
    getFollowedClubs();
    getAttendedEvents();
  }, []);

  const [showEditProfile, setShowEditProfile] = useState(false);

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-100 px-6 py-8">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* PROFILE HEADER */}
          <div className="bg-white rounded-xl shadow border border-gray-200 p-6 flex flex-col md:flex-row items-center gap-6">
            {/* Avatar */}
            <div className="w-28 h-28 rounded-full bg-green-700 text-white flex items-center justify-center text-4xl font-bold">
              {authUser.profilePic ? (
                <img
                  src={`http://localhost:5000${authUser.profilePic}`}
                  alt={authUser.fullName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>{authUser.fullName?.[0]}</span>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-900">
                {authUser?.fullName || "User Name"}
              </h1>
              <p className="text-gray-600">
                {authUser?.email || "user@email.com"}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Department: {authUser?.dept || "Computer Science"}
              </p>
            </div>

            {/* Edit Button */}
            <button
              onClick={() => setShowEditProfile(true)}
              className="bg-green-700 hover:bg-green-800 text-white px-6 py-2 rounded-lg font-medium transition"
            >
              Edit Profile
            </button>
          </div>

          {/* STATS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <StatCard title="Clubs Joined" value={joinedClubs?.length || 0} />
            <StatCard
              title="Clubs Followed"
              value={followedClubs?.length || 0}
            />
            <StatCard
              title="Events Attended"
              value={attendedEvents?.length || 0}
            />
          </div>

          {/* ABOUT */}
          <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-3">About</h2>
            <p className="text-gray-600 leading-relaxed">{authUser?.about}</p>
          </div>

          {/* MY CLUBS */}
          <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">My Clubs</h2>

            {isFetchingProfileClubs ? (
              <p className="text-gray-500">Loading your clubs...</p>
            ) : joinedClubs.length === 0 ? (
              <p className="text-gray-500">You haven’t joined any clubs yet.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {joinedClubs.map((club) => (
                  <div
                    key={club._id}
                    className="flex items-center gap-4 border border-gray-200 rounded-lg p-4 hover:shadow transition cursor-pointer"
                  >
                    {/* Club Icon */}
                    <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      <img
                        src={
                          club.clubIcon
                            ? `http://localhost:5000${club.clubIcon}`
                            : "/placeholder.png"
                        }
                        alt={club.clubName}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Club Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {club.clubName}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {club.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* FOLLOWED CLUBS */}
          <div className="bg-white rounded-xl shadow border border-gray-200 p-6 mt-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Followed Clubs
            </h2>

            {followedClubs.length === 0 ? (
              <p className="text-gray-500">You’re not following any clubs.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {followedClubs.map((club) => (
                  <div
                    key={club._id}
                    className="flex items-center gap-4 border border-gray-200 rounded-lg p-4 hover:shadow transition cursor-pointer"
                  >
                    {/* Club Icon */}
                    <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      <img
                        src={
                          club.clubIcon
                            ? `http://localhost:5000${club.clubIcon}`
                            : "/placeholder.png"
                        }
                        alt={club.clubName}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Club Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {club.clubName}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {club.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ACCOUNT ACTIONS */}
          <div className="bg-white rounded-xl shadow border border-gray-200 p-6 flex flex-col sm:flex-row gap-4 justify-center">
            {/* <button className="px-6 py-2 text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
              Change Password
            </button> */}
            <button
              onClick={logout}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
      <EditProfileModal
        show={showEditProfile}
        onClose={() => setShowEditProfile(false)}
      />
    </>
  );
};

export default ProfilePage;

/* ---------- Small Components ---------- */

const StatCard = ({ title, value }) => (
  <div className="bg-white rounded-xl shadow border border-gray-200 p-6 text-center">
    <p className="text-3xl font-bold text-green-700">{value}</p>
    <p className="text-sm text-gray-600 mt-1">{title}</p>
  </div>
);
