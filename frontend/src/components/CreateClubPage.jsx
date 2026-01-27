import React, { useState } from 'react';
import { useClubStore } from '../store/useClubStore';

export default function CreateClubPage() {
  const [formData, setFormData] = useState({
    clubName: '',
    description: ''
  });
  
  const [clubIcon, setClubIcon] = useState(null);
  const [iconPreview, setIconPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {createClub} = useClubStore();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleIconChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setClubIcon(file);
      const reader = new FileReader();
      reader.onload = () => {
        setIconPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!formData.clubName.trim() || !formData.description.trim()) {
      alert('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);

    try {
      
    
      createClub(formData);
      
    } catch (error) {
      console.error('Error creating club:', error);
      alert('An error occurred while creating the club');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900 justify-center">
      {/* Left side - Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-white dark:bg-gray-800">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">Create New Club</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">Fill in the details to register your club</p>
          
          <div className="space-y-4">
            {/* Club Icon Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Club Icon
              </label>
              <div className="flex items-center space-x-4">
                <div className="w-24 h-24 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center overflow-hidden bg-gray-50 dark:bg-gray-700">
                  {iconPreview ? (
                    <img src={iconPreview} alt="Preview" className="w-full h-full object-cover" />
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
                      onChange={handleIconChange}
                      className="hidden"
                    />
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">PNG, JPG up to 5MB</p>
                </div>
              </div>
            </div>

            {/* Club Name Input */}
            <div>
              <label htmlFor="clubName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Club Name
              </label>
              <input
                type="text"
                id="clubName"
                name="clubName"
                value={formData.clubName}
                onChange={handleChange}
                placeholder="Enter club name"
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Description Input */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your club"
                rows={5}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Create Button */}
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full bg-green-700 hover:bg-green-800 text-white font-medium py-3 rounded-lg transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Creating Club...' : 'Create Club'}
            </button>

            {/* Cancel Link */}
            <div className="text-center mt-6">
              <a href="/clubs" className="text-sm text-gray-600 dark:text-gray-400 hover:text-green-700 dark:hover:text-green-500">
                Cancel and go back
              </a>
            </div>
          </div>
        </div>
      </div>

      
    </div>
  );
}