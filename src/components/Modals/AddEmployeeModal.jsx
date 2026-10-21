import React, { useState } from "react";
import {
  Modal,
  TextField,
  Box,
  Button,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { FaUpload } from "react-icons/fa";
import { MdOutlineLock } from "react-icons/md";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { toast } from "sonner";
import { useCreateEmployeeMutation } from "../../Redux/api/employeeApi";

export default function AddEmlpoyeeModal({
  openAddEmployeeModal,
  handleCloseAddEmployeeModal,
}) {
  const [employeeName, setEmployeeName] = useState("");
  const [employeeEmail, setEmployeeEmail] = useState("");
  const [employeeAddress, setEmployeeAddress] = useState("");
  const [employeePhone, setEmployeePhone] = useState("");
  const [employeeDesignation, setEmployeeDesignation] = useState("");
  const [employeePassword, setEmployeePassword] = useState("");
  const [employeeImage, setEmployeeImage] = useState(undefined);
  const [imagePreview, setImagePreview] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const [createEmployee] = useCreateEmployeeMutation();

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEmployeeImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddEmployee = async () => {
    const errors = {};
    if (!employeeName) errors.name = "Employee Name is required";
    if (!employeeEmail) errors.email = "Employee Email is required";
    if (!employeeAddress) errors.address = "Employee Address is required";
    if (!employeePhone) errors.phone = "Employee Phone is required";
    if (!employeeDesignation) errors.designation = "Employee Phone is required";
    if (!employeePassword) errors.password = "Employee Password is required";
    if (!employeeImage) errors.image = "Employee Logo is required";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const formData = new FormData();
    const employeeDetails = {
      name: employeeName,
      email: employeeEmail,
      address: employeeAddress,
      phone: employeePhone,
      designation: employeeDesignation,
      password: employeePassword,
      role: "employee",
    };
    console.log("employee details", employeeDetails);
    console.log("employeeImage", employeeImage);

    formData.append("data", JSON.stringify(employeeDetails));
    if (employeeImage) formData.append("images", employeeImage);

    try {
      const response = await createEmployee(formData).unwrap();
      console.log("Employee created successfully:", response);
      if (response.success) {
        toast.success("Employee Created Successfully..!");

        // Reset form
        setEmployeeName("");
        setEmployeeEmail("");
        setEmployeeAddress("");
        setEmployeePhone("");
        setEmployeeDesignation("");
        setEmployeePassword("");
        setEmployeeImage(undefined);
        setImagePreview(null);
        setFormErrors({});

        handleCloseAddEmployeeModal();
      }
    } catch (error) {
      console.error("Error creating employee:", error);
      toast.error("Failed to create employee");
      setFormErrors({
        submit: "Failed to create employee. Please try again later.",
      });
    }
  };

  return (
    <Modal
      open={openAddEmployeeModal}
      onClose={handleCloseAddEmployeeModal}
      aria-labelledby="add-employee-modal"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 800,
          bgcolor: "background.paper",
          borderRadius: 1,
          boxShadow: 24,
          p: 4,
        }}
      >
        <p className="text-[#1c1c1c] font-medium text-2xl mb-4">Add Employee</p>
        <form className="flex flex-col gap-3">
          <div className="flex gap-4 items-center">
            <TextField
              label="Name"
              fullWidth
              variant="outlined"
              margin="normal"
              value={employeeName}
              onChange={(e) => setEmployeeName(e.target.value)}
              error={!!formErrors.name}
              helperText={formErrors.name}
            />
            <TextField
              label="Email"
              fullWidth
              variant="outlined"
              margin="normal"
              value={employeeEmail}
              onChange={(e) => setEmployeeEmail(e.target.value)}
              error={!!formErrors.email}
              helperText={formErrors.email}
            />
          </div>
          <div className="flex gap-4 items-center">
            <TextField
              label="Address"
              fullWidth
              variant="outlined"
              margin="normal"
              value={employeeAddress}
              onChange={(e) => setEmployeeAddress(e.target.value)}
              error={!!formErrors.location}
              helperText={formErrors.location}
            />
            <TextField
              label="Employee Phone"
              fullWidth
              variant="outlined"
              margin="normal"
              value={employeePhone}
              onChange={(e) => setEmployeePhone(e.target.value)}
              error={!!formErrors.phone}
              helperText={formErrors.phone}
            />
          </div>
          <div className="flex gap-4 items-center">
            <TextField
              label="Designation"
              fullWidth
              variant="outlined"
              margin="normal"
              value={employeeDesignation}
              onChange={(e) => setEmployeeDesignation(e.target.value)}
              error={!!formErrors.designation}
              helperText={formErrors.designation}
            />
            <TextField
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              fullWidth
              required
              margin="normal"
              variant="outlined"
              placeholder="Enter your password"
              value={employeePassword}
              onChange={(e) => setEmployeePassword(e.target.value)}
              error={!!formErrors.password}
              helperText={formErrors.password}
              InputProps={{
                startAdornment: <MdOutlineLock className="mr-2" />,
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={
                        showPassword
                          ? "hide the password"
                          : "display the password"
                      }
                      onClick={handleClickShowPassword}
                      edge="end"
                    >
                      {showPassword ? (
                        <IoEyeOff className="text-2xl text-[#3F80AE]" />
                      ) : (
                        <IoEye className="text-2xl text-[#3F80AE]" />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </div>

          <div className="flex items-center gap-5">
            <div className="flex items-center gap-4 w-full">
              <div className="w-1/2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  style={{ display: "none" }}
                  id="employee-logo-upload"
                />
                <label htmlFor="employee-logo-upload">
                  <Button
                    component="span"
                    sx={{
                      width: "100%",
                      marginTop: "10px",
                      height: "55px",
                      border: "1px solid #3F80AE",
                    }}
                  >
                    <div className="flex items-center gap-2 text-[#3F80AE]">
                      <FaUpload />
                      <p>Upload Employee Image</p>
                    </div>
                  </Button>
                </label>
                {imagePreview && (
                  <div style={{ marginTop: "10px", textAlign: "center" }}>
                    <img
                      src={imagePreview}
                      alt="Logo Preview"
                      style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "contain",
                        marginTop: "10px",
                      }}
                    />
                  </div>
                )}
                {formErrors.logo && (
                  <p style={{ color: "red", fontSize: "12px" }}>
                    {formErrors.logo}
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <Button
                onClick={handleCloseAddEmployeeModal}
                sx={{
                  bgcolor: "#f0f0f0",
                  color: "black",
                  textTransform: "none",
                  width: "100px",
                  padding: "10px",
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
                  padding: "10px",
                  "&:hover": { bgcolor: "#70a4c7" },
                }}
              >
                Add Employee
              </Button>
            </div>
          </div>
        </form>
      </Box>
    </Modal>
  );
}
