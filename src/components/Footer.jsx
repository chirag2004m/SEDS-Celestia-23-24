// src/components/Footer.jsx
import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full py-4 bg-gray-800 text-white flex justify-center items-center">
      <p>&copy; {new Date().getFullYear()} SEDS Celestia. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
