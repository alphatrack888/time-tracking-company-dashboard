/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Chip,
  Box,
  InputAdornment,
  Modal,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
} from "@mui/material";
import { LuImageUp } from "react-icons/lu";
import { AiFillAudio } from "react-icons/ai";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { useAllEmployeeQuery } from "../../Redux/api/employeeApi";
import { useCreateProjectMutation } from "../../Redux/api/projectApi";
import { toast } from "sonner";

const CreateProject = () => {
  const { data: allEmployeeData, isLoading } = useAllEmployeeQuery();
  const allEmployee = allEmployeeData?.data?.data || [];
  const employees = allEmployee.map((employee) => ({
    name: employee.name,
    id: employee._id,
  }));

  console.log("employees", employees);

  const [projectName, setProjectName] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [projectTime, setProjectTime] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [assignedEmployees, setAssignedEmployees] = useState([]);
  const [employeeInput, setEmployeeInput] = useState("");
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [audioPreview, setAudioPreview] = useState(null);
  const [error, setError] = useState("");

  const [openModal, setOpenModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredEmployees, setFilteredEmployees] = useState(employees);

  const [createProject] = useCreateProjectMutation();

  const handleAddEmployee = () => {
    if (selectedEmployeeId && !assignedEmployees.includes(selectedEmployeeId)) {
      setAssignedEmployees([...assignedEmployees, selectedEmployeeId]);
      setEmployeeInput("");
      setSelectedEmployeeId(null);
    }
  };

  console.log("assignedEmployees", assignedEmployees);

  const handleRemoveEmployee = (employee) => {
    setAssignedEmployees(assignedEmployees.filter((emp) => emp !== employee));
  };

  const handleSelectEmployee = (employee) => {
    setEmployeeInput(employee.name); // Display name in input field
    setSelectedEmployeeId(employee.id); // Store id to send to the API
    setOpenModal(false); // Close modal after selection
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleAudioUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith("audio/")) {
        setAudioFile(file);
        const reader = new FileReader();

        reader.onloadend = () => {
          setAudioPreview(reader.result);
        };

        reader.readAsDataURL(file);
        setError("");
      } else {
        setError("Please upload a valid audio file.");
        setAudioFile(null);
      }
    }
  };

  const handleSubmit = async () => {
    if (
      !projectName ||
      !projectTime ||
      !projectDescription ||
      !startDate ||
      !endDate
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    const formData = new FormData();
    const projectData = {
      title: projectName,
      projectTime: Number(projectTime),
      description: projectDescription,
      employees: assignedEmployees,
      startDate: startDate?.toISOString(),
      endDate: endDate?.toISOString(),
    };
    console.log("project data", projectData);
    console.log("image", image);

    formData.append("data", JSON.stringify(projectData));
    if (image) formData.append("images", image);
    if (audioFile) formData.append("audio", audioFile);

    try {
      const response = await createProject(formData).unwrap();
      console.log("api response", response);
      if (response.success) {
        toast.success("Project created successfully!");

        setProjectName("");
        setStartDate(null);
        setEndDate(null);
        setProjectTime("");
        setProjectDescription("");
        setImage(null);
        setImagePreview(null);
        setAudioFile(null);
        setAudioPreview(null);
        setError("");
      }
    } catch (err) {
      console.log(err);
      toast.error("Failed to create project. Please try again.");
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setFilteredEmployees(
      employees.filter((employee) =>
        employee.toLowerCase().includes(query.toLowerCase())
      )
    );
  };

  // useEffect(() => {
  //   setFilteredEmployees(employees);
  // }, [employees]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[92vh]">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="px-10 py-8 bg-[#efefef] h-full">
      <p className="text-xl font-medium mb-5">Create New Projects Template</p>

      <div className="bg-white px-6 py-10 rounded-lg">
        <div className="flex flex-col xl:flex-row items-center gap-5 mb-5">
          <div className="w-full flex flex-col gap-2">
            <p className="font-medium">Projects Name</p>
            <TextField
              label="Enter Project Name"
              variant="outlined"
              fullWidth
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
            />
          </div>
          <div className="w-44 flex flex-col gap-2">
            <p className="font-medium">Start Date</p>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Select Start Date"
                value={startDate}
                onChange={(newValue) => setStartDate(newValue)}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
          </div>
          <div className="w-44 flex flex-col gap-2">
            <p className="font-medium">End Date</p>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Select End Date"
                value={endDate}
                onChange={(newValue) => setEndDate(newValue)}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
          </div>
          <div className="w-2/3 flex flex-col gap-2">
            <p className="font-medium">Project Time</p>
            <TextField
              label="Enter Project Time"
              variant="outlined"
              value={projectTime}
              onChange={(e) => setProjectTime(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <p className="font-medium">Upload Photo</p>
            <Button
              variant="outlined"
              component="label"
              fullWidth
              sx={{
                height: "55px",
                width: "200px",
                textTransform: "none",
                outline: "none",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            >
              <div className="flex items-center gap-1 text-[#3F80AE]">
                <p>Upload</p>
                <LuImageUp />
              </div>

              <input type="file" hidden onChange={handleImageUpload} />
            </Button>
          </div>
          <div className="flex flex-col gap-2">
            <p className="font-medium">Upload Audio</p>
            <Button
              variant="outlined"
              component="label"
              fullWidth
              sx={{
                height: "55px",
                width: "200px",
                textTransform: "none",
                outline: "none",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            >
              <div className="text-[#3F80AE]">
                <AiFillAudio className="text-xl" />
              </div>

              <input type="file" hidden onChange={handleAudioUpload} />
            </Button>
          </div>
          {imagePreview && (
            <div className="w-1/2">
              <img
                src={imagePreview}
                alt="Uploaded"
                style={{
                  marginTop: "10px",
                  width: "100%",
                  maxWidth: "200px",
                  height: "auto",
                  borderRadius: "8px",
                  objectFit: "cover",
                }}
              />
            </div>
          )}
          {/* Display error message if any */}
          {error && <Typography color="error">{error}</Typography>}

          {/* Display uploaded audio */}
          {audioPreview && (
            <div className="mt-3">
              <audio controls>
                <source src={audioPreview} type="audio/mp3" />
              </audio>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2 mb-5">
          <p className="font-medium">Project Description</p>
          <TextField
            label="Enter Projects Description"
            variant="outlined"
            multiline
            rows={4}
            fullWidth
            value={projectDescription}
            onChange={(e) => setProjectDescription(e.target.value)}
          />
        </div>

        <div className="flex items-center justify-between bg-[#ECF2F7] rounded-lg">
          <div className="flex items-center gap-2">
            <p className="bg-[#C3D8E6] p-4 rounded-l-lg font-medium">
              Assigned To
            </p>
            <div className="flex gap-2">
              {assignedEmployees.map((id) => {
                const employee = employees.find((emp) => emp.id === id);
                return (
                  <Chip
                    key={id}
                    label={employee.name}
                    onDelete={() => handleRemoveEmployee(employee)}
                    deleteIcon={<span style={{ color: "#CC0505" }}>×</span>}
                    sx={{
                      paddingX: "5px",
                    }}
                  />
                );
              })}
            </div>
            <div className="flex">
              <TextField
                label="Mention Employee"
                fullWidth
                value={employeeInput}
                onClick={() => setOpenModal(true)}
                onChange={(e) => setEmployeeInput(e.target.value)}
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

      <Button
        variant="contained"
        onClick={handleSubmit}
        sx={{
          float: "right",
          marginTop: "20px",
          width: "300px",
          height: "50px",
          textTransform: "none",
          fontSize: "18px",
          bgcolor: "#3F80AE",
        }}
      >
        Create Project
      </Button>

      {/* Modal for Employee Selection */}
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
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
            onChange={handleSearch}
            sx={{ marginBottom: "10px", bgcolor: "#ECF2F7" }}
          />
          {filteredEmployees && filteredEmployees.length > 0 ? (
            <List>
              {filteredEmployees.map((employee, index) => (
                <ListItem
                  button
                  key={index}
                  onClick={() => handleSelectEmployee(employee)}
                >
                  <ListItemText
                    primary={employee.name}
                    sx={{
                      bgcolor: "#ECF2F7",
                      padding: "10px",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <List>
              {employees.map((employee, index) => (
                <ListItem
                  button
                  key={index}
                  onClick={() => handleSelectEmployee(employee)}
                >
                  <ListItemText
                    primary={employee.name}
                    sx={{
                      bgcolor: "#ECF2F7",
                      padding: "10px",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      </Modal>
    </div>
  );
};

export default CreateProject;
