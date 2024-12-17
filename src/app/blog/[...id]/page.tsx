"use client";
export const dynamicParams = true;
import Header from '@/components/Header';
import SkeletonCard from '@/components/SkeletonCard';
import { usePageTitle } from '@/app/hooks/usePageTitle';
import useUserStore from '@/app/hooks/useUserStore';
import { Blog } from '@/app/types/blog'; // Assuming you have a Blog type defined
import { getBlogById } from '@/app/utils/blogDatabase'; // Your function to fetch blog data
import { Button } from '@/components/ui/button';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill-new'), {
    ssr: false, // Disable server-side rendering for this component
});

const Page = () => {
    const { id } = useParams();
    const [blog, setBlog] = useState<Blog | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const { user, loading: userLoading } = useUserStore()
    usePageTitle(`Medium: ${blog?.title}`)

    const getBlogData = async (id: string) => {
        try {
            const { blog: blogData, error } = await getBlogById({ id });
            if (error) {
                console.log(error);
                toast.error(error)
            }
            if (blogData) {
                setBlog(blogData);
            }
        } catch (error) {
            toast.error('Error fetching blog data');
            console.error('Error fetching blog data:', error);
            setBlog(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            const blogId = Array.isArray(id) ? id[0] : id;
            getBlogData(blogId);
        }
    }, [id]);

    if (loading || userLoading) {
        return <SkeletonCard />;
    }

    if (!blog) {
        return <div className="text-center mt-4 text-gray-600">Blog not found.</div>;
    }

    return (
        <div className="h-screen">
            <Header />
            <div className="mt-4 flex justify-center items-center w-full flex-col">
                <h1 className="text-2xl font-bold text-center">{blog.title}<span className='text-gray-300 text-xl px-2'>({blog.state})</span></h1>
                <h2 className="text-lg text-center text-gray-600">{blog.sub_title}</h2>
                <div className='flex justify-center items-center max-w-lg w-full'>
                    {blog.cover_image && (
                        <img src={blog.cover_image} alt={blog.title} className="mb-4 rounded-md" />
                    )}
                </div>
                {user?.id === blog.author_id && (
                    <Link href={`/write?id=${blog.id}&userId=${user.id}`}><Button>Edit</Button></Link>
                )}
                <ReactQuill
                    className='hidden-toolbar w-full px-10'
                    value={blog.content}
                    readOnly={true}
                    theme='snow'
                    modules={{
                        toolbar: false // Disable the toolbar
                    }}
                />
            </div>
            <Toaster />
        </div>
    );
};

export default Page;
