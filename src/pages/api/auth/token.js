// /api/auth/token.js

import connectToDatabase from "@/libs/mongodb";
import User from "@/models/userSchema";
import { NextResponse } from "next/server";
import { createToken } from "./login";

export default async function accessToken(req, res) {
    try {
        let refreshToken = req.cookies.auth
        if(!refreshToken) {
            return NextResponse.redirect(url.origin + '/login')
        } 
        await connectToDatabase()
        const user = await User.findOne({ refreshToken })
        
        if(!user) {
            return NextResponse.redirect(url.origin + '/login')
        }

        const payload = { _userID: user._id, role: user.role}
        const accessToken = await createToken(payload, '30d', process.env.ACCESS_TOKEN_SECRET)

        return res.status(200).json({ accessToken })
    } catch (error) {
        console.error('Auth token :', error.message)
        return res.status(500).json({ message: 'Auth token internal server error' })
    }
}