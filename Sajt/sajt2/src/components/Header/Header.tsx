import React, { useState } from "react";
import "./css/header.css";

type HeaderProps = {
  setOptionText: (o: (string | number)[]) => void;
};

export default function Header({ setOptionText }: HeaderProps) {
  const [selected, setSelected] = useState(1);
  return (
    <header>
      <div className="logo">
        <span className="e">e</span>Notify
      </div>
      <div className="options">
        <div
          className={`option ${selected === 1 ? "selected" : ""}`}
          onClick={() => {
            setOptionText(["Dodavanje Učenika", 0]);
            setSelected(1);
          }}
        >
          Učenici
        </div>
        <div
          className={`option ${selected === 2 ? "selected" : ""}`}
          onClick={() => {
            setOptionText(["Slanje Obaveštenja", 1]);
            setSelected(2);
          }}
        >
          Obaveštenja
        </div>
        {/* <div
          className={`option ${selected === 3 ? "selected" : ""}`}
          onClick={() => {
            setOptionText(["Dodavanje Razreda", 2]);
            setSelected(3);
          }}
        >
          Razredi
        </div> */}
        {/* <div className="option"></div> */}
        <img
          className="profile"
          src={require("./images/school.png")}
          alt="School logo"
        />
      </div>
    </header>
  );
}
