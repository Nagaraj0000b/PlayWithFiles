import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-slate-900 border-b border-slate-700 shadow-xl">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold bg-gradient-to-r from-neon-blue to-neon-cyan bg-clip-text text-transparent">
              FilesConverter
            </span>
          </Link>
          
          <nav className="flex items-center space-x-6">
            <Link to="/" className="text-gray-300 hover:text-neon-blue transition-colors">
              Home
            </Link>
            <Link to="/convert" className="text-gray-300 hover:text-neon-blue transition-colors">
              Convert
            </Link>
            <Link to="/merge" className="text-gray-300 hover:text-neon-blue transition-colors">
              Merge
            </Link>
            <Link to="/history" className="text-gray-300 hover:text-neon-blue transition-colors">
              History
            </Link>
            <Link to="/compress" className="text-gray-300 hover:text-neon-blue transition-colors">
              Compress
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;