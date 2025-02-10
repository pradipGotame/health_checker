import { useState } from "react";
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

import Logo from "../../components/Landing/Logo";
import useLogin from "../../hooks/useLogin";

export default function Login() {
  const navigate = useNavigate();
  const { loginUser, loading } = useLogin();
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const email = data.get("email");
    const password = data.get("password");

    if (!email || !password) {
      setFormError("All fields are required.");
      return;
    }

    const user = await loginUser(email, password);
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
          backgroundImage:
            "radial-gradient(ellipse 80% 50% at 50% -20%, hsl(84, 81%, 14%), transparent)",
          position: "absolute",
          height: "100%",
          left: 0,
          top: 0,
          zIndex: -1,
        })}
      />
      <Container component="main" maxWidth="xs" sx={{ paddingTop: 8 }}>
        <Button
          variant="outlined"
          onClick={() => navigate("/")}
          sx={{ textTransform: "none" }}
        >
          <Logo />
        </Button>
      </Container>

      <Container component="main" maxWidth="xs" sx={{ paddingTop: 4 }}>
        <CssBaseline enableColorScheme />
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
              Login to your account
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
              disabled={loading}
            >
              Sign In
            </Button>
            <Box>
              <Box>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Box>
              <Box>
                <Link href="/register" variant="body2">
                  Don&apos;t have an account? Sign Up
                </Link>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Container>
    </>
  );
}
