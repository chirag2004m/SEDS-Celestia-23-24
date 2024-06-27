// src/App.jsx
import React, { useEffect, useRef, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger'; // Import ScrollTrigger from GSAP
import { motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Projects from './pages/Projects';
import Rocketry from './pages/Rocketry';
import { heroVideo } from './utils';

gsap.registerPlugin(ScrollTrigger); // Register ScrollTrigger with GSAP

const Home = () => {
  const [videoPlayed, setVideoPlayed] = useState(false);
  const videoRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    const content = contentRef.current;

    // Set up GSAP animations
    gsap.fromTo('.navbar', { y: -100 }, { y: 0, duration: 1 });

    gsap.fromTo(
      content,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, scrollTrigger: {
          trigger: content,
          start: 'top 80%', // Start the animation when 80% of content is scrolled into view
          end: 'bottom top', // End the animation when the content is scrolled past
          scrub: true // Smooth animation scrubbing
        }}
    );

    video.onended = () => {
      setVideoPlayed(true);
    };

    // Clean up ScrollTrigger on component unmount
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div className="home-container relative w-full h-screen overflow-hidden">
      <video
        ref={videoRef}
        className="w-full h-full object-cover absolute top-0 left-0"
        autoPlay
        muted
        onEnded={() => videoRef.current.pause()}
      >
        <source src={heroVideo} type="video/mp4" />
      </video>

      {videoPlayed && <Navbar />}

      {videoPlayed && (
        <motion.div
          ref={contentRef}
          className="absolute top-24 left-0 w-full flex items-center justify-center"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-4xl font-bold text-white mt-4">SEDS Celestia</h1>
        </motion.div>
      )}
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/rocketry" element={<Rocketry />} />
        {/* Add more routes here as needed */}
      </Routes>
    </Router>
  );
};

export default App;
