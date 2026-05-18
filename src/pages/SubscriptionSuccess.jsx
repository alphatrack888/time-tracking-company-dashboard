import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";

export default function SubscriptionSuccess() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh] px-6 py-12 bg-[#efefef] rounded-lg">
      <div className="flex flex-col items-center max-w-md p-8 text-center bg-white shadow-lg rounded-2xl">
        <FaCheckCircle className="text-6xl text-[#3F80AE] mb-6 animate-bounce" />
        
        <h1 className="text-3xl font-bold text-gray-800 mb-3">
          Congratulations!
        </h1>
        
        <p className="text-lg font-semibold text-[#6599BE] mb-4">
          Subscription Activated Successfully
        </p>
        
        <p className="text-gray-500 text-sm leading-relaxed mb-8">
          Thank you for subscribing! Your payment has been processed successfully, and your account limits and pro features have been unlocked.
        </p>

        <Button
          variant="contained"
          onClick={() => navigate("/dashboard")}
          sx={{
            backgroundColor: "#3F80AE",
            color: "white",
            fontWeight: "bold",
            textTransform: "none",
            fontSize: "1.1rem",
            borderRadius: "8px",
            padding: "10px 32px",
            boxShadow: "0px 4px 12px rgba(63, 128, 174, 0.3)",
            "&:hover": {
              backgroundColor: "#2e6287",
            },
          }}
        >
          Go to Dashboard
        </Button>
      </div>
    </div>
  );
}
