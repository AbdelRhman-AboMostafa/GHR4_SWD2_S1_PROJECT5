import React from 'react'
import { createContext,useEffect, useState } from "react";

export const userContext = createContext();

export default function UserContextProvider(props) {
  const [isLogin, setLogin] = useState(null);

   useEffect( ()=>{ 
        if(localStorage.getItem('userToken') !== null){ 
            setLogin(localStorage.getItem('userToken'))   
        } 
     } , [] ) 

  return (
    <userContext.Provider value={{ isLogin, setLogin }}>
      {props.children}
    </userContext.Provider>
  );
}
