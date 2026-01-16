import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Call NestJS Backend
    // Assuming Backend is running on port 5000 locally
    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

    const res = await fetch(`${backendUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      return NextResponse.json(
        { message: errorData.message || 'Login failed' },
        { status: res.status }
      );
    }

    const data = await res.json();
    const { accessToken } = data;

    // Set HTTP-only cookie
    const cookieStore = await cookies();
    cookieStore.set('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/',
    });

    return NextResponse.json({
      success: true,
      role: data.user.role || 'user',
      accessToken
    });
  } catch (error) {
    console.error('Login Route Error:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}