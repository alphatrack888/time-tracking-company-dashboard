import { useRef, useState } from "react";
import dayjs from "dayjs";
import {
  Modal,
  Backdrop,
  Fade,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Button,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { toast } from "sonner";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: 600,
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: 2,
  p: 2,
  maxHeight: "90vh",
  display: "flex",
  flexDirection: "column",
};

function lastNMonthsOptions(n = 12) {
  const months = [];
  const now = dayjs();
  for (let i = 0; i < n; i++) {
    const month = now.subtract(i, "month");
    months.push({
      value: month.format("YYYY-MM"),
      label: month.format("MMMM YYYY"),
    });
  }
  return months;
}

// Shared by both report types below — this modal is always for one employee
// at a time (opened from a table row), so there's no company/cross-company
// filter to add here, unlike the admin dashboard's reports page (Phase 8).
async function downloadReport(url, token, filename) {
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    let message = "Failed to generate report";
    try {
      const body = await response.json();
      message = body?.message || message;
    } catch {
      // Response wasn't JSON — keep the generic message.
    }
    throw new Error(message);
  }
  const blob = await response.blob();
  const blobUrl = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = blobUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(blobUrl);
}

export default function EmployeeReportModal({ open, onClose, employee }) {
  const [reportType, setReportType] = useState("monthly");
  const [month, setMonth] = useState("");
  const [startDate, setStartDate] = useState(dayjs().startOf("month"));
  const [endDate, setEndDate] = useState(dayjs());
  const [language, setLanguage] = useState("");
  const [format, setFormat] = useState("pdf");
  const [isDownloading, setIsDownloading] = useState(false);
  // React state alone isn't enough to stop a double-click: two clicks fired
  // before the next render lands would both read isDownloading as still
  // false. This ref is checked and set synchronously, in the same tick as
  // the first click, so a second call bails out immediately regardless of
  // render timing.
  const downloadInFlightRef = useRef(false);

  const monthOptions = lastNMonthsOptions(12);

  const resetForm = () => {
    setReportType("monthly");
    setMonth("");
    setStartDate(dayjs().startOf("month"));
    setEndDate(dayjs());
    setLanguage("");
    setFormat("pdf");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const validRange =
    reportType !== "attendance" || (startDate && endDate && !endDate.isBefore(startDate, "day"));
  const canDownload =
    employee && language && (reportType === "monthly" ? month : validRange) && !isDownloading;

  const handleDownload = async () => {
    if (!canDownload) return;
    if (reportType === "attendance" && !validRange) {
      toast.error("End date must not be before the start date.");
      return;
    }
    if (downloadInFlightRef.current) return;
    downloadInFlightRef.current = true;

    const token = sessionStorage.getItem("accessToken");
    const base = import.meta.env.VITE_BASE_URL;
    const extension = format === "excel" ? "xlsx" : "pdf";

    setIsDownloading(true);
    try {
      if (reportType === "monthly") {
        await downloadReport(
          `${base}/timetracker/reports/monthly?month=${month}&employee=${employee._id}&lang=${language}&format=${format}`,
          token,
          `report-${month}-${employee.name || "employee"}.${extension}`
        );
      } else {
        const startDateStr = startDate.format("YYYY-MM-DD");
        const endDateStr = endDate.format("YYYY-MM-DD");
        await downloadReport(
          `${base}/timetracker/reports/attendance?startDate=${startDateStr}&endDate=${endDateStr}&employee=${employee._id}&lang=${language}&format=${format}`,
          token,
          `attendance-${startDateStr}-to-${endDateStr}-${employee.name || "employee"}.${extension}`
        );
      }
      toast.success("Report downloaded.");
    } catch (err) {
      toast.error(err.message || "Failed to download report");
    } finally {
      downloadInFlightRef.current = false;
      setIsDownloading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{ backdrop: { timeout: 300 } }}
      aria-labelledby="employee-report-modal-title"
    >
      <Fade in={open}>
        <Box sx={modalStyle}>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <p className="text-sm">Employee:</p>
              <p className="text-lg font-semibold">
                {employee?.name || "Employee"}
              </p>
            </div>

            <div className="flex items-center justify-end gap-2">
              <Button
                onClick={handleClose}
                variant="outlined"
                size="small"
                sx={{ textTransform: "none" }}
              >
                Close
              </Button>
              <Button
                onClick={handleDownload}
                variant="outlined"
                size="small"
                disabled={!canDownload}
                sx={{ textTransform: "none" }}
              >
                {isDownloading ? <CircularProgress size={16} /> : "Download"}
              </Button>
            </div>
          </div>

          <ToggleButtonGroup
            value={reportType}
            exclusive
            size="small"
            onChange={(e, value) => value && setReportType(value)}
            sx={{ mb: 2 }}
          >
            <ToggleButton value="monthly" sx={{ textTransform: "none" }}>
              Monthly timesheet
            </ToggleButton>
            <ToggleButton value="attendance" sx={{ textTransform: "none" }}>
              Attendance report
            </ToggleButton>
          </ToggleButtonGroup>

          <div className="flex flex-wrap items-center gap-3 mb-1">
            {reportType === "monthly" ? (
              <FormControl size="small">
                <InputLabel id="report-month-label">Month</InputLabel>
                <Select
                  labelId="report-month-label"
                  value={month}
                  label="Month"
                  sx={{ width: "180px" }}
                  onChange={(e) => setMonth(e.target.value)}
                >
                  {monthOptions.map((m) => (
                    <MenuItem key={m.value} value={m.value}>
                      {m.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : (
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Start date"
                  value={startDate}
                  onChange={setStartDate}
                  slotProps={{ textField: { size: "small", sx: { width: "160px" } } }}
                />
                <DatePicker
                  label="End date"
                  value={endDate}
                  onChange={setEndDate}
                  slotProps={{ textField: { size: "small", sx: { width: "160px" } } }}
                />
              </LocalizationProvider>
            )}

            <FormControl size="small">
              <InputLabel id="report-lang-label">Language</InputLabel>
              <Select
                labelId="report-lang-label"
                value={language}
                label="Language"
                onChange={(e) => setLanguage(e.target.value)}
                sx={{ width: "120px" }}
              >
                <MenuItem value="en">English</MenuItem>
                <MenuItem value="de">German</MenuItem>
              </Select>
            </FormControl>

            <FormControl size="small">
              <InputLabel id="report-format-label">Format</InputLabel>
              <Select
                labelId="report-format-label"
                value={format}
                label="Format"
                onChange={(e) => setFormat(e.target.value)}
                sx={{ width: "120px" }}
              >
                <MenuItem value="pdf">PDF</MenuItem>
                <MenuItem value="excel">Excel</MenuItem>
              </Select>
            </FormControl>
          </div>
        </Box>
      </Fade>
    </Modal>
  );
}
