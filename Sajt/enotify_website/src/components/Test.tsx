import React, { useEffect, useState } from "react";

export default ({ title, items, isOpen, handleOpen, selectedTabId }) => {
  const [selectedTab, setSelectedTab] = useState(0);
  const handleClick = (item, index) => {
    setSelectedTab(index);
    item.onclick();
  };
  useEffect(() => {
    setSelectedTab(selectedTabId - 1);
  }, [selectedTabId]);
  useEffect(() => {
    setSelectedTab(0);
  }, [isOpen]);
  return (
    <div>
      <button
        className={`dropdownButton ${isOpen ? "selected" : ""}`}
        onClick={handleOpen}
      >
        {title}
      </button>
      <div
        className={`dropdownContainer ${isOpen ? "isOpen selected" : ""}`}
        style={isOpen ? { blockSize: items.length * 25 + 16 } : {}}
      >
        {items.map((item, index) => (
          <button
            className={`dropdownItem ${
              selectedTab === index ? "selected" : ""
            }`}
            onClick={() => handleClick(item, index)}
          >
            {item.name}
          </button>
        ))}
      </div>
    </div>
  );
};
