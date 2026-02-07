import React, { useState, useEffect } from "react";
import { useClubStore } from "../store/useClubStore";

export default function EditClubModal({ show, onClose, clubData, clubId, onUpdated }) {
  const { updateClub, isUpdatingClub } = useClubStore();

  const [form, setForm] = useState({
    clubName: "",
    description: "",
    clubIcon: null,
  });

  useEffect(() => {
    if (!clubData) return;

    setForm({
      clubName: clubData.clubName || "",
      description: clubData.description || "",
      clubIcon: null,
    });
  }, [clubData]);

  if (!show) return null;

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files) {
      setForm((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("clubName", form.clubName);
    data.append("description", form.description);

    if (form.clubIcon) data.append("clubIcon", form.clubIcon);

    await updateClub(clubId, data);
    if (onUpdated) await onUpdated();  
    
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Edit Club</h2>
          <p className="text-sm text-gray-500">Update your club details</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Club Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Club Name
            </label>
            <input
              type="text"
              name="clubName"
              value={form.clubName}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-600 outline-none"
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
              value={form.description}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-600 outline-none"
            />
          </div>

          {/* Club Icon */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Club Icon
            </label>
            <input
              type="file"
              name="clubIcon"
              accept="image/*"
              onChange={handleChange}
              className="w-full"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isUpdatingClub}
              className="px-5 py-2 rounded-lg bg-green-700 text-white font-semibold hover:bg-green-800 disabled:opacity-50"
            >
              {isUpdatingClub ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
