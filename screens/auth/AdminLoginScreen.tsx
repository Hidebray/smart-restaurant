
import React, { useState } from 'react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import { LogIn, ShieldCheck } from 'lucide-react';
// In a real Next.js app, you would use this for navigation
// import { useRouter } from 'next/navigation';

const AdminLoginScreen: React.FC = () => {
    // const router = useRouter(); // For Next.js navigation
    const [email, setEmail] = useState('admin@gmail.com');
    const [password, setPassword] = useState('123');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                // Login successful, cookie is set by the server.
                // In a real Next.js app, you would navigate to the dashboard.
                // router.push('/admin'); 
                // For demonstration, we can use a simple redirect.
                window.location.href = '/admin'; 
            } else {
                const data = await response.json();
                setError(data.message || 'Login failed. Please check your credentials.');
            }
        } catch (err) {
            setError('An error occurred. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
            <Card className="w-full max-w-sm p-8">
                <div className="text-center">
                     <ShieldCheck className="mx-auto h-12 w-12 text-brand-primary" />
                    <h2 className="mt-4 text-2xl font-bold text-brand-dark">Admin Login</h2>
                    <p className="text-gray-500 mt-2">Access the restaurant management dashboard.</p>
                </div>
                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium">Email</label>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@gmail.com"
                            required
                            autoComplete="email"
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="password" className="text-sm font-medium">Password</label>
                        <Input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            autoComplete="current-password"
                        />
                    </div>
                    {error && <p className="text-sm text-red-500">{error}</p>}
                    <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                        {isLoading ? 'Signing in...' : (
                            <>
                                <LogIn className="mr-2 h-4 w-4" />
                                Sign In
                            </>
                        )}
                    </Button>
                </form>
            </Card>
        </div>
    );
};

export default AdminLoginScreen;
