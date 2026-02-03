import React, { useState } from 'react';
import { useClubStore } from '../store/useClubStore';

const EditClubModal = ({ show, onClose, clubData, onSave }) => {
  const { updateClub } = useClubStore();
  const [editFormData, setEditFormData] = useState({
    clubName: clubData?.clubName || '',
    description: clubData?.description || ''
  });
  const [editIcon, setEditIcon] = useState(null);
  const [editIconPreview, setEditIconPreview] = useState(clubData?.clubIcon || null);

  const handleEditChange = (e) => {
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value
    });
  };

  const handleEditIconChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setEditIcon(file);
    const reader = new FileReader();
    reader.onload = () => setEditIconPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSaveEdit = async () => {
    try {
      const submitData = new FormData();
      submitData.append('clubName', editFormData.clubName);
      submitData.append('description', editFormData.description);

      if (editIcon) {
        submitData.append('clubIcon', editIcon);
      }

      updateClub(clubData._id, submitData);

      if (onSave) {
        onSave({
          ...editFormData,
          clubIcon: editIconPreview
        });
      }

      onClose();
    } catch (error) {
      console.error('Error updating club:', error);
      alert('Failed to update club');
    }
  };

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Edit Club
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-4">
            {/* Club Icon */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Club Icon
              </label>

              <div className="flex items-center space-x-4">
                <div className="
                  w-24 h-24 rounded-lg overflow-hidden
                  flex items-center justify-center
                  border-2 border-dashed border-gray-400
                  bg-gray-50
                ">
                  {editIconPreview ? (
                    <img
                      src={editIconPreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-400 text-sm">
                      No Image
                    </span>
                  )}
                </div>

                <label className="cursor-pointer bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium">
                  Choose Icon
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleEditIconChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Club Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Club Name
              </label>
              <input
                type="text"
                name="clubName"
                value={editFormData.clubName}
                onChange={handleEditChange}
                className="
                  w-full px-4 py-2.5 rounded-lg
                  border border-gray-300
                  bg-white text-gray-900
                  focus:outline-none focus:ring-2 focus:ring-green-500
                "
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                rows={4}
                value={editFormData.description}
                onChange={handleEditChange}
                className="
                  w-full px-4 py-2.5 rounded-lg
                  border border-gray-300
                  bg-white text-gray-900
                  focus:outline-none focus:ring-2 focus:ring-green-500
                "
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={handleSaveEdit}
                className="flex-1 bg-green-700 hover:bg-green-800 text-white font-semibold py-3 rounded-lg transition-colors"
              >
                Save Changes
              </button>
              <button
                onClick={onClose}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default EditClubModal;
