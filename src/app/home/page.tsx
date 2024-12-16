"use client";
import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { usePageTitle } from '../hooks/usePageTitle';
import Header from '../components/Header';
import { Blog } from '../types/blog';
import { getAllBlogs } from '../utils/blogDatabase';
import BlogCard from '../components/BlogCard';
import SkeletonCard from '../components/SkeletonCard';

const Page = () => {
    usePageTitle("Medium: Home")
    const [blogs, setBlogs] = useState<Blog[] | null>(null)
    const [loading, setLoading] = useState<boolean>(true)

    useEffect(() => {
        getBlogs()
    }, [])

    const getBlogs = async () => {
        try {
            setLoading(true)
            const { blog: allBlogs } = await getAllBlogs()
            if (!allBlogs) return
            // Sort blogs by created_at in descending order (newest first)
            const sortedBlogs = allBlogs.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
            setBlogs(sortedBlogs)
        } catch (error) {
            console.log(error);
            toast.error("Erroe fetching blogs")
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return <SkeletonCard />
    }

    return (
        <div className="w-full bg-white h-screen">
            <Header />
            <div className="mt-4 p-5">
                <h2 className="text-2xl text-center font-bold">Recent Blogs</h2>
                {blogs && blogs.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                        {blogs.map((blog) => (
                            <BlogCard key={blog.id} {...blog} />
                        ))}
                    </div>
                ) : (
                    <p>No blogs found.</p>
                )}
            </div>
            <Toaster />
        </div>
    );
};

export default Page;
