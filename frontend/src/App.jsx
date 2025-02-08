import { useState } from "react";
import Button from "@mui/material/Button";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import React from "react";
import { CssBaseline } from "@mui/material";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import RouteTree from "./routes/routeTree"; 
import "./App.css";

function App() {
  return (
    <>
      <CssBaseline />
      <NavBar />
      <RouteTree /> {/* 这里加载所有路由 */}
      <Footer />
    </>
  );
}
export default App;
