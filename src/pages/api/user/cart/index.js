// /api/user/cart/index.js
import productSchema from "@/models/productSchema";
import userSchema from "@/models/userSchema";
import connectToDatabase from '@/libs/mongodb'

export default async function userCart(req, res){
    const _userID = req.headers["id"];
    await connectToDatabase()

    try {
        if(!_userID){
            return NextResponse.redirect(new URL('/login', req.url))
        }
        // get user cart
        if (req.method === "GET") {
            const { cart } = await userSchema.findOne({ _id: _userID }).select("cart");
            
            let cartItem = [];
            for (let item of cart) {
                let productCart = await productSchema.findOne({
                    _id: item._productID,
                });
                
                const variant = productCart.variants?.find(
                    (variant) => variant._id.toString() === item._variantID
                );
                
                cartItem.push({
                    ...item._doc,
                    images: [productCart.images[0]],
                    name: productCart.name,
                    price: variant.price,
                    variantName: variant.name,
                    inStock: variant.inStock,
                });
            }
            
            return res.status(200).json({ result: cartItem, message: "" });
        }
        
        // add to cart
        if (req.method === "POST") {
            const { itemCart } = req.body;
            
            let isExists = await userSchema.findOne({
                _id: _userID,
                cart: {
                    $elemMatch: {
                        _productID: itemCart._productID,
                        _variantID: itemCart._variantID,
                    },
                },
            });
            
            if (!isExists) {
                await userSchema.updateOne({ _id: _userID },{
                        $push: { cart: itemCart },
                    }
                );
                
                return res.status(201).json({
                    message: "Item berhasil ditambahkan ke keranjang",
                });
            }
            
            await userSchema.updateOne(
                {
                    _id: _userID,
                    cart: {
                        $elemMatch: {
                            _productID: itemCart._productID,
                            _variantID: itemCart._variantID,
                        },
                    },
                },
                {
                    $inc: {
                        "cart.$.quantity": 1,
                    },
                }
            );
            
            return res
                .status(201)
                .json({ message: "Berhasil ditambahkan ke keranjang" });
        }
        
        return res.status(400).json({ message: `Method ${req.method} not allowed` })
    } catch(error) {
        console.error(error)
        return res.status(500).json({ message: 'Internal server error' })
    }
}