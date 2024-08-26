// /admin/orders/[id].jsx
import { useRouter } from "next/router"
import AdminLayout from "@/components/layout/adminLayout"
import { idrFormat } from "@/utils/format"
import useFetchData from "@/services/useFetchData"
import { useEffect } from "react"

export default function OrderDetails(){
    const {loading, fetchData, result } = useFetchData()
    const { query } = useRouter()
    
    useEffect(() => {
        if (query.id) {
            fetchData(`/api/admin/orders/search-id/${query.id}`)
        }
    }, [query.id])
    
    if(loading) return null
    
    const order = result[0]
    
    return (
        <AdminLayout className='p-3.5 capitalize'>
            <section className="bg-white p-2.5 rounded-lg shadow-md">
                <div className="font-semibold">
                    detail pesanan
                </div>
                <div className="flex justify-between">
                    <span>Order id</span>
                    <span>{order._id}</span>
                </div>
                <div className="flex justify-between">
                    <span>username</span>
                    <span>{order.username}</span>
                </div>
                <div className="flex justify-between">
                    <span>phone</span>
                    <span>{order.phone}</span>
                </div>
                <div className="flex justify-between gap-3">
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
            </section>
            <section className="p-2.5 rounded-xl shadow bg-white my-3.5">
                <div className="flex justify-between">
                    <span>status pesanan</span>
                    <span>{order.status}</span>
                </div>
                <div className="flex justify-between">
                    <span>total pesanan</span>
                    <span className="font-semibold text-[var(--red-primer)]">
                        {idrFormat.format(order.totalAmount)}
                    </span>
                </div>
                <div>item</div>
                <div>
                    {order.cart.map((cart, index) => 
                        <div className="flex gap-2.5 my-2.5 justify-between" key={index}>
                            <div>{cart.name}</div>
                            <div>{cart.variantName}</div>
                            <span className='whitespace-nowrap'>
                                QTY: {cart.quantity}
                            </span>
                            <div>{idrFormat.format(cart.price)}</div>
                        </div>
                    )}
                </div>
            </section>
            <section className="">
                
            </section>
        </AdminLayout>
    )
}