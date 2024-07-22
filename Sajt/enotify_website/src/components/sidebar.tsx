import React, { useEffect, useState } from "react";
import { FaBook, FaUser, FaBell, FaUserGroup } from "react-icons/fa6";
import { IoIosLogOut } from "react-icons/io";

function Sidebar({ tabs, handleTabChange, tabId, blockId }) {
  const [selectedBlock, setBlock] = useState(blockId);
  const [selectedTab, setTab] = useState(1);
  const handleClick = (block, tab, index) => {
    selectedBlock !== index && setBlock(index);
    selectedTab !== tab && setTab(tab);
    tabId !== tab && handleTabChange(tab);
    block.onclick();
  };
  useEffect(() => {
    setBlock(blockId - 1);
  }, [blockId]);
  return (
    <>
      <div className="sidebarOptions">
        <img src="./logoBigLight.png" alt="Logo" />
        <div className="sidebarBlock">
          <label htmlFor="sidebarGroup">
            <p>
              <FaUser size={20} />
              Učenici
            </p>
          </label>
          <div className={`sidebarGroup ${selectedTab === 1 ? "open" : ""}`}>
            {tabs.Student.map((tab, index) => (
              <button
                className={`sidebarItem ${
                  selectedBlock === index ? "open" : ""
                }`}
                onClick={() => handleClick(tab, 1, index)}
              >
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        <div className="sidebarBlock">
          <label htmlFor="sidebarGroup">
            <p>
              <FaBook size={20} />
              Profesori
            </p>
          </label>
          <div className={`sidebarGroup ${selectedTab === 2 ? "open" : ""}`}>
            {tabs.Professor.map((tab, index) => (
              <button
                className={`sidebarItem ${
                  selectedBlock === index ? "open" : ""
                }`}
                onClick={() => handleClick(tab, 2, index)}
              >
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        <div className="sidebarBlock">
          <label htmlFor="sidebarGroup">
            <p>
              <FaBell size={20} />
              Obaveštenja
            </p>
          </label>
          <div className={`sidebarGroup ${selectedTab === 3 ? "open" : ""}`}>
            {tabs.Notifications.map((tab, index) => (
              <button
                className={`sidebarItem ${
                  selectedBlock === index ? "open" : ""
                }`}
                onClick={() => handleClick(tab, 3, index)}
              >
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        <div className="sidebarBlock">
          <label htmlFor="sidebarGroup">
            <p>
              <FaUserGroup size={20} />
              Razredi
            </p>
          </label>
          <div className={`sidebarGroup ${selectedTab === 4 ? "open" : ""}`}>
            {tabs.Class.map((tab, index) => (
              <button
                className={`sidebarItem ${
                  selectedBlock === index ? "open" : ""
                }`}
                onClick={() => handleClick(tab, 4, index)}
              >
                {tab.name}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="sidebarFooter">
        <button
          className="sidebarLogout"
          onClick={() => document.location.reload()}
        >
          Odjavi se
          <IoIosLogOut size={20} />
        </button>
        <div className="sidebarUser">
          <img src="./ivanSaric.png" alt="Skola" />
          <div className="text">
            <div className="name">Ivan Sarić</div>
            <div className="email">mesc@gmail.com</div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
