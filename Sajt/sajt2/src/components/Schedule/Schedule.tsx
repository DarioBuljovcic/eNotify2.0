import React, { useEffect, useState } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import { db } from "../../lib/firebase.js";
import {
  collection,
  onSnapshot,
  query,
  getDocs,
  updateDoc,
  where,
} from "firebase/firestore";
import "./css/schedule.css";

export type User = {
  [key: number]: string;
  UserID: string;
  Name: string;
  Email: string;
  Class: string;
  Role: string;
  LogOut: boolean;
};

export default function Schedule() {
  const [data, setData] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState(true);

  const LogOut = ({ row }: { row: User }) => {
    const update = async () => {
      const querySnapshot = await getDocs(
        query(collection(db, "Users"), where("UserID", "==", row.UserID))
      );

      await updateDoc(querySnapshot.docs[0].ref, { ["LogOut"]: true });
      getData();
    };
    return <button onClick={() => update()}>Izbaci učenika</button>;
  };
  const UserStatus = ({ row }: { row: User }) => {
    return (
      <div className="logOut">
        {row.LogOut ? "Učenik nije registrovan" : "Učenik je registrovan"}
      </div>
    );
  };
  const columns: TableColumn<User>[] = [
    {
      name: "Korisniči Broj",
      selector: (row: User) => row.UserID || "",
      width: "200px",
      sortable: true,
    },
    {
      name: "Naziv",
      selector: (row: User) => row.Name || "",
      sortable: true,
      width: "200px",
    },
    {
      name: "Razred",
      selector: (row: User) => row.Class || "",
      width: "100px",
      sortable: true,
    },
    {
      name: "Status učenika",
      selector: (row: User) => row.LogOut || "",
      cell: (row: User) => <UserStatus row={row} />,
      width: "200px",
      sortable: true,
    },
    {
      name: "Izbaci učenika",
      selector: (row: User) => row.LogOut || "",
      cell: (row: User) => <LogOut row={row} />,
      width: "200px",
      sortable: true,
    },
  ];

  const getData = async () => {
    const newData: User[] = [];

    onSnapshot(query(collection(db, "Users")), (querySnapshot) => {
      newData.length = 0;
      querySnapshot.forEach((doc) => {
        newData.push(doc.data() as User);
      });
      console.log(newData[3].UserID, newData[3].LogOut);
      setData([...newData]);
    });
  };

  useEffect(() => {
    if (loading) {
      setLoading(false);
      console.log("hello");
      getData();
    }
    if (!loading) {
      setPending(false);
    }
  });
  useEffect(() => {
    if (!loading) console.log(data[3].UserID);
  }, [data]);

  return (
    <>
      {/* {!loading && ( */}
      <DataTable
        columns={columns}
        data={data}
        pagination
        progressPending={pending}
        defaultSortFieldId={1}
      />
      {/* )} */}
    </>
  );
}
