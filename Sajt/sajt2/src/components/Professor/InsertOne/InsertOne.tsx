import React, { useEffect, useRef, useState } from "react";
import { db } from "../../../lib/firebase";
import { collection, addDoc, onSnapshot, query } from "firebase/firestore";
import axios from "axios";
import { Select } from "../Select/Select";
import Popup from "../../Popup/Popup"

type Data = {
  Class: string;
  Email: string;
  Name: string;
  Role: string;
  UserID: string;
  LogOut: boolean;
};
export type UserClass = {
  [key: number]: string;
  Class: string;
};

function InsertOne() {
  const Ime = useRef<HTMLInputElement>(null);
  const Prezime = useRef<HTMLInputElement>(null);
  const Email = useRef<HTMLInputElement>(null);
  const [options, setOptions] = useState<UserClass[]>([]);
  const [selectedOption, setSelectedOption] = useState<UserClass>({Class:''});
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState("")
  

  const generatePassword = (length: number) => {
    const charset =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let password = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }
    return password;
  };

  async function createUser() {
    if (
      Ime.current &&
      Prezime.current &&
      Email.current &&
      selectedOption.Class!=""
    ) {
      const UserID = generatePassword(7);
      const dataToInsert: Data = {
        Class: selectedOption.Class,
        Email: Email.current.value,
        Name: `${Ime.current.value} ${Prezime.current.value}`,
        Role: "Professor",
        UserID: UserID,
        LogOut: true,
      };
      setIsOpen(true);
      
      axios
        .post(
          "https://enotifyserver2.netlify.app/.netlify/functions/api/send-email",
          {
            to: Email.current.value,
            subject: "Vaš kod",
            text: UserID,
          }
        )
        .then((response) => {
          console.log(response.data);
        })
        .catch((error) => {
          console.error("Error sending email:", error);
        });
        try {
          await addDoc(collection(db, "Users"), dataToInsert);
          setMessage("Uspešno je dodat profesor");
        } catch (error) {
          setMessage("Došlo je do greške");
        }
      
    }
  }
  function emptyInsert() {
    if (Ime.current && Prezime.current && selectedOption.Class!="") {
      Ime.current.value = "";
      Prezime.current.value = "";
      setSelectedOption({Class:''})
    }
  }
  useEffect(() => {
    const getData = async () => {
      const newData: UserClass[] = [];
  
      onSnapshot(query(collection(db, "Classes")), (querySnapshot) => {
      newData.length = 0;
      querySnapshot.forEach((doc) => {
          newData.push(doc.data() as UserClass);
      });
      setOptions([...newData]);
      });
  };
  getData();

    getData();
  }, []);
  return (
    <div className="formaContainer">
      <Popup onConfirm={()=>setIsOpen(false)} onCancel={()=>setIsOpen(false)} isOpen={isOpen} showBtns={false} message={message}/>
      <div className="forma">
        <span className="inputContainer">
          <label htmlFor="inputField">Ime profesora</label>
          <input ref={Ime} type="text" placeholder="Ime " />
        </span>
        <span className="inputContainer">
          <label htmlFor="inputField">Prezime profesora</label>
          <input ref={Prezime} type="text" placeholder="Prezime" />
        </span>
        <span className="inputContainer">
          <label htmlFor="inputField">Email profesora</label>
          <input ref={Email} type="text" placeholder="Email" />
        </span>
        <span className="inputContainer">
          <label htmlFor="inputField">Razred profesora</label>
          {/* <input ref={StudentClass} type="text" placeholder="Razred" /> */}
          <Select
            options={options}
            value={selectedOption}
            onChange={(o:UserClass) => setSelectedOption(o)}
          />
        </span>
        <div className="razredi-options"></div>

        <button
          type="submit"
          className="submit-btn"
          onClick={() => {
            createUser();
            emptyInsert();
          }}
        >
          Unesi
        </button>
      </div>
    </div>
  );
}

export default InsertOne;
