import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
import { useSettings } from '../contexts/SettingsContext';
import PlayerStats from '../components/PlayerStats';
import StoryDisplay from '../components/StoryDisplay';
import ChoiceButtons from '../components/ChoiceButtons';
import AchievementNotification from '../components/AchievementNotification';
import ItemNotification from '../components/ItemNotification';
import SettingsModal from '../components/SettingsModal';
import LoadingSpinner from '../components/LoadingSpinner';
import { playSound } from '../utils/soundEffects';
import ProgressModal from '../components/ProgressModal';
import ModernAlert from '../components/ModernAlert';
import AutoSaveNotification from '../components/AutoSaveNotification';
import ErrorAlert from '../components/ErrorAlert';

const Game = () => {
  const navigate = useNavigate();
  const { soundEnabled, autoSave, musicEnabled } = useSettings();
  const [storyData, setStoryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ xp: 0, items: [] });
  const [error, setError] = useState(null);
  const [unlockedAchievements, setUnlockedAchievements] = useState([]);
  const [newlyUnlockedAchievement, setNewlyUnlockedAchievement] = useState(null);
  const [newItem, setNewItem] = useState(null);
  const [requirementNotMet, setRequirementNotMet] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [autoSaveMessage, setAutoSaveMessage] = useState('');
  const [backgroundMusic, setBackgroundMusic] = useState(null);
  const autoSaveTimeoutRef = useRef(null);
  const previousItemsRef = useRef([]);
  const [showProgress, setShowProgress] = useState(false);
  const [showAlert, setShowAlert] = useState(null);

  const playerName = localStorage.getItem('thaiGame_playerName') || 'นักเรียน';
  const humorMode = localStorage.getItem('thaiGame_humorMode') === 'true';
  const adaptiveStory = localStorage.getItem('thaiGame_adaptiveStory') === 'true';

  const toggleProgressModal = () => {
    setShowProgress(!showProgress);
    if (soundEnabled && !showProgress) {
      playSound('click');
    }
  };

  const showCustomAlert = (type, title, message, duration = 3000) => {
    setShowAlert({ type, title, message, duration });
  };

  // Load saved game or start new game
  useEffect(() => {
    const loadGame = async () => {
      const saved = loadGameProgress();
      if (saved) {
        const { scenes } = await import('../services/storyService');
        if (saved.storyData && scenes && scenes[saved.storyData.context?.scene]) {
          setStoryData(saved.storyData);
          setStats(saved.stats);
          setUnlockedAchievements(saved.unlockedAchievements || []);
        } else {
          console.log('Save file incompatible, starting new game');
          await startNewGame();
        }
        setLoading(false);
        return;
      }
      await startNewGame();
    };

    loadGame();
  }, [playerName]);

  const startNewGame = async () => {
    try {
      setError(null);
      const initialStory = await initializeStory(playerName);
      setStoryData(initialStory);
      const firstAchievement = unlockAchievement('first_steps', [], setUnlockedAchievements);
      if (firstAchievement) {
        setNewlyUnlockedAchievement(firstAchievement);
      }
    } catch (err) {
      setError(err.message || 'Failed to start the game.');
    } finally {
      setLoading(false);
    }
  };

  // Setup background music
  useEffect(() => {
    if (musicEnabled) {
      const music = new Audio(process.env.PUBLIC_URL + '/sounds/background-music.mp3');
      music.loop = true;
      music.volume = 0.3;
      setBackgroundMusic(music);

      const playMusic = async () => {
        try {
          await music.play();
        } catch (error) {
          console.log('ต้องมีการโต้ตอบจากผู้ใช้ก่อนจึงจะเล่นเพลงได้');
        }
      };

      playMusic();

      return () => {
        music.pause();
      };
    } else if (backgroundMusic) {
      backgroundMusic.pause();
      setBackgroundMusic(null);
    }
  }, [musicEnabled]);

  // Detect new items
  useEffect(() => {
    if (stats.items.length > 0) {
      const newItems = stats.items.filter(item => !previousItemsRef.current.includes(item));

      if (newItems.length > 0) {
        setNewItem(newItems[newItems.length - 1]);
        if (soundEnabled) {
          playSound('item');
        }
      }

      previousItemsRef.current = [...stats.items];
    }
  }, [stats.items, soundEnabled]);

  // Sound effects for achievements
  useEffect(() => {
    if (soundEnabled && newlyUnlockedAchievement) {
      playSound('achievement');
    }
  }, [newlyUnlockedAchievement, soundEnabled]);

  // Auto-save system
  useEffect(() => {
    if (autoSave && storyData && !loading) {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
      autoSaveTimeoutRef.current = setTimeout(() => {
        saveGameProgress({
          storyData,
          stats,
          unlockedAchievements
        });
        setAutoSaveMessage('บันทึกเกมแล้ว');
        setTimeout(() => setAutoSaveMessage(''), 2000);
        if (soundEnabled) {
          playSound('save');
        }
      }, 2000);
    }
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [storyData, stats, unlockedAchievements, autoSave, soundEnabled, loading]);

  // Setup window.gameHack
  useEffect(() => {
    window.gameHack = {
      getStats: () => ({ ...stats }),
      getUnlockedAchievements: () => [...unlockedAchievements],
      getStoryData: () => storyData ? { ...storyData } : null,
      getPlayerName: () => playerName,
      getHumorMode: () => humorMode,
      getAdaptiveStory: () => adaptiveStory,
      getRequirementNotMet: () => requirementNotMet,
      setStats: (newStats) => {
        if (typeof newStats === 'object' && newStats !== null) {
          setStats(newStats);
        }
      },
      setUnlockedAchievements: (newAchievements) => {
        if (Array.isArray(newAchievements)) {
          setUnlockedAchievements(newAchievements);
        }
      },
      setStoryData: (newStoryData) => {
        if (typeof newStoryData === 'object' && newStoryData !== null) {
          setStoryData(newStoryData);
        }
      },
      setRequirementNotMet: (newValue) => {
        if (typeof newValue === 'boolean') {
          setRequirementNotMet(newValue);
        }
      },
      navigate: (path) => {
        if (typeof path === 'string') {
          navigate(path);
        }
      },
      clearGame: () => {
        setStats({ xp: 0, items: [] });
        setUnlockedAchievements([]);
        setStoryData(null);
        setRequirementNotMet(false);
        clearSavedGame();
        initializeStory(playerName)
          .then(newStory => {
            setStoryData(newStory);
            const firstAchievement = unlockAchievement('first_steps', [], setUnlockedAchievements);
            if (firstAchievement) {
              setNewlyUnlockedAchievement(firstAchievement);
            }
          })
          .catch(err => {
            console.error('Failed to start new game after clear:', err);
          });
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
        } catch (err) {
          setError(err.message || 'Failed to reload the game.');
        } finally {
          setLoading(false);
        }
      },
      unlockAllAchievements: () => {
        const hardcodedIds = ['first_steps', 'helping_hand', 'knowledge_seeker', 'fun_lover', 'mini_game_master', 'collector'];
        setUnlockedAchievements(hardcodedIds);
      },
      giveXp: (amount) => {
        if (typeof amount === 'number' && amount > 0) {
          setStats(prevStats => ({
            ...prevStats,
            xp: prevStats.xp + amount
          }));
        }
      },
      giveItem: (itemName) => {
        if (typeof itemName === 'string' && itemName.trim() !== '') {
          setStats(prevStats => ({
            ...prevStats,
            items: [...prevStats.items, itemName.trim()]
          }));
        }
      },
      giveItems: (itemNames) => {
        if (Array.isArray(itemNames) && itemNames.every(name => typeof name === 'string' && name.trim() !== '')) {
          const trimmedItems = itemNames.map(name => name.trim());
          setStats(prevStats => ({
            ...prevStats,
            items: [...prevStats.items, ...trimmedItems]
          }));
        }
      },
      removeAllItems: () => {
        setStats(prevStats => ({
          ...prevStats,
          items: []
        }));
      },
      resetXp: () => {
        setStats(prevStats => ({
          ...prevStats,
          xp: 0
        }));
      },
      goToScene: async (sceneKey) => {
        if (typeof sceneKey === 'string') {
          setLoading(true);
          setError(null);
          try {
            const newStory = await initializeStory(playerName);
            setStoryData(newStory);
          } catch (err) {
            setError(err.message || `Failed to go to scene: ${sceneKey}`);
          } finally {
            setLoading(false);
          }
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
      },
      showHelp: () => { }
    };
    return () => {
      delete window.gameHack;
    };
  }, [stats, unlockedAchievements, storyData, playerName, humorMode, adaptiveStory, requirementNotMet, navigate]);

  const handleChoice = async (choiceId) => {
    if (!storyData || storyData.gameEnded) return;

    if (choiceId === 'go_home') {
      navigate('/');
      return;
    }

    if (choiceId === 'go_back_to_choices') {
      setRequirementNotMet(false);
      setLoading(false);
      if (soundEnabled) {
        playSound('click');
      }
      return;
    }

    if (choiceId === 'proceed_anyway') {
      setRequirementNotMet(false);
      try {
        setLoading(true);
        const previousChoiceId = storyData.context?.previousChoice;
        if (previousChoiceId) {
          const result = await makeChoice(previousChoiceId, storyData.context, { xp: 9999, items: ['bypass_item'] }, humorMode, adaptiveStory);
          setStoryData(result.story);
          if (result.stats) {
            setStats(prevStats => ({
              xp: prevStats.xp + (result.stats.xp || 0),
              items: [...prevStats.items, ...(result.stats.items || [])]
            }));
          }
        } else {
          const initialStory = await initializeStory(playerName);
          setStoryData(initialStory);
        }
      } catch (err) {
        setError('เกิดข้อผิดพลาดในการดำเนินเรื่องต่อ');
        setStoryData({
          text: "เกิดข้อผิดพลาด... แต่เรื่องราวก็ยังดำเนินต่อไป",
          choices: [
            { id: 'continue_anyway', text: "ดำเนินเรื่องต่อ" },
            { id: 'go_home', text: "กลับหน้าหลัก" }
          ],
          context: storyData.context
        });
      } finally {
        setLoading(false);
      }
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

      if (result.story) {
        result.story.context = {
          ...result.story.context,
          previousChoice: choiceId,
          lastChoiceText: storyData.choices.find(c => c.id === choiceId)?.text || choiceId
        };
      }

      if (result.gameEnded) {
        const endingDetails = determineEnding(result.endingKey);
        setStoryData({
          ...result.story,
          gameEnded: true,
          ending: endingDetails
        });
      } else if (result.requirementNotMet) {
        const enhancedChoices = [
          ...result.story.choices,
          { id: 'go_back_to_choices', text: "↩️ กลับไปเลือกใหม่" },
          { id: 'proceed_anyway', text: "⏭️ ดำเนินเรื่องต่อ (ข้ามข้อจำกัด)" }
        ];
        setStoryData({
          text: result.story.text,
          choices: enhancedChoices,
          context: { ...result.story.context, requirementFailed: true }
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
    clearSavedGame();
    setStats({ xp: 0, items: [] });
    setUnlockedAchievements([]);
    setRequirementNotMet(false);
    setLoading(true);
    setError(null);

    initializeStory(playerName)
      .then(initialStory => {
        setStoryData(initialStory);
        const firstAchievement = unlockAchievement('first_steps', [], setUnlockedAchievements);
        if (firstAchievement) {
          setNewlyUnlockedAchievement(firstAchievement);
        }
      })
      .catch(err => {
        setError(err.message || 'Failed to restart the game.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const closeAchievementNotification = () => {
    setNewlyUnlockedAchievement(null);
  };

  const closeItemNotification = () => {
    setNewItem(null);
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-2xl relative min-h-screen">
      <AnimatePresence>
        {newItem && (
          <ItemNotification item={newItem} onClose={closeItemNotification} />
        )}
      </AnimatePresence>

      {newlyUnlockedAchievement && (
        <AchievementNotification
          achievement={newlyUnlockedAchievement}
          onClose={closeAchievementNotification}
        />
      )}

      <ProgressModal
        isOpen={showProgress}
        onClose={() => setShowProgress(false)}
        stats={stats}
        unlockedAchievements={unlockedAchievements}
      />

      <div className="fixed bottom-4 right-4 z-10 flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0 md:top-20 md:right-4 md:flex-col md:space-y-2 md:space-x-0">
        <button
          onClick={toggleProgressModal}
          className="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
          aria-label="แสดงความคืบหน้า"
        >
          📊
        </button>
        <button
          onClick={() => setShowSettings(true)}
          className="bg-amber-600 text-white p-3 rounded-full shadow-lg hover:bg-amber-700 transition-colors"
          aria-label="ตั้งค่า"
        >
          ⚙️
        </button>
      </div>

      <AnimatePresence>
        {autoSaveMessage && (
          <AutoSaveNotification
            message={autoSaveMessage}
            onClose={() => setAutoSaveMessage('')}
          />
        )}
      </AnimatePresence>

      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />

      <AnimatePresence>
        {showAlert && (
          <ModernAlert
            type={showAlert.type}
            title={showAlert.title}
            message={showAlert.message}
            duration={showAlert.duration}
            onClose={() => setShowAlert(null)}
          />
        )}
      </AnimatePresence>

      <PlayerStats
        playerName={playerName}
        xp={stats.xp}
        unlockedAchievements={unlockedAchievements}
        onShowProgress={toggleProgressModal}
      />

      {error && (
        <ErrorAlert
          error={error}
          onClose={() => setError(null)}
        />
      )}

      {loading && !storyData && (
        <div className="container mx-auto px-4 py-16 text-center">
          <LoadingSpinner />
          <h2 className="text-2xl font-bold text-gray-800">กำลังโหลดเนื้อเรื่อง...</h2>
          <p className="text-gray-600 mt-2">AI กำลังแต่งเรื่องราวให้คุณ</p>
        </div>
      )}

      {!loading && !storyData && (
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
      )}

      {storyData && storyData.gameEnded && storyData.ending && (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">เกมจบ!</h1>
            <h2 className="text-2xl font-bold text-amber-700 mb-4">{storyData.ending.title}</h2>
            <div className={`p-6 rounded-lg mb-6 ${storyData.ending.type === 'good' ? 'bg-green-100 text-green-800' :
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
                className="bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors text-sm sm:text-base"
              >
                เล่นอีกครั้ง
              </button>
              <button
                onClick={() => navigate('/')}
                className="bg-gray-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-700 transition-colors text-sm sm:text-base"
              >
                กลับหน้าหลัก
              </button>
            </div>
          </div>
        </div>
      )}

      {storyData && !storyData.gameEnded && (
        <div className="bg-white rounded-xl shadow-lg p-5 sm:p-6 mb-6 transition-all duration-300">
          <StoryDisplay storyText={storyData.text} />
          <ChoiceButtons
            choices={storyData.choices}
            onChoose={handleChoice}
            loading={loading}
            requirementNotMet={requirementNotMet}
          />
        </div>
      )}

      {loading && storyData && (
        <div className="text-center py-4">
          <div className="text-2xl mb-2">⏳</div>
          <p className="text-gray-600">กำลังดำเนินเรื่อง...</p>
        </div>
      )}
    </div>
  );
};

export default Game;