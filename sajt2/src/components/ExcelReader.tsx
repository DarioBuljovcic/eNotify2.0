import React, { useState, ChangeEvent } from "react";
import { auth, db } from "../lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";

import * as XLSX from "xlsx";

interface ExcelData {
  [key: string]: any;
}
type ExcelItem = {
  Name: string;
  Surname: string;
  Class: string;
  Role: string;
};
type Data = {
  Name: string;
  Class: string;
  Email: string;
  Role: string;
  UserID: string;
};

const ExcelReader: React.FC = () => {
  const [excelData, setExcelData] = useState<Data[] | null>(null);

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
  const handleFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        if (event.target) {
          const binaryString = event.target.result as string;
          const workbook = XLSX.read(binaryString, { type: "binary" });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          const data: ExcelItem[] = XLSX.utils.sheet_to_json<ExcelItem>(sheet);
          for (let item of data) {
            const name = item.Name + " " + item.Surname;
            const email = item.Name + item.Surname + "@gmail.com";
            try {
              // Insert data
              const data: Data = {
                Name: name,
                Email: email,
                Class: item.Class,
                Role: item.Role,
                UserID: generatePassword(28),
              };

              await addDoc(collection(db, "Users"), data);
            } catch (error) {
              console.error("Error creating user or inserting data:", error);
            }
            console.log("aloo");
          }
        }
      };
      reader.readAsBinaryString(file);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFile} />
    </div>
  );
};

export default ExcelReader;
