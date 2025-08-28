import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import Header from './components/Header';

import Home from './pages/Home';
import Convert from './pages/Convert';
import Merge from './pages/Merge';
import History from './pages/History';
import Compress from './pages/Compress';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-950">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/convert" element={<Convert />} />
            <Route path="/merge" element={<Merge />} />
            <Route path="/history" element={<History />} />
            <Route path="/compress" element={<Compress />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;