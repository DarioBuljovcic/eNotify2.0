import React, { useContext, useEffect, useState } from "react";
import {
  ClassesNotification,
  dataNotification,
  dataUsers,
  optionsNotification,
} from "../types/types";
import {
  EuiButton,
  EuiButtonEmpty,
  EuiComboBox,
  EuiConfirmModal,
  EuiDatePicker,
  EuiDescriptionListDescription,
  EuiDescriptionListTitle,
  EuiFieldText,
  EuiFlyout,
  EuiFlyoutBody,
  EuiFlyoutFooter,
  EuiFlyoutHeader,
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

export const FlyoutUser = ({
  newValue,
  rowIndex,
  setNewValue,
  closeFlyout,
  isFlyoutVisible,
  DataContext,
}) => {
  const { searchData, setData, editData, addition } = useContext(DataContext);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedClass, setSelectedClass] = useState(
    addition.find((obj) => obj.text === searchData[rowIndex].Class)
  );
  const handleEdit = async () => {
    editData(searchData[rowIndex] as dataUsers, newValue as dataUsers);
    const newData = [...searchData];
    newData[rowIndex] = newValue;
    console.log(newData);
    setData(newData);
    closeFlyout();
  };

  const handleChange = (value, key) => {
    setNewValue((prev) => ({ ...prev, [key]: value }));
    console.log(value);
  };
  const handleSelectChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedValue = e.target.value;
    const selectedClassObject = addition.find(
      (cls) => cls.value === selectedValue
    );
    setSelectedClass(selectedClassObject || null);
    handleChange(selectedValue || null, "Class");
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
              <EuiSelect
                options={addition}
                value={selectedClass ? selectedClass.value : ""}
                onChange={handleSelectChange}
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
export const FlyoutNotification = ({
  newValue,
  rowIndex,
  setNewValue,
  closeFlyout,
  isFlyoutVisible,
  DataContext,
}) => {
  const { searchData, setData, editData, addition } = useContext(DataContext);
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
        console.log(searchData[rowIndex]);
        const selected: optionsNotification[] = [];
        searchData[rowIndex].Class.forEach((d: any) => {
          console.log(d);
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
    console.log(newValue);
    editData(
      searchData[rowIndex] as dataNotification,
      newValue as dataNotification
    );
    const newData = [...searchData];
    newData[rowIndex] = newValue;
    console.log(newData);
    setData(newData);
    closeFlyout();
  };

  const handleChange = (value, key) => {
    setNewValue((prev) => ({ ...prev, [key]: value }));
    console.log(value);
  };
  const onChangeClass = (selected) => {
    console.log(selected);
    const selectedLabels = selected.map((option) => option.value);
    // Check if 'Always Alone' is selected with any other option
    if (
      selectedLabels.includes(alwaysAlone.options[0].value) &&
      selectedLabels.length > 1
    ) {
      setModalConfirm(false);
      setModalHeader("Greška");
      setModalText(
        `Opcija 'Svi razredi' ne može da se meša sa drugim opcijama`
      );
      setIsModalVisible(true);
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
      setModalConfirm(false);
      setModalHeader("Greška");
      setModalText(`Opcija sa razredima ne može da se meša sa godinama`);
      setIsModalVisible(true);
      return;
    }

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

            <EuiDescriptionListTitle>Datum</EuiDescriptionListTitle>
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
