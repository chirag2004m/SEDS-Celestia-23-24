// src/pages/Home.jsx
import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import { heroVideo } from '../utils';

const Home = () => {
  const [scrollY, setScrollY] = useState(0);
  const videoRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const videoHeight = video.clientHeight;
    const windowHeight = window.innerHeight;
    const scrollFraction = Math.min(scrollY / (videoHeight - windowHeight), 1);
    const currentTime = scrollFraction * video.duration;

    video.currentTime = currentTime;
  }, [scrollY]);

  return (
    <div className="home-container relative w-full h-screen overflow-hidden">
      <video
        ref={videoRef}
        className="w-full h-full object-cover absolute top-0 left-0"
        autoPlay
        muted
        loop
      >
        <source src={heroVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <Navbar />

      <motion.div
        className="absolute top-24 left-0 w-full flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <h1 className="text-4xl font-bold text-white mt-4">SEDS Celestia</h1>
      </motion.div>
    </div>
  );
};

export default Home;
