import { useState, useEffect } from "react";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import {
  Typography,
  Grid,
  Divider,
  Skeleton,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";
import { styled, alpha } from "@mui/material/styles";
import { useAuth } from "../../hooks/useAuth";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import EditIcon from "@mui/icons-material/Edit";
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase/firebase";
import {
  format,
  isToday,
  startOfWeek,
  startOfMonth,
  isWithinInterval,
  subDays,
} from "date-fns";
import DeleteIcon from "@mui/icons-material/Delete";
import LinearProgress from '@mui/material/LinearProgress';

const StyledCard = styled(Stack)(({ theme }) => ({
  borderRadius: 12,
  backdropFilter: "blur(24px)",
  border: "1px solid",
  borderColor: (theme.vars || theme).palette.divider,
  backgroundColor: theme.vars
    ? `rgba(${theme.vars.palette.background.defaultChannel} / 0.4)`
    : alpha(theme.palette.background.default, 0.4),
  boxShadow: (theme.vars || theme).shadows[1],
  padding: theme.spacing(2),
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(1.5),
  },
}));

const StatCard = styled(Box)(({ theme }) => ({
  borderRadius: 8,
  padding: theme.spacing(2),
  backgroundColor: alpha(theme.palette.primary.main, 0.1),
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1.5),
}));

const ActivityItem = styled(Box)(({ theme }) => ({
  borderRadius: 8,
  padding: theme.spacing(1.5),
  backgroundColor: alpha(theme.palette.background.paper, 0.4),
  marginBottom: theme.spacing(1),
  "&:hover": {
    backgroundColor: alpha(theme.palette.background.paper, 0.6),
  },
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(1),
  },
}));

const ActivityProgress = ({ activity, onFinish, isActive }) => {
  const [progress, setProgress] = useState(0);
  const [intervalId, setIntervalId] = useState(null);

  useEffect(() => {
    if (
      isActive &&
      activity.workoutType === 'Cardio' && 
      activity.startTime && 
      activity.endTime && 
      activity.status !== 'finish'
    ) {
      const startTime = new Date(activity.startTime).getTime();
      const endTime = new Date(activity.endTime).getTime();
      
      // Calculate and update progress every second
      const id = setInterval(() => {
        const currentTime = new Date().getTime();
        const elapsed = currentTime - startTime;
        const total = endTime - startTime;
        const currentProgress = Math.min((elapsed / total) * 100, 100);

        setProgress(currentProgress);

        // If we've reached the end time, mark as finished
        if (currentProgress >= 100 && activity.status !== 'finish') {
          clearInterval(id);
          onFinish(activity.id);
        }
      }, 1000);

      setIntervalId(id);

      return () => {
        if (id) clearInterval(id);
      };
    }
  }, [activity, onFinish, isActive]);

  // Show completed status for finished activities
  if (activity.status === 'finish') {
    return (
      <Box sx={{ width: '100%', mt: 1, display: 'flex', justifyContent: 'flex-end' }}>
        <Typography 
          variant="caption" 
          sx={{ 
            color: 'success.main',
            display: 'flex',
            alignItems: 'center',
            gap: 0.5 
          }}
        >
          ✓ Completed
        </Typography>
      </Box>
    );
  }

  // Show Mark as Complete button for non-cardio activities
  if (activity.workoutType !== 'Cardio') {
    return (
      <Box sx={{ width: '100%', mt: 1, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          size="small"
          onClick={() => onFinish(activity.id)}
          sx={{
            textTransform: 'none',
            borderRadius: 2,
            bgcolor: 'success.main',
            '&:hover': {
              bgcolor: 'success.dark',
            }
          }}
        >
          Mark as Complete
        </Button>
      </Box>
    );
  }

  // For cardio activities that aren't active
  if (!isActive) {
    return (
      <Box sx={{ width: '100%', mt: 1, display: 'flex', justifyContent: 'flex-end' }}>
        {new Date(activity.startTime) > new Date() ? (
          <Typography variant="caption" color="text.secondary">
            Starts at {format(new Date(activity.startTime), 'h:mm a')}
          </Typography>
        ) : (
          <Button
            variant="contained"
            size="small"
            onClick={() => onFinish(activity.id)}
            sx={{
              textTransform: 'none',
              borderRadius: 2,
              bgcolor: 'success.main',
              '&:hover': {
                bgcolor: 'success.dark',
              }
            }}
          >
            Mark as Complete
          </Button>
        )}
      </Box>
    );
  }

  // Show progress bar only for current active cardio activity
  return (
    <Box sx={{ width: '100%', mt: 1 }}>
      <LinearProgress 
        variant="determinate" 
        value={progress}
        sx={{
          height: 8,
          borderRadius: 4,
          backgroundColor: 'rgba(255,255,255,0.1)',
          '& .MuiLinearProgress-bar': {
            borderRadius: 4,
            backgroundColor: 'primary.main'
          }
        }}
      />
      <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
        {progress === 100 
          ? 'Time completed - Finalizing...'
          : `${Math.round(progress)}% Complete`}
      </Typography>
    </Box>
  );
};

export default function ActivityPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeActivityId, setActiveActivityId] = useState(null);
  const [stats, setStats] = useState({
    streak: 0,
    todayCount: 0,
    weekCount: 0,
    monthCount: 0,
  });
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    activityId: null,
  });

  useEffect(() => {
    const fetchActivities = async () => {
      if (!user) {
        navigate("/login");
        return;
      }

      try {
        const activitiesRef = collection(db, "activities");
        const q = query(
          activitiesRef, 
          where("userId", "==", user.uid),
          orderBy("createdAt", "desc")
        );

        const querySnapshot = await getDocs(q);
        const activitiesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: new Date(doc.data().createdAt),
        }));

        setActivities(activitiesData);

        // Calculate statistics
        const now = new Date();
        const weekStart = startOfWeek(now);
        const monthStart = startOfMonth(now);

        const todayActivities = activitiesData.filter(activity => isToday(activity.createdAt));
        const weekActivities = activitiesData.filter(activity => 
          activity.createdAt >= weekStart && activity.createdAt <= now
        );
        const monthActivities = activitiesData.filter(activity => 
          activity.createdAt >= monthStart && activity.createdAt <= now
        );

        // Calculate streak
        let currentStreak = 0;
        let date = new Date();
        
        while (true) {
          const activitiesOnDate = activitiesData.filter(activity => 
            format(activity.createdAt, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
          );
          
          if (activitiesOnDate.length === 0) {
            break;
          }
          
          currentStreak++;
          date = subDays(date, 1);
        }

        setStats({
          streak: currentStreak,
          todayCount: todayActivities.length,
          weekCount: weekActivities.length,
          monthCount: monthActivities.length,
        });
      } catch (error) {
        console.error("Error fetching activities:", error);
        setActivities([]);
        setStats({
          streak: 0,
          todayCount: 0,
          weekCount: 0,
          monthCount: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchActivities();
    }
  }, [user, navigate]);

  useEffect(() => {
    const checkActiveActivities = () => {
      const now = new Date();
      const activeActivity = activities.find(activity => 
        activity.workoutType === 'Cardio' &&
        activity.startTime &&
        activity.endTime &&
        activity.status !== 'finish' &&
        new Date(activity.startTime) <= now &&
        new Date(activity.endTime) >= now
      );
      
      setActiveActivityId(activeActivity?.id || null);
    };

    checkActiveActivities();
    const interval = setInterval(checkActiveActivities, 1000);
    
    return () => clearInterval(interval);
  }, [activities]);

  const formatActivityDetails = (activity) => {
    if (activity.workoutType === "Cardio") {
      return `${activity.distance}${activity.distanceUnit} in ${activity.duration}${activity.durationUnit}`;
    } else if (activity.workoutType === "Strength") {
      return `${activity.sets} sets × ${activity.reps} reps at ${activity.weight}kg`;
    } else {
      return `${activity.sets} sets × ${activity.reps} reps`;
    }
  };

  const handleDelete = async (activityId) => {
    try {
      await deleteDoc(doc(db, "activities", activityId));

      // Update local state
      setActivities((prev) =>
        prev.filter((activity) => activity.id !== activityId)
      );

      // Update stats
      const updatedActivities = activities.filter(
        (activity) => activity.id !== activityId
      );
      const todayActivities = updatedActivities.filter((activity) =>
        isToday(activity.createdAt)
      );

      setStats({
        streak: 0,
        todayCount: todayActivities.length,
        weekCount: updatedActivities.length,
        monthCount: updatedActivities.length,
      });
    } catch (error) {
      console.error("Error deleting activity:", error);
    }
    setDeleteDialog({ open: false, activityId: null });
  };

  const handleFinishActivity = async (activityId) => {
    try {
      const activityRef = doc(db, "activities", activityId);
      await updateDoc(activityRef, {
        status: 'finish',
        completedAt: new Date().toISOString()
      });

      // Update local state
      setActivities(activities.map(activity => 
        activity.id === activityId 
          ? { ...activity, status: 'finish', completedAt: new Date() }
          : activity
      ));
    } catch (error) {
      console.error("Error finishing activity:", error);
    }
  };

  const ActivityItemWithDelete = ({ activity }) => (
    <ActivityItem key={activity.id}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
            {activity.activity}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              fontSize: { xs: "0.75rem", sm: "0.875rem" },
              wordBreak: "break-word",
            }}
          >
            {formatActivityDetails(activity)}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {format(activity.createdAt, "MMM d, yyyy h:mm a")}
          </Typography>
          <ActivityProgress 
            activity={activity} 
            onFinish={handleFinishActivity}
            isActive={activity.id === activeActivityId}
          />
        </Box>
        <Stack direction="row" spacing={1}>
          <IconButton
            size="small"
            onClick={() =>
              navigate("/create-activity", {
                state: {
                  editMode: true,
                  activity,
                },
              })
            }
            sx={{
              opacity: 0.2,
              color: "text.secondary",
              padding: "4px",
              transition: "all 0.2s ease-in-out",
              "& svg": {
                fontSize: "1.1rem",
              },
              "&:hover": {
                opacity: 1,
                color: "primary.main",
                backgroundColor: "primary.light",
                transform: "scale(1.1)",
              },
              [`${ActivityItem}:hover &`]: {
                opacity: 0.7,
              },
            }}
          >
            <EditIcon />
          </IconButton>
          {/* Only show delete button if activity is not finished */}
          {(!activity.status || activity.status !== 'finish') && (
            <IconButton
              size="small"
              onClick={() =>
                setDeleteDialog({ open: true, activityId: activity.id })
              }
              sx={{
                opacity: 0.2,
                color: "text.secondary",
                padding: "4px",
                transition: "all 0.2s ease-in-out",
                "& svg": {
                  fontSize: "1.1rem",
                },
                "&:hover": {
                  opacity: 1,
                  color: "error.main",
                  backgroundColor: "error.light",
                  transform: "scale(1.1)",
                },
                [`${ActivityItem}:hover &`]: {
                  opacity: 0.7,
                },
              }}
            >
              <DeleteIcon />
            </IconButton>
          )}
        </Stack>
      </Box>
    </ActivityItem>
  );

  if (loading) {
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
            pt: { xs: 6, sm: 8 },
            pb: { xs: 3, sm: 4 },
            gap: 3,
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
            Activity History
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Stack spacing={3}>
                {/* Today's Activities Skeleton */}
                <StyledCard>
                  <Typography
                    variant="h6"
                    sx={{
                      mb: 2,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <CalendarTodayIcon sx={{ color: "primary.main" }} />
                    Today&apos;s Activities
                  </Typography>
                  {[1, 2].map((item) => (
                    <Box key={item} sx={{ mb: 1 }}>
                      <Skeleton variant="rounded" height={80} />
                    </Box>
                  ))}
                </StyledCard>

                {/* Previous Activities Skeleton */}
                <StyledCard>
                  <Typography
                    variant="h6"
                    sx={{
                      mb: 2,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <FitnessCenterIcon sx={{ color: "primary.main" }} />
                    Previous Activities
                  </Typography>
                  {[1, 2, 3].map((item) => (
                    <Box key={item} sx={{ mb: 1 }}>
                      <Skeleton variant="rounded" height={80} />
                    </Box>
                  ))}
                </StyledCard>
              </Stack>
            </Grid>

            <Grid item xs={12} md={4}>
              <StyledCard>
                <Typography
                  variant="h6"
                  sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}
                >
                  <LocalFireDepartmentIcon sx={{ color: "primary.main" }} />
                  Stats
                </Typography>

                <Stack spacing={2}>
                  <Skeleton variant="rounded" height={60} />
                  <Divider />
                  <Box>
                    <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
                      Activity Summary
                    </Typography>
                    <Stack spacing={1}>
                      {[1, 2, 3].map((item) => (
                        <Box
                          key={item}
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <Skeleton variant="text" width={80} />
                          <Skeleton variant="text" width={60} />
                        </Box>
                      ))}
                    </Stack>
                  </Box>
                </Stack>
              </StyledCard>
            </Grid>
          </Grid>
        </Container>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
      }}
    >
      {/* <NavBar /> */}
      <Container
        sx={{
          display: "flex",
          flexDirection: "column",
          pt: { xs: 6, sm: 8 },
          pb: { xs: 3, sm: 4 },
          gap: 3,
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

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: "bold",
              color: "primary.main",
              fontSize: { xs: "1.75rem", sm: "2.125rem" },
            }}
          >
            Activity History
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              try {
                console.log('Navigating to create activity page...');
                navigate('/create-activity');
              } catch (error) {
                console.error('Navigation error:', error);
              }
            }}
            sx={{
              textTransform: "none",
              borderRadius: 2,
              whiteSpace: "nowrap",
              px: { xs: 2, sm: 3 },
              py: { xs: 0.75, sm: 1 },
              fontSize: { xs: "0.875rem", sm: "1rem" },
            }}
          >
            New Activity
          </Button>
        </Stack>

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Stack spacing={3}>
              {/* Today's Activities */}
              <StyledCard>
                <Typography
                  variant="h6"
                  sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}
                >
                  <CalendarTodayIcon sx={{ color: "primary.main" }} />
                  Today&apos;s Activities
                </Typography>
                {activities.filter((activity) => 
                  isToday(activity.createdAt) && 
                  (!activity.status || activity.status !== 'finish')
                ).length > 0 ? (
                  activities
                    .filter((activity) => 
                      isToday(activity.createdAt) && 
                      (!activity.status || activity.status !== 'finish')
                    )
                    .map((activity) => (
                      <ActivityItemWithDelete
                        key={activity.id}
                        activity={activity}
                      />
                    ))
                ) : (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontStyle: "italic" }}
                  >
                    No active activities today
                  </Typography>
                )}
              </StyledCard>

              {/* Previous Activities */}
              <StyledCard>
                <Typography
                  variant="h6"
                  sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}
                >
                  <FitnessCenterIcon sx={{ color: "primary.main" }} />
                  Previous Activities
                </Typography>
                {activities
                  .filter(activity => activity.status === 'finish')
                  .map((activity) => (
                    <ActivityItemWithDelete
                      key={activity.id}
                      activity={activity}
                    />
                  ))}
              </StyledCard>
            </Stack>
          </Grid>

          <Grid item xs={12} md={4}>
            <StyledCard>
              <Typography
                variant="h6"
                sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}
              >
                <LocalFireDepartmentIcon sx={{ color: "primary.main" }} />
                Stats
              </Typography>

              <Stack spacing={2}>
                <StatCard>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      backgroundColor: "primary.main",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontWeight: "bold",
                    }}
                  >
                    {stats.streak}
                  </Box>
                  <Box>
                    <Typography variant="subtitle2">Current Streak</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {stats.streak === 1 ? "1 day" : `${stats.streak} days`}
                    </Typography>
                  </Box>
                </StatCard>

                <Divider />

                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
                    Activity Summary
                  </Typography>
                  <Stack spacing={1}>
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        Today
                      </Typography>
                      <Typography variant="body2">
                        {stats.todayCount} activities
                      </Typography>
                    </Box>
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        This Week
                      </Typography>
                      <Typography variant="body2">
                        {stats.weekCount} activities
                      </Typography>
                    </Box>
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        This Month
                      </Typography>
                      <Typography variant="body2">
                        {stats.monthCount} activities
                      </Typography>
                    </Box>
                  </Stack>
                </Box>
              </Stack>
            </StyledCard>
          </Grid>
        </Grid>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialog.open}
          onClose={() => setDeleteDialog({ open: false, activityId: null })}
          PaperProps={{
            sx: {
              borderRadius: 2,
              backdropFilter: "blur(24px)",
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              border: "1px solid",
              borderColor: "divider",
              maxWidth: "360px",
              width: "100%",
              m: 2,
            },
          }}
        >
          <DialogTitle
            sx={{
              py: 2,
              px: 2.5,
              fontSize: "1.125rem",
              fontWeight: 500,
              color: "error.light",
            }}
          >
            Delete Activity?
          </DialogTitle>
          <DialogContent sx={{ py: 1, px: 2.5 }}>
            <Typography variant="body2" color="text.secondary">
              This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ px: 2.5, py: 2 }}>
            <Button
              size="small"
              onClick={() => setDeleteDialog({ open: false, activityId: null })}
              sx={{
                color: "text.secondary",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                },
              }}
            >
              Cancel
            </Button>
            <Button
              size="small"
              variant="contained"
              color="error"
              onClick={() => handleDelete(deleteDialog.activityId)}
              sx={{
                ml: 1,
                px: 2,
                bgcolor: "error.main",
                "&:hover": {
                  bgcolor: "error.dark",
                },
              }}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
}
