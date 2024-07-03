import Header from "./components/Header/Header.tsx";
import Student from "./components/Student/Students.tsx";
import Notifications from "./components/Notifications/Notifications.tsx";
import DataTableNotifications from "./components/Notifications/DataTable/DataTableNotifications.tsx";
import DataTableStudents from "./components/Student/DataTable/DataTableStudents.tsx";
import Classes from "./components/Razredi/Classes.tsx";
import ExcelReaderClasses from "./components/Razredi/Excel/ExcelReaderClasses.tsx";
import Schedule from "./components/Schedule/Schedule.tsx";
import ExcelReaderSchedule from "./components/Schedule/Excel/ExcelReaderSchedule.tsx";
import { useEffect, useState } from "react";
import "./css/App.css";
import Professor from "./components/Professor/Professor";
import DataTableProfessor from "./components/Professor/DataTable/DataTableProfessor";
import Registration from "./components/Registration/Registration";


function App() {
  const [selectedOption, setSelectedOption] = useState([
    "Dodavanje Učenika",
    0,
  ]);
  const [registered, setRegistered] = useState(false)


  const displayOption = () => {
    switch (selectedOption[1]) {
      case 0:
        return <Student />;
      case 1:
        return <DataTableStudents />;
      case 2:
        return <Professor />;
      case 3:
        return <DataTableProfessor />;
      case 4:
        return <Notifications />;
      case 5:
        return <DataTableNotifications />;
      case 6:
        return <ExcelReaderClasses />;
      case 7:
        return <Classes />;
      case 8:
        return <ExcelReaderSchedule />;
      case 9:
        return <Schedule />;
    }
  };
  const isRegistered = ()=>{
    if(registered){
      return  <div class="allContainer">
                <Header setOptionText={(o) => setSelectedOption(o)} />
                <div className="rightContainer">
                  <div className="display">
                    <div className="optionText">{selectedOption[0]}</div>
                    {selectedOption && displayOption()}
                  </div>
                </div>
              </div>
    }
    return <Registration registered={registered} setRegistered={setRegistered}/>
  }
  
  return (<>{isRegistered()}</>);
}

export default App;
