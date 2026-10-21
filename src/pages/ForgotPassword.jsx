import React, { useState } from "react";
import { TextField, Button, Grid, Typography, Container } from "@mui/material";
import { HiArrowLeft } from "react-icons/hi";
import { IoMailOpen } from "react-icons/io5";

import { Link, useNavigate } from "react-router-dom";
import { useForgetPasswordMutation } from "../Redux/api/authApi";
import { toast } from "sonner";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const [forgetPassword] = useForgetPasswordMutation();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const onFinish = async (e) => {
    e.preventDefault();
    const data = { email: email };
    console.log("Success:", data);
    try {
      const response = await forgetPassword(data).unwrap();
      console.log("response token", response);
      if (response.success === true) {
        localStorage.setItem("otpToken", response?.data?.forgetToken);
        sessionStorage.setItem("userEmail", email);
        toast.success("An OTP has been sent to your email!");
        navigate("/verify-otp");
      }
    } catch (error) {
      console.error("Error sending reset code:", error);
      if (error.data?.message === "User not found") {
        toast.error("Incorrect Email.");
      }
      if (error.data?.message === "No account found with this email or phone") {
        toast.error("Incorrect Email.");
      }
    }
  };

  return (
    <div className="bg-[#fff] min-h-[66vh] max-w-2xl flex flex-col gap-5 items-center mx-auto my-40 p-5 rounded-lg">
      <div className="bg-[#ECF2F7] rounded-3xl p-8">
        <div className="mb-6">
          <div className="flex items-start gap-3">
            <Link to="/sign-in" className="cursor-pointer">
              <HiArrowLeft style={{ fontSize: "24px", color: "black" }} />
            </Link>
            <p className="text-2xl font-medium text-center text-[#333333]">
              Are You Sure You Forgot Your Password?
            </p>
          </div>
          {/* <Typography
            variant="body1"
            color="textSecondary"
            style={{ marginBottom: "20px" }}
          >
            Please enter your email address to reset your password
          </Typography> */}
        </div>

        <form onSubmit={onFinish}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            required
            margin="normal"
            variant="outlined"
            placeholder="Enter your email"
            value={email}
            onChange={handleEmailChange}
            InputProps={{
              startAdornment: (
                <IoMailOpen style={{ fontSize: "24px", marginRight: "8px" }} />
              ),
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            style={{
              marginTop: "20px",
              backgroundColor: "#3F80AE",
              padding: "8px",
              fontWeight: "600",
              borderRadius: "10px",
              fontSize: "16px",
              textTransform: "none",
            }}
          >
            Send Reset Code
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
