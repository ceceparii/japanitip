// /v1/user/payment/[id].jsx

import useFetchData from '@/services/useFetchData';
import { convertToIDR } from '@/utils/priceHandler';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function PaymentPage() {
    const { loading, fetchData, result: order } = useFetchData();
    const router = useRouter();

    useEffect(() => {
        if (router.query.id) {
            fetchData(`/api/user/orders/${router.query.id}`);
        }
    }, [router.query.id]);

    if (loading) return null;

    return (
        <>
            <header className='p-3.5 bg-white shadow flex gap-3.5 items-center'>
                <Link href='/v1'>
                    <FontAwesomeIcon icon={faArrowLeft} className='text-xl' />
                </Link>
                <span className='text-xl'>Pembayaran pesanan</span>
            </header>
            <main className='p-3.5 capitalize'>
                <section className='bg-white p-3.5 rounded-xl shadow  relative'>
                    <h3>Total pembayaran</h3>
                    <div className='flex justify-between'>
                        Total{' '}
                        <span>{convertToIDR.format(order.totalAmount)}</span>
                    </div>
                </section>
                <section className='bg-white p-3.5 rounded-xl relative shadow my-3.5'>
                    <h3>Tipe pembayaran</h3>
                    <div className="absolute top-3.5 right-3.5 ">
                        [{order.payment.method?.replace('_', ' ')}]
                    </div>
                    <div className='flex justify-between'>
                        <span>status</span>
                        <div className='text-[var(--red-primer)]'>
                            {order.status?.replace('_', ' ')}
                        </div>
                    </div>
                    <div className='flex justify-between'>
                        <span>Nomor {order.payment.method}</span>
                        <span>{order.payment.accountNumber}</span>
                    </div>
                    <div className='flex justify-between'>
                        <span>Nama penerima</span>
                        <span>{order.payment.accountName}</span>
                    </div>
                </section>
                <section className='bg-white p-3.5 rounded-xl shadow'>
                    <h3>Detail pengiriman</h3>
                    <div className='flex justify-between'>
                        <span>Nama lengkap</span>
                        <span>{order.username}</span>
                    </div>
                    <div className='flex justify-between'>
                        <span>Nomor Handphone</span>
                        <span>{order.phone}</span>
                    </div>
                    <div className=''>
                        <div>Alamat</div>
                        <div className='p-1.5 text-sm bg-gray-50'>
                            <div>{order.address.street}</div>
                            <div>
                                Kel. {order.address.kelurahan}, Kec.{' '}
                                {order.address.kecamatan}
                            </div>
                            <div>
                                Kab. {order.address.kabupaten}, Prov.{' '}
                                {order.address.provinsi}, ID
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <section className='fixed bottom-0 left-0 w-full p-3.5 bg-white shadow'>
                <button
                    onClick={() => router.push('/v1')}
                    className='btn btn-red w-full'
                >
                    KONFIRMASI
                </button>
            </section>
        </>
    );
}
