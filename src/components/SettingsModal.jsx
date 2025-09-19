// src/components/SettingsModal.jsx
import React, { useState, useEffect } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { playSound } from '../utils/soundEffects';

const SettingsModal = ({ isOpen, onClose }) => {
  const { 
    soundEnabled, 
    setSoundEnabled, 
    musicEnabled, 
    setMusicEnabled,
    autoSave,
    setAutoSave
  } = useSettings();
  
  const [tempSettings, setTempSettings] = useState({
    sound: soundEnabled,
    music: musicEnabled,
    autoSave: autoSave
  });

  useEffect(() => {
    if (isOpen) {
      setTempSettings({
        sound: soundEnabled,
        music: musicEnabled,
        autoSave: autoSave
      });
    }
  }, [isOpen, soundEnabled, musicEnabled, autoSave]);

  const handleSave = () => {
    setSoundEnabled(tempSettings.sound);
    setMusicEnabled(tempSettings.music);
    setAutoSave(tempSettings.autoSave);
    
    if (tempSettings.sound) {
      playSound('click');
    }
    
    onClose();
  };

  const handleCancel = () => {
    setTempSettings({
      sound: soundEnabled,
      music: musicEnabled,
      autoSave: autoSave
    });
    
    if (soundEnabled) {
      playSound('click');
    }
    
    onClose();
  };

  const handleToggle = (setting) => {
    setTempSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
    
    if (tempSettings.sound) {
      playSound('click');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">ตั้งค่าเกม</h2>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <label htmlFor="sound" className="text-gray-700 font-medium block mb-1">
                เสียง效果
              </label>
              <p className="text-sm text-gray-500">เปิด/ปิดเสียงเอฟเฟกต์</p>
            </div>
            <button
              onClick={() => handleToggle('sound')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${tempSettings.sound ? 'bg-green-500' : 'bg-gray-300'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${tempSettings.sound ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <label htmlFor="music" className="text-gray-700 font-medium block mb-1">
                เพลงพื้นหลัง
              </label>
              <p className="text-sm text-gray-500">เปิด/ปิดเพลงประกอบเกม</p>
            </div>
            <button
              onClick={() => handleToggle('music')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${tempSettings.music ? 'bg-green-500' : 'bg-gray-300'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${tempSettings.music ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <label htmlFor="autoSave" className="text-gray-700 font-medium block mb-1">
                บันทึกอัตโนมัติ
              </label>
              <p className="text-sm text-gray-500">บันทึกความคืบหน้าอัตโนมัติ</p>
            </div>
            <button
              onClick={() => handleToggle('autoSave')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${tempSettings.autoSave ? 'bg-green-500' : 'bg-gray-300'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${tempSettings.autoSave ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
        </div>
        
        <div className="mt-8 flex justify-between">
          <button
            onClick={handleCancel}
            className="bg-gray-300 text-gray-700 py-2 px-6 rounded-lg hover:bg-gray-400 transition-colors font-medium"
          >
            ยกเลิก
          </button>
          <button
            onClick={handleSave}
            className="bg-amber-600 text-white py-2 px-6 rounded-lg hover:bg-amber-700 transition-colors font-medium"
          >
            บันทึก
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;