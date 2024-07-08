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
    editUser:(d:dataUsers)=> void,
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