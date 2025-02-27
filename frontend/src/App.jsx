import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

import Dashboard from "./views/Dashboard/Dashboard";
import LandingPage from "./views/LandingPage";
import Register from "./views/auth/Register";
import Login from "./views/auth/Login";
import CreateActivity from "./components/Activity/CreateActivity";
import ActivityPage from "./components/Activity/ActivityPage";
import Profile from "./components/Profile/Profile";
import Features from "./components/Landing/Features";
import ProtectedRoute from "./views/protectedRoutes/protectedRoutes";
import { onMessageListener, requestForToken } from "./hooks/useTokenFromDevice";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { saveTokenToFirestore } from "./hooks/useUser";
import NavBar from "./components/Landing/NavBar";
import CssBaseline from "@mui/material/CssBaseline";
import Notification from "./views/Notification/Notification";

const auth = getAuth();

export default function MarketingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const hiddenNavRoutes = ["/login", "/register"];
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId && window.location.pathname === "/") {
      navigate("/dashboard");
    }
  }, [navigate]);

  //NOTIFICATION SETUP
  useEffect(() => {
    // Register service worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/firebase-messaging-sw.js")
        .then((registration) => {
          console.log("Service Worker registered successfully:", registration);
        })
        .catch((error) => {
          console.error("Service Worker registration failed:", error);
        });
    }

    // Request notification permission & store FCM token
    requestForToken()
      .then((token) => {
        saveTokenToFirestore(token);
      })
      .catch((err) => {
        console.log("token error -> ", err);
      });

    // Listen for incoming messages (foreground)
    const unsubscribe = onMessageListener()
      .then((payload) => {
        console.log("Received foreground notification:", payload);
        alert(`Notification: ${payload.notification.title}`);
      })
      .catch((err) => console.error("Notification error:", err));

    // Cleanup listener when component unmounts
    return () => {
      unsubscribe;
    };
  }, []);

  return (
    <>
      <CssBaseline enableColorScheme />
      {!hiddenNavRoutes.includes(location.pathname) && <NavBar />}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-activity"
          element={
            <ProtectedRoute>
              <CreateActivity />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/activity-page"
          element={
            <ProtectedRoute>
              <ActivityPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/featuress"
          element={
            <ProtectedRoute>
              <Features />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notification"
          element={
            <ProtectedRoute>
              <Notification />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}
