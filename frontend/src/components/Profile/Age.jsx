import React, { useState } from "react";
import { Box, MenuItem, FormControl, InputLabel, Select } from "@mui/material";

export default function AgeSelect() {
  const [age, setAge] = useState("");

  const handleChange = (event) => {
    const selectedValue = event.target.value;

    // 解析 "10-15" => [10, 11, 12, 13, 14, 15]
    const ageRange = selectedValue.includes("-")
      ? (() => {
          const [start, end] = selectedValue.split("-").map(Number);
          return Array.from({ length: end - start + 1 }, (_, i) => start + i);
        })()
      : [Number(selectedValue)];

    console.log("选择的年龄范围:", ageRange);
    setAge(selectedValue);
  };

  // ✅ 用数组生成所有年龄区间，避免手写
  const ageGroups = [
    "10-15",
    "16-20",
    "21-25",
    "26-30",
    "31-35",
    "36-40",
    "41-45",
    "46-50",
    "51-55",
    "56-60",
    "61-65",
    "66-70",
    "71-75",
    "76-80",
    "81-85",
  ];

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Age</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={age}
          onChange={handleChange}
          label="Age"
        >
          {ageGroups.map((range) => (
            <MenuItem key={range} value={range}>
              {range}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
