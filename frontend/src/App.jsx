import CssBaseline from "@mui/material/CssBaseline";
import LandingPage from "./views/LandingPage";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import LogoCollection from "./components/LogoCollection";
// import Highlights from "./components/Highlights";
// import Pricing from "./components/Pricing";
// import Testimonials from "./components/Testimonials";
// import FAQ from "./components/FAQ";

export default function MarketingPage() {
  return (
    <Router>
      <CssBaseline enableColorScheme />
      <Routes>
        <Route path="/" element={<LandingPage />} />
      </Routes>
    </Router>
  );
}
