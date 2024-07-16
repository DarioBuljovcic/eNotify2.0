import React, { useEffect, useState, useRef, LegacyRef } from "react";

export default ({ title, items, isOpen, handleOpen, selectedTabId }) => {
  const [selectedTab, setSelectedTab] = useState(0);
  const containerRef = useRef<HTMLDivElement | undefined>();
  const handleClick = (item, index) => {
    setSelectedTab(index);
    item.onclick();
  };
  useEffect(() => {
    setSelectedTab(selectedTabId - 1);
  }, [selectedTabId]);
  useEffect(() => {
    setSelectedTab(0);
    isOpen
      ? containerRef.current.removeAttribute("inert")
      : containerRef.current.setAttribute("inert", "");
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
        ref={containerRef}
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
