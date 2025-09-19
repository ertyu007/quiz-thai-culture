// src/components/ProgressModal.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import storyData from '../data/thaiGameStory.json';

const ProgressModal = ({ isOpen, onClose, stats, unlockedAchievements }) => {
  if (!isOpen) return null;

  // คำนวณความคืบหน้าของ Achievements
  const totalAchievements = Object.keys(storyData.achievements).length;
  const unlockedCount = unlockedAchievements.length;
  const achievementProgress = Math.round((unlockedCount / totalAchievements) * 100);

  // กลุ่มไอเท็มตามประเภท
  const itemCategories = {
    'ความรู้': ['ความรู้เกี่ยวกับประเพณี', 'ความรู้ด้านดนตรี', 'ความรู้ด้านประวัติศาสตร์', 'ปัญญา', 'ตำนานโบราณ', 'เบาะแสสมบัติ', 'แผนที่โบราณ', 'แผนที่สมบัติ', 'คัมภีร์เก่าแก่'],
    'ของใช้': ['บาตร', 'ผ้าคลุมบาตร', 'ผ้าพันแผล', 'น้ำมนต์', 'ตุ๊กตา', 'ของรางวัลเล็กน้อย', 'ของรางวัลยามค่ำ', 'ของที่ระลึก'],
    'ธรรมชาติ': ['ดอกไม้จันทน์', 'กลิ่นธูป'],
    'อาหาร': ['ขนมตาล', 'ความอร่อย', 'อาหารเช้า', 'อาหารค่ำ'],
    'ประสบการณ์': ['เสียงปรบมือ', 'ความสนุก', 'เหงื่อ', 'ความรับผิดชอบ', 'ความเมตตา', 'ความเข้าใจ', 'ความมั่นใจ', 'เสียงหัวเราะ', 'บทเรียน', 'บุญ', 'บุญพิเศษ', 'ความเพลิดเพลิน', 'ความสัมพันธ์', 'ความบันเทิง'],
    'พิเศษ': ['เหรียญรางวัล', 'เหรียญโบราณ', 'ถูกจับได้', 'รอยยิ้มของเด็ก']
  };

  // นับไอเท็มแต่ละประเภท
  const categoryCounts = {};
  Object.keys(itemCategories).forEach(category => {
    categoryCounts[category] = stats.items.filter(item => 
      itemCategories[category].includes(item)
    ).length;
  });

  // ไอเท็มทั้งหมดที่เก็บได้
  const uniqueItems = [...new Set(stats.items)];
  const totalUniqueItems = Object.values(itemCategories).flat().length;
  const itemProgress = Math.round((uniqueItems.length / totalUniqueItems) * 100);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          <div className="bg-amber-600 text-white p-4 flex justify-between items-center">
            <h2 className="text-xl font-bold">ความคืบหน้าและสถิติ</h2>
            <button
              onClick={onClose}
              className="text-white hover:text-amber-200 text-lg"
              aria-label="ปิด"
            >
              &times;
            </button>
          </div>

          <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
            {/* สถิติโดยรวม */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-amber-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-amber-700">{stats.xp}</div>
                <div className="text-sm text-amber-600">คะแนน XP</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-700">{unlockedCount}/{totalAchievements}</div>
                <div className="text-sm text-green-600">Achievements</div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-700">{uniqueItems.length}/{totalUniqueItems}</div>
                <div className="text-sm text-blue-600">ไอเท็มที่ไม่ซ้ำ</div>
              </div>
            </div>

            {/* ความคืบหน้า Achievements */}
            <div className="mb-6">
              <h3 className="text-lg font-bold mb-3 flex items-center">
                <span className="mr-2">🏆</span>
                ความคืบหน้า Achievements ({achievementProgress}%)
              </h3>
              <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                <div 
                  className="bg-amber-600 h-4 rounded-full transition-all duration-500"
                  style={{ width: `${achievementProgress}%` }}
                ></div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                {Object.entries(storyData.achievements).map(([id, achievement]) => (
                  <div
                    key={id}
                    className={`p-3 rounded-lg border ${unlockedAchievements.includes(id) 
                      ? 'bg-green-50 border-green-300' 
                      : 'bg-gray-50 border-gray-300 opacity-70'}`}
                  >
                    <div className="flex items-center">
                      <span className="text-xl mr-2">{achievement.icon}</span>
                      <div>
                        <div className="font-semibold">{achievement.title}</div>
                        <div className="text-sm text-gray-600">{achievement.description}</div>
                        <div className={`text-xs mt-1 ${unlockedAchievements.includes(id) ? 'text-green-600' : 'text-gray-500'}`}>
                          {unlockedAchievements.includes(id) ? '✅ ปลดล็อคแล้ว' : '🔒 ยังไม่ได้ปลดล็อค'}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ความคืบหน้าไอเท็ม */}
            <div className="mb-6">
              <h3 className="text-lg font-bold mb-3 flex items-center">
                <span className="mr-2">🎒</span>
                ความคืบหน้าสะสมไอเท็ม ({itemProgress}%)
              </h3>
              <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                <div 
                  className="bg-blue-600 h-4 rounded-full transition-all duration-500"
                  style={{ width: `${itemProgress}%` }}
                ></div>
              </div>

              {/* ประเภทไอเท็ม */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                {Object.entries(categoryCounts).map(([category, count]) => {
                  const totalInCategory = itemCategories[category].length;
                  const progress = Math.round((count / totalInCategory) * 100);
                  
                  return (
                    <div key={category} className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold">{category}</span>
                        <span className="text-sm text-gray-600">{count}/{totalInCategory}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* รายการไอเท็มทั้งหมด */}
              <div className="mt-6">
                <h4 className="font-bold mb-3">ไอเท็มทั้งหมดที่เก็บได้:</h4>
                <div className="flex flex-wrap gap-2">
                  {uniqueItems.length > 0 ? (
                    uniqueItems.map((item, index) => (
                      <span
                        key={index}
                        className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm"
                      >
                        {item}
                      </span>
                    ))
                  ) : (
                    <p className="text-gray-500">ยังไม่มีไอเท็ม</p>
                  )}
                </div>
              </div>
            </div>

            {/* สถิติการเล่น */}
            <div>
              <h3 className="text-lg font-bold mb-3 flex items-center">
                <span className="mr-2">📊</span>
                สถิติการเล่น
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-purple-50 p-3 rounded-lg">
                  <div className="text-lg font-bold text-purple-700">
                    {stats.items.length}
                  </div>
                  <div className="text-sm text-purple-600">ไอเท็มทั้งหมด (รวมซ้ำ)</div>
                </div>
                <div className="bg-indigo-50 p-3 rounded-lg">
                  <div className="text-lg font-bold text-indigo-700">
                    {Math.round((uniqueItems.length / stats.items.length) * 100) || 0}%
                  </div>
                  <div className="text-sm text-indigo-600">ความหลากหลายของไอเท็ม</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProgressModal;