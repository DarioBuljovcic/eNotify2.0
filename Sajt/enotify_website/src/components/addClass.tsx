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
  EuiSelect,
  EuiComboBox,
  EuiFilePickerProps,
} from "@elastic/eui";
import { AddClassProps, dataClass, DropdownUsers } from "../types/types";

export default function AddClass({
  postClass,
  getProfessors,
  getAllClasses,
  DataContext,
}: AddClassProps) {
  const { setToasts, toastId, setToastId } = useContext(DataContext);

  const filePickerId = useGeneratedHtmlId({ prefix: "filePicker" });
  const basicSelectId = useGeneratedHtmlId({ prefix: "basicSelect" });
  const [name, setName] = useState("");
  const [professorList, setProfessorList] = useState<DropdownUsers[]>([]);
  const [value, setValue] = useState("");
  const [selectedClasses, setSelectedClasses] = useState<DropdownUsers[]>([]);
  const [allClasses, setClasses] = useState<dataClass[]>();
  const [sending, setSending] = useState(false);
  const filePickerRef = useRef<
    LegacyRef<Omit<EuiFilePickerProps, "stylesMemoizer">> | undefined
  >(undefined);

  const [errorList, setErrorList] = useState({
    name: false,
    professorList: false,
  });
  const [file, setFiles] = useState<File>();
  const onChangeFile = (file) => {
    let toast;

    if (file[0]) {
      console.log(file[0]);
      const validateImage = (file) => {
        const validImageTypes = ["image/jpeg", "image/png", "image/gif"];
        return validImageTypes.includes(file.type);
      };

      if (validateImage(file[0])) setFiles(file[0]);
      else {
        toast = {
          id: `toast${toastId}`,
          title: "Greška",
          color: "danger",
          text: (
            <>
              <p> Fajl nije dobrog formata!</p>
            </>
          ),
        };
        setToasts((prev) => [...prev, toast]);
        setToastId(toastId + 1);
      }
    }
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
        console.log(getAllClasses);
        const classes: dataClass[] = await getAllClasses();
        setClasses(classes);
      };
      if (professorList.length === 0) funk();
    }
  }, []);

  const handlePost = async () => {
    let toast;
    setSending(true);
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
        if (allClasses?.some((obj) => obj.Class === name)) {
          toast = {
            id: `toast${toastId}`,
            title: "Greška",
            color: "danger",
            text: (
              <>
                <p>Razred '{name}' već postoji</p>
              </>
            ),
          };
        } else if (/^[1-4][A-Z]{3}$/.test(name)) {
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
        } else {
          toast = {
            id: `toast${toastId}`,
            title: "Greška",
            color: "danger",
            text: (
              <>
                <p>Naziv razreda nije dobar</p>
                <p>
                  Mora da počinje sa brojem od 1-4 i da sva slova budu velika
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
              <p>Došlo je do greške prilikom dodavanja razreda</p>
            </>
          ),
        };
      } finally {
        setToasts((prev) => [...prev, toast]);
        setToastId(toastId + 1);
        setFiles(undefined);
        setName("");
        setSelectedClasses([]);
        console.log(filePickerRef);
        if (filePickerRef.current) filePickerRef.current.removeFiles();
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
              children={<p className="titleText">Dodavanje razreda</p>}
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
            ref={filePickerRef}
            initialPromptText="Izaberite ili prevucite sliku rasporeda"
            onChange={onChangeFile}
            display="default"
            aria-label="Use aria labels when no actual label is in use"
            accept="image/*"
          />
        </EuiFlexItem>

        <EuiFlexItem>
          <EuiButton
            fill={true}
            onClick={() => handlePost()}
            disabled={sending}
          >
            Dodajte razred
          </EuiButton>
        </EuiFlexItem>
      </EuiFlexGroup>
    </EuiPageSection>
  );
}
