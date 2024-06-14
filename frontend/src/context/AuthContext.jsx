import { Children, createContext, useContext, useState } from "react";
import { useActionData } from "react-router-dom";

export const Authcontext = createContext();

export const useAuthContext = () =>{
    return useContext(Authcontext);
}
export const AuthContextProvider = ({children}) => {
    const [authUser , setAuthUser] =  useState(JSON.parse(localStorage.getItem("chat-user")) || null);
    return <Authcontext.Provider value={{authUser , setAuthUser}}>{children}</Authcontext.Provider>
}