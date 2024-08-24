import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
    name: { type: String },
    method: {
        type: String,
        enum: ['transfer_bank', 'e-wallet'],
        default: 'transfer_bank',
    },
    accountNumber: { type: String },
    accountName: { type: String },
    createdAt: { type: Date, default: new Date() },
});

export default mongoose.models.payments || mongoose.model("payments", paymentSchema);
