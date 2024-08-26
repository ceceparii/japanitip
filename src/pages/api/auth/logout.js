import connectToDatabase from "@/libs/mongodb"
import User from "@/models/userSchema"
import cookie from "cookie"

export default async function userLogout(req, res) {
    try {
        if (req.method === 'DELETE') {
            const refreshToken = req.cookies.auth
            await connectToDatabase()
            await User.updateOne({ refreshToken }, { $set: { refreshToken: null }})
            
            res.setHeader("Set-Cookie", cookie.serialize("auth", null, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                path: "/"
            }))
            return res.status(200).json({ message: 'Berhasil logout' })
        }

        return res.status(403).json({ message: 'Method not allowed' })
    } catch (error) {
        console.error(error.message)
        return res.status(500).json({ message: 'Logout internal server error' })
    }
}