// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import './App.css';
import Header from './components/Header';
import Home from './pages/Home';
import Game from './pages/Game';
import { SettingsProvider } from './contexts/SettingsContext';

function App() {
  return (
    <SettingsProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100 flex flex-col">
          <Header />
          <main className="flex-grow">
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/game" element={<Game />} />
              </Routes>
            </AnimatePresence>
          </main>
          <footer className="bg-amber-900 text-amber-100 py-6 sm:py-8 mt-12">
            <div className="container mx-auto px-4 text-center">
              <p className="text-sm sm:text-base">เกม "นักเรียนไทยย้อนยุค" - เรียนรู้วัฒนธรรมไทยผ่านการผจญภัย</p>
              <p className="mt-1 sm:mt-2 text-amber-300 text-xs sm:text-sm">© 2024 สงวนลิขสิทธิ์</p>
            </div>
          </footer>
        </div>
      </Router>
    </SettingsProvider>
  );
}

export default App;