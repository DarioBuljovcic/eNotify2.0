import React, { useMemo, useState } from "react";
import "@elastic/eui/dist/eui_theme_light.css";
import Logo from "../../components/logo.tsx";
import {
  EuiPageHeader,
  EuiPageTemplate,
  EuiProvider,
  EuiPageTemplateProps,
  EuiButton,
  EuiFlexGrid,
  EuiTab,
  EuiTabs,
  EuiIcon,
  EuiPageBody,
} from "@elastic/eui";
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
  editUser,
  editNotification,
  postClass,
} from "../../lib/firebase.js";
import FilePicker from "../../components/filePicker.tsx";
import Modal from "../../components/modal.tsx";
import AddOneUser from "../../components/addOneUser.tsx";
import SendNotification from "../../components/sendNotification.tsx";
import ClassTable from "../../components/classTable.tsx";
import DataGrid2 from "../../components/dataGrid2.tsx";
import AddClass from "../../components/addClass.tsx";

const columnsNotification = [
  {
    id: "NotificationId",
    initialWidth: 120,
  },
  {
    id: "Title",
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
const columnsClasses = [
  {
    id: "Class",
    initialWidth: 120,
  },
  {
    id: "Professor",
  },
  {
    id: "ProfessorsList",
  }
];

export default function Home() {
  const panelled: EuiPageTemplateProps["panelled"] = true;
  const [selectedTab, setSelectedTab] = useState(1);
  const [selectedTabId, setSelectedTabId] = useState(1);
  const [title, setTitle] = useState("Učenici");
  const [isOpen, setIsOpen] = useState(false);
  const [modalHeader, setModalHeader] = useState("");
  const [modalText, setModalText] = useState("");
  const [modalConfirm, setModalConfirm] = useState(false);
  const [result, setResult] = useState(false);
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
            <DataGrid2
              columns={columnsUsers}
              getData={getStudents}
              editData={editUser}
              deleteData={deleteUserDocuments}
              dataType='User'
              getAddition={getAllClasses}
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
            <DataGrid2
              columns={columnsUsers}
              getData={getProfessors}
              editData={editUser}
              deleteData={deleteUserDocuments}
              dataType='User'
              getAddition={getAllClasses}
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
            <DataGrid2
              columns={columnsNotification}
              getData={getNotifications}
              editData={editNotification}
              deleteData={deleteNotificationDocuments}
              dataType='Notification'
              getAddition={getAllClasses}
            />
          </>
        ),
      },
    ],
    Razredi: [
      {
        id: 1,
        name: "Dodavanje ručno",
        prepend: <EuiIcon type="pencil" />,
        content: (
          <>
            <AddClass
              getProfessors={getProfessors}
              postClass={postClass}
              setModalHeader={setModalHeader}
              setModalText={setModalText}
              setIsOpen={setIsOpen}
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
            <DataGrid2
              columns={columnsClasses}
              getData={getAllClasses}
              editData={editNotification}
              deleteData={deleteNotificationDocuments}
              dataType='Class'
            />
          </>
        ),
      },
      {
        id: 3,
        name: "Raspored",
        prepend: <EuiIcon type="image" />,
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
          modalConfirm={modalConfirm}
          setResult={setResult}
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
