import React from "react";
import ReactDOM from "react-dom/client";  // ← 这里是你缺少的导入
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";

import { ThemeProvider, createTheme } from "@mui/material/styles";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#84cc16",
    },
    secondary: {
      main: "#fff",
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
    <ThemeProvider theme={darkTheme}>
      <App />
    </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
