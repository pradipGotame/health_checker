import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  Avatar,
  TextField,
  Button,
  Stack,
  CircularProgress,
  Modal,
  Fade,
  Backdrop
} from '@mui/material';
import { doc, getDoc } from 'firebase/firestore';
import { app, db } from '../../firebase/firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import NavBar from '../Landing/NavBar';
import GenderSelection from './GenderSelection';
import FitnessGoal from './FitnessGoal';
import AgeSelect from './Age';
import HeightInput from './Height';
import WeightInput from './Weight';
import ActivityType from './ActivityType';
import ExerciseLevel from './ExerciseLevel';
import Location from './Location';

// Modal style configuration
const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2
};

export default function Profile() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const navigate = useNavigate();

  // Load initial user data
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        setLoading(true);
        if (user) {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          setUserData(userDoc.exists() ? userDoc.data() : {});
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);
  const auth = getAuth(app);
  // Handle save button click
  const handleSave = () => {
    if (!auth.currentUser) {
      setLoginModalOpen(true);
      return;
    }
    // Add your save logic here
    console.log('Saving data...');
  };

  // Close login modal
  const handleCloseModal = () => setLoginModalOpen(false);

  // Navigate to login page
  const handleNavigateToLogin = () => {
    navigate('/login');
    handleCloseModal();
  };

  // Loading state
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{
      paddingTop: "8vh",
      display: "flex",
      flexDirection: "column",
      gap: 3,
      alignItems: "center"
    }}>
      <NavBar />

      {/* Login Required Modal */}
      <Modal
        open={loginModalOpen}
        onClose={handleCloseModal}
        BackdropComponent={Backdrop}
      >
        <Box sx={modalStyle}>
          <Typography variant="h6" gutterBottom>
            Login Required
          </Typography>
          <Typography sx={{ mb: 3 }}>
            You need to login to save your changes.
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              onClick={handleNavigateToLogin}
            >
              Go to Login
            </Button>
            <Button
              variant="outlined"
              onClick={handleCloseModal}
            >
              Cancel
            </Button>
          </Stack>
        </Box>
      </Modal>

      {/* Original Layout */}
      <Card variant="outlined" sx={{
        height: "auto",
        width: "70%",
        display: "flex",
        alignItems: "flex-start",
        borderRadius: "16px",
      }}>
        <Box sx={{
          display: "flex",
          flexDirection: "row",
          gap: 3,
          flexWrap: "wrap",
          padding: 2,
          width: "100%"
        }}>
          {/* Left Section */}
          <Box sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
            padding: 8,
            width: "fit-content"
          }}>
            <Avatar
              sx={{ width: 120, height: 120 }}
              src="https://github.com/shadcn.png"
            />
            <Typography sx={{ fontSize: "1.5rem" }}>
              {userData?.displayName || 'Username'}
            </Typography>
          </Box>

          {/* Center Section */}
          <Box sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            flexGrow: 1
          }}>
            <Typography>Fitness Goal</Typography>
            <FitnessGoal />
            <HeightInput />
            <WeightInput />
          </Box>
        </Box>

        {/* Save Button */}
        <Box sx={{
          display: "flex",
          justifyContent: "flex-end",
          position: "absolute",
          bottom: 16,
          right: 16
        }}>
          <Stack direction="column" spacing={2}>
            <Button
              variant="contained"
              onClick={handleSave}
            >
              Save
            </Button>
          </Stack>
        </Box>
      </Card>

      {/* Bottom Sections */}
      <Box sx={{
        display: "flex",
        flexDirection: "row",
        gap: 3,
        width: "70%"
      }}>
        <Card variant="outlined" sx={{
          padding: 2,
          width: "50%"
        }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Typography>Name</Typography>
            <TextField
              value={userData?.name || ''}
              InputProps={{ readOnly: true }}
            />
            <AgeSelect />
            <GenderSelection />
          </Box>
        </Card>

        <Card variant="outlined" sx={{
          padding: 2,
          width: "50%"
        }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Typography>Preferred Activity Type</Typography>
            <ActivityType />
            <ExerciseLevel />
            <Location />
          </Box>
        </Card>
      </Box>
    </Box>
  );
}