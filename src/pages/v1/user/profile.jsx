import Header from '@/components/common/header';
import useFetchData from '@/services/useFetchData';
import {
    faAngleRight,
    faGear,
    faShippingFast,
    faShoppingCart,
    faUserCircle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { useEffect } from 'react';

function LinkTo(props) {
    return (
        <Link
            href={props.href}
            className={`flex gap-3.5 items-center my-2.5 justify-between py-2 border-b w-full`}
        >
            <span>
                <FontAwesomeIcon icon={props.icon} className={props.iconColor} />
                <span className='mx-2.5'>{props.children}</span>
            </span>
            <FontAwesomeIcon icon={faAngleRight} />
        </Link>
    );
}

export default function Profile() {
    const {loading, result, fetchData} = useFetchData()

    useEffect(() => {
        fetchData('/api/user')
    }, [])

    if(loading) return null

    return (
        <>
            <Header backPath={'/v1'}>
                Profile pengguna
            </Header>
            <main className='p-3.5 capitalize'>
                <section className='p-3.5 rounded-xl bg-white shadow flex items-center gap-3.5'>
                    <FontAwesomeIcon
                        icon={faUserCircle}
                        className='text-4xl text-gray-600'
                    />
                    <span>
                        <div className='font-semibold'>{result?.username}</div>
                        <div className='text-gray-600'>{result?.phone}</div>
                    </span>
                </section>
                <section className='my-3.5 bg-white p-3.5 rounded-xl shadow'>
                    <LinkTo href='orders' iconColor='text-red-500' icon={faShippingFast}>
                        pesanan
                    </LinkTo>
                    <LinkTo href='cart' iconColor='text-green-500' icon={faShoppingCart}>
                        Keranjang
                    </LinkTo>
                    <LinkTo href='settings' iconColor='text-blue-500' icon={faGear}>
                        pengaturan akun
                    </LinkTo>
                </section>
            </main>
        </>
    );
}