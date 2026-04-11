import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useClubStore } from '../store/useClubStore';
import Button from './ui/Button';
import Input from './ui/Input';
import { ImagePlus, Sparkles, ArrowRight, X } from 'lucide-react';

export default function CreateClubPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    clubName: '',
    description: '',
    category: '',
  });

  const [clubIcon, setClubIcon] = useState(null);
  const [iconPreview, setIconPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createClub } = useClubStore();

  const categories = ["Technical", "Cultural", "Sports", "Arts", "Business", "Social", "Academic", "Other"];

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
      alert('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      await createClub({
        clubName: formData.clubName,
        description: formData.description,
        category: formData.category,
        clubIcon: clubIcon,
      });
      navigate('/clubs');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-lg">
        {/* Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl shadow-primary-500/5 border border-slate-100 dark:border-slate-800 overflow-hidden">
          {/* Header */}
          <div className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 p-8 text-white">
            <button
              onClick={() => navigate('/clubs')}
              className="absolute top-4 right-4 p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold">Create New Club</h1>
                <p className="text-primary-200 text-sm">Start your campus community</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="p-8 space-y-6">
            {/* Club Icon */}
            <div className="flex items-center gap-5">
              <div className="relative">
                <div className="w-24 h-24 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-600 flex items-center justify-center">
                  {iconPreview ? (
                    <img src={iconPreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <ImagePlus className="w-8 h-8 text-slate-400" />
                  )}
                </div>
                {iconPreview && (
                  <button
                    onClick={() => { setClubIcon(null); setIconPreview(null); }}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-danger-500 text-white rounded-full flex items-center justify-center hover:bg-danger-600 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
              <div>
                <label className="cursor-pointer">
                  <div className="px-5 py-2.5 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-semibold transition-colors shadow-lg shadow-primary-500/30">
                    Choose Icon
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleIconChange}
                    className="hidden"
                  />
                </label>
                <p className="text-xs text-slate-500 mt-2">PNG or JPG up to 5MB</p>
              </div>
            </div>

            <Input
              label="Club Name"
              value={formData.clubName}
              onChange={handleChange}
              name="clubName"
              placeholder="Enter club name"
            />

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3.5 border-2 border-slate-200 dark:border-slate-700 rounded-2xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all appearance-none cursor-pointer"
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Description
              </label>
              <textarea
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your club's purpose and activities..."
                className="w-full px-4 py-3.5 border-2 border-slate-200 dark:border-slate-700 rounded-2xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all resize-none"
              />
            </div>

            <Button
              onClick={handleSubmit}
              isLoading={isSubmitting}
              className="w-full"
              size="lg"
            >
              {isSubmitting ? 'Creating...' : 'Create Club'}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>

            <div className="text-center">
              <button
                onClick={() => navigate('/clubs')}
                className="text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
              >
                Cancel and go back
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
