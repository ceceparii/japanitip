import { NextResponse } from 'next/server';
import { verifyToken } from './utils/verifyToken';

const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env;

export async function middleware(req) {
    const url = req.nextUrl;
    const response = NextResponse.next();
    const autHeader = req.headers.get('authorization');
    const authToken = autHeader?.split(' ')[1];
    const refreshToken = req.cookies.get('auth');

    // validate origin
    if (url.origin !== process.env.BASE_URL) {
        return NextResponse.redirect(new URL('/404', req.url))
    }
    // validate token
    if (!refreshToken || refreshToken.value === 'null') {
        return NextResponse.redirect(new URL('/login', req.url));
    }

    try {
        if (authToken) {
            const payload = await verifyToken(authToken, ACCESS_TOKEN_SECRET);
            response.headers.set('id', payload._userID);
            response.headers.set('role', payload.role);

            return response;
        }

        const payload = await verifyToken(refreshToken.value, REFRESH_TOKEN_SECRET );

        if (!payload) {
            return NextResponse.redirect(new URL('/login', req.url));
        }

        if (url.pathname.startsWith('/admin')) {
            if (payload.role !== 'admin') {
                return NextResponse.redirect(new URL('/404', req.url));
            }
        }

        response.headers.set('id', payload._userID);
        response.headers.set('role', payload.role);

        return response;
    } catch (error) {
        console.error('middleware', error);
        return NextResponse.json(
            { status: 500 },
            { message: 'Middleware internal server error' }
        );
    }
}

export const config = {
    matcher: ['/v1/user/:path*', '/admin/:path*', '/api/user/:path*', '/api/admin/:path*'],
};
