// src/components/UpgradeMenu.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./UpgradeMenu.css";

const UpgradeMenu = ({
  onUpgrade,
  points,
  clickPower,
  pointsPerSecond,
  resources,
}) => {
  // Define upgrades with costs that increase after purchase
  const [upgrades, setUpgrades] = useState([
    {
      id: "mortar",
      name: "Better Mortar & Pestle",
      description: "Increase click power",
      type: "click",
      power: 1,
      baseCost: 10,
      cost: 10,
      level: 0,
      maxLevel: 50,
      unlocked: true,
    },
    {
      id: "apprentice",
      name: "Hire Apprentice",
      description: "Generate energy automatically",
      type: "passive",
      power: 1,
      baseCost: 50,
      cost: 50,
      level: 0,
      maxLevel: 20,
      unlocked: true,
    },
    {
      id: "herb_garden",
      name: "Herb Garden",
      description: "Generate herbs automatically",
      type: "resource",
      resourceId: "herbs",
      production: 0.5,
      baseCost: 100,
      cost: 100,
      level: 0,
      maxLevel: 10,
      unlocked: true,
    },
    {
      id: "crystal_mine",
      name: "Crystal Mine",
      description: "Extract magical crystals",
      type: "resource",
      resourceId: "crystals",
      production: 0.3,
      baseCost: 250,
      cost: 250,
      level: 0,
      maxLevel: 10,
      unlocked: points >= 100,
    },
    {
      id: "essence_extractor",
      name: "Essence Extractor",
      description: "Extract magical essences",
      type: "resource",
      resourceId: "essences",
      production: 0.2,
      baseCost: 500,
      cost: 500,
      level: 0,
      maxLevel: 10,
      unlocked: points >= 300,
    },
    {
      id: "ritual_circle",
      name: "Ritual Circle",
      description: "Triple click power",
      type: "click",
      power: 5,
      baseCost: 1000,
      cost: 1000,
      level: 0,
      maxLevel: 5,
      unlocked: points >= 500,
    },
    {
      id: "familiar",
      name: "Magical Familiar",
      description: "Boosts passive generation",
      type: "passive",
      power: 5,
      baseCost: 2000,
      cost: 2000,
      level: 0,
      maxLevel: 3,
      unlocked: points >= 1000,
    },
  ]);

  // Update upgrade availability based on points
  useEffect(() => {
    setUpgrades((prevUpgrades) =>
      prevUpgrades.map((upgrade) => ({
        ...upgrade,
        unlocked: upgrade.unlocked || points >= upgrade.baseCost * 0.8, // Unlock slightly before it's affordable
      }))
    );
  }, [points]);

  // Handle purchasing upgrades
  const handleUpgradeClick = (upgrade) => {
    if (points >= upgrade.cost && upgrade.level < upgrade.maxLevel) {
      // Call the parent component's upgrade handler
      onUpgrade(upgrade);

      // Update the upgrade in state
      setUpgrades((prevUpgrades) =>
        prevUpgrades.map((u) =>
          u.id === upgrade.id
            ? {
                ...u,
                level: u.level + 1,
                cost: Math.floor(u.baseCost * Math.pow(1.15, u.level + 1)),
              }
            : u
        )
      );
    }
  };

  // Group upgrades by category for better organization
  const categoryOrder = ["click", "passive", "resource"];

  return (
    <div className="upgrade-menu-container">
      {categoryOrder.map((category) => (
        <div key={category} className="upgrade-category">
          <h4 className="category-title">
            {category === "click" && "Manual Upgrades"}
            {category === "passive" && "Passive Upgrades"}
            {category === "resource" && "Resource Generators"}
          </h4>

          <AnimatePresence>
            {upgrades
              .filter(
                (upgrade) => upgrade.type === category && upgrade.unlocked
              )
              .map((upgrade) => (
                <motion.div
                  key={upgrade.id}
                  className={`upgrade-item ${
                    points >= upgrade.cost ? "affordable" : "expensive"
                  } ${upgrade.level >= upgrade.maxLevel ? "maxed" : ""}`}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => {
                    console.log(`Clicked upgrade: ${upgrade.name}`);
                    handleUpgradeClick(upgrade);
                  }}
                  style={{ cursor: points >= upgrade.cost && upgrade.level < upgrade.maxLevel ? 'pointer' : 'default' }}
                >
                  <div className="upgrade-info">
                    <span className="upgrade-name">{upgrade.name}</span>
                    <span className="upgrade-description">
                      {upgrade.description}
                    </span>
                    <span className="upgrade-details">
                      {upgrade.level < upgrade.maxLevel ? (
                        <>
                          Level: {upgrade.level} / {upgrade.maxLevel}
                        </>
                      ) : (
                        <>MAXED</>
                      )}
                    </span>
                  </div>

                  <div className="upgrade-cost">
                    {upgrade.level < upgrade.maxLevel ? (
                      <>{Math.floor(upgrade.cost)} energy</>
                    ) : (
                      <>Complete</>
                    )}
                  </div>
                </motion.div>
              ))}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
};

export default UpgradeMenu;