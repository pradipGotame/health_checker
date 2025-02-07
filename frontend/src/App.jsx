import CssBaseline from "@mui/material/CssBaseline";
import NavBar from "./components/NavBar";
import Divider from "@mui/material/Divider";
import Hero from "./components/Hero";
import Features from "./components/Features";
import Footer from "./components/Footer";
// import LogoCollection from "./components/LogoCollection";
// import Highlights from "./components/Highlights";
// import Pricing from "./components/Pricing";
// import Testimonials from "./components/Testimonials";
// import FAQ from "./components/FAQ";

export default function MarketingPage() {
  return (
    <>
      <CssBaseline enableColorScheme />
      <NavBar />
      <Hero />
      <Divider />
      <Features />
      <Divider />
      <Footer />
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
