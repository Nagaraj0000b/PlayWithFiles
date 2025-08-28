import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-16 text-center">
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-100 mb-6">
        Professional File
        <span className="bg-gradient-to-r from-neon-blue to-neon-cyan bg-clip-text text-transparent ml-3">
          Converter
        </span>
      </h1>
      
      <p className="text-lg sm:text-xl text-gray-300 mb-8 max-w-2xl mx-auto px-2">
        Transform your documents, spreadsheets, and images with our powerful, 
        secure, and lightning-fast conversion platform.
      </p>
      
      <Link to="/convert" className="btn-primary inline-block">
        Start Converting
      </Link>
    </div>
  );
};

export default Home;