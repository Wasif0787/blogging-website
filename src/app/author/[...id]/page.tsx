"use client";
import Header from '@/app/components/Header';
import SkeletonCard from '@/app/components/SkeletonCard';
import { User } from '@/app/types/user';
import { getUser } from '@/app/utils/userDatabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Typography } from '@mui/material';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';


const Page = () => {
    const { id } = useParams();
    const [author, setAuthor] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const getAuthor = async (id: string) => {
        try {
            const { user } = await getUser({ id });
            if (user) {
                console.log(user);
                setAuthor(user);
            }
        } catch (error) {
            toast.error('Error fetching author data');
            console.error('Error fetching author data:', error);
            setAuthor(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            const authorId = Array.isArray(id) ? id[0] : id;
            getAuthor(authorId);
        }
    }, [id]);

    if (loading) {
        return <SkeletonCard />
    }

    if (!author) {
        return <div className="text-center mt-4 text-gray-600">Author not found.</div>
    }


    return (
        <div className="h-screen">
            <Header />
            <Card className="max-w-md mt-4 mx-auto bg-white shadow-lg rounded-lg">
                <CardHeader>
                    <Typography variant="h2" className="text-2xl font-bold text-center">{author.name}</Typography>
                </CardHeader>
                <CardContent>
                    <Typography className="mt-2 text-gray-700">{author.bio}</Typography>
                    <div className="mt-4">
                        <Typography className="text-gray-600"><strong>Email:</strong> {author.email}</Typography>
                        <Typography className="text-gray-600"><strong>Status:</strong> {author.status}</Typography>
                        <Typography className="text-gray-600"><strong>Role:</strong> {author.type}</Typography>
                    </div>
                    <Button className="mt-4 w-full bg-blue-600 text-white hover:bg-blue-700">Contact Author</Button>
                </CardContent>
            </Card>
            <Toaster />
        </div>
    );
};

export default Page;
