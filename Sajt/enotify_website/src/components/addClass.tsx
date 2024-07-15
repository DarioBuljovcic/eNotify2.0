import React, { useState, Fragment, useEffect, useContext } from "react";
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
  EuiFieldText,
  EuiFormLabel,
  EuiSelect,
  EuiComboBox,
} from "@elastic/eui";
import { AddClassProps, DropdownUsers } from "../types/types";

export default function AddClass({
  postClass,
  setModalHeader,
  setModalText,
  setIsOpen,
  getProfessors,
  DataContext,
}: AddClassProps) {
  const { setToasts, toastId, setToastId } = useContext(DataContext);

  const filePickerId = useGeneratedHtmlId({ prefix: "filePicker" });
  const basicSelectId = useGeneratedHtmlId({ prefix: "basicSelect" });
  const [name, setName] = useState("");
  const [professorList, setProfessorList] = useState<DropdownUsers[]>([]);
  const [value, setValue] = useState("");
  const [selectedClasses, setSelectedClasses] = useState<DropdownUsers[]>([]);
  const [errorList, setErrorList] = useState({
    name: false,
    professorList: false,
  });
  const [file, setFiles] = useState<File>();
  const onChangeFile = (file) => {
    setFiles(file[0]);
  };
  const onChangeCombo = (selected) => {
    setSelectedClasses(selected);
    setErrorList((prev) => ({
      ...prev,
      professorList: false,
    }));
  };

  useEffect(() => {
    if (getProfessors) {
      const funk = async () => {
        const data: any = await getProfessors();
        setValue(data[0].UserID);
        const profs: DropdownUsers[] = [];
        data.forEach((d) => {
          profs.push({
            value: d.UserID,
            text: d.Name,
            label: `${d.Name} (${d.Email})`,
          });
        });
        setProfessorList([...profs]);
      };
      if (professorList.length === 0) funk();
    }
  });

  const handlePost = async () => {
    let toast;
    setErrorList({
      name: name === "" ? true : false,
      professorList: selectedClasses.length === 0 ? true : false,
    });

    if (name.length > 0 && selectedClasses.length !== 0) {
      try {
        let ProfessorsList = "";
        selectedClasses.forEach((p) => {
          ProfessorsList += p.value + ",";
        });
        const prof = professorList.find((obj) => obj.value === value);
        const dataToInsert = {
          Class: name,
          Professor: prof?.text,
          ProfessorsList: ProfessorsList,
        };
        await postClass(dataToInsert, file);
        toast = {
          id: `toast${toastId}`,
          title: "Uspeh",
          color: "success",
          text: (
            <>
              <p>Uspešno ste dodali novi razred '{name}'</p>
            </>
          ),
        };
        setToasts((prev) => [...prev, toast]);
        setToastId(toastId + 1);
        setFiles(undefined);
        setName("");
        setSelectedClasses([]);
      } catch (error) {
        console.log(error.message);
        toast = {
          id: `toast${toastId}`,
          title: "Greška",
          color: "danger",
          text: (
            <>
              <p>Došlo je do greške prilikom dodavanja razreda</p>
            </>
          ),
        };
        setToasts((prev) => [...prev, toast]);
        setToastId(toastId + 1);
      }
    } else {
      toast = {
        id: `toast${toastId}`,
        title: "Greška",
        color: "danger",
        text: (
          <>
            {name === "" && <p> &gt; Naziv razreda nije popunjen!</p>}
            {selectedClasses.length === 0 && (
              <p> &gt; Niste izabrali profesore!</p>
            )}
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
              children={<EuiText size="m">Dodavanje razreda</EuiText>}
            ></EuiTitle>
            <EuiText size="s">
              Manuelno upisivanje jednog razreda u školski sistem
            </EuiText>
          </EuiFlexGroup>
        </EuiFlexItem>

        <EuiSpacer />

        <EuiFlexItem style={{ minWidth: 300, maxWidth: 300 }}>
          <EuiFormLabel style={{ fontSize: 16, marginBottom: 10 }}>
            Naziv razreda
          </EuiFormLabel>
          <EuiFieldText
            placeholder="Ime"
            isInvalid={errorList.name}
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setErrorList((prevErrorList) => ({
                ...prevErrorList,
                name: false,
              }));
            }}
            aria-label="Use aria labels when no actual label is in use"
          />

          <EuiSpacer />

          <EuiFormLabel style={{ fontSize: 16, marginBottom: 10 }}>
            Razredni starešina
          </EuiFormLabel>
          <EuiSelect
            id={basicSelectId}
            options={professorList}
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />

          <EuiSpacer />
          <EuiFormLabel style={{ fontSize: 16, marginBottom: 10 }}>
            Profesori
          </EuiFormLabel>
          <EuiComboBox
            aria-label="Accessible screen reader label"
            placeholder="Izaberite profesore"
            options={professorList}
            selectedOptions={selectedClasses}
            onChange={onChangeCombo}
            isInvalid={errorList.professorList}
            data-test-subj="demoComboBox"
            isClearable={true}
          />

          <EuiSpacer />

          <EuiFormLabel style={{ fontSize: 16, marginBottom: 10 }}>
            Slika rasporeda
          </EuiFormLabel>
          <EuiFilePicker
            id={filePickerId}
            initialPromptText="Izaberite ili prevucite sliku rasporeda"
            onChange={onChangeFile}
            display="default"
            aria-label="Use aria labels when no actual label is in use"
          />
        </EuiFlexItem>

        <EuiFlexItem>
          <EuiButton fill={true} onClick={() => handlePost()}>
            Dodajte razred
          </EuiButton>
        </EuiFlexItem>
      </EuiFlexGroup>
    </EuiPageSection>
  );
}
