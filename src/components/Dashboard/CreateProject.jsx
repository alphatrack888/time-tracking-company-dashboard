import { useState } from "react";
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

const PHOTO_TYPES = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
const AUDIO_TYPES = ["audio/mpeg", "audio/mp3", "audio/wav", "audio/mp4", "audio/x-m4a"];
const MAX_FILE_BYTES = 10 * 1024 * 1024;

const hoursHaveAtMostTwoDecimals = (value) =>
  Math.abs(value * 100 - Math.round(value * 100)) < 1e-6;

const FieldHint = ({ children }) => (
  <Typography variant="caption" color="text.secondary">
    {children}
  </Typography>
);

const FieldError = ({ message }) =>
  message ? (
    <Typography variant="caption" color="error">
      {message}
    </Typography>
  ) : null;

const CreateProject = () => {
  const { data: allEmployeeData, isLoading } = useAllEmployeeQuery();
  const allEmployee = allEmployeeData?.data?.data || [];
  const employees = allEmployee.map((employee) => ({
    name: employee.name,
    id: employee._id,
  }));

  const [projectName, setProjectName] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [projectTime, setProjectTime] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [assignedEmployees, setAssignedEmployees] = useState([]);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [audioPreview, setAudioPreview] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  const [openModal, setOpenModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [createProject, { isLoading: isCreating }] = useCreateProjectMutation();

  const clearError = (key) => {
    setFieldErrors((current) => {
      if (!current[key]) return current;
      const next = { ...current };
      delete next[key];
      return next;
    });
  };

  const handleRemoveEmployee = (id) => {
    setAssignedEmployees((current) => current.filter((emp) => emp !== id));
  };

  const handleSelectEmployee = (employee) => {
    setAssignedEmployees((current) =>
      current.includes(employee.id) ? current : [...current, employee.id]
    );
    setSearchQuery("");
    setOpenModal(false);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!PHOTO_TYPES.includes(file.type)) {
      setImage(null);
      setImagePreview(null);
      setFieldErrors((current) => ({
        ...current,
        photo: "Use a JPEG, PNG, or WebP photo.",
      }));
      return;
    }
    if (file.size > MAX_FILE_BYTES) {
      setImage(null);
      setImagePreview(null);
      setFieldErrors((current) => ({
        ...current,
        photo: "Photo must be 10 MB or smaller.",
      }));
      return;
    }
    setImage(file);
    clearError("photo");
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleAudioUpload = (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!AUDIO_TYPES.includes(file.type)) {
      setAudioFile(null);
      setAudioPreview(null);
      setFieldErrors((current) => ({
        ...current,
        audio: "Use an MP3, WAV, or M4A file.",
      }));
      return;
    }
    if (file.size > MAX_FILE_BYTES) {
      setAudioFile(null);
      setAudioPreview(null);
      setFieldErrors((current) => ({
        ...current,
        audio: "Audio must be 10 MB or smaller.",
      }));
      return;
    }
    setAudioFile(file);
    clearError("audio");
    const reader = new FileReader();
    reader.onloadend = () => {
      setAudioPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const collectErrors = () => {
    const errors = {};
    const name = projectName.trim();
    if (!name) errors.name = "Enter a project name.";
    else if (name.length > 120) errors.name = "Name cannot exceed 120 characters.";

    if (!startDate) errors.start = "Select a start date.";
    if (!endDate) errors.end = "Select an end date.";
    else if (startDate && endDate.isBefore(startDate, "day")) {
      errors.end = "End date must not be before the start date.";
    }

    const hours = Number(projectTime);
    if (projectTime === "" || Number.isNaN(hours)) {
      errors.time = "Enter the total hours for this project.";
    } else if (!(hours > 0)) {
      errors.time = "Hours must be greater than 0.";
    } else if (hours > 100000) {
      errors.time = "Hours cannot exceed 100000.";
    } else if (!hoursHaveAtMostTwoDecimals(hours)) {
      errors.time = "Use at most two decimal places.";
    }

    if (!image) errors.photo = "A photo is required.";
    const description = projectDescription.trim();
    if (!description) errors.description = "Enter a description.";
    else if (description.length > 2000) {
      errors.description = "Description cannot exceed 2000 characters.";
    }
    return errors;
  };

  const handleSubmit = async () => {
    const errors = collectErrors();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    const formData = new FormData();
    const projectData = {
      title: projectName.trim(),
      projectTime: Number(projectTime),
      description: projectDescription.trim(),
      employees: assignedEmployees,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    };

    formData.append("data", JSON.stringify(projectData));
    formData.append("images", image);
    if (audioFile) formData.append("audio", audioFile);

    try {
      const response = await createProject(formData).unwrap();
      if (response.success) {
        toast.success("Project created successfully!");
        setProjectName("");
        setStartDate(null);
        setEndDate(null);
        setProjectTime("");
        setProjectDescription("");
        setAssignedEmployees([]);
        setImage(null);
        setImagePreview(null);
        setAudioFile(null);
        setAudioPreview(null);
        setFieldErrors({});
      }
    } catch (err) {
      toast.error(err?.data?.message || "Failed to create project. Please try again.");
    }
  };

  const search = searchQuery.trim().toLowerCase();
  const visibleEmployees = search
    ? employees.filter((employee) => employee.name?.toLowerCase().includes(search))
    : employees;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[92vh]">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="px-10 py-8 bg-[#efefef] h-full">
      <p className="text-xl font-medium">Create project</p>
      <p className="text-sm text-[#545454] mb-5">
        This sets the project’s name, dates, total hours, and who can track time on it.
      </p>

      <div className="bg-white px-6 py-10 rounded-lg">
        <div className="flex flex-col xl:flex-row items-start gap-5 mb-5">
          <div className="w-full flex flex-col gap-2">
            <p className="font-medium">Project name *</p>
            <TextField
              label="Enter project name"
              variant="outlined"
              fullWidth
              value={projectName}
              error={Boolean(fieldErrors.name)}
              onChange={(e) => {
                setProjectName(e.target.value);
                clearError("name");
              }}
            />
            <FieldError message={fieldErrors.name} />
          </div>
          <div className="w-44 flex flex-col gap-2">
            <p className="font-medium">Start date *</p>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Select start date"
                value={startDate}
                onChange={(newValue) => {
                  setStartDate(newValue);
                  clearError("start");
                }}
                renderInput={(params) => <TextField {...params} error={Boolean(fieldErrors.start)} />}
              />
            </LocalizationProvider>
            <FieldError message={fieldErrors.start} />
          </div>
          <div className="w-44 flex flex-col gap-2">
            <p className="font-medium">End date *</p>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Select end date"
                value={endDate}
                minDate={startDate || undefined}
                onChange={(newValue) => {
                  setEndDate(newValue);
                  clearError("end");
                }}
                renderInput={(params) => <TextField {...params} error={Boolean(fieldErrors.end)} />}
              />
            </LocalizationProvider>
            <FieldError message={fieldErrors.end} />
          </div>
          <div className="w-2/3 flex flex-col gap-2">
            <p className="font-medium">Project time *</p>
            <TextField
              label="Enter project time"
              variant="outlined"
              type="number"
              value={projectTime}
              error={Boolean(fieldErrors.time)}
              inputProps={{ min: 0.01, step: 0.01, max: 100000 }}
              InputProps={{
                endAdornment: <InputAdornment position="end">hours</InputAdornment>,
              }}
              onChange={(e) => {
                setProjectTime(e.target.value);
                clearError("time");
              }}
            />
            <FieldHint>Total hours for the whole project</FieldHint>
            <FieldError message={fieldErrors.time} />
          </div>
          <div className="flex flex-col gap-2">
            <p className="font-medium">Photo *</p>
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
                <p>{image ? image.name : "Upload"}</p>
                <LuImageUp />
              </div>
              <input
                type="file"
                hidden
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageUpload}
              />
            </Button>
            <FieldHint>JPEG, PNG, or WebP, up to 10 MB</FieldHint>
            <FieldError message={fieldErrors.photo} />
          </div>
          <div className="flex flex-col gap-2">
            <p className="font-medium">Audio</p>
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
                <p>{audioFile ? audioFile.name : "Upload"}</p>
                <AiFillAudio className="text-xl" />
              </div>
              <input
                type="file"
                hidden
                accept="audio/mpeg,audio/mp3,audio/wav,audio/mp4,audio/x-m4a"
                onChange={handleAudioUpload}
              />
            </Button>
            <FieldHint>Optional. MP3, WAV, or M4A</FieldHint>
            <FieldError message={fieldErrors.audio} />
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
          {audioPreview && (
            <div className="mt-3">
              <audio controls>
                <source src={audioPreview} />
              </audio>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2 mb-5">
          <p className="font-medium">Description *</p>
          <TextField
            label="Enter project description"
            variant="outlined"
            multiline
            rows={4}
            fullWidth
            value={projectDescription}
            error={Boolean(fieldErrors.description)}
            onChange={(e) => {
              setProjectDescription(e.target.value);
              clearError("description");
            }}
          />
          <FieldError message={fieldErrors.description} />
        </div>

        <div className="flex flex-col gap-2 bg-[#ECF2F7] rounded-lg p-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="font-medium">Assigned to</p>
              <FieldHint>Optional. These people can track time on this project.</FieldHint>
            </div>
            <Button
              onClick={() => {
                setSearchQuery("");
                setOpenModal(true);
              }}
              sx={{
                bgcolor: "#3F80AE",
                color: "white",
                padding: "10px",
                textTransform: "none",
              }}
            >
              Add employee
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {assignedEmployees.map((id) => {
              const employee = employees.find((emp) => emp.id === id);
              return (
                <Chip
                  key={id}
                  label={employee?.name || "Employee"}
                  onDelete={() => handleRemoveEmployee(id)}
                  deleteIcon={<span style={{ color: "#CC0505" }}>×</span>}
                  sx={{ paddingX: "5px" }}
                />
              );
            })}
          </div>
        </div>
      </div>

      <Button
        variant="contained"
        onClick={handleSubmit}
        disabled={isCreating}
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
        {isCreating ? "Creating project..." : "Create project"}
      </Button>

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
            label="Search by name"
            variant="outlined"
            fullWidth
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ marginBottom: "10px", bgcolor: "#ECF2F7" }}
          />
          {visibleEmployees.length > 0 ? (
            <List>
              {visibleEmployees.map((employee) => (
                <ListItem
                  button
                  key={employee.id}
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
            <Typography color="text.secondary">
              {search ? "No matching employees." : "No employees to assign."}
            </Typography>
          )}
        </Box>
      </Modal>
    </div>
  );
};

export default CreateProject;
