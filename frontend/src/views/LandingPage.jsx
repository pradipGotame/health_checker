import * as React from "react";
import NavigationBar from "../components/Landing/NavBar";
import Divider from "@mui/material/Divider";
import Hero from "../components/Landing/Hero";
import Features from "../components/Landing/Features";
import Footer from "../components/Landing/Footer";

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
