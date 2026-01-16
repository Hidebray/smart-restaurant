"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

function VerifyEmailForm() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const router = useRouter();

    const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (!token) {
            setStatus('error');
            setMessage('Invalid verification link. Token is missing.');
            return;
        }

        const verify = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'}/auth/verify-email`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ token }),
                });

                const data = await res.json();

                if (res.ok) {
                    setStatus('success');
                    setTimeout(() => {
                        router.push('/login');
                    }, 3000);
                } else {
                    setStatus('error');
                    setMessage(data.message || 'Verification failed');
                }
            } catch (err: any) {
                setStatus('error');
                setMessage(err.message || 'An error occurred');
            }
        };

        verify();
    }, [token, router]);

    return (
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 text-center">

            {status === 'verifying' && (
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Verifying Email...</h2>
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto"></div>
                </div>
            )}

            {status === 'success' && (
                <div>
                    <span className="text-5xl">✅</span>
                    <h2 className="text-2xl font-bold text-green-600 mt-4 mb-2">Verified!</h2>
                    <p className="text-gray-600">Your email has been successfully verified.</p>
                    <p className="text-sm text-gray-500 mt-4">Redirecting to login...</p>
                    <Link href="/login" className="block mt-6 text-blue-600 hover:text-blue-500 font-medium">
                        Go to Login manually
                    </Link>
                </div>
            )}

            {status === 'error' && (
                <div>
                    <span className="text-5xl">❌</span>
                    <h2 className="text-2xl font-bold text-red-600 mt-4 mb-2">Verification Failed</h2>
                    <p className="text-gray-600">{message}</p>
                    <Link href="/login" className="block mt-6 text-blue-600 hover:text-blue-500 font-medium">
                        Back to Login
                    </Link>
                </div>
            )}

        </div>
    );
}

export default function VerifyEmailPage() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <Suspense fallback={<div>Loading...</div>}>
                    <VerifyEmailForm />
                </Suspense>
            </div>
        </div>
    );
}
