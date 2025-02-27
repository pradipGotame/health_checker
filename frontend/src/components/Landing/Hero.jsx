import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";

export default function Hero() {
  const navigate = useNavigate();
  return (
    <Box
      id="hero"
      sx={() => ({
        width: "100%",
        backgroundRepeat: "no-repeat",
        backgroundImage:
          "radial-gradient(ellipse 80% 50% at 50% -20%, hsl(84, 81%, 14%), transparent)",
      })}
    >
      <Container
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          pt: { xs: 14, sm: 20 },
          pb: { xs: 8, sm: 12 },
        }}
      >
        <Stack
          spacing={2}
          useFlexGap
          sx={{ alignItems: "center", width: { xs: "100%", sm: "70%" } }}
        >
          <Typography
            variant="h1"
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              fontSize: "clamp(3rem, 10vw, 3.5rem)",
              fontWeight: "bold",
            }}
          >
            Unlock Your Strength.
          </Typography>
          <Typography
            variant="h2" // Changed from h1 to h2
            sx={{
              fontSize: "clamp(3rem, 10vw, 3.5rem)",
              fontWeight: "bold",
            }}
            color="primary"
          >
            Track. Train. Transform.
          </Typography>
          <Typography
            sx={{
              textAlign: "center",
              color: "text.secondary",
              width: { sm: "100%", md: "80%" },
            }}
          >
            Stay on track, stay motivated, and achieve your fitness goals—one
            workout at a time. Turn your effort into progress with AI-powered
            workout tracking. No more guesswork—just effective workouts, smart
            tracking, and real results.
          </Typography>
          <Button
            variant="contained"
            size="large"
            sx={{ width: { xs: "100%", sm: "auto" }, minWidth: 200 }}
            className="Button"
            onClick={() => navigate("/register")}
          >
            Join us now
          </Button>
        </Stack>
      </Container>
    </Box>
  );
}
