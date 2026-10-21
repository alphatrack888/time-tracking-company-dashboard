import React, { useState } from "react";
import { Button, Grid, Typography, Container } from "@mui/material";
import OTPInput from "react-otp-input";
import { HiArrowLeft } from "react-icons/hi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useVerifyOtpMutation } from "../Redux/api/authApi";

const VerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const [verifyOtp] = useVerifyOtpMutation();

  const handleOTPSubmit = async () => {
    // navigate("/update-password");

    if (otp.length < 6) {
      toast.error("Please fill in all OTP fields");
      return;
    }

    const email = location.state?.email;
    console.log("log in email", email);
    const resetPassMail = sessionStorage.getItem("userEmail");

    try {
      let response;

      if (email) {
        // Login OTP flow: verify using email + otp
        const payload = { email, oneTimeCode: otp };
        response = await verifyOtp(payload).unwrap();

        if (response?.success) {
          // Save tokens and go home
          sessionStorage.setItem("accessToken", response?.data?.accessToken);
          sessionStorage.setItem("refreshToken", response?.data?.refreshToken);
          toast.success("OTP verified successfully!");
          navigate("/");
          return;
        }

        // If the API returned success: false
        toast.error(
          response?.message || "OTP verification failed. Please try again."
        );
        return;
      }

      if (resetPassMail) {
        // Forgot-password flow: existing behavior
        const data = { email: resetPassMail, oneTimeCode: otp };
        response = await verifyOtp(data).unwrap();
        console.log("otp verify response", response);
        if (response?.success === true) {
          sessionStorage.setItem("verifiedOtpToken", response?.data?.token);
          toast.success("OTP verified successfully!");
          navigate("/update-password");
          return;
        }

        toast.error(
          response?.message || "OTP verification failed. Please try again."
        );
        return;
      }
      // No email and no otpToken -> invalid entry point
      toast.error(
        "No verification session found. Please start the process again."
      );
      navigate("/sign-in");
    } catch (error) {
      console.error("Error verifying OTP:", error);
      if (error.data?.message === "Invalid OTP") {
        toast.error("Invalid OTP. Please try again.");
      } else {
        toast.error("Failed to verify OTP. Please try again.");
      }
    }
  };

  return (
    <div className="bg-[#fff] min-h-[66vh] max-w-2xl flex flex-col gap-5 items-center mx-auto my-40 p-5 rounded-lg">
      <div className="bg-[#ECF2F7] rounded-lg p-8">
        <div className="mb-8">
          {/* <div className="flex items-center gap-1 mb-4">
            <Link to="/forgot-password" className="cursor-pointer">
              <HiArrowLeft style={{ fontSize: "24px" }} />
            </Link>
            <p className="text-xl text-center font-semibold text-[#333333]">
              Verify Your Account
            </p>
          </div> */}

          <p className="text-2xl text-center font-semibold text-[#333333] mb-4">
            Verify Your Account
          </p>
          <p className="mb-4 text-center text-[#545454]">
            We've sent the 6 digit code verification code to your email/phone.
            Enter the code below to continue
          </p>
        </div>

        <div className="flex items-center justify-center">
          <OTPInput
            inputStyle={{
              width: "55px",
              height: "45px",
              fontSize: "20px",
              backgroundColor: "transparent",
              border: "1px solid #222021",
              borderRadius: "8px",
              margin: "5px",
              textAlign: "center",
            }}
            value={otp}
            onChange={setOtp}
            numInputs={6}
            renderInput={(props) => <input {...props} required />}
          />
        </div>

        <Button
          fullWidth
          variant="contained"
          style={{
            marginTop: "30px",
            backgroundColor: "#3F80AE",
            padding: "8px",
            fontWeight: "bold",
            borderRadius: "10px",
            fontSize: "16px",
            textTransform: "none",
          }}
          onClick={handleOTPSubmit}
        >
          Verify
        </Button>
      </div>
    </div>
  );
};

export default VerifyOtp;
