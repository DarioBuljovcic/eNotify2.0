import { useCallback, useEffect, useState } from "react";
import "./App.css";
import Auth from "./pages/Auth/Auth.tsx";
import Home from "./pages/Home/home.tsx";
import { Login } from "./lib/firebase.js";
import "./components/css/logo.css";
import "./components/css/dropdown.css";

function App() {
  const [logedIn, setLogedIn] = useState(false);

  const LoginTest = useCallback(async (password) => {
    const logedIn = await Login(password);
    if (logedIn) setLogedIn(logedIn);
    else return false;
  }, []);
  if (logedIn) return <Home></Home>;

  return <Auth Login={LoginTest} />;
}

export default App;
