import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import NavBar from "../Landing/NavBar";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button"
import TextField from "@mui/material/TextField"

export default function CreateActivity() {
  return (
    <>
      <NavBar />
      <Container
        sx={{
          display: "flex",
          flexDirection:"column",
          pt: 12,
          pb: { xs: 8, sm: 12 },
        }}
      >
        <h1>Activity</h1>
        <Stack direction="row" display="flex" justifyContent="space-between" alignItems="flex-start" sx={{width: '100%'}}>
            <Box sx={{backgroundColor: 'red', borderRadius: '8px', flex: 7, m: 1, p: 2}}>
                <Stack>
                    <Box>Activity Title</Box>
                    <TextField id="outlined-basic" label="Outlined" variant="outlined" />
                </Stack>
                <Stack direction="row" display="flex" justifyContent="space-between">
                    <Stack>
                        <Box>Workout Type</Box>
                        <Box>Workout</Box>
                    </Stack>
                    <Stack>
                        <Box>Duration</Box>
                        <Box>Some</Box>
                    </Stack>
                    <Stack direction="row">
                        <Stack>
                            <Box>Reps</Box>
                            <Box>Some</Box>
                        </Stack>
                        <Stack>
                            <Box>Reps</Box>
                            <Box>Sets</Box>
                        </Stack>
                    </Stack>
                </Stack>
                <Stack>
                    <Box>Activity Place</Box>
                    <Box>Location</Box>
                </Stack>
                <Stack direction="row" display="flex" justifyContent="flex-end" sx={{width: '100%'}}>
                    <Button variant="outlined">Save</Button>
                </Stack>
            </Box>
            <Box sx={{backgroundColor: 'red', borderRadius: '8px', flex: 3, m: 1, p:2}}>RTed</Box>
        </Stack>    
      </Container>
    </>
  );
}
