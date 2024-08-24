import connectToDatabase from "@/libs/mongodb";
import productSchema from "@/models/productSchema";

export default async function (req, res) {
    try {
        await connectToDatabase();
        // get products
        if (req.method === "GET") {
            const products = await productSchema.find();
            return res.status(200).json({ message: "", products });
        }

        // create productc
        if (req.method === "POST") {
            const product = new productSchema(req.body);

            await product.save();

            return res
                .status(201)
                .json({ message: "Produk berhasil ditambahkan" });
        }

        return res.status(400).json({ message: "Method not allowed" });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
}
