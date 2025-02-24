import { useState } from 'react';
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
import * as Activities from "./Activities";
import { styled, alpha } from "@mui/material/styles";

const StyledCard = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  borderRadius: 12,
  backdropFilter: "blur(24px)",
  border: "1px solid",
  borderColor: (theme.vars || theme).palette.divider,
  backgroundColor: theme.vars
    ? `rgba(${theme.vars.palette.background.defaultChannel} / 0.4)`
    : alpha(theme.palette.background.default, 0.4),
  boxShadow: (theme.vars || theme).shadows[1],
}));

const StyledSelect = styled(Select)(({ theme }) => ({
  '& .MuiSelect-select': {
    backdropFilter: "blur(24px)",
    backgroundColor: theme.vars
      ? `rgba(${theme.vars.palette.background.defaultChannel} / 0.4)`
      : alpha(theme.palette.background.default, 0.4),
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: (theme.vars || theme).palette.divider,
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.primary.main,
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.primary.main,
  }
}));

export default function CreateActivity() {

  const [workoutType, updateWorkoutType] = useState('')
  const [activity, updateActivity] = useState('')

  function getActivities() {
    if (workoutType == Activities.WorkoutType.CARDIO) {
      return Activities.Cardio;
    } else if (workoutType == Activities.WorkoutType.STRENGTH) {
      return Activities.Strength;
    }  else if (workoutType === Activities.WorkoutType.MOBILITY) {
      return Activities.Mobility;
    } else {
      return Activities.Mobility;
    }
  }

  return (
    <Box
      sx={{
        backgroundImage:
          "radial-gradient(ellipse 80% 50% at 50% -20%, hsl(84, 81%, 14%), transparent)",
        minHeight: '100vh'
      }}
    >
      <NavBar />
      <Container
        sx={{
          display: "flex",
          flexDirection: "column",
          pt: { xs: 10, sm: 12 },
          pb: { xs: 6, sm: 8 },
          gap: 3
        }}
      >
        <Stack direction="row" spacing={2}>
          <Typography 
            sx={{ 
              color: 'text.secondary',
              cursor: 'pointer',
              '&:hover': { color: 'primary.main' }
            }}
          >
            Back
          </Typography>
          <Typography color="text.secondary">Programs / Activity</Typography>
        </Stack>
        <Typography 
          sx={{ 
            fontSize: "clamp(2rem, 5vw, 2.5rem)",
            fontWeight: "bold",
            color: 'primary.main',
            mb: 2
          }}
        >
          New Activity
        </Typography>
        <Stack
          direction={{ xs: "column-reverse", sm: "row" }}
          spacing={{ xs: 3, sm: 4 }}
          alignItems="flex-start"
        >
          <StyledCard
            sx={{
              flex: 7,
              p: { xs: 3, sm: 4 },
              gap: 4,
              width: '100%'
            }}
          >
            <Stack spacing={1}>
              <Typography variant="subtitle1" color="text.secondary">
                Workout Type
              </Typography>
              <StyledSelect
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={workoutType}
                size="small"
                sx={{ width: "100%" }}
                onChange={(event)=> updateWorkoutType(event.target.value)}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      backdropFilter: "blur(24px)",
                      backgroundColor: 'rgba(0, 0, 0, 0.4)',
                      border: "1px solid",
                      borderColor: 'divider',
                      '& .MuiMenuItem-root': {
                        '&:hover': {
                          backgroundColor: 'rgba(132, 204, 22, 0.1)',
                        },
                        '&.Mui-selected': {
                          backgroundColor: 'rgba(132, 204, 22, 0.2)',
                          '&:hover': {
                            backgroundColor: 'rgba(132, 204, 22, 0.3)',
                          }
                        }
                      }
                    }
                  }
                }}
              >
                {
                  Object.values(Activities.WorkoutType).map((workout) => (
                    <MenuItem key={workout} value={workout}>{workout}</MenuItem>
                  ))
                }
              </StyledSelect>
            </Stack>

            <Stack spacing={1}>
              <Typography variant="subtitle1" color="text.secondary">
                Activity
              </Typography>
              <StyledSelect
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={activity}
                size="small"
                sx={{ width: "100%" }}
                onChange={(event) => updateActivity(event.target.value)}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      backdropFilter: "blur(24px)",
                      backgroundColor: 'rgba(0, 0, 0, 0.4)',
                      border: "1px solid",
                      borderColor: 'divider',
                      maxHeight: 300,
                      '& .MuiMenuItem-root': {
                        '&:hover': {
                          backgroundColor: 'rgba(132, 204, 22, 0.1)',
                        },
                        '&.Mui-selected': {
                          backgroundColor: 'rgba(132, 204, 22, 0.2)',
                          '&:hover': {
                            backgroundColor: 'rgba(132, 204, 22, 0.3)',
                          }
                        }
                      }
                    }
                  }
                }}
              >
                {
                  Object.values(getActivities()).map((workout) => (
                    <MenuItem key={workout} value={workout}>{workout}</MenuItem>
                  ))
                }
              </StyledSelect>
            </Stack>

            {workoutType === Activities.WorkoutType.CARDIO && (
              <Stack spacing={3}>
                <Stack direction="row" spacing={3}>
                  <Stack spacing={1} flex={1}>
                    <Typography variant="subtitle1" color="text.secondary">
                      Duration
                    </Typography>
                    <TextField
                      variant="outlined"
                      size="small"
                      type="number"
                      sx={{ 
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            borderColor: (theme) => theme.palette.divider,
                          },
                          '&:hover fieldset': {
                            borderColor: 'primary.main',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: 'primary.main',
                          },
                        }
                      }}
                    />
                  </Stack>
                  <Stack spacing={1} sx={{ width: "120px" }}>
                    <Typography variant="subtitle1" color="text.secondary">
                      Unit
                    </Typography>
                    <StyledSelect
                      size="small"
                      defaultValue="min"
                      sx={{ width: "100%" }}
                      MenuProps={{
                        PaperProps: {
                          sx: {
                            backdropFilter: "blur(24px)",
                            backgroundColor: 'rgba(0, 0, 0, 0.4)',
                            border: "1px solid",
                            borderColor: 'divider',
                            '& .MuiMenuItem-root': {
                              '&:hover': {
                                backgroundColor: 'rgba(132, 204, 22, 0.1)',
                              },
                              '&.Mui-selected': {
                                backgroundColor: 'rgba(132, 204, 22, 0.2)',
                                '&:hover': {
                                  backgroundColor: 'rgba(132, 204, 22, 0.3)',
                                }
                              }
                            }
                          }
                        }
                      }}
                    >
                      <MenuItem value="min">Minutes</MenuItem>
                      <MenuItem value="hr">Hours</MenuItem>
                    </StyledSelect>
                  </Stack>
                </Stack>

                <Stack spacing={1}>
                  <Typography variant="subtitle1" color="text.secondary">
                    Distance
                  </Typography>
                  <TextField
                    id="outlined-basic"
                    variant="outlined"
                    size="small"
                    type="time"
                    sx={{ width: "100%" }}
                  />
                </Stack>
              </Stack>
            )}

            {(workoutType === Activities.WorkoutType.STRENGTH || workoutType === Activities.WorkoutType.MOBILITY) && (
              <Stack direction="row" spacing={3}>
                <Stack spacing={1} sx={{ flex: 1 }}>
                  <Typography variant="subtitle1" color="text.secondary">
                    Reps
                  </Typography>
                  <TextField
                    id="outlined-basic"
                    variant="outlined"
                    size="small"
                    margin="none"
                    type="number"
                    sx={{ width: "100%" }}
                  />
                </Stack>
                <Stack spacing={1} sx={{ flex: 1 }}>
                  <Typography variant="subtitle1" color="text.secondary">
                    Sets
                  </Typography>
                  <TextField
                    id="outlined-basic"
                    variant="outlined"
                    size="small"
                    margin="none"
                    type="number"
                    sx={{ width: "100%" }}
                  />
                </Stack>
                {workoutType === Activities.WorkoutType.STRENGTH && (
                  <Stack spacing={1} sx={{ flex: 1 }}>
                    <Typography variant="subtitle1" color="text.secondary">
                      Weight
                    </Typography>
                    <TextField
                      id="outlined-basic"
                      variant="outlined"
                      size="small"
                      margin="none"
                      type="number"
                    />
                  </Stack>
                )}
              </Stack>
            )}

            <Button 
              variant="contained"
              sx={{ 
                width: "100%",
                py: 2,
                mt: 2,
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 500,
                borderRadius: '8px',
                backgroundColor: 'primary.main',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                }
              }}
            >
              Save Activity
            </Button>
          </StyledCard>
          <StyledCard
            sx={{
              flex: 3,
              p: { xs: 3, sm: 4 },
              width: { xs: '100%', sm: 'auto' }
            }}
          >
            <Stack spacing={3} width="100%">
              <Stack
                alignItems="center"
                spacing={2}
                sx={{
                  p: 3,
                  borderRadius: "12px",
                  background: "rgba(132, 204, 22, 0.03)",
                }}
              >
                <InfoIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                <Typography 
                  align="center"
                  sx={{ 
                    color: 'text.secondary',
                    lineHeight: 1.5
                  }}
                >
                  Select a workout to learn more about it
                </Typography>
              </Stack>

              <Stack
                alignItems="center"
                spacing={2}
                sx={{
                  p: 3,
                  borderRadius: "12px",
                  background: "rgba(132, 204, 22, 0.03)",
                }}
              >
                <Typography variant="subtitle1" fontWeight="bold">
                  AI Recommendation
                </Typography>
                <TryIcon sx={{ fontSize: 40, color: 'primary.main' }} />
              </Stack>
            </Stack>
          </StyledCard>
        </Stack>
      </Container>
    </Box>
  );
}
