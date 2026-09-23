import { useEffect, useState } from "react";
import { Button, IconButton, TextField } from "@mui/material";
import { FiEdit } from "react-icons/fi";
import profile from "../../assets/Images/profile.png";
import {
  useEditProfileMutation,
  useUserProfileQuery,
} from "../../Redux/api/userApi";
import { toast } from "sonner";

export default function Profile() {
  const { data: profileApiData, refetch } = useUserProfileQuery();
  const profileData = profileApiData?.data;
  console.log("Profile Data", profileData);

  const [updateProfile] = useEditProfileMutation();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [profileImage, setProfileImage] = useState(profile);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (profileData) {
      setName(profileData.name);
      setEmail(profileData.email);
      setPhone(profileData.phone);
      if (profileData.profile) {
        setProfileImage(profileData.profile); // If there's a profile image, set it
      }
    }
  }, [profileData]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    console.log(file); // Check the uploaded file
    if (file) {
      setProfileImage(file);

      // Preview the selected image using FileReader (base64)
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result); // Set the base64 image preview
      };
      reader.readAsDataURL(file); // Convert the file to base64
    }
  };

  const handleSubmit = async () => {
    const updateProfileData = {
      name: name,
      phone: phone,
    };

    const formData = new FormData();
    formData.append("data", JSON.stringify(updateProfileData));

    console.log("profileImage", profileImage);

    // If profileImage is a File (i.e., the user uploaded an image), append it
    if (profileImage && profileImage instanceof File) {
      formData.append("images", profileImage); // Append the image file for upload
    }

    try {
      const response = await updateProfile(formData).unwrap();
      console.log("API response", response);

      if (response.success) {
        toast.success("Profile Updated successfully!");
        setName("");
        setPhone("");
        setImagePreview(null); // Clear the preview after a successful update
        refetch(); // Refetch the profile to get the latest data
      }
    } catch (err) {
      console.log(err);
      toast.error("Failed to update profile. Please try again.");
    }
  };

  return (
    <div className="flex gap-10 w-full bg-[#efefef] h-[91vh] p-20 rounded-lg">
      {/* Profile Header */}
      <div className="relative">
        <div className="bg-[#efefef]">
          <img
            src={imagePreview || profileImage}
            alt="Profile Image"
            className="rounded-full w-32 h-32 object-cover"
          />
        </div>
        <IconButton
          sx={{
            position: "absolute",
            top: "15%",
            right: 0,
            backgroundColor: "#fff",
            borderRadius: "50%",
            padding: "8px",
          }}
          component="label"
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ display: "none" }}
          />
          <FiEdit fontSize={20} className="text-[#3F80AE]" />
        </IconButton>
      </div>

      <div className="flex flex-col gap-8 w-2/3">
        <div className="flex items-center gap-5">
          <div className="w-full">
            <TextField
              label="Your Name"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center gap-5">
          <div className="w-full">
            <TextField
              label="Email"
              fullWidth
              value={email}
              disabled // Email is displayed but not editable
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="w-full">
            <TextField
              label="Phone Number"
              fullWidth
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
        </div>

        {/* Save & Update Button */}
        <div>
          <Button
            fullWidth
            variant="contained"
            sx={{
              backgroundColor: "#3F80AE",
              color: "white",
              textTransform: "none",
              padding: "10px",
              width: "40%",
              float: "right",
            }}
            onClick={handleSubmit}
          >
            Save & Update
          </Button>
        </div>
      </div>
    </div>
  );
}
