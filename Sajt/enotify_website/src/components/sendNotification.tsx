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
  EuiTextArea,
  EuiComboBox,
  EuiGlobalToastList,
} from "@elastic/eui";
import {
  ClassesNotification,
  PropsNotification,
  optionsNotification,
} from "../types/types";

export default function SendNotification({
  sendNotification,
  setModalHeader,
  setModalText,
  setIsOpen,
  getClasses,
  DataContext,
}: PropsNotification) {
  const { setToasts, toastId, setToastId } = useContext(DataContext);

  const filePickerId = useGeneratedHtmlId({ prefix: "filePicker" });
  const [files, setFiles] = useState<File[]>();
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [classList, setClassList] = useState<ClassesNotification[]>();
  const [selectedClasses, setSelectedClasses] = useState<optionsNotification[]>(
    []
  );
  const [errorList, setErrorList] = useState({
    title: false,
    text: false,
    classList: false,
  });
  const groupOptions: ClassesNotification = {
    label: "Godine",
    options: [
      {
        label: "Prvi razredi",
        value: "Prvi",
      },
      {
        label: "Drugi razredi",
        value: "Drugi",
      },
      {
        label: "Treći razredi",
        value: "Treci",
      },
      {
        label: "Četvrti razredi",
        value: "Cetvrti",
      },
    ],
  };
  const alwaysAlone: ClassesNotification = {
    label: "Svi razredi",
    options: [
      {
        label: "Svi razredi",
        value: "Svi",
      },
    ],
  };
  const otherOptions: ClassesNotification = {
    label: "Razredi",
    options: [],
  };
  useEffect(() => {
    const funk = async () => {
      const data: any = await getClasses();
      const classes: ClassesNotification[] = [alwaysAlone, groupOptions];
      if (otherOptions.options.length === 0) {
        data.forEach((d: any) => {
          otherOptions.options.push({
            label: d.text,
            value: d.value,
          });
        });
        classes.push(otherOptions);
        setClassList(classes);
      }
    };
    funk();
  }, []);

  const onChange = (selected) => {
    console.log(selected);
    const selectedLabels = selected.map((option) => option.value);
    // Check if 'Always Alone' is selected with any other option
    if (
      selectedLabels.includes(alwaysAlone.options[0].value) &&
      selectedLabels.length > 1
    ) {
      setModalHeader("Greška");
      setModalText(
        `Opcija 'Svi razredi' ne može da se meša sa drugim opcijama`
      );
      setIsOpen((prev) => !prev);
      return;
    }

    // Check if group options are mixed with other options
    const hasGroupOptions = selectedLabels.some((value) =>
      groupOptions.options.map((option) => option.value).includes(value)
    );
    const hasOtherOptions = selectedLabels.some((value) =>
      otherOptions.options.map((option) => option.value).includes(value)
    );

    if (hasGroupOptions && hasOtherOptions) {
      setModalHeader("Greška");
      setModalText(`Opcija sa razredima ne može da se meša sa godinama`);
      setIsOpen((prev) => !prev);
      return;
    }

    setSelectedClasses(selected);
  };

  const handlePost = async () => {
    let toast;
    if (title === "")
      setErrorList((prevErrorList) => ({
        ...prevErrorList,
        title: true,
      }));
    if (text === "")
      setErrorList((prevErrorList) => ({
        ...prevErrorList,
        text: true,
      }));
    if (selectedClasses.length === 0)
      setErrorList((prevErrorList) => ({
        ...prevErrorList,
        classList: true,
      }));
    if (title.length > 0 && text.length > 0 && selectedClasses.length > 0) {
      try {
        const classes: string[] = [];
        selectedClasses.forEach((c) => {
          classes.push(c.value);
        });
        const item = {
          Title: title,
          Text: text,
          Classes: classes,
        };

        await sendNotification(files, item);
        toast = {
          id: `toast${toastId}`,
          title: "Uspeh",
          color: "success",
          text: (
            <>
              <p>Uspešno ste poslali obaveštenje!</p>
            </>
          ),
        };
        setToasts((prev) => [...prev, toast]);
        setToastId(toastId + 1);
        setTitle("");
        setText("");
        setSelectedClasses([]);
      } catch (error) {
        toast = {
          id: `toast${toastId}`,
          title: "Greška",
          color: "danger",
          text: (
            <>
              <p>Došlo je do greške prilikom slanja!</p>
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
            <p>Popunite sva polja pre dodavanja!</p>
          </>
        ),
      };
      setToasts((prev) => [...prev, toast]);
      setToastId(toastId + 1);
    }
  };
  const onFileChange = (files) => {
    setFiles(files);
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
              children={<EuiText size="m">Slanje obaveštenja</EuiText>}
            ></EuiTitle>
            <EuiText size="s">Slanje obaveštenja učenicima škole</EuiText>
          </EuiFlexGroup>
        </EuiFlexItem>

        <EuiSpacer />

        <EuiFlexItem style={{ minWidth: 300 }}>
          <EuiFormLabel style={{ fontSize: 16, marginBottom: 10 }}>
            Naslov obaveštenja
          </EuiFormLabel>
          <EuiFieldText
            placeholder="Naslov obaveštenja"
            isInvalid={errorList.title}
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setErrorList((prevErrorList) => ({
                ...prevErrorList,
                title: false,
              }));
            }}
            aria-label="Use aria labels when no actual label is in use"
          />

          <EuiSpacer />

          <EuiFormLabel style={{ fontSize: 16, marginBottom: 10 }}>
            Tekst obaveštenja
          </EuiFormLabel>
          <EuiTextArea
            placeholder="Tekst obaveštenja"
            isInvalid={errorList.text}
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              setErrorList((prevErrorList) => ({
                ...prevErrorList,
                text: false,
              }));
            }}
            aria-label="Use aria labels when no actual label is in use"
          />

          <EuiSpacer />

          <EuiFormLabel style={{ fontSize: 16, marginBottom: 10 }}>
            Dodatak
          </EuiFormLabel>
          <EuiFilePicker
            id={filePickerId}
            multiple
            initialPromptText="Izeberite ili prevucite fajl ili sliku"
            onChange={onFileChange}
            display="default"
            aria-label="Use aria labels when no actual label is in use"
          />
          <EuiSpacer />

          <EuiFormLabel style={{ fontSize: 16, marginBottom: 10 }}>
            Razredi
          </EuiFormLabel>

          <EuiComboBox
            aria-label="Accessible screen reader label"
            placeholder="Izaberite razrede"
            isInvalid={errorList.classList}
            options={classList}
            selectedOptions={selectedClasses}
            onChange={onChange}
            data-test-subj="demoComboBox"
            isClearable={true}
          />
        </EuiFlexItem>

        <EuiFlexItem>
          <EuiButton fill={true} onClick={() => handlePost()}>
            Pošaljite obaveštenje
          </EuiButton>
        </EuiFlexItem>
        <EuiSpacer />
      </EuiFlexGroup>
    </EuiPageSection>
  );
}
