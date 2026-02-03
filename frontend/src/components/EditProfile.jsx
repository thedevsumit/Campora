import { useState } from "react";
import { userAuthStore } from "../store/useAuthStore";

const EditProfileModal = ({ show, onClose }) => {
  const { authUser, updateProfile } = userAuthStore();

  const [form, setForm] = useState({
    fullName: authUser?.fullName || "",
    dept: authUser?.dept || "",
    about: authUser?.about || "",
  });

  const [profilePic, setProfilePic] = useState(null);
  const [preview, setPreview] = useState(authUser?.profilePic || null);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setProfilePic(file);
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    await updateProfile({ ...form, profilePic });
    onClose();
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-md p-6">
        <h2 className="text-2xl text-gray-700 font-bold mb-4">Edit Profile</h2>

        {/* Avatar */}
        <div className="flex items-center gap-4 mb-4">
          <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100">
            <img
              src={
                preview
                  ? preview.startsWith("data")
                    ? preview
                    : `http://localhost:5000${preview}`
                  : "/placeholder.png"
              }
              className="w-full h-full object-cover"
            />
          </div>

          <label className="cursor-pointer text-green-700 font-medium">
            Change Photo
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
        </div>

        {/* Inputs */}
        <div className="space-y-3">
          <input
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            placeholder="Full Name"
            className="w-full border text-gray-700 rounded-lg px-4 py-2"
          />
          <input
            name="dept"
            value={form.dept}
            onChange={handleChange}
            placeholder="Department"
            className="w-full border text-gray-700 rounded-lg px-4 py-2"
          />
          <textarea
            name="about"
            value={form.about}
            onChange={handleChange}
            placeholder="about"
            rows={3}
            className="w-full border text-gray-700 rounded-lg px-4 py-2"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={handleSave}
            className="flex-1 bg-green-700 text-white py-2 rounded-lg"
          >
            Save
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-600 py-2 rounded-lg"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;
