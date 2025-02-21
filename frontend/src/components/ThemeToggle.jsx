import { useContext } from "react";
import { ThemeContext } from "../lib/ThemeContext";
import { IconButton } from "@mui/material";
import { DarkMode, LightMode } from "@mui/icons-material";

const ThemeToggle = () => {
  const { darkMode, setDarkMode } = useContext(ThemeContext);

  return (
    <IconButton
      onClick={() => setDarkMode(!darkMode)}
      color="primary"
      sx={{ flexShrink: 0, width: 40, height: 40 }}
    >
      {darkMode ? <LightMode /> : <DarkMode />}
    </IconButton>
  );
};

export default ThemeToggle;
