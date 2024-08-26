import axiosIntelence from "@/libs/axios";
import { useEffect, useState } from "react";
import ProductCard from "../ui/productCard";

export default function PopularProducts() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProduct = async () => {
            const response = await axiosIntelence.get("/api/products");
            setProducts(response.data.products);
        };

        fetchProduct();
    }, []);

    return (
        <div className="flex gap-3.5 overflow-scroll">
            {products.map((product) => (
                <ProductCard key={product._id} {...product} />
            ))}
        </div>
    );
}
