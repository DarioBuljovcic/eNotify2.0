import React, { useState, Fragment } from "react";
import {
  EuiFilePicker,
  EuiFlexGroup,
  EuiFlexItem,
  EuiText,
  EuiSpacer,
  useGeneratedHtmlId,
  EuiPageSection,
  EuiTitle,
  EuiButton,
} from "@elastic/eui";
import * as XLSX from "xlsx";

type Props = {
  role: string;
  postFile: (o) => void;
  setModalHeader: (o) => void;
  setModalText: (o) => void;
  setIsOpen: (o) => void;
};
type ExcelItem = {
  Name: string;
  Surname: string;
  Email: string;
  Class: string;
};
type Data = {
  Name: string;
  Class: string;
  Email: string;
  Role: string;
  UserID: string;
  LogOut: boolean;
};

export default function FilePicker({
  role,
  postFile,
  setModalHeader,
  setModalText,
  setIsOpen,
}: Props) {
  const [file, setFiles] = useState<File>();
  const filePickerId = useGeneratedHtmlId({ prefix: "filePicker" });
  const onChange = (file) => {
    setFiles(file[0]);
  };
  const validateExcelItems = (items: any[]): ExcelItem[] => {
    items.forEach((item) => {
      if (
        typeof item.Name !== "string" ||
        typeof item.Surname !== "string" ||
        typeof item.Email !== "string" ||
        typeof item.Class !== "string"
      ) {
        throw new Error("Invalid ExcelItem");
      }
    });
    return items as ExcelItem[];
  };
  const handleFile = async () => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target) {
          const binaryStr = event.target.result;
          const workbook = XLSX.read(binaryStr, { type: "binary" });

          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          try {
            const jsonData: ExcelItem[] = XLSX.utils.sheet_to_json(worksheet);
            const validatedData = validateExcelItems(jsonData);
            console.log(validatedData);
            postFile(validatedData);
            setModalHeader("Uspešno dodavanje");
            setModalText(
              `Uspešno ste dodali nove ${
                role === "u" ? "učenike" : "profesore"
              }!`
            );
            setIsOpen((prev: boolean) => !prev);
          } catch (error) {
            console.log("ovo?");
            setModalHeader("Greška");
            setModalText(
              `Došlo je do greške prilikom dodavanja ${
                role === "u" ? "učenika" : "profesora"
              }!`
            );
            setIsOpen((prev: boolean) => !prev);
            return;
          }
        }
      };

      reader.readAsBinaryString(file);
    }
  };
  return (
    <EuiPageSection>
      <EuiFlexGroup
        justifyContent="center"
        alignItems="center"
        direction="column"
      >
        <EuiFlexItem>
          <EuiFlexGroup
            justifyContent="center"
            alignItems="center"
            direction="column"
          >
            <EuiTitle
              size="m"
              children={
                <EuiText size="m">
                  Dodajte {role === "u" ? "učenike" : "profesore"} pomoću fajla
                </EuiText>
              }
            ></EuiTitle>
            <EuiText size="s">
              Da dodate {role === "u" ? "učenike" : "profesore"} prevucite fajl
              ili klikom izaberite Excel fajl. Da skinete primer fajla{" "}
              <a href="#">kliknite ovde</a>
            </EuiText>
          </EuiFlexGroup>
        </EuiFlexItem>
        <EuiSpacer />
        <EuiFlexItem style={{minWidth:400}}>
          <EuiFilePicker
            id={filePickerId}
            initialPromptText="Izaberite ili prevucite željeni fajl"
            onChange={onChange}
            display="large"
            aria-label="Use aria labels when no actual label is in use"
            
          />
        </EuiFlexItem>
        <EuiFlexItem>
          <EuiButton fill={true} onClick={() => handleFile()}>{`Dodajte ${
            role === "u" ? "učenike" : "profesore"
          }`}</EuiButton>
        </EuiFlexItem>
      </EuiFlexGroup>
    </EuiPageSection>
  );
}
