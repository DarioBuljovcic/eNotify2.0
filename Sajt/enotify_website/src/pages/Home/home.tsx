import React, { createContext, useMemo, useState } from "react";
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
  EuiGlobalToastList,
  EuiCollapsibleNavGroup,
  EuiListGroup,
  EuiListGroupProps,
  EuiSpacer,
  EuiPinnableListGroup,
  EuiPinnableListGroupItemProps,
  EuiText,
  EuiCode,
  EuiCollapsibleNav,
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
  editClass,
  deleteClassesDocuments,
} from "../../lib/firebase.js";
import FilePicker from "../../components/filePicker.tsx";
import Modal from "../../components/modal.tsx";
import AddOneUser from "../../components/addOneUser.tsx";
import SendNotification from "../../components/sendNotification.tsx";
import ClassTable from "../../components/classTable.tsx";
import DataGrid2 from "../../components/dataGrid2.tsx";
import AddClass from "../../components/addClass.tsx";
import { toastContext } from "../../types/types.ts";
import Test from "../../components/Test.tsx";

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
const columnsStudents = [
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
const columnsProfessor = [
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
  },
];
const defaultValue = {
  setToasts: () => {},
  toastId: 0,
  setToastId: () => {},
};
const DataContext = createContext<toastContext>(defaultValue);

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
  const [options, setOptions] = useState([true, false, false, false]);
  const [toasts, setToasts] = useState([]);
  const [toastId, setToastId] = useState(0);
  const removeToast = (removedToast) => {
    console.log(removedToast);
    setToasts((toasts) =>
      toasts.filter((toast) => toast.id !== removedToast.id)
    );
  };

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
              DataContext={DataContext}
            />
          </>
        ),
        onclick: () => {
          onSelectedTabChanged(1);
        },
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
              getClasses={getAllClasses}
              DataContext={DataContext}
            />
          </>
        ),
        onclick: () => {
          onSelectedTabChanged(2);
        },
      },
      {
        id: 3,
        name: "Pregled",
        prepend: <EuiIcon type="list" />,
        content: (
          <>
            <DataGrid2
              columns={columnsStudents}
              getData={getStudents}
              editData={editUser}
              deleteData={deleteUserDocuments}
              dataType="Student"
              getAddition={getAllClasses}
              ToastContext={DataContext}
            />
          </>
        ),
        onclick: () => {
          onSelectedTabChanged(3);
        },
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
              DataContext={DataContext}
            />
          </>
        ),
        onclick: () => {
          onSelectedTabChanged(1);
        },
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
              DataContext={DataContext}
            />
          </>
        ),
        onclick: () => {
          onSelectedTabChanged(2);
        },
      },
      {
        id: 3,
        name: "Pregled",
        prepend: <EuiIcon type="list" />,
        content: (
          <>
            <DataGrid2
              columns={columnsProfessor}
              getData={getProfessors}
              editData={editUser}
              deleteData={deleteUserDocuments}
              dataType="Professor"
              getAddition={getAllClasses}
              ToastContext={DataContext}
            />
          </>
        ),
        onclick: () => {
          onSelectedTabChanged(3);
        },
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
              DataContext={DataContext}
            />
          </>
        ),
        onclick: () => {
          onSelectedTabChanged(1);
        },
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
              dataType="Notification"
              getAddition={getAllClasses}
              ToastContext={DataContext}
            />
          </>
        ),
        onclick: () => {
          onSelectedTabChanged(2);
        },
      },
    ],
    Class: [
      {
        id: 1,
        name: "Dodavanje ručno",
        prepend: <EuiIcon type="pencil" />,
        content: (
          <>
            <AddClass
              getProfessors={getProfessors}
              postClass={postClass}
              getAllClasses={getAllClasses}
              DataContext={DataContext}
            />
          </>
        ),
        onclick: () => {
          onSelectedTabChanged(1);
        },
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
              editData={editClass}
              deleteData={deleteClassesDocuments}
              dataType="Class"
              getAddition={getProfessors}
              ToastContext={DataContext}
            />
          </>
        ),
        onclick: () => {
          onSelectedTabChanged(2);
        },
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

        onclick: () => {
          onSelectedTabChanged(3);
        },
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
        setOptions([true, false, false, false]);
        break;
      case 2:
        setTitle("Profesori");
        setTabs(allTabs.Professor);
        onSelectedTabChanged(1);
        setOptions([false, true, false, false]);
        break;
      case 3:
        setTitle("Obaveštenja");
        setTabs(allTabs.Notifications);
        onSelectedTabChanged(1);
        setOptions([false, false, true, false]);
        break;
      case 4:
        setTitle("Razredi");
        setTabs(allTabs.Class);
        onSelectedTabChanged(1);
        setOptions([false, false, false, true]);
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
  const TopNavLinks: EuiPinnableListGroupItemProps[] = [
    {
      label: "Home",
      iconType: "home",
      isActive: true,
      pinnable: false,
    },
    { label: "Dashboards", pinned: true },
    { label: "Dev tools", pinned: true },
    { label: "Maps", pinned: true },
  ];

  return (
    <DataContext.Provider value={{ setToasts, toastId, setToastId }}>
      <EuiProvider colorMode="light">
        <EuiPageTemplate panelled={panelled}>
          <EuiGlobalToastList
            toasts={toasts}
            toastLifeTimeMs={6000}
            dismissToast={removeToast}
          />
          <Modal
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            modalHeader={modalHeader}
            modalText={modalText}
            modalConfirm={modalConfirm}
            setResult={setResult}
          />
          <EuiPageTemplate.Sidebar sticky={true} minWidth={"250px"}>
            <EuiFlexGrid
              style={{ alignItems: "center", justifyContent: "center" }}
            >
              <Logo />
              <Test
                items={allTabs.Student}
                title={"Učenici"}
                isOpen={options[0]}
                handleOpen={() => handleTabChange(1)}
                selectedTabId={selectedTabId}
              />
              <Test
                items={allTabs.Professor}
                title={"Profesori"}
                isOpen={options[1]}
                handleOpen={() => handleTabChange(2)}
                selectedTabId={selectedTabId}
              />
              <Test
                items={allTabs.Notifications}
                title={"Obaveštenja"}
                isOpen={options[2]}
                handleOpen={() => handleTabChange(3)}
                selectedTabId={selectedTabId}
              />
              <Test
                items={allTabs.Class}
                title={"Razredi"}
                isOpen={options[3]}
                handleOpen={() => handleTabChange(4)}
                selectedTabId={selectedTabId}
              />
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
    </DataContext.Provider>
  );
}
