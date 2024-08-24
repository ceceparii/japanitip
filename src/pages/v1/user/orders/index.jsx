// /v1/user/orders/index.js
import Header from "@/components/common/header"
import ImageDisplay from "@/components/common/imageDisplay"
import { StatusUI } from "@/components/ui/statusUI"
import connectToDatabase from "@/libs/mongodb"
import userSchema from "@/models/userSchema"
import { detailCartItem } from "@/utils/detailCartItems"
import { dateFormat, idrFormat } from "@/utils/format"
import { faArrowRight } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Link from "next/link"

export default function OrdersPage({ orders: ordersInitial }) {
    let orders = JSON.parse(ordersInitial)
    
    return (
        <>
            <Header>
                Pesanan saya
            </Header>
            <section className="p-3.5 capitalize text-sm">
                {orders.map((order, index) =>
                    <div key={index} className="bg-white p-2.5 rounded-xl shadow">
                        <div className="flex justify-between items-center">
                            <span className="">
                                {dateFormat.format(new Date(order.createdAt))}
                            </span>
                            <span className="font-semibold text-[var(--red-primer)]">
                                {idrFormat.format(order.totalAmount)}
                            </span>
                        </div>
                        <div className="my-3.5 p-2.5 rounded-xl bg-[var(--gray-primer)] flex gap-3.5">
                            <ImageDisplay src={order.cart[0].images[0]} className='w-24 aspect-square rounded-lg overflow-hidden'/>
                            <div className="text-sm w-full flex flex-col justify-between">
                                <div className="font-semibold">{order.cart[0].name}</div>
                                <div className="w-full flex justify-between">
                                    <span className="">
                                        QTY: {order.cart[0].quantity}
                                    </span>
                                    <span className="text-[var(--red-primer)] font-semibold">
                                        {idrFormat.format(order.cart[0].price)}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-3.5 mt-5">
                            <StatusUI>{order.status}</StatusUI>
                            <Link href={`orders/${order._id}`} className="py-2 bg-[var(--gray-primer)] rounded-xl px-3">
                                <FontAwesomeIcon icon={faArrowRight} />
                            </Link>
                        </div>
                    </div>
                )}
            </section>
        </>
    )
}

export async function getServerSideProps({ req }) {
    try {
        const refreshToken = req.cookies.auth
        await connectToDatabase()
        
        let user = await userSchema.findOne({ refreshToken }).select('orders')
        
        let orders = []
        
        for(let order of user.orders){
            let products = await detailCartItem(order.cart)
            orders.push({ ...order._doc, cart: products })
        }
        
        return {
            props: {
                orders: JSON.stringify(orders)
            }
        }
    } catch (error) {
        console.error(error.message)
        return {
            redirect: {
                destination: '/login',
                permanent: false
            }
        }        
    }
}