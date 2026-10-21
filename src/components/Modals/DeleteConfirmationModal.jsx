import { Button, Modal } from "@mui/material";
import React from "react";

export default function DeleteConfirmationModal({
  openDeleteModal,
  handleCloseDeleteModal,
  selectedEmployee,
  handleDeleteEmployee,
}) {
  return (
    <div>
      <Modal open={openDeleteModal} onClose={handleCloseDeleteModal}>
        <div className="bg-white p-6 rounded-lg shadow-lg w-96 mx-auto mt-40">
          <h3 className="mb-8">
            Are you sure you want to delete{" "}
            <span className="font-medium text-lg">
              {selectedEmployee?.name}
            </span>
            ?
          </h3>
          <Button
            onClick={handleDeleteEmployee}
            variant="contained"
            sx={{ bgcolor: "#CC0505", color: "white", marginRight: 2 }}
          >
            Yes, Delete
          </Button>
          <Button
            onClick={handleCloseDeleteModal}
            variant="outlined"
            sx={{ color: "#CC0505", borderColor: "#CC0505" }}
          >
            Cancel
          </Button>
        </div>
      </Modal>
    </div>
  );
}
