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

  const playerName = localStorage.getItem('thaiGame_playerName') || 'นักเรียน';

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
    try {
      const result = await makeChoice(choiceId, storyData.context);

      if (result.stats) {
        setStats(prevStats => ({
          xp: prevStats.xp + (result.stats.xp || 0),
          items: [...prevStats.items, ...(result.stats.items || [])]
        }));
      }

      if (result.gameEnded) {
        const endingDetails = determineEnding(result.endingKey);
        setStoryData({
          text: result.story.text,
          choices: [],
          gameEnded: true,
          ending: endingDetails
        });
      } else {
        setStoryData(result.story);
      }

      saveGameProgress({
        storyData: result.story,
        stats: {
          xp: stats.xp + (result.stats?.xp || 0),
          items: [...stats.items, ...(result.stats?.items || [])]
        }
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
    <div className="container mx-auto px-4 py-6 max-w-2xl">
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