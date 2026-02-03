import { userAuthStore } from "../store/useAuthStore";
import { useClubStore } from "../store/useClubStore";

const ClubDetailsModal = ({ club, onClose }) => {
  const { authUser } = userAuthStore();
  const { deleteClub } = useClubStore();

  const isOwner = authUser?._id === club.createdBy;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-lg rounded-xl p-6 relative shadow-xl border border-gray-200">
        
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
        >
          ✕
        </button>

        {/* Club Info */}
        <div className="flex items-center gap-4 mb-4">
          <img
            src={club.clubIcon || "/placeholder.png"}
            alt="Club Icon"
            className="w-20 h-20 rounded-xl object-cover border border-gray-300"
          />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {club.clubName}
            </h2>
            <p className="text-sm text-gray-500">
              Club Details
            </p>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-700 mb-6">
          {club.description}
        </p>

        {/* ACTIONS */}
        {isOwner ? (
          <div className="flex gap-3">
            <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition-colors">
              Edit Club
            </button>
            <button
              onClick={() => {
                deleteClub(club._id);
                onClose();
              }}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-medium transition-colors"
            >
              Delete Club
            </button>
          </div>
        ) : (
          <div className="flex gap-3">
            <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium transition-colors">
              Join Club
            </button>
            <button className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded-lg font-medium transition-colors">
              View Events
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClubDetailsModal;
