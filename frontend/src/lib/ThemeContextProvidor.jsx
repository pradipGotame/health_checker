import PropTypes from "prop-types";
import { useState, useMemo, useEffect } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { ThemeContext, darkTheme, lightTheme } from "./ThemeContext";

export const ThemeContextProvider = ({ children }) => {
  // Load theme from localStorage or default to dark
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const theme = useMemo(() => (darkMode ? darkTheme : lightTheme), [darkMode]);

  return (
    <ThemeContext.Provider value={{ darkMode, setDarkMode }}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  );
};

ThemeContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
