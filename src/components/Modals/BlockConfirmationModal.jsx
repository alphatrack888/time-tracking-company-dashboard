import { Button, Modal } from "@mui/material";
import React from "react";

export default function BlockConfirmationModal({
  openBlockModal,
  handleCloseBlockModal,
  handleBlockEmployee,
  selectedEmployee,
}) {
  return (
    <div>
      <Modal open={openBlockModal} onClose={handleCloseBlockModal}>
        <div className="bg-white p-6 rounded-lg shadow-lg w-96 mx-auto mt-40">
          <p className="mb-8">
            Are you sure you want to block{" "}
            <span className="font-medium text-lg">
              {selectedEmployee?.name}
            </span>
            ?
          </p>
          <Button
            onClick={handleBlockEmployee}
            variant="contained"
            sx={{ bgcolor: "#3F80AE", color: "white", marginRight: 2 }}
          >
            Yes, Block
          </Button>
          <Button
            onClick={handleCloseBlockModal}
            variant="outlined"
            sx={{ color: "#3F80AE", borderColor: "#3F80AE" }}
          >
            Cancel
          </Button>
        </div>
      </Modal>
    </div>
  );
}
