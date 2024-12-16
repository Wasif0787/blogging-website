"use client"
import React from 'react';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import { useRouter } from 'next/navigation';
import SearchIcon from '@mui/icons-material/Search';
import SearchBox from './SearchBox';
import useUserStore from '../app/hooks/useUserStore';
import { Skeleton } from '@/components/ui/skeleton';
import PopAvatar from './PopAvatar';

const Header = () => {
    const { user, loading } = useUserStore();
    const router = useRouter();

    if (loading) {
        return <Skeleton />;
    }

    return (
        <header className='w-full flex items-center justify-between p-4 border-b border-slate-300 bg-white'>
            {/* Logo and SearchBox Section */}
            <div className='flex items-center gap-6 flex-grow'>
                <h1
                    onClick={() => router.push("/home")}
                    className='text-2xl md:text-3xl font-serif font-bold cursor-pointer transition-colors duration-200 hover:text-slate-700'
                >
                    Medium
                </h1>
                <div className='hidden md:flex flex-grow max-w-lg'>
                    <SearchBox />
                </div>
            </div>

            {/* Action Buttons and Avatar */}
            {user && (
                <div className='flex items-center gap-4 md:gap-6'>
                    {/* Mobile Search Icon */}
                    <div
                        onClick={() => router.push("/search")}
                        className='md:hidden p-1 cursor-pointer text-slate-600 transition-colors duration-200 hover:text-slate-800'
                    >
                        <SearchIcon fontSize="medium" />
                    </div>

                    {/* Write Button */}
                    <div
                        onClick={() => router.push("/write")}
                        className='flex items-center gap-2 p-1 cursor-pointer text-slate-600 transition-all duration-200 hover:text-slate-800'
                    >
                        <DriveFileRenameOutlineIcon fontSize='small' />
                        <span className='hidden md:inline text-sm font-medium'>Write</span>
                    </div>

                    {/* Profile Avatar */}
                    <div
                        className='rounded-full overflow-hidden cursor-pointer transition-transform duration-200 hover:scale-105'
                    >
                        <PopAvatar url={user.profile_pic || "https://picsum.photos/200"} />
                    </div>
                </div>
            )}
            {!user && (
                <div className='flex justify-center items-center'>
                    <button onClick={() => router.push("/sign-in")} className="bg-blue-400 text-white font-bold py-2 px-4 rounded-lg">Sign-in</button>
                </div>
            )}
        </header>
    );
};

export default Header;
