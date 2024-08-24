import useFetchData from '@/services/useFetchData';
import { useEffect } from 'react';

export default function SelectPayment({onChange, errors}) {
    const { loading, fetchData, result: payments } = useFetchData();

    useEffect(() => {
        fetchData('/api/payment');
    }, []);

    return (
        <div className='bg-white p-3.5 rounded-xl shadow'>
            <h3 className='mb-3.5'>Metod pembayaran</h3>
            <select
                name='payment'
                id='payment'
                onChange={onChange}
                className='uppercase w-full p-2.5 bg-gray-100 rounded-md border-2'
                style={{ borderColor: errors.includes("payment") && "var(--red-primer)"}}
            >
                <option value=''>Pilih metode pembayaran</option>
                {payments?.map((payment) => (
                    <option value={payment._id} className='uppercase bg-red-200' key={payment._id}>
                        {payment.name}
                    </option>
                ))}
            </select>
        </div>
    );
}
