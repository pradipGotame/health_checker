import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import NavBar from "../Landing/NavBar";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import { Typography } from "@mui/material";
import Select from "@mui/material/Select";

export default function CreateActivity() {
  return (
    <Box
      sx={{
        backgroundImage:
          "radial-gradient(ellipse 80% 50% at 50% 50%, hsl(84, 81%, 14%), transparent)",
      }}
    >
      <NavBar />
      <Container
        sx={{
          display: "flex",
          flexDirection: "column",
          pt: 12,
          pb: { xs: 8, sm: 12 },
        }}
      >
        <Typography sx={{ p: 2, fontSize: 36, fontWeight: "bold" }}>
          New Activity
        </Typography>
        <Stack
          display="flex"
          justifyContent="space-between"
          alignItems={{ sm: "flex-start" }}
          direction={{ sm: "row" }}
        >
          <Box
            sx={{
              backdropFilter: "blur(24px)",
              background: "rgba(132, 204, 22, 0.05)", // Increased opacity for whiter tint
              boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)", // Subtle shadow for depth
              borderRadius: "8px",
              flex: 7,
              m: 1,
              p: 2,
            }}
          >
            <Stack sx={{ mb: 4 }}>
              <Typography sx={{ fontWeight: "bold" }}>
                Activity Title
              </Typography>
              <TextField
                id="outlined-basic"
                variant="outlined"
                size="small"
                margin="none"
                sx={{ width: "100%" }}
              />
            </Stack>
            <Stack
              direction="row"
              display="flex"
              justifyContent="space-between"
              sx={{ mb: 4, width: "100%" }}
              spacing={2}
            >
              <Stack sx={{ width: "50%" }}>
                <Box>Workout Type</Box>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value="Workout"
                  size="small"
                  sx={{ width: "100%" }}
                >
                  <MenuItem value={10}>Ten</MenuItem>
                  <MenuItem value={20}>Twenty</MenuItem>
                  <MenuItem value={30}>Thirty</MenuItem>
                </Select>
              </Stack>

              <Stack sx={{ width: "50%" }}>
                <Typography>Duration</Typography>
                <TextField
                  id="outlined-basic"
                  variant="outlined"
                  size="small"
                  type="time"
                  sx={{ width: "100%" }}
                />
              </Stack>
            </Stack>

            <Stack
              direction="row"
              display="flex"
              justifyContent="space-between"
              sx={{ mb: 4, width: "100%" }}
              spacing={2}
            >
              <Stack sx={{ width: "50%" }}>
                <Typography fontWeight="bold">Reps</Typography>
                <TextField
                  id="outlined-basic"
                  variant="outlined"
                  size="small"
                  margin="none"
                  type="number"
                  sx={{ width: "100%" }}
                />
              </Stack>
              <Stack sx={{ width: "50%" }}>
                <Typography fontWeight="bold">Sets</Typography>
                <TextField
                  id="outlined-basic"
                  variant="outlined"
                  size="small"
                  margin="none"
                  type="number"
                  sx={{ width: "100%" }}
                />
              </Stack>
            </Stack>

            <Stack sx={{ mb: 4 }}>
              <Typography sx={{ fontWeight: "bold", mb: 1 }}>
                Location
              </Typography>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value="Workout"
                size="small"
                sx={{ width: "100%" }}
              >
                <MenuItem value={10}>Ten</MenuItem>
                <MenuItem value={20}>Twenty</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem>
              </Select>
            </Stack>

            <Stack
              direction="row"
              display="flex"
              justifyContent={{ sm: "flex-end", xs: "flex-start" }}
              sx={{ width: "100%" }}
            >
              <Button sx={{ width: { xs: "100%" } }} variant="contained">
                Save
              </Button>
            </Stack>
          </Box>
          <Box
            sx={{
              backdropFilter: "blur(24px)",
              background: "rgba(132, 204, 22, 0.05)", // Increased opacity for whiter tint
              boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)", // Subtle shadow for depth
              borderRadius: "8px",
              flex: 3,
              m: 1,
              p: 2,
            }}
          >
            <Stack display="flex" alignItems="center">
              <Stack
                display="flex"
                direction="column"
                alignItems="center"
                sx={{
                  p: 1,
                  m: 1,
                  width: "100%",
                  borderRadius: "8px",
                  backgroundColor: "rgba(132, 204, 22, 0.025)",
                }}
              >
                <Typography variant="h2">🔥</Typography>
                <Typography fontWeight="bold">0 Days</Typography>
              </Stack>
              <Stack
                display="flex"
                direction="column"
                alignItems="center"
                sx={{
                  p: 1,
                  m: 1,
                  width: "100%",
                  borderRadius: "8px",
                  backgroundColor: "rgba(132, 204, 22, 0.025)",
                }}
                spacing={1}
              >
                <Typography>Notifications</Typography>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}
