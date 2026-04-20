import { useState } from "react";
import {
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Container,
  Grid,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { HiOutlineMailOpen } from "react-icons/hi";
import { MdOutlineLock } from "react-icons/md";
import { IoEye } from "react-icons/io5";
import { IoEyeOff } from "react-icons/io5";

import logInImage from "../assets/Images/logIn.png";

import { useSignInMutation } from "../Redux/api/authApi";
import { toast } from "sonner";

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [login] = useSignInMutation();

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const onFinish = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);

    const values = {
      email: form.get("email"),
      password: form.get("password"),
    };

    console.log("signIn Data", values);
    // navigate("/", { replace: true });
    try {
      // console.log("aaaa");
      const res = await login(values).unwrap();
      console.log("response", res);

      if (res.success) {
        toast.success("Login Successful!");
        sessionStorage.setItem("accessToken", res?.data?.accessToken);
        sessionStorage.setItem("refreshToken", res?.data?.refreshToken);
        navigate("/");
      } else {
        toast.error("Login Error.");
      }
    } catch (error) {
      console.log("Login error object:", error);

      // Normalize message
      const message = (
        error?.message ||
        error?.error ||
        (typeof error?.data === "string" ? error.data : "")
      ).toLowerCase();

      // Catch proxy/network errors
      if (
        message.includes("network error") ||
        message.includes("proxy") ||
        message.includes("407") ||
        message.includes("unexpected_proxy_auth")
      ) {
        toast.error("OTP verification is required. Please verify your OTP.");
        navigate("/verify-otp", {
          state: { email: values.email },
          replace: true,
        });
        return;
      }

      // API-level errors (only if request succeeded)
      const apiMessage = error?.data?.message || "";
      if (apiMessage === "Incorrect password, please try again.") {
        toast.error("Incorrect Password");
        return;
      }

      if (
        apiMessage ===
        "No account found with this email, please try with valid email or create an account."
      ) {
        toast.error("User Not Found With This E-Mail");
        return;
      }

      // Generic fallback
      toast.error("Login failed. Please try again later.");
    }
  };

  return (
    <div className="bg-[#fff] min-h-[76vh] max-w-2xl flex flex-col gap-5 items-center mx-auto my-28 p-5 rounded-lg">
      <img src={logInImage} alt="logo" className="size-40" />
      <div className="bg-[#ECF2F7] rounded-3xl p-8">
        <p className="text-3xl text-center font-semibold mb-7 text-[#333333]">
          Log In
        </p>

        <form onSubmit={onFinish}>
          <TextField
            label="Email"
            name="email"
            type="email"
            fullWidth
            required
            margin="normal"
            variant="outlined"
            placeholder="Enter your email"
            InputProps={{
              startAdornment: <HiOutlineMailOpen className="mr-2" />,
            }}
          />

          <TextField
            label="Password"
            name="password"
            type={showPassword ? "text" : "password"}
            fullWidth
            required
            margin="normal"
            variant="outlined"
            placeholder="Enter your password"
            InputProps={{
              startAdornment: <MdOutlineLock className="mr-2 text-xl" />,
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label={
                      showPassword
                        ? "hide the password"
                        : "display the password"
                    }
                    onClick={handleClickShowPassword}
                    edge="end"
                  >
                    {showPassword ? (
                      <IoEyeOff className="text-2xl text-black" />
                    ) : (
                      <IoEye className="text-2xl text-[#3F80AE]" />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <div className="flex items-center justify-between mt-2">
            <div>
              <FormControlLabel
                control={<Checkbox name="rememberMe" color="primary" />}
                label="Remember me"
              />
            </div>
            <div>
              <Link
                to="/forgot-password"
                style={{
                  fontWeight: "600",
                  // textDecoration: "underline",
                  color: "#545454",
                }}
              >
                Forgot Password?
              </Link>
            </div>
          </div>

          <Button
            type="submit"
            fullWidth
            variant="contained"
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
            Sign In
          </Button>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
