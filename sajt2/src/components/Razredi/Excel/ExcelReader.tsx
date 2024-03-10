import React, { useState, ChangeEvent, useRef } from "react";
import { db } from "../../../lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import "../../ExcelCss/excel.css";

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
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
  const handleFile = async (file: File) => {
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
              console.log(data);
              await addDoc(collection(db, "Users"), data);
            } catch (error) {
              console.error(error);
            }
            console.log("aloo");
          }
        }
      };
      reader.readAsBinaryString(file);
    }
  };

  function selectFiles() {
    if (fileInputRef.current !== null) fileInputRef.current.click();
  }
  function onFileSelect(event: { target: { files: any } }) {
    const files = event.target.files;
    if (files.length == 0) return;
    handleFile(files[0]);
  }
  function onDragOver(e: {
    preventDefault: () => void;
    dataTransfer: { dropEffect: string };
  }) {
    e.preventDefault();
    setIsDragging(true);
    e.dataTransfer.dropEffect = "copy";
  }
  function onDrageLeave(e: { preventDefault: () => void }) {
    e.preventDefault();
    setIsDragging(false);
  }
  function onDrop(e: any) {
    e.preventDefault();
    setIsDragging(false);
    console.log(e.dataTransfer.files);
    const files = e.dataTransfer.files;
    if (files.length == 0) return;
    handleFile(files[0]);
  }
  return (
    <div className="card">
      <div className="dragContainer">
        <div
          className={`drag-area ${isDragging ? "draging" : ""}`}
          onDragOver={onDragOver}
          onDragLeave={onDrageLeave}
          onDrop={onDrop}
        >
          {isDragging ? (
            <span>Prevucite fajl ovde</span>
          ) : (
            <>
              {" "}
              Prevucite fajl ovde ili
              <span className="select" role="button" onClick={selectFiles}>
                Potražite
              </span>
            </>
          )}

          <input
            type="file"
            name="file"
            ref={fileInputRef}
            onChange={onFileSelect}
          />
        </div>
      </div>
    </div>
  );
};

export default ExcelReader;
