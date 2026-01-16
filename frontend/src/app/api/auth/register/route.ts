import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

        const res = await fetch(`${backendUrl}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });

        const data = await res.json();

        if (!res.ok) {
            return NextResponse.json(
                { message: data.message || 'Registration failed' },
                { status: res.status }
            );
        }

        return NextResponse.json(data, { status: 201 });

    } catch (error) {
        console.error('Register Route Error:', error);
        return NextResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
