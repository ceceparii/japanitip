// /v1/user/orders/index.js
import ImageDisplay from '@/components/common/imageDisplay';
import { InputField } from '@/components/common/inputField';
import Layout from '@/components/layout/layout';
import { useAlert } from '@/contexts/alertContext';
import axiosIntelence from '@/libs/axios';
import useFetchData from '@/services/useFetchData';
import { useValidate } from '@/services/useValidate';
import { convertToIDR } from '@/utils/priceHandler';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

function OrderDetail({ totalAmount }) {

    return (
        <div className='p-3 5 my-3.5 bg-white rounded-xl shadow'>
            <h3 className='mb-2.5'>Detail pembayaran</h3>
            <div className='flex justify-between'>
                <span>Total pesanan</span>
                <span>{convertToIDR.format(totalAmount)}</span>
            </div>
            <div className='flex justify-between'>
                <span>Pajak</span>
                <span>Rp 0</span>
            </div>
            <div className='flex justify-between font-semibold'>
                <span>Total pembayaran</span>
                <span>{convertToIDR.format(totalAmount)}</span>
            </div>
        </div>
    );
}

function UserAddress(props) {
    return (
        <div className='my-2 bg-white p-3.5 rounded-xl shadow'>
            <h3>Informasi pengiriman</h3>
            <InputField
                label='Alamat'
                name='street'
                onChange={props.onChange}
                value={props.address?.street}
                errors={props.errors}
            />
            <div className='flex gap-3.5'>
                <InputField
                    label='kelurahan'
                    name='kelurahan'
                    onChange={props.onChange}
                    value={props.address?.kelurahan}
                    errors={props.errors}
                />
                <InputField
                    label='kecamatan'
                    name='kecamatan'
                    onChange={props.onChange}
                    value={props.address?.kecamatan}
                    errors={props.errors}
                />
            </div>
            <div className='flex gap-3.5'>
                <InputField
                    label='kabupaten'
                    name='kabupaten'
                    onChange={props.onChange}
                    value={props.address?.kabupaten}
                    errors={props.errors}
                />
                <InputField
                    label='provinsi'
                    name='provinsi'
                    onChange={props.onChange}
                    value={props.address?.provinsi}
                    errors={props.errors}
                />
            </div>
        </div>
    );
}

function Userdetail(props) {
    return (
        <div className='my-3.5 bg-white p-3.5 rounded-xl shadow'>
            <h3>Detail pengguna</h3>
            <InputField
                label='Nama lengkap'
                value={props.username}
                name='username'
                onChange={props.onChange}
                errors={props.errors}
            />
            <InputField
                label='Nomor handphone'
                value={props.phone}
                name='phone'
                onChange={props.onChange}
                errors={props.errors}
            />
        </div>
    );
}

export default function OrderPage() {
    const { loading, result: orders, fetchData, setResult: setOrders } = useFetchData();
    const {showAlert} = useAlert()
    const {errors, validate} = useValidate()
    const router = useRouter()

    useEffect(() => {
        fetchData('/api/user/orders');
    }, []);
    
    // change handler
    function userDetailChange(event) {
        const { name, value } = event.target
        setOrders((prev) => ({ ...prev, [name]: value }));
    }
    
    // address change handler
    function userAddressChange(event) {
        const { name, value } = event.target;
        setOrders((prev) => ({
            ...prev,
            address: { ...prev.address, [name]: value },
        }));
    }
    
    // submit orders
    async function submitOrders() {
        const emtpyField = validate(orders)
        const emptyAddress = validate(orders.address)

        if (emtpyField.length > 0 || emptyAddress.length > 0) return null
        const {totalAmount, items, ...order} = orders
        const response = await axiosIntelence.post('/api/user/orders', order)
        
        showAlert({
            type: response.status === 200 ? 'success' : 'error',
            message: response.data.message,
        })

        if (response.status === 200) {
            router.push(`${response.data.result}`)
        }
    }

    return (
        <Layout loading={loading}>
            <section className='px-3.5'>
                <OrderDetail totalAmount={orders?.totalAmount}/>
                <Userdetail {...orders} onChange={userDetailChange} errors={errors}/>
                <UserAddress
                    address={orders?.address}
                    errors={errors}
                    onChange={userAddressChange}
                />
            </section>
            <section className='bg-white rounded-xl shadow p-3.5 m-3.5'>
                <div className='font-semibold'>Item</div>
                {orders?.items.map((cart, index) => (
                    <div key={index} className='flex gap-2 my-2'>
                        <ImageDisplay
                            src={cart.images[0]}
                            className='h-20 aspect-square'
                        />
                        <div className='w-full capitalize'>
                            <div className='font-semibold'>{cart.name}</div>
                            <div className=''>{cart.variantName}</div>
                            <div>{convertToIDR.format(cart.price)}</div>
                        </div>
                        <div className='font-semibold w-max'>
                            <div>Qty: {cart.quantity}</div>
                            <div className='text-[var(--red-primer)]'>
                                {convertToIDR.format(
                                    cart.quantity * cart.price
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </section>
            <section className='mt-3.5 w-full p-3.5 bg-white shadow'>
                <button className='btn btn-red w-full' onClick={submitOrders}>
                    KONFIRMASI PESANAN
                </button>
            </section>
        </Layout>
    );
}
