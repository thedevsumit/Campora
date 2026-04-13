import { useState } from "react";
import { getImageUrl } from "../lib/utils";
import { userAuthStore } from "../store/useAuthStore";
import Button from "./ui/Button";
import { Camera, X, Sparkles, User, Save, Image } from "lucide-react";

const EditProfileModal = ({ show, onClose }) => {
  const { authUser, updateProfile } = userAuthStore();

  const [form, setForm] = useState({
    fullName: authUser?.fullName || "",
    dept: authUser?.dept || "",
    about: authUser?.about || "",
  });

  const [profilePic, setProfilePic] = useState(null);
  const [preview, setPreview] = useState(authUser?.profilePic || null);
  const [isSaving, setIsSaving] = useState(false);

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
    setIsSaving(true);
    await updateProfile({ ...form, profilePic });
    setIsSaving(false);
    onClose();
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl animate-scale-in overflow-hidden">
        {/* Header */}
        <div className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 p-8 text-white overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-60 h-60 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary-400/20 rounded-full blur-3xl" />
          <div className="absolute top-20 left-10 w-32 h-32 border border-white/10 rounded-full" />
          <div className="absolute bottom-20 right-10 w-20 h-20 border border-white/10 rounded-full" />

          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="relative flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-xl flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold">Edit Profile</h2>
              <p className="text-primary-100 text-sm">Update your information</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6">
          {/* Avatar */}
          <div className="flex items-center gap-6">
            <div className="relative group">
              <div className="w-24 h-24 rounded-2xl overflow-hidden ring-4 ring-primary-100 dark:ring-primary-900 shadow-xl">
                <img
                  src={
                    preview
                      ? preview.startsWith("data")
                        ? preview
                        : getImageUrl(preview)
                      : "/placeholder.png"
                  }
                  className="w-full h-full object-cover"
                />
              </div>
              <label className="absolute -bottom-2 -right-2 p-3 bg-gradient-to-br from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white rounded-xl cursor-pointer shadow-lg transition-all hover:scale-110 group-hover:scale-110">
                <Camera className="w-5 h-5" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>
            <div className="flex-1">
              <p className="font-bold text-slate-900 dark:text-white text-lg">
                {form.fullName}
              </p>
              <p className="text-sm text-slate-500 flex items-center gap-1">
                <Image className="w-4 h-4" />
                Tap to change photo
              </p>
            </div>
          </div>

          {/* Inputs */}
          <div className="space-y-5">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                <User className="w-4 h-4 text-primary-500" />
                Full Name
              </label>
              <input
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="w-full px-5 py-4 border-2 border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all text-base"
              />
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                <Sparkles className="w-4 h-4 text-primary-500" />
                Department
              </label>
              <input
                name="dept"
                value={form.dept}
                onChange={handleChange}
                placeholder="Enter your department"
                className="w-full px-5 py-4 border-2 border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all text-base"
              />
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                <Sparkles className="w-4 h-4 text-primary-500" />
                About Me
              </label>
              <textarea
                name="about"
                value={form.about}
                onChange={handleChange}
                placeholder="Tell us about yourself..."
                rows={4}
                className="w-full px-5 py-4 border-2 border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all resize-none text-base"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-2">
            <Button
              variant="ghost"
              onClick={onClose}
              className="flex-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              isLoading={isSaving}
              className="flex-1 shadow-lg shadow-primary-500/30 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;
