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
    <>
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
          direction="row"
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
          sx={{ width: "100%" }}
        >
          <Box
            sx={{
              backgroundColor: "red",
              borderRadius: "8px",
              flex: 7,
              m: 1,
              p: 2,
            }}
          >
            <Stack>
              <Box>Activity Title</Box>
              <TextField
                id="outlined-basic"
                label="Outlined"
                variant="outlined"
              />
            </Stack>
            <Stack
              direction="row"
              display="flex"
              justifyContent="space-between"
            >
              <Stack>
                <Box>Workout Type</Box>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value="Workout"
                  label="Age"
                >
                  <MenuItem value={10}>Ten</MenuItem>
                  <MenuItem value={20}>Twenty</MenuItem>
                  <MenuItem value={30}>Thirty</MenuItem>
                </Select>
                <Box>Workout</Box>
              </Stack>
              <Stack>
                <Box>Duration</Box>
                <TextField
                  id="outlined-basic"
                  label="Outlined"
                  variant="outlined"
                />
              </Stack>
              <Stack direction="row">
                <Stack>
                  <Box>Reps</Box>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value="Workout"
                    label="Age"
                  >
                    <MenuItem value={10}>Ten</MenuItem>
                    <MenuItem value={20}>Twenty</MenuItem>
                    <MenuItem value={30}>Thirty</MenuItem>
                  </Select>
                </Stack>
                <Stack>
                  <Box>Reps</Box>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value="Workout"
                    label="Age"
                  >
                    <MenuItem value={10}>Ten</MenuItem>
                    <MenuItem value={20}>Twenty</MenuItem>
                    <MenuItem value={30}>Thirty</MenuItem>
                  </Select>
                </Stack>
              </Stack>
            </Stack>
            <Stack>
              <Box>Activity Place</Box>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value="Workout"
                label="Age"
              >
                <MenuItem value={10}>Ten</MenuItem>
                <MenuItem value={20}>Twenty</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem>
              </Select>
            </Stack>
            <Stack
              direction="row"
              display="flex"
              justifyContent="flex-end"
              sx={{ width: "100%" }}
            >
              <Button variant="outlined">Save</Button>
            </Stack>
          </Box>
          <Box
            sx={{
              backgroundColor: "red",
              borderRadius: "8px",
              flex: 3,
              m: 1,
              p: 2,
            }}
          >
            <Typography>Streak</Typography>
            <Box>🔥</Box>
            <Box>0 Days</Box>

            <Typography>Recommnedations</Typography>
          </Box>
        </Stack>
      </Container>
    </>
  );
}
