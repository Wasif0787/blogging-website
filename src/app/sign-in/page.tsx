"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from '../utils/auth';
import toast, { Toaster } from 'react-hot-toast';
import { usePageTitle } from '../hooks/usePageTitle';
import { getUser } from '../utils/userDatabase';
import useUserStore from '../hooks/useUserStore';
import SkeletonCard from '../../components/SkeletonCard';

const LoginPage = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const { user, loading, setUser } = useUserStore();
    const router = useRouter();
    const [signinLoading, setSigninLoading] = useState<boolean>(false);
    usePageTitle("Medium: Sign-in");

    useEffect(() => {
        if (!loading && user) {
            router.push('/home');
        }
    }, [user, loading, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSigninLoading(true);

        try {
            const { user, error } = await signIn(email, password);
            if (error || !user) {
                toast.error(error ? "Invalid email or password" : "Error occurred while retrieving user data");
                return;
            }

            const { user: userData, error: getUserError } = await getUser({ auth_id: user.id });
            if (getUserError || !userData) {
                toast.error('Error occurred while fetching user data');
                return;
            }

            setUser(userData);
            router.push('/home');
        } catch (error) {
            console.error(error);
            toast.error('An unexpected error occurred. Please try again.');
        } finally {
            setSigninLoading(false);
        }
    };

    if (loading) {
        return <SkeletonCard />;
    }

    return (
        <div className="flex flex-col justify-center items-center min-h-screen">
            <div className="flex flex-col justify-center items-center shadow-xl rounded-3xl w-full max-w-xs sm:max-w-md md:max-w-lg p-4 bg-white">
                <h1 className="font-serif text-3xl mb-6">Welcome back.</h1>
                <div className="w-full">
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="email" className="sr-only">Email</label>
                        <input
                            id="email"
                            placeholder="Email"
                            type="email"
                            className="bg-gray-50 p-3 text-black w-full rounded-2xl border border-slate-400 mb-4"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <label htmlFor="password" className="sr-only">Password</label>
                        <input
                            id="password"
                            placeholder="Password"
                            type="password"
                            className="bg-gray-50 p-3 text-black w-full rounded-2xl border border-slate-400 mb-4"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-2xl w-full">
                            {signinLoading ? 'Signing In...' : 'Sign In'}
                        </button>
                    </form>
                    <p className="mt-4 text-center">
                        No account?{' '}
                        <span onClick={() => router.push("/sign-up")} className="text-green-700 font-bold cursor-pointer">
                            Create one
                        </span>
                    </p>
                </div>
            </div>
            <Toaster />
        </div>
    );
};

export default LoginPage;
