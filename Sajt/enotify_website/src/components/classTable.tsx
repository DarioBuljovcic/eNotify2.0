import React, { useState, useEffect, useRef } from "react";
import {
  EuiFlexGroup,
  EuiFlexItem,
  EuiText,
  EuiPageSection,
  EuiTitle,
  EuiFormLabel,
  EuiSelect,
  EuiImage,
  EuiIcon,
  EuiPopover,
} from "@elastic/eui";

type Props = {
  setModalHeader: (o) => void;
  setModalText: (o) => void;
  setIsOpen: (o) => void;
  getClasses: () => void;
  getImage: (o) => void;
  setImage: (o, p) => void;
};

type Classes = {
  value: string;
  text: string;
  url: string;
  professorsList: string;
  professor: string;
};

export default function ClassTable({ getClasses, getImage, setImage }: Props) {
  const [classList, setClassList] = useState<Classes[]>([]);
  const [selectedClass, setSelectedClass] = useState<Classes | null>(null);
  const [tableImage, setTableImage] = useState("");
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fetchClasses = async () => {
    const data: any = await getClasses();
    setClassList([...data]);
    setSelectedClass(data[0]);
    const image = await getImage(data[0].url);
    console.log(image);
    setTableImage(image !== undefined ? image : "");
  };
  useEffect(() => {
    if (classList.length === 0) fetchClasses();
  }, [classList.length]);

  const handleSelectChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedValue = e.target.value;
    const selectedClassObject = classList.find(
      (cls) => cls.value === selectedValue
    );
    const image = await getImage(selectedClassObject?.url);
    setTableImage(image !== undefined ? image : "");
    setSelectedClass(selectedClassObject || null);
  };
  const handleEdit = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  const onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await setImage(selectedClass?.value, file);
      console.log("done?");
      const image = await getImage(file.name);
      setTableImage(image !== undefined ? image : "");
    }
  };

  const closePopover = () => setIsPopoverOpen(false);
  const button = (
    <button
      onClick={handleEdit}
      onMouseEnter={() => setIsPopoverOpen(true)}
      onMouseLeave={() => setIsPopoverOpen(false)}
      style={{ height: "100%" }}
    >
      <input
        type="file"
        style={{ display: "none" }}
        onChange={onChange}
        ref={fileInputRef}
      />
      <EuiIcon type="documentEdit"></EuiIcon>
    </button>
  );
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
            <EuiTitle size="m">
              <p className="titleText">Pregled rasporeda</p>
            </EuiTitle>
            <EuiText size="s">Dodavanje i izmena rasporeda po razredu</EuiText>
          </EuiFlexGroup>
        </EuiFlexItem>

        <EuiFlexItem style={{ minWidth: 300 }}>
          <EuiFormLabel style={{ fontSize: 16, marginBottom: 10 }}>
            Razred
          </EuiFormLabel>
          <EuiSelect
            options={classList}
            value={selectedClass ? selectedClass.value : ""}
            onChange={handleSelectChange}
            aria-label="Use aria labels when no actual label is in use"
            append={
              <EuiPopover
                button={button}
                isOpen={isPopoverOpen}
                closePopover={closePopover}
              >
                <EuiText>
                  <p>Izmenite sliku</p>
                </EuiText>
              </EuiPopover>
            }
          />
        </EuiFlexItem>
        <EuiFlexItem style={{ minWidth: 300 }}>
          <EuiImage src={tableImage} alt="Prikaz slike rasporeda" />
        </EuiFlexItem>
      </EuiFlexGroup>
    </EuiPageSection>
  );
}
