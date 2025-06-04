// src/components/Cauldron.jsx
import React, { useState, useEffect } from 'react';
import { Stage, Layer, Rect, Circle, Path, Text } from 'react-konva';
import { motion } from 'framer-motion';
import './Cauldron.css';

const Cauldron = ({ resources }) => {
  // State for animated bubbles
  const [bubbles, setBubbles] = useState([]);
  
  // Color based on resources
  const getColor = () => {
    const totalResources = resources.reduce((sum, r) => sum + r.amount, 0);
    
    // Shift color based on most prominent resource
    if (totalResources > 0) {
      const herbs = resources.find(r => r.id === 'herbs').amount / totalResources;
      const crystals = resources.find(r => r.id === 'crystals').amount / totalResources;
      const essences = resources.find(r => r.id === 'essences').amount / totalResources;
      
      const r = Math.floor(100 + herbs * 155);
      const g = Math.floor(100 + crystals * 155);
      const b = Math.floor(100 + essences * 155);
      
      return `rgb(${r}, ${g}, ${b})`;
    }
    
    return '#6A5ACD';
  };

  // Generate new bubbles randomly
  useEffect(() => {
    const timer = setInterval(() => {
      if (bubbles.length < 15) {
        const newBubble = {
          id: Date.now(),
          x: 100 + Math.random() * 200,
          y: 200,
          radius: 5 + Math.random() * 15,
          speed: 0.5 + Math.random() * 1.5,
          opacity: 0.3 + Math.random() * 0.5,
        };
        setBubbles(current => [...current, newBubble]);
      }
    }, 500);
    
    return () => clearInterval(timer);
  }, [bubbles.length]);
  
  // Animate bubbles
  useEffect(() => {
    const animationTimer = setInterval(() => {
      setBubbles(current => 
        current
          .map(bubble => ({
            ...bubble,
            y: bubble.y - bubble.speed,
            opacity: bubble.y < 100 ? bubble.opacity * 0.9 : bubble.opacity,
          }))
          .filter(bubble => bubble.y > 20 && bubble.opacity > 0.1)
      );
    }, 50);
    
    return () => clearInterval(animationTimer);
  }, []);

  return (
    <motion.div 
      className="cauldron-container"
      initial={{ scale: 0.9 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Stage width={400} height={300}>
        <Layer>
          {/* Cauldron stand */}
          <Rect x={170} y={250} width={60} height={10} fill="#333" />
          <Rect x={160} y={260} width={80} height={5} fill="#222" />
          
          {/* Cauldron body */}
          <Rect
            x={100}
            y={160}
            width={200}
            height={90}
            cornerRadius={10}
            fill="#333"
            stroke="#222"
            strokeWidth={2}
          />
          
          {/* Cauldron rim */}
          <Rect
            x={80}
            y={150}
            width={240}
            height={20}
            cornerRadius={5}
            fill="#444"
            stroke="#222"
            strokeWidth={2}
          />
          
          {/* Liquid */}
          <Rect
            x={100}
            y={170}
            width={200}
            height={80}
            fill={getColor()}
            opacity={0.8}
          />
          
          {/* Bubbles */}
          {bubbles.map(bubble => (
            <Circle
              key={bubble.id}
              x={bubble.x}
              y={bubble.y}
              radius={bubble.radius}
              fill="#fff"
              opacity={bubble.opacity}
            />
          ))}
          
          {/* Floating resource symbols */}
          {resources.map((resource, index) => {
            if (resource.amount > 0) {
              return (
                <Text
                  key={resource.id}
                  x={120 + index * 70}
                  y={120 + Math.sin(Date.now() / 1000 + index) * 10}
                  text={resource.id.charAt(0).toUpperCase()}
                  fontSize={14}
                  fill="#fff"
                  opacity={0.8}
                />
              );
            }
            return null;
          })}
        </Layer>
      </Stage>
    </motion.div>
  );
};

export default Cauldron;