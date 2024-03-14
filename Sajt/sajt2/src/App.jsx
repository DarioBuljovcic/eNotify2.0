import Header from "./components/Header/Header.tsx";
import Student from "./components/Student/Students.tsx";
import Notifications from "./components/Notifications/Notifications.tsx";
import { useState } from "react";
import "./css/App.css";

function App() {
  const [selectedOption, setSelectedOption] = useState([
    "Dodavanje Učenika",
    0,
  ]);

  const displayOption = () => {
    switch (selectedOption[1]) {
      case 0:
        return <Student />;
      case 1:
        return <Notifications />;
    }
  };
  return (
    <body>
      <Header setOptionText={(o) => setSelectedOption(o)} />
      <div className="display">
        <div className="optionText">{selectedOption[0]}</div>
        {selectedOption && displayOption()}
      </div>
    </body>
  );
}

export default App;
