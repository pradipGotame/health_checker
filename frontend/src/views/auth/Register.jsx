import { useContext, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Link,
  Container,
  CssBaseline,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import useRegister from "../../hooks/userRegister";
import Logo from "../../components/Landing/Logo";
import ThemeToggle from "../../components/ui/ThemeToggle";
import { ThemeContext } from "../../lib/ThemeContext";
import FitnessGoal from "../../components/Profile/FitnessGoal";
import ExerciseLevel from "../../components/Profile/ExerciseLevel";
import GenderSelection from "../../components/Profile/GenderSelection";
import Location from "../../components/Profile/Location";

export default function Register() {
  const navigate = useNavigate();
  const { registerUser, loading } = useRegister();
  const [formError, setFormError] = useState(null);
  const { darkMode } = useContext(ThemeContext);

  // ✅ 添加 useState 来管理 formData
  const [formData, setFormData] = useState({
    fitnessGoal: "",
    exerciseLevel: "",
    Location: "",
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const email = data.get("email");
    const password = data.get("password");
    const full_name = data.get("full_name");
    const age = data.get("age");
    const weight = data.get("weight");
    const height = data.get("height");
    const location = formData.location;

    const fitnessGoal = formData.fitnessGoal;
    const exerciseLevel = formData.exerciseLevel;
    const gender = data.get("gender");

    if (
      !email ||
      !password ||
      !full_name ||
      !age ||
      !weight ||
      !height ||
      !location ||
      !fitnessGoal ||
      !gender ||
      !exerciseLevel
    ) {
      setFormError("All fields are required.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setFormError("Username should be a valid email.");
      return;
    }

    const passwordRegex = /^[a-zA-Z0-9]+$/;
    if (!passwordRegex.test(password)) {
      setFormError("Password should be alphanumeric.");
      return;
    }

    setFormError(null);

    const value = {
      email,
      full_name,
      password,
      age,
      weight,
      height,
      location,
      fitnessGoal,
      gender,
      exerciseLevel,
    };

    const user = await registerUser(value);
    if (!user) {
      setFormError("Invalid credentials.");
      return;
    }
    navigate("/dashboard");
  };

  return (
    <>
      <Box
        id="hero"
        sx={() => ({
          width: "100%",
          backgroundRepeat: "no-repeat",
          backgroundImage: !darkMode
            ? "radial-gradient(ellipse 80% 50% at 50% -20%, hsl(185, 100%, 14%), transparent)"
            : "radial-gradient(ellipse 80% 50% at 50% -20%, hsl(84, 81%, 14%), transparent)",
          position: "absolute",
          height: "100%",
          left: 0,
          top: 0,
          zIndex: -1,
        })}
      />
      <Container
        component="main"
        maxWidth="xs"
        sx={{
          paddingTop: 8,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Button
          variant="outlined"
          onClick={() => navigate("/")}
          sx={{ textTransform: "none" }}
        >
          <Logo />
        </Button>
        <ThemeToggle />
      </Container>
      <Container component="main" maxWidth="xs" sx={{ marginY: 4 }}>
        <CssBaseline />
        <Paper
          elevation={3}
          sx={{
            borderRadius: "16px",
            padding: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "start",
          }}
        >
          <Typography sx={{ color: "red" }}>{formError}</Typography>
          <Box
            sx={{
              marginTop: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography component="h1" variant="h5">
              Register for an account
            </Typography>
          </Box>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="password"
              label="Password"
              name="password"
              type="password"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="full_name"
              label="Full Name"
              name="full_name"
              autoComplete="name"
              autoFocus
            />

            <FitnessGoal
              required
              fullWidth
              id="fitnessGoal"
              name="fitnessGoal"
              value={formData.fitnessGoal}
              onChange={(newValue) =>
                setFormData({ ...formData, fitnessGoal: newValue })
              }
            />

            <Location
              margin="normal"
              required
              fullWidth
              id="location"
              name="location"
              
              value={formData.location}
              onChange={(newValue) =>
                setFormData({ ...formData, location: newValue })
              }
            />

            <ExerciseLevel
              required
              fullWidth
              id="exerciseLevel"
              label="Exercise Level"
              name="exerciseLevel"
              value={formData.exerciseLevel}
              onChange={(newValue) =>
                setFormData({ ...formData, exerciseLevel: newValue })
              }
            />

            <TextField
              margin="normal"
              required
              fullWidth
              id="age"
              label="Age"
              name="age"
              type="number"
              inputProps={{ min: 1 }} 
              onChange={(event) => {
                const value = parseInt(event.target.value, 10);
                if (value < 1) {
                  event.target.value = 1; // if<1, set to 1
                }
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="weight"
              label="Weight (kg)"
              name="weight"
              type="number"
              inputProps={{ min: 1 }} 
              onChange={(event) => {
                const value = parseInt(event.target.value, 10);
                if (value < 1) {
                  event.target.value = 1; // if<1, set to 1
                }
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="height"
              label="Height (cm)"
              name="height"
              type="number"
              inputProps={{ min: 1 }} 
              onChange={(event) => {
                const value = parseInt(event.target.value, 10);
                if (value < 1) {
                  event.target.value = 1; // if<1, set to 1
                }
              }}
            />

            <GenderSelection
              value={formData.gender || ""}
              onChange={(newValue) => {
                console.log("Updating gender in state:", newValue);
                setFormData((prev) => ({ ...prev, gender: newValue }));
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              Sign Up
            </Button>
            <Link href="/login" variant="body2">
              Already have an account? Sign in
            </Link>
          </Box>
        </Paper>
      </Container>
    </>
  );
}
