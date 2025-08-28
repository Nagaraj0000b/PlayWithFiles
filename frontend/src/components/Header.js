import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-slate-900 border-b border-slate-700 shadow-xl">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2" onClick={closeMenu}>
            <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-neon-blue to-neon-cyan bg-clip-text text-transparent">
              PlayWithFiles
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4 lg:space-x-6">
            <Link to="/" className="text-gray-300 hover:text-neon-blue transition-colors text-sm lg:text-base">
              Home
            </Link>
            <Link to="/convert" className="text-gray-300 hover:text-neon-blue transition-colors text-sm lg:text-base">
              Convert
            </Link>
            <Link to="/merge" className="text-gray-300 hover:text-neon-blue transition-colors text-sm lg:text-base">
              Merge
            </Link>
            <Link to="/compress" className="text-gray-300 hover:text-neon-blue transition-colors text-sm lg:text-base">
              Compress
            </Link>
            <Link to="/history" className="text-gray-300 hover:text-neon-blue transition-colors text-sm lg:text-base">
              History
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={toggleMenu}
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-300 hover:text-neon-blue hover:bg-slate-800 transition-colors"
            aria-label="Toggle menu"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden pb-4">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-slate-800 rounded-lg">
              <Link
                to="/"
                className="block px-3 py-2 text-gray-300 hover:text-neon-blue hover:bg-slate-700 rounded-md transition-colors"
                onClick={closeMenu}
              >
                🏠 Home
              </Link>
              <Link
                to="/convert"
                className="block px-3 py-2 text-gray-300 hover:text-neon-blue hover:bg-slate-700 rounded-md transition-colors"
                onClick={closeMenu}
              >
                🔄 Convert
              </Link>
              <Link
                to="/merge"
                className="block px-3 py-2 text-gray-300 hover:text-neon-blue hover:bg-slate-700 rounded-md transition-colors"
                onClick={closeMenu}
              >
                📎 Merge
              </Link>
              <Link
                to="/compress"
                className="block px-3 py-2 text-gray-300 hover:text-neon-blue hover:bg-slate-700 rounded-md transition-colors"
                onClick={closeMenu}
              >
                🗜️ Compress
              </Link>
              <Link
                to="/history"
                className="block px-3 py-2 text-gray-300 hover:text-neon-blue hover:bg-slate-700 rounded-md transition-colors"
                onClick={closeMenu}
              >
                📋 History
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;