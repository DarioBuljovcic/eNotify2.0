import React, { useContext, useEffect, useRef, useState } from "react";
import {
  ClassesNotification,
  dataNotification,
  dataUsers,
  DropdownUsers,
  optionsNotification,
  gridDataContext,
  PropfFlyout,
  dataClass,
} from "../types/types";
import {
  EuiButton,
  EuiButtonEmpty,
  EuiComboBox,
  EuiDescriptionListDescription,
  EuiDescriptionListTitle,
  EuiFieldText,
  EuiFlyout,
  EuiFlyoutBody,
  EuiFlyoutFooter,
  EuiFlyoutHeader,
  EuiIcon,
  EuiImage,
  EuiModal,
  EuiModalBody,
  EuiModalFooter,
  EuiModalHeader,
  EuiModalHeaderTitle,
  EuiSelect,
  EuiSpacer,
  EuiTextArea,
  EuiTitle,
} from "@elastic/eui";
import moment from "moment";
import { getImage } from "../lib/firebase";

const Modal = ({
  onConfirm,
  onCancel,
  modalVisible,
  Title,
  Text,
  CancelBtn,
  ConfrimBtn,
  confirm,
}) => {
  const buttons = () => {
    if (confirm) {
      return (
        <EuiModalFooter>
          <EuiButton onClick={onConfirm} fill>
            {ConfrimBtn}
          </EuiButton>
          <EuiButton onClick={onCancel} fill>
            {CancelBtn}
          </EuiButton>
        </EuiModalFooter>
      );
    } else {
      return (
        <EuiModalFooter>
          <EuiButton onClick={onCancel} fill>
            Spusti
          </EuiButton>
        </EuiModalFooter>
      );
    }
  };

  if (modalVisible) {
    return (
      <EuiModal onClose={onCancel}>
        <EuiModalHeader>
          <EuiModalHeaderTitle>{Title}</EuiModalHeaderTitle>
        </EuiModalHeader>

        <EuiModalBody>
          {Text}
          <EuiSpacer />
        </EuiModalBody>
        {buttons()}
      </EuiModal>
    );
  }
  return <></>;
};

export const FlyoutStudent = ({
  newValue,
  rowIndex,
  setNewValue,
  closeFlyout,
  isFlyoutVisible,
  DataContext,
  ToastContext,
}: PropfFlyout) => {
  const { setToasts, toastId, setToastId } = useContext(ToastContext);

  const { searchData, GetSetData, editData, addition, dataType } =
    useContext(DataContext);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [selectedClass, setSelectedClass] = useState<dataClass[]>([]);

  useEffect(() => {
    const additionArray: dataClass | undefined = addition.find(
      (obj) => obj.text === searchData[rowIndex].Class
    ) as dataClass | undefined;
    if (additionArray === undefined) setSelectedClass([]);
    else setSelectedClass([additionArray]);
  }, []);
  const handleEdit = async () => {
    let toast;
    try {
      await editData(searchData[rowIndex] as dataUsers, newValue as dataUsers);

      GetSetData();
      closeFlyout();
      toast = {
        id: `toast${toastId}`,
        title: "Uspeh",
        color: "success",
        text: (
          <>
            <p>
              Uspešno ste izmenili{" "}
              {dataType === "Student" ? "učenika" : "profesora"} '
              {searchData[rowIndex].Name}'
            </p>
          </>
        ),
      };
      setToasts((prev) => [...prev, toast]);
      setToastId(toastId + 1);
      setIsModalVisible(false);
    } catch (error) {
      toast = {
        id: `toast${toastId}`,
        title: "Greška",
        color: "danger",
        text: (
          <>
            <p>
              Došlo je do greške pirlikom izmene{" "}
              {dataType === "Student" ? "učenika" : "profesora"} '
              {searchData[rowIndex].Name}'
            </p>
          </>
        ),
      };
      setToasts((prev) => [...prev, toast]);
      setToastId(toastId + 1);
      closeFlyout();
      setIsModalVisible(false);
    }
  };

  const handleChange = (value: any, key: string) => {
    setNewValue(
      (prev: dataUsers | dataNotification | dataClass) =>
        ({
          ...prev,
          [key]: value,
        } as dataUsers | dataNotification | dataClass)
    );
  };

  const onChangeCombo = (selected) => {
    setSelectedClass(selected);
    if (selected[0]) handleChange(selected[0].text, "Class");
    else handleChange("", "Class");
  };

  if (isFlyoutVisible) {
    return (
      <>
        <Modal
          Title="Izmena"
          Text="Da li ste sigurni da želite da izmenite?"
          ConfrimBtn="Da"
          CancelBtn="Ne"
          modalVisible={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          onConfirm={handleEdit}
          confirm={true}
        />

        <EuiFlyout
          aria-labelledby="flyoutTitle"
          onClose={closeFlyout}
          ownFocus
          size="s"
        >
          <EuiFlyoutHeader hasBorder>
            <EuiTitle size="m">
              <h2 id="flyoutTitle">Izmena</h2>
            </EuiTitle>
          </EuiFlyoutHeader>

          <EuiFlyoutBody>
            <EuiDescriptionListTitle>Naziv</EuiDescriptionListTitle>
            <EuiDescriptionListDescription style={{ maxWidth: 300 }}>
              <EuiFieldText
                value={newValue["Name"]}
                onChange={(e) => handleChange(e.target.value, "Name")}
              />
            </EuiDescriptionListDescription>
            <EuiSpacer />
            <EuiDescriptionListTitle>Email</EuiDescriptionListTitle>
            <EuiDescriptionListDescription style={{ maxWidth: 300 }}>
              <EuiFieldText
                value={newValue["Email"]}
                onChange={(e) => handleChange(e.target.value, "Email")}
              />
            </EuiDescriptionListDescription>
            <EuiSpacer />
            <EuiDescriptionListTitle>Razred</EuiDescriptionListTitle>
            <EuiDescriptionListDescription style={{ maxWidth: 300 }}>
              <EuiComboBox
                options={addition as dataClass[]}
                onChange={onChangeCombo}
                selectedOptions={selectedClass}
                isClearable={true}
                singleSelection={true}
              />
            </EuiDescriptionListDescription>

            <EuiSpacer />
            <EuiButton onClick={() => setIsModalVisible(true)}>
              Izmeni
            </EuiButton>
          </EuiFlyoutBody>

          <EuiFlyoutFooter>
            <EuiButtonEmpty flush="left" iconType="cross" onClick={closeFlyout}>
              Spusti
            </EuiButtonEmpty>
          </EuiFlyoutFooter>
        </EuiFlyout>
      </>
    );
  }
  return <></>;
};
export const FlyoutProfessor = ({
  newValue,
  rowIndex,
  setNewValue,
  closeFlyout,
  isFlyoutVisible,
  DataContext,
  ToastContext,
}: PropfFlyout) => {
  const { setToasts, toastId, setToastId } = useContext(ToastContext);

  const { searchData, GetSetData, editData, addition, dataType } =
    useContext(DataContext);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [selectedClass, setSelectedClass] = useState<dataClass[]>([]);
  const [image, setImage] = useState();

  useEffect(() => {
    const getImg = async () => {
      const image = await getImage(newValue.Table);
      setImage(image);
    };
    getImg();
    const additionArray: dataClass | undefined = addition.find(
      (obj) => obj.text === searchData[rowIndex].Class
    ) as dataClass | undefined;
    if (additionArray === undefined) setSelectedClass([]);
    else setSelectedClass([additionArray]);
  }, []);

  const handleEdit = async () => {
    let toast;
    try {
      editData(searchData[rowIndex] as dataUsers, newValue as dataUsers);
      GetSetData();
      closeFlyout();
      toast = {
        id: `toast${toastId}`,
        title: "Uspeh",
        color: "success",
        text: (
          <>
            <p>
              Uspešno ste izmenili{" "}
              {dataType === "Student" ? "učenika" : "profesora"} '
              {searchData[rowIndex].Name}'
            </p>
          </>
        ),
      };
      setToasts((prev) => [...prev, toast]);
      setToastId(toastId + 1);
      setIsModalVisible(false);
    } catch (error) {
      toast = {
        id: `toast${toastId}`,
        title: "Greška",
        color: "danger",
        text: (
          <>
            <p>
              Došlo je do greške pirlikom izmene{" "}
              {dataType === "Student" ? "učenika" : "profesora"} '
              {searchData[rowIndex].Name}'
            </p>
          </>
        ),
      };
      setToasts((prev) => [...prev, toast]);
      setToastId(toastId + 1);
      closeFlyout();
      setIsModalVisible(false);
    }
  };

  const handleChange = (value: any, key: string) => {
    setNewValue(
      (prev: dataUsers | dataNotification | dataClass) =>
        ({
          ...prev,
          [key]: value,
        } as dataUsers | dataNotification | dataClass)
    );
  };

  const fileInputRef = useRef<HTMLInputElement>(null);
  const onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      handleChange(file, "Table");
      const reader = new FileReader();

      reader.onload = function (e) {
        setImage(e.target?.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleEditTable = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  if (isFlyoutVisible) {
    return (
      <>
        <Modal
          Title="Izmena"
          Text="Da li ste sigurni da želite da izmenite?"
          ConfrimBtn="Da"
          CancelBtn="Ne"
          modalVisible={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          onConfirm={handleEdit}
          confirm={true}
        />

        <EuiFlyout
          aria-labelledby="flyoutTitle"
          onClose={closeFlyout}
          ownFocus
          size="s"
        >
          <EuiFlyoutHeader hasBorder>
            <EuiTitle size="m">
              <h2 id="flyoutTitle">Izmena</h2>
            </EuiTitle>
          </EuiFlyoutHeader>

          <EuiFlyoutBody>
            <EuiDescriptionListTitle>Naziv</EuiDescriptionListTitle>
            <EuiDescriptionListDescription style={{ maxWidth: 300 }}>
              <EuiFieldText
                value={newValue["Name"]}
                onChange={(e) => handleChange(e.target.value, "Name")}
              />
            </EuiDescriptionListDescription>

            <EuiSpacer />

            <EuiDescriptionListTitle>Email</EuiDescriptionListTitle>
            <EuiDescriptionListDescription style={{ maxWidth: 300 }}>
              <EuiFieldText
                value={newValue["Email"]}
                onChange={(e) => handleChange(e.target.value, "Email")}
              />
            </EuiDescriptionListDescription>

            <EuiSpacer />

            <EuiDescriptionListTitle>Raspored</EuiDescriptionListTitle>
            <EuiDescriptionListDescription style={{ maxWidth: 300 }}>
              <EuiFieldText
                value={newValue["Table"]}
                disabled={true}
                append={
                  <button onClick={handleEditTable} style={{ height: "100%" }}>
                    <input
                      type="file"
                      accept="image/png, image/gif, image/jpeg"
                      style={{ display: "none" }}
                      onChange={onChange}
                      ref={fileInputRef}
                    />
                    <EuiIcon type="documentEdit"></EuiIcon>
                  </button>
                }
              />

              <EuiImage src={image} alt="Prikaz slike rasporeda" />
            </EuiDescriptionListDescription>

            <EuiSpacer />
            <EuiButton onClick={() => setIsModalVisible(true)}>
              Izmeni
            </EuiButton>
          </EuiFlyoutBody>

          <EuiFlyoutFooter>
            <EuiButtonEmpty flush="left" iconType="cross" onClick={closeFlyout}>
              Spusti
            </EuiButtonEmpty>
          </EuiFlyoutFooter>
        </EuiFlyout>
      </>
    );
  }
  return <></>;
};
export const FlyoutNotification = ({
  newValue,
  rowIndex,
  setNewValue,
  closeFlyout,
  isFlyoutVisible,
  DataContext,
  ToastContext,
}: PropfFlyout) => {
  const { setToasts, toastId, setToastId } = useContext(ToastContext);

  const { searchData, GetSetData, editData, addition } =
    useContext(DataContext);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [classList, setClassList] = useState<ClassesNotification[]>();
  const [selectedClasses, setSelectedClasses] = useState<optionsNotification[]>(
    []
  );
  const [modalHeader, setModalHeader] = useState("");
  const [modalText, setModalText] = useState("");
  const [modalConfirm, setModalConfirm] = useState(true);

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
      const classes: ClassesNotification[] = [alwaysAlone, groupOptions];
      if (otherOptions.options.length === 0) {
        addition.forEach((d: any) => {
          otherOptions.options.push({
            label: d.text,
            value: d.value,
          });
        });
        const selected: optionsNotification[] = [];
        searchData[rowIndex].Class.forEach((d: any) => {
          selected.push({
            label: d,
            value: d,
          });
        });
        classes.push(otherOptions);
        setSelectedClasses(selected);
        setClassList(classes);
      }
    };
    funk();
  }, []);

  const handleEdit = async () => {
    let toast;
    try {
      await editData(
        searchData[rowIndex] as dataNotification,
        newValue as dataNotification
      );
      const newData = [...searchData];
      newData[rowIndex] = newValue;

      GetSetData();
      closeFlyout();
      toast = {
        id: `toast${toastId}`,
        title: "Uspeh",
        color: "success",
        text: (
          <>
            <p>Uspešno ste izmenili obaveštenje</p>
          </>
        ),
      };
      setToasts((prev) => [...prev, toast]);
      setToastId(toastId + 1);
      setIsModalVisible(false);
    } catch (error) {
      toast = {
        id: `toast${toastId}`,
        title: "Greška",
        color: "danger",
        text: (
          <>
            <p>Došlo je do greške pirlikom izmene obaveštenja</p>
          </>
        ),
      };
      setToasts((prev) => [...prev, toast]);
      setToastId(toastId + 1);
      setIsModalVisible(false);
      closeFlyout();
    }
  };

  const handleChange = (value, key) => {
    setNewValue((prev) => ({ ...prev, [key]: value }));
  };
  const onChangeClass = (selected) => {
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
            <p>Došlo je do greške prilikom slanja!</p>
          </>
        ),
      };
      setToasts((prev) => [...prev, toast]);
      setToastId(toastId + 1);
      return;
    }

    // Check if group options are mixed with other options

    setSelectedClasses(selected);
    let classes: string[] = [];
    selected.forEach((element: optionsNotification) => {
      classes.push(element.label);
    });
    handleChange(classes, "Class");
  };
  const handleSubmit = () => {
    setModalConfirm(true);
    setModalHeader("Izmena");
    setModalText(`Da li ste sigurni da želite da izvršite ovu izmenu?`);
    setIsModalVisible(true);
  };

  if (isFlyoutVisible) {
    return (
      <>
        <Modal
          Title={modalHeader}
          Text={modalText}
          ConfrimBtn="Da"
          CancelBtn="Ne"
          modalVisible={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          onConfirm={handleEdit}
          confirm={modalConfirm}
        />

        <EuiFlyout
          aria-labelledby="flyoutTitle"
          onClose={closeFlyout}
          ownFocus
          size="s"
        >
          <EuiFlyoutHeader hasBorder>
            <EuiTitle size="m">
              <h2 id="flyoutTitle">Izmena</h2>
            </EuiTitle>
          </EuiFlyoutHeader>

          <EuiFlyoutBody>
            <EuiDescriptionListTitle>Naslov</EuiDescriptionListTitle>
            <EuiDescriptionListDescription style={{ maxWidth: 300 }}>
              <EuiFieldText
                value={newValue["Title"]}
                onChange={(e) => handleChange(e.target.value, "Title")}
              />
            </EuiDescriptionListDescription>

            <EuiSpacer />

            <EuiDescriptionListTitle>Tekst</EuiDescriptionListTitle>
            <EuiDescriptionListDescription style={{ maxWidth: 300 }}>
              <EuiTextArea
                value={newValue["Text"]}
                onChange={(e) => handleChange(e.target.value, "Text")}
              />
            </EuiDescriptionListDescription>

            <EuiSpacer />

            <EuiDescriptionListTitle>Poslato razredima</EuiDescriptionListTitle>
            <EuiDescriptionListDescription style={{ maxWidth: 300 }}>
              <EuiComboBox
                aria-label="Accessible screen reader label"
                placeholder="Izaberite razrede"
                options={classList}
                selectedOptions={selectedClasses}
                onChange={onChangeClass}
                data-test-subj="demoComboBox"
                isClearable={true}
              />
            </EuiDescriptionListDescription>

            <EuiSpacer />

            <EuiButton onClick={handleSubmit}>Izmeni</EuiButton>
          </EuiFlyoutBody>

          <EuiFlyoutFooter>
            <EuiButtonEmpty flush="left" iconType="cross" onClick={closeFlyout}>
              Spusti
            </EuiButtonEmpty>
          </EuiFlyoutFooter>
        </EuiFlyout>
      </>
    );
  }
  return <></>;
};
export const FlyoutClasses = ({
  newValue,
  rowIndex,
  setNewValue,
  closeFlyout,
  isFlyoutVisible,
  DataContext,
  ToastContext,
}: PropfFlyout) => {
  const { setToasts, toastId, setToastId } = useContext(ToastContext);

  const { data, editData, addition, GetSetData, searchData } =
    useContext(DataContext);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [professorList, setProfessorList] = useState<DropdownUsers[]>([]);
  const [value, setValue] = useState<string>(newValue.Professor);
  const [selectedProfessors, setSelectedProfessors] = useState<DropdownUsers[]>(
    []
  );
  const [modalHeader, setModalHeader] = useState("");
  const [modalText, setModalText] = useState("");
  const [modalConfirm, setModalConfirm] = useState(true);
  const [image, setImage] = useState("");

  useEffect(() => {
    const funk = async () => {
      const profs: DropdownUsers[] = [];
      const selectedProfs: DropdownUsers[] = [];

      const image = await getImage(newValue.url);

      setImage(image);

      addition.forEach((d) => {
        if (d.Name === newValue.Professor) setValue(d.UserID);
        profs.push({
          value: d.UserID,
          text: d.Name,
          label: `${d.Name} (${d.Email})`,
        });
        if (newValue.ProfessorsList.includes(d.Name)) {
          selectedProfs.push({
            value: d.UserID,
            text: d.Name,
            label: `${d.Name} (${d.Email})`,
          });
        }
      });
      setProfessorList([...profs]);
      setSelectedProfessors([...selectedProfs]);
    };
    if (professorList.length === 0) funk();
  }, []);
  const onChangeCombo = (selected) => {
    setSelectedProfessors(selected);
    let profs = "";
    selected.forEach((s) => {
      profs += `${s.label},`;
    });
    handleChange(profs, "ProfessorsList");
  };

  const handleEdit = async () => {
    let toast;
    try {
      let ProfessorsList = "";
      let Professor;
      professorList.forEach((prof) => {
        if (newValue.ProfessorsList.includes(prof.label))
          ProfessorsList += `${prof.value},`;
        if (newValue.Professor === prof.text) Professor = prof.value;
      });
      const setValue = {
        Class: newValue.Class,
        Professor: Professor,
        ProfessorsList: ProfessorsList,
      };

      await editData(data[rowIndex], setValue);

      toast = {
        id: `toast${toastId}`,
        title: "Uspeh",
        color: "success",
        text: (
          <>
            <p>Uspešno ste izmenili razred</p>
          </>
        ),
      };
      setToasts((prev) => [...prev, toast]);
      setToastId(toastId + 1);
      GetSetData();
      setIsModalVisible(false);
      closeFlyout();
    } catch (error) {
      toast = {
        id: `toast${toastId}`,
        title: "Greška",
        color: "danger",
        text: (
          <>
            <p>Došlo je do greške prilikom izmene razreda</p>
          </>
        ),
      };
      setToasts((prev) => [...prev, toast]);
      setToastId(toastId + 1);
      setIsModalVisible(false);
      closeFlyout();
    }
  };

  const handleChange = (value, key) => {
    setNewValue((prev) => ({ ...prev, [key]: value }));
  };
  const handleSubmit = () => {
    setModalConfirm(true);
    setModalHeader("Izmena");
    setModalText(`Da li ste sigurni da želite da izvršite ovu izmenu?`);
    setIsModalVisible(true);
  };
  const fileInputRef = useRef<HTMLInputElement>(null);
  const onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      handleChange(file, "Table");
      const reader = new FileReader();

      reader.onload = function (e) {
        setImage(e.target?.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleEditTable = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  if (isFlyoutVisible) {
    return (
      <>
        <Modal
          Title={modalHeader}
          Text={modalText}
          ConfrimBtn="Da"
          CancelBtn="Ne"
          modalVisible={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          onConfirm={handleEdit}
          confirm={modalConfirm}
        />

        <EuiFlyout
          aria-labelledby="flyoutTitle"
          onClose={closeFlyout}
          ownFocus
          size="s"
        >
          <EuiFlyoutHeader hasBorder>
            <EuiTitle size="m">
              <h2 id="flyoutTitle">Izmena</h2>
            </EuiTitle>
          </EuiFlyoutHeader>

          <EuiFlyoutBody>
            <EuiDescriptionListTitle>Razred</EuiDescriptionListTitle>
            <EuiDescriptionListDescription style={{ maxWidth: 300 }}>
              <EuiFieldText
                value={newValue["Class"]}
                onChange={(e) => handleChange(e.target.value, "Class")}
                disabled={true}
              />
            </EuiDescriptionListDescription>

            <EuiSpacer />

            <EuiDescriptionListTitle>Razredni</EuiDescriptionListTitle>
            <EuiDescriptionListDescription style={{ maxWidth: 300 }}>
              <EuiSelect
                options={professorList}
                value={value}
                onChange={(e) => {
                  setValue(e.target.value);
                }}
              />
            </EuiDescriptionListDescription>

            <EuiSpacer />

            <EuiDescriptionListTitle>Profesori</EuiDescriptionListTitle>
            <EuiDescriptionListDescription style={{ maxWidth: 300 }}>
              <EuiComboBox
                aria-label="Accessible screen reader label"
                placeholder="Izaberite profesore"
                options={professorList}
                selectedOptions={selectedProfessors}
                onChange={onChangeCombo}
                data-test-subj="demoComboBox"
                isClearable={true}
              />
            </EuiDescriptionListDescription>

            <EuiSpacer />

            <EuiDescriptionListTitle>Raspored</EuiDescriptionListTitle>
            <EuiDescriptionListDescription style={{ maxWidth: 300 }}>
              <EuiFieldText
                value={newValue["Table"]}
                disabled={true}
                append={
                  <button onClick={handleEditTable} style={{ height: "100%" }}>
                    <input
                      type="file"
                      accept="image/png, image/gif, image/jpeg"
                      style={{ display: "none" }}
                      onChange={onChange}
                      ref={fileInputRef}
                    />
                    <EuiIcon type="documentEdit"></EuiIcon>
                  </button>
                }
              />

              <EuiImage src={image as string} alt="Prikaz slike rasporeda" />
            </EuiDescriptionListDescription>

            <EuiSpacer />

            <EuiButton onClick={handleSubmit}>Izmeni</EuiButton>
          </EuiFlyoutBody>

          <EuiFlyoutFooter>
            <EuiButtonEmpty flush="left" iconType="cross" onClick={closeFlyout}>
              Spusti
            </EuiButtonEmpty>
          </EuiFlyoutFooter>
        </EuiFlyout>
      </>
    );
  }
  return <></>;
};
