import { InputField } from "@/components/common/inputField";
import { useAlert } from "@/contexts/alertContext";
import Link from "next/link";
import { useState } from "react";
import axios from "@/libs/axios";
import { validateObject } from "@/utils/validateObject";
import { useRouter } from "next/router";

const initialState = {
    phone: "",
    password: "",
};

export default function () {
    const [loginData, setLoginData] = useState(initialState);
    const { showAlert } = useAlert();
    const [errors, setErrors] = useState([]);
    const router = useRouter();

    function changeHandler(event) {
        const regex = /[^a-zA-Z0-9]/g;
        const { name, value } = event.target;
        setLoginData((prev) => ({
            ...prev,
            [name]: value.replace(regex, ""),
        }));
    }

    async function submitHandler() {
        const emptyField = validateObject(loginData);

        if (emptyField.length > 0) {
            return setErrors(emptyField);
        }

        const response = await axios.post("/api/auth/login", loginData);

        localStorage.setItem("auth", response.data.accessToken);
        
        router.push(response.data.role === "admin" ? "/admin" : "/");
        showAlert({
            type: response.status === 200 ? "success" : "error",
            message: response.data.message,
        });
    }

    return (
        <main className="p-3 5">
            <h1>selamat datang kembali</h1>
            <div className="">
                belum punya akun ?
                <Link
                    href={"/register"}
                    className="font-semibold text-blue-600 mx-2"
                >
                    Datar
                </Link>
            </div>
            <section className="bg-white rounded-xl my-3.5 p-3 5 shadow">
                <InputField
                    label="Nomor handphone"
                    name="phone"
                    onChange={changeHandler}
                    value={loginData.phone}
                    errors={errors}
                    placeholder="Maksimal 12 karakter"
                />
                <InputField
                    label="Password"
                    name="password"
                    errors={errors}
                    onChange={changeHandler}
                    value={loginData.password}
                    placeholder="Masukan password"
                    type="password"
                />
            </section>
            <button className="btn btn-red w-full" onClick={submitHandler}>
                MASUK
            </button>
        </main>
    );
}
