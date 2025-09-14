import React from 'react';

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-thai-red to-thai-blue text-white py-6 px-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl md:text-3xl font-bold flex items-center">
          <span className="mr-2">🎮</span>
          วัฒนธรรมไทย Quiz
        </h1>
        <div className="flex items-center space-x-4">
          <span className="bg-thai-gold text-thai-blue px-3 py-1 rounded-full text-sm font-semibold">
            AI ช่วยสอน
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;