import React, { useEffect, useState, useRef } from "react";
import { Select } from "./Select/Select.tsx";
import {
  collection,
  getDocs,
  addDoc,
  query,
  DocumentData,
  QuerySnapshot,
} from "firebase/firestore";
import { db } from "../../lib/firebase.js";
import "./css/notifications.css";
import TextArea from "./TextArea/TextArea.tsx";
import { getStorage, ref, uploadBytes } from "firebase/storage";

type SelectOption = {
  Class: string;
};
type inputData = {
  Class: string;
  Date: Date;
  Files: string | undefined;
  Text: string | undefined;
  Tittle: string | undefined;
  Type: string;
};
interface File {
  name: string;
}
const storage = getStorage();

function MainPage() {
  const [classes, setClasses] = useState<SelectOption[]>([]);
  const [options, setOptions] = useState<SelectOption[]>([]);
  const [selectedOption, setSelectedOption] = useState("option1");
  const [selectData, setSelectData] = useState<SelectOption[]>([]);
  const [text, setText] = useState("");
  const [files, setFiles] = useState<File[]>([]);

  const grupno = [
    { Class: "Svi razredi", id: "0" },
    { Class: "Prvi razredi", id: "1" },
    { Class: "Drugi razredi", id: "2" },
    { Class: "Treći razredi", id: "3" },
    { Class: "Četvrti razredi", id: "4" },
  ];

  const tittleRef = useRef<HTMLInputElement>(null);

  const handleOptionChange = (btn: string) => {
    setSelectedOption(btn);
    setSelectData(btn === "option1" ? classes : grupno);
    setOptions([]);
  };

  async function sendNotification() {
    if (files) {
      files.forEach((f: any) => {
        const storageRef = ref(storage, f?.name);
        uploadBytes(storageRef, f)
          .then((snapshot) => {
            console.log("Uploaded a blob or file!");
          })
          .catch((e) => {
            console.log(e);
          });
      });
    }
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
    if (text && tittleRef.current) {
      const selectedClasses: string[] = [];
      options.forEach((option) => {
        selectedClasses.push(option.Class);
      });
      const dataToInsert: inputData = {
        Class: selectedClasses.join("|"),
        Date: new Date(),
        Files: files.length > 0 ? `${files.map((f) => f.name)}` : ``,
        Text: text,
        Tittle: tittleRef.current.value.toString(),
        Type: `T${files.length > 0 ? "F" : ""}`,
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
        setSelectData(fetchedData);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };
    if (classes.length <= 0) fetchData();
  }, []);

  return (
    <div className="formaContainer">
      <div className="forma">
        <span className="inputContainer">
          <label htmlFor="inputField">Naslov obavestenja</label>
          <input ref={tittleRef} type="text" placeholder="Obaveštenje" />
        </span>
        <span className="inputContainer">
          <label htmlFor="inputField">Tekst obavestenja</label>
          <TextArea
            setText={(o) => setText(o)}
            setFiles={(o) => setFiles(o)}
            text={text}
          />
        </span>
        <div className="razredi-options">
          <span>Razredi:</span>
          <div className="radio-list">
            <button
              className={`razredi-btn ${
                selectedOption === "option1" ? "selectedOption" : ""
              }`}
              onClick={() => handleOptionChange("option1")}
            >
              Pojedinačno
            </button>
            <button
              className={`razredi-btn ${
                selectedOption === "option2" ? "selectedOption" : ""
              }`}
              onClick={() => handleOptionChange("option2")}
            >
              Grupno
            </button>
          </div>
        </div>
        {classes.length > 0 && (
          <Select
            options={selectData}
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
      </div>
    </div>
  );
}

export default MainPage;
