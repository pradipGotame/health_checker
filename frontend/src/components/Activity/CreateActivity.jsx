import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import NavBar from "../Landing/NavBar";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import { Typography } from "@mui/material";
import Select from "@mui/material/Select";
import InfoIcon from '@mui/icons-material/Info';
import TryIcon from '@mui/icons-material/Try';

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
        <Stack direction="row" spacing={2} sx={{ pl: 2 }}>
          <Typography>Back</Typography>
          <Typography>Programs / Activity</Typography>
        </Stack>
        <Typography sx={{ fontSize: 36, fontWeight: "bold", p: 2 }}>
          New Activity
        </Typography>
        <Stack
          display="flex"
          justifyContent="space-between"
          alignItems={{ sm: "flex-start" }}
          direction={{ xs: "column-reverse", sm: "row" }}
          spacing={2}
        >
          <Box
            sx={{
              backdropFilter: "blur(24px)",
              background: "rgba(132, 204, 22, 0.05)",
              boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
              borderRadius: "8px",
              flex: 7,
              p: 2,
            }}
          >
            <Stack
              direction="row"
              display="flex"
              justifyContent="space-between"
              sx={{ mb: 4, width: "100%" }}
              spacing={2}
            >
              <Stack sx={{ width: "100%" }}>
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
            </Stack>

            <Stack sx={{ mb: 4 }}>
              <Typography>Activity</Typography>
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
              <Stack sx={{ width: "90%" }}>
                <Typography>Duration</Typography>
                <TextField
                  id="outlined-basic"
                  variant="outlined"
                  size="small"
                  type="number"
                  sx={{ width: "100%" }}
                />
              </Stack>
              <Stack sx={{ width: "10%" }}>
                <Typography>Unit</Typography>
                <TextField
                  id="outlined-basic"
                  variant="outlined"
                  size="small"
                  type="number"
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
              <Stack sx={{ width: "100%" }}>
                <Typography>Distance</Typography>
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
              <Stack sx={{ width: "30%" }}>
                <Typography>Reps</Typography>
                <TextField
                  id="outlined-basic"
                  variant="outlined"
                  size="small"
                  margin="none"
                  type="number"
                  sx={{ width: "100%" }}
                />
              </Stack>
              <Stack sx={{ width: "30%" }}>
                <Typography>Sets</Typography>
                <TextField
                  id="outlined-basic"
                  variant="outlined"
                  size="small"
                  margin="none"
                  type="number"
                  sx={{ width: "100%" }}
                />
              </Stack>
              <Stack sx={{ width: "30%" }}>
                <Typography>Weight</Typography>
                <TextField
                  id="outlined-basic"
                  variant="outlined"
                  size="small"
                  margin="none"
                  type="number"
                />
              </Stack>

              <Stack sx={{ width: "10%" }}>
                <Typography>Unit</Typography>
                <TextField
                  id="outlined-basic"
                  variant="outlined"
                  size="small"
                  margin="none"
                  type="number"
                />
              </Stack>
            </Stack>

            <Stack sx={{ mb: 4 }}>
              <Typography sx={{ mb: 1 }}>Location</Typography>
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
              <Button sx={{ width: "100%" }} variant="contained">
                Save
              </Button>
            </Stack>
          </Box>
          <Box
            sx={{
              backdropFilter: "blur(24px)",
              background: "rgba(132, 204, 22, 0.05)",
              boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
              borderRadius: "8px",
              flex: 3,
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
                <InfoIcon />
                <Typography>Select a workout to learn more about it</Typography>
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
                <Typography>AI Recommendation</Typography>
                <TryIcon />
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}
