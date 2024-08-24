import axiosIntelence from "@/libs/axios";
import useFetchData from "@/services/useFetchData";
import { createContext, useContext, useEffect } from "react";

const CartContext = createContext();

export function useCartContext() {
    return useContext(CartContext);
}

export default function CartProvider({ children }) {
    const {loading, result, setResult, fetchData} = useFetchData()

    useEffect(() => {
        // initial cart data
        fetchData('/api/user/cart')
    }, [])
    
    // delete item cart
    async function deleteHandler(_cartID) {
        const response = await axiosIntelence.delete(
            `/api/user/cart/${_cartID}`
        )
        if (response.status === 200) {
            fetchData('/api/user/cart');
        }
    }

    // update quantity
    async function changeQuantity(_cartID, quantity) {
        setResult(result?.map((prev) => prev._id === _cartID ? {...prev, quantity} : prev))
        
        await axiosIntelence.put(`/api/user/cart/${_cartID}`, {
            quantity,
        });
    }

    // total price
    const totalAmount = result?.reduce(( total, cart) => {
        return total + cart.quantity * cart.price
    }, 0)

    return (
        <CartContext.Provider value={{ totalAmount, deleteHandler, changeQuantity, loading, result }}>
            {children}
        </CartContext.Provider>
    );
}