import {
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useState } from "react";
import { AiTwotoneDelete } from "react-icons/ai";
import { GoEye } from "react-icons/go";
import { SlLock } from "react-icons/sl";
import { TbReport } from "react-icons/tb";
import EmployeeReportModal from "../Modals/EmployeeReportModal";
import { useDeleteCompanyMutation } from "../../Redux/api/employeeApi";

export default function EmployeeTable({
  filteredUsers,
  page,
  rowsPerPage,
  handleViewDetails,
  // handleOpenBlockModal,
  // handleOpenDeleteModal,
}) {
  const [reportOpen, setReportOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [deleteCompany] = useDeleteCompanyMutation();

  const handleOpenReportModal = (employee) => {
    setSelectedEmployee(employee);
    setReportOpen(true);
  };

  const handleCloseReportModal = () => {
    setReportOpen(false);
    setSelectedEmployee(null);
  };

  return (
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
                Contact No.
              </TableCell>
              <TableCell sx={{ fontWeight: 600, textAlign: "center" }}>
                Designation
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
            {filteredUsers
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((employee, index) => (
                <TableRow key={employee.eiinNo}>
                  <TableCell sx={{ textAlign: "center" }}>
                    {index + 1 + page * rowsPerPage}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {employee.name || "N/A"}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {employee.email || "N/A"}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {employee.phone || "N/A"}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {employee.designation || "N/A"}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    <div
                      className="text-white text-center px-2 py-1 rounded capitalize"
                      style={{
                        backgroundColor:
                          employee.status === "active"
                            ? "#008000"
                            : employee.status === "blocked"
                            ? "#CC0505"
                            : "gray",
                      }}
                    >
                      {employee.status || "N/A"}
                    </div>
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    <div className="flex items-center justify-center gap-2">
                      <IconButton
                        size="small"
                        onClick={() => handleViewDetails(employee)}
                        sx={{
                          color: "#fff",
                          fontSize: "20px",
                          bgcolor: "#658065",
                          width: "30px",
                          height: "30px",
                          borderRadius: "4px",
                          "&:hover": {
                            color: "#658065",
                            border: "1px solid #658065",
                          },
                        }}
                      >
                        <GoEye />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleOpenReportModal(employee)}
                        sx={{
                          color: "#fff",
                          fontSize: "20px",
                          bgcolor: "#3F80AE",
                          width: "30px",
                          height: "30px",
                          borderRadius: "4px",
                          "&:hover": {
                            color: "#3F80AE",
                            border: "1px solid #3F80AE",
                          },
                        }}
                      >
                        <TbReport />
                      </IconButton>
                      {/* <IconButton
                        size="small"
                        onClick={() => handleOpenBlockModal(employee)}
                        sx={{
                          color: "#fff",
                          fontSize: "20px",
                          bgcolor: "#3F80AE",
                          width: "30px",
                          height: "30px",
                          borderRadius: "4px",
                          "&:hover": {
                            color: "#3F80AE",
                            border: "1px solid #3F80AE",
                          },
                        }}
                      >
                        <SlLock />
                      </IconButton> */}
                      <IconButton
                        size="small"
                        onClick={() => deleteCompany(employee._id)}
                        sx={{
                          color: "#fff",
                          fontSize: "20px",
                          bgcolor: "#CC0505",
                          width: "30px",
                          height: "30px",
                          borderRadius: "4px",
                          "&:hover": {
                            color: "#CC0505",
                            border: "1px solid #CC0505",
                          },
                        }}
                      >
                        <AiTwotoneDelete />
                      </IconButton>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <EmployeeReportModal
        open={reportOpen}
        onClose={handleCloseReportModal}
        employee={selectedEmployee}
      />
    </div>
  );
}
