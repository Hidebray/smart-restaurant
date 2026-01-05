
import React from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { ShieldAlert } from 'lucide-react';

const ForbiddenScreen: React.FC = () => {
    const handleGoHome = () => {
        // In a real app, this would use a router link or router.push('/')
        window.location.href = '/';
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
            <Card className="w-full max-w-md p-8 text-center">
                <ShieldAlert className="mx-auto h-16 w-16 text-red-500" />
                <h1 className="mt-6 text-3xl font-bold text-brand-dark">Access Denied</h1>
                <p className="mt-4 text-gray-600">
                    You do not have the necessary permissions to view this page. Please contact an administrator if you believe this is an error.
                </p>
                <Button onClick={handleGoHome} className="mt-8" size="lg">
                    Return to Homepage
                </Button>
            </Card>
        </div>
    );
};

export default ForbiddenScreen;
