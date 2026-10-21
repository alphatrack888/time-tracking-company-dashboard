import React, { useState } from "react";
import { Button, TextField } from "@mui/material";

export default function AddBreakTime() {
  // State for the break times
  const [morningBreak, setMorningBreak] = useState("");
  const [lunchBreak, setLunchBreak] = useState("");
  const [afternoonBreak, setAfternoonBreak] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "morningBreak") setMorningBreak(value);
    if (name === "lunchBreak") setLunchBreak(value);
    if (name === "afternoonBreak") setAfternoonBreak(value);
  };

  const handleSave = () => {
    console.log("Morning Break Time: ", morningBreak);
    console.log("Lunch Break Time: ", lunchBreak);
    console.log("Afternoon Break Time: ", afternoonBreak);
  };

  return (
    <div className="px-10 py-8 bg-[#efefef] h-[92vh] rounded-lg">
      <div className="flex flex-col mb-4 bg-white p-10 rounded-lg">
        <p className="text-[#333333] font-medium text-2xl capitalize mb-5">
          Add Employee Break Time
        </p>
        <div className="flex justify-between gap-8">
          <div className="w-full">
            <p className="font-medium mb-2">Morning Break Time</p>
            <TextField
              fullWidth
              type="time"
              value={morningBreak}
              onChange={handleChange}
              name="morningBreak"
              InputLabelProps={{ shrink: true }}
            />
          </div>
          <div className="w-full">
            <p className="font-medium mb-2">Lunch Break Time</p>
            <TextField
              fullWidth
              type="time"
              value={lunchBreak}
              onChange={handleChange}
              name="lunchBreak"
              InputLabelProps={{ shrink: true }}
            />
          </div>
          <div className="w-full">
            <p className="font-medium mb-2">Afternoon Break Time</p>
            <TextField
              fullWidth
              type="time"
              value={afternoonBreak}
              onChange={handleChange}
              name="afternoonBreak"
              InputLabelProps={{ shrink: true }}
            />
          </div>
        </div>
        <Button
          sx={{
            bgcolor: "#3F80AE",
            color: "white",
            textTransform: "none",
            height: "45px",
            marginTop: "30px",
            width: "150px",
            alignSelf: "flex-end",
          }}
          onClick={handleSave}
        >
          Save Now
        </Button>
      </div>
    </div>
  );
}
