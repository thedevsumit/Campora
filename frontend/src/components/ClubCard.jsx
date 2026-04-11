import React, { useState } from "react";
import { ArrowRight, Users, Star, Calendar, Zap } from "lucide-react";

const ClubCard = ({ club, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  const memberCount = club.memberCount || club.members?.length || 0;
  const followerCount = club.followers?.length || 0;
  const isNew = club.createdAt && (new Date() - new Date(club.createdAt)) < 7 * 24 * 60 * 60 * 1000;

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative bg-white dark:bg-slate-900 rounded-3xl p-6 cursor-pointer border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:shadow-primary-500/10 transition-all duration-500 hover:-translate-y-2 overflow-hidden group"
    >
      {/* Animated gradient background */}
      <div className={`absolute inset-0 bg-gradient-to-br from-primary-50 via-transparent to-secondary-50 dark:from-primary-900/20 dark:via-transparent dark:to-secondary-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

      {/* Top accent */}
      <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary-500 via-primary-400 to-secondary-500 transform origin-left transition-transform duration-500 ${isHovered ? "scale-x-100" : "scale-x-0"}`} />

      <div className="relative">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {/* Club Icon with glow effect */}
            <div className="relative flex-shrink-0">
              <div className={`absolute inset-0 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-500`} />
              <div className="relative w-16 h-16 rounded-2xl overflow-hidden ring-2 ring-slate-100 dark:ring-slate-800 group-hover:ring-primary-500/30 transition-all duration-300 shadow-lg">
                <img
                  src={club.clubIcon ? `http://localhost:5000${club.clubIcon}` : "/placeholder.png"}
                  alt={club.clubName}
                  className="w-full h-full object-cover"
                />
                {!club.clubIcon && (
                  <div className="w-full h-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">{club.clubName?.[0]}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white truncate group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  {club.clubName}
                </h2>
                {isNew && (
                  <span className="px-2 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-600 text-xs font-bold rounded-full">
                    NEW
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                {club.description || "No description available for this club."}
              </p>
            </div>
          </div>

          {/* Arrow indicator */}
          <div className={`flex-shrink-0 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 group-hover:bg-gradient-to-br group-hover:from-primary-500 group-hover:to-secondary-500 transition-all duration-300 ${isHovered ? "translate-x-0 opacity-100" : "translate-x-3 opacity-0"}`}>
            <ArrowRight className={`w-5 h-5 text-primary-600 dark:text-primary-400 group-hover:text-white transition-colors`} />
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-xs font-medium text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full">
            <Users className="w-3.5 h-3.5" />
            {memberCount} {memberCount === 1 ? "member" : "members"}
          </span>
          <span className="flex items-center gap-1.5 text-xs font-medium text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full">
            <Star className="w-3.5 h-3.5" />
            {followerCount} {followerCount === 1 ? "follower" : "followers"}
          </span>
          {club.category && (
            <span className="flex items-center gap-1.5 text-xs font-medium text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30 px-3 py-1.5 rounded-full">
              <Zap className="w-3.5 h-3.5" />
              {club.category}
            </span>
          )}
        </div>
      </div>

      {/* Decorative corner element */}
      <div className={`absolute bottom-3 right-3 w-8 h-8 bg-gradient-to-br from-primary-500/10 to-secondary-500/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
    </div>
  );
};

export default ClubCard;
