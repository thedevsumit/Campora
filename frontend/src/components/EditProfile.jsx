import { useState } from "react";
import { userAuthStore } from "../store/useAuthStore";
import Button from "./ui/Button";
import { Camera, X, Sparkles } from "lucide-react";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl animate-scale-in overflow-hidden">
        {/* Header */}
        <div className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 p-6 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-primary-200" />
            <h2 className="text-2xl font-extrabold">Edit Profile</h2>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Avatar */}
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl overflow-hidden ring-4 ring-primary-100 dark:ring-primary-900">
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
              <label className="absolute -bottom-1 -right-1 p-2 bg-primary-500 hover:bg-primary-600 text-white rounded-full cursor-pointer shadow-lg transition-colors">
                <Camera className="w-4 h-4" />
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </label>
            </div>
            <div>
              <p className="font-semibold text-slate-900 dark:text-white">{form.fullName}</p>
              <p className="text-sm text-slate-500">Tap to change photo</p>
            </div>
          </div>

          {/* Inputs */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Full Name</label>
              <input
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                placeholder="Full Name"
                className="w-full px-4 py-3.5 border-2 border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Department</label>
              <input
                name="dept"
                value={form.dept}
                onChange={handleChange}
                placeholder="Department"
                className="w-full px-4 py-3.5 border-2 border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">About</label>
              <textarea
                name="about"
                value={form.about}
                onChange={handleChange}
                placeholder="Tell us about yourself..."
                rows={3}
                className="w-full px-4 py-3.5 border-2 border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all resize-none"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button variant="ghost" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleSave} className="flex-1">
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;
