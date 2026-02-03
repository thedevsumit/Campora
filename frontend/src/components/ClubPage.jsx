import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useClubStore } from "../store/useClubStore";
import ClubCard from "../components/ClubCard";
import Navbar from "./Navbar";

const ClubsPage = () => {
  const { clubs, getAllClubs, isFetchingClubs } = useClubStore();
  const navigate = useNavigate();

  useEffect(() => {
    getAllClubs();
  }, [getAllClubs]);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 p-8 text-gray-900">
        <h1 className="text-3xl font-bold mb-6">All Clubs</h1>

        {isFetchingClubs ? (
          <p>Loading clubs...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {clubs.map((club) => (
              <ClubCard
                key={club._id}
                club={club}
                onClick={() => navigate(`/clubs/${club._id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default ClubsPage;
