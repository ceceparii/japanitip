import Header from "@/components/common/header"
import { InputField } from "@/components/common/inputField"
import { useAlert } from "@/contexts/alertContext"
import axiosIntelence from "@/libs/axios"
import useFetchData from "@/services/useFetchData"
import { validateObject } from "@/utils/validateObject"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"

export default function UserSetting() {
    const {fetchData, result: user, setResult: setUser} = useFetchData()
    const [errors, setErrors] = useState([])
    const {showAlert} = useAlert()
    const router = useRouter()

    useEffect(() => {
        fetchData(`/api/user/settings`)
    }, [])

    function changeAddress(event) {
        const {value, name} = event.target
        setUser((prev) => ({
            ...prev,
            address: { ...prev.address, [name]: value }
        }))
    }

    async function submitHandler() {
        const isEmpty = validateObject(user.address)
        if (isEmpty.length > 0) {
           return setErrors(isEmpty) 
        }

        const response = await axiosIntelence.put('/api/user/settings', user)
        showAlert({
            type: response.status === 200 ? 'success' : 'error',
            message: response.data.message,
        })

        if (response.status === 200) {
            router.push('/v1/user/profile')
        }
    }

    return (
        <main className="capitalize">
            <Header>Pengaturan pengguna</Header>
            <section className="p-3.5 m-3.5 bg-white rounded-xl shadow ">
                <h2>detail pengguna</h2>
                <InputField
                    label='Nama lengkap'
                    value={user?.username}
                    name='username'
                    readOnly={true}
                />
                <InputField
                    label='Nomor handphone'
                    value={user?.phone}
                    name='username'
                    readOnly={true}
                />
            </section>
            <section className="m-3.5 p-3.5 bg-white rounded-xl shadow">
                <h2>Alamat pengiriman</h2>
                <InputField
                    label='Alamat lengkap'
                    placeholder='Jl. Sukses berkah, No. 01'
                    value={user?.address.street}
                    name='street'
                    onChange={(event) => changeAddress(event)}
                    errors={errors}
                />
                <div className="flex gap-3.5">
                    <InputField
                        label='kelurahan'
                        placeholder='Kelurahan/Desa'
                        value={user?.address.kelurahan}
                        name='kelurahan'
                        onChange={(event) => changeAddress(event)}
                        errors={errors}
                    />  
                    <InputField
                        label='kecamatan'
                        placeholder='Kecamatan'
                        value={user?.address.kecamatan}
                        name='kecamatan'
                        onChange={(event) => changeAddress(event)}
                        errors={errors}
                    />  
                </div>
                <div className="flex gap-3.5">
                    <InputField
                        label='kabupaten'
                        placeholder='Kabupaten/Kota'
                        value={user?.address.kabupaten}
                        name='kabupaten'
                        onChange={(event) => changeAddress(event)}
                        errors={errors}
                    />  
                    <InputField
                        label='provinsi'
                        placeholder='Provinsi'
                        value={user?.address.provinsi}
                        name='provinsi'
                        onChange={(event) => changeAddress(event)}
                        errors={errors}
                    />  
                </div>
            </section>
            <section className="w-full bg-white p-3.5 shadow">
                <button className="btn btn-red w-full" onClick={submitHandler}>SIMPAN</button>
            </section>
        </main>
    )
}