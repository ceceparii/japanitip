import productSchema from "@/models/productSchema";

export async function detailCartItem(cartItem){
    try {
        let detailItems = []

        for(let item of cartItem){
            const { _productID, _variantID, quantity } = item
            const product = await productSchema.findOne({ _id: _productID })

            const variant = product.variants?.find(
                (variant) => variant._id.toString() === _variantID
            );
            
            detailItems.push({
                _productID,
                _variantID,
                quantity,
                images: [product.images[0]],
                name: product.name,
                price: variant.price,
                variantName: variant.name,
            });
        }

        return detailItems
    } catch (error) {
        console.error(error.message)
        return cartItem
    }
}