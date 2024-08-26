import connectToDatabase from "@/libs/mongodb"
import User from "@/models/userSchema"
import { NextResponse } from "next/server"

export default async function userData(req, res) {
    const _userID = req.headers['id']

    if(!_userID) return NextResponse.redirect(new URL('/login', req.url))

    try {
        await connectToDatabase()
        if (req.method === 'GET') {
            const user = await User.findOne({ _id: _userID }).select(['phone', 'username'])

            return res.status(200).json({ result: user })
        }

        return res.status(403).json({ message: 'Method not allowed' })
    } catch (error) {
        console.error('user data :', error.message)
        return res.status(500).json({ message: 'User data internal server error' })
    }
}