import { useState } from "react";

export function useValidate(){
    const [errors, setErrors] = useState()

    function validate(obj){
        setErrors([])
        return Object.keys(obj).reduce(( errorKeys, key) => {
            if (!obj[key]) {
                errorKeys.push(key)
                setErrors(key)
            }

            return errorKeys
        }, [])
    }

    return { errors, validate }
}