
import { NextResponse } from 'next/server';
import { signJWT } from '../../../lib/auth';
import { UserRole } from '../../../types';

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();

        // MOCK AUTHENTICATION LOGIC
        // In a real app, you would validate against a database.
        // Also, passwords should be hashed using bcrypt or argon2.
        if (email === 'admin@gmail.com' && password === '123') {
            const payload = { role: UserRole.ADMIN };
            const token = await signJWT(payload, { exp: '24h' });

            const response = NextResponse.json(
                { success: true, message: "Login successful" },
                { status: 200 }
            );

            // Set the token in an HttpOnly cookie
            response.cookies.set('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 60 * 60 * 24, // 1 day
                path: '/',
            });

            return response;
        }

        return NextResponse.json({ success: false, message: 'Invalid email or password' }, { status: 401 });

    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json({ success: false, message: 'An internal server error occurred.' }, { status: 500 });
    }
}
