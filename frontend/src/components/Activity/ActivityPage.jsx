import NavBar from "../Landing/NavBar";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import { IconButton, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
export default function ActivityPage() {
  return (
    <Box
      sx={{
        height: "100vh",
        backgroundImage:
          "radial-gradient(ellipse 80% 50% at 50% 50%, hsl(84, 81%, 14%), transparent)",
      }}
    >
      <NavBar />
      <Container
        sx={{
          display: "flex",
          pt: 12,
          pb: { xs: 8, sm: 12 },
        }}
      >
        <Stack display="flex" direction="row" sx={{ flex: 1 }}>
          <Stack
            sx={{
              flex: 5,
              p: 2,
              borderRadius: "8px",
            }}
          >
            <Button
              sx={{ p: 2, display: "flex", width: "100%" }}
              color="primary"
              variant="contained"
            >
              <Typography fontSize="large">New Activity</Typography>
            </Button>

            <Stack
              display="flex"
              alignItems="flex-start"
              justifyContent="flex-start"
              sx={{
                mt: 2,
                p: 2,
                bordeRadius: "8px",
                backgroundColor: "rgba(0,0,0, 0.5)",
              }}
              spacing={2}
            >
              <Typography fontSize="large">Today's Activity</Typography>
              <Stack sx={{ borderRadius: "8px" }} spacing={1}>
                Nothing to show
              </Stack>
            </Stack>

            <Stack
              display="flex"
              direction="row"
              alignItems="center"
              justifyContent="flex-start"
              sx={{
                mt: 2,
                p: 2,
                bordeRadius: "8px",
                backgroundColor: "rgba(0,0,0, 0.5)",
              }}
              spacing={2}
            >
              <Typography fontSize="large">Previous Activities</Typography>
            </Stack>
          </Stack>

          <Stack
            direction="row"
            display="flex"
            justifyContent="flex-start"
            spacing={2}
            sx={{ flex: 5, p: 2 }}
          >
            <Stack
              display="flex"
              direction="row"
              justifyContent="space-between"
              sx={{
                p: 2,
                borderRadius: "8px",
                background: "rgba(132, 204, 22, 0.05)",
                flex: 1,
              }}
              spacing={2}
            >
              <Stack
                display="flex"
                alignItems="center"
                spacing={1}
                sx={{ p: 2, background: "rgba(132, 204, 22, 0.05)" }}
              >
                <Typography fontSize="large" fontWeight="bold">
                  Streak
                </Typography>
                <Typography
                  variant="h3"
                  style={{ textShadow: "0 0 2px yellow" }}
                >
                  🔥
                </Typography>
                <Typography fontSize="small">0 days</Typography>
              </Stack>

              <Stack
                sx={{ width: "100%", background: "rgba(132, 204, 22, 0.05)" }}
              >
                <Stack
                  display="flex"
                  justifyContent="space-between"
                  alignItems="flex-start"
                  direction="row"
                  sx={{ p: 2 }}
                >
                  <Stack display="flex" justifyContent="center" sx={{ pt: 1 }}>
                    <Typography>February 2025</Typography>
                  </Stack>
                  <Stack direction="row">
                    <IconButton>
                      <NavigateBeforeIcon />
                    </IconButton>
                    <IconButton>
                      <NavigateNextIcon />
                    </IconButton>
                  </Stack>
                </Stack>

                <Stack
                  sx={{ p: 2 }}
                  direction="row"
                  display="flex"
                  justifyContent="space-between"
                >
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "5em",
                        p: 2,
                        borderRadius: "24px",
                      }}
                    >
                      <Stack display="flex" alignItems="center">
                        <Typography>M</Typography>
                        <Typography> {index}</Typography>
                      </Stack>
                    </Box>
                  ))}
                </Stack>
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
