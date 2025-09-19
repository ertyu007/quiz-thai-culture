// src/contexts/SettingsContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const SettingsContext = createContext();

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

export const SettingsProvider = ({ children }) => {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [autoSave, setAutoSave] = useState(true);

  useEffect(() => {
    // โหลดการตั้งค่าจาก localStorage
    const savedSound = localStorage.getItem('thaiGame_soundEnabled');
    const savedMusic = localStorage.getItem('thaiGame_musicEnabled');
    const savedAutoSave = localStorage.getItem('thaiGame_autoSave');

    if (savedSound !== null) setSoundEnabled(savedSound === 'true');
    if (savedMusic !== null) setMusicEnabled(savedMusic === 'true');
    if (savedAutoSave !== null) setAutoSave(savedAutoSave === 'true');
  }, []);

  const resetSettings = () => {
    setSoundEnabled(true);
    setMusicEnabled(true);
    setAutoSave(true);
    localStorage.removeItem('thaiGame_soundEnabled');
    localStorage.removeItem('thaiGame_musicEnabled');
    localStorage.removeItem('thaiGame_autoSave');
  };

  useEffect(() => {
    localStorage.setItem('thaiGame_soundEnabled', soundEnabled);
  }, [soundEnabled]);

  useEffect(() => {
    localStorage.setItem('thaiGame_musicEnabled', musicEnabled);
  }, [musicEnabled]);

  useEffect(() => {
    localStorage.setItem('thaiGame_autoSave', autoSave);
  }, [autoSave]);

  const value = {
    soundEnabled,
    setSoundEnabled,
    musicEnabled,
    setMusicEnabled,
    autoSave,
    setAutoSave,
    resetSettings
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};