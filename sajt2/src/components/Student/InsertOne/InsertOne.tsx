import React, { useRef } from "react";
import { db } from "../../../lib/firebase";
import { collection, addDoc } from "firebase/firestore";

type Data = {
  Class: string;
  Email: string;
  Name: string;
  Role: string;
  UserID: string;
};

function InsertOne() {
  const Ime = useRef<HTMLInputElement>(null);
  const Prezime = useRef<HTMLInputElement>(null);
  const StudentClass = useRef<HTMLInputElement>(null);

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
    if (Ime.current && Prezime.current && StudentClass.current) {
      const dataToInsert: Data = {
        Class: StudentClass.current.value,
        Email: Ime.current.value + Prezime.current.value + "@gmail.com",
        Name: `${Ime.current.value} ${Prezime.current.value}`,
        Role: "Student",
        UserID: generatePassword(28),
      };
      await addDoc(collection(db, "Users"), dataToInsert);
    }
  }

  return (
    <div className="formaContainer">
      <div className="forma">
        <span className="inputContainer">
          <label htmlFor="inputField">Ime učenika</label>
          <input ref={Ime} type="text" placeholder="Luka " />
        </span>
        <span className="inputContainer">
          <label htmlFor="inputField">Prezime učenika</label>
          <input ref={Prezime} type="text" placeholder="Jovanović" />
        </span>
        <span className="inputContainer">
          <label htmlFor="inputField">Razred učenika</label>
          <input ref={StudentClass} type="text" placeholder="Obaveštenje" />
        </span>
        <div className="razredi-options"></div>

        <button
          type="submit"
          className="submit-btn"
          onClick={() => createUser()}
        >
          Unesi
        </button>
      </div>
    </div>
  );
}

export default InsertOne;
