import React, { useState } from "react";
import ExcelReader from "./Excel/ExcelReader.tsx";
import "./css/student.css";
import InsertOne from "./InsertOne/InsertOne.tsx";

export default function Users({ Successful }) {
  const [inputType, setInputType] = useState(1);

  function displayOption() {
    switch (inputType) {
      case 1:
        return <ExcelReader />;
      case 2:
        return <InsertOne Successful={Successful} />;
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
