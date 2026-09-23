/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import {
  TableContainer,
  Table,
  Paper,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Modal,
  Button,
  CircularProgress,
} from "@mui/material";
import { GoEye } from "react-icons/go";
import { AiTwotoneDelete } from "react-icons/ai";
import { PiNotepadBold } from "react-icons/pi";
import {
  useAllProjectsQuery,
  useDeleteProjectMutation,
  useGetProjectNotesQuery,
} from "../../Redux/api/projectApi";
import { toast } from "sonner";
import AssignEmployeeModal from "../Modals/AssignEmployeeModal";
import dayjs from "dayjs";

export default function RunningProjects() {
  const { data: allProjectsData, isLoading, refetch } = useAllProjectsQuery();
  const allProjects = allProjectsData?.data?.data || [];
  console.log("allProjectsData", allProjects);

  const [deleteProject] = useDeleteProjectMutation();

  const [selectedStatus, setSelectedStatus] = useState("all");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [openDetailsModal, setOpenDetailsModal] = useState(false);
  const [openNoteModal, setOpenNoteModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [openEditModal, setOpenEditModal] = useState(false);

  const { data: projectNoteData, isLoading: loadingNotes } =
    useGetProjectNotesQuery(selectedProject?._id);
  const projectNote = projectNoteData?.data || [];

  console.log("projectNoteData", projectNote);

  const handleFilterStatus = (e) => {
    const status = e.target.value;
    setSelectedStatus(status);
  };

  const filterProjects = () => {
    let filtered = allProjects;

    if (selectedStatus && selectedStatus !== "all") {
      filtered = filtered.filter(
        (project) =>
          project.status.toLowerCase() === selectedStatus.toLowerCase()
      );
    }

    return filtered;
  };

  const handleChangePage = (event, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleViewDetails = (project) => {
    console.log(project);
    setSelectedProject(project);
    setOpenDetailsModal(true);
  };

  const handleCloseDetailsModal = () => setOpenDetailsModal(false);

  const handleViewNote = (project) => {
    setSelectedProject(project);
    setOpenNoteModal(true);
  };

  const handleCloseNoteModal = () => setOpenNoteModal(false);

  const handleOpenDeleteModal = (project) => {
    setSelectedProject(project);
    setOpenDeleteModal(true);
  };

  const handleCloseDeleteModal = () => setOpenDeleteModal(false);

  const handleEditNow = () => {
    if (!selectedProject) return;
    setOpenDetailsModal(false);
    setOpenEditModal(true);
  };

  const handleDeleteProject = async () => {
    if (!selectedProject) return;

    try {
      // Call the delete API with the project ID
      const response = await deleteProject(selectedProject._id).unwrap();
      console.log(response);

      if (response.success) {
        toast.success("Project Deleted Successfully");
        refetch();
        setOpenDeleteModal(false);
        setSelectedProject(null);
      }
    } catch (error) {
      console.error("Failed to delete project:", error);
      if (
        error.data.message ===
        "You cannot delete a project that has employees assigned to it."
      ) {
        toast.error(
          "You cannot delete a project that has employees assigned to it."
        );
      }
      // Optional: show some error toast or alert
    }
  };

  if (isLoading || loadingNotes) {
    return (
      <div className="flex justify-center items-center h-[92vh]">
        <CircularProgress />
      </div>
    );
  }

  const filteredProjects = filterProjects();

  return (
    <div className="px-10 py-8 bg-[#efefef] h-[92vh]">
      <div className="flex items-center justify-between mb-4">
        <p className="text-[#1c1c1c] font-medium text-2xl">Running Projects</p>

        <FormControl sx={{ minWidth: 200 }} size="small">
          <InputLabel>Status</InputLabel>
          <Select
            label="Status"
            value={selectedStatus}
            onChange={handleFilterStatus}
            sx={{ height: "50px" }}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="cancelled">Cancelled</MenuItem>
          </Select>
        </FormControl>
      </div>
      <TableContainer component={Paper} sx={{ border: "1px solid #e6e6e6" }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#C3D8E6" }}>
              <TableCell sx={{ fontWeight: 600, textAlign: "center" }}>
                Serial No
              </TableCell>
              <TableCell sx={{ fontWeight: 600, textAlign: "center" }}>
                Project Name
              </TableCell>
              <TableCell sx={{ fontWeight: 600, textAlign: "center" }}>
                Assigned Employee
              </TableCell>
              <TableCell sx={{ fontWeight: 600, textAlign: "center" }}>
                Company
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
            {filteredProjects.length > 0 ? (
              filteredProjects
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((project, index) => (
                  <TableRow key={project.serialNo}>
                    <TableCell sx={{ textAlign: "center" }}>
                      {index + 1 + page * rowsPerPage}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      {project.title}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      {/* {project.assignedEmployee ?? "N/A"} */}
                      {project.employees.map((employee) => {
                        return (
                          <ul key={employee._id}>
                            <li>{employee.name}</li>
                          </ul>
                        );
                      })}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      {project.company.name}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      <span
                        style={{
                          padding: "10px 15px",
                          borderRadius: "8px",
                          color: "white",
                          textTransform: "capitalize",
                          backgroundColor:
                            project.status.toLowerCase() === "completed"
                              ? "#008000"
                              : project.status.toLowerCase() === "pending"
                              ? "#FFDE00"
                              : project.status.toLowerCase() === "cancelled"
                              ? "#f44336"
                              : "#9e9e9e",
                          fontWeight: "600",
                        }}
                      >
                        {project.status}
                      </span>
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      <div className="flex items-center justify-center gap-2">
                        <IconButton
                          size="small"
                          onClick={() => handleViewDetails(project)}
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
                          onClick={() => handleViewNote(project)}
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
                          <PiNotepadBold />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleOpenDeleteModal(project)}
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
                ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} sx={{ textAlign: "center" }}>
                  No projects found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredProjects.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      {/* View Details Modal */}
      <Modal open={openDetailsModal} onClose={handleCloseDetailsModal}>
        <div className="w-[900px] bg-white p-8 m-auto mt-10 rounded-lg overflow-y-auto max-h-[90vh]">
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <p className="font-medium text-lg">Project Details</p>
            <Button
              onClick={handleEditNow}
              sx={{
                color: "#fff",
                textTransform: "none",
                bgcolor: "#3F80AE",
                width: "150px",
                height: "40px",
                borderRadius: "4px",
                "&:hover": {
                  color: "#3F80AE",
                  bgcolor: "white",
                  fontWeight: "600",
                  border: "2px solid #3F80AE",
                },
              }}
            >
              Assign Employee
            </Button>
          </div>

          {/* Project Images */}
          <div className="flex gap-2 mb-5">
            {selectedProject?.images?.length > 0 ? (
              selectedProject.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`${selectedProject.title} ${idx + 1}`}
                  className="w-1/3 rounded-lg object-cover"
                  style={{ maxHeight: "200px" }}
                />
              ))
            ) : (
              <p>No images available</p>
            )}
          </div>

          {/* Project Info */}
          <div className="flex flex-col gap-2 mb-5">
            <div>
              <p className="font-medium">Title:</p>
              <p className="text-sm text-[#545454]">{selectedProject?.title}</p>
            </div>
            <div>
              <p className="font-medium">Company:</p>
              <p className="text-sm text-[#545454]">
                {selectedProject?.company?.name}
              </p>
            </div>
            <div>
              <p className="font-medium">Description:</p>
              <p className="text-sm text-[#545454]">
                {selectedProject?.description}
              </p>
            </div>
            <div>
              <p className="font-medium">Status:</p>
              <p
                className="text-sm text-[#545454] capitalize font-medium py-1 rounded w-20 text-center"
                style={{
                  backgroundColor:
                    selectedProject?.status.toLowerCase() === "completed"
                      ? "#008000"
                      : selectedProject?.status.toLowerCase() === "pending"
                      ? "#FFDE00"
                      : selectedProject?.status.toLowerCase() === "cancelled"
                      ? "#f44336"
                      : "#9e9e9e",
                }}
              >
                {selectedProject?.status || "N/A"}
              </p>
            </div>

            <div className="flex items-center gap-5">
              <div className="mb-2">
                <p className="font-medium">Time and Duration</p>
                <Table
                  sx={{
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    width: "300px",
                  }}
                >
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "#C3D8E6" }}>
                      <TableCell
                        sx={{ fontWeight: "600", textAlign: "center" }}
                      >
                        Project Time
                      </TableCell>
                      <TableCell
                        sx={{ fontWeight: "600", textAlign: "center" }}
                      >
                        Duration
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow sx={{ borderBottom: "1px solid #ddd" }}>
                      <TableCell sx={{ textAlign: "center" }}>
                        {selectedProject?.projectTime
                          ? selectedProject.projectTime
                          : "N/A"}
                      </TableCell>
                      <TableCell sx={{ textAlign: "center" }}>
                        {selectedProject?.duration
                          ? selectedProject.duration
                          : "N/A"}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>{" "}
              {/* Project Dates Table */}
              <div className="mb-2">
                <p className="font-medium">Project Dates</p>
                <Table
                  sx={{
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    width: "300px",
                  }}
                >
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "#C3D8E6" }}>
                      <TableCell
                        sx={{ fontWeight: "600", textAlign: "center" }}
                      >
                        Start Date
                      </TableCell>
                      <TableCell
                        sx={{ fontWeight: "600", textAlign: "center" }}
                      >
                        End Date
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow sx={{ borderBottom: "1px solid #ddd" }}>
                      <TableCell sx={{ textAlign: "center" }}>
                        {selectedProject?.startDate
                          ? dayjs(selectedProject.startDate).format(
                              "DD-MM-YYYY"
                            )
                          : "N/A"}
                      </TableCell>

                      <TableCell sx={{ textAlign: "center" }}>
                        {selectedProject?.endDate
                          ? dayjs(selectedProject.endDate).format("DD-MM-YYYY")
                          : "N/A"}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>

          {/* Assigned Employees */}
          <div className="mb-5">
            <p className="font-medium mb-2">Assigned Employees</p>
            <ul className="ml-5 list-disc">
              {selectedProject?.employees?.length > 0 ? (
                selectedProject.employees.map((employee, idx) => (
                  <li key={idx} className="text-sm text-[#545454]">
                    {employee.name}{" "}
                    {employee.email ? `(${employee.email})` : ""}
                  </li>
                ))
              ) : (
                <p className="text-sm text-[#545454]">No employees assigned</p>
              )}
            </ul>
          </div>

          {/* Close Button */}
          {/* <div className="flex justify-end">
            <Button
              variant="outlined"
              onClick={handleCloseDetailsModal}
              sx={{ mt: 2 }}
            >
              Close
            </Button>
          </div> */}
        </div>
      </Modal>
      {/* View Note Modal */}
      <Modal open={openNoteModal} onClose={handleCloseNoteModal}>
        <div className="w-[1000px] bg-white p-8 m-auto mt-10 rounded-lg">
          <p className="font-medium mb-4 text-center">Project Notes</p>

          {projectNote?.length > 0 ? (
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f4f4f4" }}>
                  <TableCell sx={{ fontWeight: "600" }}>Created By</TableCell>
                  <TableCell sx={{ fontWeight: "600" }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: "600" }}>Text</TableCell>
                  <TableCell sx={{ fontWeight: "600" }}>Audio</TableCell>
                  <TableCell sx={{ fontWeight: "600" }}>Images</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {projectNote.map((note, index) => (
                  <TableRow
                    key={note._id}
                    sx={{ borderBottom: "1px solid #ddd" }}
                  >
                    {/* Created By */}
                    <TableCell>
                      {note.createdBy?.name || "Unknown Creator"}
                    </TableCell>

                    {/* Date */}
                    <TableCell>
                      {new Date(note.createdAt).toLocaleString()}
                    </TableCell>

                    {/* Text Content */}
                    <TableCell>
                      {note.content || "No text content available"}
                    </TableCell>

                    {/* Audio */}
                    <TableCell>
                      {note.audio?.length > 0 ? (
                        <div>
                          {note.audio.map((audioFile, index) => (
                            <div key={index} className="mb-2">
                              <audio controls>
                                <source
                                  src={audioFile}
                                  type="audio/mp3"
                                />
                                Your browser does not support the audio element.
                              </audio>
                            </div>
                          ))}
                        </div>
                      ) : (
                        "No audio available"
                      )}
                    </TableCell>

                    {/* Images */}
                    <TableCell>
                      {note.images?.length > 0 ? (
                        <div className="flex gap-2">
                          {note.images.map((image, index) => (
                            <img
                              key={index}
                              src={image}
                              alt={`Note Image ${index + 1}`}
                              className="w-20 h-20 object-cover rounded-lg"
                            />
                          ))}
                        </div>
                      ) : (
                        "No image available"
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p>No notes available.</p>
          )}
        </div>
      </Modal>
      {/* Delete Confirmation Modal */}
      <Modal open={openDeleteModal} onClose={handleCloseDeleteModal}>
        <div className="w-[400px] h-36 bg-white m-auto mt-40 p-6 rounded-lg flex flex-col items-center">
          <p className="mb-5">Are you sure you want to delete this project?</p>
          <div className="flex items-center gap-2">
            <Button
              onClick={handleDeleteProject}
              variant="contained"
              sx={{
                bgcolor: "#CC0505",
              }}
            >
              Delete
            </Button>
            <Button
              onClick={handleCloseDeleteModal}
              sx={{
                border: "1px solid #CC0505",
                color: "#CC0505",
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>{" "}
      <AssignEmployeeModal
        open={openEditModal}
        onClose={() => setOpenEditModal(false)}
        project={selectedProject}
        onUpdated={refetch}
      />
    </div>
  );
}
