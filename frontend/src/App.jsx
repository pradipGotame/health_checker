import { Route, Routes, useNavigate } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import { useEffect } from "react";

import Dashboard from "./views/Dashboard/Dashboard";
import LandingPage from "./views/LandingPage";
import Register from "./views/auth/Register";
import Login from "./views/auth/Login";
import CreateActivity from "./components/Activity/createActivity";
import ActivityPage from "./components/Activity/ActivityPage"
import Profile from "./components/Profile/Profile"
// import ProtectedRoute from "./views/protectedRoutes/protectedRoutes";

export default function MarketingPage() {
  const navigate = useNavigate();
  useEffect(() => {
    // Maybe we can use a custom hook here to check if the user is logged in
    // Should avoid using localStorage directly
    const userId = localStorage.getItem("userId");
    if (userId) {
      navigate("/dashboard");
    }
  }, [navigate]);

  return (
    <>
      <CssBaseline enableColorScheme />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/activity" element={<CreateActivity />} />
        <Route path="/activity-page" element={<ActivityPage />} />
        <Route path="/profile" element={<Profile />} />
        {/* <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        /> */}
      </Routes>
    </>
  );
}
