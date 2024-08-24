import { useState } from "react";
import { InputField } from "../common/inputField";
import { validateObject } from "@/utils/validateObject";

export default function ({ variant, variants, setVariants, productID }) {
    const [errors, setErrors] = useState([]);
    const [isFocus, setIsFocus] = useState(false);

    function changeHandler(_id, event) {
        // change variant value
        const regex = /[^a-zA-Z0-9/\-\s]/g;
        const { name, value } = event.target;
        setVariants((variantData) =>
            variantData.map((prev) =>
                prev._id === _id
                    ? { ...prev, [name]: value.replace(regex, "") }
                    : prev
            )
        );
    }

    function deleteVariant(_id) {
        // delete variant
        setVariants((variant) => variant.filter((data) => data._id !== _id));
        setIsFocus(false);
    }

    function saveVariant() {
        // save variant
        const emptyField = validateObject(variant);
        if (emptyField.length > 0) {
            return setErrors(emptyField);
        }
        sessionStorage.setItem(
            `variants-${productID || "create"}`,
            JSON.stringify(variants)
        );
        setIsFocus(false);
    }

    return (
        <section>
            <div className="flex gap-3.5">
                <InputField
                    label=""
                    name="name"
                    placeholder="Nama variant"
                    value={variant.name}
                    onChange={(event) => changeHandler(variant._id, event)}
                    errors={errors}
                    onFocus={() => setIsFocus(true)}
                />
                <InputField
                    label=""
                    name="price"
                    placeholder="Harga variant"
                    value={variant.price}
                    onChange={(event) => changeHandler(variant._id, event)}
                    errors={errors}
                    onFocus={() => setIsFocus(true)}
                />
            </div>
            <div
                className="text-right my-2 text-sm"
                style={{ display: isFocus ? "block" : "none" }}
            >
                <button
                    className="btn btn-transparent mx-2.5"
                    onClick={() => deleteVariant(variant._id)}
                >
                    HAPUS
                </button>
                <button className="btn btn-red" onClick={saveVariant}>
                    SIMPAN
                </button>
            </div>
        </section>
    );
}
