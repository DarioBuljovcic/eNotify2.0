import Header from "./components/Header/Header.tsx";
import Student from "./components/Student/Students.tsx";
import Notifications from "./components/Notifications/Notifications.tsx";
import DataTableNotifications from "./components/Notifications/DataTable/DataTableNotifications.tsx";
import DataTableStudents from "./components/Student/DataTable/DataTableStudents.tsx";
import { useEffect, useState } from "react";
import "./css/App.css";

function App() {
  const [selectedOption, setSelectedOption] = useState([
    "Dodavanje Učenika",
    0,
  ]);
  const [text, setText] = useState("");

  const displayOption = () => {
    switch (selectedOption[1]) {
      case 0:
        return <Student Successful={(text) => setText(text)} />;
      case 1:
        return <DataTableStudents />;
      case 2:
        return <Notifications Successful={(text) => setText(text)} />;
      case 3:
        return <DataTableNotifications />;
    }
  };

  useEffect(() => {
    console.log(text);
  }, [text]);
  return (
    <body>
      <Header setOptionText={(o) => setSelectedOption(o)} />
      <div className="rightContainer">
        <div className="display">
          <div className="optionText">{selectedOption[0]}</div>
          {selectedOption && displayOption()}
          <div className={`successful ${text ? "open" : ""}`}>
            <div>{text}</div>
            <button className="closeSuccessful" onClick={() => setText("")}>
              &times;
            </button>
          </div>
        </div>
      </div>
    </body>
  );
}

export default App;
