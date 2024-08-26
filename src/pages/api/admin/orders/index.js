// /api/admin/orders/index.js
import connectToDatabase from "@/libs/mongodb";
import User from "@/models/userSchema";

export default async function userOrders(req, res) {
    try {
        if(req.method === 'GET') {
            await connectToDatabase()
            const orders = await User.find({}).select(['orders'])
            const [result] = orders?.map((order) => order.orders)
                        
            return res.status(200).json({ message: '', result })
        }
        
        if(req.method === 'POST') {
            await connectToDatabase()
            
            const orders = await User.find({ orders: { 
                $elemMatch: { status: req.body.filterKey }
            }}).select('orders')
            
            
            const [result] = orders?.map((order) => order.orders)
            
            return res.status(200).json({ message: '', result: result || [] })
        }
        
        return res.status(403).json({ message: 'Method not allowed' })
    } catch (error) {
        console.error('user order :', error.message)
        return res.status(500).json({ message: 'User orders internal server error' })
    }
}