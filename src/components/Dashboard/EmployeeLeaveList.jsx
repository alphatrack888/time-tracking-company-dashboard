import {
  Button,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Modal,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useEffect, useState } from "react";
import { AiTwotoneDelete } from "react-icons/ai";
import { GoEye } from "react-icons/go";
import { IoMdAdd } from "react-icons/io";
import AddOrEditLeaveModal from "../Modals/AddOrEditLeaveModal";
import {
  useGetLeaveRequestsQuery,
  useUpdateLeaveStatusMutation,
} from "../../Redux/api/leaveApi";
import dayjs from "dayjs";
import { leaveTypeLabel } from "../../constants/leaveTypes";

export default function EmployeeLeaveList() {
  const {
    data: allLeaveRequestData,
    isLoading,
    isError,
    refetch,
  } = useGetLeaveRequestsQuery();
  const leaveRequests = allLeaveRequestData?.data;
  console.log("allLeaveRequestData", leaveRequests);

  const [changeLeaveStatus] = useUpdateLeaveStatusMutation();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [openDetailsModal, setOpenDetailsModal] = useState(false);
  // const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openAddOrEditModal, setOpenAddOrEditModal] = useState(false);

  const handleViewLeaveDetails = (employeeId) => {
    setSelectedEmployee(employeeId);
    setOpenDetailsModal(true);
  };

  const handleAddOrOpenModal = () => {
    setOpenAddOrEditModal(true);
  };

  const closeAddOrOpenModal = () => {
    setOpenAddOrEditModal(false);
  };

  const handleCloseDetailsModal = () => {
    setOpenDetailsModal(false);
    setSelectedEmployee(null);
  };

  const handleApproveLeave = async () => {
    try {
      const response = await changeLeaveStatus({
        status: "approved",
        id: selectedEmployee._id,
      }).unwrap();
      console.log("approve response", response);
      console.log("Approved Leave for:", selectedEmployee._id);
      setOpenDetailsModal(false);
      setSelectedEmployee(null);
      refetch();
    } catch (error) {
      console.error("Error approving leave:", error);
    }
  };

  const handleRejectLeave = async () => {
    const updatedEmployee = { ...selectedEmployee, status: "rejected" };
    try {
      await changeLeaveStatus({
        id: selectedEmployee._id,
        status: "rejected",
      }).unwrap();
      console.log("Rejected Leave for:", updatedEmployee._id);
      setOpenDetailsModal(false);
      setSelectedEmployee(null);
      refetch();
    } catch (error) {
      console.error("Error rejecting leave:", error);
    }
  };

  // const handleOpenDeleteModal = (employee) => {
  //   setSelectedEmployee(employee);
  //   setOpenDeleteModal(true);
  // };

  // const handleCloseDeleteModal = () => {
  //   setOpenDeleteModal(false);
  //   setSelectedEmployee(null);
  // };

  // const handleDeleteEmployee = async () => {
  //   if (!selectedEmployee) {
  //     console.error("No employee selected for deletion.");
  //     return;
  //   }

  //   try {
  //     const response = await deleteLeaveRequest(selectedEmployee._id).unwrap();
  //     console.log("delete response", response);

  //     console.log("Deleted Employee Leave:", selectedEmployee.user.name);
  //     setOpenDeleteModal(false);
  //     setSelectedEmployee(null);
  //     refetch();
  //   } catch (error) {
  //     console.error("Error deleting leave request:", error);
  //   }
  // };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

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
    <div className="px-10 py-8 bg-[#efefef] h-[92vh] rounded-lg">
      <div className="flex items-center justify-between mb-5">
        <p className="text-lg font-medium">All Employee</p>
        <Button
          onClick={handleAddOrOpenModal}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "3px",
            textTransform: "none",
            bgcolor: "#3F80AE",
            color: "white",
            padding: "10px",
          }}
        >
          <IoMdAdd />
          <p>Manage Leave Category</p>
        </Button>
      </div>
      <div>
        <TableContainer component={Paper} sx={{ border: "1px solid #e6e6e6" }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#C3D8E6" }}>
                <TableCell sx={{ fontWeight: 600, textAlign: "center" }}>
                  Serial No.
                </TableCell>
                <TableCell sx={{ fontWeight: 600, textAlign: "center" }}>
                  Name
                </TableCell>
                <TableCell sx={{ fontWeight: 600, textAlign: "center" }}>
                  Email Address
                </TableCell>
                <TableCell sx={{ fontWeight: 600, textAlign: "center" }}>
                  Type
                </TableCell>
                <TableCell sx={{ fontWeight: 600, textAlign: "center" }}>
                  Status
                </TableCell>
                <TableCell sx={{ fontWeight: 600, textAlign: "center" }}>
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {leaveRequests.length > 0 ? (
                leaveRequests
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((employee, index) => (
                    <TableRow key={employee.serial}>
                      <TableCell sx={{ textAlign: "center" }}>
                        {index + 1}
                      </TableCell>
                      <TableCell sx={{ textAlign: "center" }}>
                        {employee.user.name}
                      </TableCell>
                      <TableCell sx={{ textAlign: "center" }}>
                        {employee.user.email}
                      </TableCell>

                      <TableCell
                        sx={{
                          textAlign: "center",
                          textTransform: "capitalize",
                        }}
                      >
                        {leaveTypeLabel(employee.type)}
                      </TableCell>
                      <TableCell sx={{ textAlign: "center" }}>
                        <div
                          style={{
                            backgroundColor:
                              employee.status === "approved"
                                ? "#008000"
                                : employee.status === "pending"
                                ? "#3F80AE"
                                : "#CC0505",
                            color: "white",
                            padding: "8px",
                            borderRadius: "5px",
                            textAlign: "center",
                            textTransform: "capitalize",
                          }}
                        >
                          {employee.status}
                        </div>
                      </TableCell>
                      <TableCell sx={{ textAlign: "center" }}>
                        <div className="flex items-center justify-center gap-2">
                          <IconButton
                            size="small"
                            onClick={() => handleViewLeaveDetails(employee)}
                            sx={{
                              color: "#fff",
                              fontSize: "20px",
                              bgcolor: "#658065",
                              width: "30px",
                              height: "30px",
                              borderRadius: "4px",
                              ":hover": {
                                bgcolor: "white",
                                color: "#658065",
                                border: "1px solid #658065",
                              },
                            }}
                          >
                            <GoEye />
                          </IconButton>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} sx={{ textAlign: "center" }}>
                    Nothing on leave list.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={leaveRequests.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </div>

      {/* Leave Details Modal */}
      <Modal
        open={openDetailsModal}
        onClose={handleCloseDetailsModal}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div className="w-[800px] bg-[#f0f0f0] p-8 rounded-lg">
          <div className="flex items-center gap-5">
            <div className="flex flex-col gap-5 text-end">
              <p>Employee Name:</p>
              <p>Leave Type:</p>
              <p>From Date:</p>
              <p>To Date:</p>
              <p>Total Days:</p>
              <p>Status:</p>
              <p>Reason:</p>
            </div>
            <div className="flex flex-col gap-5">
              <p className="font-medium">{selectedEmployee?.user.name}</p>
              <p className="font-medium">{leaveTypeLabel(selectedEmployee?.type)}</p>
              <p className="font-medium">
                {dayjs(selectedEmployee?.from).format("MM/DD/YYYY")}
              </p>
              <p className="font-medium">
                {dayjs(selectedEmployee?.to).format("MM/DD/YYYY")}
              </p>
              <p className="font-medium">{selectedEmployee?.totalDays}</p>
              <p
                className="font-medium capitalize w-24 text-center rounded-lg text-white"
                style={{
                  backgroundColor:
                    selectedEmployee?.status.toLowerCase() === "approved"
                      ? "#008000"
                      : selectedEmployee?.status.toLowerCase() === "pending"
                      ? "#FFDE00"
                      : selectedEmployee?.status.toLowerCase() === "rejected"
                      ? "#f44336"
                      : "#9e9e9e",
                }}
              >
                {selectedEmployee?.status}
              </p>
              <p className="font-medium text-wrap">
                {selectedEmployee?.reason}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 justify-end mt-10">
            <Button
              sx={{
                bgcolor: "#008000",
                color: "white",
                textTransform: "none",
                width: "100px",
                ":hover": {
                  bgcolor: "#fff",
                  color: "#008000",
                  border: "1px solid #008000",
                },
              }}
              onClick={handleApproveLeave}
            >
              Approve
            </Button>
            <Button
              sx={{
                bgcolor: "#fff",
                color: "#CC0505",
                border: "1px solid #CC0505",
                textTransform: "none",
                width: "100px",
                ":hover": {
                  bgcolor: "#CC0505",
                  color: "white",
                },
              }}
              onClick={handleRejectLeave}
            >
              Reject
            </Button>
          </div>
        </div>
      </Modal>

      <AddOrEditLeaveModal
        openAddOrEditModal={openAddOrEditModal}
        closeAddOrOpenModal={closeAddOrOpenModal}
      />
    </div>
  );
}
