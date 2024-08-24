// api/user/settings.js
import connectToDatabase from "@/libs/mongodb"
import userSchema from "@/models/userSchema"

const initialAddress = {
    street: '',
    kelurahan: '',
    kecamatan: '',
    kabupaten: '',
    provinsi: ''
}

export default async function userSetings(req, res) {
    const _userID = req.headers['id']
    await connectToDatabase()

    try {
        if (req.method === 'GET') {
            let user = await userSchema.findOne({ _id: _userID }).select(['address', 'username', 'phone'])
 
            if (!user.address) {
                user.address = initialAddress
            }

            return res.status(200).json({ message: '', result: user })
        }

        if (req.method === 'PUT') {
            await userSchema.updateOne({ _id: _userID }, {
                $set: req.body
            })

            return res.status(200).json({ message: 'Berhasil diperbaharui' })
        }
        return res.status(403).json({ message: 'Method not allowed' })
    } catch (error) {
        console.error('user settings, ', error.message)
        return res.status(500).json({ message: 'Internal server error' })
    }
}