// /api/admin/orders/[...slug].js
import connectToDatabase from '@/libs/mongodb'
import User from '@/models/userSchema'
import { detailCartItem } from '@/utils/detailCartItems'

export default async function (req, res) {
    const element = req.query.slug[0]
    const key = req.query.slug[1]

    try {
        if(req.method === 'GET') {
            await connectToDatabase()
            const regex = new RegExp(key.split('').join('.*'), 'i')
            
            let orders
            if(element === 'status'){
                orders = await User.find({ orders: {
                    $elemMatch: { [element]: regex }
                }}).select(['orders'])
            }
            
            // search by id
            if(element === 'search-id') {
                orders = await User.find({ 'orders._id': key }, { 'orders.$': 1 })
            }
            let result = []
            for(let order of orders) {
                const cart = await detailCartItem(order.orders[0].cart)
                result.push({ ...order.orders[0]._doc, cart })
            }
            console.log(result)
            return res.status(200).json({ result: result || [] })
        }
        return res.status(403).json({ message: 'Method not allowed' })
    } catch(error) {
        console.error(error.message)
        return res.status(500).json({ message: 'Internal server error' })
    }
}