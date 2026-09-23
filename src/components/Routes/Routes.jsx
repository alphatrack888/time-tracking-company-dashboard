import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import MainLayout from "../Layout/MainLayout";
import DashboardLayout from "../Layout/DashboardLayout";
import ProtectedRoute from "../../utils/ProtectedRoute";
import RouteError from "./RouteError";

const SignIn = lazy(() => import("../../pages/SignIn"));
const ForgotPassword = lazy(() => import("../../pages/ForgotPassword"));
const Dashboard = lazy(() => import("../Dashboard/Dashboard"));
const VerifyOtp = lazy(() => import("../../pages/VeryfiOTP"));
const UpdatePassword = lazy(() => import("../../pages/UpdatePassword"));
const UserStats = lazy(() => import("../Dashboard/CreateProject"));
const EmployeeStats = lazy(() => import("../Dashboard/EmployeeStats"));
const RunningProjects = lazy(() => import("../Dashboard/RunningProjects"));
const ChangePassword = lazy(() => import("../Dashboard/ChangePassword"));
const AddBreakTime = lazy(() => import("../Dashboard/AddBreakTime"));
const Profile = lazy(() => import("../Dashboard/Profile"));
const Subscription = lazy(() => import("../Dashboard/Subscription"));
const SubscriptionSuccess = lazy(() => import("../../pages/SubscriptionSuccess"));
const EmployeeLeaveList = lazy(() => import("../Dashboard/EmployeeLeaveList"));
const Notifications = lazy(() => import("../Dashboard/Notifications"));

const RouteLoading = () => (
  <div className="flex items-center justify-center h-screen">
    <CircularProgress />
  </div>
);

const withSuspense = element => <Suspense fallback={<RouteLoading />}>{element}</Suspense>;

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <RouteError />,
    children: [
      {
        path: "sign-in",
        element: withSuspense(<SignIn />),
      },
      {
        path: "forgot-password",
        element: withSuspense(<ForgotPassword />),
      },
      {
        path: "/verify-otp",
        element: withSuspense(<VerifyOtp />),
      },
      {
        path: "/update-password",
        element: withSuspense(<UpdatePassword />),
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
            element: withSuspense(<Dashboard />),
          },
          {
            path: "dashboard",
            element: withSuspense(<Dashboard />),
          },
          {
            path: "all-employee",
            element: withSuspense(<EmployeeStats />),
          },
          {
            path: "create-project",
            element: withSuspense(<UserStats />),
          },
          {
            path: "running-project",
            element: withSuspense(<RunningProjects />),
          },
          {
            path: "change-password",
            element: withSuspense(<ChangePassword />),
          },
          {
            path: "add-break-time",
            element: withSuspense(<AddBreakTime />),
          },
          {
            path: "subscription",
            element: withSuspense(<Subscription />),
          },
          {
            path: "subscription-success",
            element: withSuspense(<SubscriptionSuccess />),
          },
          {
            path: "employee-leave-list",
            element: withSuspense(<EmployeeLeaveList />),
          },
          {
            path: "notifications",
            element: withSuspense(<Notifications />),
          },
          {
            path: "profile",
            element: withSuspense(<Profile />),
          },
        ],
      },
    ],
  },
]);

export default router;
