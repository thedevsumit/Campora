import { useEffect, useState } from "react";
import { useClubStore } from "../store/useClubStore";
import ClubCard from "../components/ClubCard";
import ClubDetailsModal from "../components/ClubDetailsModal";
import Navbar from "./Navbar";

const ClubsPage = () => {
  const { clubs, getAllClubs, isFetchingClubs } = useClubStore();
  const [selectedClub, setSelectedClub] = useState(null);

  useEffect(() => {
    getAllClubs();
  }, []);

  return (
    <>
      <Navbar/>
      <div className="min-h-screen bg-[#0f172a] p-8 text-white">
        <h1 className="text-3xl font-bold mb-6">All Clubs</h1>

        {isFetchingClubs ? (
          <p>Loading clubs...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {clubs.map((club) => (
              <ClubCard
                key={club._id}
                club={club}
                onClick={() => setSelectedClub(club)}
              />
            ))}
          </div>
        )}

        {selectedClub && (
          <ClubDetailsModal
            club={selectedClub}
            onClose={() => setSelectedClub(null)}
          />
        )}
      </div>
    </>
  );
};

export default ClubsPage;
