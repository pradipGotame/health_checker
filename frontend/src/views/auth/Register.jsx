import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  Link,
  Container,
  CssBaseline,
  Paper,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import useRegister from "../../hooks/userRegister";

// Custom theme (optional)
const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2", // Change primary color
    },
    background: "black",
  },
});

export default function Register() {
  const { registerUser, loading, error } = useRegister();
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const username = data.get("username");
    const password = data.get("password");
    const name = data.get("name");
    const age = data.get("age");
    const weight = data.get("weight");
    const height = data.get("height");
    const location = data.get("location");

    if (
      !username ||
      !password ||
      !name ||
      !age ||
      !weight ||
      !height ||
      !location
    ) {
      setFormError("All fields are required.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(username)) {
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
      name,
      username,
      password,
      age,
      weight,
      height,
      location,
    };

    await registerUser(value);
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Paper
          elevation={3}
          sx={{
            marginTop: 8,
            padding: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            background: "white",
          }}
        >
          {formError && (
            <Typography color="error" variant="body2">
              {formError}
            </Typography>
          )}
          <Typography component="h1" variant="h5">
            Sign Up
          </Typography>
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
              id="username"
              label="Username (Email)"
              name="username"
              autoComplete="username"
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
              id="name"
              label="Full Name"
              name="name"
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
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/login" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Container>
    </ThemeProvider>
  );
}
