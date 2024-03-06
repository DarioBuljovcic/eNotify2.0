import React, { useEffect, useState, useRef, DetailedHTMLProps } from "react";
import { Select } from "./Select.tsx";
import {
  collection,
  getDocs,
  addDoc,
  query,
  where,
  DocumentData,
  QuerySnapshot,
  Timestamp,
} from "firebase/firestore";
import { db } from "../lib/firebase.js";
import ExcelReader from "./ExcelReader.tsx";

type SelectOption = {
  Class: string;
  id: string;
};
type inputData = {
  Class: string;
  Date: Date;
  File: string | undefined;
  Image: string | undefined;
  Text: string | undefined;
  Tittle: string | undefined;
  Type: string;
};

function MainPage() {
  const [classes, setClasses] = useState<SelectOption[]>([]);
  const [options, setOptions] = useState<SelectOption[]>([]);
  const [selectedOption, setSelectedOption] = useState("option1");
  const [selectData, setSelectData] = useState<SelectOption[]>([]);
  const grupno = [
    { Class: "Svi razredi", id: "0" },
    { Class: "Prvi razredi", id: "1" },
    { Class: "Drugi razredi", id: "2" },
    { Class: "Treći razredi", id: "3" },
    { Class: "Četvrti razredi", id: "4" },
  ];

  const tittleRef = useRef<HTMLInputElement>(null);
  const textRef = useRef<HTMLTextAreaElement>(null);

  const handleOptionChange = (btn: string) => {
    setSelectedOption(btn);
    setSelectData(btn === "option1" ? classes : grupno);
    setOptions([]);
  };

  async function sendNotification() {
    let razred: string[] = [];
    options.map((o) => {
      if (selectedOption === "option2") {
        const item = o.Class;
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
        razred.push(o.Class);
      }
    });
    if (textRef.current && tittleRef.current) {
      const selectedClasses: string[] = [];
      options.forEach((option) => {
        selectedClasses.push(option.Class);
      });

      const dataToInsert: inputData = {
        Class: selectedClasses.join("|"),
        Date: new Date(),
        File: "",
        Image: "",
        Text: textRef.current.value.toString(),
        Tittle: tittleRef.current.value.toString(),
        Type: "T",
      };
      await addDoc(collection(db, "Notifications"), dataToInsert);
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const q = query(collection(db, "Classes")); // Change 'your_collection' to the name of your Firestore collection
        const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(q);

        const fetchedData: SelectOption[] = [];
        querySnapshot.forEach((doc) => {
          const temp: SelectOption = doc.data() as SelectOption;

          fetchedData.push(temp);
        });

        setClasses(fetchedData);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };
    if (classes.length <= 0) fetchData();
  }, []);

  return (
    <div className="forma">
      <label htmlFor="inputField">Naslov obavestenja</label>
      <input ref={tittleRef} type="text" />

      <label htmlFor="inputField">Tekst obavestenja</label>
      <textarea ref={textRef} cols={30} rows={10}></textarea>

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
      {classes.length > 0 && (
        <Select
          options={classes}
          value={options}
          onChange={(o) => setOptions(o)}
        />
      )}

      <button
        type="submit"
        className="submit-btn"
        onClick={() => sendNotification()}
      >
        Posalji
      </button>
      <ExcelReader />
    </div>
  );
}

export default MainPage;
