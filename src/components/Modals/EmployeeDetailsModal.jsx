import { useEffect, useState } from "react";

import { Button, Modal } from "@mui/material";

import { DateCalendar, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import EmployeeWorkingPieChart from "../Chart/EmployeeWorkingPieChart";
import EmployeeBreakPieChart from "../Chart/EmployeeBreakPieChart";
import EmployeeLineChart from "../Chart/EmployeeLineChart";

import { IoIosTrendingDown } from "react-icons/io";
import { FaArrowTrendUp } from "react-icons/fa6";
import { MdCheckCircle, MdOutlineFileUpload } from "react-icons/md";

import { toast } from "sonner";
import {
  useCreatePayrollMutation,
  useEmployeeAnalyticsQuery,
  useEmployeeLocationByDateQuery,
} from "../../Redux/api/employeeApi";

import Map from "../UI/Map";
import dayjs from "dayjs";
import { millisecondsToHMSConverter } from "../../utils/TimeConverter";

export default function EmployeeDetailsModal({
  openDetailsModal,
  handleCloseModal,
  selectedEmployee,
}) {
  const [activeButton, setActiveButton] = useState("list");
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectStartDate, setSelectStartDate] = useState(null);
  const [selectEndDate, setSelectEndDate] = useState(null);
  const [mapCenter, setMapCenter] = useState([]);

  const [openPayrollModal, setOpenPayrollModal] = useState(false);
  const [payrollEmployeeId, setPayrollEmployeeId] = useState(null);
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");

  const today = dayjs().format("YYYY-MM-DD");

  const { data: allEmpolyeeLocationData, isLoading } =
    useEmployeeLocationByDateQuery(
      { date: selectedDate, employeeId: selectedEmployee?._id },
      { skip: !selectedDate || !selectedEmployee?._id }
    );

  const allEmpolyeeLocation = allEmpolyeeLocationData?.data?.data;
  console.log("empolyeeLocationData", allEmpolyeeLocation);
  // console.log("selected employee", selectedEmployee);

  const { data: selectedEmployeeAnalytics, isLoading: loadingAnalytics } =
    useEmployeeAnalyticsQuery(
      {
        startDate: selectStartDate || today,
        endDate: selectEndDate || today,
        employeeId: selectedEmployee?._id,
      }
      // { skip: !selectStartDate || !selectEndDate || !selectedEmployee?._id }
    );
  const employeeAnalytics = selectedEmployeeAnalytics?.data;
  // console.log("employeeAnalytics", employeeAnalytics);

  const filteredEmployeeLocation = allEmpolyeeLocation?.filter((location) => {
    const locationDate = dayjs(location.timestamp).format("YYYY-MM-DD");
    return locationDate === selectedDate;
  });

  console.log("filteredEmployeeLocation", filteredEmployeeLocation);

  useEffect(() => {
    if (filteredEmployeeLocation) {
      const coordinates = filteredEmployeeLocation.map(
        (location) => location.coordinates
      );
      if (JSON.stringify(coordinates) !== JSON.stringify(mapCenter)) {
        setMapCenter(coordinates);
      }
    }
  }, [filteredEmployeeLocation, mapCenter]);

  // console.log("mapCenter", mapCenter);

  const [createPayroll] = useCreatePayrollMutation();

  // console.log("selectedEmployee", selectedEmployee);

  const workingHours = employeeAnalytics?.currentPeriod?.workingHours;
  const breakHours = employeeAnalytics?.currentPeriod?.breakHours;
  const totalHours =
    employeeAnalytics?.currentPeriod?.workingHours +
    employeeAnalytics?.currentPeriod?.breakHours;

  const handleButtonClick = (buttonType) => {
    setActiveButton(buttonType);
  };

  const handlePayrollModal = (employeeId) => {
    console.log("payroll employee", employeeId);
    setPayrollEmployeeId(employeeId);
    handleCloseModal();
    setOpenPayrollModal(true);
  };

  const handleClosePayrollModal = () => {
    setOpenPayrollModal(false);
  };

  const handleSelectDate = () => {
    setShowCalendar(true);
  };

  const handleChooseDate = (date) => {
    setShowCalendar(false);
    const formattedDate = dayjs(date).format("YYYY-MM-DD");
    console.log("Selected Date:", formattedDate);
    setSelectedDate(formattedDate);
  };
  const handleStartDate = (date) => {
    const formattedDate = dayjs(date).format("YYYY-MM-DD");
    console.log("Selected Start Date:", formattedDate);
    setSelectStartDate(formattedDate);
  };
  const handleEndDate = (date) => {
    setShowCalendar(false);
    const formattedDate = dayjs(date).format("YYYY-MM-DD");
    console.log("Selected End Date:", formattedDate);
    setSelectEndDate(formattedDate);
  };

  const handleFileUpload = (event) => {
    const selectedFile = event.target.files[0];
    console.log(selectedFile);
    if (selectedFile) {
      setFile(selectedFile);
      setError("");
    }
  };

  const handleUploadPayroll = async () => {
    if (!file) {
      setError("Please select a file to upload.");
      console.log("Error", error);
      toast.error("Please select a file to upload.");
    }
    const formData = new FormData();
    if (file) formData.append("documents", file);
    console.log("create payroll", file, payrollEmployeeId);

    const data = {
      id: payrollEmployeeId,
      data: formData,
    };

    console.log(data);

    try {
      const response = await createPayroll(data).unwrap();

      console.log("Payroll file uploaded:", response);
      if (response.success) {
        toast.success("Payroll file uploaded successfully.");
        setOpenPayrollModal(false);
        setFile(null);
      }
    } catch (error) {
      console.error("Error uploading payroll:", error);
      toast.error("Failed to upload payroll file.");
    }
  };

  // const handleDateSelect = (date) => {
  //   setShowCalendar(false);
  //   console.log("Selected Date:", date);
  // };

  if (isLoading || loadingAnalytics) {
    <div>Loading</div>;
  }

  return (
    <div>
      <Modal
        open={openDetailsModal}
        onClose={handleCloseModal}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div className="bg-[#efefef] p-4 rounded-lg shadow-lg relative w-[90%] max-w-[1200px] h-[90vh] overflow-y-auto">
          {selectedEmployee && (
            <div>
              {/* Top */}
              <div className="flex flex-col gap-2 bg-white p-3 rounded-lg">
                <p className="font-medium mb-1">View Details</p>
                <div className="flex items-center gap-10">
                  <img
                    src={selectedEmployee?.profile}
                    alt={selectedEmployee.name}
                    style={{
                      width: "120px",
                      height: "120px",
                      marginBottom: "10px",
                      borderRadius: "10px",
                    }}
                  />
                  <div className="flex flex-col gap-2">
                    <div>
                      <strong>Name:</strong> {selectedEmployee.name}
                    </div>
                    <div>
                      <strong>Email:</strong> {selectedEmployee.email}
                    </div>
                    <div>
                      <strong>Contact:</strong> {selectedEmployee.phone}
                    </div>
                    {selectedEmployee.designation && (
                      <div>
                        <strong>Designation:</strong>{" "}
                        {selectedEmployee.designation}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {/* Mid */}
              <div className="flex items-center">
                <div
                  className={`flex items-center ${activeButton === "map" ? "justify-between" : "justify-start"
                    } w-full`}
                >
                  {activeButton === "map" && (
                    <div className="flex items-center gap-3">
                      <Button
                        sx={{
                          textTransform: "none",
                          bgcolor:
                            activeButton === "list" ? "#3F80AE" : "transparent",
                          border: "1px solid #3F80AE",
                          width: "100px",
                          color: activeButton === "list" ? "white" : "#3F80AE",
                        }}
                        onClick={handleSelectDate}
                      >
                        Select Date
                      </Button>
                      <p className="text-[#3F80AE] font-medium text-lg">
                        {selectedDate ? selectedDate : "Please Select a Date"}
                      </p>
                    </div>
                  )}
                  <div className="flex items-center gap-3 my-2">
                    <Button
                      onClick={() => handlePayrollModal(selectedEmployee._id)}
                      sx={{
                        textTransform: "none",
                        border: "1px solid #3F80AE",
                        color: "#3F80AE",
                      }}
                    >
                      Upload Payroll
                    </Button>

                    <Button
                      sx={{
                        textTransform: "none",
                        bgcolor:
                          activeButton === "list" ? "#3F80AE" : "transparent",
                        border: "1px solid #3F80AE",
                        width: "100px",
                        color: activeButton === "list" ? "white" : "#3F80AE",
                      }}
                      onClick={() => handleButtonClick("list")}
                    >
                      List View
                    </Button>
                    <Button
                      sx={{
                        textTransform: "none",
                        bgcolor:
                          activeButton === "map" ? "#3F80AE" : "transparent",
                        border: "1px solid #3F80AE",
                        width: "100px",
                        color: activeButton === "map" ? "white" : "#3F80AE",
                      }}
                      onClick={() => handleButtonClick("map")}
                    >
                      Map View
                    </Button>
                    {!selectStartDate && !selectEndDate && (
                      <p className="text-red-500 text-sm mt-2">
                        Please select start and end date
                      </p>
                    )}
                  </div>
                </div>
              </div>
              {activeButton === "list" && (
                <div>
                  <div className=" mb-3 rounded-lg flex gap-3">
                    <div className="flex bg-white w-full p-4 rounded-lg h-[310px]">
                      {/* <div className="flex flex-col gap-1">
                        <Button
                          sx={{
                            textTransform: "none",
                            color: "#545454",
                            fontSize: "10px",
                            width: "100%",
                          }}
                        >
                          Today
                        </Button>
                        <hr className="border-[#E6E6E6]" />
                        <Button
                          sx={{
                            textTransform: "none",
                            color: "#545454",
                            fontSize: "10px",
                            width: "100%",
                          }}
                        >
                          Yesterday
                        </Button>
                        <hr className="border-[#E6E6E6]" />
                        <Button
                          sx={{
                            textTransform: "none",
                            color: "#545454",
                            fontSize: "10px",
                            width: "100%",
                          }}
                        >
                          This Week
                        </Button>
                        <hr className="border-[#E6E6E6]" />
                        <Button
                          sx={{
                            textTransform: "none",
                            color: "#545454",
                            fontSize: "10px",
                          }}
                        >
                          Last Week
                        </Button>
                        <hr className="border-[#E6E6E6]" />
                        <Button
                          sx={{
                            textTransform: "none",
                            color: "#545454",
                            fontSize: "10px",
                          }}
                        >
                          This Month
                        </Button>
                        <hr className="border-[#E6E6E6]" />
                        <Button
                          sx={{
                            textTransform: "none",
                            color: "#545454",
                            fontSize: "10px",
                          }}
                        >
                          Next Month
                        </Button>
                        <hr className="border-[#E6E6E6]" />
                      </div> */}
                      <div className="flex flex-col items-center w-full">
                        <p>
                          Start Date:{" "}
                          <span className="text-[#3F80AE] font-medium">
                            {" "}
                            {selectStartDate}
                          </span>
                        </p>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DateCalendar
                            sx={{ height: 280, width: "80%" }}
                            onChange={handleStartDate}
                            value={
                              selectStartDate ? dayjs(selectStartDate) : null
                            }
                          />
                        </LocalizationProvider>
                      </div>
                    </div>
                    <div className="flex flex-col items-center bg-white p-5 w-full rounded-lg h-[310px]">
                      <p>
                        End Date:{" "}
                        <span className="text-[#3F80AE] font-medium">
                          {selectEndDate}
                        </span>
                      </p>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateCalendar
                          sx={{ height: 280, width: "80%" }}
                          onChange={handleEndDate}
                          value={selectEndDate ? dayjs(selectEndDate) : null}
                        />
                      </LocalizationProvider>
                    </div>
                  </div>

                  {/* Low */}
                  <div className="flex items-center gap-3">
                    {/* left */}
                    <div className="bg-white w-1/2 p-4 flex flex-col items-center rounded-lg">
                      <p className="text-lg font-semibold text-[#3F80AE]">
                        Working Stats
                      </p>

                      <EmployeeWorkingPieChart
                        workingHours={workingHours}
                        totalHours={totalHours}
                      />

                      <div className="flex items-center gap-5">
                        <div
                          className={`flex items-center gap-2 font-semibold ${employeeAnalytics?.comparison?.breakHours?.trend ===
                              "increase"
                              ? "text-green-600"
                              : "text-red-600"
                            }`}
                        >
                          <p className="text-sm">
                            {millisecondsToHMSConverter(
                              employeeAnalytics?.comparison?.workingHours
                                ?.difference
                            )}
                          </p>
                          {employeeAnalytics?.comparison?.workingHours
                            ?.trend === "increase" ? (
                            <FaArrowTrendUp className="bg-[#D7E8F3] size-8 p-1 rounded-full" />
                          ) : (
                            <IoIosTrendingDown className="bg-[#D7E8F3] size-8 p-1 rounded-full" />
                          )}
                        </div>{" "}
                        <div
                          className={`flex items-center gap-2 font-semibold ${employeeAnalytics?.comparison?.breakHours?.trend ===
                              "increase"
                              ? "text-green-600"
                              : "text-red-600"
                            }`}
                        >
                          <p className="text-sm">
                            {" "}
                            {
                              employeeAnalytics?.comparison?.workingHours
                                ?.percentage
                            }
                            %
                          </p>
                          {employeeAnalytics?.comparison?.workingHours
                            ?.trend === "increase" ? (
                            <FaArrowTrendUp className="bg-[#D7E8F3] size-8 p-1 rounded-full" />
                          ) : (
                            <IoIosTrendingDown className="bg-[#D7E8F3] size-8 p-1 rounded-full" />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* mid */}
                    <div className="bg-white w-1/2 p-4 flex flex-col items-center rounded-lg">
                      <p className="text-lg font-semibold text-[#3F80AE]">
                        Break Stats
                      </p>

                      <EmployeeBreakPieChart
                        totalHours={totalHours}
                        breakHours={breakHours}
                      />

                      <div className="flex items-center gap-5">
                        <div
                          className={`flex items-center gap-2 font-semibold ${employeeAnalytics?.comparison?.breakHours?.trend ===
                              "increase"
                              ? "text-green-600"
                              : "text-red-600"
                            }`}
                        >
                          <p className="text-sm">
                            {millisecondsToHMSConverter(
                              employeeAnalytics?.comparison?.breakHours
                                ?.difference
                            )}
                          </p>
                          {employeeAnalytics?.comparison?.breakHours?.trend ===
                            "increase" ? (
                            <FaArrowTrendUp className="bg-[#D7E8F3] size-8 p-1 rounded-full" />
                          ) : (
                            <IoIosTrendingDown className="bg-[#D7E8F3] size-8 p-1 rounded-full" />
                          )}{" "}
                        </div>{" "}
                        <div
                          className={`flex items-center gap-2 font-semibold ${employeeAnalytics?.comparison?.breakHours?.trend ===
                              "increase"
                              ? "text-green-600"
                              : "text-red-600"
                            }`}
                        >
                          <p className="text-sm">
                            {
                              employeeAnalytics?.comparison?.breakHours
                                ?.percentage
                            }
                            %
                          </p>
                          {employeeAnalytics?.comparison?.breakHours?.trend ===
                            "increase" ? (
                            <FaArrowTrendUp className="bg-[#D7E8F3] size-8 p-1 rounded-full" />
                          ) : (
                            <IoIosTrendingDown className="bg-[#D7E8F3] size-8 p-1 rounded-full" />
                          )}{" "}
                        </div>
                      </div>
                    </div>
                    {/* chart */}
                    <div className="w-full bg-white p-4 rounded-lg">
                      <EmployeeLineChart
                        chartData={employeeAnalytics?.chartData}
                      />
                    </div>
                    <div>
                      <div></div>
                    </div>
                  </div>
                </div>
              )}
              {activeButton === "map" && (
                <div>
                  <Map center={mapCenter}></Map>
                </div>
              )}
            </div>
          )}
          {showCalendar && (
            <div className="flex justify-center mt-4 absolute bottom-32 left-32">
              <div className="bg-white p-4 rounded-lg shadow-md">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateCalendar
                    sx={{ height: 280, width: "100%" }}
                    onChange={handleChooseDate}
                  />
                </LocalizationProvider>
                <div className="flex justify-center mt-3">
                  <Button
                    sx={{
                      bgcolor: "#3F80AE",
                      color: "white",
                      textTransform: "none",
                    }}
                    onClick={() => handleChooseDate(selectedDate)}
                  >
                    Choose Date
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </Modal>

      {/* Payroll Upload Modal */}
      <Modal
        open={openPayrollModal}
        onClose={handleClosePayrollModal}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          className="bg-white p-6 rounded-lg shadow-lg w-[400px]"
          style={{ minWidth: "300px" }}
        >
          <h3 className="text-lg font-semibold mb-3">Upload Payroll</h3>

          <Button
            variant="outlined"
            component="label"
            fullWidth
            sx={{
              height: "40px",
              width: "200px",
              textTransform: "none",
              outline: "none",
              border: "1px solid #ccc",
              borderRadius: "4px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              cursor: "pointer",
              flexDirection: "column",
              backgroundColor: file ? "#f0f7ff" : "transparent",
              borderColor: file ? "#3F80AE" : "#ccc",
              "&:hover": {
                backgroundColor: file ? "#e6f2ff" : "transparent",
                borderColor: "#3F80AE",
              },
            }}
          >
            <div className="flex items-center gap-1 text-[#3F80AE]">
              {file ? (
                <>
                  <MdCheckCircle size={18} />
                  <p
                    className="text-xs truncate max-w-[150px]"
                    title={file.name}
                  >
                    {file.name}
                  </p>
                </>
              ) : (
                <>
                  <p>Upload Payroll</p>
                  <MdOutlineFileUpload />
                </>
              )}
            </div>

            <input type="file" hidden onChange={handleFileUpload} />
          </Button>
          <div className="flex justify-between mt-4">
            <Button
              sx={{
                textTransform: "none",
                bgcolor: "#3F80AE",
                color: "white",
                width: "100px",
              }}
              onClick={handleUploadPayroll}
              disabled={!file}
            >
              Upload
            </Button>
            <Button
              sx={{
                textTransform: "none",
                color: "#3F80AE",
                border: "1px solid #3F80AE",
                width: "100px",
              }}
              onClick={handleClosePayrollModal}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
