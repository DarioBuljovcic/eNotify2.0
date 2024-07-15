import React, {
  useState,
  Fragment,
  useContext,
  LegacyRef,
  useRef,
} from "react";
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
  EuiFilePickerProps,
} from "@elastic/eui";
import * as XLSX from "xlsx";
import { PropsFilePicker } from "../types/types";

type ExcelItem = {
  Name: string;
  Surname: string;
  Email: string;
  Class: string;
};

export default function FilePicker({
  role,
  postFile,
  DataContext,
}: PropsFilePicker) {
  const { setToasts, setToastId, toastId } = useContext(DataContext);

  const [file, setFiles] = useState<File>();
  const filePickerId = useGeneratedHtmlId({ prefix: "filePicker" });
  const filePickerRef = useRef<
    LegacyRef<Omit<EuiFilePickerProps, "stylesMemoizer">> | undefined
  >(undefined);

  const onChange = (file) => {
    setFiles(file[0]);
  };
  const validateExcelItems = (items: any[]): ExcelItem[] => {
    items.forEach((item) => {
      if (
        typeof item.Name !== "string" ||
        typeof item.Surname !== "string" ||
        typeof item.Email !== "string" ||
        typeof item.Class !== "string" ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(item.Email)
      ) {
        throw new Error("Invalid ExcelItem");
      }
    });
    return items as ExcelItem[];
  };
  const handleFile = async () => {
    let toast;
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target) {
          const binaryStr = event.target.result;
          const workbook = XLSX.read(binaryStr, { type: "binary" });

          const sheetName = workbook.SheetNames?.[0];
          const worksheet = workbook.Sheets?.[sheetName];
          try {
            const jsonData: ExcelItem[] = XLSX.utils.sheet_to_json(worksheet);
            const validatedData = validateExcelItems(jsonData);

            postFile(validatedData);

            toast = {
              id: `toast${toastId}`,
              title: "Uspešno dodavanje",
              color: "success",
              text: (
                <>
                  <p>Uspešno ste dodali nove učenike putem fajla!</p>
                </>
              ),
            };
            setToasts((prev) => [...prev, toast]);
            setToastId(toastId + 1);
            if (filePickerRef.current) filePickerRef.current.removeFiles();
          } catch (error) {
            toast = {
              id: `toast${toastId}`,
              title: "Greška",
              color: "danger",
              text: (
                <>
                  <p>Fajl nije dobrog formata</p>
                </>
              ),
            };
            setToasts((prev) => [...prev, toast]);
            setToastId(toastId + 1);
            return;
          }
        }
      };

      reader.readAsBinaryString(file);
    } else {
      toast = {
        id: `toast${toastId}`,
        title: "Greška",
        color: "danger",
        text: (
          <>
            <p>Niste dodali fajl!</p>
          </>
        ),
      };
      setToasts((prev) => [...prev, toast]);
      setToastId(toastId + 1);
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
              <a
                href={`./fileForms/${
                  role === "u" || role === "p" ? "User.ods" : "Class.ods"
                }`}
                download={
                  role === "u" || role === "p" ? "User.ods" : "Class.ods"
                }
                target="_blank"
              >
                kliknite ovde
              </a>
            </EuiText>
          </EuiFlexGroup>
        </EuiFlexItem>
        <EuiSpacer />
        <EuiFlexItem style={{ minWidth: 400 }}>
          <EuiFilePicker
            id={filePickerId}
            ref={filePickerRef}
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
