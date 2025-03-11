import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import { Typography, Tooltip, Snackbar, Alert } from "@mui/material";
import Select from "@mui/material/Select";
import InfoIcon from "@mui/icons-material/Info";
import TryIcon from "@mui/icons-material/Try";
import * as Activities from "./Activities";
import { styled, alpha } from "@mui/material/styles";
import { useNavigate, useLocation } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  addDoc,
  collection,
  updateDoc,
  doc,
  app,
  createNotification,
  getDoc,
} from "../../firebase/firebase";
import { useAuth } from "../../hooks/useAuth";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDocs, getFirestore, query, where } from "firebase/firestore";
import {
  getCardioSuggestionsWithAi,
  getMobilitySuggestionsWithAi,
  getStrengthSuggestionsWithAi,
} from "../../ai/suggestions";

const StyledCard = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  borderRadius: 12,
  backdropFilter: "blur(24px)",
  border: "1px solid",
  borderColor: (theme.vars || theme).palette.divider,
  backgroundColor: theme.vars
    ? `rgba(${theme.vars.palette.background.defaultChannel} / 0.4)`
    : alpha(theme.palette.background.default, 0.4),
  boxShadow: (theme.vars || theme).shadows[1],
  padding: theme.spacing(3),
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(2),
  },
}));

const StyledSelect = styled(Select)(({ theme }) => ({
  "& .MuiSelect-select": {
    backdropFilter: "blur(24px)",
    backgroundColor: theme.vars
      ? `rgba(${theme.vars.palette.background.defaultChannel} / 0.4)`
      : alpha(theme.palette.background.default, 0.4),
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: (theme.vars || theme).palette.divider,
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: theme.palette.primary.main,
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: theme.palette.primary.main,
  },
}));

export default function CreateActivity() {
  const location = useLocation();
  console.log("Location state:", location.state);
  const editMode = location.state?.editMode;
  const editActivity = location.state?.activity;
  const preselectedType = location.state?.workoutType;

  const [workoutType, updateWorkoutType] = useState(
    editMode ? editActivity.workoutType : preselectedType || ""
  );
  const [activity, updateActivity] = useState(
    editMode ? editActivity.activity : ""
  );
  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({
    duration: editMode && editActivity.duration ? editActivity.duration : "",
    distance: editMode && editActivity.distance ? editActivity.distance : "",
    reps: editMode && editActivity.reps ? editActivity.reps : "",
    sets: editMode && editActivity.sets ? editActivity.sets : "",
    weight: editMode && editActivity.weight ? editActivity.weight : "",
    durationUnit:
      editMode && editActivity.durationUnit ? editActivity.durationUnit : "min",
    distanceUnit:
      editMode && editActivity.distanceUnit ? editActivity.distanceUnit : "m",
  });
  const { user } = useAuth();
  const navigate = useNavigate();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState({
    message: "",
    severity: "success",
  });
  const [saving, setSaving] = useState(false);
  const [userDoc, setUserDoc] = useState(null);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [suggestions, setSuggestions] = useState({});
  const auth = getAuth(app);
  const db = getFirestore(app);

  useEffect(() => {
    if (location.state?.activity?.suggestions) {
      setSuggestions(location.state.activity.suggestions);
    }
  }, [location.state]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          const q = query(
            collection(db, "users"),
            where("userId", "==", user.uid)
          );
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            const doc = querySnapshot.docs[0];
            const fetchedData = doc.data();
            console.log("User document data:", fetchedData);
            setUserDoc(fetchedData);
          } else {
            console.log("No matching document");
          }
        }
      } catch (err) {
        console.error("Error getting user document:", err);
      }
    });
    return () => unsubscribe();
  }, [auth, db]);

  useEffect(() => {
    if (isSuggesting) {
      // Call AI suggestion API
      const user = userDoc;
      const workout = {
        type: workoutType,
        activity,
        ...formData,
      };
      if (!user || !workoutType || !activity) {
        setIsSuggesting(false);
        return;
      }
      async function getSuggestions(user, workout) {
        try {
          console.log("Getting AI suggestion...");
          let suggestions = {};
          if (workoutType === Activities.WorkoutType.CARDIO) {
            suggestions = await getCardioSuggestionsWithAi(user, {
              type: workout.type,
              activity: workout.activity,
            });
            setFormData(() => ({
              duration: suggestions.techniques.total_duration,
              distance: suggestions.techniques.total_distance,
              durationUnit: "min",
              distanceUnit: "m",
            }));
          } else if (workoutType === Activities.WorkoutType.STRENGTH) {
            suggestions = await getStrengthSuggestionsWithAi(user, {
              type: workout.type,
              activity: workout.activity,
            });
            if (!suggestions) {
              console.error("No suggestions found");
              return;
            }
            setFormData(() => ({
              reps: suggestions.techniques.reps,
              sets: suggestions.techniques.sets,
              weight: suggestions.techniques.weight,
            }));
          } else {
            suggestions = await getMobilitySuggestionsWithAi(user, {
              type: workout.type,
              activity: workout.activity,
            });
            if (!suggestions) {
              console.error("No suggestions found");
              return;
            }
            setFormData(() => ({
              reps: suggestions.techniques.reps,
              sets: suggestions.techniques.sets,
            }));
          }
          setSuggestions(suggestions);
          console.log("AI suggestions:", suggestions);
        } catch (error) {
          console.error("Error getting AI suggestion:", error);
        } finally {
          setIsSuggesting(false);
        }
      }
      getSuggestions(user, workout);
    }
  }, [isSuggesting, userDoc, workoutType, activity, formData]);

  const handleInputChange = (field) => (event) => {
    let value = event.target.value;

    // Prevent negative numbers and validate input
    if (
      field === "duration" ||
      field === "distance" ||
      field === "reps" ||
      field === "sets" ||
      field === "weight"
    ) {
      // Don't allow negative signs or non-numeric characters except decimal point
      value = value.replace(/-/g, "");

      // Ensure it's a valid positive number
      const num = parseFloat(value);
      if (isNaN(num) || num < 0) {
        value = "";
      }
    }

    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!workoutType) {
      errors.workoutType = "Please select a workout type";
    }
    if (!activity) {
      errors.activity = "Please select an activity";
    }

    if (workoutType === Activities.WorkoutType.CARDIO) {
      if (!formData.duration) {
        errors.duration = "Duration is required";
      } else if (formData.duration <= 0) {
        errors.duration = "Duration must be greater than 0";
      }
      if (!formData.distance) {
        errors.distance = "Distance is required";
      } else if (formData.distance <= 0) {
        errors.distance = "Distance must be greater than 0";
      }
    }

    if (
      workoutType === Activities.WorkoutType.STRENGTH ||
      workoutType === Activities.WorkoutType.MOBILITY
    ) {
      if (!formData.reps) {
        errors.reps = "Reps are required";
      } else if (formData.reps <= 0) {
        errors.reps = "Reps must be greater than 0";
      }
      if (!formData.sets) {
        errors.sets = "Sets are required";
      } else if (formData.sets <= 0) {
        errors.sets = "Sets must be greater than 0";
      }
      if (workoutType === Activities.WorkoutType.STRENGTH && !formData.weight) {
        errors.weight = "Weight is required";
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      setSaving(true);
      try {
        const now = new Date();
        const activityData = {
          userId: user.uid,
          workoutType,
          activity,
          createdAt: now,
          status: 'start',
          ...(workoutType === Activities.WorkoutType.CARDIO && {
            duration: Number(formData.duration),
            distance: Number(formData.distance),
            durationUnit: formData.durationUnit,
            distanceUnit: formData.distanceUnit,
            startTime: now,
            endTime: new Date(now.getTime() + (Number(formData.duration) * 60 * 1000)),
          }),
          ...(workoutType === Activities.WorkoutType.STRENGTH && {
            reps: Number(formData.reps),
            sets: Number(formData.sets),
            weight: Number(formData.weight),
          }),
          ...(workoutType === Activities.WorkoutType.MOBILITY && {
            reps: Number(formData.reps),
            sets: Number(formData.sets),
          }),
          suggestions: suggestions,
        };

        console.log('Activity data to be saved:', activityData);

        let activityId;
        if (editMode) {
          // Update existing document
          const activityRef = doc(db, "activities", editActivity.id);
          await updateDoc(activityRef, activityData);
          activityId = editActivity.id;
          setSnackbarMessage({
            message: "Activity updated successfully!",
            severity: "success",
          });
        } else {
          // Create new document
          const activitiesRef = collection(db, "activities");
          const docRef = await addDoc(activitiesRef, activityData);
          activityId = docRef.id;
          console.log('New activity created with ID:', activityId);
          
          setSnackbarMessage({
            message: "Activity saved successfully!",
            severity: "success",
          });

          // Create notification for new activity
          try {
            const message = `You have created a ${workoutType.toLowerCase()} activity: ${activity}`;
            await createNotification(user.uid, 'activity_created', message, activityId);
            console.log('Notification created successfully');
          } catch (notificationError) {
            console.error('Error creating notification:', notificationError);
          }

          // Set up reminder notifications based on activity type
          if (workoutType === Activities.WorkoutType.CARDIO) {
            // For cardio activities, set up middle-point reminder
            const durationInMs = Number(formData.duration) * 60 * 1000;
            const middlePoint = durationInMs / 2;
            
            setTimeout(async () => {
              try {
                // Check if activity is still not completed
                const activityRef = doc(db, "activities", activityId);
                const activityDoc = await getDoc(activityRef);
                if (activityDoc.exists() && activityDoc.data().status !== 'finish') {
                  const reminderMessage = `You're halfway through your ${activity} workout! Keep going!`;
                  await createNotification(user.uid, 'reminder', reminderMessage, activityId);
                }
              } catch (reminderError) {
                console.error('Error creating middle-point reminder:', reminderError);
              }
            }, middlePoint);
          } else if (workoutType === Activities.WorkoutType.STRENGTH || workoutType === Activities.WorkoutType.MOBILITY) {
            // For strength and mobility activities, set up 15-minute reminder
            const reminderInterval = 15 * 60 * 1000; // 15 minutes
            
            setTimeout(async () => {
              try {
                // Check if activity is still not completed
                const activityRef = doc(db, "activities", activityId);
                const activityDoc = await getDoc(activityRef);
                if (activityDoc.exists() && activityDoc.data().status !== 'finish') {
                  const reminderMessage = `Don't forget to complete your ${activity} workout!`;
                  await createNotification(user.uid, 'reminder', reminderMessage, activityId);
                }
              } catch (reminderError) {
                console.error('Error creating reminder notification:', reminderError);
              }
            }, reminderInterval);
          }
        }

        setOpenSnackbar(true);
        setTimeout(() => {
          navigate("/activity-page");
        }, 1500);
      } catch (error) {
        console.error(
          editMode ? "Error updating activity:" : "Error saving activity:",
          error
        );
        setOpenSnackbar(true);
        setSnackbarMessage({
          message: editMode
            ? "Failed to update activity. Please try again."
            : "Failed to save activity. Please try again.",
          severity: "error",
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
    } else if (workoutType === Activities.WorkoutType.MOBILITY) {
      return Activities.Mobility;
    } else {
      return Activities.Mobility;
    }
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
      }}
    >
      <Container
        sx={{
          display: "flex",
          flexDirection: "column",
          pt: { xs: 6, sm: 16 },
          pb: { xs: 3, sm: 4 },
          gap: 1.5,
        }}
      >
        <Stack
          direction="row"
          spacing={1}
          sx={{
            cursor: "pointer",
            width: "fit-content",
            "&:hover": {
              color: "primary.main",
            },
          }}
          onClick={() => navigate("/dashboard")}
        >
          <ArrowBackIcon sx={{ fontSize: 20 }} />
          <Typography
            sx={{
              color: "inherit",
              fontSize: "0.875rem",
              fontWeight: 500,
            }}
          >
            Back to Dashboard
          </Typography>
        </Stack>
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            color: "primary.main",
            fontSize: { xs: "1.75rem", sm: "2.125rem" },
          }}
        >
          {editMode ? "Edit Activity" : "New Activity"}
        </Typography>
        <Stack
          direction={{ xs: "column-reverse", sm: "row" }}
          spacing={{ xs: 2, sm: 3 }}
          alignItems="flex-start"
        >
          <StyledCard
            sx={{
              flex: 7,
              width: "100%",
            }}
          >
            <Stack spacing={{ xs: 2, sm: 3 }}>
              <Box>
                <Typography
                  variant="subtitle1"
                  color="text.secondary"
                  sx={{
                    mb: { xs: 0.5, sm: 1 },
                    fontSize: { xs: "0.875rem", sm: "1rem" },
                  }}
                >
                  Workout Type
                </Typography>
                <StyledSelect
                  value={workoutType}
                  size="small"
                  sx={{
                    width: "100%",
                    "& .MuiSelect-select": {
                      py: { xs: 0.75, sm: 1 },
                      fontSize: { xs: "0.875rem", sm: "1rem" },
                    },
                  }}
                  onChange={(event) => {
                    updateWorkoutType(event.target.value);
                    updateActivity(""); // Reset activity when type changes
                  }}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        maxHeight: 300,
                        backdropFilter: "blur(24px)",
                        backgroundColor: "rgba(0, 0, 0, 0.4)",
                        border: "1px solid",
                        borderColor: "divider",
                        "& .MuiMenuItem-root": {
                          "&:hover": {
                            backgroundColor: "rgba(132, 204, 22, 0.1)",
                          },
                          "&.Mui-selected": {
                            backgroundColor: "rgba(132, 204, 22, 0.2)",
                            "&:hover": {
                              backgroundColor: "rgba(132, 204, 22, 0.3)",
                            },
                          },
                        },
                      },
                    },
                    anchorOrigin: {
                      vertical: "bottom",
                      horizontal: "left",
                    },
                    transformOrigin: {
                      vertical: "top",
                      horizontal: "left",
                    },
                  }}
                >
                  {Object.values(Activities.WorkoutType).map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
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
                      fontSize: { xs: "0.875rem", sm: "1rem" },
                    }}
                  >
                    Activity
                  </Typography>
                  <StyledSelect
                    value={activity}
                    size="small"
                    sx={{
                      width: "100%",
                      "& .MuiSelect-select": {
                        py: { xs: 0.75, sm: 1 },
                        fontSize: { xs: "0.875rem", sm: "1rem" },
                      },
                    }}
                    onChange={(event) => updateActivity(event.target.value)}
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          maxHeight: 300,
                          backdropFilter: "blur(24px)",
                          backgroundColor: "rgba(0, 0, 0, 0.4)",
                          border: "1px solid",
                          borderColor: "divider",
                          "& .MuiMenuItem-root": {
                            "&:hover": {
                              backgroundColor: "rgba(132, 204, 22, 0.1)",
                            },
                            "&.Mui-selected": {
                              backgroundColor: "rgba(132, 204, 22, 0.2)",
                              "&:hover": {
                                backgroundColor: "rgba(132, 204, 22, 0.3)",
                              },
                            },
                          },
                        },
                      },
                      anchorOrigin: {
                        vertical: "bottom",
                        horizontal: "left",
                      },
                      transformOrigin: {
                        vertical: "top",
                        horizontal: "left",
                      },
                    }}
                  >
                    {Object.values(getActivities()).map((workout) => (
                      <MenuItem key={workout} value={workout}>
                        {workout}
                      </MenuItem>
                    ))}
                  </StyledSelect>
                </Box>
              )}

              {workoutType === Activities.WorkoutType.CARDIO && (
                <Stack spacing={{ xs: 2, sm: 3 }}>
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={{ xs: 2, sm: 3 }}
                  >
                    <Box flex={1}>
                      <Typography
                        variant="subtitle1"
                        color="text.secondary"
                        sx={{
                          mb: { xs: 0.5, sm: 1 },
                          fontSize: { xs: "0.875rem", sm: "1rem" },
                        }}
                      >
                        Duration
                      </Typography>
                      <Stack
                        direction="row"
                        spacing={1}
                        sx={{
                          flexWrap: { xs: "wrap", sm: "nowrap" },
                        }}
                      >
                        <TextField
                          variant="outlined"
                          size="small"
                          type="number"
                          inputProps={{
                            step: "1",
                            min: "0",
                          }}
                          sx={{
                            flex: 1,
                            minWidth: { xs: "100%", sm: "auto" },
                            mb: { xs: 1, sm: 0 },
                          }}
                          error={!!formErrors.duration}
                          helperText={formErrors.duration}
                          value={formData.duration}
                          onChange={handleInputChange("duration")}
                        />
                        <StyledSelect
                          size="small"
                          value={formData.durationUnit}
                          onChange={handleInputChange("durationUnit")}
                          sx={{
                            width: { xs: "100%", sm: "120px" },
                          }}
                        >
                          <MenuItem value="min">Minutes</MenuItem>
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
                          min: "0",
                        }}
                        sx={{
                          flex: 1,
                          "& .MuiOutlinedInput-input": {
                            py: 1,
                            fontSize: "0.875rem",
                          },
                        }}
                        error={!!formErrors.distance}
                        helperText={formErrors.distance}
                        value={formData.distance}
                        onChange={handleInputChange("distance")}
                      />
                      <StyledSelect
                        size="small"
                        value={formData.distanceUnit}
                        onChange={handleInputChange("distanceUnit")}
                        sx={{
                          width: "120px",
                          "& .MuiSelect-select": {
                            py: 1,
                            fontSize: "0.875rem",
                          },
                        }}
                      >
                        <MenuItem value="m">Meters</MenuItem>
                      </StyledSelect>
                    </Stack>
                  </Stack>
                </Stack>
              )}

              {(workoutType === Activities.WorkoutType.STRENGTH ||
                workoutType === Activities.WorkoutType.MOBILITY) && (
                <Stack
                  direction={{ xs: "column", sm: "row" }}
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
                        min: "0",
                      }}
                      sx={{
                        "& .MuiOutlinedInput-input": {
                          py: 1,
                          fontSize: "0.875rem",
                        },
                      }}
                      error={!!formErrors.reps}
                      helperText={formErrors.reps}
                      value={formData.reps}
                      onChange={handleInputChange("reps")}
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
                        min: "0",
                      }}
                      sx={{
                        "& .MuiOutlinedInput-input": {
                          py: 1,
                          fontSize: "0.875rem",
                        },
                      }}
                      error={!!formErrors.sets}
                      helperText={formErrors.sets}
                      value={formData.sets}
                      onChange={handleInputChange("sets")}
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
                          min: "0",
                        }}
                        error={!!formErrors.weight}
                        helperText={formErrors.weight}
                        value={formData.weight}
                        onChange={handleInputChange("weight")}
                      />
                    </Stack>
                  )}
                </Stack>
              )}

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  mt: { xs: 3, sm: 4 },
                  gap: 2,
                }}
              >
                <Button
                  variant="outlined"
                  startIcon={<AutoAwesomeIcon />}
                  sx={{
                    textTransform: "none",
                    border: "none",
                    color: "white",
                    background:
                      "linear-gradient(90deg, #1565C0, #6A1B9A, #E91E63)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      background:
                        "linear-gradient(90deg, #1976D2, #8E24AA, #F50057)",
                      boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
                    },
                    // disables style
                    opacity:
                      isSuggesting ||
                      saving ||
                      workoutType === "" ||
                      activity === ""
                        ? 0.5
                        : 1,
                  }}
                  onClick={() => setIsSuggesting(true)}
                  disabled={
                    isSuggesting ||
                    saving ||
                    workoutType === "" ||
                    activity === ""
                  }
                >
                  Get AI Suggestion
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => navigate("/activity-page")}
                  sx={{
                    textTransform: "none",
                    borderColor: "divider",
                    color: "text.secondary",
                    "&:hover": {
                      borderColor: "primary.main",
                      backgroundColor: "rgba(132, 204, 22, 0.04)",
                    },
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  disabled={saving}
                  onClick={handleSubmit}
                  startIcon={
                    saving ? null : editMode ? <EditIcon /> : <AddIcon />
                  }
                  sx={{
                    textTransform: "none",
                    backgroundColor: "primary.main",
                    "&:hover": {
                      backgroundColor: "primary.dark",
                    },
                  }}
                >
                  {saving
                    ? "Saving..."
                    : editMode
                    ? "Update Activity"
                    : "Save Activity"}
                </Button>
              </Box>
            </Stack>
          </StyledCard>
          <StyledCard
            sx={{
              flex: 3,
              width: { xs: "100%", sm: "auto" },
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
                  position: "relative",
                  overflow: "hidden",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "3px",
                    background:
                      "linear-gradient(90deg, transparent, rgba(132, 204, 22, 0.3), transparent)",
                  },
                }}
              >
                <Box sx={{ position: "relative" }}>
                  <Tooltip
                    title="Activity details and information"
                    placement="top"
                    arrow
                  >
                    <InfoIcon
                      sx={{
                        fontSize: 24,
                        color: "primary.main",
                        cursor: "help",
                        transition: "transform 0.2s ease-in-out",
                        "&:hover": {
                          transform: "scale(1.1)",
                        },
                      }}
                    />
                  </Tooltip>
                </Box>

                <Box
                  sx={{
                    width: "100%",
                    transition: "opacity 0.3s ease",
                    opacity: workoutType ? 1 : 0.7,
                  }}
                >
                  {!workoutType ? (
                    <Typography
                      align="center"
                      color="text.secondary"
                      sx={{
                        fontSize: "0.875rem",
                        fontStyle: "italic",
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
                              position: "relative",
                              "&::after": {
                                content: '""',
                                position: "absolute",
                                bottom: -4,
                                left: "50%",
                                transform: "translateX(-50%)",
                                width: "40px",
                                height: "2px",
                                backgroundColor: "primary.main",
                                opacity: 0.5,
                              },
                            }}
                          >
                            {activity}
                          </Typography>
                          <Typography
                            align="center"
                            color="text.secondary"
                            sx={{
                              fontSize: "0.875rem",
                              lineHeight: 1.5,
                              px: 1,
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
                              position: "relative",
                              "&::after": {
                                content: '""',
                                position: "absolute",
                                bottom: -4,
                                left: "50%",
                                transform: "translateX(-50%)",
                                width: "40px",
                                height: "2px",
                                backgroundColor: "primary.main",
                                opacity: 0.5,
                              },
                            }}
                          >
                            {workoutType}
                          </Typography>
                          <Typography
                            align="center"
                            color="text.secondary"
                            sx={{
                              fontSize: "0.875rem",
                              lineHeight: 1.5,
                              px: 1,
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
                  position: "relative",
                  overflow: "hidden",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "3px",
                    background:
                      "linear-gradient(270deg, transparent, rgba(132, 204, 22, 0.3), transparent)",
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 600,
                      color: "primary.main",
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
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
                          color: "primary.main",
                          cursor: "help",
                          transition: "transform 0.2s ease-in-out",
                          "&:hover": {
                            transform: "rotate(15deg)",
                          },
                        }}
                      />
                    </Tooltip>
                  </Typography>
                </Box>

                <Typography
                  align="center"
                  color="text.secondary"
                  sx={{
                    fontSize: "0.875rem",
                    fontStyle: "italic",
                    opacity: 0.8,
                  }}
                >
                  Complete your activity details to get AI suggestions
                </Typography>
              </Stack>
            </Stack>
          </StyledCard>
        </Stack>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
            mt: 3,
          }}
        >
          {Object.keys(suggestions).length > 0 && (
            <StyledCard
              sx={{
                width: "100%",
                p: 2,
                borderRadius: 2,
                backdropFilter: "blur(24px)",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: "primary.main",
                  mb: 1,
                }}
              >
                AI Suggestions
              </Typography>
              <div>
                <h3>Session overview</h3>
                <ul>
                  {Object.entries(suggestions.sessionOverview).map(
                    ([key, value]) => (
                      <li key={key}>
                        <strong>{key.replace(/_/g, " ")}:</strong> {value}
                      </li>
                    )
                  )}
                </ul>
                <h3>Training Techniques</h3>
                <ul>
                  {Object.entries(suggestions.techniques).map(
                    ([key, value]) => (
                      <li key={key}>
                        <strong>{key.replace(/_/g, " ")}:</strong> {value}
                      </li>
                    )
                  )}
                </ul>

                {suggestions.supplementary && <h3>Supplementary Exercises</h3>}
                {suggestions.supplementary &&
                  suggestions.supplementary.map((item, index) => (
                    <li key={index}>
                      <strong>{item.activity}</strong>:{" "}
                      <strong>{item.description}</strong>
                      <ul>
                        <li>Sets: {item.sets}</li>
                        <li>Reps: {item.reps}</li>
                      </ul>
                      <br />
                    </li>
                  ))}

                <h3>Recovery Strategies</h3>
                <ul>
                  {Object.entries(suggestions.recovary).map(([key, value]) => (
                    <li key={key}>
                      <strong>{key.replace(/_/g, " ")}:</strong> {value}
                    </li>
                  ))}
                </ul>
              </div>
            </StyledCard>
          )}
        </Box>
      </Container>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={1500}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity={snackbarMessage.severity}
          variant="filled"
          sx={{
            width: "100%",
            bgcolor: "primary.main",
            "& .MuiAlert-icon": {
              color: "white",
            },
          }}
        >
          {snackbarMessage.message}
        </Alert>
      </Snackbar>
      {/* Create suggestions section */}
    </Box>
  );
}
