import React, { useEffect, useState } from "react";
import "../../ExcelCss/excel.css";
import { db } from "../../../lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import * as XLSX from "xlsx";
import axios from "axios";

interface ExcelData {
  [key: string]: any;
}
type ExcelItem = {
  Name: string;
  Surname: string;
  Email: string;
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
function extractXlsContent(html) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  // const table = doc.querySelectorAll("table")[1];
  const trs = doc.querySelectorAll("tr");
  const array = Array.from(trs).slice(6);

  return array ? array[0].querySelectorAll("td") : "";
}

const FileUploadForm = () => {
  const [isAdvancedUpload, setIsAdvancedUpload] = useState(false);

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
      reader.onload = async (event: any) => {
        if (event.target) {
          const blob = new Blob([event.target.result], {
            type: "application/json",
          });
          const text = await blob.text();

          const binaryString = extractXlsContent(text);
          console.log(binaryString);
          function parseHtmlToJson(htmlContent: any) {
            const parser = new DOMParser();
            console.log(htmlContent);
            const doc = parser.parseFromString(htmlContent, "text/html");
            const data = doc.querySelectorAll("td");
            console.log(data);
            const days = ["Ponedeljak", "Utorak", "Sreda", "Cetvrtak", "Petak"];
          }
          parseHtmlToJson(binaryString);

          // const workbook = XLSX.read(binaryString, { type: "binary" });
          // const sheetName = workbook.SheetNames[0];
          // const sheet = workbook.Sheets[sheetName];
          // const data: ExcelItem[] = XLSX.utils.sheet_to_json<ExcelItem>(sheet);
          // for (let item of data) {
          //   const name = item.Name + " " + item.Surname;
          //   try {
          //     const userID = generatePassword(7);
          //     const data: Data = {
          //       Name: name,
          //       Email: item.Email,
          //       Class: item.Class,
          //       Role: item.Role,
          //       UserID: userID,
          //     };
          //     // axios
          //     //   .post(
          //     //     "http://localhost:9000/.netlify/functions/api/send-email",
          //     //     {
          //     //       to: item.Email,
          //     //       subject: "Vaš kod",
          //     //       text: userID,
          //     //     }
          //     //   )
          //     //   .then((response) => {
          //     //     console.log(response.data);
          //     //   })
          //     //   .catch((error) => {
          //     //     console.error("Error sending email:", error);
          //     //   });
          //     // await addDoc(collection(db, "Users"), data);
          //   } catch (error) {
          //     console.error(error);
          //   }
          //   console.log("aloo");
          // }
        }
      };
      reader.readAsBinaryString(file);
    }
  };

  const insertFile = (e) => {
    console.log("halooo");
    const file = e.target.files[0];
    handleFile(file);
  };

  useEffect(() => {
    const checkAdvancedUpload = () => {
      const div = document.createElement("div");
      const isDraggable = "draggable" in div;
      const supportsDragEvents = "ondragstart" in div && "ondrop" in div;
      const supportsFormData = "FormData" in window;
      const supportsFileReader = "FileReader" in window;

      const isAdvanced =
        (isDraggable || supportsDragEvents) &&
        supportsFormData &&
        supportsFileReader;
      setIsAdvancedUpload(isAdvanced);
    };

    checkAdvancedUpload();
  }, []);

  useEffect(() => {
    const form = document.querySelector(".box");
    if (isAdvancedUpload) {
      form?.classList.add("has-advanced-upload");

      const preventDefault = (e: {
        preventDefault: () => void;
        stopPropagation: () => void;
      }) => {
        e.preventDefault();
        e.stopPropagation();
      };

      const dragEvents = [
        "drag",
        "dragstart",
        "dragend",
        "dragover",
        "dragenter",
        "dragleave",
        "drop",
      ];
      const addClassOnDrag = ["dragover", "dragenter"];
      const removeClassOnDrag = ["dragleave", "dragend", "drop"];

      dragEvents.forEach((event) => {
        form?.addEventListener(event, preventDefault);
      });

      addClassOnDrag.forEach((event) => {
        form?.addEventListener(event, () => {
          form?.classList.add("is-dragover");
        });
      });

      removeClassOnDrag.forEach((event) => {
        form?.addEventListener(event, () => {
          form?.classList.remove("is-dragover");
        });
      });

      form?.addEventListener("drop", (e: any) => {
        const files = e.dataTransfer.files;
        if (files.length == 0) return;
        handleFile(files[0]);
      });
    }
  }, [isAdvancedUpload]);

  return (
    <form
      method="post"
      action="https://css-tricks.com/examples/DragAndDropFileUploading//?"
      encType="multipart/form-data"
      noValidate
      className="box"
    >
      <div className="box__input">
        <svg
          className="box__icon"
          xmlns="http://www.w3.org/2000/svg"
          width="50"
          height="43"
          viewBox="0 0 50 43"
        >
          <path d="M48.4 26.5c-.9 0-1.7.7-1.7 1.7v11.6h-43.3v-11.6c0-.9-.7-1.7-1.7-1.7s-1.7.7-1.7 1.7v13.2c0 .9.7 1.7 1.7 1.7h46.7c.9 0 1.7-.7 1.7-1.7v-13.2c0-1-.7-1.7-1.7-1.7zm-24.5 6.1c.3.3.8.5 1.2.5.4 0 .9-.2 1.2-.5l10-11.6c.7-.7.7-1.7 0-2.4s-1.7-.7-2.4 0l-7.1 8.3v-25.3c0-.9-.7-1.7-1.7-1.7s-1.7.7-1.7 1.7v25.3l-7.1-8.3c-.7-.7-1.7-.7-2.4 0s-.7 1.7 0 2.4l10 11.6z" />
        </svg>
        <input
          type="file"
          name="files[]"
          id="file"
          className="box__file"
          data-multiple-caption="{count} files selected"
          multiple
          onChange={insertFile}
        />
        <label htmlFor="file" className="fileLabel">
          <strong>Izaberite fajl</strong>
          <span className="box__dragndrop"> ili ga prevucite ovde</span>.
        </label>
        <button type="submit" className="box__button">
          Unesi
        </button>
      </div>

      <div className="box__uploading">Unošenje&hellip;</div>
      <div className="box__success">
        Gotov!{" "}
        <a
          href="https://css-tricks.com/examples/DragAndDropFileUploading//?"
          className="box__restart"
          role="button"
        >
          Unesite još?
        </a>
      </div>
      <div className="box__error">
        Greška! <span></span>.{" "}
        <a
          href="https://css-tricks.com/examples/DragAndDropFileUploading//?"
          className="box__restart"
          role="button"
        >
          Pokušajte ponovo!
        </a>
      </div>
    </form>
  );
};

export default FileUploadForm;
