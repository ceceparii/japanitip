import { InputField } from "@/components/common/inputField";
import Link from "next/link";
import { useState } from "react";
import axios from "@/libs/axios";
import { useAlert } from "@/contexts/alertContext";
import { useRouter } from "next/router";
import { validateObject } from "@/utils/validateObject";

const initialState = {
  username: "",
  phone: "",
  password: "",
  password2: "",
};

export default function () {
  const [registData, setRegistData] = useState(initialState);
  const [errors, setErrors] = useState([]);
  const { showAlert } = useAlert();
  const router = useRouter();

  // change handler
  function changeHandler(event) {
    const regex = /[^a-zA-Z0-9]/g;
    const { name, value } = event.target;

    setRegistData((prev) => ({
      ...prev,
      [name]: value.replace(regex, ""),
    }));
  }

  // submit handler
  async function submitHandler() {
    const emptyField = validateObject(registData);

    if (emptyField.length > 0) {
      return setErrors(emptyField);
    }

    if (registData.password !== registData.password2) {
      showAlert({ type: "error", message: "Password tidak sesuai" });
      return setErrors(["password", "password2"]);
    }

    const responsee = await axios.post("/api/auth/register", registData);
    showAlert({
      type: responsee.status === 201 ? "success" : "error",
      message: responsee.data.message,
    });

    if (responsee.status === 201) {
      router.push("/auth/login");
    }
  }

  return (
    <main className="p-3 5">
      <h1>Buat akun baru</h1>
      <div className="text-gray-600">
        Sudah punya akun ?{" "}
        <Link href={"/login"} className="font-semibold text-blue-600">
          Login
        </Link>
      </div>
      <section className="p-3.5 bg-white rounded-xl my-3.5">
        <InputField
          label="Nama lengkap"
          name="username"
          placeholder="Masukan nama lengkap anda"
          onChange={changeHandler}
          errors={errors}
          value={registData.username}
        />

        <InputField
          label="Nomor handphone"
          name="phone"
          placeholder="Nomor handphone"
          onChange={changeHandler}
          value={registData.phone}
          errors={errors}
        />
        <InputField
          label="Password"
          name="password"
          placeholder="Password"
          onChange={changeHandler}
          value={registData.password}
          type="password"
          errors={errors}
        />
        <InputField
          label="Ulangi password"
          name="password2"
          placeholder="Ulangi password"
          onChange={changeHandler}
          value={registData.password2}
          type="password"
          errors={errors}
        />
      </section>
      <button className="btn btn-red w-full" onClick={submitHandler}>
        SUBMIT
      </button>
    </main>
  );
}
