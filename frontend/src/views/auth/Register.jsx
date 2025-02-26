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

export default function Register() {
  const navigate = useNavigate();
  const { registerUser, loading } = useRegister();
  const [formError, setFormError] = useState(null);
  const { darkMode } = useContext(ThemeContext);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const email = data.get("email");
    const password = data.get("password");
    const full_name = data.get("full_name");
    const age = data.get("age");
    const weight = data.get("weight");
    const height = data.get("height");
    const location = data.get("location");

    if (
      !email ||
      !password ||
      !full_name ||
      !age ||
      !weight ||
      !height ||
      !location
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
    };

    const user = await registerUser(value);
    if (!user) {
      // to be fixed, error can not be set here from the hook
      // should find another way to set the error
      // this current message will causse a bad user experience
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
            <TextField
              margin="normal"
              required
              fullWidth
              id="age"
              label="Age"
              name="age"
              type="number"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="weight"
              label="Weight (kg)"
              name="weight"
              type="number"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="height"
              label="Height (cm)"
              name="height"
              type="number"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="location"
              label="Location"
              name="location"
              autoComplete="address-level2"
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
