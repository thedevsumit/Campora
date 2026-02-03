import React, { useState } from 'react';
import { useClubStore } from '../store/useClubStore';

export default function CreateClubPage() {
  const [formData, setFormData] = useState({
    clubName: '',
    description: '',
  });

  const [clubIcon, setClubIcon] = useState(null);
  const [iconPreview, setIconPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createClub } = useClubStore();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleIconChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setClubIcon(file);

    const reader = new FileReader();
    reader.onload = () => {
      setIconPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!formData.clubName.trim() || !formData.description.trim()) {
      alert('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);

    try {
      createClub({
        clubName: formData.clubName,
        description: formData.description,
        clubIcon: clubIcon,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg border border-gray-200">

        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Create New Club
        </h1>

        <p className="text-gray-600 mb-6">
          Fill in the details to register your club
        </p>

        <div className="space-y-5">

          {/* Club Icon */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Club Icon
            </label>

            <div className="flex items-center space-x-4">
              <div className="
                w-24 h-24 flex items-center justify-center
                border-2 border-dashed border-gray-400
                bg-gray-50 rounded-lg overflow-hidden
              ">
                {iconPreview ? (
                  <img
                    src={iconPreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-400 text-sm text-center">
                    No Image
                  </span>
                )}
              </div>

              <label className="cursor-pointer bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg text-sm font-medium">
                Choose Icon
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleIconChange}
                  className="hidden"
                />
              </label>
            </div>

            <p className="text-xs text-gray-500 mt-1">
              PNG or JPG up to 5MB
            </p>
          </div>

          {/* Club Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Club Name
            </label>
            <input
              type="text"
              name="clubName"
              value={formData.clubName}
              onChange={handleChange}
              className="
                w-full px-4 py-2 rounded-lg
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
              value={formData.description}
              onChange={handleChange}
              className="
                w-full px-4 py-2 rounded-lg
                border border-gray-300
                bg-white text-gray-900
                focus:outline-none focus:ring-2 focus:ring-green-500
              "
            />
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="
              w-full bg-green-700 hover:bg-green-800
              text-white font-medium py-3 rounded-lg
              transition-colors disabled:bg-gray-400
            "
          >
            {isSubmitting ? 'Creating Club...' : 'Create Club'}
          </button>

          {/* Cancel */}
          <div className="text-center">
            <a href="/clubs" className="text-sm text-gray-600 hover:text-green-700">
              Cancel and go back
            </a>
          </div>

        </div>
      </div>
    </div>
  );
}
//working