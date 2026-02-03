import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useClubStore } from "../store/useClubStore";
import { userAuthStore } from "../store/useAuthStore";
import Navbar from "./Navbar";

const ClubDetailsPage = () => {
  const { clubId } = useParams();
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

  // ✅ OWNER CHECK (works for populated & non-populated)
  const isOwner =
    selectedClub.createdBy?._id === authUser._id ||
    selectedClub.createdBy === authUser._id;

  // ✅ SAFE MEMBER CHECK
  const isMember = selectedClub.members?.some(
    (m) => m.user?._id === authUser._id,
  );

  // ✅ SAFE FOLLOWER CHECK
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

          {/* ================= ACTION BUTTONS ================= */}
          <div className="flex flex-wrap gap-4 mb-10">
            {/* JOIN */}
            {!isMember && (
              <button
                onClick={() => joinClub(selectedClub._id, authUser)}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium"
              >
                Join Club
              </button>
            )}

            {/* FOLLOW / UNFOLLOW (only if not member) */}
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

            {/* LEAVE */}
            {isMember && !isOwner && (
              <button
                onClick={() => leaveClub(selectedClub._id, authUser)}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-medium"
              >
                Leave Club
              </button>
            )}

            {/* OWNER BADGE */}
            {isMember && isOwner && (
              <span className="bg-blue-100 text-blue-700 px-6 py-2 rounded-lg font-medium">
                You are the Owner
              </span>
            )}
          </div>

          {/* ================= MEMBERS ================= */}
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
                    className="flex items-center gap-4 bg-gray-50 border border-gray-200 p-4 rounded-lg hover:bg-gray-100 transition"
                  >
                    <img
                      src={m.user?.profilePic || "/avatar.png"}
                      className="w-10 h-10 rounded-full object-cover"
                      alt="Member"
                    />

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

          {/* ================= FOLLOWERS ================= */}
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
                    className="flex items-center gap-4 bg-gray-50 border border-gray-200 p-4 rounded-lg hover:bg-gray-100 transition"
                  >
                    <img
                      src={user?.profilePic || "/avatar.png"}
                      className="w-10 h-10 rounded-full object-cover"
                      alt="Follower"
                    />

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
