import { InputField } from '@/components/common/inputField';
import AdminLayout from '@/components/layout/adminLayout';
import { useAlert } from '@/contexts/alertContext';
import axiosIntelence from '@/libs/axios';
import { useRouter } from 'next/router';
import { useState } from 'react';

const initialPayment = {
    name: '',
    accountNumber: '',
    accountName: '',
};

export default function CreatePaymnet() {
    const [isTransfer, setIsTransfer] = useState(true);
    const [payment, setPayment] = useState(initialPayment);
    const router = useRouter();
    const {showAlert} = useAlert()

    function changeHandler(event) {
        const { name, value } = event.target;
        setPayment((prev) => ({ ...prev, [name]: value }));
    }

    async function submitHandler() {
        const response = await axiosIntelence.post('/api/payment', {
            ...payment,
            method: isTransfer ? 'transfer' : 'e-wallet',
        });
        showAlert({
            type: response.status === 201 ? 'success' : 'error',
            message: response.data.message,
        });
        if (response.status === 201) {
            router.push('/admin/payment');
        }
    }

    return (
        <AdminLayout className='p-3.5'>
            <section className='relative bg-white p-3.5 rounded-xl'>
                <div className='w-full flex mb-7'>
                    <button
                        className={`${
                            isTransfer && 'btn-red'
                        } w-full rounded-l-md`}
                        onClick={() => setIsTransfer(true)}
                    >
                        Transfer
                    </button>
                    <button
                        className={`${
                            !isTransfer && 'btn-red'
                        } w-full rounded-r-md`}
                        onClick={() => setIsTransfer(false)}
                    >
                        E-wallet
                    </button>
                </div>
                <InputField
                    label={isTransfer ? 'Nama Bank' : 'Nama E-wallet'}
                    onChange={changeHandler}
                    value={payment.name}
                    name='name'
                />
                <InputField
                    onChange={changeHandler}
                    value={payment.accountNumber}
                    name='accountNumber'
                    label={isTransfer ? 'Nomor rekening' : 'Nomor E-wallet'}
                />
                <InputField
                    label='Nama pemilik akun'
                    onChange={changeHandler}
                    name='accountName'
                    value={payment.accountName}
                />
            </section>
            <button
                className='btn btn-red w-full my-3.5'
                onClick={submitHandler}
            >
                SIMPAN
            </button>
        </AdminLayout>
    );
}
