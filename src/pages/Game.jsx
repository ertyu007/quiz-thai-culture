// src/pages/Game.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  initializeStory,
  makeChoice,
  determineEnding,
  prepareHumorMode,
  prepareAdaptiveStory
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
  const [requirementNotMet, setRequirementNotMet] = useState(false); // เพิ่ม state สำหรับ requirementNotMet

  const playerName = localStorage.getItem('thaiGame_playerName') || 'นักเรียน';
  const humorMode = localStorage.getItem('thaiGame_humorMode') === 'true';
  const adaptiveStory = localStorage.getItem('thaiGame_adaptiveStory') === 'true';

  useEffect(() => {
    const startGame = async () => {
      try {
        setError(null);
        prepareHumorMode(humorMode);
        prepareAdaptiveStory(adaptiveStory, stats);

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
  }, [playerName, humorMode, adaptiveStory]); // เพิ่ม dependencies

  const handleChoice = async (choiceId) => {
    if (!storyData || storyData.gameEnded) return;

    // จัดการตัวเลือกพิเศษ
    if (choiceId === 'go_home') {
      navigate('/');
      return;
    }

    if (choiceId === 'try_again' || choiceId === 'continue_anyway') {
      setLoading(true);
      setError(null);
      setRequirementNotMet(false); // รีเซ็ต requirementNotMet
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

    // ถ้าอยู่ในสถานะ requirementNotMet และเลือก "กลับไปเลือกใหม่"
    if (requirementNotMet && choiceId === 'go_back_to_choices') {
      // โหลด scene เดิมอีกครั้ง (สมมุติว่ามี context ของ scene เดิม)
      const previousSceneKey = storyData.context?.previousScene || 'temple_courtyard_morning';
      // สมมุติว่าเรามีข้อมูล scene ทั้งหมดใน memory (หรือสามารถโหลดใหม่ได้)
      // สำหรับเวอร์ชันนี้ เราจะใช้วิธีง่ายๆ คือ โหลด scene เดิมอีกครั้ง
      // (ในทางปฏิบัติ คุณอาจต้องเก็บ state ของ scene ก่อนหน้าไว้)
      
      // ตัวอย่าง: ถ้า scene เดิมคือ temple_market_morning
      if (previousSceneKey === 'temple_market_morning') {
        const initialStory = await initializeStory(playerName);
        setStoryData(initialStory);
        setRequirementNotMet(false); // รีเซ็ต requirementNotMet
        return;
      }
      
      // ถ้าไม่ใช่ scene ที่รู้จัก ให้ไปที่ scene เริ่มต้น
      const initialStory = await initializeStory(playerName);
      setStoryData(initialStory);
      setRequirementNotMet(false); // รีเซ็ต requirementNotMet
      return;
    }

    // ถ้าอยู่ในสถานะ requirementNotMet และเลือก "ดำเนินเรื่องต่อ"
    if (requirementNotMet && choiceId === 'proceed_anyway') {
      // ดำเนินเรื่องต่อแบบข้ามเงื่อนไข
      // สมมุติว่าเรามี nextScene ที่ควรไปต่อ
      const nextSceneKey = storyData.context?.nextSceneIfSkipped || 'temple_courtyard_afternoon';
      // สมมุติว่าเรามีข้อมูล scene ทั้งหมดใน memory (หรือสามารถโหลดใหม่ได้)
      // สำหรับเวอร์ชันนี้ เราจะใช้วิธีง่ายๆ คือ โหลด scene ถัดไป
      
      // ตัวอย่าง: ถ้า nextScene คือ temple_courtyard_afternoon
      if (nextSceneKey === 'temple_courtyard_afternoon') {
        const nextStory = {
          text: "คุณเลือกที่จะดำเนินเรื่องต่อโดยข้ามเงื่อนไข... บรรยากาศรอบตัวคุณค่อยๆ เปลี่ยนไป",
          choices: [
            { id: 'help_find_toy', text: "ช่วยเด็กคนนั้นตามหาของเล่น" },
            { id: 'comfort_child', text: "ปลอบใจเด็กและพาไปเล่นอย่างอื่น" },
            { id: 'continue_duty', text: "บอกเด็กให้ถามแม่ และไปช่วยงานต่อ" }
          ],
          context: { scene: "temple_courtyard_afternoon", playerName: playerName }
        };
        setStoryData(nextStory);
        setRequirementNotMet(false); // รีเซ็ต requirementNotMet
        return;
      }
      
      // ถ้าไม่ใช่ scene ที่รู้จัก ให้ไปที่ scene เริ่มต้น
      const initialStory = await initializeStory(playerName);
      setStoryData(initialStory);
      setRequirementNotMet(false); // รีเซ็ต requirementNotMet
      return;
    }

    setLoading(true);
    setError(null);
    setNewlyUnlockedAchievement(null);
    setRequirementNotMet(false); // รีเซ็ต requirementNotMet
    try {
      const result = await makeChoice(choiceId, storyData.context, stats, humorMode, adaptiveStory);

      // --- จัดการ requirementNotMet ---
      if (result.requirementNotMet) {
        console.log('[Game] Requirement not met for choice:', choiceId);
        setStoryData({
          text: result.story.text, // ข้อความที่แจ้งว่า "คุณยังไม่มีคุณสมบัติที่จำเป็น..."
          choices: [
            { id: 'go_back_to_choices', text: "กลับไปเลือกใหม่" },
            { id: 'proceed_anyway', text: "ดำเนินเรื่องต่อ (ข้ามเงื่อนไข)" }
          ],
          context: { ...storyData.context, previousScene: storyData.context?.scene } // เก็บ scene เดิมไว้
        });
        setRequirementNotMet(true); // ตั้งค่า requirementNotMet เป็น true
        setLoading(false);
        return; // หยุดการทำงานที่นี่
      }
      // --- สิ้นสุดการจัดการ requirementNotMet ---

      if (result.stats) {
        setStats(prevStats => ({
          xp: prevStats.xp + (result.stats.xp || 0),
          items: [...prevStats.items, ...(result.stats.items || [])]
        }));
        checkAndUnlockAchievements(prevStats => ({
          xp: prevStats.xp + (result.stats.xp || 0),
          items: [...prevStats.items, ...(result.stats.items || [])]
        })(stats));
      }

      if (result.gameEnded) {
        const endingDetails = determineEnding(result.endingKey);
        setStoryData({
          ...result.story,
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
    if (!currentStats || !Array.isArray(currentStats.items)) {
       console.warn("[Game] Invalid stats provided to checkAndUnlockAchievements:", currentStats);
       return;
    }

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
          requirementNotMet={requirementNotMet} // ส่ง prop ไปยัง ChoiceButtons
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