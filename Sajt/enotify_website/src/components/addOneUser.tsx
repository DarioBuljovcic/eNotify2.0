import React, { useState, Fragment, useEffect } from "react";
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
} from "@elastic/eui";

type Props = {
  role: string;
  postUser: (o) => void;
  setModalHeader: (o) => void;
  setModalText: (o) => void;
  setIsOpen: (o) => void;
  getClasses?: () => void;
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
type Classes = {
  value: string;
  text: string;
};

export default function AddOneUser({
  role,
  postUser,
  setModalHeader,
  setModalText,
  setIsOpen,
  getClasses,
}: Props) {
  const basicSelectId = useGeneratedHtmlId({ prefix: "basicSelect" });
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [classList, setClassList] = useState<Classes[]>([]);
  const [value, setValue] = useState("");
  const [errorList, setErrorList] = useState({
    name: false,
    surname: false,
    email: false,
  });

  useEffect(() => {
    if (getClasses) {
      const funk = async () => {
        const data: any = await getClasses();
        setValue(data[0].value);
        setClassList([...data]);
      };
      if (classList.length === 0) funk();
    }
  });

  const handlePost = () => {
    if (name === "")
      setErrorList((prevErrorList) => ({
        ...prevErrorList,
        name: true,
      }));
    if (surname === "")
      setErrorList((prevErrorList) => ({
        ...prevErrorList,
        surname: true,
      }));
    if (email === "")
      setErrorList((prevErrorList) => ({
        ...prevErrorList,
        email: true,
      }));
    if (name.length > 0 && surname.length > 0 && email.length > 0) {
      try {
        const item = {
          Name: name,
          Surname: surname,
          Email: email,
          Class: value,
        };
        postUser(item);
        setModalHeader("Uspešno dodavanje");
        setModalText(
          `Uspešno ste dodali novog ${role === "u" ? "učenika" : "profesora"}!`
        );
        setIsOpen((prev: boolean) => !prev);
      } catch (error) {
        console.log(error.message);
        setModalHeader("Greška");
        setModalText(
          `Došlo je do greške prilikom dodavanja ${
            role === "u" ? "učenika" : "profesora"
          }!`
        );
        setIsOpen((prev: boolean) => !prev);
      }
    } else {
      setModalHeader("Greška");
      setModalText(`Popunite sva polja!`);
      setIsOpen((prev: boolean) => !prev);
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
                  Dodajte jednog {role === "u" ? "učenika" : "profesora"}
                </EuiText>
              }
            ></EuiTitle>
            <EuiText size="s">
              Manuelno upisivanje jednog{" "}
              {role === "u" ? "učenika" : "profesora"} u školski sistem
            </EuiText>
          </EuiFlexGroup>
        </EuiFlexItem>

        <EuiSpacer />

        <EuiFlexItem style={{ minWidth: 300 }}>
          <EuiFormLabel style={{ fontSize: 16, marginBottom: 10 }}>
            Ime {role === "u" ? "učenika" : "profesora"}
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
            Prezime {role === "u" ? "učenika" : "profesora"}
          </EuiFormLabel>
          <EuiFieldText
            placeholder="Prezime"
            isInvalid={errorList.surname}
            value={surname}
            onChange={(e) => {
              setSurname(e.target.value);
              setErrorList((prevErrorList) => ({
                ...prevErrorList,
                surname: false,
              }));
            }}
            aria-label="Use aria labels when no actual label is in use"
          />

          <EuiSpacer />

          <EuiFormLabel style={{ fontSize: 16, marginBottom: 10 }}>
            Email {role === "u" ? "učenika" : "profesora"}
          </EuiFormLabel>
          <EuiFieldText
            placeholder="Email"
            isInvalid={errorList.email}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErrorList((prevErrorList) => ({
                ...prevErrorList,
                email: false,
              }));
            }}
            spellCheck={true}
            aria-label="Use aria labels when no actual label is in use"
          />

          <EuiSpacer />
          {role === "u" && (
            <>
              <EuiFormLabel style={{ fontSize: 16, marginBottom: 10 }}>
                Razred učenika
              </EuiFormLabel>
              <EuiSelect
                id={basicSelectId}
                options={classList}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                aria-label="Use aria labels when no actual label is in use"
              />
            </>
          )}
        </EuiFlexItem>

        <EuiFlexItem>
          <EuiButton fill={true} onClick={() => handlePost()}>{`Dodajte ${
            role === "u" ? "učenika" : "profesora"
          }`}</EuiButton>
        </EuiFlexItem>
      </EuiFlexGroup>
    </EuiPageSection>
  );
}
