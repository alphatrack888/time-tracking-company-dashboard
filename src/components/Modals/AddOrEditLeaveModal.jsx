/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import {
  Modal,
  TextField,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { toast } from "sonner";
import {
  useGetLeaveBalanceQuery,
  useManageLeaveMutation,
} from "../../Redux/api/leaveApi";
// Leavebalance fields (casualLeave, sickLeave, earnLeave, wpLeave) map to employee
// API leave types: casual | sick | earn | wp — see constants/leaveTypes.js.

export default function AddOrEditLeaveModal({
  openAddOrEditModal,
  closeAddOrOpenModal,
}) {
  const [formErrors, setFormErrors] = useState({});

  const { data: allLeaveBalanceData } = useGetLeaveBalanceQuery();
  const leaveBalanceData = allLeaveBalanceData?.data || {};
  console.log("leave balance data", leaveBalanceData);
  const [manageLeave] = useManageLeaveMutation();

  const [leaveBalance, setLeaveBalance] = useState({
    casualLeave: "",
    sickLeave: "",
    wpLeave: "",
    earnLeave: "",
  });

  // Update form fields when data is loaded
  useEffect(() => {
    if (leaveBalanceData && leaveBalanceData._id) {
      setLeaveBalance({
        casualLeave: leaveBalanceData.casualLeave || "",
        sickLeave: leaveBalanceData.sickLeave || "",
        wpLeave: leaveBalanceData.wpLeave || "",
        earnLeave: leaveBalanceData.earnLeave || "",
      });
    }
  }, [leaveBalanceData]);

  const handleAddEmployee = async () => {
    const errors = {};

    Object.keys(leaveBalance).forEach((key) => {
      if (!leaveBalance[key]) {
        errors[key] = `${key} is required`;
      }
    });

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const leaveDetails = {
      casualLeave: Number(leaveBalance.casualLeave),
      sickLeave: Number(leaveBalance.sickLeave),
      wpLeave: Number(leaveBalance.wpLeave),
      earnLeave: Number(leaveBalance.earnLeave),
    };
    console.log("leave details", leaveDetails);

    try {
      const response = await manageLeave(leaveDetails).unwrap();
      console.log("Employee created successfully:", response);
      if (response.success) {
        toast.success("Leave Created Successfully..!");

        // Reset form
        setLeaveBalance({
          casualLeave: "",
          sickLeave: "",
          wpLeave: "",
          earnLeave: "",
        });
        setFormErrors({});

        closeAddOrOpenModal();
      }
    } catch (error) {
      console.error("Error creating employee:", error);
      toast.error("Failed to create employee");
      setFormErrors({
        submit: "Failed to create employee. Please try again later.",
      });
    }
  };

  // Prepare table data
  const leaveTypes = [
    { label: "Casual Leave", key: "casualLeave" },
    { label: "Sick Leave", key: "sickLeave" },
    { label: "Leave Without Pay", key: "wpLeave" },
    { label: "Earn Leave", key: "earnLeave" },
  ];

  return (
    <Modal
      open={openAddOrEditModal}
      onClose={closeAddOrOpenModal}
      aria-labelledby="add-employee-modal"
      closeAfterTransition
      slotProps={{
        backdrop: {
          timeout: 500,
          sx: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            backdropFilter: "blur(3px)",
          },
        },
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 600,
          bgcolor: "background.paper",
          borderRadius: 1,
          boxShadow: 24,
          p: 4,
          maxHeight: "90vh",
          overflow: "auto",
          animation: openAddOrEditModal
            ? "slideIn 0.3s ease-out"
            : "slideOut 0.3s ease-in",
          "@keyframes slideIn": {
            "0%": {
              opacity: 0,
              transform: "translate(-50%, -45%) scale(0.95)",
            },
            "100%": {
              opacity: 1,
              transform: "translate(-50%, -50%) scale(1)",
            },
          },
          "@keyframes slideOut": {
            "0%": {
              opacity: 1,
              transform: "translate(-50%, -50%) scale(1)",
            },
            "100%": {
              opacity: 0,
              transform: "translate(-50%, -45%) scale(0.95)",
            },
          },
        }}
      >
        {/* Leave Balance Table */}
        {leaveBalanceData && leaveBalanceData._id && (
          <TableContainer component={Paper} sx={{ mb: 3, boxShadow: 1 }}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: "#3F80AE" }}>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Leave Type
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ color: "white", fontWeight: "bold" }}
                  >
                    Balance
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {leaveTypes.map((leave) => (
                  <TableRow key={leave.key} hover>
                    <TableCell>{leave.label}</TableCell>
                    <TableCell align="right">
                      {leaveBalanceData[leave.key] || 0}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <p className="text-[#3F80AE] font-medium text-2xl mb-1 text-center">
          Manage Leave Category
        </p>

        <form className="flex flex-col gap-1">
          <div className="flex flex-col items-center">
            <TextField
              label="Casual Leave"
              fullWidth
              variant="outlined"
              margin="normal"
              value={leaveBalance.casualLeave}
              onChange={(e) =>
                setLeaveBalance({
                  ...leaveBalance,
                  casualLeave: e.target.value,
                })
              }
              sx={{
                "& .MuiInputBase-root": {
                  height: "50px",
                },
              }}
            />
            <TextField
              label="Sick Leave"
              fullWidth
              variant="outlined"
              margin="normal"
              value={leaveBalance.sickLeave}
              onChange={(e) =>
                setLeaveBalance({
                  ...leaveBalance,
                  sickLeave: e.target.value,
                })
              }
              sx={{
                "& .MuiInputBase-root": {
                  height: "50px",
                },
              }}
            />
            <TextField
              label="Leave Without Pay"
              fullWidth
              variant="outlined"
              margin="normal"
              value={leaveBalance.wpLeave}
              onChange={(e) =>
                setLeaveBalance({
                  ...leaveBalance,
                  wpLeave: e.target.value,
                })
              }
              sx={{
                "& .MuiInputBase-root": {
                  height: "50px",
                },
              }}
            />
            <TextField
              label="Earn Leave"
              fullWidth
              variant="outlined"
              margin="normal"
              value={leaveBalance.earnLeave}
              onChange={(e) =>
                setLeaveBalance({
                  ...leaveBalance,
                  earnLeave: e.target.value,
                })
              }
              sx={{
                "& .MuiInputBase-root": {
                  height: "50px",
                },
              }}
            />
          </div>

          <div className="flex justify-end gap-2 mt-3">
            <Button
              onClick={closeAddOrOpenModal}
              sx={{
                bgcolor: "#f0f0f0",
                color: "black",
                textTransform: "none",
                width: "100px",
                padding: "5px",
                "&:hover": { bgcolor: "#e0e0e0" },
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddEmployee}
              sx={{
                bgcolor: "#3F80AE",
                color: "#fff",
                textTransform: "none",
                width: "130px",
                padding: "5px",
                "&:hover": { bgcolor: "#70a4c7" },
              }}
            >
              Submit Leave
            </Button>
          </div>
        </form>
      </Box>
    </Modal>
  );
}
