import { Timestamp } from "firebase/firestore"
import { Dispatch, SetStateAction } from "react"

export type dataUsers ={
    UserID:string,
    Name:string,
    Role:string,
    Email:string,
    Class:string,
}
export type dataNotification = {
    NotificationId:string,
    Title:string,
    Text:string,
    Date:Timestamp,
}

export type gridDataContext = {
    data: dataUsers[]|dataNotification[],
    deleteData: ([]) => void,
    setData: (newData: (dataUsers | dataNotification)[]) => void;
    editData:(d:dataUsers|dataNotification,p:dataUsers|dataNotification)=> void,
}
export type RowSelectionAction = {
    action: 'add' | 'delete' | 'clear' | 'selectAll';
    rowIndex: number;
}
export type RowSelection = {
    rowSelection:Set<number>,
    dispatch: Dispatch<RowSelectionAction>
    [Symbol.iterator]:()=>any, 
}
export type DropdownUsers = {
    label: string,
    text: string,
    value:string,
}
export type  AddClassProps = {
    postClass: (o,p) => void;
    setModalHeader: (o) => void;
    setModalText: (o) => void;
    setIsOpen: (o) => void;
    getProfessors?: () => void;
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
    sendNotification: (o, p) => void;
    setModalHeader: (o) => void;
    setModalText: (o) => void;
    setIsOpen: (o) => void;
    getClasses: () => void;
  };