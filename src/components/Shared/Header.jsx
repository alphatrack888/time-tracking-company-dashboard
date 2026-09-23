import { useNavigate } from "react-router-dom";
import { Button, CircularProgress } from "@mui/material";
import { useUserProfileQuery } from "../../Redux/api/userApi";
import NotificationBell from "./NotificationBell";

export default function Header() {
  const { data: profileApiData, isLoading, isError } = useUserProfileQuery();
  const profileData = profileApiData?.data;
  console.log("Profile Data", profileData);

  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate("/profile");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[92vh]">
        <CircularProgress />
      </div>
    );
  }
  if (isError) {
    return <div>Error loading data.</div>;
  }

  return (
    <div className="flex items-center justify-end bg-[#fff] w-full px-10 py-4">
      <div className="flex items-center gap-4">
        <NotificationBell />
        <Button
          sx={{
            color: "black",
            textTransform: "none",
            padding: "5px",
            width: "100%",
            float: "right",
          }}
          onClick={handleProfileClick}
          variant="text"
        >
          <div className="flex items-center gap-2">
            <img
              src={profileData.profile}
              alt=""
              className="size-10 rounded-full border border-white"
            />
            <div className="flex flex-col items-start">
              <p className="text-black font-medium">{profileData.name}</p>
              <p className="text-black font-medium text-xs capitalize">
                {profileData.role}
              </p>
            </div>
          </div>
        </Button>
      </div>
    </div>
  );
}
