// src/pages/Game.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  initializeStory,
  makeChoice,
  determineEnding
} from '../services/storyService';
import {
  unlockAchievement,
  loadUnlockedAchievements,
  saveGameProgress,
  loadGameProgress,
  clearSavedGame
} from '../services/gameService';
import PlayerStats from '../components/PlayerStats';
import StoryDisplay from '../components/StoryDisplay';
import ChoiceButtons from '../components/ChoiceButtons';
import AchievementNotification from '../components/AchievementNotification';

const Game = () => {
  const navigate = useNavigate();
  const [storyData, setStoryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ xp: 0, items: [] });
  const [error, setError] = useState(null);
  const [unlockedAchievements, setUnlockedAchievements] = useState([]);
  const [newlyUnlockedAchievement, setNewlyUnlockedAchievement] = useState(null);
  const [requirementNotMet, setRequirementNotMet] = useState(false);

  const playerName = localStorage.getItem('thaiGame_playerName') || 'นักเรียน';
  const humorMode = localStorage.getItem('thaiGame_humorMode') === 'true';
  const adaptiveStory = localStorage.getItem('thaiGame_adaptiveStory') === 'true';

  // --- เพิ่ม useEffect สำหรับ setup window.gameHack ---
  useEffect(() => {
    // Setup window.gameHack object
    window.gameHack = {
      // --- State Getters ---
      getStats: () => ({ ...stats }),
      getUnlockedAchievements: () => [...unlockedAchievements],
      getStoryData: () => storyData ? { ...storyData } : null,
      getPlayerName: () => playerName,
      getHumorMode: () => humorMode,
      getAdaptiveStory: () => adaptiveStory,
      getRequirementNotMet: () => requirementNotMet,

      // --- State Setters ---
      setStats: (newStats) => {
        if (typeof newStats === 'object' && newStats !== null) {
          setStats(newStats);
          // console.log('[GameHack] Stats updated:', newStats); // คอมเม้น log ไว้
        } else {
          // console.error('[GameHack] Invalid stats object provided to setStats'); // คอมเม้น log ไว้
        }
      },
      setUnlockedAchievements: (newAchievements) => {
        if (Array.isArray(newAchievements)) {
          setUnlockedAchievements(newAchievements);
          // console.log('[GameHack] Unlocked achievements updated:', newAchievements); // คอมเม้น log ไว้
        } else {
          // console.error('[GameHack] Invalid achievements array provided to setUnlockedAchievements'); // คอมเม้น log ไว้
        }
      },
      setStoryData: (newStoryData) => {
        if (typeof newStoryData === 'object' && newStoryData !== null) {
          setStoryData(newStoryData);
          // console.log('[GameHack] Story data updated:', newStoryData); // คอมเม้น log ไว้
        } else {
          // console.error('[GameHack] Invalid story data object provided to setStoryData'); // คอมเม้น log ไว้
        }
      },
      setRequirementNotMet: (newValue) => {
        if (typeof newValue === 'boolean') {
          setRequirementNotMet(newValue);
          // console.log('[GameHack] RequirementNotMet updated:', newValue); // คอมเม้น log ไว้
        } else {
          // console.error('[GameHack] Invalid boolean value provided to setRequirementNotMet'); // คอมเม้น log ไว้
        }
      },

      // --- Utility Functions ---
      navigate: (path) => {
        if (typeof path === 'string') {
          navigate(path);
          // console.log(`[GameHack] Navigating to: ${path}`); // คอมเม้น log ไว้
        } else {
          // console.error('[GameHack] Invalid path provided to navigate'); // คอมเม้น log ไว้
        }
      },
      reloadGame: async () => {
        setLoading(true);
        setError(null);
        try {
          setStats({ xp: 0, items: [] });
          setUnlockedAchievements(loadUnlockedAchievements());
          clearSavedGame();
          const initialStory = await initializeStory(playerName);
          setStoryData(initialStory);
          const firstAchievement = unlockAchievement('first_steps', loadUnlockedAchievements(), setUnlockedAchievements);
          if (firstAchievement) {
              setNewlyUnlockedAchievement(firstAchievement);
          }
          setRequirementNotMet(false);
          // console.log('[GameHack] Game reloaded'); // คอมเม้น log ไว้
        } catch (err) {
          setError(err.message || 'Failed to reload the game.');
          // console.error('[GameHack] Failed to reload game:', err); // คอมเม้น log ไว้
        } finally {
          setLoading(false);
        }
      },
      clearGame: () => {
        setStats({ xp: 0, items: [] });
        setUnlockedAchievements([]);
        setStoryData(null);
        setRequirementNotMet(false);
        clearSavedGame();
        // console.log('[GameHack] Game cleared'); // คอมเม้น log ไว้
      },
      unlockAllAchievements: () => {
        const allAchievementIds = Object.keys(loadUnlockedAchievements());
        const hardcodedIds = ['first_steps', 'helping_hand', 'knowledge_seeker', 'fun_lover', 'mini_game_master', 'collector'];
        setUnlockedAchievements(hardcodedIds);
        // console.log('[GameHack] All achievements unlocked'); // คอมเม้น log ไว้
      },
      giveXp: (amount) => {
        if (typeof amount === 'number' && amount > 0) {
          setStats(prevStats => ({
            ...prevStats,
            xp: prevStats.xp + amount
          }));
          // console.log(`[GameHack] Gave ${amount} XP`); // คอมเม้น log ไว้
        } else {
          // console.error('[GameHack] Invalid XP amount provided to giveXp'); // คอมเม้น log ไว้
        }
      },
      giveItem: (itemName) => {
        if (typeof itemName === 'string' && itemName.trim() !== '') {
          setStats(prevStats => ({
            ...prevStats,
            items: [...prevStats.items, itemName.trim()]
          }));
          // console.log(`[GameHack] Gave item: ${itemName}`); // คอมเม้น log ไว้
        } else {
          // console.error('[GameHack] Invalid item name provided to giveItem'); // คอมเม้น log ไว้
        }
      },
      giveItems: (itemNames) => {
        if (Array.isArray(itemNames) && itemNames.every(name => typeof name === 'string' && name.trim() !== '')) {
          const trimmedItems = itemNames.map(name => name.trim());
          setStats(prevStats => ({
            ...prevStats,
            items: [...prevStats.items, ...trimmedItems]
          }));
          // console.log(`[GameHack] Gave items: ${trimmedItems.join(', ')}`); // คอมเม้น log ไว้
        } else {
          // console.error('[GameHack] Invalid item names array provided to giveItems'); // คอมเม้น log ไว้
        }
      },
      removeAllItems: () => {
        setStats(prevStats => ({
          ...prevStats,
          items: []
        }));
        // console.log('[GameHack] All items removed'); // คอมเม้น log ไว้
      },
      resetXp: () => {
        setStats(prevStats => ({
          ...prevStats,
          xp: 0
        }));
        // console.log('[GameHack] XP reset to 0'); // คอมเม้น log ไว้
      },
      goToScene: async (sceneKey) => {
        if (typeof sceneKey === 'string') {
          setLoading(true);
          setError(null);
          try {
            const newStory = await initializeStory(playerName);
            setStoryData(newStory);
            // console.log(`[GameHack] Went to scene: ${sceneKey}`); // คอมเม้น log ไว้
          } catch (err) {
            setError(err.message || `Failed to go to scene: ${sceneKey}`);
            // console.error(`[GameHack] Failed to go to scene: ${sceneKey}`, err); // คอมเม้น log ไว้
          } finally {
            setLoading(false);
          }
        } else {
          // console.error('[GameHack] Invalid scene key provided to goToScene'); // คอมเม้น log ไว้
        }
      },
      endGame: (endingType = 'neutral_participated') => {
        const endingDetails = determineEnding(endingType);
        setStoryData({
          text: "เรื่องราวดำเนินไป... และวันสงกรานต์ก็ใกล้จะจบลง",
          choices: [],
          gameEnded: true,
          ending: endingDetails
        });
        // console.log(`[GameHack] Game ended with type: ${endingType}`); // คอมเม้น log ไว้
      },
      showHelp: () => {
        // console.log('%c=== Game Hack Commands ===', 'color: green; font-weight: bold;'); // คอมเม้น log ไว้
        // console.log('%cwindow.gameHack.getStats() - Get current player stats', 'color: blue;'); // คอมเม้น log ไว้
        // console.log('%cwindow.gameHack.setStats({ xp: 100, items: ["ไอเท็ม1", "ไอเท็ม2"] }) - Set player stats', 'color: blue;'); // คอมเม้น log ไว้
        // console.log('%cwindow.gameHack.getUnlockedAchievements() - Get unlocked achievements', 'color: blue;'); // คอมเม้น log ไว้
        // console.log('%cwindow.gameHack.setUnlockedAchievements(["ach1", "ach2"]) - Set unlocked achievements', 'color: blue;'); // คอมเม้น log ไว้
        // console.log('%cwindow.gameHack.unlockAllAchievements() - Unlock all achievements', 'color: blue;'); // คอมเม้น log ไว้
        // console.log('%cwindow.gameHack.giveXp(100) - Give XP to player', 'color: blue;'); // คอมเม้น log ไว้
        // console.log('%cwindow.gameHack.giveItem("ไอเท็มพิเศษ") - Give an item to player', 'color: blue;'); // คอมเม้น log ไว้
        // console.log('%cwindow.gameHack.giveItems(["ไอเท็ม1", "ไอเท็ม2"]) - Give multiple items to player', 'color: blue;'); // คอมเม้น log ไว้
        // console.log('%cwindow.gameHack.removeAllItems() - Remove all items from player', 'color: blue;'); // คอมเม้น log ไว้
        // console.log('%cwindow.gameHack.resetXp() - Reset player XP to 0', 'color: blue;'); // คอมเม้น log ไว้
        // console.log('%cwindow.gameHack.reloadGame() - Reload the game', 'color: blue;'); // คอมเม้น log ไว้
        // console.log('%cwindow.gameHack.clearGame() - Clear all game data', 'color: blue;'); // คอมเม้น log ไว้
        // console.log('%cwindow.gameHack.endGame("good_knowledgeable") - End game with specific ending', 'color: blue;'); // คอมเม้น log ไว้
        // console.log('%cwindow.gameHack.navigate("/") - Navigate to a path', 'color: blue;'); // คอมเม้น log ไว้
        // console.log('%cwindow.gameHack.showHelp() - Show this help message', 'color: blue;'); // คอมเม้น log ไว้
        // console.log('%c=========================', 'color: green; font-weight: bold;'); // คอมเม้น log ไว้
      }
    };

    // Log ข้อความเมื่อ setup เสร็จ (คอมเม้นไว้)
    // console.log('%c[GameHack] Window.gameHack is ready!', 'color: green; font-weight: bold;');
    // console.log('%cType window.gameHack.showHelp() for available commands.', 'color: blue;');

    // Cleanup function เมื่อ component unmount
    return () => {
      delete window.gameHack;
      // console.log('[GameHack] Window.gameHack removed'); // คอมเม้น log ไว้
    };
  }, [stats, unlockedAchievements, storyData, playerName, humorMode, adaptiveStory, requirementNotMet, navigate]);
  // --- สิ้นสุด useEffect สำหรับ setup window.gameHack ---

  useEffect(() => {
    const startGame = async () => {
      try {
        setError(null);
        const initialStory = await initializeStory(playerName);
        setStoryData(initialStory);
        const firstAchievement = unlockAchievement('first_steps', [], setUnlockedAchievements);
        if (firstAchievement) {
          setNewlyUnlockedAchievement(firstAchievement);
        }
      } catch (err) {
        console.error('Failed to start game:', err);
        setError(err.message || 'Failed to start the game.');
      } finally {
        setLoading(false);
      }
    };
    startGame();
  }, [playerName]);

  const handleChoice = async (choiceId) => {
    if (!storyData || storyData.gameEnded) return;

    if (choiceId === 'go_home') {
      navigate('/');
      return;
    }

    if (choiceId === 'try_again' || choiceId === 'continue_anyway') {
      setLoading(true);
      setError(null);
      try {
        setStats({ xp: 0, items: [] });
        setUnlockedAchievements(loadUnlockedAchievements());
        clearSavedGame();
        const initialStory = await initializeStory(playerName);
        setStoryData(initialStory);
        const firstAchievement = unlockAchievement('first_steps', loadUnlockedAchievements(), setUnlockedAchievements);
        if (firstAchievement) {
            setNewlyUnlockedAchievement(firstAchievement);
        }
        setRequirementNotMet(false);
      } catch (err) {
        setError(err.message || 'Failed to restart the game.');
      } finally {
        setLoading(false);
      }
      return;
    }

    setLoading(true);
    setError(null);
    setNewlyUnlockedAchievement(null);
    setRequirementNotMet(false);
    try {
      const result = await makeChoice(choiceId, storyData.context, stats, humorMode, adaptiveStory);
      
      if (result.stats) {
        setStats(prevStats => ({
          xp: prevStats.xp + (result.stats.xp || 0),
          items: [...prevStats.items, ...(result.stats.items || [])]
        }));
        checkAndUnlockAchievements({
          xp: stats.xp + (result.stats.xp || 0),
          items: [...stats.items, ...(result.stats.items || [])]
        });
      }

      if (result.gameEnded) {
        const endingDetails = determineEnding(result.endingKey);
        setStoryData({
          ...result.story,
          gameEnded: true,
          ending: endingDetails
        });
      } else if (result.requirementNotMet) {
        setStoryData({
          text: result.story.text,
          choices: result.story.choices,
          context: result.story.context,
          requirementNotMet: true
        });
        setRequirementNotMet(true);
      } else {
        setStoryData(result.story);
      }

      saveGameProgress({
        storyData: result.story,
        stats: {
          xp: stats.xp + (result.stats?.xp || 0),
          items: [...stats.items, ...(result.stats?.items || [])]
        },
        unlockedAchievements: unlockedAchievements
      });

    } catch (err) {
      console.error('Failed to make choice:', err);
      setError(err.message || 'An error occurred while processing your choice.');
      setStoryData({
        text: "เกิดข้อผิดพลาดในการดำเนินเรื่อง... แต่เรื่องราวก็ยังดำเนินต่อไป",
        choices: [
          { id: 'continue_anyway', text: "ดำเนินเรื่องต่อ" },
          { id: 'go_home', text: "กลับหน้าหลัก" }
        ],
        context: storyData.context
      });
    } finally {
      setLoading(false);
    }
  };

  const checkAndUnlockAchievements = (currentStats) => {
    if (currentStats.xp > 10 && !unlockedAchievements.includes('helping_hand')) {
      const achievement = unlockAchievement('helping_hand', unlockedAchievements, setUnlockedAchievements);
      if (achievement) {
        setNewlyUnlockedAchievement(achievement);
      }
    }
    
    const knowledgeItems = currentStats.items.filter(item => item.includes('รู้')).length;
    if (knowledgeItems > 1 && !unlockedAchievements.includes('knowledge_seeker')) {
      const achievement = unlockAchievement('knowledge_seeker', unlockedAchievements, setUnlockedAchievements);
      if (achievement) {
        setNewlyUnlockedAchievement(achievement);
      }
    }
    
    const funItems = currentStats.items.filter(item => item.includes('สนุก')).length;
    if (funItems > 1 && !unlockedAchievements.includes('fun_lover')) {
      const achievement = unlockAchievement('fun_lover', unlockedAchievements, setUnlockedAchievements);
      if (achievement) {
        setNewlyUnlockedAchievement(achievement);
      }
    }
    
    if (currentStats.items.length > 5 && !unlockedAchievements.includes('collector')) {
      const achievement = unlockAchievement('collector', unlockedAchievements, setUnlockedAchievements);
      if (achievement) {
        setNewlyUnlockedAchievement(achievement);
      }
    }
  };

  const handleRestart = () => {
    navigate('/');
  };

  const closeAchievementNotification = () => {
    setNewlyUnlockedAchievement(null);
  };

  if (loading && !storyData) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="text-4xl mb-4">🔄</div>
        <h2 className="text-2xl font-bold text-gray-800">กำลังโหลดเนื้อเรื่อง...</h2>
        <p className="text-gray-600 mt-2">AI กำลังแต่งเรื่องราวให้คุณ</p>
      </div>
    );
  }

  if (!storyData) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-red-600">ไม่สามารถเริ่มเกมได้</h2>
        {error && <p className="text-red-500 mt-2">{error}</p>}
        <button
          onClick={() => navigate('/')}
          className="mt-4 bg-amber-600 text-white py-2 px-4 rounded-lg hover:bg-amber-700 transition-colors"
        >
          กลับหน้าหลัก
        </button>
      </div>
    );
  }

  if (storyData.gameEnded && storyData.ending) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">เกมจบ!</h1>
          <h2 className="text-2xl font-bold text-amber-700 mb-4">{storyData.ending.title}</h2>
          <div className={`p-6 rounded-lg mb-6 ${
            storyData.ending.type === 'good' ? 'bg-green-100 text-green-800' :
            storyData.ending.type === 'bad' ? 'bg-red-100 text-red-800' :
            'bg-blue-100 text-blue-800'
          }`}>
            <p className="text-lg">{storyData.ending.text}</p>
          </div>
          <div className="bg-amber-50 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-bold text-amber-800 mb-2">สถิติของคุณ:</h3>
            <p>คะแนนประสบการณ์: {stats.xp}</p>
            <p>ไอเท็มที่ได้รับ: {stats.items.length > 0 ? stats.items.join(', ') : 'ไม่มี'}</p>
            <p>Achievements ที่ปลดล็อค: {unlockedAchievements.length}</p>
          </div>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={handleRestart}
              className="bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              เล่นอีกครั้ง
            </button>
            <button
              onClick={() => navigate('/')}
              className="bg-gray-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
            >
              กลับหน้าหลัก
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-2xl relative">
      {newlyUnlockedAchievement && (
        <AchievementNotification
          achievement={newlyUnlockedAchievement}
          onClose={closeAchievementNotification}
        />
      )}

      <PlayerStats playerName={playerName} xp={stats.xp} unlockedAchievements={unlockedAchievements} />

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <strong>เกิดข้อผิดพลาด: </strong> {error}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-lg p-5 sm:p-6 mb-6 transition-all duration-300">
        <StoryDisplay storyText={storyData.text} />

        <ChoiceButtons
          choices={storyData.choices}
          onChoose={handleChoice}
          loading={loading}
          requirementNotMet={requirementNotMet}
        />
      </div>

      {loading && (
        <div className="text-center py-4">
          <div className="text-2xl mb-2">⏳</div>
          <p className="text-gray-600">กำลังดำเนินเรื่อง...</p>
        </div>
      )}
    </div>
  );
};

export default Game;