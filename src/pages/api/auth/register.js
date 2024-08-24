import connectToDatabase from "@/libs/mongodb"
import User from "@/models/userSchema"

export default async function userRegister(req, res) {
    await connectToDatabase()
    try {
        const {phone} = req.body

        if(req.method === "POST") {
            const isExists = await User.findOne({ phone })

            if(isExists) return res.status(400).json({ message: "Nomor handphone telah terdaftar" })
            
            const createUser = new User(req.body)

            await createUser.save()
            return res.status(201).json('Berhasil mendaftarkan akun')
        }
        
        return res.status(400).json({ message: 'Method not allowed' })
    } catch (error) {
        console.error(error.message)
        return res.status(500).json({ message: 'Internal server error' })
    }
}
