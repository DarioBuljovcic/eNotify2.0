import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import { db } from "../../../lib/firebase.js";
import {
  collection,
  onSnapshot,
  query,
  getDocs,
  updateDoc,
  where,
  deleteDoc,
  and,
  orderBy,
} from "firebase/firestore";
import "./css/table.css";
import { IonIcon } from "@ionic/react";
import {
  logOutOutline,
  trashBinOutline,
  createOutline,
  optionsOutline,
} from "ionicons/icons";
import Popup from "../../Popup/Popup"

export type User = {
  [key: number]: string;
  UserID: string;
  Name: string;
  Email: string;
  Class: string;
  Role: string;
  LogOut: boolean;
};

export default function DataTableStudents() {
  const [data, setData] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState(true);

  const [editOn, setEditOn] = useState(false);
  const [searchOn, setSearchOn] = useState(false);

  const [filter, setFilter] = useState(0);
  const [filterInput, setFilterInput] = useState("");

  const [editUser, setEditUser] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [studentClass, setClass] = useState("");

  const [selectedStudents, setSelectedStudents] = useState<string[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState("");
  const [shouldDelete, setShouldDelete] = useState(false)
  const [shouldNext, setShouldNext] = useState(false)
  const [Confirm, setConfirm] = useState(()=>{})

  const Edit = ({ row }: { row: User }) => {
    const update = async () => {
      setEditOn(true);
      setEditUser(row.UserID);
      setName(row.Name);
      setEmail(row.Email);
      setClass(row.Class);

      getData();
    };
    return (
      <button onClick={() => update()} className="editBtn btn">
        <IonIcon icon={createOutline} size="small"></IonIcon>
      </button>
    );
  };
  const LogOut = ({ row }: { row: User }) => {
    const update = async () => {
      const querySnapshot = await getDocs(
        query(collection(db, "Users"), where("UserID", "==", row.UserID))
      );

      await updateDoc(querySnapshot.docs[0].ref, { ["LogOut"]: true });
      getData();
    };
    return (
      <button onClick={() => update()} className="logOutBtn btn">
        <IonIcon icon={logOutOutline} size="small"></IonIcon>
      </button>
    );
  };
  const Delete = ({ row }: { row: User }) => {
    const update = async () => {
      const querySnapshot = await getDocs(
        query(collection(db, "Users"), where("UserID", "==", row.UserID))
      );

      await deleteDoc(querySnapshot.docs[0].ref);
      getData();
    };
    return (
      <button onClick={() => update()} className="deleteBtn btn">
        <IonIcon icon={trashBinOutline} size="small" color={"danger"}></IonIcon>
      </button>
    );
  };
  const UserStatus = ({ row }: { row: User }) => {
    return (
      <div className="logOut">
        {row.LogOut ? "Učenik nije registrovan" : "Učenik je registrovan"}
      </div>
    );
  };
  const SaveUser = async () => {
    const querySnapshot = await getDocs(
      query(collection(db, "Users"), where("UserID", "==", editUser))
    );

    await updateDoc(querySnapshot.docs[0].ref, {
      ["Naziv"]: name,
      ["Email"]: email,
      ["Class"]: studentClass,
    });
    getData();
  };
  const SelectUser = ({UserID}:{UserID:string})=>{
    const Select = (e:ChangeEvent<HTMLInputElement>)=>{
      if(e.target.checked){
        setSelectedStudents([...selectedStudents,UserID]);
      }else if(e.target.checked===false){
        setSelectedStudents([...selectedStudents.filter(f => f!==UserID)]);
      }
      console.log(selectedStudents)
    }
    return (
     <input type="checkbox" onChange={Select} checked={selectedStudents.includes(UserID)}/>
    )
  }
  const columns: TableColumn<User>[] = [
    {
      name: "Izaberi",
      selector: (row: User) => row.UserID || "",
      cell:(row: User) => <SelectUser UserID={row.UserID}/>,
      width: "100px",
      sortable: true,
    },
    {
      name: "Korisniči Broj",
      selector: (row: User) => row.UserID || "",
      width: "150px",
      sortable: true,
    },
    {
      name: "Naziv",
      selector: (row: User) => row.Name || "",
      sortable: true,
      width: "200px",
    },
    {
      name: "Email",
      selector: (row: User) => row.Email || "",
      sortable: true,
      width: "250px",
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
      name: "Izmena učenika",
      selector: (row: User) => row.UserID || "",
      cell: (row: User) => <Edit row={row} />,
      width: "140px",
      sortable: true,
    },
    {
      name: "Izbaci učenika",
      selector: (row: User) => row.LogOut || "",
      cell: (row: User) => <LogOut row={row} />,
      width: "130px",
      sortable: true,
    },
    {
      name: "Brisanje učenika",
      selector: (row: User) => row.UserID || "",
      cell: (row: User) => <Delete row={row} />,
      width: "140px",
      sortable: true,
    },
  ];
  const Search = async () => {
    const newData: User[] = [];
    const getQuery = () => {
      switch (filter) {
        case 0:
          return where("Name", "==", filterInput) ;
        case 1:
          return where("Email", "==", filterInput);
        case 2:
          return where("Class", "==", filterInput);
        default:
          return where("", "==", "");
      }
    };
    onSnapshot(query(collection(db, "Users"), getQuery(), where("Role", "==", "Student")), (querySnapshot) => {
      newData.length = 0;
      querySnapshot.forEach((doc) => {
        newData.push(doc.data() as User);
      });
      console.log(newData)
      setData([...newData]);
    });
    setFilterInput("");
  };
  const getData = async () => {
    const newData: User[] = [];

    onSnapshot(query(collection(db, "Users"),where("Role", "==", "Student"),orderBy("Class"), ), (querySnapshot) => {
      newData.length = 0;
      querySnapshot.forEach((doc) => {
        newData.push(doc.data() as User);
      });
      console.log(newData)
      setData([...newData]);
    });
  };
  
  const deleteUsers = async ()=>{
    setMessage("Da li ste sigurni da zelite da obrisete?");
    setConfirm(()=>{setIsOpen(false);setShouldDelete(true);});
    setIsOpen(true);
    
    if (shouldDelete) {
      selectedStudents.forEach(async (stud) => {
        const querySnapshot = await getDocs(
          query(collection(db, "Users"), where("UserID", "==", stud))
        );
  
        await deleteDoc(querySnapshot.docs[0].ref);
      });
      setSelectedStudents([]);
      getData();
    }
    
    
  }
  const nextYear = async ()=>{
    setMessage("Da li ste sigurni da zelite da povecate razred?");
    setConfirm(()=>{setIsOpen(false);setShouldNext(true);});
    setIsOpen(true);
    
    if(shouldNext===true){
      selectedStudents.forEach(async (stud) => {
        const querySnapshot = await getDocs(
          query(collection(db, "Users"), where("UserID", "==", stud))
        );
        const className=querySnapshot.docs[0].data().Class;
        const num = parseInt(className.substring(0,1))+1;
        const newClass = num + className.substring(1,className.length)
        
        if(num===5)
          await deleteDoc(querySnapshot.docs[0].ref);
        else{
          await updateDoc(querySnapshot.docs[0].ref, {
              Class: newClass
            });
        }
      });
      setSelectedStudents([]);
      getData();
    }
    
    
  }
  

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
    const handlePressOutside = (event:any) => {
      // Check if the click occurred outside the box
      if (
        !event.target.closest(".editBox") &&
        !event.target.closest(".containerTable")
      ) {
        setEditOn(false);
      }
      if (
        !event.target.closest(".filterBox") &&
        !event.target.closest(".containerTable") &&
        !event.target.closest(".filterBtn")
      ) {
        setSearchOn(false);
      }
    };

    // Attach event listener to detect clicks on the document
    document.addEventListener("mousedown", handlePressOutside);

    return () => {
      // Cleanup the event listener
      document.removeEventListener("mousedown", handlePressOutside);
    };
  }, []);

  return (
    <>
      <Popup onCancel={()=>setIsOpen(false)} onConfirm={()=>Confirm} isOpen={isOpen} message={message } showBtns={true}/>
      <button
        onClick={() => setSearchOn((prev) => !prev)}
        className="btn filterBtn"
      >
        <IonIcon icon={optionsOutline} size="large"></IonIcon>
      </button>
      <div className="containerTable">
        <div className={`editContainer editBox ${editOn ? "editOn" : ""}`}>
          <label htmlFor="inputIme">Naziv</label>
          <input
            type="text"
            placeholder="Ime"
            value={name}
            onChange={(o) => setName(o.target.value)}
          />
          <label htmlFor="inputEmail">Email</label>
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(o) => setEmail(o.target.value)}
          />
          <label htmlFor="inputRazred">Razred</label>
          <input
            type="text"
            placeholder="Razred"
            value={studentClass}
            onChange={(o) => setClass(o.target.value)}
          />
          <button className="btn saveEdit" onClick={() => SaveUser()}>
            Izmeni
          </button>
        </div>
        <div
          className={`editContainer filterBox ${searchOn ? "searchOn" : ""}`}
        >
          <div className="filters">
            <button
              className={`filtersBtn ${filter === 0 ? "selected" : ""}`}
              onClick={() => {
                setFilter(0);
                setFilterInput("");
              }}
            >
              Naziv
            </button>

            <button
              className={`filtersBtn ${filter === 1 ? "selected" : ""}`}
              onClick={() => {
                setFilter(1);
                setFilterInput("");
              }}
            >
              Email
            </button>

            <button
              className={`filtersBtn ${filter === 2 ? "selected" : ""}`}
              onClick={() => {
                setFilter(2);
                setFilterInput("");
              }}
            >
              Razred
            </button>
          </div>
          <input
            type="text"
            placeholder={`${
              filter === 0 ? "Naziv" : filter === 1 ? "Email" : "Razred"
            }`}
            value={filterInput}
            onChange={(o) => setFilterInput(o.target.value)}
          />
          <div className="filterButtons">
            <button className="btn saveEdit" onClick={() => Search()}>
              Filtriraj
            </button>
            <button className="btn saveEdit" onClick={() => getData()}>
              Očisti
            </button>
          </div>
        </div>
        <div className="multyFilter">
          <button className="red" onClick={()=>deleteUsers()}>Izbriši učenike</button>
          <button onClick={()=>nextYear()}>Povećaj razred</button>
        </div>
        <div className="dataTable">
          <DataTable
            columns={columns}
            data={data}
            pagination
            progressPending={pending}
            defaultSortFieldId={5}
            
          />
        </div>
      </div>
    </>
  );
}
