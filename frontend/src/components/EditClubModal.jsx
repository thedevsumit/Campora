import React, { useState } from 'react';
import { useClubStore } from '../store/useClubStore';

const EditClubModal = ({ show, onClose, clubData, onSave }) => {
  const { updateClub } = useClubStore();
  const [editFormData, setEditFormData] = useState({
    clubName: clubData?.clubName || '',
    description: clubData?.description || ''
  });
  const [editIcon, setEditIcon] = useState(null);
  const [editIconPreview, setEditIconPreview] = useState(clubData?.icon || null);

  const handleEditChange = (e) => {
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value
    });
  };

  const handleEditIconChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditIcon(file);
      const reader = new FileReader();
      reader.onload = () => {
        setEditIconPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveEdit = async () => {
    try {
      const submitData = new FormData();
      submitData.append('clubName', editFormData.clubName);
      submitData.append('description', editFormData.description);
      
      if (editIcon) {
        submitData.append('clubIcon', editIcon);
      }

      // API call here
      // const response = await fetch('YOUR_API_ENDPOINT/api/clubs/update', {...});
      
      updateClub(clubData._id, submitData);
        
      
      if (onSave) {
        onSave({
          ...editFormData,
          icon: editIconPreview
        });
      }
      
      onClose();
      // alert('Club updated successfully!');
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
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Club</h2>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-4">
            {/* Club Icon */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Club Icon
              </label>
              <div className="flex items-center space-x-4">
                <div className="w-24 h-24 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center overflow-hidden bg-gray-50 dark:bg-gray-700">
                  {editIconPreview ? (
                    <img src={editIconPreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  )}
                </div>
                <div>
                  <label className="cursor-pointer bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg transition-colors inline-block text-sm font-medium">
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
            </div>

            {/* Club Name */}
            <div>
              <label htmlFor="editClubName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Club Name
              </label>
              <input
                type="text"
                id="editClubName"
                name="clubName"
                value={editFormData.clubName}
                onChange={handleEditChange}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="editDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                id="editDescription"
                name="description"
                value={editFormData.description}
                onChange={handleEditChange}
                rows={5}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
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
                className="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-semibold py-3 rounded-lg transition-colors"
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