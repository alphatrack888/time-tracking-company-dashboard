import React from "react";
import Sidebar from "../Shared/Sidebar";
import { Outlet } from "react-router-dom";
import Header from "../Shared/Header";

export default function DashboardLayout() {
  return (
    <div className="flex h-screen">
      <div className="sm:w-[15%]">
        <Sidebar />
      </div>
      <div className="w-full flex-1">
        <Header />
        <Outlet />
      </div>
    </div>
  );
}
