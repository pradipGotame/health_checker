import { useState, useEffect } from 'react';
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import { Typography, Grid, Divider, Skeleton } from "@mui/material";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";
import { styled, alpha } from "@mui/material/styles";
import { useAuth } from '../../hooks/useAuth';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { format, isToday, startOfWeek, startOfMonth, isWithinInterval, subDays } from 'date-fns';

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
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1.5),
  },
}));

const StatCard = styled(Box)(({ theme }) => ({
  borderRadius: 8,
  padding: theme.spacing(2),
  backgroundColor: alpha(theme.palette.primary.main, 0.1),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
}));

const ActivityItem = styled(Box)(({ theme }) => ({
  borderRadius: 8,
  padding: theme.spacing(1.5),
  backgroundColor: alpha(theme.palette.background.paper, 0.4),
  marginBottom: theme.spacing(1),
  '&:hover': {
    backgroundColor: alpha(theme.palette.background.paper, 0.6),
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1),
  },
}));

export default function ActivityPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    streak: 0,
    todayCount: 0,
    weekCount: 0,
    monthCount: 0,
  });

  useEffect(() => {
    const fetchActivities = async () => {
      if (!user) {
        navigate('/login');
        return;
      }

      try {
        const activitiesRef = collection(db, "activities");
        // Simplified query that doesn't require an index
        const q = query(
          activitiesRef,
          where("userId", "==", user.uid)
        );
        
        const querySnapshot = await getDocs(q);
        const activitiesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: new Date(doc.data().createdAt)
        }))
        // Sort the data in memory instead
        .sort((a, b) => b.createdAt - a.createdAt);

        setActivities(activitiesData);
        
        const todayActivities = activitiesData.filter(activity => 
          isToday(activity.createdAt)
        );

        setStats({
          streak: 0,
          todayCount: todayActivities.length,
          weekCount: activitiesData.length,
          monthCount: activitiesData.length,
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

  const formatActivityDetails = (activity) => {
    if (activity.workoutType === 'Cardio') {
      return `${activity.distance}${activity.distanceUnit} in ${activity.duration}${activity.durationUnit}`;
    } else if (activity.workoutType === 'Strength') {
      return `${activity.sets} sets × ${activity.reps} reps at ${activity.weight}kg`;
    } else {
      return `${activity.sets} sets × ${activity.reps} reps`;
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          backgroundImage:
            "radial-gradient(ellipse 80% 50% at 50% -20%, hsl(84, 81%, 14%), transparent)",
        }}
      >
        <Container
          sx={{
            display: "flex",
            flexDirection: "column",
            pt: { xs: 6, sm: 8 },
            pb: { xs: 3, sm: 4 },
            gap: 3
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
          >
            <ArrowBackIcon sx={{ fontSize: 20 }} />
            <Typography 
              sx={{ 
                color: 'inherit',
                fontSize: '0.875rem',
                fontWeight: 500
              }}
            >
              Back to Dashboard
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
            Activity History
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Stack spacing={3}>
                {/* Today's Activities Skeleton */}
                <StyledCard>
                  <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CalendarTodayIcon sx={{ color: 'primary.main' }} />
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
                  <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <FitnessCenterIcon sx={{ color: 'primary.main' }} />
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
                <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocalFireDepartmentIcon sx={{ color: 'primary.main' }} />
                  Stats
                </Typography>
                
                <Stack spacing={2}>
                  <Skeleton variant="rounded" height={60} />
                  <Divider />
                  <Box>
                    <Typography variant="subtitle2" sx={{ mb: 1.5 }}>Activity Summary</Typography>
                    <Stack spacing={1}>
                      {[1, 2, 3].map((item) => (
                        <Box key={item} sx={{ display: 'flex', justifyContent: 'space-between' }}>
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
        backgroundImage:
          "radial-gradient(ellipse 80% 50% at 50% -20%, hsl(84, 81%, 14%), transparent)",
      }}
    >
      <Container
        sx={{
          display: "flex",
          flexDirection: "column",
          pt: { xs: 6, sm: 8 },
          pb: { xs: 3, sm: 4 },
          gap: 3
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
          onClick={() => navigate('/dashboard')}
        >
          <ArrowBackIcon sx={{ fontSize: 20 }} />
          <Typography 
            sx={{ 
              color: 'inherit',
              fontSize: '0.875rem',
              fontWeight: 500
            }}
          >
            Back to Dashboard
          </Typography>
        </Stack>

        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 'bold',
              color: 'primary.main',
              fontSize: { xs: '1.75rem', sm: '2.125rem' }
            }}
          >
            Activity History
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/create-activity')}
            sx={{
              textTransform: 'none',
              borderRadius: 2,
              whiteSpace: 'nowrap',
              px: { xs: 2, sm: 3 },
              py: { xs: 0.75, sm: 1 },
              fontSize: { xs: '0.875rem', sm: '1rem' }
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
                <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CalendarTodayIcon sx={{ color: 'primary.main' }} />
                  Today's Activities
                </Typography>
                {activities.filter(activity => isToday(activity.createdAt)).length > 0 ? (
                  activities
                    .filter(activity => isToday(activity.createdAt))
                    .map((activity) => (
                      <ActivityItem key={activity.id}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                          {activity.activity}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ 
                          fontSize: { xs: '0.75rem', sm: '0.875rem' },
                          wordBreak: 'break-word'
                        }}>
                          {formatActivityDetails(activity)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {format(activity.createdAt, 'h:mm a')}
                        </Typography>
                      </ActivityItem>
                    ))
                ) : (
                  <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                    No activities recorded today
                  </Typography>
                )}
              </StyledCard>

              {/* Activity History */}
              <StyledCard>
                <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <FitnessCenterIcon sx={{ color: 'primary.main' }} />
                  Previous Activities
                </Typography>
                {activities.map((activity) => (
                  <ActivityItem key={activity.id}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                      {activity.activity}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ 
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                      wordBreak: 'break-word'
                    }}>
                      {formatActivityDetails(activity)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {format(activity.createdAt, 'MMM d, yyyy h:mm a')}
                    </Typography>
                  </ActivityItem>
                ))}
              </StyledCard>
            </Stack>
          </Grid>

          <Grid item xs={12} md={4}>
            <StyledCard>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocalFireDepartmentIcon sx={{ color: 'primary.main' }} />
                Stats
              </Typography>
              
              <Stack spacing={2}>
                <StatCard>
                  <Box sx={{ 
                    width: 40, 
                    height: 40, 
                    borderRadius: '50%', 
                    backgroundColor: 'primary.main',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 'bold'
                  }}>
                    {stats.streak}
                  </Box>
                  <Box>
                    <Typography variant="subtitle2">Current Streak</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {stats.streak === 1 ? '1 day' : `${stats.streak} days`}
                    </Typography>
                  </Box>
                </StatCard>

                <Divider />

                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 1.5 }}>Activity Summary</Typography>
                  <Stack spacing={1}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">Today</Typography>
                      <Typography variant="body2">{stats.todayCount} activities</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">This Week</Typography>
                      <Typography variant="body2">{stats.weekCount} activities</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">This Month</Typography>
                      <Typography variant="body2">{stats.monthCount} activities</Typography>
                    </Box>
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
