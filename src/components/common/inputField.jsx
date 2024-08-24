import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

export function InputField(props) {
    const [isPassword, setIsPasword] = useState(true);

    function passwordHandler() {
        setIsPasword(isPassword ? false : true);
    }

    return (
        <div className="my-2">
            <label htmlFor={props.name} className="font-semibold">
                {props.label}
            </label>
            <div className="relative">
                <input
                    name={props.name}
                    onChange={props.onChange}
                    value={props.value}
                    id={props.name}
                    placeholder={props.placeholder}
                    readOnly={props.readOnly}
                    type={
                        isPassword && props.type === "password"
                            ? "password"
                            : "text"
                    }
                    className="w-full p-2 rounded-md bg-gray-100"
                    style={{
                        border: "2px solid",
                        borderColor: props.errors?.includes(props.name)
                            ? "var(--red-primer)"
                            : "var(--gray-primer)",
                    }}
                    onFocus={props.onFocus}
                />
                {props.type === "password" && (
                    <FontAwesomeIcon
                        icon={isPassword ? faEyeSlash : faEye}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-500"
                        onClick={passwordHandler}
                    />
                )}
            </div>
        </div>
    );
}
