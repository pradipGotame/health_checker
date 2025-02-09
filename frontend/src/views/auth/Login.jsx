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
import useLogin from "../../hooks/useLogin";
import { useNavigate } from "react-router-dom";

const theme = createTheme({
  palette: {
    primary: {
      main: "#000000",
    },
    background: "black",
  },
});

export default function Login() {
  const navigate = useNavigate();
  const { loginUser, loading, error, setError } = useLogin();
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const username = data.get("email");
    const password = data.get("password");

    console.log("clicked -> ", username);

    if (!username || !password) {
      setFormError("All fields are required.");
      return;
    }

    await loginUser(username, password);
    console.log("logged in ");
    navigate("/dashboard");
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline enableColorScheme />
        <Typography style={{ color: "red" }}>{formError}</Typography>
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
          <Typography component="h1" variant="h5">
            Sign in
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
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="/register" variant="body2">
                  Don't have an account? Sign Up
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Container>
    </ThemeProvider>
  );
}
