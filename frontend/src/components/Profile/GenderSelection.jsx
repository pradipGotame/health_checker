import React from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

export default function GenderSelection({ value, onChange }) {
  const handleChange = (event) => {
    if (!onChange) {
      console.error("Error: onChange is not defined in GenderSelection");
      return;
    }
    console.log("Selected Gender:", event.target.value); // ✅ 确保 gender 被正确选中
    onChange(event.target.value); // ✅ 让父组件更新 state
  };

  return (
    <FormControl>
      <FormLabel id="gender-label" sx={{ display: "flex", color: "text.primary" }}>
        Gender
      </FormLabel>
      <RadioGroup
        row
        aria-labelledby="gender-label"
        name="gender" // ✅ 确保 FormData.get("gender") 能正确获取
        value={value || ""} // ✅ 防止 value 为 undefined
        onChange={handleChange}
        sx={{ padding: 1 }}
      >
        <FormControlLabel value="female" control={<Radio />} label="Female" />
        <FormControlLabel value="male" control={<Radio />} label="Male" />
      </RadioGroup>
    </FormControl>
  );
}
