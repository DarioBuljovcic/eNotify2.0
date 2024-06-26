import React, { useState, useRef } from "react";
import "./css/textArea.css";

// Require Editor CSS files.

export default function TextArea({ text, setText, setFiles }:{text:string,setText:(o:string)=>void,setFiles:any}) {
  const [files, setFileNames] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // 'file' comes from the Blob or File API

  const openInput = () => {
    if (inputRef.current) inputRef.current.click();
  };
  const handleFileSelect = (event: any) => {
    const inputFiles = event.target.files;
    for (let i = 0; i < inputFiles.length; i++) {
      console.log(inputFiles[i]);
      setFileNames((prevFiles) => [...prevFiles, inputFiles[i].name]);
      setFiles((prevFiles:any) => [...prevFiles, inputFiles[i]]);
    }
  };
  const handleDelete = (indexes:any) => {
    setFileNames((prevFiles) =>
      prevFiles.filter((_, index) => index !== indexes)
    );
    setFiles((prevFiles:any) => prevFiles.filter((_:any, index:number) => index !== indexes));
  };
  const displayFileNames = () => {
    return (
      <div className="selectedFiles">
        {files.map((file, index) => (
          <div key={index} className="file">
            <span>Fajl {index + 1}.</span>
            {file}
            <div className="delete" onClick={() => handleDelete(index)}>
              &times;
            </div>
          </div>
        ))}
      </div>
    );
  };
  const handleTextAreaChange = (event:any) => {
    setText(event.target.value);
  };

  return (
    <div className="textAreaContainer">
      <input
        ref={inputRef}
        type="file"
        accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
        className="input"
        onChange={handleFileSelect}
        multiple
      ></input>

      <textarea
        className="textarea"
        placeholder="Unesite tekst obaveštenja..."
        value={text}
        onChange={handleTextAreaChange}
      ></textarea>
      <button className="addFiles" onClick={openInput}>
        +
      </button>
      <div className="files">{files && displayFileNames()}</div>
    </div>
  );
}
