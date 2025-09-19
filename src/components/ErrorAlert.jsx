// src/components/ErrorAlert.jsx
import React from 'react';
import ModernAlert from './ModernAlert';

const ErrorAlert = ({ error, onClose }) => {
  return (
    <ModernAlert
      type="error"
      title="เกิดข้อผิดพลาด"
      message={error}
      onClose={onClose}
      duration={0} // ไม่ปิดอัตโนมัติ
      position="top-center"
      icon="❌"
    />
  );
};

export default ErrorAlert;