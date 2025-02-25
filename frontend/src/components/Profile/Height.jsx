import * as React from "react";
import { styled } from "@mui/material/styles";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import InputBase from "@mui/material/InputBase";

const BootstrapInput = styled(InputBase)(({ theme }) => ({
  "label + &": {
    marginTop: theme.spacing(5),
  },
  "& .MuiInputBase-input": {
    borderRadius: 4,
    position: "relative",
    backgroundColor: theme.palette.background.paper,
    border: "0.5px gray solid",
    padding: "10px 26px 10px 10px",
    transition: theme.transitions.create(["border-color", "box-shadow"]),
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
    "&:focus": {
      borderRadius: 4,
      borderColor: "#80bdff",
      boxShadow: "0 0 0 0.2rem rgba(0,123,255,.25)",
    },
  },
}));

export default function HeightInput({ value, onChange }) {

  const handleChange = (event) => {
    onChange(event.target.value);
  };

  return (
    <div>
      <FormControl sx={{ m: 0 }} variant="standard">
        {/* <InputLabel htmlFor="height" sx={{ fontSize: "1.35rem", color: "text.primary" }} shrink>Height (cm)</InputLabel> */}
        <BootstrapInput
          id="height"
          value={value || ""}
          onChange={handleChange} // ✅ 监听输入变化
          placeholder="Enter your height" // ✅ 添加占位符
        />
      </FormControl>
    </div>
  );
}
