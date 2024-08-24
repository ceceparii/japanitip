// /api/user/orders/index.js
import midtrans from "@/libs/midtrans"
import connectToDatabase from "@/libs/mongodb"
import userSchema from "@/models/userSchema"
import { detailCartItem } from "@/utils/detailCartItems"
import { NextResponse } from "next/server"

const initialAddress =  {
    street: '',
    kelurahan: '',
    kecamatan: '',
    kabupaten: '',
    provinsi: ''
}

export default async function userOrders(req, res){
    const _userID = req.headers['id']
    await connectToDatabase()

    try {
        if (req.method === 'GET') {
            let user = await userSchema.findOne({ _id: _userID }).select(['_id', 'username', 'phone', 'address', 'cart'])
            const cartItem = await detailCartItem(user.cart)
            
            if(!user.address) {
                user.address = initialAddress
            }
            
            const totalAmount = cartItem.reduce((total, item) => {
                return total + item.price * item.quantity
            }, 0)
            
            return res.status(200).json({ message: '', result: { ...user._doc, totalAmount, items: cartItem } })
        }
        
        if(req.method === 'POST') {
            const {_id, ...orders} = req.body
            const user = await userSchema.findById(_userID)

            if(!user) {
                return NextResponse.redirect(new URL('/login', req.url)) 
            }

            const carts = await detailCartItem(orders.cart)
            const totalAmount = carts.reduce((total, cart) => {
                return total + cart.quantity * cart.price
            }, 0)

            user.orders.push({ ...orders, _userID, totalAmount })
            await user.save()
            
            const order = user.orders[user.orders.length -1]

            res.status(200).json({ message: 'Berhasil membuat pesanan', result: order._id })
        }
        
        return res.status(400).json({ message: 'Method not allowed' })
    } catch (error) {
        console.error(error.message)
        return res.status(500).json({ message: 'Internal server error' })
    }
}