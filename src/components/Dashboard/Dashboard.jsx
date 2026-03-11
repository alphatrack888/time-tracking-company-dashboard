import { useEffect, useState } from "react";
import { LuCalendar } from "react-icons/lu";
import { FaRegUser } from "react-icons/fa";
import { LuFolderKanban } from "react-icons/lu";

import {
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";

import EmployeeAreaChart from "../Chart/EmployeeAreaChart";
import {
  useDashboardOverviewQuery,
  useEmployeeByYearQuery,
  useProjectByYearQuery,
} from "../../Redux/api/dashboardApi";
import CompanyBarChart from "../Chart/CompanyBarChart";

export default function Dashboard() {
  const currentYear = new Date().getFullYear().toString();
  const [totalProjectByYear, setTotalProjectByYear] = useState(currentYear);
  // const [completedProjectByYear, setCompletedProjectByYear] = useState(2025);
  const [totalEmployeeByYear, setTotalEmployeeByYear] = useState(currentYear);

  const {
    data: dashboardOverviewData,
    isLoading,
    isError,
  } = useDashboardOverviewQuery();

  const dashboardData = dashboardOverviewData?.data;
  console.log("dashboardData", dashboardData);

  const { data: employeeByMonthData } =
    useEmployeeByYearQuery(totalEmployeeByYear);
  const employeeMonthData = employeeByMonthData?.data;
  console.log("employeeMonthData", employeeMonthData);

  const { data: companyByMonthData } =
    useProjectByYearQuery(totalProjectByYear);
  const companyMonthData = companyByMonthData?.data;
  console.log("companyMonthData", companyMonthData);

  const handleTotalProjectYearChange = (event) => {
    // console.log("year", event.target.value);
    setTotalProjectByYear(event.target.value);
  };
  // const handleCompletedProjectYearChange = (event) => {
  //   setCompletedProjectByYear(event.target.value);
  // };
  const handleTotalEmployeeYearChange = (event) => {
    // console.log("year", event.target.value);
    setTotalEmployeeByYear(event.target.value);
  };

  // console.log("yaaaaaaaaaaaaaaaaaar", year);

  useEffect(() => {
    if (!isError) return;
    const t = setTimeout(() => {
      window.location.reload();
    }, 3000);
    return () => clearTimeout(t);
  }, [isError]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[92vh]">
        <CircularProgress />
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
    <div className="bg-[#efefef] px-10 py-3 h-[92vh] w-full">
      <div className="flex flex-col gap-4 mt-2">
        <div className="flex items-center justify-between gap-5">
          <div className="flex flex-col items-center justify-center bg-white border border-gray-200 rounded-lg px-8 py-4 w-full h-28">
            <div className="flex items-center gap-2 text-[#333333]">
              <FaRegUser />
              <p className="font-medium text-lg">Total Employee</p>
            </div>
            <p className="text-[#333333] text-3xl font-semibold">
              {dashboardData?.totalEmployees}
            </p>
          </div>
          <div className="flex flex-col items-center justify-center bg-white border border-gray-200 rounded-lg px-8 py-4 w-full  h-28">
            <div className="flex items-center gap-2 text-[#333333]">
              <LuFolderKanban />
              <p className="font-medium text-lg">Total Projects</p>
            </div>
            <p className="text-[#333333] text-3xl font-semibold">
              {dashboardData?.totalProjects}
            </p>
          </div>
          <div className="flex flex-col items-center justify-center bg-white border border-gray-200 rounded-lg px-8 py-4 w-full  h-28">
            <div className="flex items-center gap-2 text-[#333333]">
              <LuFolderKanban />
              <p className="font-medium text-lg">Total Completed Projects</p>
            </div>
            <p className="text-[#333] text-3xl font-semibold">
              {dashboardData?.totalCompletedProjects}
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center gap-5 mt-5">
        <div className="bg-white shadow-xl w-full px-5 py-3">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-3">
              <p className="text-[#333333] font-semibold text-xl capitalize">
                total employee
              </p>
            </div>
            <div className="w-28">
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">
                  <div className="flex items-center">
                    <p>
                      <LuCalendar fontSize={20} />
                    </p>
                    {/* <p className="text-sm">Year</p> */}
                  </div>
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={totalEmployeeByYear}
                  label="Year"
                  onChange={handleTotalEmployeeYearChange}
                  className="h-8"
                >
                  <MenuItem value={2025}>2025</MenuItem>
                  <MenuItem value={2026}>2026</MenuItem>
                  <MenuItem value={2027}>2027</MenuItem>
                  <MenuItem value={2028}>2028</MenuItem>
                  <MenuItem value={2029}>2029</MenuItem>
                  <MenuItem value={2030}>2030</MenuItem>
                </Select>
              </FormControl>
            </div>
          </div>
          <div className="mt-5">
            <EmployeeAreaChart employeeMonthData={employeeMonthData} />
          </div>
        </div>
        <div className="flex items-center gap-3 w-full">
          {/* Project Bar Chart */}
          <div
            className="bg-white shadow-xl flex-2 px-5 py-3"
            style={{ minHeight: 325 }}
          >
            <div className="flex items-center justify-between">
              <p className="text-[#333333] font-semibold text-xl">
                Total Project
              </p>
              <div className="w-28">
                <FormControl fullWidth>
                  <InputLabel id="revenue-year-label">
                    <div className="flex items-center">
                      <p>
                        <LuCalendar fontSize={20} />
                      </p>
                      {/* <p className="text-sm">Year</p> */}
                    </div>
                  </InputLabel>
                  <Select
                    labelId="revenue-year-label"
                    id="revenue-year-select"
                    value={totalProjectByYear}
                    label="Year"
                    onChange={handleTotalProjectYearChange}
                    className="h-8"
                  >
                    <MenuItem value={2025}>2025</MenuItem>
                    <MenuItem value={2026}>2026</MenuItem>
                    <MenuItem value={2027}>2027</MenuItem>
                    <MenuItem value={2028}>2028</MenuItem>
                    <MenuItem value={2029}>2029</MenuItem>
                    <MenuItem value={2030}>2030</MenuItem>
                  </Select>
                </FormControl>
              </div>
            </div>
            <div className="flex mt-5 h-full">
              <CompanyBarChart
                selectedYear={totalProjectByYear}
                companyMonthData={companyMonthData}
              />
            </div>
          </div>

          {/* Project Pie Chart */}
          {/* <div
            className="bg-white shadow-xl flex-1 px-5 py-3"
            style={{ minHeight: 320 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#1A1A1A] font-semibold text-xl">
                  Complete Project Monthly
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <p className="font-medium">20% complete daily</p>
                </div>
              </div>
              <div className="w-28">
                <FormControl fullWidth>
                  <InputLabel id="service-year-label">
                    <div className="flex items-center">
                      <p>
                        <LuCalendar fontSize={20} />
                      </p>
                    </div>
                  </InputLabel>
                  <Select
                    labelId="service-year-label"
                    id="service-year-select"
                    value={completedProjectByYear}
                    label="Year"
                    onChange={handleCompletedProjectYearChange}
                    className="h-8"
                  >
                    <MenuItem value={2025}>2025</MenuItem>
                    <MenuItem value={2024}>2024</MenuItem>
                    <MenuItem value={2023}>2023</MenuItem>
                  </Select>
                </FormControl>
              </div>
            </div>
            <ProjectPieChart selectedYear={completedProjectByYear} />
          </div> */}
        </div>
      </div>
    </div>
  );
}
