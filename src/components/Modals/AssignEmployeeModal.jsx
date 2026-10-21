import { useEffect, useMemo, useState } from "react";
import {
  Modal,
  Button,
  TextField,
  Chip,
  List,
  ListItem,
  ListItemText,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";
import { toast } from "sonner";

import { useAllEmployeeQuery } from "../../Redux/api/employeeApi";
import { useAssignEmployeeMutation } from "../../Redux/api/projectApi";

export default function AssignEmployeeModal({
  open,
  onClose,
  project,
  onUpdated,
}) {
  const { data: allEmployeeData, isLoading } = useAllEmployeeQuery();
  const allEmployee = allEmployeeData?.data?.data || [];
  const employees = allEmployee.map((employee) => ({
    name: employee.name,
    id: employee._id,
  }));

  console.log("employees", employees);

  const [updateProject] = useAssignEmployeeMutation();

  // employee picker
  const [openEmployeeModal, setOpenEmployeeModal] = useState(false);
  const [employeeInput, setEmployeeInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [assignedEmployees, setAssignedEmployees] = useState([]);

  const filteredEmployees = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return employees;
    return employees.filter((e) => e.name.toLowerCase().includes(q));
  }, [employees, searchQuery]);

  // prefill when project changes or modal opens
  useEffect(() => {
    if (!project) return;
    setAssignedEmployees((project.employees || []).map((e) => e._id));
    setEmployeeInput("");
    setSearchQuery("");
  }, [project, open]);

  const handleSelectEmployee = (employee) => {
    if (!assignedEmployees.includes(employee.id)) {
      setAssignedEmployees((prev) => [...prev, employee.id]);
    }
    setEmployeeInput(employee.name);
    setOpenEmployeeModal(false);
  };

  const handleRemoveEmployee = (employee) => {
    setAssignedEmployees((prev) => prev.filter((id) => id !== employee.id));
  };

  const handleAddEmployee = () => {
    const found = employees.find(
      (e) => e.name.toLowerCase() === employeeInput.toLowerCase()
    );
    if (found && !assignedEmployees.includes(found.id)) {
      setAssignedEmployees((prev) => [...prev, found.id]);
    }
    setEmployeeInput("");
  };

  const handleSubmit = async () => {
    if (!project?._id) return;

    const updatedData = {
      employees: assignedEmployees,
    };
    console.log("project data", updatedData);

    try {
      const res = await updateProject({
        id: project._id,
        data: updatedData,
      }).unwrap();
      console.log("api response", res);
      if (res?.success) {
        toast.success("Employee Assigned");
        onClose();
        onUpdated();
      } else {
        toast.error("Update failed");
      }
    } catch (err) {
      console.error(err);
      if (
        err?.data?.message ===
        "Cannot update project dates or time for projects with assigned employees. Please remove all employees first."
      ) {
        toast.error(
          "Cannot update project dates or time with assigned employees. Please remove all employees first."
        );
      } else {
        toast.error("Failed to update project");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[92vh]">
        <CircularProgress />
      </div>
    );
  }

  return (
    <Modal open={open} onClose={onClose}>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-10 py-8 bg-[#efefef] overflow-auto rounded-lg w-[95%] max-w-[1200px] shadow-lg">
        <p className="text-xl font-medium mb-5">Assign Employee</p>

        <div className="bg-white px-6 py-10 rounded-lg">
          <div className="flex items-center justify-between bg-[#ECF2F7] rounded-lg p-2">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="bg-[#C3D8E6] p-4 rounded-l-lg font-medium">
                Assigned To
              </p>
              <div className="flex gap-2 flex-wrap">
                {assignedEmployees.map((id) => {
                  const emp = employees.find((e) => e.id === id);
                  if (!emp) return null;
                  return (
                    <Chip
                      key={id}
                      label={emp.name}
                      onDelete={() => handleRemoveEmployee(emp)}
                      deleteIcon={<span style={{ color: "#CC0505" }}>×</span>}
                      sx={{ paddingX: "5px" }}
                    />
                  );
                })}
              </div>
              <div className="flex min-w-[260px]">
                <TextField
                  label="Mention Employee"
                  fullWidth
                  value={employeeInput}
                  onClick={() => setOpenEmployeeModal(true)}
                  onChange={(e) => setEmployeeInput(e.target.value)}
                  sx={{ background: "white" }}
                />
              </div>
            </div>
            <Button
              onClick={handleAddEmployee}
              disabled={!employeeInput}
              sx={{
                bgcolor: "#3F80AE",
                color: "white",
                padding: "10px",
                textTransform: "none",
                marginRight: "10px",
              }}
            >
              Mention Employee
            </Button>
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <Button
            variant="outlined"
            onClick={onClose}
            sx={{
              marginTop: "20px",
              width: "150px",
              height: "50px",
              textTransform: "none",
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{
              marginTop: "20px",
              width: "150px",
              height: "50px",
              textTransform: "none",
              bgcolor: "#3F80AE",
            }}
          >
            Assign
          </Button>
        </div>

        {/* Employee search modal */}
        <Modal
          open={openEmployeeModal}
          onClose={() => setOpenEmployeeModal(false)}
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "background.paper",
              boxShadow: 24,
              padding: 4,
              borderRadius: 2,
            }}
          >
            <TextField
              label="Search Here"
              variant="outlined"
              fullWidth
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ marginBottom: "10px", bgcolor: "#ECF2F7" }}
            />
            <List>
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map((employee, idx) => (
                  <ListItem
                    key={idx}
                    onClick={() => handleSelectEmployee(employee)}
                    sx={{ cursor: "pointer" }}
                  >
                    <ListItemText
                      primary={employee.name}
                      sx={{
                        bgcolor: "#ECF2F7",
                        padding: "10px",
                        borderRadius: "5px",
                      }}
                    />
                  </ListItem>
                ))
              ) : (
                <Typography>No employees found</Typography>
              )}
            </List>
          </Box>
        </Modal>
      </div>
    </Modal>
  );
}
