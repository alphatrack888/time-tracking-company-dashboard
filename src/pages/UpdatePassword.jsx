import React from "react";
import { Button, TextField } from "@mui/material";
import { MdOutlineLock } from "react-icons/md";
import { HiArrowLeft } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useResetPasswordMutation } from "../Redux/api/authApi";

const UpdatePassword = () => {
  const navigate = useNavigate();
  const [resetPassword] = useResetPasswordMutation();

  const onFinish = async (event) => {
    event.preventDefault();

    const form = new FormData(event.target);
    const values = {
      password: form.get("password"),
      confirmPassword: form.get("confirmPassword"),
    };

    console.log("Update Password Values", values);

    try {
      const data = {
        newPassword: values.password,
        confirmPassword: values.confirmPassword,
      };

      if (values.password !== values.confirmPassword) {
        toast.error("Passwords do not match.");
        return;
      }

      const response = await resetPassword(data).unwrap();
      if (response.success) {
        toast.success("Password updated successfully!");
        navigate("/sign-in");
      }
    } catch (error) {
      console.log("update password error", error);
      if (error.response) {
        toast.error(
          error.response.data.message ||
            "Failed to update password. Please try again."
        );
      }
      if (
        error.data?.message ===
        "You don't have authorization to reset your password, please verify your account first."
      ) {
        toast.error("Please Verify Your Account First");
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="bg-[#fff] min-h-[65vh] max-w-2xl mx-auto my-40 p-8 flex flex-col items-center">
      <div className="bg-[#ECF2F7] rounded-lg p-8">
        {/* <div className="mb-8">
          <div className="flex items-center gap-1 mb-4">
            <Link to="/verify-otp" style={{ textDecoration: "none" }}>
              <HiArrowLeft style={{ fontSize: "24px" }} />
            </Link>
            <Typography variant="h5" style={{ fontWeight: 500 }}>
              Set a new password
            </Typography>
          </div>
        </div> */}
        <p className="text-3xl font-semibold text-[#333] text-center mb-8">
          Create New Password
        </p>

        <form onSubmit={onFinish}>
          <TextField
            label="New Password"
            name="password"
            type="password"
            fullWidth
            required
            variant="outlined"
            placeholder="Enter new password"
            margin="normal"
            InputProps={{
              startAdornment: (
                <MdOutlineLock
                  style={{ fontSize: "24px", marginRight: "8px" }}
                />
              ),
            }}
            sx={{
              "& .MuiInputBase-root": {
                paddingLeft: "10px",
              },
            }}
          />
          <TextField
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            fullWidth
            required
            variant="outlined"
            placeholder="Confirm your password"
            margin="normal"
            InputProps={{
              startAdornment: (
                <MdOutlineLock
                  style={{ fontSize: "24px", marginRight: "8px" }}
                />
              ),
            }}
            sx={{
              "& .MuiInputBase-root": {
                paddingLeft: "10px",
              },
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            style={{
              marginTop: "20px",
              backgroundColor: "#3F80AE",
              padding: "8px",
              fontWeight: "bold",
              borderRadius: "10px",
              fontSize: "16px",
              textTransform: "none",
            }}
          >
            Update Password
          </Button>
        </form>
      </div>
    </div>
  );
};

export default UpdatePassword;
