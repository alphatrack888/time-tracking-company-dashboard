/* eslint-disable no-unused-vars */
import { useState } from "react";
import {
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  TablePagination,
  Button,
  CircularProgress,
} from "@mui/material";
import EmployeeDetailsModal from "../Modals/EmployeeDetailsModal";
import BlockConfirmationModal from "../Modals/BlockConfirmationModal";
import DeleteConfirmationModal from "../Modals/DeleteConfirmationModal";
import EmployeeTable from "../UI/EmployeeTable";
import { useAllEmployeeQuery } from "../../Redux/api/employeeApi";
import AddEmployeeModal from "../Modals/AddEmployeeModal";

export default function EmployeeStats() {
  const { data: allEmployeeData, isLoading } = useAllEmployeeQuery();
  const allEmployee = allEmployeeData?.data?.data || [];
  // console.log("allEmployee", allEmployee);

  const [searchText, setSearchText] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openDetailsModal, setOpenDetailsModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [openBlockModal, setOpenBlockModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openAddEmployeeModal, setOpenAddEmployeeModal] = useState(false);

  const filterUsers = () => {
    let filtered = allEmployee;

    if (selectedStatus && selectedStatus !== "all") {
      filtered = filtered.filter(
        (employee) => employee.status === selectedStatus
      );
    }

    if (searchText) {
      filtered = filtered.filter((employee) =>
        employee.name.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    return filtered;
  };

  const handleFilterStatus = (e) => {
    setSelectedStatus(e.target.value);
  };

  const handleViewDetails = (employee) => {
    setSelectedEmployee(employee);
    setOpenDetailsModal(true);
  };

  const handleCloseModal = () => {
    setOpenDetailsModal(false);
    setSelectedEmployee(null);
  };

  const handleOpenBlockModal = (employee) => {
    setSelectedEmployee(employee);
    setOpenBlockModal(true);
  };

  const handleCloseBlockModal = () => {
    setOpenBlockModal(false);
    setSelectedEmployee(null);
  };

  const handleOpenDeleteModal = (employee) => {
    setSelectedEmployee(employee);
    setOpenDeleteModal(true);
  };

  const handleOpenAddEmployeeModal = () => {
    setOpenAddEmployeeModal(true);
  };

  const handleCloseAddEmployeeModal = () => {
    setOpenAddEmployeeModal(false);
  };

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
    setSelectedEmployee(null);
  };

  const handleAddEmployee = (employeeData) => {
    console.log("Employee added:", employeeData);
    handleCloseAddEmployeeModal();
  };

  const handleBlockEmployee = () => {
    console.log(`Blocked ${selectedEmployee.name}`);
    handleCloseBlockModal();
  };

  const handleDeleteEmployee = () => {
    console.log(`Deleted ${selectedEmployee.name}`);
    handleCloseDeleteModal();
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[92vh]">
        <CircularProgress />
      </div>
    );
  }

  const filteredUsers = filterUsers();

  return (
    <div className="px-10 py-8 bg-[#efefef] h-[92vh]">
      <div className="flex items-center justify-between">
        <p className="text-[#1c1c1c] font-medium text-2xl capitalize">
          all employee
        </p>

        <div className="flex items-center gap-4">
          <Button
            sx={{
              bgcolor: "#3F80AE",
              color: "#fff",
              textTransform: "none",
              padding: "10px 20px",
              "&:hover": { bgcolor: "#70a4c7" },
            }}
            onClick={handleOpenAddEmployeeModal}
          >
            + Add Employee
          </Button>

          <FormControl sx={{ minWidth: 200 }} size="small">
            <InputLabel>Status</InputLabel>
            <Select
              label="Status"
              value={selectedStatus}
              onChange={handleFilterStatus}
              sx={{ height: "50px" }}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="restricted">Restricted</MenuItem>
            </Select>
          </FormControl>
        </div>
      </div>

      <div className="mt-6">
        <EmployeeTable
          filteredUsers={filteredUsers}
          page={page}
          rowsPerPage={rowsPerPage}
          handleViewDetails={handleViewDetails}
          handleOpenBlockModal={handleOpenBlockModal}
          handleOpenDeleteModal={handleOpenDeleteModal}
        />

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredUsers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </div>

      {/* Details Modal */}
      <EmployeeDetailsModal
        openDetailsModal={openDetailsModal}
        handleCloseModal={handleCloseModal}
        selectedEmployee={selectedEmployee}
      />

      {/* Block Confirmation Modal */}
      <BlockConfirmationModal
        openBlockModal={openBlockModal}
        handleCloseBlockModal={handleCloseBlockModal}
        handleBlockEmployee={handleBlockEmployee}
        selectedEmployee={selectedEmployee}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        openDeleteModal={openDeleteModal}
        handleCloseDeleteModal={handleCloseDeleteModal}
        selectedEmployee={selectedEmployee}
        handleDeleteEmployee={handleDeleteEmployee}
      />
      <AddEmployeeModal
        openAddEmployeeModal={openAddEmployeeModal}
        handleCloseAddEmployeeModal={handleCloseAddEmployeeModal}
        handleAddEmployee={handleAddEmployee}
      />
    </div>
  );
}
