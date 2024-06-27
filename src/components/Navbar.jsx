// src/components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar fixed top-0 left-0 w-full py-6 px-8 bg-black bg-opacity-70 text-white flex justify-between items-center z-10">
      <div className="logo text-xl font-bold">Logo</div>
      <div className="menu flex space-x-4">
        <Link to="/" className="hover:text-gray-400">Home</Link>
        <Link to="/team" className="hover:text-gray-400">Team</Link>
        <Link to="/events" className="hover:text-gray-400">Events</Link>
        <Link to="/projects" className="hover:text-gray-400">Projects</Link>
      </div>
    </nav>
  );
};

export default Navbar;
