import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useClubStore } from "../store/useClubStore";
import { userAuthStore } from "../store/useAuthStore";
import Navbar from "./Navbar";

const ClubDetailsPage = () => {
  const { clubId } = useParams();
  const navigate = useNavigate(); // ✅ ADDED
  const { authUser } = userAuthStore();

  const {
    selectedClub,
    getClubById,
    joinClub,
    followClub,
    leaveClub,
    unfollowClub,
    isFetchingClub,
  } = useClubStore();

  useEffect(() => {
    getClubById(clubId);
  }, [clubId, getClubById]);

  if (isFetchingClub || !selectedClub) {
    return (
      <>
        <Navbar />
        <p className="p-8 text-gray-700">Loading club details...</p>
      </>
    );
  }

  // OWNER CHECK
  const isOwner =
    selectedClub.createdBy?._id === authUser._id ||
    selectedClub.createdBy === authUser._id;

  const isMember = selectedClub.members?.some(
    (m) => m.user?._id === authUser._id,
  );

  const isFollower = selectedClub.followers?.some(
    (u) => u?._id === authUser._id,
  );

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-100 p-8 text-gray-900">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow p-8">
          {/* ================= HEADER ================= */}
          <div className="flex items-center gap-6 mb-6">
            <img
              src={
                selectedClub.clubIcon
                  ? `http://localhost:5000${selectedClub.clubIcon}`
                  : "/placeholder.png"
              }
              className="w-24 h-24 rounded-xl object-cover border"
              alt="Club"
            />

            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {selectedClub.clubName}
              </h1>
              <p className="text-gray-700 mt-2">{selectedClub.description}</p>
            </div>
          </div>

          {/* ================= STATS ================= */}
          <div className="flex gap-10 mb-8">
            <div>
              <p className="text-sm text-gray-500">Members</p>
              <p className="text-xl font-semibold text-gray-900">
                {selectedClub.members?.length || 0}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Followers</p>
              <p className="text-xl font-semibold text-gray-900">
                {selectedClub.followers?.length || 0}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mb-10">
            {!isMember && (
              <button
                onClick={() => joinClub(selectedClub._id, authUser)}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium"
              >
                Join Club
              </button>
            )}
            {isMember && (
              <button
                onClick={() => navigate(`/clubs/${selectedClub._id}/chat`)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-medium"
              >
                Open Group Chat
              </button>
            )}
  
            {!isMember &&
              (isFollower ? (
                <button
                  onClick={() => unfollowClub(selectedClub._id, authUser)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg font-medium"
                >
                  Unfollow
                </button>
              ) : (
                <button
                  onClick={() => followClub(selectedClub._id, authUser)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg font-medium"
                >
                  Follow
                </button>
              ))}

            {isMember && !isOwner && (
              <button
                onClick={() => leaveClub(selectedClub._id, authUser)}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-medium"
              >
                Leave Club
              </button>
            )}

            {isMember && isOwner && (
              <span className="bg-blue-100 text-blue-700 px-6 py-2 rounded-lg font-medium">
                You are the Owner
              </span>
            )}
          </div>

          <div className="mb-12">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Members ({selectedClub.members?.length || 0})
            </h2>

            {selectedClub.members?.length === 0 ? (
              <p className="text-gray-600">No members yet.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {selectedClub.members.map((m) => (
                  <div
                    key={m.user?._id}
                    onClick={() => navigate(`/profile/${m.user?._id}`)} // ✅ CLICK
                    className="cursor-pointer flex items-center gap-4 bg-gray-50 border border-gray-200 p-4 rounded-lg hover:bg-gray-100 transition"
                  >
                    <div className="w-13 h-13  rounded-full overflow-hidden bg-green-700 flex items-center justify-center text-white font-semibold">
                      {m.user.profilePic ? (
                        <img
                          src={`http://localhost:5000${m.user.profilePic}`}
                          alt={m.user.fullName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span>{m.user.fullName?.[0]}</span>
                      )}
                    </div>

                    <div>
                      <p className="font-semibold text-gray-900">
                        {m.user?.fullName}
                      </p>
                      <p className="text-sm text-gray-600">{m.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Followers ({selectedClub.followers?.length || 0})
            </h2>

            {selectedClub.followers?.length === 0 ? (
              <p className="text-gray-600">No followers yet.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {selectedClub.followers.map((user) => (
                  <div
                    key={user?._id}
                    onClick={() => navigate(`/profile/${user?._id}`)} // ✅ CLICK
                    className="cursor-pointer flex items-center gap-4 bg-gray-50 border border-gray-200 p-4 rounded-lg hover:bg-gray-100 transition"
                  >
                    <div className="w-13 h-13  rounded-full overflow-hidden bg-green-700 flex items-center justify-center text-white font-semibold">
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
                      <p className="font-semibold text-gray-900">
                        {user?.fullName}
                      </p>
                      <p className="text-sm text-gray-600">Follower</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ClubDetailsPage;
