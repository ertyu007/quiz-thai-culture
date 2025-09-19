// src/services/storyService.js
import storyData from '../data/thaiGameStory.json';

const DEFAULT_OPENING_STORY = {
  text: "ขณะที่คุณกำลังศึกษาพระพุทธรูปเก่าแก่ในพิพิธภัณฑ์ {playerName} ได้สัมผัสกับจารึกลึกลับที่แผ่พลังงานประหลาด...",
  choices: [
    { id: 'path_suvarnabhumi', text: "สำรวจเส้นทางสายน้ำ - สู่ยุคสุวรรณภูมิ", nextScene: "suvarnabhumi_river" },
    { id: 'path_sukhothai', text: "เดินตามเส้นทางศิลาแลง - สู่ยุคสุโขทัย", nextScene: "sukhothai_gateway" },
    { id: 'path_ayutthaya', text: "ตามรอยเส้นทางเรือพระราชพิธี - สู่ยุคอยุธยา", nextScene: "ayutthaya_riverbank" }
  ],
  context: { scene: "time_portal_arrival", era: "beginning", playerName: "{playerName}" }
};

export const determineEnding = (endingKey) => {
  const endingDetails = storyData.endings[endingKey];
  if (endingDetails) {
    return endingDetails;
  }
  console.warn(`[StoryService] Ending key '${endingKey}' not found in JSON. Using default.`);
  return storyData.endings.modern_business || {
    type: "neutral",
    title: "ผู้มีส่วนร่วม",
    text: "คุณได้ร่วมกิจกรรมและเรียนรู้บางสิ่งบางอย่าง วันสงกรานต์ผ่านไปอย่างดี"
  };
};

export const initializeStory = async (playerName) => {
  try {
    console.log(`[StoryService] Initializing story for player: ${playerName} (from JSON)`);
    
    // ใช้ scene เริ่มต้นจาก JSON ใหม่
    const startSceneKey = "time_portal_arrival";
    let startScene = storyData.scenes[startSceneKey];

    if (!startScene) {
      console.warn(`[StoryService] Start scene '${startSceneKey}' not found, using default`);
      return {
        ...DEFAULT_OPENING_STORY,
        text: DEFAULT_OPENING_STORY.text.replace(/{playerName}/g, playerName),
        context: { ...DEFAULT_OPENING_STORY.context, playerName }
      };
    }

    const storyText = startScene.text.replace(/{playerName}/g, playerName);
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
      text: DEFAULT_OPENING_STORY.text.replace(/{playerName}/g, playerName),
      context: { ...DEFAULT_OPENING_STORY.context, playerName }
    };
  }
};

export const prepareAdaptiveStory = (isEnabled, playerStats) => {
  console.log(`[StoryService] Adaptive Story is ${isEnabled ? 'enabled' : 'disabled'} (not implemented in JSON version)`);
  console.log(`[StoryService] Player Stats for Adaptation:`, playerStats);
  return isEnabled;
};

export const makeChoice = async (choiceId, currentContext, stats = {}, humorMode = false, adaptiveStory = true) => {
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
            { id: 'continue_anyway', text: "ดำเนินเรื่องต่อ", nextScene: "time_portal_arrival" }
          ],
          context: currentContext
        },
        stats: { xp: 0, items: [] },
        gameEnded: false
      };
    }

    // ตรวจสอบเงื่อนไขของตัวเลือก (ใช้ stats ที่ส่งมา)
    const reqItems = selectedChoice.requiredItems || [];
    const reqXp = selectedChoice.requiredXp || 0;
    const playerItems = stats.items || [];
    const playerXp = stats.xp || 0;
    const hasRequiredItems = reqItems.every(item => playerItems.includes(item));
    if (!hasRequiredItems || playerXp < reqXp) {
      console.warn(`[StoryService] Player does not meet requirements for choice '${choiceId}'.`);
      
      // สร้างข้อความแจ้ง requirement ที่ขาด
      let requirementMessage = "\n\n📋 คุณยังไม่มีคุณสมบัติที่จำเป็น:";
      if (!hasRequiredItems && reqItems.length > 0) {
        requirementMessage += `\n• ต้องการไอเทม: ${reqItems.join(', ')}`;
      }
      if (playerXp < reqXp) {
        requirementMessage += `\n• ต้องการ XP: ${reqXp} (คุณมี: ${playerXp})`;
      }
      requirementMessage += "\n\nคุณสามารถกลับไปเลือกใหม่หรือดำเนินเรื่องต่อโดยข้ามข้อจำกัดนี้";
      
      // เพิ่มปุ่มพิเศษ
      const enhancedChoices = [
        ...currentScene.choices,
        { id: 'go_back_to_choices', text: "↩️ กลับไปเลือกใหม่" },
        { id: 'proceed_anyway', text: "⏭️ ดำเนินเรื่องต่อ (ข้ามข้อจำกัด)" }
      ];
      
      return {
        story: {
          text: currentScene.text.replace('{playerName}', currentPlayerName) + requirementMessage,
          choices: enhancedChoices,
          context: { 
            ...currentContext, 
            requirementFailed: true,
            previousChoice: choiceId,
            lastChoiceText: selectedChoice.text 
          }
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
          text: nextStoryText,
          choices: [],
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
          { id: 'continue_anyway', text: "ดำเนินเรื่องต่อ", nextScene: "time_portal_arrival" }
        ],
        context: currentContext
      },
      stats: { xp: 0, items: [] },
      gameEnded: false
    };
  }
};

const createEndingResult = (selectedChoice, currentContext) => {
  // ใช้ ending เริ่มต้นจาก JSON ใหม่
  const endingKey = 'modern_business';

  return {
    story: {
      text: "เรื่องราวดำเนินไป... และการเดินทางข้ามเวลาของคุณก็ใกล้จะจบลง",
      choices: [],
      context: { ...currentContext, previousChoice: selectedChoice.id }
    },
    stats: selectedChoice.stats || { xp: 0, items: [] },
    gameEnded: true,
    endingKey: endingKey
  };
};

export const prepareHumorMode = (isEnabled) => {
  console.log(`[StoryService] Humor Mode is ${isEnabled ? 'enabled' : 'disabled'}`);
  return isEnabled;
};