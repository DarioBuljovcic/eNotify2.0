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
  EuiTextArea,
  EuiComboBox,
  euiPaletteColorBlindBehindText,
} from "@elastic/eui";

type Props = {
  sendNotification: (o, p) => void;
  setModalHeader: (o) => void;
  setModalText: (o) => void;
  setIsOpen: (o) => void;
  getClasses: () => void;
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
type options = {
  label: string;
  value: string;
};

type Classes = {
  label: string;
  options: options[];
};

export default function SendNotification({
  sendNotification,
  setModalHeader,
  setModalText,
  setIsOpen,
  getClasses,
}: Props) {
  const filePickerId = useGeneratedHtmlId({ prefix: "filePicker" });
  const [files, setFiles] = useState<File[]>();
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [classList, setClassList] = useState<Classes[]>();
  const [selectedClasses, setSelectedClasses] = useState<options[]>([]);
  const [errorList, setErrorList] = useState({
    title: false,
    text: false,
    classList: false,
  });
  const groupOptions: Classes = {
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
  const alwaysAlone: Classes = {
    label: "Svi razredi",
    options: [
      {
        label: "Svi razredi",
        value: "Svi",
      },
    ],
  };
  const otherOptions: Classes = {
    label: "Razredi",
    options: [],
  };
  useEffect(() => {
    const funk = async () => {
      const data: any = await getClasses();
      const classes: Classes[] = [alwaysAlone, groupOptions];
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

  const handlePost = () => {
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

        sendNotification(files, item);

        setModalHeader("Uspešno dodavanje");
        setModalText(`Uspešno ste poslali obaveštenje!`);
        setIsOpen((prev: boolean) => !prev);

        setTitle("");
        setText("");
        setSelectedClasses([]);
      } catch (error) {
        setModalHeader("Greška");
        setModalText(`Došlo je do greške prilikom slanja obaveštenja!`);
        setIsOpen((prev: boolean) => !prev);
      }
    } else {
      setModalHeader("Greška");
      setModalText(`Popunite sva polja!`);
      setIsOpen((prev: boolean) => !prev);
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
            Tekst obaveštenja
          </EuiFormLabel>
          <EuiFilePicker
            id={filePickerId}
            multiple
            initialPromptText="Select or drag and drop multiple files"
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
          />
        </EuiFlexItem>

        <EuiFlexItem>
          <EuiButton fill={true} onClick={() => handlePost()}>
            Pošaljite obaveštenje
          </EuiButton>
        </EuiFlexItem>
      </EuiFlexGroup>
    </EuiPageSection>
  );
}
