// src/utils/soundEffects.js
const sounds = {
  click: new Audio(process.env.PUBLIC_URL + '/sounds/click.mp3'),
  achievement: new Audio(process.env.PUBLIC_URL + '/sounds/achievement.mp3'),
  save: new Audio(process.env.PUBLIC_URL + '/sounds/save.mp3'),
  error: new Audio(process.env.PUBLIC_URL + '/sounds/error.mp3'),
  item: new Audio(process.env.PUBLIC_URL + '/sounds/item.mp3')
};

// ลดระดับเสียง
Object.values(sounds).forEach(sound => {
  sound.volume = 0.3;
});

export const playSound = (soundName) => {
  if (sounds[soundName]) {
    const soundClone = sounds[soundName].cloneNode();
    soundClone.volume = 0.3;
    soundClone.play().catch(e => console.log('เสียงไม่สามารถเล่นได้:', e));
  }
};

export const preloadSounds = () => {
  Object.values(sounds).forEach(sound => {
    sound.load();
  });
};