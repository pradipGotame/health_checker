import { createTheme } from "@mui/material";
import { createContext } from "react";

export const ThemeContext = createContext();

export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#006d77",
    },
    secondary: {
      main: "#09090b",
    },
    action: {
      hover: "#83c5be",
    },
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#84cc16",
    },
    secondary: {
      main: "#fafafa",
    },
    action: {
      hover: "#1a2e05",
    },
  },
});
