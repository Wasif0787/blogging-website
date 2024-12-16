"use client"
import React, { useEffect, useState } from 'react'
import useUserStore from '../hooks/useUserStore'
import { useRouter } from 'next/navigation'
import { usePageTitle } from '../hooks/usePageTitle'
import Header from '../components/Header'
import { Blog } from '../types/blog'
import { getUserBlogs } from '../utils/blogDatabase'
import toast from 'react-hot-toast'
import SkeletonCard from '../components/SkeletonCard'
import BlogCard from '../components/BlogCard'

const Page = () => {
    usePageTitle("Medium: My Blogs")
    const { user, loading } = useUserStore()
    const router = useRouter()
    const [isValid, setIsValid] = useState(false)
    const [blogs, setBlogs] = useState<Blog[] | null>(null)
    const [loadingBlogs, setLoadingBlogs] = useState(true)
    const [selectedType, setSelectedType] = useState("published");
    const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>([]);


    const getBlogs = async (id: string) => {
        try {
            setLoadingBlogs(true)
            const { blog, error } = await getUserBlogs(id);
            if (error) {
                toast.error(error);
                setBlogs(null);
                return;
            }
            setBlogs(blog);
        } catch (error) {
            console.log(error);
            toast.error("Failed to fetch blogs");
        } finally {
            setLoadingBlogs(false)
        }
    }

    useEffect(() => {
        if (!loading) {
            if (!user) {
                // If the user is not authenticated, redirect to login
                router.push("/home")
            } else if (user.type === "reader") {
                // If the user is a "reader", redirect to home
                router.push("/home")
            } else {
                // Otherwise, mark the user as valid
                setIsValid(true);
                getBlogs(user.id)
            }
        }
    }, [user, loading, router]);

    useEffect(() => {
        if (blogs) {
            setFilteredBlogs(blogs.filter(blog => blog.state === selectedType));
        }
    }, [blogs, selectedType]);

    const handleUserTypeChange = (type: string) => {
        setSelectedType(type);
    };

    if (loading || loadingBlogs) {
        return <SkeletonCard />
    }

    if (!isValid) {
        return <div>Checking auth...</div>
    }


    return (
        <div className='flex flex-col justify-center items-center'>
            <Header />
            <div className="mt-4 p-5">
                <div className="text-center mt-3 mb-4">
                    <button onClick={() => handleUserTypeChange("published")} className={`px-4 py-2 mx-2 ${selectedType === "published" ? "bg-blue-600 text-white" : "bg-gray-300"}`}>
                        View Published
                    </button>
                    <button onClick={() => handleUserTypeChange("draft")} className={`px-4 py-2 mx-2 ${selectedType === "draft" ? "bg-blue-600 text-white" : "bg-gray-300"}`}>
                        View Drafts
                    </button>
                </div>
                {filteredBlogs && filteredBlogs.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                        {filteredBlogs.map((blog) => (
                            <BlogCard key={blog.id} {...blog} />
                        ))}
                    </div>
                ) : (
                    <p className='text-center'>No blogs found.</p>
                )}
            </div>
        </div>
    )
}

export default Page