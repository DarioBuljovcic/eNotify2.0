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
} from "@elastic/eui";
import { AddUserProps } from "../types/types";

type Classes = {
  value: string;
  text: string;
};

export default function AddOneUser({
  role,
  postUser,
  getClasses,
  DataContext,
}: AddUserProps) {
  const { setToasts, toastId, setToastId } = useContext(DataContext);

  const basicSelectId = useGeneratedHtmlId({ prefix: "basicSelect" });
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [classList, setClassList] = useState<Classes[]>([]);
  const [value, setValue] = useState("");
  const [sending, setSending] = useState(false);
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

  const handlePost = async () => {
    let toast;
    setSending(true);
    const patternName = /^[a-zA-Z]+$/;
    const patternEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const test = {
      name: name === "" ? true : false || !patternName.test(name),
      surname: surname === "" ? true : false || !patternName.test(surname),
      email: email === "" || !patternEmail.test(email) ? true : false,
    };
    setErrorList(test);
    if (!test.name && !test.surname && !test.email) {
      try {
        const item = {
          Name: name,
          Surname: surname,
          Email: email,
          Class: value,
        };
        const answer: boolean = await postUser(item);
        console.log(answer);
        if (answer) {
          toast = {
            id: `toast${toastId}`,
            title: "Uspeh",
            color: "success",
            text: (
              <>
                <p>
                  Uspešno ste dodali {role === "u" ? "učenika" : "profesora"}{" "}
                  pod imenom '{name}'
                </p>
              </>
            ),
          };
        } else {
          toast = {
            id: `toast${toastId}`,
            title: "Greška",
            color: "danger",
            text: (
              <>
                <p>
                  {role === "u" ? "Učenik" : "Profesor"} sa ovim email-om
                  postoji!
                </p>
              </>
            ),
          };
        }
      } catch (error) {
        console.log(error.message);
        toast = {
          id: `toast${toastId}`,
          title: "Greška",
          color: "danger",
          text: (
            <>
              <p>Došlo je do greške prilikom dodavanja </p>
            </>
          ),
        };
      } finally {
        setToasts((prev) => [...prev, toast]);
        setToastId(toastId + 1);
        setName("");
        setSurname("");
        setEmail("");
      }
    } else {
      toast = {
        id: `toast${toastId}`,
        title: "Greška",
        color: "danger",
        text: (
          <>
            {name === "" && <p> &gt; Ime nije popunjeno!</p>}
            {patternName.test(name) && <p> &gt; Ime mogu biti samo slova!</p>}
            {surname === "" && <p> &gt; Prezime nije popunjeno!</p>}
            {patternName.test(surname) && (
              <p> &gt; Prezime mogu biti samo slova!</p>
            )}
            {email === "" && <p>&gt; Email nije popunjen!</p>}
            {email !== "" && patternEmail.test(email) && (
              <p>&gt; Email nije u dobrom formatu!</p>
            )}
          </>
        ),
      };
      setToasts((prev) => [...prev, toast]);
      setToastId(toastId + 1);
    }
    setSending(false);
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
                <EuiText className="titleText">
                  Dodajte jednog {role === "u" ? "učenika" : "profesora"}
                </EuiText>
              }
            ></EuiTitle>
            <EuiText className="subtitleText">
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
            className="inputAll"
            accept=""
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
            className="inputAll"
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
            className="inputAll"
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
                className="inputAll"
              />
            </>
          )}
        </EuiFlexItem>

        <EuiFlexItem>
          <EuiButton
            disabled={sending}
            fill={true}
            onClick={() => handlePost()}
          >{`Dodajte ${role === "u" ? "učenika" : "profesora"}`}</EuiButton>
        </EuiFlexItem>
      </EuiFlexGroup>
    </EuiPageSection>
  );
}
