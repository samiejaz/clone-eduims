import { useState } from "react";
import UserProfile from "../components/Modals/UserProfile";

const useUserProfile = () => {
  const [showProfile, setShowProfile] = useState(false);
  const handleCloseProfile = () => setShowProfile(false);
  const handleShowProfile = () => setShowProfile(true);

  return {
    handleCloseProfile,
    handleShowProfile,
    render: (
      <>
        <UserProfile
          showProfile={showProfile}
          handleCloseProfile={handleCloseProfile}
        />
      </>
    ),
  };
};

export default useUserProfile;
