import CssBaseline from "@mui/material/CssBaseline";
import LandingPage from "./views/LandingPage";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import Login from "./views/auth/Login";
import Register from "./views/auth/Register";
import { useEffect } from "react";
import Dashboard from "./views/Dashboard/Dashboard";
// import ProtectedRoute from "./views/protectedRoutes/protectedRoutes";

export default function MarketingPage() {
  const navigate = useNavigate();
  useEffect(() => {
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
