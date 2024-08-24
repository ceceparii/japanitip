import { useEffect, useState } from "react";
import { InputField } from "@/components/common/inputField";
import InputVariants from "@/components/ui/inputVariants";
import { validateObject } from "@/utils/validateObject";
import { useRouter } from "next/router";
import { v4 as uuidv4 } from "uuid";
import InputImage from "@/components/ui/inputImage";
import useImageServices from "@/services/useImageServices";
import axios from "@/libs/axios";
import { useAlert } from "@/contexts/alertContext";

const initialState = {
    name: "product 1",
    brand: "product brand",
    description: "description",
};

const initialVariant = {
    _id: uuidv4(),
    name: "variant 1",
    price: "2500",
};

export default function () {
    const router = useRouter();
    const [product, setProduct] = useState(initialState);
    const [errors, setErrors] = useState([]);
    const [variants, setVariants] = useState([initialVariant]);

    const { showAlert } = useAlert();

    const { inputImages, images, uploadImages } = useImageServices();

    useEffect(() => {
        // set variant if was saved
        let storageVariants = sessionStorage.getItem("variants");
        if (storageVariants) {
            setVariants(JSON.parse(storageVariants));
        }
    }, []);

    function addMoreVariant() {
        // add more variant
        setVariants((variant) => [
            ...variant,
            { _id: uuidv4(), name: "", price: "" },
        ]);
    }

    function changeHandler(event) {
        // change value ( not variants )
        const regex = /[^a-zA-Z0-9.,#@\s]/g;
        const { name, value } = event.target;
        setProduct((prev) => ({
            ...prev,
            [name]: value.replace(regex, ""),
        }));
    }

    // submit handler
    async function submitHandler() {
        const emptyField = validateObject(product);

        if (emptyField.length > 0) {
            return setErrors(emptyField);
        }

        const imgUrl = await uploadImages(product);

        const response = await axios.post("/api/products", {
            ...product,
            images: imgUrl,
            variants: JSON.parse(sessionStorage.getItem("variants")),
        });

        showAlert({
            type: response.status === 201 ? "success" : "error",
            message: response.data.message,
        });

        if (response.status === 201) {
            sessionStorage.removeItem("variants");
            router.push("/admin");
        }
    }

    return (
        <main className="p-3.5">
            <section className="flex mb-3.5 justify-between items-center">
                <div>
                    <h1>Buat produk baru</h1>
                    <div className="text-gray-600">Tambah produk baru</div>
                </div>
                <div className="text-sm">
                    <button className="btn mx-3">RESET</button>
                    <button className="btn btn-red" onClick={submitHandler}>
                        SIMPAN
                    </button>
                </div>
            </section>
            <section>
                <figure>
                    <InputImage
                        imageChange={inputImages}
                        thumbnails={images.thumbnails}
                    />
                </figure>
                <div>
                    <div className="p-3.5 bg-white rounded-2xl shadow my-2">
                        <InputField
                            label="Nama produk"
                            name="name"
                            placeholder="Nama produk baru"
                            value={product.name}
                            onChange={changeHandler}
                            errors={errors}
                        />
                        <InputField
                            label="Brand produk"
                            name="brand"
                            placeholder="Nama brand produk"
                            value={product.brand}
                            onChange={changeHandler}
                            errors={errors}
                        />
                    </div>
                    <div className="p-3.5 bg-white rounded-2xl shadow my-3.5">
                        <div className="font-semibold">Variant</div>
                        {variants?.map((variant) => (
                            <InputVariants
                                variant={variant}
                                variants={variants}
                                setVariants={setVariants}
                            />
                        ))}
                        <button
                            className="p-2 rounded-lg font-semibold text-gray-500 bg-gray-100 w-full my-3.5"
                            onClick={addMoreVariant}
                        >
                            Tambah variant
                        </button>
                    </div>
                    <div className="p-3 5 bg-white rounded-2xl shadow my-2">
                        <div className="font-semibold">Deskripsi</div>
                        <textarea
                            className="min-h-10 p-2.5 bg-gray-100 w-full rounded-xl my-2"
                            placeholder="Deskripsi produk"
                            onChange={changeHandler}
                            name="description"
                        />
                    </div>
                </div>
            </section>
        </main>
    );
}
