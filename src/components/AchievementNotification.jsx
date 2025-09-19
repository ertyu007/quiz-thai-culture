// src/components/AchievementNotification.jsx
import React from 'react';
import ModernAlert from './ModernAlert';

const AchievementNotification = ({ achievement, onClose }) => {
  return (
    <ModernAlert
      type="achievement"
      title="Achievement ใหม่!"
      message={`${achievement.title} - ${achievement.description}`}
      onClose={onClose}
      duration={5000}
      position="top-right"
      icon={achievement.icon || '🏆'}
    />
  );
};

export default AchievementNotification;