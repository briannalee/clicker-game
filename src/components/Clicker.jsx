// src/components/Clicker.jsx
import React from 'react';
import './Clicker.css';
import mortarPestle from './images/mortar-pestle.svg';

const Clicker = ({ onClick, clickPower }) => {
  return (
    <div className="clicker-container">
      <motion.button
        className="clicker-button"
        onClick={onClick}
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.05 }}
        initial={{ scale: 1 }}
        animate={{
          boxShadow: [
            '0 0 10px rgba(255, 100, 255, 0.5)',
            '0 0 20px rgba(255, 100, 255, 0.7)',
            '0 0 10px rgba(255, 100, 255, 0.5)',
          ],
          transition: {
            duration: 2,
            repeat: Infinity,
          },
        }}
      >
        <img src={mortarPestle} alt="Brew" className="clicker-icon" />
        <span className="clicker-text">Brew Magic</span>
      </motion.button>
      <motion.div
        className="click-power"
        initial={{ opacity: 0.7 }}
        animate={{
          opacity: [0.7, 1, 0.7],
          transition: { duration: 1.5, repeat: Infinity }
        }}
      >
        +{clickPower} energy per click
      </motion.div>
    </div>
  );
};

export default Clicker;