import CssBaseline from "@mui/material/CssBaseline";
import NavBar from "./components/Landing/NavBar";
import Divider from "@mui/material/Divider";
import Hero from "./components/Landing/Hero";
import Features from "./components/Landing/Features";
import Footer from "./components/Landing/Footer";
import LandingPage from "./views/LandingPage";
// import LogoCollection from "./components/LogoCollection";
// import Highlights from "./components/Highlights";
// import Pricing from "./components/Pricing";
// import Testimonials from "./components/Testimonials";
// import FAQ from "./components/FAQ";

export default function MarketingPage() {
  return (
    <>
      <CssBaseline enableColorScheme />
      <LandingPage />
      {/* 
      <div>
        <LogoCollection />
        <Divider />
        <Testimonials />
        <Highlights />
        <Divider />
        <Pricing />
        <Divider />
        <FAQ />
      </div> */}
    </>
  );
}
