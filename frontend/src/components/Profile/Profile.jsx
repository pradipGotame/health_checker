import React, { useState, useEffect } from "react";
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
  Backdrop,
  Container,
} from "@mui/material";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  setDoc,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";
import { app, db } from "../../firebase/firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import NavBar from "../Landing/NavBar";
import GenderSelection from "./GenderSelection";
import FitnessGoal from "./FitnessGoal";
import AgeSelect from "./Age";
import HeightInput from "./Height";
import WeightInput from "./Weight";
import ActivityType from "./ActivityType";
import ExerciseLevel from "./ExerciseLevel";
import Location from "./Location";
import { max } from "date-fns";
// Modal style configuration
const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

// Add this constant at the top of your file, after imports
const textFieldStyle = {
  backdropFilter: "blur(24px)",
  backgroundColor: "rgba(0, 0, 0, 0.4)",
  "& .MuiOutlinedInput-root": {
    "&:hover fieldset": {
      borderColor: "primary.main", // Use primary color instead of hsl
    },
    "&.Mui-focused fieldset": {
      borderColor: "primary.main",
    },
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "primary.main",
  },
};

// Add this after modalStyle
const commonHoverStyle = {
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: "0 8px 30px rgba(0, 0, 0, 0.12)",
    borderColor: "primary.main",
  },
};

// Add this constant after your other style constants
const labelStyle = {
  color: "primary.main", // Use the same color as the button
  fontWeight: 600, // Make it a bit bolder
  fontSize: "1rem",
};

export default function Profile() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [documentId, setDocumentId] = useState(null);
  const [profileData, setProfileData] = useState({
    height: "",
    weight: "",
    age: "",
    gender: "",
    activityType: [],
    exerciseLevel: "",
    location: "",
    fitnessGoal: "",
    full_name: "",
    sportsVenue: "",
  });
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successModalOpen, setSuccessModalOpen] = useState(false);

  const navigate = useNavigate();
  const auth = getAuth(app);

  // Add this useEffect to monitor documentId changes
  useEffect(() => {
    console.log("documentId updated:", documentId);
  }, [documentId]);

  // Load initial user data
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        setLoading(true);
        if (user) {
          console.log("userId:", user.uid);
          const q = query(
            collection(db, "users"),
            where("userId", "==", user.uid)
          );
          console.log("query:", q);
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            const doc = querySnapshot.docs[0];
            const fetchedData = doc.data();
            console.log("Fetched data:", fetchedData);
            setDocumentId(doc.id); // This is async
            loadUserData(fetchedData);
          } else {
            console.log("No matching document");
            setError("User data not found");
          }
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [auth]);

  // Add validation function
  const validateForm = () => {
    const errors = [];

    if (!profileData.fitnessGoal) {
      errors.push("Fitness Goal is required");
    }
    if (!profileData.height) {
      errors.push("Height is required");
    }
    if (!profileData.weight) {
      errors.push("Weight is required");
    }

    return errors;
  };

  // Modify handleSave to include validation
  const handleSave = async () => {
    if (!auth.currentUser) {
      setLoginModalOpen(true);
      return;
    } else {
      console.log("Saving data to document:", documentId);
      try {
        if (!documentId) {
          throw new Error("No document ID found");
        }

        // Validate required fields
        const validationErrors = validateForm();
        if (validationErrors.length > 0) {
          setErrorMessage(
            `Please fill in all required fields:\n${validationErrors.join(
              "\n"
            )}`
          );
          setErrorModalOpen(true);
          return;
        }

        // Get current document data first
        const docRef = doc(db, "users", documentId);
        const docSnap = await getDoc(docRef);
        const currentData = docSnap.data();

        // Prepare new data, filtering out undefined/empty values
        const newData = Object.fromEntries(
          Object.entries(profileData).filter(
            ([_, value]) => value !== undefined && value !== ""
          )
        );

        // Merge current data with new data
        const dataToSave = {
          ...currentData, // Keep existing fields
          ...newData, // Add/Update new fields
          updatedAt: serverTimestamp(),
        };

        // Update document with merged data
        await updateDoc(docRef, dataToSave);
        console.log("Data saved successfully");
        setSuccessModalOpen(true); // Show success modal after save
      } catch (error) {
        console.error("Error saving data:", error);
        setErrorMessage(error.message);
        setErrorModalOpen(true);
      }
    }
  };

  const handleChange = (field, value) => {
    setProfileData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const loadUserData = (data) => {
    handleChange("height", data.height);
    handleChange("weight", data.weight);
    handleChange("age", data.age);
    handleChange("gender", data.gender);
    handleChange("activityType", data.activityType);
    handleChange("exerciseLevel", data.exerciseLevel);
    handleChange("location", data.location);
    handleChange("fitnessGoal", data.fitnessGoal);
    handleChange("full_name", data.full_name);
    console.log(data);
    console.log(profileData);
  };
  // Close login modal
  const handleCloseModal = () => setLoginModalOpen(false);

  // Navigate to login page
  const handleNavigateToLogin = () => {
    navigate("/login");
    handleCloseModal();
  };

  // Add handler for error modal
  const handleCloseErrorModal = () => setErrorModalOpen(false);

  // Add handler for success modal
  const handleCloseSuccessModal = () => setSuccessModalOpen(false);

  // Loading state
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        padding: "12vh 15% 2rem",
        minHeight: "100vh",
      }}
    >
      <Container sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <NavBar />

        {/* Error Modal */}
        <Modal
          open={errorModalOpen}
          onClose={handleCloseErrorModal}
          BackdropComponent={Backdrop}
        >
          <Box sx={modalStyle}>
            <Typography variant="h6" gutterBottom>
              Error
            </Typography>
            <Typography sx={{ mb: 3, whiteSpace: "pre-line" }}>
              {errorMessage}
            </Typography>
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button variant="contained" onClick={handleCloseErrorModal}>
                OK
              </Button>
            </Stack>
          </Box>
        </Modal>

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
              <Button variant="contained" onClick={handleNavigateToLogin}>
                Go to Login
              </Button>
              <Button variant="outlined" onClick={handleCloseModal}>
                Cancel
              </Button>
            </Stack>
          </Box>
        </Modal>

        {/* Success Modal */}
        <Modal
          open={successModalOpen}
          onClose={handleCloseSuccessModal}
          BackdropComponent={Backdrop}
        >
          <Box sx={modalStyle}>
            <Typography variant="h6" gutterBottom>
              Success
            </Typography>
            <Typography sx={{ mb: 3 }}>
              Your profile has been updated successfully.
            </Typography>
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button variant="contained" onClick={handleCloseSuccessModal}>
                OK
              </Button>
            </Stack>
          </Box>
        </Modal>

        {/* Original Layout */}
        <Card
          variant="outlined"
          sx={{
            height: "auto",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            borderRadius: "16px",
            backdropFilter: "blur(10px)",
            boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            ...commonHoverStyle,
            position: "relative",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: 3,
              flexWrap: "wrap",
              padding: 2,
              width: "100%",
            }}
          >
            {/* Left Section */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1,
                padding: 8,
                width: "fit-content",
              }}
            >
              <Avatar
                sx={{ width: 120, height: 120 }}
                src="https://github.com/shadcn.png"
              />
              <Typography sx={{ fontSize: "1.5rem" }}>
                {userData?.displayName || "Username"}
              </Typography>
            </Box>

            {/* Center Section */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                flexGrow: 1,
              }}
            >
              <Box sx={{ width: "50%", minWidth: "255px" }}>
              <Typography sx={labelStyle}>
                Fitness Goal <span style={{ color: "red" }}>*</span>
              </Typography>
              <FitnessGoal
                value={profileData.fitnessGoal}
                onChange={(value) => handleChange("fitnessGoal", value)}
                sx={textFieldStyle}
              />
              </Box>
              <Typography sx={labelStyle}>
                Height (cm) <span style={{ color: "red" }}>*</span>
              </Typography>
              <HeightInput
                value={profileData.height}
                onChange={(value) => handleChange("height", value)}
                sx={textFieldStyle}
              />
              <Typography sx={labelStyle}>
                Weight (kg) <span style={{ color: "red" }}>*</span>
              </Typography>
              <WeightInput
                value={profileData.weight}
                onChange={(value) => handleChange("weight", value)}
                sx={textFieldStyle}
              />
            </Box>
          </Box>
        </Card>

        {/* Bottom Sections */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: 3,
            width: "100%",
            marginBottom: "80px",
          }}
        >
          <Card
            variant="outlined"
            sx={{
              padding: 2,
              width: "50%",
              backdropFilter: "blur(10px)",
              boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              ...commonHoverStyle,
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Typography sx={labelStyle}>Name</Typography>
              <TextField
                value={profileData.full_name || ""}
                onChange={(e) => handleChange("full_name", e.target.value)}
                sx={textFieldStyle}
              />
              <Typography sx={labelStyle}>Age</Typography>
              <TextField
                value={profileData.age || ""}
                onChange={(e) => handleChange("age", e.target.value)}
                sx={textFieldStyle}
              />
              <GenderSelection
                value={profileData.gender}
                onChange={(value) => handleChange("gender", value)}
                sx={textFieldStyle}
              />
            </Box>
          </Card>

          <Card
            variant="outlined"
            sx={{
              padding: 2,
              width: "50%",
              backdropFilter: "blur(10px)",
              boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              ...commonHoverStyle,
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Typography sx={labelStyle}>Preferred Activity Type</Typography>
              <ActivityType
                value={profileData.activityType}
                onChange={(value) => handleChange("activityType", value)}
                sx={textFieldStyle}
              />
              <ExerciseLevel
                value={profileData.exerciseLevel}
                onChange={(value) => handleChange("exerciseLevel", value)}
                sx={textFieldStyle}
              />
              <Location
                value={profileData.location}
                onChange={(value) => handleChange("location", value)}
                sx={textFieldStyle}
              />
            </Box>
          </Card>
        </Box>

        {/* Save Button */}
        <Box
          sx={{
            position: "fixed",
            bottom: 40,
            right: "15%",
            zIndex: 1000,
            display: "flex",
            gap: 2,
          }}
        >
          <Button
            variant="contained"
            onClick={handleSave}
            sx={{
              padding: "12px 36px",
              fontSize: "1.1rem",
              borderRadius: "8px",
              backgroundColor: "primary.main",
              boxShadow:
                "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
              "&:hover": {
                backgroundColor: "primary.dark",
                boxShadow:
                  "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
              },
            }}
          >
            Save Profile
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
