import { createContext, useContext, useState } from "react";

const AlertContext = createContext()

export function useAlert(){
    return useContext(AlertContext)
}

const initialState = {
    show: false,
    message: "",
    type: ""
}

export default function AlertProvider({children}){
    const [isAlert, setIsAlert] = useState(initialState)

    function showAlert({ message, type }){
        setIsAlert({ show: true, message, type })

        const timeout = setTimeout(() => {
            setIsAlert({ show: false, message: "", type: "" })
        }, 5000);

        return function() {
            clearTimeout(timeout)
        }
    }
    
    return (
        <AlertContext.Provider value={{ isAlert, setIsAlert, showAlert}}>
            {children}
        </AlertContext.Provider>
    )
}