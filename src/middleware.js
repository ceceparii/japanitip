import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env

async function verifyToken(token, secretKey) {
    try {
        const { payload } = await jwtVerify(
            token,
            new TextEncoder().encode(secretKey)
        );
        return payload;
    } catch (error) {
        console.error('verify failed', error);
        return null;
    }
}

export async function middleware(req, res) {
    const url = req.nextUrl;
    const response = NextResponse.next();
    const allowedOrigin = [
        process.env.BASE_URL,
        'https://app.sandbox.midtrans.com'
    ]

    let autHeader = req.headers.get('authorization');
    let authToken = autHeader?.split(' ')[1];
    let refreshToken = req.cookies.get('auth')
    
    // validate origin
    if (allowedOrigin.includes(url.origin)) {
        return NextResponse.json(
            { status: 404 },
            { message: `${url.origin} is not allowed` }
        );
    }

    // validate token
    if(refreshToken === null || !refreshToken ){
        return NextResponse.redirect(new URL('/login', process.env.BASE_URL))
    }
    
    try {
        if (authToken) {
            authToken = await verifyToken(authToken, ACCESS_TOKEN_SECRET);
            response.headers.set('id', authToken._userID);
            response.headers.set('role', authToken.role);
            
            return response;
        }

        if(url.pathname.startsWith('/admin')) {
            refreshToken = await verifyToken(refreshToken.value, REFRESH_TOKEN_SECRET);
            
            if(refreshToken) {
                if(refreshToken.role !== 'admin') {
                    return res.sendStatus(404)
                }
                
                response.headers.set('id', refreshToken._userID);
                response.headers.set('role', refreshToken.role);
                
                return response;
            }
        }
        
        if(url.pathname.startsWith('/v1/user')) {
            refreshToken = await verifyToken(refreshToken.value, REFRESH_TOKEN_SECRET);
            
            if(refreshToken) {
                response.headers.set('id', refreshToken._userID);
                response.headers.set('role', refreshToken.role);
                
                return response;
            }
        }
        
        return NextResponse.redirect(new URL('/login', process.env.BASE_URL))
    } catch (error) {
        console.error('middleware', error);
        return NextResponse.json(
            { status: 500 },
            { message: 'Middleware internal server error' }
        );
    }
}

export const config = {
    matcher: [
        '/api/user/:path*',
        '/api/admin/:path*',
        '/v1/user/:path*',
        '/admin',
        '/admin/:path*'
    ],
};
