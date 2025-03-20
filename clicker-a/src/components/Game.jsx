// src/components/Game.jsx
import React, { useState, useEffect } from "react";
import Clicker from "./Clicker";
import UpgradeMenu from "./UpgradeMenu";
import Cauldron from "./Cauldron";
import { motion, AnimatePresence } from "framer-motion";
import "./Game.css";

const Game = () => {
  const [points, setPoints] = useState(0);
  const [clickPower, setClickPower] = useState(1);
  const [pointsPerSecond, setPointsPerSecond] = useState(0);
  const [showUpgrades, setShowUpgrades] = useState(false);
  const [resources, setResources] = useState([
    { id: "herbs", name: "Herbs", amount: 100, production: 0 },
    { id: "crystals", name: "Crystals", amount: 0, production: 0 },
    { id: "essences", name: "Essences", amount: 0, production: 0},
  ]);

  // Handle manual clicks
  const handleClick = () => {
    const herbMultiplier = Math.floor(
      resources.find((r) => r.id === "herbs").amount / 100
    );
    const clickPowerWithHerbEffect = clickPower * (1 + herbMultiplier * 0.5);
    setPoints((prevPoints) => prevPoints + clickPowerWithHerbEffect);
  };

  // Apply upgrade effects
  const handleUpgrade = (upgrade) => {
    setPoints((prevPoints) => prevPoints - upgrade.cost);

    if (upgrade.type === "click") {
      setClickPower((prevPower) => prevPower + upgrade.power);
    } else if (upgrade.type === "passive") {
      setPointsPerSecond((prevPPS) => prevPPS + upgrade.power);
    } else if (upgrade.type === "resource") {
      setResources((prevResources) =>
        prevResources.map((resource) => {
          if (resource.id === upgrade.resourceId) {
            // Add the upgrade's production to the specific resource
            return {
              ...resource,
              production: resource.production + upgrade.production,
            };
          }
          return resource;
        })
      );
    }
  };

  // Passive income from points per second
  useEffect(() => {
    const timer = setInterval(() => {
      // Update points based on pointsPerSecond
      if (pointsPerSecond > 0) {
        const crystalMultiplier = Math.floor(
          resources.find((r) => r.id === "crystals").amount / 50
        );
        setPoints(
          (prevPoints) =>
            prevPoints + pointsPerSecond * (1 + crystalMultiplier * 0.2)
        );
      }

      // Calculate essence multiplier
      const essenceMultiplier = Math.floor(
        resources.find((r) => r.id === "essences").amount / 25
      );
      const essenceBonus = 1 + essenceMultiplier * 0.1;

      // Update resource amounts based on their production rates (with essence modifier)
      setResources((prevResources) =>
        prevResources.map((resource) => {
          // Apply essence multiplier to herbs and crystals production
          const productionBonus =
            resource.id === "herbs" || resource.id === "crystals"
              ? essenceBonus
              : 1;

          return {
            ...resource,
            amount: resource.amount + resource.production * productionBonus,
          };
        })
      );
    }, 1000);

    return () => clearInterval(timer);
  }, [pointsPerSecond, resources]);

  // Toggle upgrades panel for mobile
  const toggleUpgrades = () => {
    setShowUpgrades(!showUpgrades);
  };

  return (
    <div className="game-container">
      {/* App Bar */}
      <div className="app-bar">
        <div className="app-title">Potion Master</div>
        <div className="app-actions">
          <button className="action-button" onClick={toggleUpgrades}>
            {showUpgrades ? "Brew" : "Spells"}
          </button>
        </div>
      </div>

      {/* Energy and Resources Display */}
      <div className="game-header">
        <motion.div
          className="points-display"
          animate={{ scale: [1, 1.05, 1], transition: { duration: 0.3 } }}
          key={Math.floor(points)}
        >
          <h2>Magic Energy: {Math.floor(points)}</h2>
          <p>Energy per second: {pointsPerSecond.toFixed(1)}</p>
        </motion.div>

        <div className="resources-display">
          {resources.map((resource) => (
            <div key={resource.id} className="resource">
              <span>
                {resource.name}: {Math.floor(resource.amount)}
              </span>
              <small>(+{resource.production.toFixed(1)}/s)</small>
            </div>
          ))}
        </div>
      </div>

      <div className="game-content">
        <AnimatePresence mode="wait">
          {!showUpgrades ? (
            <motion.div
              key="cauldron"
              className="cauldron-section"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Cauldron resources={resources} />
              <Clicker onClick={handleClick} clickPower={clickPower} />
            </motion.div>
          ) : (
            <motion.div
              key="upgrades"
              className="upgrade-section"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{
                type: "spring",
                stiffness: 200, // Lower stiffness for smoother feel
                damping: 25,    // Higher damping to prevent oscillation
                mass: 0.8,      // Lower mass for quicker response
              }}
            >
              <div className="upgrade-header">
                <h3>Magical Upgrades</h3>
                <button className="close-button" onClick={toggleUpgrades}>
                  ✕
                </button>
              </div>
              <UpgradeMenu
                onUpgrade={handleUpgrade}
                points={points}
                clickPower={clickPower}
                pointsPerSecond={pointsPerSecond}
                resources={resources}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Navigation Bar for Mobile */}
      <div className="mobile-bottom-nav">
        <div className="nav-item" onClick={toggleUpgrades}>
          <div className="nav-icon">📜</div>
          <div className="nav-label">Spells</div>
        </div>
      </div>
    </div>
  );
};

export default Game;
