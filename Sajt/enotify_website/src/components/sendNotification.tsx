import React, {
  useState,
  Fragment,
  useEffect,
  useContext,
  useRef,
  LegacyRef,
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
  EuiFieldText,
  EuiFormLabel,
  EuiTextArea,
  EuiComboBox,
  EuiGlobalToastList,
  EuiFilePickerProps,
} from "@elastic/eui";
import {
  ClassesNotification,
  PropsNotification,
  optionsNotification,
} from "../types/types";

export default function SendNotification({
  sendNotification,
  getClasses,
  DataContext,
}: PropsNotification) {
  const { setToasts, toastId, setToastId } = useContext(DataContext);

  const filePickerId = useGeneratedHtmlId({ prefix: "filePicker" });
  const [files, setFiles] = useState<File[]>();
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [classList, setClassList] = useState<ClassesNotification[]>();
  const [sending, setSending] = useState(false);
  const [selectedClasses, setSelectedClasses] = useState<optionsNotification[]>(
    []
  );
  const filePickerRef = useRef<
    LegacyRef<Omit<EuiFilePickerProps, "stylesMemoizer">> | undefined
  >(undefined);

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
  let otherOptions: ClassesNotification = {
    label: "Razredi",
    options: [],
  };
  useEffect(() => {
    const funk = async () => {
      const data: any = await getClasses();
      const classes: ClassesNotification[] = [alwaysAlone, groupOptions];
      if (otherOptions.options.length === 0 && data.length > 0) {
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
    let toast;
    const selectedLabels = selected.map((option) => option.value);
    // Check if 'Always Alone' is selected with any other option
    if (
      selectedLabels.includes(alwaysAlone.options[0].value) &&
      selectedLabels.length > 1
    ) {
      toast = {
        id: `toast${toastId}`,
        title: "Greška",
        color: "danger",
        text: (
          <>
            <p>Opcija 'Svi razredi' ne može da se meša sa drugim opcijama</p>
          </>
        ),
      };
      setToasts((prev) => [...prev, toast]);
      setToastId(toastId + 1);
      return;
    }

    setSelectedClasses(selected);
  };

  const handlePost = async () => {
    let toast;
    setSending(true);
    setErrorList({
      title: title === "" ? true : false,
      text: text === "" ? true : false,
      classList: selectedClasses.length === 0 ? true : false,
    });

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
          Files: files,
        };
        console.log(files);
        await sendNotification(item);
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
        setFiles([]);
        if (filePickerRef.current) filePickerRef.current.removeFiles();
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
    setSending(false);
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
            className="inputAll"
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
            className="inputAll"
          />

          <EuiSpacer />

          <EuiFormLabel style={{ fontSize: 16, marginBottom: 10 }}>
            Dodatak
          </EuiFormLabel>
          <EuiFilePicker
            ref={filePickerRef}
            id={filePickerId}
            multiple
            initialPromptText="Izeberite ili prevucite fajl ili sliku"
            onChange={onFileChange}
            display="default"
            aria-label="Use aria labels when no actual label is in use"
            className="inputAll"
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
          <EuiButton
            fill={true}
            onClick={() => handlePost()}
            disabled={sending}
          >
            Pošaljite obaveštenje
          </EuiButton>
        </EuiFlexItem>
        <EuiSpacer />
      </EuiFlexGroup>
    </EuiPageSection>
  );
}
