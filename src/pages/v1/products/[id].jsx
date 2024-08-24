// /v1/products/[id].jsx
import ImageDisplay from "@/components/common/imageDisplay";
import Layout from "@/components/layout/layout";
import { useAlert } from "@/contexts/alertContext";
import axiosIntelence from "@/libs/axios";
import productSchema from "@/models/productSchema";
import { convertToIDR } from "@/utils/priceHandler";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

export default function ProductDetail({ product: initialProduct }) {
    let product = JSON.parse(initialProduct);
    const { showAlert } = useAlert();
    const [current, setCurrent] = useState(0);
    const [isSubmit, setIsSubmit] = useState(false);

    async function submitHandler() {
        setIsSubmit(true);
        const response = await axiosIntelence.post("/api/user/cart", {
            itemCart: {
                _productID: product._id,
                _variantID: product.variants[current]._id,
                quantity: 1,
            },
        });

        showAlert({
            type: response.status === 201 ? "success" : "error",
            message: response.data.message,
        });
        setIsSubmit(false);
    }

    return (
        <Layout>
            <h1>{product.name}</h1>
            <h2 className="text-gray-600">{product.brand}</h2>
            <section className="my-3.5">
                <ImageDisplay src={product.images[0]} />
            </section>
            <section className="my-3.5 shadow bg-white rounded-xl p-3.5">
                <h2 className="font-semibold flex justify-between">
                    Harga
                    <span className="text-red-600">
                        {convertToIDR.format(product.variants[current].price)}
                    </span>
                </h2>
                <div className="my-3.5">
                    <h3>Variant</h3>
                    {product.variants?.map((variant, index) => (
                        <button
                            className={`${
                                current === index && "btn-red"
                            } py-1 px-2.5 border text-sm mr-2.5`}
                            onClick={() => setCurrent(index)}
                            key={index}
                        >
                            {variant.name}
                        </button>
                    ))}
                </div>
                <div>
                    <h3>Deskripsi</h3>
                    <p>{product.description}</p>
                </div>
            </section>
            <section className="fixed w-full flex justify-around items-center shadow bottom-0 left-0 p-3.5 bg-white">
                <button
                    className="btn btn-red w-full"
                    onClick={submitHandler}
                    disabled={isSubmit ? true : false}
                    style={{ opacity: isSubmit ? "0.5" : "1" }}
                >
                    <FontAwesomeIcon icon={faShoppingCart} className="mr-3.5" />
                    Tambah
                </button>
            </section>
        </Layout>
    );
}

export async function getServerSideProps({ query }) {
    try {
        const product = await productSchema.findOne({ _id: query.id });
        return {
            props: {
                product: JSON.stringify(product),
            },
        };
    } catch (error) {
        return {
            props: {
                product: {},
            },
        };
    }
}
