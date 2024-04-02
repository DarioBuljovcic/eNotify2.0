import React, { useEffect, useState } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import { db } from "../../../lib/firebase.js";
import {
  collection,
  getDocs,
  query,
  DocumentData,
  QuerySnapshot,
  where,
  Timestamp,
  doc,
  deleteDoc,
} from "firebase/firestore";
import "./css/table.css";

type inputData = {
  NotificationId: string;
  Class: string;
  Date: Timestamp;
  Files: string | undefined;
  Text: string | undefined;
  Tittle: string | undefined;
  Type: string;
  Seen: string;
};

export default function DataTableNotifications() {
  const [data, setData] = useState<inputData[]>([]);
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState(true);

  const columns: TableColumn<inputData>[] = [
    {
      name: "Naslov",
      selector: (row: inputData) => row.Tittle || "",
      width: "200px",
      sortable: true,
    },
    {
      name: "Tekst",
      selector: (row: inputData) => row.Text || "",
      cell: (row: inputData) => <CustomText row={row} />,
      sortable: true,
    },
    {
      name: "Datum",
      selector: (row: inputData) =>
        new Date(row.Date.toDate()).toLocaleDateString("en-GB", {
          weekday: "short",
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
      width: "200px",
      sortable: true,
    },
    {
      name: "Rzred",
      selector: (row: inputData) => row.Class || "",
      width: "100px",
      sortable: true,
    },
    {
      name: "Brisanje",
      selector: (row: inputData) => row.NotificationId || "",
      cell: (row: inputData) => <DeleteButton row={row} />,
      width: "100px",
      sortable: true,
    },
  ];
  const DeleteNotification = async (notificationId: string) => {
    // Execute the query
    const querySnapshot = await getDocs(
      query(
        collection(db, "Notifications"),
        where("NotificationId", "==", notificationId)
      )
    );
    await deleteDoc(querySnapshot.docs[0].ref);
    setData(data.filter((d) => d.NotificationId != notificationId));
  };
  const CustomText = ({ row }: { row: inputData }) => (
    <div style={{ width: "400px", textWrap: "wrap" }}>{row.Text}</div>
  );
  const DeleteButton = ({ row }: { row: inputData }) => (
    <div
      style={{
        width: "50px",
        color: "red",
        fontSize: "25px",
        cursor: "pointer",
      }}
      onClick={() => DeleteNotification(row.NotificationId)}
    >
      &times;
    </div>
  );
  const getData = async () => {
    const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(
      query(collection(db, "Notifications"))
    );
    const newData: inputData[] = [];
    querySnapshot.forEach((doc) => {
      newData.push(doc.data() as inputData);
    });
    setData(newData);
    setLoading(false);
  };

  useEffect(() => {
    if (data.length === 0) getData();
    if (!loading) setPending(false);
  }, [data]);

  return (
    <>
      {!loading && (
        <DataTable
          columns={columns}
          data={data}
          pagination
          progressPending={pending}
          defaultSortFieldId={1}
        />
      )}
    </>
  );
}
