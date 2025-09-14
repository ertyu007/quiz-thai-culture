import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Home from './pages/Home';
import Quiz from './pages/Quiz';
import Result from './pages/Result';
import AITeacher from './components/AITeacher';

function App() {
  const handleAskAI = (question) => {
    // ในโปรเจคจริง คุณจะส่งคำถามไปยัง Groq API
    return new Promise((resolve) => {
      setTimeout(() => {
        alert(`AI ตอบ: นี่คือคำตอบสำหรับคำถาม "${question}" (ในโปรเจคจริงจะได้รับคำตอบจาก Groq API)`);
        resolve();
      }, 1000);
    });
  };

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/result" element={<Result />} />
          </Routes>
        </main>
        <div className="container mx-auto px-4 py-8">
          <AITeacher onAsk={handleAskAI} />
        </div>
        <footer className="bg-gray-800 text-white py-8 mt-12">
          <div className="container mx-auto px-4 text-center">
            <p>เกมวัฒนธรรมไทย Quiz - เรียนรู้วัฒนธรรมไทยผ่านการเล่นเกม</p>
            <p className="mt-2 text-gray-400">© 2023 สงวนลิขสิทธิ์</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;