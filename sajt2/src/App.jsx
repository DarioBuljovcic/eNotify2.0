import Notifications from "./components/Notifications/Notifications.tsx";
import ExcelReader from "./components/Učenici/Excel/ExcelReader.tsx";
import Header from "./components/Header/Header.tsx";
import { useState } from "react";
import "./css/App.css";

function App() {
  const [selectedOption, setSelectedOption] = useState([
    "Slanje Notifikacija",
    0,
  ]);

  const displayOption = () => {
    switch (selectedOption[1]) {
      case 0:
        return <ExcelReader />;
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
