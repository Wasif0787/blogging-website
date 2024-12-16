"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signUp } from '../utils/auth';
import useAuth from '../hooks/useAuth';
import toast, { Toaster } from 'react-hot-toast';
import { insertUser } from '../utils/userDatabase';
import { usePageTitle } from '../hooks/usePageTitle';
import useUserStore from '../hooks/useUserStore';
import SkeletonCard from '../components/SkeletonCard';

const SignUpPage = () => {
    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const { session } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(true);
    const [signupLoading, setSignupLoading] = useState<boolean>(false);
    const setUser = useUserStore((state) => state.setUser);

    usePageTitle("Medium: Signup")

    useEffect(() => {
        setLoading(true);
        if (session) {
            router.push('/home');
        }
        setLoading(false);
    }, [session?.user?.id]);

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setSignupLoading(true);

        try {
            const { user: signUpData, error: signUpError } = await signUp(email, password);
            if (signUpError) {
                toast.error(signUpError);
                return;
            }

            const user = signUpData;
            if (!user) {
                toast.error('Error occurred while retrieving user data');
                return;
            }
            const { user: UserDetails, error: getUserError } = await insertUser(name, email, user.id);
            if (getUserError || !UserDetails) {
                toast.error('Error occurred while inserting user data');
                return;
            }

            setUser(UserDetails)
            toast.success('Sign up successful! Redirecting...')
            router.push('/home');
        } catch (error) {
            console.error(error);
            toast.error('An unexpected error occurred. Please try again.');
        } finally {
            setSignupLoading(false);
        }
    };

    if (loading) {
        return <SkeletonCard />
    }

    return (
        <div className='flex flex-col justify-center items-center min-h-screen '>
            <div className='flex flex-col justify-center items-center shadow-xl rounded-3xl w-full max-w-xs sm:max-w-md md:max-w-lg  p-4 bg-white'>
                <h1 className='font-serif text-3xl mb-6'>Join Medium.</h1>
                <div className='w-full'>
                    <form onSubmit={handleSignUp}>
                        <input
                            placeholder='Name'
                            type="text"
                            className='bg-gray-50 p-3 text-black w-full rounded-2xl border border-slate-400 mb-4'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <input
                            placeholder='Email'
                            type="email"
                            className='bg-gray-50 p-3 text-black w-full rounded-2xl border border-slate-400 mb-4'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input
                            placeholder='Password'
                            type="password"
                            className='bg-gray-50 p-3 text-black w-full rounded-2xl border border-slate-400 mb-4'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button type="submit" className='bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-2xl w-full'>
                            {signupLoading ? 'Signing Up...' : 'Sign Up'}
                        </button>
                    </form>
                    <p className='mt-4 text-center'>Already have an account? <span onClick={() => router.push("/sign-in")} className='text-green-700 font-bold cursor-pointer'>Sign-in</span></p>
                </div>
            </div>
            <Toaster />
        </div>
    );
};

export default SignUpPage;
