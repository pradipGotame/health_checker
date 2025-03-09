import { useState, useEffect, useContext } from "react";
import {
  Box,
  Button,
  Typography,
  Stack,
  Container,
  Tooltip,
  Skeleton,
  useTheme,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { useNavigate } from "react-router-dom";
import { styled, alpha, keyframes } from "@mui/material/styles";
import useLogout from "../../hooks/useLogout";
import { useAuth } from "../../hooks/useAuth";
import AddIcon from "@mui/icons-material/Add";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";
import SelfImprovementIcon from "@mui/icons-material/SelfImprovement";
import InfoIcon from "@mui/icons-material/Info";
import { collection, query, where, getDocs, limit } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import {
  format,
  isToday,
  subDays,
  startOfWeek,
  eachDayOfInterval,
} from "date-fns";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  CartesianGrid,
} from "recharts";
import { ThemeContext } from "../../lib/ThemeContext";
import ThemeToggle from "../../components/ui/ThemeToggle";
import { WorkoutType } from "../../components/Activity/Activities";

const StyledCard = styled(Box)(({ theme }) => ({
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

const QuickActionCard = styled(Box)(({ theme }) => ({
  borderRadius: 8,
  padding: theme.spacing(2),
  backgroundColor: alpha(theme.palette.background.paper, 0.4),
  cursor: "pointer",
  transition: "all 0.2s ease-in-out",
  "&:hover": {
    backgroundColor: alpha(theme.palette.background.paper, 0.6),
    transform: "translateY(-2px)",
  },
}));

const StreakCard = styled(Box)(({ theme }) => ({
  borderRadius: 8,
  padding: theme.spacing(2),
  background: `linear-gradient(135deg, ${alpha(
    theme.palette.primary.main,
    0.2
  )} 0%, ${alpha(theme.palette.primary.main, 0.1)} 100%)`,
  backdropFilter: "blur(24px)",
  border: "1px solid",
  borderColor: alpha(theme.palette.primary.main, 0.2),
}));

// Add custom tooltip component
// const CustomTooltip = ({ active, payload, label }) => {
//   if (active && payload && payload.length) {
//     return (
//       <Box
//         sx={{
//           bgcolor: "rgba(0, 0, 0, 0.8)",
//           border: "1px solid rgba(255, 255, 255, 0.1)",
//           borderRadius: 1,
//           p: 1.5,
//           backdropFilter: "blur(24px)",
//         }}
//       >
//         <Typography variant="caption" sx={{ color: "#fff" }}>
//           {label}
//         </Typography>
//         <Typography variant="body2" sx={{ color: "#84CC16", mt: 0.5 }}>
//           {`${payload[0].value} activities`}
//         </Typography>
//       </Box>
//     );
//   }
//   return null;
// };

// Add a keyframe animation for the wave effect
const pulseKeyframe = keyframes`
  0% {
    opacity: 0.6;
  }
  50% {
    opacity: 0.3;
  }
  100% {
    opacity: 0.6;
  }
`;

export default function Dashboard() {
  const { logout } = useLogout();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [recentActivities, setRecentActivities] = useState([]);
  const [stats, setStats] = useState({
    todayCount: 0,
    cardioCount: 0,
    strengthCount: 0,
    mobilityCount: 0,
    streak: 0,
  });
  const [weeklyData, setWeeklyData] = useState([]);
  const [distributionData, setDistributionData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { darkMode } = useContext(ThemeContext);
  const theme = useTheme();

  // const { app } = firebase;

  useEffect(() => {
    const fetchActivities = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const activitiesRef = collection(db, "activities");
        const q = query(activitiesRef, where("userId", "==", user.uid));

        const querySnapshot = await getDocs(q);
        const activities = querySnapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
            createdAt: new Date(doc.data().createdAt),
          }))
          .sort((a, b) => b.createdAt - a.createdAt);

        // Set recent activities (limit to 5)
        setRecentActivities(activities.slice(0, 5));

        // Calculate stats
        const todayActivities = activities.filter((activity) =>
          isToday(activity.createdAt)
        );
        const cardioActivities = activities.filter(
          (activity) => activity.workoutType === "Cardio"
        );
        const strengthActivities = activities.filter(
          (activity) => activity.workoutType === "Strength"
        );
        const mobilityActivities = activities.filter(
          (activity) => activity.workoutType === "Mobility"
        );

        setStats({
          todayCount: todayActivities.length,
          cardioCount: cardioActivities.length,
          strengthCount: strengthActivities.length,
          mobilityCount: mobilityActivities.length,
          streak: todayActivities.length > 0 ? stats.streak + 1 : 0,
        });

        // Prepare weekly activity data
        const today = new Date();
        // const weekStart = startOfWeek(today);
        const last7Days = eachDayOfInterval({
          start: subDays(today, 6),
          end: today,
        });

        const weeklyData = last7Days.map((date) => ({
          date: format(date, "EEE"),
          count: activities.filter(
            (activity) =>
              format(activity.createdAt, "yyyy-MM-dd") ===
              format(date, "yyyy-MM-dd")
          ).length,
        }));
        setWeeklyData(weeklyData);

        // Prepare distribution data
        setDistributionData([
          { name: "Cardio", value: cardioActivities.length },
          { name: "Strength", value: strengthActivities.length },
          { name: "Mobility", value: mobilityActivities.length },
        ]);
      } catch (error) {
        console.error("Error fetching activities:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [user]);

  // Add chart colors
  const COLORS = ["#eab308", "#7c3aed", "#f43f5e"];

  const formatActivityDetails = (activity) => {
    if (activity.workoutType === "Cardio") {
      return `${activity.distance}${activity.distanceUnit} in ${activity.duration}${activity.durationUnit}`;
    } else if (activity.workoutType === "Strength") {
      return `${activity.sets} sets × ${activity.reps} reps at ${activity.weight}kg`;
    } else {
      return `${activity.sets} sets × ${activity.reps} reps`;
    }
  };

  // Update the loading skeleton components with smoother animations
  const LoadingOverview = () => (
    <Grid container spacing={2}>
      {[1, 2, 3, 4].map((item) => (
        <Grid item xs={6} sm={3} key={item}>
          <Box sx={{ p: 2, textAlign: "center" }}>
            <Skeleton
              variant="text"
              width="60%"
              height={48}
              sx={{
                mx: "auto",
                bgcolor: "rgba(255, 255, 255, 0.1)",
                animation: `${pulseKeyframe} 1.5s ease-in-out infinite`,
                transform: "none", // Prevents default animation
              }}
            />
            <Skeleton
              variant="text"
              width="80%"
              sx={{
                mx: "auto",
                bgcolor: "rgba(255, 255, 255, 0.1)",
                animation: `${pulseKeyframe} 1.5s ease-in-out 0.2s infinite`,
                transform: "none",
              }}
            />
          </Box>
        </Grid>
      ))}
    </Grid>
  );

  const LoadingInsights = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={8}>
        <Stack spacing={2}>
          <Skeleton
            variant="text"
            width={200}
            sx={{
              bgcolor: "rgba(255, 255, 255, 0.1)",
              animation: `${pulseKeyframe} 1.5s ease-in-out infinite`,
              transform: "none",
            }}
          />
          <Skeleton
            variant="rectangular"
            height={300}
            sx={{
              bgcolor: "rgba(255, 255, 255, 0.1)",
              borderRadius: 1,
              animation: `${pulseKeyframe} 1.5s ease-in-out 0.1s infinite`,
              transform: "none",
            }}
          />
        </Stack>
      </Grid>
      <Grid item xs={12} md={4}>
        <Stack spacing={2}>
          <Skeleton
            variant="text"
            width={200}
            sx={{
              bgcolor: "rgba(255, 255, 255, 0.1)",
              animation: `${pulseKeyframe} 1.5s ease-in-out 0.2s infinite`,
              transform: "none",
            }}
          />
          <Skeleton
            variant="rectangular"
            height={300}
            sx={{
              bgcolor: "rgba(255, 255, 255, 0.1)",
              borderRadius: 1,
              animation: `${pulseKeyframe} 1.5s ease-in-out 0.3s infinite`,
              transform: "none",
            }}
          />
        </Stack>
      </Grid>
    </Grid>
  );

  const LoadingRecentActivities = () => (
    <Stack spacing={2}>
      {[1, 2, 3].map((item, index) => (
        <Box
          key={item}
          sx={{
            p: 2,
            borderRadius: 1,
            bgcolor: "background.paper",
            transition: "all 0.3s ease-in-out",
          }}
        >
          <Stack spacing={1}>
            <Skeleton
              variant="text"
              width="40%"
              sx={{
                bgcolor: "rgba(255, 255, 255, 0.1)",
                animation: `${pulseKeyframe} 1.5s ease-in-out ${
                  index * 0.1
                }s infinite`,
                transform: "none",
              }}
            />
            <Skeleton
              variant="text"
              width="60%"
              sx={{
                bgcolor: "rgba(255, 255, 255, 0.1)",
                animation: `${pulseKeyframe} 1.5s ease-in-out ${
                  index * 0.1 + 0.1
                }s infinite`,
                transform: "none",
              }}
            />
          </Stack>
        </Box>
      ))}
    </Stack>
  );

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundImage: !darkMode ? "" : "",
      }}
    >
      <Container
        sx={{
          pt: { xs: 6, sm: 8 },
          pb: { xs: 3, sm: 4 },
        }}
        style={{ marginTop: 40 }}
      >
        <Grid container spacing={3}>
          {/* Welcome Section */}
          <Grid item xs={12}>
            <StyledCard>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                alignItems={{ xs: "flex-start", sm: "center" }}
                spacing={2}
              >
                <Box>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: "bold",
                      color: "primary.main",
                      fontSize: { xs: "1.75rem", sm: "2.125rem" },
                      mb: 0.5,
                    }}
                  >
                    Welcome back!
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Track your fitness journey and stay motivated
                  </Typography>
                </Box>
                <Stack direction="row" spacing={2}>
                  <ThemeToggle />
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => navigate("/create-activity")}
                    sx={{
                      textTransform: "none",
                    }}
                  >
                    New Activity
                  </Button>
                </Stack>
              </Stack>
            </StyledCard>
          </Grid>

          {/* Left Column - Quick Actions & Stats */}
          <Grid item xs={12} md={4}>
            <Stack spacing={3}>
              {/* Quick Actions */}
              <StyledCard>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Quick Actions
                </Typography>
                <Stack spacing={2}>
                  <QuickActionCard
                    onClick={() =>
                      navigate("/create-activity", {
                        state: { workoutType: WorkoutType.CARDIO },
                      })
                    }
                    sx={{
                      "&:hover": {
                        bgcolor: "divider",
                      },
                    }}
                  >
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Box
                        sx={{
                          p: 1,
                          borderRadius: 1,
                          bgcolor: "primary.main",
                          color: "white",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <DirectionsRunIcon />
                      </Box>
                      <Box>
                        <Typography variant="subtitle2">
                          Cardio Workout
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Record your cardio session
                        </Typography>
                      </Box>
                    </Stack>
                  </QuickActionCard>

                  <QuickActionCard
                    onClick={() =>
                      navigate("/create-activity", {
                        state: { workoutType: WorkoutType.STRENGTH },
                      })
                    }
                    sx={{
                      "&:hover": {
                        bgcolor: "divider",
                      },
                    }}
                  >
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Box
                        sx={{
                          p: 1,
                          borderRadius: 1,
                          bgcolor: "primary.main",
                          color: "white",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <FitnessCenterIcon />
                      </Box>
                      <Box>
                        <Typography variant="subtitle2">
                          Strength Training
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Log your strength workout
                        </Typography>
                      </Box>
                    </Stack>
                  </QuickActionCard>

                  <QuickActionCard
                    onClick={() =>
                      navigate("/create-activity", {
                        state: { workoutType: WorkoutType.MOBILITY },
                      })
                    }
                    sx={{
                      "&:hover": {
                        bgcolor: "divider",
                      },
                    }}
                  >
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Box
                        sx={{
                          p: 1,
                          borderRadius: 1,
                          bgcolor: "primary.main",
                          color: "white",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <SelfImprovementIcon />
                      </Box>
                      <Box>
                        <Typography variant="subtitle2">
                          Mobility Work
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Track your mobility exercises
                        </Typography>
                      </Box>
                    </Stack>
                  </QuickActionCard>
                </Stack>
              </StyledCard>

              {/* Streak Widget */}
              <StyledCard>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Workout Streak
                </Typography>
                <StreakCard>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box
                      sx={{
                        width: 60,
                        height: 60,
                        borderRadius: "50%",
                        bgcolor: "primary.main",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 0 20px rgba(132, 204, 22, 0.3)",
                      }}
                    >
                      <Typography
                        variant="h4"
                        sx={{
                          color: "white",
                          fontWeight: "bold",
                        }}
                      >
                        {loading ? <Skeleton width={30} /> : stats.streak || 0}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                        Day Streak
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Keep it going!
                      </Typography>
                    </Box>
                  </Stack>
                </StreakCard>
              </StyledCard>

              {/* Personal Bests */}
              <StyledCard>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Personal Bests
                </Typography>
                <Stack spacing={2}>
                  {loading ? (
                    <LoadingOverview />
                  ) : (
                    <>
                      <Box
                        sx={{
                          p: 1.5,
                          bgcolor: alpha("#fff", 0.05),
                          borderRadius: 1,
                        }}
                      >
                        <Typography variant="caption" color="text.secondary">
                          Longest Run
                        </Typography>
                        <Typography variant="subtitle1">5.2 km</Typography>
                      </Box>
                      <Box
                        sx={{
                          p: 1.5,
                          bgcolor: alpha("#fff", 0.05),
                          borderRadius: 1,
                        }}
                      >
                        <Typography variant="caption" color="text.secondary">
                          Max Weight (Bench Press)
                        </Typography>
                        <Typography variant="subtitle1">80 kg</Typography>
                      </Box>
                      <Box
                        sx={{
                          p: 1.5,
                          bgcolor: alpha("#fff", 0.05),
                          borderRadius: 1,
                        }}
                      >
                        <Typography variant="caption" color="text.secondary">
                          Most Weekly Activities
                        </Typography>
                        <Typography variant="subtitle1">12 workouts</Typography>
                      </Box>
                    </>
                  )}
                </Stack>
              </StyledCard>
            </Stack>
          </Grid>

          {/* Main Content Column */}
          <Grid item xs={12} md={8}>
            <Stack spacing={3}>
              {/* Activity Overview */}
              <StyledCard>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Activity Overview
                </Typography>
                {loading ? (
                  <LoadingOverview />
                ) : (
                  <Grid container spacing={2}>
                    <Grid item xs={6} sm={3}>
                      <Box sx={{ p: 2, textAlign: "center" }}>
                        <Typography
                          variant="h4"
                          color="primary.main"
                          sx={{ mb: 0.5 }}
                        >
                          {stats.todayCount}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Today&apos;s Activities
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Box sx={{ p: 2, textAlign: "center" }}>
                        <Typography
                          variant="h4"
                          color="primary.main"
                          sx={{ mb: 0.5 }}
                        >
                          {stats.cardioCount}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Cardio Sessions
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Box sx={{ p: 2, textAlign: "center" }}>
                        <Typography
                          variant="h4"
                          color="primary.main"
                          sx={{ mb: 0.5 }}
                        >
                          {stats.strengthCount}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Strength Workouts
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Box sx={{ p: 2, textAlign: "center" }}>
                        <Typography
                          variant="h4"
                          color="primary.main"
                          sx={{ mb: 0.5 }}
                        >
                          {stats.mobilityCount}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Mobility Sessions
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                )}
              </StyledCard>

              {/* Activity Insights */}
              <StyledCard>
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={1}
                  sx={{ mb: 3 }}
                >
                  <Typography variant="h6">Activity Insights</Typography>
                  <Tooltip
                    title="Visual representation of your workout patterns and distribution"
                    arrow
                    placement="right"
                  >
                    <InfoIcon
                      sx={{
                        fontSize: 18,
                        color: "text.secondary",
                        cursor: "help",
                        "&:hover": { color: "primary.main" },
                      }}
                    />
                  </Tooltip>
                </Stack>
                {loading ? (
                  <LoadingInsights />
                ) : (
                  <Grid container spacing={3}>
                    {/* Weekly Activity Trend */}
                    <Grid item xs={12} md={8}>
                      <Stack
                        direction="row"
                        alignItems="center"
                        spacing={1}
                        sx={{ mb: 2 }}
                      >
                        <Typography variant="subtitle2" color="text.secondary">
                          Weekly Activity Trend
                        </Typography>
                        <Tooltip
                          title="Number of activities completed each day over the past week"
                          arrow
                          placement="right"
                        >
                          <InfoIcon
                            sx={{
                              fontSize: 16,
                              color: "text.secondary",
                              cursor: "help",
                              "&:hover": { color: "primary.main" },
                            }}
                          />
                        </Tooltip>
                      </Stack>
                      <Box
                        sx={{
                          width: "100%",
                          height: 300,
                          ".recharts-cartesian-grid-horizontal line, .recharts-cartesian-grid-vertical line":
                            {
                              stroke: `${theme.palette.divider}`,
                            },
                          ".recharts-bar-rectangle": {
                            filter:
                              "drop-shadow(0px 2px 4px rgba(132, 204, 22, 0.2))",
                          },
                        }}
                      >
                        <ResponsiveContainer>
                          <BarChart
                            data={weeklyData}
                            margin={{
                              top: 10,
                              right: 10,
                              left: -15,
                              bottom: 0,
                            }}
                          >
                            <defs>
                              <linearGradient
                                id="colorBar"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                              >
                                <stop
                                  offset="0%"
                                  stopColor={theme.palette.primary.main}
                                  stopOpacity={0.8}
                                />
                                <stop
                                  offset="100%"
                                  stopColor={theme.palette.primary.main}
                                  stopOpacity={0.3}
                                />
                              </linearGradient>
                            </defs>
                            <CartesianGrid
                              strokeDasharray="5 5"
                              vertical={false}
                              stroke={theme.palette.divider.light}
                            />
                            <XAxis
                              dataKey="date"
                              stroke={theme.palette.text.secondary}
                              fontSize={12}
                              tickLine={false}
                              axisLine={false}
                              dy={10}
                            />
                            <YAxis
                              stroke={theme.palette.text.secondary}
                              fontSize={12}
                              tickLine={false}
                              axisLine={false}
                              tickFormatter={(value) => `${value}`}
                              dx={-10}
                            />
                            <Tooltip
                              cursor={{ fill: "rgba(255, 255, 255, 0.05)" }}
                              contentStyle={{
                                backgroundColor: "rgba(0, 0, 0, 0.8)",
                                border: "1px solid rgba(255, 255, 255, 0.1)",
                                borderRadius: 8,
                                backdropFilter: "blur(24px)",
                                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                                padding: "8px 12px",
                              }}
                            />
                            <Bar
                              dataKey="count"
                              fill="url(#colorBar)"
                              radius={[4, 4, 0, 0]}
                              maxBarSize={50}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </Box>
                    </Grid>

                    {/* Workout Distribution */}
                    <Grid item xs={12} md={4}>
                      <Stack
                        direction="row"
                        alignItems="center"
                        spacing={1}
                        sx={{ mb: 2 }}
                      >
                        <Typography variant="subtitle2" color="text.secondary">
                          Workout Distribution
                        </Typography>
                        <Tooltip
                          title="Distribution of your workouts by type (Cardio, Strength, Mobility)"
                          arrow
                          placement="right"
                        >
                          <InfoIcon
                            sx={{
                              fontSize: 16,
                              color: "text.secondary",
                              cursor: "help",
                              "&:hover": { color: "primary.main" },
                            }}
                          />
                        </Tooltip>
                      </Stack>
                      <Box
                        sx={{
                          width: "100%",
                          height: 300,
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          ".recharts-pie": {
                            filter:
                              "drop-shadow(0px 2px 4px rgba(132, 204, 22, 0.2))",
                          },
                        }}
                      >
                        <ResponsiveContainer>
                          <PieChart>
                            <defs>
                              {COLORS.map((color, index) => (
                                <linearGradient
                                  key={`gradient-${index}`}
                                  id={`pieGradient${index}`}
                                  x1="0"
                                  y1="0"
                                  x2="0"
                                  y2="1"
                                >
                                  <stop
                                    offset="0%"
                                    stopColor={color}
                                    stopOpacity={0.7}
                                  />
                                  <stop
                                    offset="100%"
                                    stopColor={color}
                                    stopOpacity={1}
                                  />
                                </linearGradient>
                              ))}
                            </defs>
                            <Pie
                              data={distributionData}
                              cx="50%"
                              cy="45%"
                              innerRadius={60}
                              outerRadius={80}
                              paddingAngle={5}
                              dataKey="value"
                              blendStroke
                            >
                              {distributionData.map((entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={`url(#pieGradient${index})`}
                                  stroke="rgba(255, 255, 255, 0.1)"
                                />
                              ))}
                            </Pie>
                            <Tooltip
                              contentStyle={{
                                backgroundColor: "rgba(0, 0, 0, 0.8)",
                                border: "1px solid rgba(255, 255, 255, 0.1)",
                                borderRadius: 8,
                                backdropFilter: "blur(24px)",
                                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                                padding: "8px 12px",
                              }}
                            />
                            <Legend
                              verticalAlign="bottom"
                              height={36}
                              formatter={(value) => (
                                <span
                                  style={{
                                    color: theme.palette.text.secondary,
                                    fontSize: "0.875rem",
                                    fontFamily: '"Inter", sans-serif',
                                    margin: "0 4px",
                                  }}
                                >
                                  {value}
                                </span>
                              )}
                              iconType="circle"
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </Box>
                    </Grid>
                  </Grid>
                )}
              </StyledCard>

              {/* Recent Activities & Goals Split */}
              <Box sx={{ mt: 3 }}>
                <Grid container spacing={3}>
                  {/* Recent Activities */}
                  <Grid item xs={12} md={7}>
                    <StyledCard>
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        sx={{ mb: 2 }}
                      >
                        <Typography variant="h6">Recent Activities</Typography>
                        <Button
                          onClick={() => navigate("/activity-page")}
                          sx={{
                            textTransform: "none",
                            color: "primary.main",
                          }}
                        >
                          View All
                        </Button>
                      </Stack>
                      {loading ? (
                        <LoadingRecentActivities />
                      ) : (
                        <Stack spacing={2}>
                          {recentActivities.map((activity) => (
                            <Box
                              key={activity.id}
                              sx={{
                                p: 2,
                                borderRadius: 1,
                                bgcolor: "background.paper",
                                "&:hover": { bgcolor: alpha("#fff", 0.1) },
                              }}
                            >
                              <Stack
                                direction="row"
                                justifyContent="space-between"
                                alignItems="center"
                              >
                                <Box>
                                  <Typography variant="subtitle2">
                                    {activity.activity}
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                  >
                                    {formatActivityDetails(activity)}
                                  </Typography>
                                </Box>
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  {format(activity.createdAt, "MMM d, yyyy")}
                                </Typography>
                              </Stack>
                            </Box>
                          ))}
                        </Stack>
                      )}
                    </StyledCard>
                  </Grid>

                  {/* Goals Section */}
                  <Grid item xs={12} md={5}>
                    <StyledCard>
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        sx={{ mb: 2 }}
                      >
                        <Typography variant="h6">Goals</Typography>
                        <Button
                          size="small"
                          sx={{
                            textTransform: "none",
                            color: "primary.main",
                          }}
                        >
                          Add Goal
                        </Button>
                      </Stack>
                      {loading ? (
                        <LoadingOverview />
                      ) : (
                        <Stack spacing={2}>
                          <Box
                            sx={{
                              p: 1.5,
                              bgcolor: alpha("#fff", 0.05),
                              borderRadius: 1,
                              border: "1px solid",
                              borderColor: alpha("#84CC16", 0.3),
                            }}
                          >
                            <Stack
                              direction="row"
                              justifyContent="space-between"
                              alignItems="center"
                            >
                              <Box>
                                <Typography variant="subtitle2">
                                  Run 5km
                                </Typography>
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  Progress: 3.2km
                                </Typography>
                              </Box>
                              <Typography
                                variant="caption"
                                sx={{
                                  color: "primary.main",
                                  fontWeight: 500,
                                }}
                              >
                                64%
                              </Typography>
                            </Stack>
                            <Box
                              sx={{
                                mt: 1,
                                width: "100%",
                                height: 4,
                                bgcolor: alpha("#fff", 0.1),
                                borderRadius: 2,
                                overflow: "hidden",
                              }}
                            >
                              <Box
                                sx={{
                                  width: "64%",
                                  height: "100%",
                                  bgcolor: "primary.main",
                                  borderRadius: 2,
                                }}
                              />
                            </Box>
                          </Box>

                          <Box
                            sx={{
                              p: 1.5,
                              bgcolor: alpha("#fff", 0.05),
                              borderRadius: 1,
                            }}
                          >
                            <Typography variant="subtitle2">
                              Weekly Workouts
                            </Typography>
                            <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                              {[1, 2, 3, 4, 5].map((day) => (
                                <Box
                                  key={day}
                                  sx={{
                                    width: 24,
                                    height: 24,
                                    borderRadius: "50%",
                                    bgcolor:
                                      day <= 3
                                        ? "primary.main"
                                        : alpha("#fff", 0.1),
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                  }}
                                >
                                  <Typography
                                    variant="caption"
                                    sx={{
                                      color:
                                        day <= 3 ? "white" : "text.secondary",
                                    }}
                                  >
                                    {day}
                                  </Typography>
                                </Box>
                              ))}
                            </Stack>
                          </Box>
                        </Stack>
                      )}
                    </StyledCard>
                  </Grid>
                </Grid>
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
