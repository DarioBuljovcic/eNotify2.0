import React, {
  Fragment,
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";
import "@elastic/eui/dist/eui_theme_light.css";
import Logo from "../../components/logo.tsx";
import {
  EuiPageHeader,
  EuiPageTemplate,
  EuiProvider,
  EuiText,
  EuiPageTemplateProps,
  EuiTabProps,
  EuiButton,
  EuiSpacer,
  EuiFlexGrid,
  EuiTab,
  EuiTabs,
  EuiIcon,
  EuiPageBody,
  EuiPopover,
  EuiButtonEmpty,
  EuiPopoverTitle,
  EuiContextMenuPanel,
  EuiContextMenuItem,
  EuiCheckbox,
  EuiDescriptionListTitle,
  EuiDescriptionListDescription,
  EuiPortal,
  EuiFlyout,
  EuiFlyoutHeader,
  EuiTitle,
  EuiDescriptionList,
  EuiFlyoutBody,
  EuiButtonIcon,
  EuiFlexGroup,
  EuiFlexItem,
} from "@elastic/eui";
import DataGridStyle from "../../components/dataGrid.tsx";
import {
  getNotifications,
  getStudents,
  getProfessors,
  postStudentsFile,
  postProfessorsFile,
  postOneProfessor,
  postOneStudent,
  getAllClasses,
  sendNotification,
  deleteUserDocuments,
  deleteNotificationDocuments,
  getImage,
  setImage,
} from "../../lib/firebase.js";
import FilePicker from "../../components/filePicker.tsx";
import Modal from "../../components/modal.tsx";
import AddOneUser from "../../components/addOneUser.tsx";
import SendNotification from "../../components/sendNotification.tsx";
import ClassTable from "../../components/classTable.tsx";

type Tabs = {
  label: string;
  isSelected: boolean;
  onClick: () => void;
};
const columnsNotification = [
  {
    id: "NotificationId",
    initialWidth: 120,
  },
  {
    id: "Tittle",
  },
  {
    id: "Text",
  },
  {
    id: "From",
  },
  {
    id: "Date",
  },
];
const columnsUsers = [
  {
    id: "UserID",
    initialWidth: 120,
  },
  {
    id: "Name",
  },
  {
    id: "Email",
  },
  {
    id: "Class",
  },
];

export default function Home() {
  const panelled: EuiPageTemplateProps["panelled"] = true;
  const [selectedTab, setSelectedTab] = useState(1);
  const [selectedTabId, setSelectedTabId] = useState(1);
  const [title, setTitle] = useState("Učenici");
  const [isOpen, setIsOpen] = useState(false);
  const [modalHeader, setModalHeader] = useState("");
  const [modalText, setModalText] = useState("");
  const allTabs = {
    Student: [
      {
        id: 1,
        name: "Dodavanje putem fajla",
        prepend: <EuiIcon type="plus" />,
        content: (
          <>
            <FilePicker
              role="u"
              postFile={postStudentsFile}
              setModalHeader={setModalHeader}
              setModalText={setModalText}
              setIsOpen={setIsOpen}
            />
          </>
        ),
      },
      {
        id: 2,
        name: "Dodavanje ručno",
        prepend: <EuiIcon type="pencil" />,
        content: (
          <>
            <AddOneUser
              role="u"
              postUser={postOneStudent}
              setModalHeader={setModalHeader}
              setModalText={setModalText}
              setIsOpen={setIsOpen}
              getClasses={getAllClasses}
            />
          </>
        ),
      },
      {
        id: 3,
        name: "Pregled",
        prepend: <EuiIcon type="list" />,
        content: (
          <>
            <DataGridStyle
              columns={columnsUsers}
              getData={getStudents}
              deleteData={deleteUserDocuments}
            />
          </>
        ),
      },
    ],
    Professor: [
      {
        id: 1,
        name: "Dodavanje putem fajla",
        prepend: <EuiIcon type="plus" />,
        content: (
          <>
            <FilePicker
              role="p"
              postFile={postProfessorsFile}
              setModalHeader={setModalHeader}
              setModalText={setModalText}
              setIsOpen={setIsOpen}
            />
          </>
        ),
      },
      {
        id: 2,
        name: "Dodavanje ručno",
        prepend: <EuiIcon type="pencil" />,
        content: (
          <>
            <AddOneUser
              role="p"
              postUser={postOneProfessor}
              setModalHeader={setModalHeader}
              setModalText={setModalText}
              setIsOpen={setIsOpen}
            />
          </>
        ),
      },
      {
        id: 3,
        name: "Pregled",
        prepend: <EuiIcon type="list" />,
        content: (
          <>
            <DataGridStyle
              columns={columnsUsers}
              getData={getProfessors}
              deleteData={deleteUserDocuments}
            />
          </>
        ),
      },
    ],
    Notifications: [
      {
        id: 1,
        name: "Slanje",
        prepend: <EuiIcon type="bell" />,
        content: (
          <>
            <SendNotification
              sendNotification={sendNotification}
              setModalHeader={setModalHeader}
              setModalText={setModalText}
              setIsOpen={setIsOpen}
              getClasses={getAllClasses}
            />
          </>
        ),
      },
      {
        id: 2,
        name: "Pregled",
        prepend: <EuiIcon type="list" />,
        content: (
          <>
            <DataGridStyle
              columns={columnsNotification}
              getData={getNotifications}
              deleteData={deleteNotificationDocuments}
            />
          </>
        ),
      },
    ],
    Razredi: [
      {
        id: 1,
        name: "Dodavanje putem fajla",
        prepend: <EuiIcon type="plus" />,
        content: (
          <>
            <FilePicker
              role="p"
              postFile={postProfessorsFile}
              setModalHeader={setModalHeader}
              setModalText={setModalText}
              setIsOpen={setIsOpen}
            />
          </>
        ),
      },
      {
        id: 2,
        name: "Dodavanje ručno",
        prepend: <EuiIcon type="pencil" />,
        content: (
          <>
            <AddOneUser
              role="p"
              postUser={postOneProfessor}
              setModalHeader={setModalHeader}
              setModalText={setModalText}
              setIsOpen={setIsOpen}
            />
          </>
        ),
      },
      {
        id: 3,
        name: "Pregled",
        prepend: <EuiIcon type="list" />,
        content: (
          <>
            <ClassTable
              getClasses={getAllClasses}
              getImage={getImage}
              setImage={setImage}
              setModalHeader={setModalHeader}
              setModalText={setModalText}
              setIsOpen={setIsOpen}
            />
          </>
        ),
      },
    ],
  };
  const [tabs, setTabs] = useState(allTabs.Student);

  const handleTabChange = (tab: number) => {
    setSelectedTab(tab);
    switch (tab) {
      case 1:
        setTitle("Učenici");
        setTabs(allTabs.Student);
        onSelectedTabChanged(1);
        break;
      case 2:
        setTitle("Profesori");
        setTabs(allTabs.Professor);
        onSelectedTabChanged(1);
        break;
      case 3:
        setTitle("Obaveštenja");
        setTabs(allTabs.Notifications);
        onSelectedTabChanged(1);
        break;
      case 4:
        setTitle("Razredi");
        setTabs(allTabs.Razredi);
        onSelectedTabChanged(1);
        break;
    }
  };

  const selectedTabContent = useMemo(() => {
    return tabs.find((obj) => obj.id === selectedTabId)?.content;
  }, [selectedTabId, selectedTab]);

  const onSelectedTabChanged = (id: number) => {
    setSelectedTabId(id);
  };

  const renderTabs = () => {
    return tabs.map((tab, index) => (
      <EuiTab
        key={index}
        onClick={() => onSelectedTabChanged(tab.id)}
        isSelected={tab.id === selectedTabId}
        prepend={tab.prepend}
      >
        {tab.name}
      </EuiTab>
    ));
  };

  return (
    <EuiProvider colorMode="light">
      <EuiPageTemplate panelled={panelled}>
        <Modal
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          modalHeader={modalHeader}
          modalText={modalText}
        />
        <EuiPageTemplate.Sidebar sticky={true} minWidth={"150px"}>
          <EuiFlexGrid>
            <Logo />
            <EuiButton
              color="primary"
              fill={selectedTab === 1}
              size="s"
              onClick={() => handleTabChange(1)}
            >
              {" "}
              Učenici{" "}
            </EuiButton>
            <EuiButton
              color="primary"
              fill={selectedTab === 2}
              size="s"
              onClick={() => handleTabChange(2)}
            >
              {" "}
              Profesori{" "}
            </EuiButton>
            <EuiButton
              color="primary"
              fill={selectedTab === 3}
              size="s"
              onClick={() => handleTabChange(3)}
            >
              {" "}
              Obaveštenja{" "}
            </EuiButton>
            <EuiButton
              color="primary"
              fill={selectedTab === 4}
              size="s"
              onClick={() => handleTabChange(4)}
            >
              {" "}
              Razredi{" "}
            </EuiButton>
          </EuiFlexGrid>
        </EuiPageTemplate.Sidebar>

        <EuiPageHeader pageTitle={title} paddingSize="m" />
        <EuiPageBody paddingSize="m">
          <EuiTabs>{renderTabs()}</EuiTabs>

          <EuiPageTemplate.Section grow={false}>
            {selectedTabContent}
          </EuiPageTemplate.Section>
        </EuiPageBody>
      </EuiPageTemplate>
    </EuiProvider>
  );
}
