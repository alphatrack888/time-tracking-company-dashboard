import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../Layout/MainLayout";
import SignIn from "../../pages/SignIn";
import ForgotPassword from "../../pages/ForgotPassword";
import DashboardLayout from "../Layout/DashboardLayout";
import Dashboard from "../Dashboard/Dashboard";
import VerifyOtp from "../../pages/VeryfiOTP";
import UpdatePassword from "../../pages/UpdatePassword";
import UserStats from "../Dashboard/CreateProject";
import EmployeeStats from "../Dashboard/EmployeeStats";
import RunningProjects from "../Dashboard/RunningProjects";
import ChangePassword from "../Dashboard/ChangePassword";
import AddBreakTime from "../Dashboard/AddBreakTime";
import Profile from "../Dashboard/Profile";
import Subscription from "../Dashboard/Subscription";
import SubscriptionSuccess from "../../pages/SubscriptionSuccess";
import EmployeeLeaveList from "../Dashboard/EmployeeLeaveList";
import ProtectedRoute from "../../utils/ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "sign-in",
        element: <SignIn />,
      },
      {
        path: "forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "/verify-otp",
        element: <VerifyOtp />,
      },
      {
        path: "/update-password",
        element: <UpdatePassword />,
      },
      {
        path: "",
        element: (
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            path: "/",
            element: <Dashboard />,
          },
          {
            path: "dashboard",
            element: <Dashboard />,
          },
          {
            path: "all-employee",
            element: <EmployeeStats />,
          },
          {
            path: "create-project",
            element: <UserStats />,
          },
          {
            path: "running-project",
            element: <RunningProjects />,
          },
          {
            path: "change-password",
            element: <ChangePassword />,
          },
          {
            path: "add-break-time",
            element: <AddBreakTime />,
          },
          {
            path: "subscription",
            element: <Subscription />,
          },
          {
            path: "subscription-success",
            element: <SubscriptionSuccess />,
          },
          {
            path: "employee-leave-list",
            element: <EmployeeLeaveList />,
          },

          {
            path: "profile",
            element: <Profile />,
          },
        ],
      },
    ],
  },
]);

export default router;
