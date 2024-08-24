import mongoose from "mongoose";

const variantSchema = new mongoose.Schema({
    name: { type: String },
    price: { type: Number, min: 1 },
    inStock: { type: Boolean, default: true },
});

const productSchema = new mongoose.Schema({
    name: { type: String, require: true },
    brand: { type: String },
    category: { type: String, enum: ["other"], default: "other" },
    description: { type: String },
    variants: [variantSchema],
    images: [{ type: String }],
    inStock: { type: Boolean, default: true },
    createAt: { type: Date, default: new Date() },
});

const Product = mongoose.models.products || mongoose.model("products", productSchema);
export default Product