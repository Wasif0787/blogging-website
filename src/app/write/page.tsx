"use client";
import React, { useEffect, useState, Suspense } from "react";
import useUserStore from "../hooks/useUserStore";
import { Skeleton } from "@/components/ui/skeleton";
import Header from "../components/Header";
import { useRouter, useSearchParams } from "next/navigation";
import BlogEditor from "../components/BlogEditor";
import { Toaster } from "react-hot-toast";
import { Blog } from "../types/blog";
import { getBlogById } from "../utils/blogDatabase";

const PageContent = () => {
    const { user, loading } = useUserStore();
    const [isValid, setIsValid] = useState<boolean>(false);
    const [canPublish, setCanPublish] = useState<boolean>(false);
    const [paramBlog, setParamBlog] = useState<Blog | null>(null);
    const router = useRouter();
    const searchParams = useSearchParams();

    const blogId = searchParams.get("id");

    const getParamBlog = async (id: string) => {
        try {
            const { blog, error } = await getBlogById({ id });
            if (error) {
                console.error("Failed to fetch blog:", error);
                return;
            }
            setParamBlog(blog);
        } catch (error) {
            console.error("Error fetching blog:", error);
        }
    };

    useEffect(() => {
        if (blogId) {
            const blogIdInString = Array.isArray(blogId) ? blogId[0] : blogId;
            getParamBlog(blogIdInString);
        } else {
            setParamBlog(null);
        }
    }, [blogId]);

    useEffect(() => {
        if (!loading) {
            if (user?.type === "reader") {
                setIsValid(false);
            } else if (user?.status !== "approved") {
                setIsValid(true);
                setCanPublish(false);
            } else {
                setIsValid(true);
                setCanPublish(true);
            }
        }
    }, [user, loading]);

    if (loading) {
        return (
            <div className="flex flex-col items-center mt-10 space-y-4">
                <Skeleton className="w-3/4 h-6" />
                <Skeleton className="w-full h-40" />
            </div>
        );
    }

    if (!loading && !user) {
        router.push("/sign-in");
        return null;
    }

    if (!isValid) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen text-center p-6">
                <h1 className="text-lg font-semibold mb-4">
                    Not authenticated. Become an approved writer to start writing.
                </h1>
                <button
                    onClick={() => router.push("/account")}
                    className="text-blue-500 underline hover:text-blue-700 transition"
                >
                    Click here to update your profile
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col max-h-screen h-screen">
            <Header />
            {!canPublish && (
                <div className="w-full bg-red-100 text-red-800 text-sm py-2 px-4 text-center">
                    You can only save drafts, as your account is not yet approved.
                </div>
            )}
            <div className="flex-grow p-6 overflow-auto">
                <BlogEditor id={user?.id || ""} blog={paramBlog} canPublish={canPublish} />
            </div>
            <Toaster />
        </div>
    );
};

const Page = () => {
    return (
        <Suspense fallback={<Skeleton className="w-full h-40" />}>
            <PageContent />
        </Suspense>
    );
};

export default Page;
