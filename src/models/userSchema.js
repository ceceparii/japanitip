import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const cartSchema = new mongoose.Schema({
    _variantID: { type: String },
    _productID: { type: String },
    quantity: { type: Number, min: 1 },
});

export const addressSchema = new mongoose.Schema({
    street: { type: String },
    kelurahan: { type: String },
    kecamatan: { type: String },
    kabupaten: { type: String },
    provinsi: { type: String },
}, { _id: false });

const orderSchema = new mongoose.Schema({
    _oderID: mongoose.Schema.Types.ObjectId,
    totalAmount: { type: Number, min: 1 },
    cart: [cartSchema],
    payment: { type: String },
    status: {
        type: String,
        enum: [
            "menunggu_pembayaran",
            "diproses",
            "dikirim",
            "dibatalkan",
            "selesai",
        ],
        default: "menunggu_pembayaran",
    },
    _userID: { type: String },
    username: { type: String },
    phone: { type: String },
    address: addressSchema,
    createdAt: { type: Date, default: new Date() },
});

const userSchema = new mongoose.Schema({
    username: { type: String, require: true },
    phone: { type: String, require: true },
    password: { type: String, require: true },
    role: { type: String, enum: ["admin", "customer"], default: "customer" },
    address: addressSchema,
    cart: [cartSchema],
    orders: [orderSchema],
    refreshToken: { type: String },
    createdAt: { type: Date, default: new Date() },
});

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

const User = mongoose.models.users || mongoose.model("users", userSchema);
export default User 
