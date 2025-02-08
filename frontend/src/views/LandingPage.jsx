import * as React from "react";
import NavigationBar from "../components/NavBar";
import Divider from "@mui/material/Divider";
import Hero from "../components/Hero";
import Features from "../components/Features";
import Footer from "../components/Footer";

export default function NavBar() {
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
