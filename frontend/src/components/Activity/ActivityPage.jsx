import NavBar from "../Landing/NavBar";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import { IconButton, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import { useNavigate } from "react-router-dom";
import { styled, alpha } from "@mui/material/styles";
import { useAuth } from '../../hooks/useAuth';

const StyledCard = styled(Stack)(({ theme }) => ({
  borderRadius: 12,
  backdropFilter: "blur(24px)",
  border: "1px solid",
  borderColor: (theme.vars || theme).palette.divider,
  backgroundColor: theme.vars
    ? `rgba(${theme.vars.palette.background.defaultChannel} / 0.4)`
    : alpha(theme.palette.background.default, 0.4),
  boxShadow: (theme.vars || theme).shadows[1],
}));

export default function ActivityPage() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundImage:
          "radial-gradient(ellipse 80% 50% at 50% -20%, hsl(84, 81%, 14%), transparent)",
      }}
    >
      <NavBar />
      <Container
        sx={{
          display: "flex",
          pt: { xs: 6, sm: 8 },
          pb: { xs: 3, sm: 4 },
          gap: 1.5
        }}
      >
        <Stack
          display="flex"
          direction={{ xs: "column-reverse", sm: "row" }}
          sx={{ flex: 1 }}
          spacing={1.5}
        >
          {/* Left Column */}
          <Stack
            sx={{
              flex: 5,
              gap: 1.5
            }}
          >
            <Typography 
              sx={{ 
                fontSize: '0.875rem',
                color: 'text.secondary'
              }}
            >
              {loading ? 'Loading...' : `Logged in as: ${user?.email}`}
            </Typography>

            <Button
              sx={{ 
                p: 1,
                display: "flex",
                width: "100%",
                borderRadius: "8px",
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 500,
                backgroundColor: 'primary.main',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                }
              }}
              variant="contained"
              onClick={() => navigate("/activity")}
            >
              New Activity
            </Button>

            <StyledCard
              spacing={1.25}
              sx={{
                p: 1.5,
              }}
            >
              <Typography 
                sx={{
                  fontSize: '1.25rem',
                  fontWeight: 500,
                  color: 'primary.main'
                }}
              >
                Today&apos;s Activity
              </Typography>
              <Stack 
                sx={{ 
                  borderRadius: "12px",
                  p: 2,
                  background: "rgba(132, 204, 22, 0.03)",
                }} 
                spacing={1}
              >
                <Typography color="text.secondary">Nothing to show</Typography>
              </Stack>
            </StyledCard>

            <Stack
              sx={{
                p: 2,
                borderRadius: "12px",
                backdropFilter: "blur(16px)",
                background: "rgba(0, 0, 0, 0.2)",
                border: "1px solid rgba(132, 204, 22, 0.1)",
              }}
              spacing={2}
            >
              <Typography 
                sx={{
                  fontSize: '1.25rem',
                  fontWeight: 500,
                  color: 'primary.main'
                }}
              >
                Previous Activities
              </Typography>
            </Stack>
          </Stack>

          {/* Right Column */}
          <Stack
            sx={{ 
              flex: 5,
              gap: 1.5
            }}
          >
            <Stack
              sx={{
                p: 1.5,
                borderRadius: "12px",
                backdropFilter: "blur(16px)",
                background: "rgba(0, 0, 0, 0.2)",
                border: "1px solid rgba(132, 204, 22, 0.1)",
              }}
              spacing={1.5}
            >
              <Stack
                display="flex"
                alignItems="center"
                spacing={2}
                sx={{ 
                  p: 3,
                  borderRadius: "12px",
                  background: "rgba(132, 204, 22, 0.03)",
                }}
              >
                <Typography 
                  sx={{
                    fontSize: '1.25rem',
                    fontWeight: 600,
                    color: 'primary.main'
                  }}
                >
                  Streak
                </Typography>
                <Typography
                  variant="h3"
                  sx={{
                    textShadow: "0 0 8px rgba(255, 255, 0, 0.3)"
                  }}
                >
                  🔥
                </Typography>
                <Typography 
                  sx={{
                    color: 'text.secondary',
                    fontWeight: 500
                  }}
                >
                  0 days
                </Typography>
              </Stack>

              {/* Calendar section */}
              <Stack sx={{ width: "100%" }}>
                <Stack
                  display="flex"
                  justifyContent="space-between"
                  alignItems="flex-start"
                  direction="row"
                  sx={{ 
                    p: 2,
                    borderRadius: '12px',
                    background: "rgba(132, 204, 22, 0.03)",
                  }}
                >
                  <Stack display="flex" justifyContent="center">
                    <Typography
                      sx={{
                        fontSize: '1.25rem',
                        fontWeight: 500,
                        color: 'text.secondary'
                      }}
                    >
                      February 2025
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={1}>
                    <IconButton
                      size="small"
                      sx={{
                        color: 'primary.main',
                        padding: 0.75,
                        '&:hover': {
                          backgroundColor: 'rgba(132, 204, 22, 0.1)',
                        }
                      }}
                    >
                      <NavigateBeforeIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      sx={{
                        color: 'primary.main',
                        '&:hover': {
                          backgroundColor: 'rgba(132, 204, 22, 0.1)',
                        }
                      }}
                    >
                      <NavigateNextIcon />
                    </IconButton>
                  </Stack>
                </Stack>

                <Stack
                  sx={{ 
                    mt: 2,
                    p: 2, 
                    borderRadius: '12px',
                    background: "rgba(132, 204, 22, 0.03)",
                  }}
                  direction="row"
                  display="flex"
                  justifyContent="space-between"
                >
                  {Array.from({ length: 4 }).map((_, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        p: 2,
                        borderRadius: "12px",
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                          backgroundColor: "rgba(132, 204, 22, 0.1)",
                          cursor: 'pointer'
                        }
                      }}
                    >
                      <Stack display="flex" alignItems="center" spacing={1}>
                        <Typography
                          sx={{
                            color: 'text.secondary',
                            fontWeight: 500
                          }}
                        >
                          M
                        </Typography>
                        <Typography
                          sx={{
                            color: 'primary.main',
                            fontWeight: 'bold'
                          }}
                        >
                          {index}
                        </Typography>
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
