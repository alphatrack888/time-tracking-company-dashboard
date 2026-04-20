import React, { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Container,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { FiEdit } from "react-icons/fi";
import { RiLockPasswordFill } from "react-icons/ri";
import profileImg from "../../assets/Images/profile.png";

export default function Profile() {
  const [name, setName] = useState("Charlene Reed");
  const [email, setEmail] = useState("charlenereed@gmail.com");
  const [dob, setDob] = useState("25 January 1990");
  const [userName, setUserName] = useState("Charlene Reed");
  const [password, setPassword] = useState("**********");
  const [presentAddress, setPresentAddress] = useState(
    "San Jose, California, USA"
  );
  const [permanentAddress, setPermanentAddress] = useState(
    "San Jose, California, USA"
  );
  const [postalCode, setPostalCode] = useState("45962");
  const [city, setCity] = useState("San Jose");
  const [country, setCountry] = useState("USA");
  const [profileImage, setProfileImage] = useState(profileImg);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    console.log({
      name,
      email,
      dob,
      userName,
      password,
      presentAddress,
      permanentAddress,
      postalCode,
      city,
      country,
    });
  };

  return (
    <div className="flex mx-20 gap-10 mt-1 p-1 w-full">
      {/* Profile Header */}
      <div className="relative">
        <div className="bg-[#efefef]">
          <img src={profileImage} alt="" className="size-32" />
        </div>
        <IconButton
          sx={{
            position: "absolute",
            top: "20%",
            right: 0,
            backgroundColor: "#2A4BA0",
            borderRadius: "50%",
            padding: "8px",
          }}
          component="label"
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
          <FiEdit fontSize={20} className="text-white" />
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
          <div className="w-full">
            <TextField
              label="User Name"
              fullWidth
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center gap-5">
          <div className="w-full">
            <TextField
              label="Email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="w-full">
            <TextField
              label="Password"
              type="password"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <RiLockPasswordFill fontSize="medium" />
                  </InputAdornment>
                ),
              }}
            />
          </div>
        </div>

        <div className="flex items-center gap-5">
          <div className="w-full">
            <TextField
              label="Date of Birth"
              fullWidth
              value={dob}
              onChange={(e) => setDob(e.target.value)}
            />
          </div>
          <div className="w-full">
            <TextField
              label="Present Address"
              fullWidth
              value={presentAddress}
              onChange={(e) => setPresentAddress(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center gap-5">
          <div className="w-full">
            <TextField
              label="Permanent Address"
              fullWidth
              value={permanentAddress}
              onChange={(e) => setPermanentAddress(e.target.value)}
            />
          </div>
          <div className="w-full">
            <TextField
              label="City"
              fullWidth
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center gap-5">
          <div className="w-full">
            <TextField
              label="Postal Code"
              fullWidth
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
            />
          </div>
          <div className="w-full">
            <TextField
              label="Country"
              fullWidth
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            />
          </div>
        </div>

        <Box mt={2}>
          <Button
            fullWidth
            variant="contained"
            sx={{
              backgroundColor: "#232323",
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
        </Box>
      </div>
    </div>
  );
}
