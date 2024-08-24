import connectToDatabase from "@/libs/mongodb";
import productSchema from "@/models/productSchema";

export default async function (req, res) {
    const { id } = req.query;
    await connectToDatabase();
    try {
        if (req.method === "GET") {
            const product = await productSchema.findOne({ _id: id });
            return res.status(200).json({ message: "", product });
        }

        if (req.method === "PUT") {
            const product = await productSchema.updateOne(
                { _id: id },
                req.body
            );

            if (product.modifiedCount > 0) {
                return res
                    .status(200)
                    .json({ message: "Produk berhasil diperbaharui" });
            }

            return res
                .status(200)
                .json({ message: "Tidak ada perubahan data" });
        }

        return res.status(400).json({ message: "Method not allowed" });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: "Internal server errors" });
    }
}
