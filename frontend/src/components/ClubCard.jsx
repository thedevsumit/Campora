import React, { useState } from 'react';
import EditClubModal from './EditClubModal';

const ClubCard = ({ club, onClick }) => {
  const [showEditModal, setShowEditModal] = useState(false);

  const handleEditClick = (e) => {
    e.stopPropagation(); // Prevent card click when clicking edit
    setShowEditModal(true);
  };

  const handleSaveEdit = (updatedData) => {
    // You can add a callback here to update the club data in parent component
    console.log('Updated club data:', updatedData);
  };

  return (
    <>
      <div
        onClick={onClick}
        className="bg-white dark:bg-gray-800 rounded-xl p-5 cursor-pointer hover:shadow-lg transition-all duration-200 border border-gray-200 dark:border-gray-700 group relative overflow-hidden"
      >
        {/* Hover Gradient Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-50 to-transparent dark:from-green-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
        
        <div className="relative flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1">
            <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0 ring-2 ring-gray-200 dark:ring-gray-600 group-hover:ring-green-500 transition-all duration-200">
              <img
                src={club.clubIcon || "/placeholder.png"}
                alt={club.clubName}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1 truncate group-hover:text-green-700 dark:group-hover:text-green-500 transition-colors">
                {club.clubName}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                {club.description}
              </p>
            </div>
          </div>

          {/* Edit Button */}
          <button
            onClick={handleEditClick}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-green-100 dark:hover:bg-green-900/30 text-gray-600 dark:text-gray-400 hover:text-green-700 dark:hover:text-green-500 transition-all duration-200 opacity-0 group-hover:opacity-100"
            title="Edit Club"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
        </div>

        {/* Arrow Icon */}
        <div className="absolute right-5 top-1/2 transform -translate-y-1/2 text-green-700 dark:text-green-500 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-2 group-hover:translate-x-0">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>

      {/* Edit Modal Component */}
      <EditClubModal 
        show={showEditModal}
        onClose={() => setShowEditModal(false)}
        clubData={club}
        onSave={handleSaveEdit}
      />
    </>
  );
};

export default ClubCard;