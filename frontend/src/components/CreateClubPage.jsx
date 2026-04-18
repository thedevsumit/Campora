import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useClubStore } from '../store/useClubStore';
import Navbar from './Navbar';
import Button from './ui/Button';
import Input from './ui/Input';
import { ImagePlus, Sparkles, ArrowRight, X, Users, Zap, Star, Globe, Calendar, Trophy, Heart } from 'lucide-react';

const categories = ["Technical", "Cultural", "Sports", "Arts", "Business", "Social", "Academic", "Other"];

const perks = [
  { icon: Users, title: "Build Your Community", desc: "Connect with students who share your interests and passion" },
  { icon: Calendar, title: "Host Events", desc: "Organize workshops, hackathons, meetups, and campus activities" },
  { icon: Trophy, title: "Compete & Win", desc: "Participate in inter-college events and competitions" },
  { icon: Heart, title: "Make Friends", desc: "Find your tribe and create lifelong memories together" },
];

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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-700 text-white pt-16 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-0 w-[500px] h-[500px] bg-secondary-400/20 rounded-full blur-3xl" />
        <div className="absolute top-20 left-20 w-72 h-72 border border-white/10 rounded-full" />
        <div className="absolute top-40 right-40 w-32 h-32 border border-white/10 rounded-full" />
        <div className="absolute bottom-40 right-20 w-20 h-20 bg-amber-400/20 rounded-full blur-2xl" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-xl rounded-full border border-white/20 mb-8 animate-fade-in">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span className="text-white/90 text-sm font-medium">Launch Your Vision</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 animate-fade-in-up leading-tight">
              Create a Club That
              <span className="block bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-200 bg-clip-text text-transparent">
                Inspires Campus
              </span>
            </h1>

            <p className="text-primary-100 text-xl max-w-2xl mx-auto animate-fade-in-up stagger-1 leading-relaxed">
              Every great campus movement starts with a single step. Define your vision, gather your community, and watch your club grow into something extraordinary.
            </p>

            {/* Stats Row */}
            <div className="flex flex-wrap justify-center gap-6 mt-12 animate-fade-in-up stagger-2">
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-xl px-6 py-4 rounded-2xl border border-white/20">
                <div className="p-3 bg-gradient-to-br from-amber-400 to-amber-500 rounded-xl shadow-lg">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-2xl font-extrabold text-white">50+</p>
                  <p className="text-primary-200 text-sm font-medium">Active Clubs</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-xl px-6 py-4 rounded-2xl border border-white/20">
                <div className="p-3 bg-gradient-to-br from-secondary-400 to-secondary-500 rounded-xl shadow-lg">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-2xl font-extrabold text-white">500+</p>
                  <p className="text-primary-200 text-sm font-medium">Total Members</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-xl px-6 py-4 rounded-2xl border border-white/20">
                <div className="p-3 bg-gradient-to-br from-rose-400 to-rose-500 rounded-xl shadow-lg">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-2xl font-extrabold text-white">100+</p>
                  <p className="text-primary-200 text-sm font-medium">Events Hosted</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Multiple Waves */}
        <div className="absolute bottom-0 top-200 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 60L60 55C120 50 240 40 360 35C480 30 600 30 720 35C840 40 960 50 1080 55C1200 60 1320 60 1380 60L1440 60V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V60Z" className="fill-slate-50 dark:fill-slate-950" />
          </svg>
        </div>
        <div className="absolute bottom-[-10px] left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full opacity-50">
            <path d="M0 30C120 20 240 10 360 15C480 20 600 30 720 35C840 40 960 40 1080 35C1200 30 1320 20 1380 15L1440 10V60H1380C1320 60 1200 60 1080 60C960 60 840 60 720 60C600 60 480 60 360 60C240 60 120 60 60 60H0V30Z" className="fill-slate-100 dark:fill-slate-900" />
          </svg>
        </div>
      </div>

      {/* What You Get Section */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-3">
            What Your Club Gets
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto">
            Everything you need to build a thriving campus community
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {perks.map((perk, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${i === 0 ? 'from-primary-500 to-primary-600' : i === 1 ? 'from-secondary-500 to-secondary-600' : i === 2 ? 'from-amber-500 to-amber-600' : 'from-rose-500 to-rose-600'} flex items-center justify-center mb-4 shadow-lg`}>
                <perk.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">{perk.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{perk.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Form Section */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl shadow-primary-500/5 border border-slate-100 dark:border-slate-800 overflow-hidden">
              {/* Header */}
              <div className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-700 p-8 text-white">
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-2xl" />
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center">
                    <Sparkles className="w-7 h-7" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-extrabold">Club Information</h2>
                    <p className="text-primary-200 text-sm mt-1">Tell us about your club vision</p>
                  </div>
                </div>
              </div>

              {/* Form Content */}
              <div className="p-8 space-y-6">
                {/* Club Icon */}
                <div className="flex items-center gap-6">
                  <div className="relative flex-shrink-0">
                    <div className="w-32 h-32 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-600 flex items-center justify-center shadow-inner">
                      {iconPreview ? (
                        <img src={iconPreview} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-center">
                          <ImagePlus className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                          <span className="text-xs text-slate-400">Club Icon</span>
                        </div>
                      )}
                    </div>
                    {iconPreview && (
                      <button
                        onClick={() => { setClubIcon(null); setIconPreview(null); }}
                        className="absolute -top-3 -right-3 w-8 h-8 bg-danger-500 text-white rounded-full flex items-center justify-center hover:bg-danger-600 transition-colors shadow-lg"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <div>
                    <label className="cursor-pointer block">
                      <div className="px-6 py-3.5 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-xl font-semibold transition-all shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 text-sm">
                        Upload Club Icon
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleIconChange}
                        className="hidden"
                      />
                    </label>
                    <p className="text-xs text-slate-500 mt-3">Supported formats: PNG, JPG, GIF. Max size: 5MB</p>
                  </div>
                </div>

                <Input
                  label="Club Name"
                  value={formData.clubName}
                  onChange={handleChange}
                  name="clubName"
                  placeholder="e.g., Computer Science Society, Photography Club"
                />

                <div className="space-y-3">
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">
                    Category <span className="text-danger-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full px-5 py-4 border-2 border-slate-200 dark:border-slate-700 rounded-2xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all appearance-none cursor-pointer text-base"
                    >
                      <option value="">Choose the best category for your club</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                    <Sparkles className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">
                    Description <span className="text-danger-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    rows={6}
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe your club's mission, vision, activities, and what makes it unique. What will members gain by joining? What kind of events do you plan to organize? This is your chance to inspire potential members!"
                    className="w-full px-5 py-4 border-2 border-slate-200 dark:border-slate-700 rounded-2xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all resize-none text-base leading-relaxed"
                  />
                  <p className="text-xs text-slate-400">Minimum 50 characters. Be creative and specific!</p>
                </div>

                <Button
                  onClick={handleSubmit}
                  isLoading={isSubmitting}
                  className="w-full py-5 text-base shadow-xl shadow-primary-500/20"
                  size="lg"
                >
                  {isSubmitting ? (
                    <>
                      <Sparkles className="w-5 h-5 mr-2 animate-pulse" />
                      Sending Request...
                    </>
                  ) : (
                    <>
                      Submit Club Request
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>

                <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
                  <span>Changed your mind?</span>
                  <button
                    onClick={() => navigate('/clubs')}
                    className="text-primary-600 hover:text-primary-700 dark:hover:text-primary-400 font-semibold transition-colors"
                  >
                    Browse existing clubs instead
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Tips Sidebar */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-700 rounded-3xl shadow-xl p-6 text-white sticky top-24">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-white/20 backdrop-blur-xl rounded-xl">
                  <Star className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold">Pro Tips</h3>
                  <p className="text-primary-200 text-sm">Create a standout club</p>
                </div>
              </div>

              <div className="space-y-5">
                <div className="flex items-start gap-4 p-4 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/10">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center flex-shrink-0 shadow-lg">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-lg mb-1">Pick a Memorable Name</p>
                    <p className="text-primary-100 text-sm leading-relaxed">Keep it short, unique, and easy to remember. Avoid generic names that could describe any club.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/10">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary-400 to-secondary-500 flex items-center justify-center flex-shrink-0 shadow-lg">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-lg mb-1">Write an Inspiring Description</p>
                    <p className="text-primary-100 text-sm leading-relaxed">Share your vision, goals, and what makes your club special. Let potential members feel excited to join.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/10">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-400 to-rose-500 flex items-center justify-center flex-shrink-0 shadow-lg">
                    <Globe className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-lg mb-1">Choose the Right Category</p>
                    <p className="text-primary-100 text-sm leading-relaxed">This helps students find your club when searching. Be honest about which category fits best.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/10">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-400 to-violet-500 flex items-center justify-center flex-shrink-0 shadow-lg">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-lg mb-1">Plan Your First Event</p>
                    <p className="text-primary-100 text-sm leading-relaxed">Nothing attracts members like exciting upcoming events. Think about what your first meetup will be!</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-white/20">
                <p className="text-primary-100 text-sm text-center leading-relaxed">
                  Your club will be reviewed by an admin and visible to all students on campus once approved. Start building your community today!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
