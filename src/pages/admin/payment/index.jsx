import AdminLayout from '@/components/layout/adminLayout';
import axiosIntelence from '@/libs/axios';
import paymentSchema from '@/models/paymentSchema';
import Link from 'next/link';

export default function PaymnetPage({ payments: paymentData }) {
    const payments = JSON.parse(paymentData);

    return (
        <AdminLayout className='p-3.5'>
            <section className='flex justify-between my-3.5'>
                <h1>Tipe pembayaran</h1>
            <Link href='/admin/payment/create' className='btn btn-red'>
                Tambah
            </Link>
            </section>
            <section className='bg-white rounded-xl p-3.5 mb-3.5 shadow'>
                {payments.map((payment) => (
                    <div key={payment._id} className='my-3.5 border p-2 rounded-md'>
                        <h3 className='uppercase'>{payment.name}</h3>
                        <div>{payment.accountNumber}</div>
                        <div>{payment.accountName}</div>
                    </div>
                ))}
            </section>
        </AdminLayout>
    );
}

export async function getServerSideProps() {
    try {
        const payments = await paymentSchema.find({});
        return {
            props: { payments: JSON.stringify(payments) },
        };
    } catch (error) {
        return {
            props: { payments: [] },
        };
    }
}
