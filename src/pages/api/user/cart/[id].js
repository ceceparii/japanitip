// /api/user/cart/[id].js
import userSchema from "@/models/userSchema";
import { Types } from 'mongoose'
import connectToDatabase from '@/libs/mongodb'

export default async function userCart(req, res) {
    const _userID = req.headers["id"];
    
    await connectToDatabase()

    try {
        // delete cart item
        if(req.method === "DELETE") {
            const { id: _cartID } = req.query
            
            const result = await userSchema.updateOne({ _id: _userID }, {
                $pull: {
                    cart: { _id: new Types.ObjectId(_cartID) }
                }
            }, {
                new: true
            })
            
            return res.status(200).json({ message: 'Berhasil dihapus', result })
        }
        
        // update quantity item cart
        if (req.method === "PUT") {
            await userSchema.updateOne(
                {
                    _id: _userID,
                    cart: {
                        $elemMatch: {
                            _id: req.query.id,
                        },
                    },
                },
                { "cart.$.quantity": req.body.quantity }
            );
            
            return res.sendStatus(200)
        }
        
        return res
            .status(400)
            .json({ message: `Method '${req.method}' is not allowed` });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
}
