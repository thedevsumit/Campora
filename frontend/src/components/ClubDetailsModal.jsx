import { userAuthStore } from "../store/useAuthStore";
import { useClubStore } from "../store/useClubStore";

const ClubDetailsModal = ({ club, onClose }) => {
  const { authUser } = userAuthStore();
  const { deleteClub } = useClubStore();

  const isOwner = authUser?._id === club.createdBy;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-[#020617] w-full max-w-lg rounded-xl p-6 relative">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white"
        >
          ✕
        </button>

        {/* Club Info */}
        <div className="flex items-center gap-4 mb-4">
          <img
            src={club.clubIcon || "/placeholder.png"}
            className="w-20 h-20 rounded-xl object-cover"
          />
          <div>
            <h2 className="text-2xl font-bold">{club.clubName}</h2>
            <p className="text-sm text-gray-400">Club Details</p>
          </div>
        </div>

        <p className="text-gray-300 mb-6">{club.description}</p>

        {/* ACTIONS */}
        {isOwner ? (
          <div className="flex gap-3">
            <button className="flex-1 bg-blue-600 hover:bg-blue-700 py-2 rounded-lg">
              Edit Club
            </button>
            <button
              onClick={() => {
                deleteClub(club._id);
                onClose();
              }}
              className="flex-1 bg-red-600 hover:bg-red-700 py-2 rounded-lg"
            >
              Delete Club
            </button>
          </div>
        ) : (
          <div className="flex gap-3">
            <button className="flex-1 bg-green-600 hover:bg-green-700 py-2 rounded-lg">
              Join Club
            </button>
            <button className="flex-1 bg-gray-700 hover:bg-gray-600 py-2 rounded-lg">
              View Events
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClubDetailsModal;
