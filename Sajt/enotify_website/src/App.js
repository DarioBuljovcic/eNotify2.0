
import { useCallback, useEffect, useState } from 'react';
import './App.css';
import Auth from './pages/Auth/Auth.tsx';
import Home from './pages/Home/home.tsx';
import {Login} from'./lib/firebase.js'


function App() {
  const [logedIn,setLogedIn]=useState(true);


  const LoginTest = useCallback( async (password)=> {
    const logedIn = await Login(password);
    if(logedIn)
      setLogedIn(logedIn);
    
    
  },[])
  if(logedIn)
    return <Home/>

  return <Auth Login={LoginTest}/>
    

}

export default App;
