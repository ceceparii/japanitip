// /api/user/orders/[id].js

import midtrans from "@/libs/midtrans";
import connectToDatabase from "@/libs/mongodb";
import paymentSchema from "@/models/paymentSchema";
import User from "@/models/userSchema";
import { detailCartItem } from "@/utils/detailCartItems";
import { NextResponse } from "next/server";

export default async function orderPayment(req, res) {
    await connectToDatabase()
    const _userID = req.headers['id']

    try {
        const _orderID = req.query.id

        if (req.method === 'GET') {
            const user = await User.findOne({ _id: _userID, 'orders._id': _orderID }, { 'orders.$': 1 })
            const cart = await detailCartItem(user.orders[0].cart)
            const totalAmount = cart.reduce((total, item) => {
                return total + item.quantity * item.price
            }, 0)
            const payment = await paymentSchema.findOne({ _id: user.orders[0].payment })

            return res.status(200).json({ message: '', result: { ...user.orders[0]._doc, totalAmount, payment } })
        }

        if (req.method === 'POST') {
            const carts = await detailCartItem(req.body.cart)
            const totalAmount = carts.reduce((total, cart) => {
                return total + cart.quantity * cart.price
            }, 0)

            const parameter = {
                transaction_details: {
                    order_id: req.body._id,
                    gross_amount: totalAmount,
                },
                credit_card: {
                    secure: true,
                },
                customer_details: {
                    first_name: req.body.username,
                    phone: req.body.phone,
                },
            };

            const transaction = await midtrans.createTransaction(parameter)
            return res.status(200).json({ transactionToken: transaction.token, redirectUrl: transaction.redirect_url })
        }

        if(req.method === 'PUT'){
            const user = await User.findById(_userID)
            const order = user.orders.id(_orderID)
            order.status = req.body.status
            await user.save()

            return NextResponse.redirect(new URL('/v1', req.url))
        }

        return res.status(403).json({ message: 'Method not allowed' })
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ message: 'Internal server error' })
    }
}