import * as React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import MuiChip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { styled, alpha } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import { useNavigate } from 'react-router-dom';

import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";
import ViewQuiltRoundedIcon from "@mui/icons-material/ViewQuiltRounded";
import AddIcon from "@mui/icons-material/Add";
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import SelfImprovementIcon from "@mui/icons-material/SelfImprovement";
import SmartToyIcon from '@mui/icons-material/SmartToy';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';



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

const items = [
  {
    icon: <ViewQuiltRoundedIcon />,
    title: "Smart Dashboard",
    description:
      "Track your fitness journey with our intuitive dashboard. View your progress, analyze trends, and stay motivated with personalized insights.",
    preview: ({ navigate }) => {
      const user = null;
      
      const handleNewActivity = () => {
        if (!user) {
          // If user is not authenticated, redirect to signin with return URL
          navigate('/login', { state: { from: '/create-activity' } });
        } else {
          // If user is authenticated, redirect to create activity
          navigate('/create-activity');
        }
      };

      return (
        <Box
          sx={{
            height: "100%",
            width: "100%",
            overflow: "hidden",
            borderRadius: 2,
            position: "relative",
            p: { xs: 2, sm: 2.5 },
          }}
        >
          {/* Welcome Section */}
          <StyledCard sx={{ mb: 2 }}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              spacing={2}
            >
              <Box>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: "bold",
                    color: "primary.main",
                    mb: 0.5,
                    fontSize: { xs: "1.25rem", sm: "1.5rem" },
                  }}
                >
                  Welcome back!
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Track your fitness journey
                </Typography>
              </Box>
              <Button
                variant="contained"
                size="small"
                startIcon={<AddIcon />}
                onClick={handleNewActivity}
                sx={{
                  textTransform: "none",
                  borderRadius: 2,
                  px: 2,
                }}
              >
                New Activity
              </Button>
            </Stack>
          </StyledCard>

          {/* Stats Overview */}
          <StyledCard sx={{ mb: 2 }}>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500 }}>
              Activity Overview
            </Typography>
            <Grid container spacing={2}>
              {[
                { label: "Today", value: "3" },
                { label: "Week", value: "12" },
                { label: "Month", value: "42" },
              ].map((stat) => (
                <Grid item xs={4} key={stat.label}>
                  <Box
                    sx={{
                      textAlign: "center",
                      p: 1,
                      bgcolor: "rgba(255,255,255,0.02)",
                      borderRadius: 1,
                    }}
                  >
                    <Typography
                      variant="h6"
                      color="primary.main"
                      sx={{
                        mb: 0.5,
                        fontSize: { xs: "1.125rem", sm: "1.25rem" },
                      }}
                    >
                      {stat.value}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {stat.label}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </StyledCard>

          {/* Quick Actions */}
          <StyledCard>
            <Typography variant="subtitle1" sx={{ mb: 1.5, fontWeight: 500 }}>
              Quick Actions
            </Typography>
            <Stack spacing={1}>
              {[
                { icon: <DirectionsRunIcon />, label: "Cardio" },
                { icon: <FitnessCenterIcon />, label: "Strength" },
                { icon: <SelfImprovementIcon />, label: "Mobility" },
              ].map(({ icon, label }) => (
                <Box
                  key={label}
                  sx={{
                    p: 1.25,
                    borderRadius: 1,
                    bgcolor: "rgba(255,255,255,0.05)",
                    cursor: "pointer",
                    "&:hover": {
                      bgcolor: "rgba(255,255,255,0.1)",
                      transform: "translateY(-1px)",
                    },
                    transition: "all 0.2s",
                  }}
                >
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Box
                      sx={{
                        p: 0.75,
                        borderRadius: 0.75,
                        bgcolor: "primary.main",
                        color: "white",
                        display: "flex",
                      }}
                    >
                      {React.cloneElement(icon, { sx: { fontSize: 18 } })}
                    </Box>
                    <Typography variant="body2">{label}</Typography>
                  </Stack>
                </Box>
              ))}
            </Stack>
          </StyledCard>
        </Box>
      );
    },
  },
  {
    icon: <AutoAwesomeOutlinedIcon />,
    title: "AI-powered",
    description:
      "Our AI-powered features and plans are designed to help you achieve your goals faster and more efficiently.",
    preview: ({ onActionClick }) => (
      <Box
        sx={{
          height: "100%",
          width: "100%",
          overflow: "hidden",
          borderRadius: 2,
          position: "relative",
          p: { xs: 2, sm: 2.5 },
        }}
      >
        <StyledCard sx={{ mb: 2 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            spacing={2}
          >
            <Box>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: "bold",
                  color: "primary.main",
                  mb: 0.5,
                  fontSize: { xs: "1.25rem", sm: "1.5rem" },
                }}
              >
                AI Assistant
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Your personalized fitness coach
              </Typography>
            </Box>
            <Box
              sx={{
                bgcolor: 'primary.main',
                color: 'white',
                borderRadius: '50%',
                p: 1,
                display: 'flex',
              }}
            >
              <SmartToyIcon />
            </Box>
          </Stack>
        </StyledCard>

        <StyledCard sx={{ mb: 2 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: "primary.main" }}>
            New Activity
          </Typography>
          
          <Stack spacing={2.5}>
            {/* Workout Type Selector */}
            <Box>
              <Typography color="text.secondary" sx={{ mb: 1 }}>
                Workout Type
              </Typography>
              <Box 
                sx={{ 
                  p: 1.5, 
                  border: "1px solid",
                  borderColor: "divider", 
                  borderRadius: 1,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography>Cardio</Typography>
                <Box sx={{ 
                  color: "primary.main", 
                  fontSize: 18, 
                  display: "flex",
                  transform: "rotate(90deg)",
                }}>›</Box>
              </Box>
            </Box>

            <Box>
              <Typography sx={{ mb: 1}}>
                Activity
              </Typography>
              <Box 
                sx={{ 
                  p: 1.5, 
                  border: "1px solid",
                  borderColor: "divider", 
                  borderRadius: 1,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography>Running</Typography>
                <Box sx={{ 
                  color: "primary.main", 
                  fontSize: 18, 
                  display: "flex",
                  transform: "rotate(90deg)",
                }}>›</Box>
              </Box>
            </Box>

            
            
            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
              <Button
                onClick={onActionClick}
                variant="outlined"
                startIcon={<AutoAwesomeIcon />}
                sx={{
                  textTransform: "none",
                  border: "none",
                  color: "white",
                  background: "linear-gradient(90deg, #1565C0, #6A1B9A, #E91E63)",
                  transition: "all 0.3s ease",
                  borderRadius: 2,
                  px: 2.5,
                  py: 1,
                  "&:hover": {
                    background: "linear-gradient(90deg, #1976D2, #8E24AA, #F50057)",
                    boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
                  },
                }}
              >
                Get AI Suggestion
              </Button>
            </Box>    
          </Stack>
        </StyledCard>
      </Box>
    ),
  },
];

const Chip = styled(MuiChip)(({ theme }) => ({
  variants: [
    {
      props: ({ selected }) => selected,
      style: {
        background:
          "linear-gradient(to bottom right, hsl(210, 98%, 48%), hsl(210, 98%, 35%))",
        color: "hsl(0, 0%, 100%)",
        borderColor: (theme.vars || theme).palette.primary.light,
        "& .MuiChip-label": {
          color: "hsl(0, 0%, 100%)",
        },
        ...theme.applyStyles("dark", {
          borderColor: (theme.vars || theme).palette.primary.dark,
        }),
      },
    },
  ],
}));

function MobileLayout({ selectedItemIndex, handleItemClick, selectedFeature }) {
  if (!items[selectedItemIndex]) {
    return null;
  }

  return (
    <Box
      sx={{
        display: { xs: "flex", sm: "none" },
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Box sx={{ display: "flex", gap: 2, overflow: "auto" }}>
        {items.map(({ title }, index) => (
          <Chip
            size="medium"
            key={index}
            label={title}
            onClick={() => handleItemClick(index)}
            selected={selectedItemIndex === index}
          />
        ))}
      </Box>
      <Card variant="outlined">
        <Box
          sx={(theme) => ({
            mb: 2,
            backgroundSize: "cover",
            backgroundPosition: "center",
            minHeight: 280,
            backgroundImage: "var(--items-imageLight)",
            ...theme.applyStyles("dark", {
              backgroundImage: "var(--items-imageDark)",
            }),
          })}
          style={
            items[selectedItemIndex]
              ? {
                  "--items-imageLight": items[selectedItemIndex].imageLight,
                  "--items-imageDark": items[selectedItemIndex].imageDark,
                }
              : {}
          }
        />
        <Box sx={{ px: 2, pb: 2 }}>
          <Typography
            gutterBottom
            sx={{ color: "text.primary", fontWeight: "medium" }}
          >
            {selectedFeature.title}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary", mb: 1.5 }}>
            {selectedFeature.description}
          </Typography>
        </Box>
      </Card>
    </Box>
  );
}

MobileLayout.propTypes = {
  handleItemClick: PropTypes.func.isRequired,
  selectedFeature: PropTypes.shape({
    description: PropTypes.string.isRequired,
    icon: PropTypes.element,
    imageDark: PropTypes.string,
    imageLight: PropTypes.string,
    title: PropTypes.string.isRequired,
  }).isRequired,
  selectedItemIndex: PropTypes.number.isRequired,
};

export { MobileLayout };

export default function Features() {
  const [selectedItemIndex, setSelectedItemIndex] = React.useState(0);
  const navigate = useNavigate();

  const handleItemClick = (index) => {
    setSelectedItemIndex(index);
  };

  const handleActionClick = () => {
    navigate('/login');
  };

  const selectedFeature = items[selectedItemIndex];

  return (
    <Container id="features" sx={{ py: { xs: 8, sm: 16 } }}>
      {/* Features Header Section */}
      <Box sx={{ width: { sm: "100%", md: "60%" } }}>
        <Typography variant="h3" gutterBottom sx={{ color: "text.primary" }}>
          Features
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: "text.secondary", mb: { xs: 2, sm: 4 } }}
        >
          Choose from a variety of features to help you achieve your fitness
          goals. Our AI-powered features are designed to help you track your
          progress, train effectively, and transform your body.
        </Typography>
      </Box>

      {/* Features Content Section */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row-reverse" },
          gap: 2,
        }}
      >
        {/* Feature Buttons Section */}
        <Box>
          <Box
            sx={{
              display: { xs: "none", sm: "flex" },
              flexDirection: "column",
              gap: 2,
              height: "100%",
            }}
          >
            {items.map(({ icon, title, description }, index) => (
              <Button
                key={index}
                onClick={() => handleItemClick(index)}
                sx={[
                  (theme) => ({
                    p: 2,
                    width: "100%",
                    borderRadius: "12px",
                    textTransform: "none",
                    textAlign: "left",
                    justifyContent: "flex-start",
                    "&:hover": {
                      backgroundColor: (theme.vars || theme).palette.action
                        .hover,
                    },
                  }),
                  selectedItemIndex === index && {
                    backgroundColor: "primary.main",
                    color: "primary.contrastText",
                  },
                ]}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    gap: 1,
                  }}
                >
                  {icon}
                  <Typography variant="h6">{title}</Typography>
                  <Typography variant="body2">{description}</Typography>
                </Box>
              </Button>
            ))}
          </Box>
          {/* Mobile Layout */}
          <MobileLayout
            selectedItemIndex={selectedItemIndex}
            handleItemClick={handleItemClick}
            selectedFeature={selectedFeature}
          />
        </Box>

        {/* Feature Image Section */}
        <Box
          sx={{
            display: { xs: "none", sm: "flex" },
            width: { xs: "100%", md: "70%" },
            height: 600,
            position: "relative",
          }}
        >
          <Card
            variant="outlined"
            sx={{
              height: "100%",
              width: "100%",
              display: { xs: "none", sm: "flex" },
              borderRadius: "16px",
              overflow: "hidden",
              bgcolor: "background.paper",
            }}
          >
            {typeof selectedFeature.preview === 'function' 
              ? selectedFeature.preview({ navigate })
              : selectedFeature.preview}
          </Card>
        </Box>
      </Box>
    </Container>
  );
}
