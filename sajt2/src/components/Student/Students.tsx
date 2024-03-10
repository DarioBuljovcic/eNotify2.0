import React, { useState } from "react";
import ExcelReader from "./Excel/ExcelReader.tsx";
import "./css/student.css";

export default function Users() {
  const [inputType, setInputType] = useState(1);

  function displayOption() {
    switch (inputType) {
      case 1:
        return <ExcelReader />;
      case 2:
        return "Hello";
    }
  }

  return (
    <div>
      <div className="studentOptions">
        <button
          className={`studentOption ${inputType === 1 ? "selected" : ""}`}
          value={2}
          onClick={() => setInputType(1)}
        >
          Fajl
        </button>
        <button
          className={`studentOption ${inputType === 2 ? "selected" : ""}`}
          onClick={() => setInputType(2)}
        >
          Ručno
        </button>
      </div>
      {inputType && displayOption()}
    </div>
  );
}
