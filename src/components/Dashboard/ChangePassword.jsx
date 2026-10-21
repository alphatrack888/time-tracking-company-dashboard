/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { FaRegEye } from "react-icons/fa";
import { IoMdEyeOff } from "react-icons/io";
import { useChangePasswordMutation } from "../../Redux/api/authApi";
import { toast } from "sonner";

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [changePassword] = useChangePasswordMutation();

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowNewPassword = () => setShowNewPassword((show) => !show);
  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword((show) => !show);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match.");
      return;
    }
    setError("");
    const payload = {
      currentPassword,
      newPassword,
      confirmPassword,
    };
    try {
      const response = await changePassword(payload).unwrap();

      if (response.success) {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        toast.success("Password changed successfully!");
      }
    } catch (err) {
      setError("Failed to change password. Please try again later.");
    }
  };

  return (
    <div className="px-10 py-8 bg-[#efefef] h-[91vh] rounded-lg">
      <div className="bg-white py-20 rounded-lg">
        <div className="max-w-2xl mx-auto bg-[#C3D8E6] p-20 rounded-lg">
          <p className="text-3xl font-semibold text-center pb-10 text-[#39749E]">
            Change Your Password
          </p>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-3">
              {/* Old Password Field */}
              <div>
                <label htmlFor="oldPassword" className="block mb-1">
                  Old Password
                </label>
                <TextField
                  id="oldPassword"
                  placeholder="Enter current password"
                  type={showPassword ? "text" : "password"}
                  fullWidth
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleClickShowPassword}
                          edge="end"
                        >
                          {showPassword ? <IoMdEyeOff /> : <FaRegEye />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </div>

              {/* New Password Field */}
              <div>
                <label htmlFor="newPassword" className="block mb-1">
                  New Password
                </label>
                <TextField
                  id="newPassword"
                  placeholder="Enter new password"
                  type={showNewPassword ? "text" : "password"}
                  fullWidth
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleClickShowNewPassword}
                          edge="end"
                        >
                          {showNewPassword ? <IoMdEyeOff /> : <FaRegEye />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </div>

              {/* Confirm Password Field */}
              <div>
                <label htmlFor="confirmPassword" className="block mb-1">
                  Confirm New Password
                </label>
                <TextField
                  id="confirmPassword"
                  placeholder="Re-enter new password"
                  type={showConfirmPassword ? "text" : "password"}
                  fullWidth
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleClickShowConfirmPassword}
                          edge="end"
                        >
                          {showConfirmPassword ? <IoMdEyeOff /> : <FaRegEye />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </div>

              {/* Error Message */}
              {error && (
                <Typography color="error" sx={{ mt: 1 }}>
                  {error}
                </Typography>
              )}

              {/* Submit Button */}
              <div>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "#3F80AE",
                    color: "white",
                    fontSize: "16px",
                    textTransform: "none",
                    padding: "10px",
                    float: "right",
                  }}
                  type="submit"
                  fullWidth
                >
                  Confirm
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
