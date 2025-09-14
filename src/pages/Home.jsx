import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          เกมวัฒนธรรมไทย
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          ทดสอบความรู้เกี่ยวกับวัฒนธรรมไทย พร้อม AI ช่วยสอนและอธิบายทุกคำถาม
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
          <div className="text-4xl mb-4">📚</div>
          <h3 className="text-xl font-bold mb-2">คำถามหลากหลาย</h3>
          <p className="text-gray-600">
            ครอบคลุมศิลปะ ประเพณี อาหาร ภาษา และสถานที่สำคัญของไทย
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
          <div className="text-4xl mb-4">🤖</div>
          <h3 className="text-xl font-bold mb-2">AI ช่วยสอน</h3>
          <p className="text-gray-600">
            ได้รับคำอธิบายทันทีเมื่อตอบผิด และสามารถถามคำถามเพิ่มเติมได้
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
          <div className="text-4xl mb-4">🔄</div>
          <h3 className="text-xl font-bold mb-2">คำถามไม่ซ้ำ</h3>
          <p className="text-gray-600">
            AI สร้างคำถามใหม่ทุกครั้ง ทำให้เล่นกี่รอบก็ไม่เบื่อ
          </p>
        </div>
      </div>

      <div className="text-center">
        <Link
          to="/quiz"
          className="inline-block bg-gradient-to-r from-thai-green to-thai-blue text-white font-bold py-4 px-8 rounded-full text-lg hover:from-green-600 hover:to-blue-700 transition-all transform hover:scale-105 shadow-lg"
        >
          เริ่มเล่นเลย!
        </Link>
      </div>

      <div className="mt-16 bg-gradient-to-r from-thai-blue to-thai-red rounded-2xl p-8 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">ทำไมต้องเล่นเกมนี้?</h2>
          <p className="text-lg mb-6">
            ไม่ใช่แค่เกมทั่วไป แต่เป็นเครื่องมือเรียนรู้วัฒนธรรมไทยอย่างสนุกสนาน
            ทุกคำถามมี AI ช่วยอธิบายให้เข้าใจลึกซึ้งยิ่งขึ้น
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <span className="bg-white bg-opacity-20 px-4 py-2 rounded-full">เรียนรู้ไปด้วยเล่น</span>
            <span className="bg-white bg-opacity-20 px-4 py-2 rounded-full">AI อธิบายละเอียด</span>
            <span className="bg-white bg-opacity-20 px-4 py-2 rounded-full">คำถามไม่ซ้ำ</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;