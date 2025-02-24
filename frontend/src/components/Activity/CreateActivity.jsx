import { useState } from 'react';
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import { Typography, Tooltip, Snackbar, Alert } from "@mui/material";
import Select from "@mui/material/Select";
import InfoIcon from '@mui/icons-material/Info';
import TryIcon from '@mui/icons-material/Try';
import * as Activities from "./Activities";
import { styled, alpha } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { addDoc, collection, db } from "../../firebase/firebase";
import { useAuth } from '../../hooks/useAuth';
import AddIcon from '@mui/icons-material/Add';

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
  padding: theme.spacing(3),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  },
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
    weight: '',
    durationUnit: 'min',
    distanceUnit: 'km'
  });
  const { user } = useAuth();
  const navigate = useNavigate();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState({ message: '', severity: 'success' });
  const [saving, setSaving] = useState(false);

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

  const handleSubmit = async () => {
    if (validateForm()) {
      setSaving(true);
      try {
        const activityData = {
          userId: user.uid,
          workoutType,
          activity,
          createdAt: new Date().toISOString(),
          ...(workoutType === Activities.WorkoutType.CARDIO && {
            duration: Number(formData.duration),
            distance: Number(formData.distance),
            durationUnit: formData.durationUnit,
            distanceUnit: formData.distanceUnit
          }),
          ...(workoutType === Activities.WorkoutType.STRENGTH && {
            reps: Number(formData.reps),
            sets: Number(formData.sets),
            weight: Number(formData.weight)
          }),
          ...(workoutType === Activities.WorkoutType.MOBILITY && {
            reps: Number(formData.reps),
            sets: Number(formData.sets)
          })
        };

        await addDoc(collection(db, "activities"), activityData);
        setOpenSnackbar(true);
        setSnackbarMessage({
          message: 'Activity saved successfully!',
          severity: 'success'
        });
        setTimeout(() => {
          navigate('/activity-page');
        }, 1500);
      } catch (error) {
        console.error("Error saving activity:", error);
        setOpenSnackbar(true);
        setSnackbarMessage({
          message: 'Failed to save activity. Please try again.',
          severity: 'error'
        });
      } finally {
        setSaving(false);
      }
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
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
      <Container
        sx={{
          display: "flex",
          flexDirection: "column",
          pt: { xs: 6, sm: 8 },
          pb: { xs: 3, sm: 4 },
          gap: 1.5
        }}
      >
        <Stack 
          direction="row" 
          spacing={1} 
          sx={{ 
            cursor: 'pointer',
            width: 'fit-content',
            '&:hover': { 
              color: 'primary.main',
            }
          }}
          onClick={() => navigate('/activity-page')}
        >
          <ArrowBackIcon sx={{ fontSize: 20 }} />
          <Typography 
            sx={{ 
              color: 'inherit',
              fontSize: '0.875rem',
              fontWeight: 500
            }}
          >
            Back to Activities
          </Typography>
        </Stack>
        <Typography 
          variant="h4" 
          sx={{ 
            fontWeight: 'bold',
            color: 'primary.main',
            fontSize: { xs: '1.75rem', sm: '2.125rem' }
          }}
        >
          New Activity
        </Typography>
        <Stack
          direction={{ xs: "column-reverse", sm: "row" }}
          spacing={{ xs: 2, sm: 3 }}
          alignItems="flex-start"
        >
          <StyledCard
            sx={{
              flex: 7,
              width: '100%'
            }}
          >
            <Stack spacing={{ xs: 2, sm: 3 }}>
              <Box>
                <Typography 
                  variant="subtitle1" 
                  color="text.secondary" 
                  sx={{ 
                    mb: { xs: 0.5, sm: 1 },
                    fontSize: { xs: '0.875rem', sm: '1rem' }
                  }}
                >
                  Workout Type
                </Typography>
                <StyledSelect
                  value={workoutType}
                  size="small"
                  sx={{ 
                    width: "100%",
                    '& .MuiSelect-select': {
                      py: { xs: 0.75, sm: 1 },
                      fontSize: { xs: '0.875rem', sm: '1rem' }
                    }
                  }}
                  onChange={(event) => {
                    updateWorkoutType(event.target.value);
                    updateActivity(''); // Reset activity when type changes
                  }}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        maxHeight: 300,
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
                    },
                    anchorOrigin: {
                      vertical: 'bottom',
                      horizontal: 'left',
                    },
                    transformOrigin: {
                      vertical: 'top',
                      horizontal: 'left',
                    }
                  }}
                >
                  {Object.values(Activities.WorkoutType).map((type) => (
                    <MenuItem key={type} value={type}>{type}</MenuItem>
                  ))}
                </StyledSelect>
              </Box>

              {workoutType && (
                <Box>
                  <Typography 
                    variant="subtitle1" 
                    color="text.secondary"
                    sx={{ 
                      mb: { xs: 0.5, sm: 1 },
                      fontSize: { xs: '0.875rem', sm: '1rem' }
                    }}
                  >
                    Activity
                  </Typography>
                  <StyledSelect
                    value={activity}
                    size="small"
                    sx={{ 
                      width: "100%",
                      '& .MuiSelect-select': {
                        py: { xs: 0.75, sm: 1 },
                        fontSize: { xs: '0.875rem', sm: '1rem' }
                      }
                    }}
                    onChange={(event) => updateActivity(event.target.value)}
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          maxHeight: 300,
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
                      },
                      anchorOrigin: {
                        vertical: 'bottom',
                        horizontal: 'left',
                      },
                      transformOrigin: {
                        vertical: 'top',
                        horizontal: 'left',
                      }
                    }}
                  >
                    {Object.values(getActivities()).map((workout) => (
                      <MenuItem key={workout} value={workout}>{workout}</MenuItem>
                    ))}
                  </StyledSelect>
                </Box>
              )}

              {workoutType === Activities.WorkoutType.CARDIO && (
                <Stack spacing={{ xs: 2, sm: 3 }}>
                  <Stack 
                    direction={{ xs: 'column', sm: 'row' }} 
                    spacing={{ xs: 2, sm: 3 }}
                  >
                    <Box flex={1}>
                      <Typography 
                        variant="subtitle1" 
                        color="text.secondary"
                        sx={{ 
                          mb: { xs: 0.5, sm: 1 },
                          fontSize: { xs: '0.875rem', sm: '1rem' }
                        }}
                      >
                        Duration
                      </Typography>
                      <Stack 
                        direction="row" 
                        spacing={1}
                        sx={{ 
                          flexWrap: { xs: 'wrap', sm: 'nowrap' }
                        }}
                      >
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
                            minWidth: { xs: '100%', sm: 'auto' },
                            mb: { xs: 1, sm: 0 }
                          }}
                          error={!!formErrors.duration}
                          helperText={formErrors.duration}
                          value={formData.duration}
                          onChange={handleInputChange('duration')}
                        />
                        <StyledSelect
                          size="small"
                          value={formData.durationUnit}
                          onChange={handleInputChange('durationUnit')}
                          sx={{ 
                            width: { xs: '100%', sm: '120px' }
                          }}
                        >
                          <MenuItem value="min">Minutes</MenuItem>
                          <MenuItem value="hr">Hours</MenuItem>
                        </StyledSelect>
                      </Stack>
                    </Box>
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
                        value={formData.distanceUnit}
                        onChange={handleInputChange('distanceUnit')}
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
                <Stack 
                  direction={{ xs: 'column', sm: 'row' }} 
                  spacing={{ xs: 2, sm: 3 }}
                >
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

              <Box sx={{ 
                display: 'flex',
                justifyContent: 'flex-end',
                mt: { xs: 3, sm: 4 },
                gap: 2
              }}>
                <Button 
                  variant="outlined"
                  onClick={() => navigate('/activity-page')}
                  sx={{ 
                    px: { xs: 2, sm: 3 },
                    py: { xs: 0.75, sm: 1 },
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                    textTransform: 'none',
                    borderRadius: '8px',
                    borderColor: 'divider',
                    color: 'text.secondary',
                    '&:hover': {
                      borderColor: 'primary.main',
                      backgroundColor: 'rgba(132, 204, 22, 0.04)',
                    }
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  variant="contained"
                  disabled={saving}
                  onClick={handleSubmit}
                  startIcon={saving ? null : <AddIcon />}
                  sx={{ 
                    px: { xs: 2, sm: 3 },
                    py: { xs: 0.75, sm: 1 },
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                    textTransform: 'none',
                    borderRadius: '8px',
                    backgroundColor: 'primary.main',
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                    }
                  }}
                >
                  {saving ? 'Saving...' : 'Save Activity'}
                </Button>
              </Box>
            </Stack>
          </StyledCard>
          <StyledCard
            sx={{
              flex: 3,
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
      
      <Snackbar
        open={openSnackbar}
        autoHideDuration={1500}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          severity={snackbarMessage.severity}
          variant="filled"
          sx={{ 
            width: '100%',
            bgcolor: 'primary.main',
            '& .MuiAlert-icon': {
              color: 'white'
            }
          }}
        >
          {snackbarMessage.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
