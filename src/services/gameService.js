// src/services/gameService.js
import storyData from '../data/story.json';

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