import ImageDisplay from "@/components/common/imageDisplay";
import axios from "@/libs/axios";
import { convertToIDR } from "@/utils/priceHandler";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Products() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        async function fetchProducts() {
            const response = await axios.get("/api/products");
            if (response.data.products?.length > 0) {
                setProducts(response.data.products);
            }
        }

        fetchProducts();
    }, []);

    return (
        <main>
            {products?.map((product) => (
                <div
                    className="flex gap-3.5 my-2.5 items-center"
                    key={product._id}
                >
                    <ImageDisplay
                        src={product?.images[0]}
                        className="aspect-square w-20"
                    />
                    <div className="font-semibold w-full">
                        <div>{product.name}</div>
                        <div className="text-red-600">
                            {convertToIDR.format(product.variants[0].price)}
                        </div>
                    </div>
                    <Link
                        className="btn text-sm"
                        href={`/admin/products/${product._id}`}
                    >
                        UPDATE
                    </Link>
                </div>
            ))}
        </main>
    );
}
