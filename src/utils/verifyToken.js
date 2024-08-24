import { jwtVerify } from "jose";

export async function verifyToken(token, secretKey) {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secretKey))

    return payload
}