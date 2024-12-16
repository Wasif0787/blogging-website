"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useUserStore from '../hooks/useUserStore';
import { usePageTitle } from '../hooks/usePageTitle';
import Header from '../../components/Header';
import UserTable from '../../components/UserTable';
import { User } from '../types/user';
import { getAllUsers } from "../utils/userDatabase";
import toast, { Toaster } from 'react-hot-toast';
import SkeletonCard from '../../components/SkeletonCard';

const Page = () => {
    usePageTitle("Medium: Manage Access");
    const { user, loading } = useUserStore();
    const [isValid, setIsValid] = useState(false);
    const [users, setUsers] = useState<User[] | null>(null);
    const [fetchingUsers, setFetchingUsers] = useState(true);
    const [selectedType, setSelectedType] = useState("author");
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            if (user?.type !== "admin") {
                router.push("/home");
            } else {
                setIsValid(true);
            }
        }
    }, [user, loading]);

    const fetchUsers = async () => {
        try {
            setFetchingUsers(true);
            const { users: fetchedUsers, error } = await getAllUsers();
            if (error) {
                toast.error("Error occurred fetching users");
            } else {
                const filteredUsers = fetchedUsers ? fetchedUsers.filter(user => user.type === selectedType) : [];
                setUsers(filteredUsers);
            }
        } catch (error) {
            console.error(error);
            toast.error("Error occurred fetching users");
        } finally {
            setFetchingUsers(false);
        }
    };

    const handleUserTypeChange = (type: string) => {
        setSelectedType(type);
    };

    useEffect(() => {
        if (isValid) {
            fetchUsers();
        }
    }, [isValid, selectedType]);


    if (loading || fetchingUsers || !isValid) {
        return (
            <SkeletonCard />
        );
    }

    return (
        <div className='h-screen'>
            <Header />
            <div className="text-center mt-3 mb-4">
                <button onClick={() => handleUserTypeChange("author")} className={`px-4 py-2 mx-2 ${selectedType === "author" ? "bg-blue-600 text-white" : "bg-gray-300"}`}>
                    View All Authors
                </button>
                <button onClick={() => handleUserTypeChange("reader")} className={`px-4 py-2 mx-2 ${selectedType === "reader" ? "bg-blue-600 text-white" : "bg-gray-300"}`}>
                    View All Readers
                </button>
            </div>
            <UserTable users={users} onUpdate={fetchUsers} canEditStatus={selectedType === "author"} />
            <Toaster />
        </div>
    );
};

export default Page;
