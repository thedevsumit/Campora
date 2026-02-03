import React, { useState } from "react";

const ClubCard = ({ club, onClick }) => {
  const [showEditModal, setShowEditModal] = useState(false);

  const handleEditClick = (e) => {
    e.stopPropagation(); // prevents card click
    setShowEditModal(true);
  };

  const handleSaveEdit = (updatedData) => {
    console.log("Updated club data:", updatedData);
    setShowEditModal(false);
  };

  return (
    <>
      <div
        onClick={onClick}
        className="
          bg-white rounded-xl p-5 cursor-pointer
          border border-gray-200
          hover:shadow-lg transition-all duration-200
          group relative overflow-hidden
        "
      >
        {/* Hover Gradient */}
        <div
          className="
            absolute inset-0
            bg-gradient-to-r from-green-50 to-transparent
            opacity-0 group-hover:opacity-100
            transition-opacity duration-200
            pointer-events-none
          "
        />

        <div className="relative flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1">
            {/* Club Image */}
            <div
              className="
                w-16 h-16 rounded-lg overflow-hidden
                bg-gray-100 flex-shrink-0
                ring-2 ring-gray-200
                group-hover:ring-green-500 transition-all
              "
            >
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

            {/* Text */}
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-bold text-gray-900 mb-1 truncate group-hover:text-green-700 transition-colors">
                {club.clubName}
              </h2>
              <p className="text-sm text-gray-600 line-clamp-2">
                {club.description}
              </p>
            </div>
          </div>

          {/* Edit Button */}
          <button
            onClick={handleEditClick}
            className="
              p-2 rounded-lg
              bg-gray-100 hover:bg-green-100
              text-gray-600 hover:text-green-700
              transition-all duration-200
              opacity-0 group-hover:opacity-100
              z-10
            "
            title="Edit Club"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>
        </div>

        {/* Arrow */}
        <div
          className="
            absolute right-5 top-1/2 -translate-y-1/2
            text-green-700
            opacity-0 group-hover:opacity-100
            translate-x-2 group-hover:translate-x-0
            transition-all duration-200
            pointer-events-none
          "
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>
    </>
  );
};

export default ClubCard;
