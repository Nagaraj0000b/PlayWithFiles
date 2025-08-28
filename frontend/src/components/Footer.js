import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-slate-900 border-t border-slate-700 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold bg-gradient-to-r from-neon-blue to-neon-cyan bg-clip-text text-transparent mb-4">
              FilesConverter
            </h3>
            <p className="text-gray-400 text-sm">
              Professional file conversion tool for documents, spreadsheets, and images.
            </p>
          </div>
          
          <div>
            <h4 className="text-gray-200 font-semibold mb-4">Features</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Document Conversion</li>
              <li>Image Processing</li>
              <li>File Merging</li>
              <li>Batch Processing</li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-gray-200 font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="text-gray-400 hover:text-neon-blue transition-colors">Home</Link></li>
              <li><Link to="/convert" className="text-gray-400 hover:text-neon-blue transition-colors">Convert</Link></li>
              <li><Link to="/merge" className="text-gray-400 hover:text-neon-blue transition-colors">Merge</Link></li>
              <li><Link to="/history" className="text-gray-400 hover:text-neon-blue transition-colors">History</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-gray-200 font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Help Center</li>
              <li>Contact Us</li>
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-700 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2024 FilesConverter. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;