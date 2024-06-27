import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../css/projects.css'

const projects = [
  { id: 'rocketry', name: 'Rocketry', image: '/path-to-image-rocketry.jpg' },
  { id: 'herc', name: 'HERC', image: '/path-to-image-herc.jpg' },
  { id: 'cansat', name: 'Cansat', image: '/path-to-image-cansat.jpg' },
  { id: 'chessbot', name: 'Chessbot', image: '/path-to-image-chessbot.jpg' },
  { id: 'adr', name: 'ADR', image: '/path-to-image-adr.jpg' },
];

const Projects = () => {
  return (
    <>
      <Navbar />
      <div className="projects-page w-full min-h-screen bg-gray-900 text-white flex flex-col items-center pt-24">
        <h1 className="text-5xl font-bold mb-8">Our Projects</h1>
        <div className="projects-container flex flex-col space-y-8 md:w-3/4 lg:w-2/3 overflow-y-auto h-full px-4 custom-scrollbar mb-12">
          {projects.map((project) => (
            <Link key={project.id} to={`/projects/${project.id}`} className="group w-full mx-auto">
              <div className="project-card relative flex items-center p-4 bg-gray-800 rounded-lg transform transition-transform duration-300 hover:scale-105">
                <img src={project.image} alt={project.name} className="w-24 h-24 object-cover rounded-lg mr-4" />
                <div className="flex flex-col flex-grow">
                  <h2 className="text-xl lg:text-2xl font-bold mb-2">{project.name}</h2>
                </div>
                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-4xl lg:text-6xl text-white">
                    &rarr;
                  </span>
                </span>
              </div>
            </Link>
          ))}
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Projects;
