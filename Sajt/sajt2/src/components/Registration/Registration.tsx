import React, { useState } from 'react'
import "./css/style.css";
import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { db } from '../../lib/firebase';

type User = {
    [key: number]: string;
    UserID: string;
    Name: string;
    Email: string;
    Class: string;
    Role: string;
    LogOut: boolean;
  };
  type Props = {
    registered:boolean,
    setRegistered:(value: boolean) => void,
  }

function Registration({registered,setRegistered}:Props) {
    const [SchoolID, setSchoolID] = useState("")
    const Login = ()=>{
        const newData:User[]=[];

        onSnapshot(query(collection(db, "Schools"),where("SchoolID", "==", SchoolID) ), (querySnapshot) => {
            if(querySnapshot.docs[0]){
                setRegistered(true);
            }
        });
    }
    const handleChange = (event:any) => {
        setSchoolID(event.target.value);
      };
  return (
    <div className='registrationContainer'>
     <div className="logoContainer">
        <div className="logo">
          <span className="e">e</span>Notify
        </div>
      </div>
      <div className='registration'>
       
       <span className="inputContainer">
           <label htmlFor="inputField">Registracija</label>
           <input type="text" placeholder="Šifra" onChange={(event)=>handleChange(event)}/>
        </span>

         <button
          type="submit"
          className="submit-btn"
          onClick={()=>Login()}
          >
          Uloguj se
        </button>
     </div>
     
    </div>
  )
}

export default Registration
