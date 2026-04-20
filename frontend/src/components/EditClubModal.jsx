import React, { useState, useEffect, useRef } from "react";
import { useClubStore } from "../store/useClubStore";
import { getImageUrl } from "../lib/utils";
import Button from "./ui/Button";
import { X, Image, Settings } from "lucide-react";

export default function EditClubModal({ show, onClose, clubData, clubId, onUpdated }) {
  const { updateClub, isUpdatingClub } = useClubStore();

  const [form, setForm] = useState({
    clubName: "",
    description: "",
    clubIcon: null,
  });
  const [iconPreview, setIconPreview] = useState(null);
  const [currentIcon, setCurrentIcon] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const iconInputRef = useRef(null);

  useEffect(() => {
    if (!clubData) return;
    setForm({
      clubName: clubData.clubName || "",
      description: clubData.description || "",
      clubIcon: null,
    });
    setCurrentIcon(clubData.clubIcon || "");
    setIconPreview(null);
  }, [clubData]);

  if (!show) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleIconChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setForm((prev) => ({ ...prev, clubIcon: file }));
    const reader = new FileReader();
    reader.onloadend = () => setIconPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const removeIcon = () => {
    setForm((prev) => ({ ...prev, clubIcon: null }));
    setIconPreview(null);
    setCurrentIcon("");
    if (iconInputRef.current) iconInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("clubName", form.clubName);
    data.append("description", form.description);
    if (form.clubIcon) data.append("clubIcon", form.clubIcon);

    setIsSubmitting(true);
    try {
      await updateClub(clubId, data);
      if (onUpdated) await onUpdated();
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayIcon = iconPreview || (currentIcon ? getImageUrl(currentIcon) : null);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden animate-scale-in"
        style={{ maxHeight: "92vh", overflowY: "auto" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative bg-gradient-to-r from-primary-600 to-secondary-600 p-6 pb-10">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-start justify-between relative z-10">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="p-1.5 bg-white/20 rounded-lg">
                  <Settings className="w-4 h-4 text-white" />
                </div>
                <span className="text-white/80 text-xs font-medium">Club Settings</span>
              </div>
              <h2 className="text-xl font-bold text-white">Edit Club</h2>
              <p className="text-primary-100 text-xs mt-0.5">Update your club details</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">

          {/* Club Icon / Profile Photo */}
          <div className="flex flex-col items-center">
            <label className="cursor-pointer group" htmlFor="club-icon-input">
              <div className="relative">
                {displayIcon ? (
                  <div className="relative w-24 h-24">
                    <img
                      src={displayIcon}
                      alt="Club icon"
                      className="w-24 h-24 rounded-2xl object-cover ring-4 ring-primary-200 dark:ring-primary-800"
                    />
                    <div className="absolute inset-0 rounded-2xl bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Image className="w-6 h-6 text-white" />
                    </div>
                  </div>
                ) : (
                  <div className="w-24 h-24 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-800 group-hover:border-primary-400 transition-colors">
                    <Image className="w-7 h-7 text-slate-400 group-hover:text-primary-500 transition-colors mb-1" />
                    <span className="text-xs text-slate-400 group-hover:text-primary-500 transition-colors">Change</span>
                  </div>
                )}
              </div>
            </label>
            <input
              ref={iconInputRef}
              id="club-icon-input"
              type="file"
              accept="image/*"
              onChange={handleIconChange}
              className="hidden"
            />
            {displayIcon && (
              <button
                type="button"
                onClick={removeIcon}
                className="mt-2 text-xs text-danger-500 hover:text-danger-600 font-medium transition-colors"
              >
                Remove photo
              </button>
            )}
            <p className="text-xs text-slate-400 mt-1">Click to upload club photo</p>
          </div>

          {/* Club Name */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Club Name <span className="text-danger-500">*</span>
            </label>
            <input
              type="text"
              name="clubName"
              value={form.clubName}
              onChange={handleChange}
              required
              placeholder="Enter club name"
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Description <span className="text-danger-500">*</span>
            </label>
            <textarea
              name="description"
              rows={4}
              value={form.description}
              onChange={handleChange}
              required
              placeholder="Describe your club..."
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all resize-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={isSubmitting}
              className="flex-1 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700"
            >
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
