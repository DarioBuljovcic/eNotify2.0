import React from "react";
import "./css/header.css";

type HeaderProps = {
  setOptionText: (o: (string | number)[]) => void;
};

export default function Header({ setOptionText }: HeaderProps) {
  return (
    <header>
      <div className="logo">
        <span className="e">e</span>Notify
      </div>
      <div className="options">
        <div
          className="option"
          onClick={() => setOptionText(["Dodavanje Učenika", 0])}
        >
          Učenici
        </div>
        <div
          className="option"
          onClick={() => setOptionText(["Slanje Obaveštenja", 1])}
        >
          Obaveštenja
        </div>
        <div
          className="option"
          onClick={() => setOptionText(["Dodavanje Razreda", 2])}
        >
          Razredi
        </div>
        {/* <div className="option"></div> */}
        <div className="profile"></div>
      </div>
    </header>
  );
}
