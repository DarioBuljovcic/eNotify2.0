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
import "./css/classes.css";

export type User = {
  [key: number]: string;
  Class: string;
  Professor: string;
  Students: string;
};

export default function Classes() {
  const [data, setData] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState(true);

  const columns: TableColumn<User>[] = [
    {
      name: "Razred",
      selector: (row: User) => row.Class || "",
      width: "100px",
      sortable: true,
    },
    {
      name: "Starešina",
      selector: (row: User) => row.Professor || "",
      sortable: true,
      width: "200px",
    },
    {
      name: "Broj učenika",
      selector: (row: User) => row.Students || "",
      width: "150px",
      sortable: true,
    },
  ];

  const getData = async () => {
    const newData: User[] = [];

    onSnapshot(query(collection(db, "Classes")), (querySnapshot) => {
      newData.length = 0;
      querySnapshot.forEach((doc) => {
        newData.push(doc.data() as User);
      });
      console.log(newData);
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
    if (!loading) console.log(data[0]);
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
