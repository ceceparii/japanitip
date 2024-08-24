import connectToDatabase from '@/libs/mongodb';
import paymentSchema from '@/models/paymentSchema';

export default async function payment(req, res) {
    await connectToDatabase();
    try {
        if (req.method === 'GET') {
            const payments = await paymentSchema.find({})
            return res.status(200).json({ message: '', result: payments })
        }
        if (req.method === 'POST') {
            const isExists = await paymentSchema.findOne({
                accountNumber: req.body.accountNumber,
            });
            if (isExists) {
                return res.status(400).json({
                    message: `Nomor telah terdaftar, gunakan akun bank/e-wallet lain`,
                });
            }

            const payment = new paymentSchema(req.body)
            await payment.save()

            return res.status(201).json({ message: 'Berhasil menambahkan metode pembayaran baru' })
        }
        return res.status(400).json({ message: 'Method not allowed' });
    } catch (error) {
        console.error(error.message)
        return res.status(500).json({ message: error.message })
    }
}
