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
  const [isLoading, setIsLoading] = useState(false);
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
        typeof item.Class !== "string" || //this line needs to be removed for when we're adding proffesors
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
      setIsLoading(true);
      const reader = new FileReader();
      reader.onload = async (event) => {
        if (event.target) {
          const binaryStr = event.target.result;
          const workbook = XLSX.read(binaryStr, { type: "binary" });

          const sheetName = workbook.SheetNames?.[0];
          const worksheet = workbook.Sheets?.[sheetName];
          try {
            const jsonData: ExcelItem[] = XLSX.utils.sheet_to_json(worksheet);
            console.log(jsonData);
            const validatedData = validateExcelItems(jsonData);
            console.log("CHECK");
            console.log(validatedData);
            try {
              await postFile(validatedData);
              toast = {
                id: `toast${toastId}`,
                title: "Uspešno dodavanje",
                color: "success",
                text: (
                  <>
                    <p>Uspešno ste dodali nove korisnike putem fajla!</p>
                  </>
                ),
              };
            } catch (error) {
              toast = {
                id: `toast${toastId}`,
                title: "Greška",
                color: "danger",
                text: (
                  <>
                    <p>{error.message}</p>
                  </>
                ),
              };
            }
          } catch {
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
          } finally {
            setToasts((prev) => [...prev, toast]);
            setToastId(toastId + 1);
            if (filePickerRef.current) filePickerRef.current.removeFiles();
          }
        }
        setIsLoading(false);
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
  const btnText = () => {
    if (isLoading) return "Učitava se fajl";
    else return `Dodajte ${role === "u" ? "učenike" : "profesore"}`;
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
              size="l"
              children={
                <p className="titleText">
                  Dodajte {role === "u" ? "učenike" : "profesore"} pomoću fajla
                </p>
              }
            ></EuiTitle>
            <EuiText className="subtitleText">
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
        <EuiFlexItem className="filePicker">
          <EuiFilePicker
            id={filePickerId}
            ref={filePickerRef}
            initialPromptText="Izaberite ili prevucite željeni fajl"
            onChange={onChange}
            display="large"
            aria-label="Use aria labels when no actual label is in use"
            accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.oasis.opendocument.spreadsheet"
          />
        </EuiFlexItem>
        <EuiFlexItem>
          <EuiButton
            fill={true}
            onClick={() => handleFile()}
            disabled={isLoading}
          >
            {btnText()}
          </EuiButton>
        </EuiFlexItem>
      </EuiFlexGroup>
    </EuiPageSection>
  );
}
