"use client"
import React from 'react';
import { ListItemIcon, ListItemText, MenuItem } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import ArticleIcon from '@mui/icons-material/Article';
import LogoutIcon from '@mui/icons-material/Logout';
import { useRouter } from 'next/navigation';
import { signOut } from '../app/utils/auth';
import toast, { Toaster } from 'react-hot-toast';
import useUserStore from '../app/hooks/useUserStore';

const ProfileOptions = () => {
    const router = useRouter()
    const { user, loading, setUser } = useUserStore()

    const handleSignOut = async () => {
        try {
            const { error } = await signOut();
            if (error) {
                console.error("Sign out error:", error);
                toast.error("Error occurred during sign out");
                return;
            }
            setUser(null);
            toast.success("Successfully signed out");
        } catch (error) {
            console.error("Error during sign out:", error);
            toast.error("An error occurred while signing out");
        }
    };

    if (loading) {
        return <div>Loading...</div> // Return a loading state while loading user data in Zustand store
    }


    return (
        <div className="p-2">
            <MenuItem onClick={() => router.push("/account")}>
                <ListItemIcon>
                    <AccountCircleIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>{user?.name}</ListItemText>
            </MenuItem>
            {user?.type !== "reader" && (
                <MenuItem onClick={() => router.push("/my-blogs")}>
                    <ListItemIcon>
                        <ArticleIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>My Blogs</ListItemText>
                </MenuItem>
            )}
            {user?.type === "admin" && (
                <MenuItem onClick={() => router.push("/manage-access")}>
                    <ListItemIcon>
                        <ManageAccountsIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Manage Access</ListItemText>
                </MenuItem>
            )
            }

            <MenuItem onClick={handleSignOut}>
                <ListItemIcon>
                    <LogoutIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Sign Out</ListItemText>
            </MenuItem>
            <Toaster />
        </div>
    );
};

export default ProfileOptions;
