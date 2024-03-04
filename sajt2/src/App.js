import "./App.css";
import { useEffect, useState, useRef } from "react";
import { Select } from "./components/Select.tsx";

import ExcelReader from "./components/ExcelReader.tsx";

function App() {
  const [razredi, setRazredi] = useState([]);
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState("option1");
  const [selectData, setSelectData] = useState([]);
  const grupno = [
    { razred: "Svi razredi" },
    { razred: "Prvi razredi" },
    { razred: "Drugi razredi" },
    { razred: "Treći razredi" },
    { razred: "Četvrti razredi" },
  ];

  const tittleRef = useRef();
  const textRef = useRef();
  const radioGrupnoRef = useRef();
  const radioPojedinacnoRef = useRef();

  const handleOptionChange = (btn) => {
    setSelectedOption(btn);
    setSelectData(btn === "option1" ? razredi : grupno);
    setOptions([]);
  };

  async function sendNotification() {
    let razred = [];
    options.map((o) => {
      if (selectedOption === "option2") {
        const item = o.razred;
        switch (item) {
          case "Svi razredi":
            console.log("Veliki pozdrav");
            razred.push("0");
            break;
          case "Prvi razredi":
            razred.push("1");
            break;
          case "Drugi razredi":
            razred.push("2");
            break;
          case "Treći razredi":
            razred.push("3");
            break;
          case "Četvrti razredi":
            razred.push("4");
            break;
        }
      } else {
        razred.push(o.razred);
      }
    });
    const dataToInsert = {
      naslov: tittleRef.current.value,
      tekst: textRef.current.value,
      razred: razred,
      datum: new Date(),
    };
  }

  useEffect(() => {
    async function fetchData() {
      try {
        // Replace 'table_name' with your actual table name
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="forma">
      <ExcelReader />
      {/* <label for="inputField">Naslov obavestenja</label>
      <input ref={tittleRef} type="text" />

      <label for="inputField">Tekst obavestenja</label>
      <textarea ref={textRef} cols="30" rows="10"></textarea>

      <div className="razredi-options">
        <span>Razredi:</span>
        <div className="radio-list">
          <div className={`stick ${selectedOption}`}>
            <div className="dot"></div>
          </div>
          <button
            className="razredi-btn"
            onClick={() => handleOptionChange("option1")}
          >
            Pojedinačno
          </button>
          <button
            className="razredi-btn"
            onClick={() => handleOptionChange("option2")}
          >
            Grupno
          </button>
        </div>
      </div>
      {razredi.length > 0 && (
        <Select
          multiple={true}
          options={selectData}
          value={options}
          onChange={(o) => setOptions(o)}
        />
      )}
      {}

      <button
        type="submit"
        className="submit-btn"
        onClick={() => sendNotification()}
      >
        Posalji
      </button> */}
    </div>
  );
}

export default App;
{
  /* <span className="radio-item">
            <input
              type="radio"
              name="razredi"
              value="option1"
              checked={selectedOption === "option1"}
              onChange={handleOptionChange}
              ref={radioGrupnoRef}
            />
            <label for="grupno">Grupno</label>
          </span>
          <span className="radio-item">
            <input
              type="radio"
              name="razredi"
              value="option2"
              checked={selectedOption === "option2"}
              onChange={handleOptionChange}
              ref={radioPojedinacnoRef}
            />
            <label for="pojedinacno">Pojedinačno</label>
          </span> */
}
