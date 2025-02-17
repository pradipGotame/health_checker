import Divider from "@mui/material/Divider";

import NavigationBar from "../components/Landing/NavBar";
import Features from "../components/Landing/Features";
import Footer from "../components/Landing/Footer";
import Hero from "../components/Landing/Hero";

export default function LandingPage() {
  return (
    <>
      <NavigationBar />
      <Hero />
      <Divider />
      <Features />
      <Divider />
      <Footer />
    </>
  );
}
