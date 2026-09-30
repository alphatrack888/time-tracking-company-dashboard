import { Card, CardContent, Button, CircularProgress } from "@mui/material";
import {
  useGetSubscriptionPlansQuery,
} from "../../Redux/api/dashboardApi";
import { GoDotFill } from "react-icons/go";
import { toast } from "sonner";

export default function Subscription() {
  const {
    data: subscriptionPlansData,
    isLoading,
    isError,
  } = useGetSubscriptionPlansQuery();

  const subscriptionPlans = subscriptionPlansData?.data || [];
  console.log("subscriptionPlans", subscriptionPlans);

  const handleSubscribe = (paymentUrl) => {
    if (paymentUrl) {
      toast.success("Redirecting to checkout payment page...");
      window.open(paymentUrl, "_blank");
    } else {
      toast.error("Payment URL not found for this plan.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[92vh]">
        <CircularProgress
          sx={{
            color: "#3F80AE",
            width: "50px !important",
            height: "50px !important",
          }}
        />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center text-red-500">
        <p>There was an error while loading your data.</p>
        <p>Please Reload</p>
      </div>
    );
  }

  return (
    <div className="px-10 py-8 bg-[#efefef] rounded-lg flex gap-8 justify-center items-center flex-wrap h-[90vh]">
      {subscriptionPlans.length > 0 ? (
        subscriptionPlans.map((subscription) => (
          <div
            className="flex flex-col gap-5 sm:w-[45%] md:w-[30%] max-w-[345px]"
            key={subscription.id}
          >
            <div className="bg-[#3F80AE] rounded-lg py-3 px-5 text-white">
              <div className="flex items-center justify-between">
                <p className="text-lg font-semibold">{subscription.name}</p>
                <p className="text-lg font-semibold"> ${subscription.price}</p>
              </div>
              <p className="text-xs mt-2">Payment Package</p>
            </div>
            <Card
              sx={{
                bgcolor: "#6599BE",
                borderRadius: "8px",
                padding: "8px",
              }}
            >
              <CardContent>
                <div className="flex flex-col gap-2 text-center text-white min-h-[350px]">
                  <p className="text-2xl">{subscription.name}</p>
                  <p className="text-3xl font-medium">${subscription.price}</p>
                  <p className="text-sm text-justify">
                    {subscription.description}
                  </p>
                  <div className="flex flex-col gap-2 mb-4">
                    {subscription.features.map((feature, index) => (
                      <div
                        key={index}
                        className="text-sm flex items-center gap-1"
                      >
                        <GoDotFill /> <p>{feature}</p>
                      </div>
                    ))}
                  </div>
                  <Button
                    variant="contained"
                    onClick={() => handleSubscribe(subscription.paymentUrl)}
                    sx={{
                      marginTop: "auto",
                      backgroundColor: "#3F80AE",
                      color: "white",
                      fontWeight: "bold",
                      textTransform: "none",
                      fontSize: "1rem",
                      borderRadius: "6px",
                      py: 1,
                      "&:hover": {
                        backgroundColor: "#2e6287",
                      },
                    }}
                  >
                    Subscribe
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        ))
      ) : (
        <p>No Subscription plan found.</p>
      )}
    </div>
  );
}
