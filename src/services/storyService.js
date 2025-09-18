// // src/services/storyService.js

// // --- Import สำหรับนับ Token ---
// // import { encoding_for_model } from "js-tiktoken"; // 1. Import library
// import { getEncoding } from "js-tiktoken";

// const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

// // --- ตั้งค่า Encoder สำหรับนับ Token ---
// // 2. สร้าง encoder (ทดลองใช้ 'cl100k_base' ซึ่งใช้กับโมเดลหลายตัวได้ดี)
// const enc = getEncoding("cl100k_base");

// // --- การจัดการ API Key ---
// const getApiKey = () => {
//   const apiKey = process.env.REACT_APP_GROQ_API_KEY;
//   if (!apiKey) {
//     console.error('CRITICAL ERROR: Groq API Key (REACT_APP_GROQ_API_KEY) is not set.');
//   }
//   return apiKey;
// };

// // --- ตัวอย่างเนื้อหาสำรอง ---
// const DEFAULT_OPENING_STORY = {
//   text: "เช้าวันสงกรานต์ แสงแดดอ่อนๆ ส่องผ่านต้นไม้ในวัดแห่งหนึ่ง คุณ {playerName} ลุกขึ้นนั่งบนพื้นคูหา ได้ยินเสียงเด็กๆ หัวเราะเล่นอยู่ไกลๆ และกลิ่นดอกไม้จันทน์หอมหวนลอยมา ครูบาอาจารย์เดินผ่านมาพร้อมยิ้มแย้ม ท่านชี้ไปที่มุมลานวัดที่กำลังจะจัดงาน \"หนุ่มหาบังเกง\" ซึ่งเป็นงานสำคัญของวัดในปีนี้",
//   choices: [
//     { id: 'join_preparation', text: "ขอไปช่วยจัดโต๊ะเครื่องเสวย" },
//     { id: 'ask_about_duty', text: "ไปถามครูบาอาจารย์ว่าหนูมีหน้าที่อะไรบ้าง" },
//     { id: 'meet_friends', text: "ไปหาเพื่อนๆ ที่กำลังซ้อมรำวงอยู่" }
//   ],
//   context: { scene: "temple_courtyard_morning", playerName: "{playerName}" }
// };

// const DEFAULT_CHOICE_RESPONSE = (choiceId, context) => ({
//   story: {
//     text: "คุณเลือกที่จะ " + (context?.lastChoiceText || "ดำเนินการตามที่คิดไว้") + " บรรยากาศรอบตัวคุณค่อยๆ เปลี่ยนไป...",
//     choices: [
//       { id: 'continue_story_1', text: "มองไปรอบๆ วัด" },
//       { id: 'continue_story_2', text: "ไปหาครูบาอาจารย์เพื่อขอคำแนะนำ" }
//     ],
//     context: { ...context, previousChoice: choiceId, lastChoiceText: context?.lastChoiceText || "ทำสิ่งที่เลือก" }
//   },
//   stats: { xp: 2, items: [] },
//   gameEnded: false,
//   ending: null
// });

// // --- ระบบ Ending ---
// const ITEM_CATEGORIES = {
//   food: ["ข้าว", "ขนม", "ผลไม้", "เครื่องปรุง", "อาหาร"],
//   music: ["ขิม", "ระนาด", "กลอง", "เครื่องดนตรี", "เพลง"],
//   ritual: ["ธูป", "เทียน", "ดอกไม้", "ผ้าพันแผล", "พาน"],
//   knowledge: ["หนังสือ", "พระคัมภีร์", "ตำรา", "สุภาษิต"],
//   play: ["ลูกบอล", "ของเล่น", "ไม้ตี", "เชือก"]
// };

// const analyzeItems = (items) => {
//   const analysis = {
//     food: 0, music: 0, ritual: 0, knowledge: 0, play: 0
//   };
//   items.forEach(item => {
//     for (const [category, keywords] of Object.entries(ITEM_CATEGORIES)) {
//       if (keywords.some(keyword => item.includes(keyword))) {
//         analysis[category]++;
//       }
//     }
//   });
//   return analysis;
// };

// export const determineEnding = (stats, totalChoicesMade) => {
//   const { xp, items } = stats;
//   const itemAnalysis = analyzeItems(items);
//   const accuracy = totalChoicesMade > 0 ? xp / (totalChoicesMade * 15) : 0;
//   let dominantInterest = 'general';
//   let maxItems = 0;
//   for (const [category, count] of Object.entries(itemAnalysis)) {
//     if (count > maxItems) {
//       maxItems = count;
//       dominantInterest = category;
//     }
//   }

//   if (accuracy >= 0.75) {
//     switch(dominantInterest) {
//       case 'food': return { type: "good", title: "เชฟอาหารวัฒนธรรม", text: "คุณได้เรียนรู้และจดจำรายละเอียดเกี่ยวกับอาหารไทยได้อย่างยอดเยี่ยม! คุณได้รับตำแหน่ง \"เชฟอาหารวัฒนธรรม\" แล้ว" };
//       case 'music': return { type: "good", title: "นักดนตรีวัฒนธรรม", text: "คุณมีความรู้เกี่ยวกับดนตรีไทยอย่างลึกซึ้ง คุณได้รับตำแหน่ง \"นักดนตรีวัฒนธรรม\" แล้ว" };
//       case 'ritual': return { type: "good", title: "พิธีกรวัฒนธรรม", text: "คุณเข้าใจพิธีกรรมและประเพณีไทยอย่างถ่องแท้ คุณได้รับตำแหน่ง \"พิธีกรวัฒนธรรม\" แล้ว" };
//       case 'knowledge': return { type: "good", title: "ครูภูมิปัญญาไทย", text: "คุณได้เรียนรู้วัฒนธรรมไทยอย่างลึกซึ้งและสามารถตอบคำถามได้อย่างถูกต้องมากที่สุด! คุณได้รับตำแหน่ง \"ครูภูมิปัญญาไทย\" แล้ว" };
//       default: return { type: "good", title: "นักเรียนผู้มีความรู้", text: "คุณมีความรู้เกี่ยวกับวัฒนธรรมไทยในระดับดีเยี่ยม คุณได้รับตำแหน่ง \"นักเรียนผู้มีความรู้\" แล้ว" };
//     }
//   } else if (accuracy >= 0.4) {
//     return { type: "neutral", title: "นักเรียนผู้มีความรู้", text: "คุณมีความรู้เกี่ยวกับวัฒนธรรมไทยในระดับดี ยังมีอีกมากมายให้เรียนรู้ แต่คุณก้าวไปข้างหน้าได้ดีแล้ว" };
//   } else {
//     switch(dominantInterest) {
//       case 'play': return { type: "bad", title: "นักเล่นซน", text: "คุณมีแนวโน้มที่จะเล่นมากกว่าเรียน แต่ไม่เป็นไร! วัฒนธรรมไทยมีมากมายให้ค้นคว้า ลองกลับมาเรียนรู้อีกครั้งนะ" };
//       default: return { type: "bad", title: "นักเรียนที่ต้องพัฒนา", text: "คุณยังต้องเรียนรู้เพิ่มเติมเกี่ยวกับวัฒนธรรมไทย แต่ไม่เป็นไร! ทุกการเริ่มต้นเป็นเรื่องดี ลองกลับมาเรียนรู้อีกครั้งนะ" };
//     }
//   }
// };

// // --- ฟังก์ชันช่วยสำหรับ API และการนับ Token ---
// // 3. ฟังก์ชันช่วยในการนับ Token จาก array ของ messages
// const countPromptTokens = (messages) => {
//   try {
//     // รวม content ของทุก message
//     const fullPrompt = messages.map(msg => msg.content).join("\n\n");
//     return enc.encode(fullPrompt).length;
//   } catch (e) {
//     console.warn("[Token Log] Could not estimate prompt tokens:", e);
//     return 0; // ถ้านับไม่ได้ ให้คืน 0
//   }
// };

// const callGroqAPI = async (messages, maxTokens) => {
//   const apiKey = getApiKey();
//   if (!apiKey) {
//     throw new Error('API Key is missing');
//   }

//   // 4. นับ Token ที่ใช้ใน Prompt
//   const promptTokens = countPromptTokens(messages);
//   console.log(`[Token Log] Estimated prompt tokens: ${promptTokens}`);

//   try {
//     const response = await fetch(GROQ_API_URL, {
//       method: 'POST',
//       headers: {
//         'Authorization': `Bearer ${apiKey}`,
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify({
//         model: "llama-3.1-8b-instant", // ใช้โมเดลที่เบากว่าเพื่อประหยัด Token
//         temperature: 0.7,
//         max_tokens: maxTokens,
//         messages: messages
//       })
//     });

//     if (!response.ok) {
//       const errorText = await response.text().catch(() => 'Could not read error body');
//       console.error(`[StoryService] Groq API Error (${response.status}):`, errorText);
//       if (response.status === 429) {
//         throw new Error(`Rate limit reached. Please try again later. Details: ${errorText.substring(0, 200)}...`);
//       }
//       throw new Error(`API request failed (${response.status}). Details: ${errorText.substring(0, 200)}...`);
//     }

//     const result = await response.json();
//     if (!result.choices || !result.choices[0]?.message?.content) {
//       throw new Error('Groq API returned unexpected response structure');
//     }

//     // 5. นับ Token ที่ได้รับกลับมา (Completion)
//     let completionTokens = 0;
//     const completionText = result.choices[0].message.content;
//     try {
//       completionTokens = enc.encode(completionText).length;
//       console.log(`[Token Log] Estimated completion tokens: ${completionTokens}`);
//     } catch (e) {
//       console.warn("[Token Log] Could not estimate completion tokens:", e);
//     }

//     // 6. Log สรุป Token ที่ใช้
//     const totalTokens = promptTokens + completionTokens;
//     console.log(`[Token Log] Estimated total tokens for this call: ${totalTokens}`);

//     // 7. ส่งข้อมูลทั้งหมดกลับ
//     return {
//       content: completionText,
//       promptTokens: promptTokens,
//       completionTokens: completionTokens,
//       totalTokens: totalTokens
//     };

//   } catch (error) {
//     if (error.name === 'TypeError' || error.message.includes('fetch')) {
//        console.error('[StoryService] Network or Fetch Error:', error);
//        throw new Error('Failed to connect to the story service. Please check your internet connection.');
//     }
//     throw error;
//   }
// };

// const parseAndValidateJSON = (rawResponse) => {
//   let jsonString = '';
//   const jsonBlockMatch = rawResponse.match(/```(?:json)?\s*({.*?})\s*```/s);
//   if (jsonBlockMatch) {
//     jsonString = jsonBlockMatch[1];
//   } else {
//     const jsonStart = rawResponse.indexOf('{');
//     const jsonEnd = rawResponse.lastIndexOf('}') + 1;
//     if (jsonStart !== -1 && jsonEnd > jsonStart) {
//       jsonString = rawResponse.substring(jsonStart, jsonEnd);
//     } else {
//       throw new Error('No valid JSON structure found in AI response');
//     }
//   }

//   let parsedData;
//   try {
//     parsedData = JSON.parse(jsonString);
//   } catch (parseError) {
//     console.error('[StoryService] JSON Parse Error:', parseError.message, 'Raw String:', jsonString.substring(0, 200) + '...');
//     throw new Error(`Failed to parse AI response as JSON: ${parseError.message}`);
//   }

//   const suspiciousWords = ['numm', '村', 'null', 'undefined', 'NaN'];
//   const isSuspicious = suspiciousWords.some(word =>
//     JSON.stringify(parsedData).includes(word)
//   );
//   if (isSuspicious) {
//     console.warn('[StoryService] Suspicious content detected in AI response.');
//     throw new Error('AI response contains suspicious or invalid content.');
//   }

//   return parsedData;
// };

// // --- ฟังก์ชันหลัก ---
// export const initializeStory = async (playerName) => {
//   try {
//     console.log(`[StoryService] Initializing story for player: ${playerName}`);
//     // 8. รับข้อมูลที่มี token count กลับมา
//     const aiResponseData = await callGroqAPI([
//       {
//         role: "system",
//         content: `คุณเป็นนักเขียนเนื้อเรื่องผจญภัยในสมัยโบราณของไทย (รัชกาลที่ 5-6) ชื่อเสียงเลื่องลือว่าเขียนเรื่องราวที่สมจริงและมีชีวิตชีวา

// **หน้าที่ของคุณ:**
// 1. สร้างฉากเปิดเกมสำหรับนักเรียนไทยในสมัยโบราณ
// 2. ให้บริบทของสถานที่และสถานการณ์ (เช่น วัด, งานสงกรานต์, โรงเรียนวัด)
// 3. สร้างตัวเลือก 2-3 ตัวเลือกที่เป็นธรรมชาติและเกี่ยวข้องกับวัฒนธรรมไทย
// 4. ตอบเป็น JSON ตามรูปแบบที่กำหนด เท่านั้น

// **คำเตือนสำคัญ (ห้ามละเมิด):**
// *   **ห้ามใช้คำว่า "numm", "村", "null", "undefined", "NaN", หรือคำที่ไม่มีความหมาย**
// *   **ห้ามตอบด้วยภาษาอังกฤษหรือภาษาต่างประเทศ ต้องใช้ภาษาไทยเท่านั้น**
// *   **ห้ามมีข้อความแปลกๆ หรือไม่เกี่ยวข้องกับวัฒนธรรมไทยในสมัยโบราณ**
// *   **ห้ามใช้ตัวอักษรหรือสัญลักษณ์แปลกๆ ที่ไม่ใช่ภาษาไทย**
// *   **ห้ามสร้าง JSON ที่ผิดรูปแบบหรือไม่สมบูรณ์**
// *   **ห้ามใส่ markdown, ตัวหนา, หรือรูปแบบใดๆ ในข้อความ**
// *   **ห้ามใส่คำอธิบายใดๆ นอกเหนือจากรูปแบบ JSON**

// **เนื้อเรื่องต้อง:**
// *   เกี่ยวข้องกับวัฒนธรรมไทยในสมัยโบราณ (รัชกาลที่ 5-6)
// *   ใช้คำสุภาพและเหมาะสมกับนักเรียน
// *   สร้างความรู้สึกตื่นเต้นและความอยากรู้อยากเห็น
// *   ตัวเลือกต้องเป็นธรรมชาติและนำไปสู่เส้นเรื่องที่น่าสนใจ
// *   ใช้ชื่อผู้เล่น "${playerName}" ในเนื้อเรื่องอย่างเหมาะสม

// **ตัวอย่างรูปแบบคำตอบที่ถูกต้อง (ห้ามตอบนอกจากรูปแบบนี้):**
// {
//   "text": "เช้าวันสงกรานต์ แสงแดดอ่อนๆ ส่องผ่านต้นไม้ในวัดแห่งหนึ่ง... คุณ ${playerName} กำลังทำอะไรอยู่?",
//   "choices": [
//     {"id": "choice1", "text": "ไปช่วยจัดโต๊ะเครื่องเสวย"},
//     {"id": "choice2", "text": "ไปถามครูบาอาจารย์ว่าหนูมีหน้าที่อะไรบ้าง"},
//     {"id": "choice3", "text": "ไปหาเพื่อนๆ ที่กำลังซ้อมรำวงอยู่"}
//   ],
//   "context": {"scene": "temple_courtyard_morning", "playerName": "${playerName}"}
// }`
//       },
//       {
//         role: "user",
//         content: `สร้างฉากเปิดเกมสำหรับนักเรียนไทยชื่อ "${playerName}" ในสมัยรัชกาลที่ 5-6 ซึ่งต้องไปช่วยงานวัดในงานประเพือนสงกรานต์ ตอบเป็น JSON ตามรูปแบบที่ระบุไว้ในระบบเท่านั้น ห้ามมีคำแปลกๆ หรือภาษาต่างประเทศ`
//       }
//     ], 800); // ลด max_tokens จาก 1000 เป็น 800

//     const parsedData = parseAndValidateJSON(aiResponseData.content);

//     if (typeof parsedData.text !== 'string' || !Array.isArray(parsedData.choices)) {
//       throw new Error('Parsed JSON has invalid structure');
//     }

//     const validChoices = parsedData.choices.filter(c => c.id && c.text).slice(0, 3);
//     if (validChoices.length < 2) {
//       throw new Error('AI response has insufficient valid choices');
//     }

//     console.log(`[Game Log] initializeStory used ~${aiResponseData.totalTokens} tokens.`);

//     return {
//       text: parsedData.text,
//       choices: validChoices,
//       context: parsedData.context || { playerName },
//       // เพิ่มข้อมูล token ไปด้วย (ถ้าต้องการนำไปใช้ต่อ)
//       tokenUsage: {
//         prompt: aiResponseData.promptTokens,
//         completion: aiResponseData.completionTokens,
//         total: aiResponseData.totalTokens
//       }
//     };

//   } catch (error) {
//     console.error('[StoryService] Error in initializeStory:', error);
//     return {
//       ...DEFAULT_OPENING_STORY,
//       text: DEFAULT_OPENING_STORY.text.replace('{playerName}', playerName),
//       context: { ...DEFAULT_OPENING_STORY.context, playerName },
//       // กรณี fallback ไม่มีการใช้ token จาก API
//       tokenUsage: { prompt: 0, completion: 0, total: 0 }
//     };
//   }
// };

// export const makeChoice = async (choiceId, context, humorMode = false, adaptiveStory = true) => {
//   try {
//     console.log(`[StoryService] Making choice: ${choiceId}`);
//     const aiResponseData = await callGroqAPI([
//       {
//         role: "system",
//         content: `คุณเป็นนักเขียนเนื้อเรื่องผจญภัยในสมัยโบราณของไทย (รัชกาลที่ 5-6)

// **หน้าที่ของคุณ:**
// 1. ดำเนินเรื่องตามตัวเลือกของผู้เล่น
// 2. สร้างเนื้อเรื่องที่มีตัวเลือก 2-3 ตัวเลือก
// 3. ให้ผลลัพธ์ (XP, ไอเทม) ที่เหมาะสมกับการเลือก
// 4. ติดตามเส้นเรื่องตามบริบทก่อนหน้า
// 5. ตอบเป็น JSON ตามรูปแบบที่กำหนด เท่านั้น

// **คำเตือนสำคัญ (ห้ามละเมิด):**
// *   **ห้ามใช้คำว่า "numm", "村", "null", "undefined", "NaN", หรือคำที่ไม่มีความหมาย**
// *   **ห้ามตอบด้วยภาษาอังกฤษหรือภาษาต่างประเทศ ต้องใช้ภาษาไทยเท่านั้น**
// *   **ห้ามมีข้อความแปลกๆ หรือไม่เกี่ยวข้องกับวัฒนธรรมไทย**
// *   **ห้ามใช้ตัวอักษรหรือสัญลักษณ์แปลกๆ ที่ไม่ใช่ภาษาไทย**
// *   **ห้ามสร้าง JSON ที่ผิดรูปแบบหรือไม่สมบูรณ์**
// *   **ห้ามใส่ markdown, ตัวหนา, หรือรูปแบบใดๆ ในข้อความ**
// *   **ห้ามใส่คำอธิบายใดๆ นอกเหนือจากรูปแบบ JSON**

// **เนื้อเรื่องต้อง:**
// *   เกี่ยวข้องกับวัฒนธรรมไทยในสมัยโบราณ
// *   ใช้คำสุภาพและเหมาะสมกับนักเรียน
// *   ต่อเนื่องจากบริบทก่อนหน้า
// *   สร้างความสนุกสนานและให้ความรู้
// *   ตัวเลือกต้องนำไปสู่เส้นเรื่องที่น่าสนใจ
// *   ผลลัพธ์ XP (0-20) และไอเทมควรเหมาะสมกับการเลือก

// **คำแนะนำเพิ่มเติม (สำคัญ):**
// *   คุณสามารถตัดสินใจว่าเรื่องราวยังไม่จบ หรือควรจบแล้ว
// *   ถ้าเรื่องควรจบ ให้กำหนด "gameEnded": true
// *   คุณไม่จำเป็นต้องกำหนด "ending" object เอง ระบบเกมจะคำนวณให้

// **ตัวอย่างรูปแบบคำตอบที่ถูกต้อง (ห้ามตอบนอกจากรูปแบบนี้):**
// {
//   "story": {
//     "text": "คุณเลือกที่จะ... และเกิดอะไรขึ้นต่อ?",
//     "choices": [
//       {"id": "choice1", "text": "ตัวเลือก 1"},
//       {"id": "choice2", "text": "ตัวเลือก 2"}
//     ],
//     "context": {"scene": "next_scene", "playerName": "ชื่อผู้เล่น", "previousChoice": "..."}
//   },
//   "stats": {
//     "xp": 10,
//     "items": ["ผ้าพันแผล", "ขันน้ำ"]
//   },
//   "gameEnded": false // หรือ true ถ้าเรื่องจบ
// }`
//       },
//       {
//         role: "user",
//         content: `ดำเนินเรื่องต่อจาก context: ${JSON.stringify(context)}\n\nผู้เล่นเลือก: ${choiceId}\n\nตอบเป็น JSON ตามรูปแบบที่ระบุไว้ในระบบเท่านั้น ห้ามมีคำแปลกๆ หรือภาษาต่างประเทศ`
//       }
//     ], 1000); // ลด max_tokens จาก 1200 เป็น 1000

//     const parsedData = parseAndValidateJSON(aiResponseData.content);

//     if (!parsedData.story || typeof parsedData.story.text !== 'string' || !Array.isArray(parsedData.story.choices) ||
//         !parsedData.stats || typeof parsedData.stats.xp !== 'number' || !Array.isArray(parsedData.stats.items)) {
//       throw new Error('Parsed JSON has invalid structure');
//     }

//     const validChoices = parsedData.story.choices.filter(c => c.id && c.text).slice(0, 3);
//     if (validChoices.length < 2) {
//       throw new Error('AI response has insufficient valid choices');
//     }

//     const validStats = {
//       xp: Math.max(0, Math.min(50, Math.round(parsedData.stats.xp || 0))),
//       items: Array.isArray(parsedData.stats.items) ? parsedData.stats.items.slice(0, 5) : []
//     };

//     console.log(`[Game Log] makeChoice used ~${aiResponseData.totalTokens} tokens.`);

//     return {
//       story: {
//         text: parsedData.story.text,
//         choices: validChoices,
//         context: parsedData.story.context || context
//       },
//       stats: validStats,
//       gameEnded: Boolean(parsedData.gameEnded),
//       // เพิ่มข้อมูล token ไปด้วย
//       tokenUsage: {
//         prompt: aiResponseData.promptTokens,
//         completion: aiResponseData.completionTokens,
//         total: aiResponseData.totalTokens
//       }
//     };

//   } catch (error) {
//     console.error('[StoryService] Error in makeChoice:', error);
//     return {
//       ...DEFAULT_CHOICE_RESPONSE(choiceId, context),
//       // กรณี fallback ไม่มีการใช้ token จาก API
//       tokenUsage: { prompt: 0, completion: 0, total: 0 }
//     };
//   }
// };

// // --- ฟีเจอร์เพิ่มเติม (ถ้ามี) ---
// // สามารถเพิ่มฟังก์ชัน generateDynamicQuiz, generateRandomEvent, getHumorExplanation ได้ที่นี่
// // แต่เพื่อประหยัด token ขอ comment ไว้ก่อน
// /*
// export const generateDynamicQuiz = async (category, difficulty = "medium") => { ... }
// export const generateRandomEvent = async (currentContext, currentStats) => { ... }
// export const getHumorExplanation = async (question, userAnswer, correctAnswer, baseExplanation) => { ... }
// export const getAdaptiveStoryPath = (stats) => { ... }
// */


// src/services/storyService.js
// บริการสำหรับจัดการเนื้อเรื่องโดยใช้ข้อมูลจากไฟล์ JSON แทน Groq API
// src/services/storyService.js
// บริการสำหรับจัดการเนื้อเรื่องโดยใช้ข้อมูลจากไฟล์ JSON แทน Groq API
// src/services/storyService.js
// บริการสำหรับจัดการเนื้อเรื่องโดยใช้ข้อมูลจากไฟล์ JSON
// src/services/storyService.js
// บริการสำหรับจัดการเนื้อเรื่องโดยใช้ข้อมูลจากไฟล์ JSON
// src/services/storyService.js
// บริการสำหรับจัดการเนื้อเรื่องโดยใช้ข้อมูลจากไฟล์ JSON
// src/services/storyService.js

// src/services/storyService.js
import storyData from '../data/thaiGameStory.json';

const DEFAULT_OPENING_STORY = {
  text: "สวัสดี {playerName}! ยินดีต้องรับสู่วันสงกรานต์ที่วัดแห่งหนึ่ง...",
  choices: [
    { id: 'default_choice_1', text: "เริ่มผจญภัย", nextScene: "temple_market_morning" },
    { id: 'default_choice_2', text: "ไปช่วยงานวัด", nextScene: "temple_market_morning" }
  ],
  context: { scene: "default_opening", playerName: "{playerName}" }
};

export const determineEnding = (endingKey) => {
  const endingDetails = storyData.endings[endingKey];
  if (endingDetails) {
    return endingDetails;
  }
  console.warn(`[StoryService] Ending key '${endingKey}' not found in JSON. Using default.`);
  return storyData.endings.neutral_participated || {
    type: "neutral",
    title: "ผู้มีส่วนร่วม",
    text: "คุณได้ร่วมกิจกรรมและเรียนรู้บางสิ่งบางอย่าง วันสงกรานต์ผ่านไปอย่างดี"
  };
};

export const initializeStory = async (playerName) => {
  try {
    console.log(`[StoryService] Initializing story for player: ${playerName} (from JSON)`);
    const startSceneKey = "temple_courtyard_morning";
    let startScene = storyData.scenes[startSceneKey];

    if (!startScene) {
      throw new Error(`Start scene '${startSceneKey}' not found in JSON data.`);
    }

    const storyText = startScene.text.replace('{playerName}', playerName);
    console.log('[StoryService] Successfully loaded initial story from JSON');
    return {
      text: storyText,
      choices: startScene.choices,
      context: { ...startScene.context, playerName: playerName }
    };

  } catch (error) {
    console.error('[StoryService] Error in initializeStory (JSON):', error);
    return {
      ...DEFAULT_OPENING_STORY,
      text: DEFAULT_OPENING_STORY.text.replace('{playerName}', playerName),
      context: { ...DEFAULT_OPENING_STORY.context, playerName }
    };
  }
};

export const prepareAdaptiveStory = (isEnabled, playerStats) => {
  // ในเวอร์ชัน JSON นี้ เราไม่ได้ใช้ adaptive story จริงๆ
  // แต่สามารถเตรียม logic ไว้สำหรับเวอร์ชันอนาคต
  console.log(`[StoryService] Adaptive Story is ${isEnabled ? 'enabled' : 'disabled'} (not implemented in JSON version)`);
  console.log(`[StoryService] Player Stats for Adaptation:`, playerStats);
  return isEnabled;
};

export const makeChoice = async (choiceId, currentContext) => {
  try {
    console.log(`[StoryService] Making choice: ${choiceId} (from JSON)`);
    const currentPlayerName = currentContext.playerName;
    const currentSceneKey = currentContext.scene;

    if (!currentSceneKey) {
      throw new Error('Current scene key is missing in context.');
    }

    const currentScene = storyData.scenes[currentSceneKey];
    if (!currentScene) {
      throw new Error(`Current scene '${currentSceneKey}' not found in JSON data.`);
    }

    const selectedChoice = currentScene.choices.find(choice => choice.id === choiceId);
    if (!selectedChoice) {
      console.warn(`[StoryService] Choice '${choiceId}' not found in scene '${currentSceneKey}'.`);
      return {
        story: {
          text: "เกิดข้อผิดพลาด... แต่เรื่องราวก็ยังดำเนินต่อไป",
          choices: [
            { id: 'continue_anyway', text: "ดำเนินเรื่องต่อ", nextScene: "temple_market_morning" }
          ],
          context: currentContext
        },
        stats: { xp: 0, items: [] },
        gameEnded: false
      };
    }

    // ตรวจสอบเงื่อนไขของตัวเลือก (ถ้ามี)
    const reqItems = selectedChoice.requiredItems || [];
    const reqXp = selectedChoice.requiredXp || 0;
    const playerItems = currentContext.playerItems || []; // ดึงไอเท็มจาก context
    const playerXp = currentContext.playerXp || 0; // ดึง XP จาก context
    const hasRequiredItems = reqItems.every(item => playerItems.includes(item));
    if (!hasRequiredItems || playerXp < reqXp) {
      console.warn(`[StoryService] Player does not meet requirements for choice '${choiceId}'.`);
      return {
        story: {
          text: currentScene.text.replace('{playerName}', currentPlayerName) + "\n\n(คุณยังไม่มีคุณสมบัติที่จำเป็นสำหรับตัวเลือกนี้)",
          choices: currentScene.choices,
          context: currentContext
        },
        stats: { xp: 0, items: [] },
        gameEnded: false,
        requirementNotMet: true
      };
    }

    const nextSceneKey = selectedChoice.nextScene;

    if (!nextSceneKey) {
      console.warn(`[StoryService] Next scene key is null/undefined for choice '${choiceId}'. Ending game.`);
      return createEndingResult(selectedChoice, currentContext);
    }

    const nextSceneData = storyData.scenes[nextSceneKey];

    if (!nextSceneData) {
      console.warn(`[StoryService] Next scene '${nextSceneKey}' not found in JSON. Ending game.`);
      return createEndingResult(selectedChoice, currentContext);
    }

    const nextStoryText = nextSceneData.text.replace('{playerName}', currentPlayerName);

    const isEndingScene = nextSceneData.context?.isEnding;
    let gameEnded = false;
    let endingKey = null;

    if (isEndingScene) {
      gameEnded = true;
      endingKey = nextSceneData.context.endingKey;
      console.log(`[StoryService] Game ending triggered. Key: ${endingKey}`);
    }

    // ถ้าเป็น Mini-game Scene
    if (nextSceneData.context?.miniGameType) {
      console.log(`[StoryService] Mini-game scene detected: ${nextSceneData.context.miniGameType}`);
      return {
        story: {
          text: nextStoryText, // อาจว่างไว้ให้ Component จัดการ
          choices: [], // ไม่มีตัวเลือกใน Mini-game
          context: { ...nextSceneData.context, playerName: currentPlayerName, previousChoice: choiceId }
        },
        stats: selectedChoice.stats || { xp: 0, items: [] },
        gameEnded: gameEnded,
        endingKey: endingKey,
        isMiniGame: true,
        miniGameType: nextSceneData.context.miniGameType
      };
    }

    console.log('[StoryService] Successfully processed choice from JSON');
    return {
      story: {
        text: nextStoryText,
        choices: nextSceneData.choices,
        context: { ...nextSceneData.context, playerName: currentPlayerName, previousChoice: choiceId }
      },
      stats: selectedChoice.stats || { xp: 0, items: [] },
      gameEnded: gameEnded,
      endingKey: endingKey
    };

  } catch (error) {
    console.error('[StoryService] Error in makeChoice (JSON):', error);
    return {
      story: {
        text: "เกิดข้อผิดพลาดในการดำเนินเรื่อง... แต่เรื่องราวก็ยังดำเนินต่อไป",
        choices: [
          { id: 'continue_anyway', text: "ดำเนินเรื่องต่อ", nextScene: "temple_market_morning" }
        ],
        context: currentContext
      },
      stats: { xp: 0, items: [] },
      gameEnded: false
    };
  }
};

const createEndingResult = (selectedChoice, currentContext) => {
  const endingKey = currentContext.previousChoice === 'feel_proud_and_fulfilled' ? 'good_knowledgeable' :
    currentContext.previousChoice === 'feel_bored_and_wish_to_play' ? 'bad_playful' :
      'neutral_participated';

  return {
    story: {
      text: "เรื่องราวดำเนินไป... และวันสงกรานต์ก็ใกล้จะจบลง",
      choices: [],
      context: { ...currentContext, previousChoice: selectedChoice.id }
    },
    stats: selectedChoice.stats || { xp: 0, items: [] },
    gameEnded: true,
    endingKey: endingKey
  };
};

// --- ฟังก์ชันสำหรับเตรียมระบบ Setting ---
export const prepareHumorMode = (isEnabled) => {
  console.log(`[StoryService] Humor Mode is ${isEnabled ? 'enabled' : 'disabled'}`);
  return isEnabled;
};