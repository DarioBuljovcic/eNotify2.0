import { Timestamp } from "firebase/firestore";
import { Dispatch, SetStateAction } from "react";
import { getAllClasses } from "./../lib/firebase";

export type dataUsers = {
  [key: string | number]: any;
  UserID: string;
  Name: string;
  Role: string;
  Email: string;
  Class: string;
};
export type dataNotification = {
  [key: string | number]: any;
  NotificationId: string;
  Title: string;
  Text: string;
  Date: Timestamp;
};
export type dataClass = {
  [key: string | number]: any;
  label: string;
  value: string;
  text: string;
  url: string;
  Class: string;
  ProfessorsList: string;
  Professor: string;
  ProfessorID: string;
};

export type gridDataContext = {
  data: dataClass[] | dataUsers[] | dataNotification[];
  deleteData: ([]) => void;
  GetSetData: () => void;
  editData: (
    d: dataUsers | dataNotification,
    p: dataUsers | dataNotification
  ) => void;
  searchData: dataClass[] | dataUsers[] | dataNotification[];
  dataType: string;
  addition: dataUsers[] | dataClass[];
  ToastContext: React.Context<toastContext>;
};
export type RowSelectionAction = {
  action: "add" | "delete" | "clear" | "selectAll";
  rowIndex: number;
};
export type RowSelection = {
  rowSelection: Set<number>;
  dispatch: Dispatch<RowSelectionAction>;
  [Symbol.iterator]: () => any;
};
export type DropdownUsers = {
  label: string;
  text: string;
  value: string;
};
export type AddClassProps = {
  postClass: (o, p) => void;
  getAllClasses: () => Promise<any[]>;
  getProfessors?: () => void;
  DataContext: React.Context<toastContext>;
};
export type optionsNotification = {
  label: string;
  value: string;
};

export type ClassesNotification = {
  label: string;
  options: optionsNotification[];
};
export type PropsNotification = {
  sendNotification: (p) => void;
  setModalHeader: (o) => void;
  setModalText: (o) => void;
  setIsOpen: (o) => void;
  getClasses: () => void;
  DataContext: React.Context<toastContext>;
};
export type PropfFlyout = {
  rowValue: dataUsers | dataNotification | dataClass;
  rowIndex: number;
  closeFlyout: () => void;
  isFlyoutVisible: boolean;
  DataContext: React.Context<gridDataContext>;
  ToastContext: React.Context<toastContext>;
};
export type toastContext = {
  setToasts: (o) => void;
  toastId: number;
  setToastId: (o) => void;
};
export type PropsFilePicker = {
  role: string;
  postFile: (o) => void;
  DataContext: React.Context<toastContext>;
};
export type AddUserProps = {
  role: string;
  postUser: (o) => Promise<boolean>;
  getClasses?: () => void;
  DataContext: React.Context<toastContext>;
};
export type gridDataProps = {
  getData: () => void;
  deleteData: (o) => void;
  columns: { id: string }[];
  editData: (o, p) => void;
  dataType: string;
  getAddition: () => void;
  ToastContext: React.Context<toastContext>;
};
