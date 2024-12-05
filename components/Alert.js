// components/CustomAlert.js
import { useState, useEffect } from 'react';

const CustomAlert = ({ message, type, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onClose) onClose(); // Menutup alert setelah beberapa detik
    }, 3000); // Alert akan hilang setelah 3 detik

    return () => clearTimeout(timer); // Membersihkan timer jika komponen dibuang
  }, [onClose]);

  if (!isVisible) return null; // Jika tidak terlihat, komponen tidak akan dirender

  return (
    <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 p-4 rounded-md shadow-lg ${type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white`}>
      <p>{message}</p>
    </div>
  );
};

export default CustomAlert;