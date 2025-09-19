// src/components/ItemNotification.jsx
import React from 'react';
import ModernAlert from './ModernAlert';

const ItemNotification = ({ item, onClose }) => {
  return (
    <ModernAlert
      type="item"
      title="ได้รับไอเท็มใหม่!"
      message={item}
      onClose={onClose}
      duration={4000}
      position="top-right"
      icon="🎁"
    />
  );
};

export default ItemNotification;