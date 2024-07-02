import React, { useEffect, useState, useRef } from "react";
import { Select } from "./Select/Select";
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
import TextArea from "./TextArea/TextArea";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import axios from "axios";
import Popup from "../Popup/Popup"

type SelectOption = {
  Class: string;
};
type inputData = {
  NotificationId: string;
  Class: string[];
  Date: Date;
  Files: string | undefined;
  Text: string | undefined;
  Tittle: string | undefined;
  Type: string;
  Seen: string;
  From: string;
};
type File = {
  name: string;
};
const storage = getStorage();




function MainPage() {
  const [classes, setClasses] = useState<SelectOption[]>([]);
  const [options, setOptions] = useState<SelectOption[]>([]);
  const [selectedOption, setSelectedOption] = useState("option1");
  const [selectData, setSelectData] = useState<SelectOption[]>([]);
  const [text, setText] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState("")

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
  const generatePassword = (length: number) => {
    // Define the length of the password
    const charset =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"; // Define the character set
    let password = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }
    return password;
  };
  const emptyInsert = () => {
    if (tittleRef.current) tittleRef.current.value = "";
    if (text) setText("");
    if (options) setOptions([]);
    if (files) setFiles([]);
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
            razred.push("Svi");
            break;
          case "Prvi razredi":
            razred.push("Prvi");
            break;
          case "Drugi razredi":
            razred.push("Drugi");
            break;
          case "Treći razredi":
            razred.push("Treci");
            break;
          case "Četvrti razredi":
            razred.push("Cetvrti");
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
        NotificationId: generatePassword(7),
        Class: razred,
        Date: new Date(),
        Files: files.length > 0 ? `${files.map((f) => f.name)}` : ``,
        Text: text,
        Tittle: tittleRef.current.value.toString(),
        Type: `T${files.length > 0 ? "F" : ""}`,
        Seen: "",
        From: "Uprava škole",
      };

      const sendData = async () => {
        try {
          const response = await axios.post(
            "https://enotifyserver2.netlify.app/.netlify/functions/api/data",
            dataToInsert
          );
        } catch (error) {
          console.error("Error sending data:", error);
        }
      };
      sendData();
      try {
        await addDoc(collection(db, "Notifications"), dataToInsert);
        
        setMessage("Uspešno poslata notifikacija");
      } catch (error) {
        setMessage("Došlo je do greške");
      }
      setIsOpen(true);
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const q = query(collection(db, "Classes"));
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
      <Popup onCancel={()=>setIsOpen(false)} onConfirm={()=>setIsOpen(false)} isOpen={isOpen} message={ message} showBtns={false}/>
      <div className="forma">
        <span className="inputContainer">
          <label htmlFor="inputField">Naslov obaveštenja</label>
          <input ref={tittleRef} type="text" placeholder="Obaveštenje" />
        </span>
        <span className="inputContainer">
          <label htmlFor="inputField">Tekst obaveštenja</label>
          <TextArea
            setText={(o) => setText(o)}
            setFiles={(o:any) => setFiles(o)}
            text={text}
          />
        </span>
        
        {classes.length > 0 && (
          <span className="inputContainer">
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
          {/* <input ref={StudentClass} type="text" placeholder="Razred" /> */}
          <Select
            options={selectData}
            value={options}
            onChange={(o) => setOptions(o)}
          />
        </span>
          
        )}

        <button
          type="submit"
          className="submit-btn"
          onClick={() => {
            sendNotification();
            emptyInsert();
            setIsOpen(true);
          }}
        >
          Pošalji
        </button>
      </div>
    </div>
  );
}

export default MainPage;
