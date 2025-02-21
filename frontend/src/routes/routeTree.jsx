import { Route, Routes } from "react-router-dom";
import Profile from "../Profile/Profile";  // Profile Page
// import LandingPage from "../pages/LandingPage"; 

const RouteTree = () => {
  return (
    <Routes>
      {/* <Route path="/" element={<LandingPage />} />   LandingPage */}
      <Route path="/profile" element={<Profile />} />  {/* Profile Page */}
    </Routes>
  );
};

export default RouteTree;
