// src/services/gameService.js
// บริการสำหรับจัดการระบบเกม (Achievements, Save/Load, Mini-games, Adaptive Story)

import storyData from '../data/story.json';

// --- ฟังก์ชันช่วยสำหรับการจัดการข้อมูล ---
const saveToLocalStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    console.log(`[GameService] Saved ${key} to localStorage`);
  } catch (error) {
    console.error(`[GameService] Failed to save ${key} to localStorage:`, error);
  }
};

const loadFromLocalStorage = (key) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error(`[GameService] Failed to load ${key} from localStorage:`, error);
    return null;
  }
};

// --- ระบบ Achievements ---
export const unlockAchievement = (achievementId, unlockedAchievements, setUnlockedAchievements) => {
  const achievement = storyData.achievements[achievementId];
  if (achievement && !unlockedAchievements.includes(achievementId)) {
    const newUnlocked = [...unlockedAchievements, achievementId];
    setUnlockedAchievements(newUnlocked);
    saveToLocalStorage('thaiGame_unlockedAchievements', newUnlocked);
    console.log(`[GameService] Unlocked achievement: ${achievement.title}`);
    return achievement;
  }
  return null;
};

export const loadUnlockedAchievements = () => {
  return loadFromLocalStorage('thaiGame_unlockedAchievements') || [];
};

// --- ระบบบันทึกเกม ---
export const saveGameProgress = (gameState) => {
  saveToLocalStorage('thaiGame_saveState', gameState);
  console.log('[GameService] Game progress saved.');
};

export const loadGameProgress = () => {
  const savedState = loadFromLocalStorage('thaiGame_saveState');
  if (savedState) {
    console.log('[GameService] Game progress loaded.');
    return savedState;
  }
  console.log('[GameService] No saved game found.');
  return null;
};

export const clearSavedGame = () => {
  localStorage.removeItem('thaiGame_saveState');
  console.log('[GameService] Saved game cleared.');
};

// --- ระบบ Mini-games ---
export const getMiniGameData = (miniGameType) => {
  return storyData.miniGames[miniGameType] || null;
};

// --- ระบบ Adaptive Story ---
// ฟังก์ชันนี้จะถูกเรียกใน storyService เพื่อปรับเนื้อเรื่อง
export const adaptStoryBasedOnPlayerActions = (playerStats, currentSceneKey) => {
  // ตัวอย่างง่ายๆ: ถ้าผู้เล่นมีไอเท็ม "ความสนุก" มากกว่า 3 ชิ้น ให้เพิ่มโอกาสเจอ mini-game
  const funItemsCount = playerStats.items.filter(item => item.includes('สนุก')).length;
  if (funItemsCount > 3 && currentSceneKey === 'temple_market_morning') {
    console.log('[GameService] Player loves fun! Increasing chance of mini-game appearance.');
  }
  
  // ถ้าผู้เล่นมีไอเท็ม "ความรู้" มากกว่า 2 ชิ้น ให้เพิ่มโอกาสเจอ scene ที่เกี่ยวข้องกับการเรียนรู้
  const knowledgeItemsCount = playerStats.items.filter(item => item.includes('รู้')).length;
  if (knowledgeItemsCount > 2 && currentSceneKey === 'temple_courtyard_afternoon') {
    console.log('[GameService] Player loves knowledge! Increasing chance of learning scene.');
  }
};

// --- ฟังก์ชันสำหรับเตรียมข้อมูลเริ่มต้น ---
export const initializeGameData = () => {
  const unlockedAchievements = loadUnlockedAchievements();
  return {
    unlockedAchievements
  };
};