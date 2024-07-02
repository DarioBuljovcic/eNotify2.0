import React, { useState } from "react";
import "./css/header.css";

type HeaderProps = {
  setOptionText: (o: (string | number)[]) => void;
};

export default function Header({ setOptionText }: HeaderProps) {
  const [selected, setSelected] = useState(1);
  const [selectedColl, setSelectedColl] = useState(1);
  return (
    <header>
      <div className="logoContainer">
        <div className="logo">
          <span className="e">e</span>Notify
        </div>
      </div>

      <div className="options">
  {/* Učenici */}
  <div className={`option ${selected === 1 ? "selected" : ""}`}>
    <div
      className="text"
      onClick={() => {
        setSelected((prev) => (prev === 1 ? 0 : 1));
        setSelectedColl(1);
      }}
    >
      <span>Učenici</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 448 512"
        className="arrow"
      >
        <path d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z" />
      </svg>
    </div>
    <div className="collection">
      <div
        className={`collectionOption ${
          selectedColl === 1 ? "selectedColl" : ""
        }`}
        onClick={() => {
          setSelectedColl(1);
          setOptionText(["Dodavanje Učenika", 0]);
        }}
      >
        Dodavanje učenika
      </div>
      <div
        className={`collectionOption ${
          selectedColl === 2 ? "selectedColl" : ""
        }`}
        onClick={() => {
          setSelectedColl(2);
          setOptionText(["Pregled Učenika", 1]);
        }}
      >
        Pregled učenika
      </div>
    </div>
  </div>

  {/* Professor */}
  <div className={`option ${selected === 2 ? "selected" : ""}`}>
    <div
      className="text"
      onClick={() => {
        setSelected((prev) => (prev === 2 ? 0 : 2));
        setSelectedColl(1);
      }}
    >
      <span>Profesori</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 448 512"
        className="arrow"
      >
        <path d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z" />
      </svg>
    </div>
    <div className="collection">
      <div
        className={`collectionOption ${
          selectedColl === 1 ? "selectedColl" : ""
        }`}
        onClick={() => {
          setSelectedColl(1);
          setOptionText(["Dodavanje Profesora", 2]);
        }}
      >
        Dodavanje profesora
      </div>
      <div
        className={`collectionOption ${
          selectedColl === 2 ? "selectedColl" : ""
        }`}
        onClick={() => {
          setSelectedColl(2);
          setOptionText(["Pregled Profesora", 3]);
        }}
      >
        Pregled profesora
      </div>
    </div>
  </div>

  {/* Obaveštenja */}
  <div className={`option ${selected === 3 ? "selected" : ""}`}>
    <div
      className="text"
      onClick={() => {
        setSelected((prev) => (prev === 3 ? 0 : 3));
        setSelectedColl(1);
      }}
    >
      <span>Obaveštenja</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 448 512"
        className="arrow"
      >
        <path d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z" />
      </svg>
    </div>
    <div className="collection">
      <div
        className={`collectionOption ${
          selectedColl === 1 ? "selectedColl" : ""
        }`}
        onClick={() => {
          setSelectedColl(1);
          setOptionText(["Slanje Obaveštenja", 4]);
        }}
      >
        Slanje obaveštenja
      </div>
      <div
        className={`collectionOption ${
          selectedColl === 2 ? "selectedColl" : ""
        }`}
        onClick={() => {
          setSelectedColl(2);
          setOptionText(["Pregled Obaveštenja", 5]);
        }}
      >
        Pregled obaveštenja
      </div>
    </div>
  </div>

  {/* Razredi */}
  <div className={`option ${selected === 4 ? "selected" : ""}`}>
    <div
      className="text"
      onClick={() => {
        setSelected((prev) => (prev === 4 ? 0 : 4));
        setSelectedColl(1);
      }}
    >
      <span>Razredi</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 448 512"
        className="arrow"
      >
        <path d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z" />
      </svg>
    </div>
    <div className="collection">
      <div
        className={`collectionOption ${
          selectedColl === 1 ? "selectedColl" : ""
        }`}
        onClick={() => {
          setOptionText(["Dodavanje Razreda", 6]);
          setSelectedColl(1);
        }}
      >
        Dodavanje Razreda
      </div>
      <div
        className={`collectionOption ${
          selectedColl === 2 ? "selectedColl" : ""
        }`}
        onClick={() => {
          setOptionText(["Pregled Razreda", 7]);
          setSelectedColl(2);
        }}
      >
        Pregled Razreda
      </div>
    </div>
  </div>

  {/* Raspored */}
  <div className={`option ${selected === 5 ? "selected" : ""}`}>
    <div
      className="text"
      onClick={() => {
        setSelected((prev) => (prev === 5 ? 0 : 5));
        setSelectedColl(1);
      }}
    >
      <span>Raspored</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 448 512"
        className="arrow"
      >
        <path d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z" />
      </svg>
    </div>
    <div className="collection">
      <div
        className={`collectionOption ${
          selectedColl === 1 ? "selectedColl" : ""
        }`}
        onClick={() => {
          setOptionText(["Dodavanje Rasporeda", 8]);
          setSelectedColl(1);
        }}
      >
        Dodavanje Rasporeda
      </div>
      <div
        className={`collectionOption ${
          selectedColl === 2 ? "selectedColl" : ""
        }`}
        onClick={() => {
          setOptionText(["Pregled Rasporeda", 9]);
          setSelectedColl(2);
        }}
      >
        Pregled Rasporeda
      </div>
    </div>
  </div>
</div>

      <img
        className="profile"
        src={require("./images/school.png")}
        alt="School logo"
      />
    </header>
  );
}

