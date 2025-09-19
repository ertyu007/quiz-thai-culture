// src/components/ModernAlert.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ModernAlert = ({ 
  type = 'info', 
  title, 
  message, 
  onClose, 
  duration = 5000,
  position = 'top-right',
  icon = null 
}) => {
  const [isVisible, setIsVisible] = React.useState(true);

  React.useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => onClose?.(), 300);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const getAlertStyles = () => {
    const baseStyles = "rounded-2xl shadow-2xl border-2 p-4 max-w-sm w-full backdrop-blur-sm";
    
    const typeStyles = {
      success: "bg-gradient-to-r from-green-500 to-green-600 border-green-400 text-white",
      error: "bg-gradient-to-r from-red-500 to-red-600 border-red-400 text-white",
      warning: "bg-gradient-to-r from-yellow-500 to-yellow-600 border-yellow-400 text-white",
      info: "bg-gradient-to-r from-blue-500 to-blue-600 border-blue-400 text-white",
      achievement: "bg-gradient-to-r from-purple-500 to-purple-600 border-purple-400 text-white",
      item: "bg-gradient-to-r from-amber-500 to-amber-600 border-amber-400 text-white"
    };

    return `${baseStyles} ${typeStyles[type]}`;
  };

  const getPositionStyles = () => {
    const positions = {
      'top-right': 'top-4 right-4',
      'top-left': 'top-4 left-4',
      'bottom-right': 'bottom-4 right-4',
      'bottom-left': 'bottom-4 left-4',
      'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
      'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2'
    };
    
    return positions[position];
  };

  const getIcon = () => {
    if (icon) return icon;
    
    const icons = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️',
      achievement: '🏆',
      item: '🎁'
    };
    
    return icons[type] || '💡';
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, x: position.includes('right') ? 100 : -100 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          exit={{ opacity: 0, scale: 0.8, x: position.includes('right') ? 100 : -100 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className={`fixed z-50 ${getPositionStyles()} mx-4 sm:mx-0`}
        >
          <div className={getAlertStyles()}>
            <div className="flex items-start gap-3">
              <div className="text-2xl flex-shrink-0 animate-pulse">
                {getIcon()}
              </div>
              
              <div className="flex-1 min-w-0">
                {title && (
                  <h3 className="font-bold text-lg mb-1 leading-tight truncate">
                    {title}
                  </h3>
                )}
                <p className="text-sm opacity-95 leading-relaxed line-clamp-3">
                  {message}
                </p>
              </div>

              <button
                onClick={() => {
                  setIsVisible(false);
                  setTimeout(() => onClose?.(), 300);
                }}
                className="text-white hover:text-opacity-70 transition-opacity text-lg font-bold rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0"
                aria-label="ปิด"
              >
                ×
              </button>
            </div>

            {duration > 0 && (
              <motion.div
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: duration / 1000, ease: 'linear' }}
                className="h-1 bg-white bg-opacity-30 mt-3 rounded-full"
              />
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
  
};



export default ModernAlert;