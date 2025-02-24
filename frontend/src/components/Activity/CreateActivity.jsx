import { useState } from 'react';
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import NavBar from "../Landing/NavBar";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import { Typography, Tooltip } from "@mui/material";
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
  const [workoutType, updateWorkoutType] = useState('');
  const [activity, updateActivity] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({
    duration: '',
    distance: '',
    reps: '',
    sets: '',
    weight: ''
  });

  const handleInputChange = (field) => (event) => {
    let value = event.target.value;
    
    // Prevent negative numbers and validate input
    if (field === 'duration' || field === 'distance' || 
        field === 'reps' || field === 'sets' || field === 'weight') {
      // Don't allow negative signs or non-numeric characters except decimal point
      value = value.replace(/-/g, '');
      
      // Ensure it's a valid positive number
      const num = parseFloat(value);
      if (isNaN(num) || num < 0) {
        value = '';
      }
    }

    setFormData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!workoutType) {
      errors.workoutType = 'Please select a workout type';
    }
    if (!activity) {
      errors.activity = 'Please select an activity';
    }

    if (workoutType === Activities.WorkoutType.CARDIO) {
      if (!formData.duration) {
        errors.duration = 'Duration is required';
      } else if (formData.duration <= 0) {
        errors.duration = 'Duration must be greater than 0';
      }
      if (!formData.distance) {
        errors.distance = 'Distance is required';
      } else if (formData.distance <= 0) {
        errors.distance = 'Distance must be greater than 0';
      }
    }

    if (workoutType === Activities.WorkoutType.STRENGTH || 
        workoutType === Activities.WorkoutType.MOBILITY) {
      if (!formData.reps) {
        errors.reps = 'Reps are required';
      } else if (formData.reps <= 0) {
        errors.reps = 'Reps must be greater than 0';
      }
      if (!formData.sets) {
        errors.sets = 'Sets are required';
      } else if (formData.sets <= 0) {
        errors.sets = 'Sets must be greater than 0';
      }
      if (workoutType === Activities.WorkoutType.STRENGTH && !formData.weight) {
        errors.weight = 'Weight is required';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      // Submit form logic here
      console.log('Form is valid', { workoutType, activity, ...formData });
    } else {
      console.log('Form has errors', formErrors);
    }
  };

  const handleWorkoutTypeChange = (event) => {
    updateWorkoutType(event.target.value);
    updateActivity(''); // Reset activity when workout type changes
  };

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
          pt: { xs: 6, sm: 8 },
          pb: { xs: 3, sm: 4 },
          gap: 1.5
        }}
      >
        <Stack direction="row" spacing={1.5}>
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
            fontSize: "clamp(1.75rem, 4vw, 2.25rem)",
            fontWeight: "bold",
            color: 'primary.main',
            mb: 1.5
          }}
        >
          New Activity
        </Typography>
        <Stack
          direction={{ xs: "column-reverse", sm: "row" }}
          spacing={{ xs: 1.5, sm: 2 }}
          alignItems="flex-start"
        >
          <StyledCard
            sx={{
              flex: 7,
              p: { xs: 1.5, sm: 2 },
              gap: 2,
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
                sx={{ 
                  width: "100%",
                  '& .MuiSelect-select': {
                    py: 1,
                    fontSize: '0.875rem'
                  }
                }}
                onChange={handleWorkoutTypeChange}
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
                error={!!formErrors.workoutType}
                helperText={formErrors.workoutType}
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
                sx={{ 
                  width: "100%",
                  '& .MuiSelect-select': {
                    py: 1,
                    fontSize: '0.875rem'
                  }
                }}
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
                error={!!formErrors.activity}
                helperText={formErrors.activity}
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
                      inputProps={{
                        step: "1",
                        min: "0"
                      }}
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
                        },
                        '& .MuiOutlinedInput-input': {
                          py: 1,
                          fontSize: '0.875rem'
                        }
                      }}
                      error={!!formErrors.duration}
                      helperText={formErrors.duration}
                      value={formData.duration}
                      onChange={handleInputChange('duration')}
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
                  <Stack direction="row" spacing={2}>
                    <TextField
                      variant="outlined"
                      size="small"
                      type="number"
                      inputProps={{
                        step: "1",
                        min: "0"
                      }}
                      sx={{ 
                        flex: 1,
                        '& .MuiOutlinedInput-input': {
                          py: 1,
                          fontSize: '0.875rem'
                        }
                      }}
                      error={!!formErrors.distance}
                      helperText={formErrors.distance}
                      value={formData.distance}
                      onChange={handleInputChange('distance')}
                    />
                    <StyledSelect
                      size="small"
                      defaultValue="km"
                      sx={{ 
                        width: "120px",
                        '& .MuiSelect-select': {
                          py: 1,
                          fontSize: '0.875rem'
                        }
                      }}
                    >
                      <MenuItem value="km">Kilometers</MenuItem>
                      <MenuItem value="mi">Miles</MenuItem>
                      <MenuItem value="m">Meters</MenuItem>
                    </StyledSelect>
                  </Stack>
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
                    inputProps={{
                      step: "1",
                      min: "0"
                    }}
                    sx={{ 
                      '& .MuiOutlinedInput-input': {
                        py: 1,
                        fontSize: '0.875rem'
                      }
                    }}
                    error={!!formErrors.reps}
                    helperText={formErrors.reps}
                    value={formData.reps}
                    onChange={handleInputChange('reps')}
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
                    inputProps={{
                      step: "1",
                      min: "0"
                    }}
                    sx={{ 
                      '& .MuiOutlinedInput-input': {
                        py: 1,
                        fontSize: '0.875rem'
                      }
                    }}
                    error={!!formErrors.sets}
                    helperText={formErrors.sets}
                    value={formData.sets}
                    onChange={handleInputChange('sets')}
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
                      inputProps={{
                        step: "1",
                        min: "0"
                      }}
                      error={!!formErrors.weight}
                      helperText={formErrors.weight}
                      value={formData.weight}
                      onChange={handleInputChange('weight')}
                    />
                  </Stack>
                )}
              </Stack>
            )}

            <Button 
              variant="contained"
              sx={{ 
                width: "100%",
                py: 1.5,
                mt: 1.5,
                textTransform: 'none',
                fontSize: '0.875rem',
                fontWeight: 500,
                borderRadius: '8px',
                backgroundColor: 'primary.main',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                }
              }}
              onClick={handleSubmit}
            >
              Save Activity
            </Button>
          </StyledCard>
          <StyledCard
            sx={{
              flex: 3,
              p: { xs: 1.5, sm: 2 },
              width: { xs: '100%', sm: 'auto' }
            }}
          >
            <Stack spacing={1.5} width="100%">
              <Stack
                alignItems="center"
                spacing={2}
                sx={{
                  p: 2.5,
                  borderRadius: "12px",
                  background: "rgba(132, 204, 22, 0.03)",
                  minHeight: 160,
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '3px',
                    background: 'linear-gradient(90deg, transparent, rgba(132, 204, 22, 0.3), transparent)'
                  }
                }}
              >
                <Box sx={{ position: 'relative' }}>
                  <Tooltip 
                    title="Activity details and information"
                    placement="top"
                    arrow
                  >
                    <InfoIcon 
                      sx={{ 
                        fontSize: 24,
                        color: 'primary.main',
                        cursor: 'help',
                        transition: 'transform 0.2s ease-in-out',
                        '&:hover': {
                          transform: 'scale(1.1)'
                        }
                      }} 
                    />
                  </Tooltip>
                </Box>
                
                <Box sx={{ 
                  width: '100%',
                  transition: 'opacity 0.3s ease',
                  opacity: workoutType ? 1 : 0.7
                }}>
                  {!workoutType ? (
                    <Typography 
                      align="center"
                      color="text.secondary"
                      sx={{ 
                        fontSize: '0.875rem',
                        fontStyle: 'italic'
                      }}
                    >
                      Select a workout type to see details
                    </Typography>
                  ) : (
                    <Stack spacing={1.5} width="100%">
                      {activity ? (
                        <>
                          <Typography 
                            variant="subtitle1"
                            align="center"
                            color="primary"
                            sx={{ 
                              fontWeight: 600,
                              position: 'relative',
                              '&::after': {
                                content: '""',
                                position: 'absolute',
                                bottom: -4,
                                left: '50%',
                                transform: 'translateX(-50%)',
                                width: '40px',
                                height: '2px',
                                backgroundColor: 'primary.main',
                                opacity: 0.5
                              }
                            }}
                          >
                            {activity}
                          </Typography>
                          <Typography 
                            align="center"
                            color="text.secondary"
                            sx={{ 
                              fontSize: '0.875rem',
                              lineHeight: 1.5,
                              px: 1
                            }}
                          >
                            {Activities.ActivityDescriptions[activity]}
                          </Typography>
                        </>
                      ) : (
                        <>
                          <Typography 
                            variant="subtitle1"
                            align="center"
                            color="primary"
                            sx={{ 
                              fontWeight: 600,
                              position: 'relative',
                              '&::after': {
                                content: '""',
                                position: 'absolute',
                                bottom: -4,
                                left: '50%',
                                transform: 'translateX(-50%)',
                                width: '40px',
                                height: '2px',
                                backgroundColor: 'primary.main',
                                opacity: 0.5
                              }
                            }}
                          >
                            {workoutType}
                          </Typography>
                          <Typography 
                            align="center"
                            color="text.secondary"
                            sx={{ 
                              fontSize: '0.875rem',
                              lineHeight: 1.5,
                              px: 1
                            }}
                          >
                            {Activities.WorkoutDescriptions[workoutType]}
                          </Typography>
                        </>
                      )}
                    </Stack>
                  )}
                </Box>
              </Stack>

              <Stack
                alignItems="center"
                spacing={2}
                sx={{
                  p: 2.5,
                  borderRadius: "12px",
                  background: "rgba(132, 204, 22, 0.03)",
                  minHeight: 120,
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '3px',
                    background: 'linear-gradient(270deg, transparent, rgba(132, 204, 22, 0.3), transparent)'
                  }
                }}
              >
                <Box sx={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  <Typography 
                    variant="subtitle1" 
                    sx={{ 
                      fontWeight: 600,
                      color: 'primary.main',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}
                  >
                    AI Recommendation
                    <Tooltip 
                      title="Get personalized workout suggestions"
                      placement="top"
                      arrow
                    >
                      <TryIcon 
                        sx={{ 
                          fontSize: 20,
                          color: 'primary.main',
                          cursor: 'help',
                          transition: 'transform 0.2s ease-in-out',
                          '&:hover': {
                            transform: 'rotate(15deg)'
                          }
                        }}
                      />
                    </Tooltip>
                  </Typography>
                </Box>

                <Typography
                  align="center"
                  color="text.secondary"
                  sx={{ 
                    fontSize: '0.875rem',
                    fontStyle: 'italic',
                    opacity: 0.8
                  }}
                >
                  Complete your activity details to get AI suggestions
                </Typography>
              </Stack>
            </Stack>
          </StyledCard>
        </Stack>
      </Container>
    </Box>
  );
}
