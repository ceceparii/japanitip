// /v1/user/orders/[id].jsx
import Header from "@/components/common/header"
import ImageDisplay from "@/components/common/imageDisplay"
import axiosIntelence from "@/libs/axios"
import connectToDatabase from "@/libs/mongodb"
import User from "@/models/userSchema"
import { detailCartItem } from "@/utils/detailCartItems"
import { dateFormat, idrFormat } from "@/utils/format"
import { statusColor } from "@/utils/statusColor"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"

export default function OrderDetail(props){
    const order = JSON.parse(props.order)
    const {background, color} = statusColor(order.status)
    const [isSubmit, setIsSubmit] = useState(false)
    const [transactionToken, setTransactionToken] = useState('')
    const router = useRouter()

    useEffect(() => {
        if(transactionToken && window.snap){
            window.snap.pay(transactionToken, {
                onSuccess: async function () {
                    await axiosIntelence.put(`/api/user/orders/${order._id}`, { status: 'diproses'})
                },
                onPending: function (result) {
                  console.log('Payment pending:', result);
                },
                onError: function (result) {
                  console.error('Payment error:', result);
                },
                onClose: function () {
                  setIsSubmit(false)  
                  console.log('Payment popup closed');
                },
              });
        }
    }, [transactionToken])

    async function submitHandler() {
        setIsSubmit(true)
        const response = await axiosIntelence.post(`/api/user/orders/${order._id}`, order)

        if (response.data.transactionToken) {
            setTransactionToken(response.data.transactionToken)
        }
    }

    return (
        <>
            <Header>Detail pesanan</Header>
            <main className="capitalize p-3.5">
                <div className="p-2.5 bg-white rounded-xl shadow text-sm">
                    <div className="w-full pb-2.5 border-b-2">
                        <div className="font-semibold">{order.username}</div>
                        <div className="text-gray-500">{order.phone}</div>
                    </div>
                    <div className="flex justify-between my-3.5">
                        <span>ID pesanan</span>
                        <span>{order._id}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span>status</span>
                        <span
                            style={{ background, color }}
                            className="px-1.5 py-1 text-center rounded-lg font-semibold"
                        >
                            {order.status.replace('_', ' ')}
                        </span>
                    </div>
                    <div className="flex justify-between my-3.5">
                        <span>waktu pemesanan</span>
                        <span>{dateFormat.format(order.createAt)}</span>
                    </div>
                    <div className="flex justify-between my-3.5 gap-3">
                        <span className="w-max whitespace-nowrap">alamat pengiriman</span>
                        <span className="w-full text-right">
                            <div>{order.address.street}</div>
                            <div>
                                Kel. {order.address.kelurahan}, Kec.{' '}
                                {order.address.kecamatan}
                            </div>
                            <div>
                                Kab. {order.address.kabupaten}, Prov.{' '}
                                {order.address.provinsi}
                            </div>
                        </span>
                    </div>
                    <div className="my-3.5 py-3.5 border-y-2">
                        {order.cart.map((cart, index) =>
                            <div className="flex gap-2.5 my-2.5" key={index}>
                                <ImageDisplay
                                    src={cart.images[0]}
                                    className='h-16 w-max rounded-md overflow-hidden'
                                />
                                <span className='w-full'>
                                    <div>{cart.name}</div>
                                    <div>{cart.variantName}</div>
                                    <div>{idrFormat.format(cart.price)}</div>
                                </span>
                                <span className='whitespace-nowrap'>
                                    QTY: {cart.quantity}
                                </span>
                            </div>
                        )}
                    </div>
                    <div className="flex justify-between font-semibold">
                        <span>Total</span>
                        <span>{idrFormat.format(order.totalAmount)}</span>
                    </div>
                </div>
                {order.status === 'menunggu_pembayaran' && 
                    <button
                        className="btn btn-red w-full my-3.5 shadow duration-200"
                        onClick={submitHandler}
                        disabled={isSubmit}
                        style={{ opacity: isSubmit ? '.5' : '1'}}
                    >
                        {isSubmit ? '...' : 'BAYAR SEKARANG'}
                    </button>
                }
            </main>
        </>
    )
}

export async function getServerSideProps({ query, req }) {
    let refreshToken = req.cookies.auth

    if (!refreshToken) {
        return {
            redirect: {
                destination: '/login',
                permanent: false
            }
        }
    }

    try {
        await connectToDatabase()
        const user = await User.findOne({ refreshToken, 'orders._id': query.id }, {'orders.$': 1})
        
        const items = []

        for(let order of user.orders){
            const [ product ] = await detailCartItem(order.cart)
            items.push(product)
        }
        
        const order = { ...user.orders[0]._doc, cart: items}

        return {
            props: { order: JSON.stringify(order) }
        }
    } catch (error) {
        console.error('order :', error.message)
        return {
            redirect: {
                destination: '/404',
                permanent: false
            }
        }
    }
}