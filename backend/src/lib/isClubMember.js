// utils/isClubMember.js
const Club = require("../models/club.model");

const isClubMember = async (clubId, userId) => {
  const club = await Club.findById(clubId);

  if (!club) return false;

  return club.members.some((m) => m.user.toString() === userId.toString());
};

module.exports = isClubMember;
