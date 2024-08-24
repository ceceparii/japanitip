import connectToDatabase from '@/libs/mongodb';
import userSchema from '@/models/userSchema';
import User from '@/models/userSchema';
import bcrypt from 'bcryptjs';
import cookie from 'cookie';
import { SignJWT } from 'jose';

export async function createToken(payload, expiresIn, secretKey) {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime(expiresIn)
        .sign(new TextEncoder().encode(secretKey));
}

export default async function (req, res) {
    await connectToDatabase();
    const { phone, password } = req.body;
    const { REFRESH_TOKEN_SECRET, ACCESS_TOKEN_SECRET } = process.env;

    try {
        if(req.method !== 'POST') {
            return res.status(403).json({ message: 'Method not allowed' })
        }
        
        const user = await User.findOne({ phone });
        if (!user) {
            return res.status(400).json({ message: 'Nomor handphone tidak valid' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Password salah' });
        }

        const payload = { _userID: user._id, role: user.role };

        const refreshToken = await createToken(payload, '30d', REFRESH_TOKEN_SECRET);
        const accessToken = await createToken(payload, '30d', ACCESS_TOKEN_SECRET);

        await userSchema.updateOne({ phone }, { refreshToken });

        res.setHeader('Set-Cookie', cookie.serialize('auth', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 1000 * 60 * 60 * 24 * 30,
            path: '/',
        }));

        return res.status(200).json({
            accessToken,
            role: user.role,
            message: 'Login berhasil',
        });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: 'Interal server error' });
    }
}
