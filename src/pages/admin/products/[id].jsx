import { InputField } from "@/components/common/inputField";
import AdminLayout from "@/components/layout/adminLayout";
import InputImage from "@/components/ui/inputImage";
import InputVariants from "@/components/ui/inputVariants";
import { useAlert } from "@/contexts/alertContext";
import axiosIntelence from "@/libs/axios";
import useImageServices from "@/services/useImageServices";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

export default function ProductPage({ product: initialProduct }) {
    const [product, setProduct] = useState(initialProduct);
    const [variants, setVariants] = useState(initialProduct.variants);
    const { inputImages, images, uploadImages } = useImageServices(
        product.images
    );

    const { showAlert } = useAlert();

    function changeHandler(event) {
        const { name, value } = event.target;
        const regex = /[^a-zA-Z0-9.,#@\s]/g;

        setProduct((prev) => ({
            ...prev,
            [name]: value.replace(regex, ""),
        }));
    }

    function addMoreVariant() {
        setVariants((prev) => [
            ...prev,
            { _id: uuidv4(), name: "", price: "" },
        ]);
    }

    async function submitHandler() {
        let variants = sessionStorage.getItem(`variants-${product._id}`);
        let imgUrl = [];

        if (images.files?.length > 0) {
            imgUrl = await uploadImages(product);
        }

        variants = variants?.reduce((newVariant, variant) => {
            product.map((variantProduct) => {
                if (variant._id !== variantProduct._id) {
                    newVariant.push(variant);
                }
            });

            return newVariant;
        });

        const response = await axiosIntelence.put(
            `/api/products/${product._id}`,
            {
                product: {
                    name: product.name,
                    brand: product.brand,
                    description: product.description,
                },
                addVariant: [],
                addImages: imgUrl,
            }
        );

        showAlert({
            type: response.status === 200 ? "success" : "error",
            message: response.data.message,
        });
    }

    return (
        <AdminLayout className="p-3.5">
            <section className="flex justify-between items-start my-2">
                <div>
                    <h2>
                        Update{" "}
                        <span className="text-red-600">{product.name}</span>
                    </h2>
                    <div className="text-gray-600">{product.brand}</div>
                </div>
                <div className="text-sm">
                    <button className="btn mx-2.5">BATALKAN</button>
                    <button className="btn btn-red" onClick={submitHandler}>
                        SIMPAN
                    </button>
                </div>
            </section>
            <section>
                <InputImage
                    imageChange={inputImages}
                    thumbnails={images.thumbnails}
                />
            </section>
            <section className="bg-white p-3.5 my-2 shadow rounded-xl">
                <InputField
                    label="Nama produk"
                    value={product.name}
                    onChange={changeHandler}
                    name="name"
                />
                <InputField
                    label="Brand produk"
                    value={product.brand}
                    onChange={changeHandler}
                    name="brand"
                />
            </section>
            <section className="bg-white p-3.5 rounded-xl my-2 shadow">
                <div className="font-semibold">Variant</div>
                {variants?.map((variant) => (
                    <InputVariants
                        productID={product._id}
                        key={variant._id}
                        variant={variant}
                        variants={variants}
                        setVariants={setVariants}
                    />
                ))}
                <button className="btn w-full my-2" onClick={addMoreVariant}>
                    Tambah variant baru
                </button>
            </section>
            <section className="bg-white p-3.5 my-2 rounded-xl shadow">
                <div className="font-semibold">Deskripsi produk</div>
                <textarea
                    className="min-h-10 p-2.5 bg-gray-100 w-full rounded-xl my-2"
                    placeholder="Deskripsi produk"
                    value={product.description}
                    onChange={changeHandler}
                    name="description"
                />
            </section>
        </AdminLayout>
    );
}

export async function getServerSideProps({ params }) {
    try {
        const response = await axiosIntelence.get(`/api/products/${params.id}`);
        return {
            props: {
                product: response.data.product,
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
