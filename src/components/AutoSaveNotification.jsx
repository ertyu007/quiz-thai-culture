// src/components/AutoSaveNotification.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AutoSaveNotification = ({ message, onClose }) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.9 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50"
      >
        <div className="bg-green-500 text-white px-4 py-2 rounded-full shadow-lg border-2 border-green-400 flex items-center space-x-2 backdrop-blur-sm">
          <span className="text-sm">💾</span>
          <span className="text-xs font-medium">{message}</span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AutoSaveNotification;