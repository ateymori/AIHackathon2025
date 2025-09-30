import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import MyNavbar from "../components/MyNavbar";
import HeroSection from "../components/HeroSection";
import TeamSection from "../components/TeamSection";
import FooterSection from "../components/FooterSection";
import AboutSection from "../components/AboutSection";
import { hackathon } from "../assets";
import Chatbox from "../components/Chatbox";

const HomePage: React.FC = () => {
  const [boxLoaded, setBoxLoaded] = useState(false);

  const handleBoxLoad = () => {
    setBoxLoaded(true);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, ease: "easeInOut" }}
        onAnimationComplete={handleBoxLoad}
      >
        <MyNavbar />
        <Chatbox title="Googooli Chat!" height={520} maxMessages={500} />
        <HeroSection />
        <TeamSection />
        <AboutSection />
        <FooterSection />
      </motion.div>
    </>
  );
};

export default HomePage;
