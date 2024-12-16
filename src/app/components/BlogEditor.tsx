"use client";
import React, { useState, useRef, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import dynamic from 'next/dynamic';
import SkeletonCard from './SkeletonCard';
import { insertBlog } from '../utils/blogDatabase';
import { uploadCoverImage } from '../utils/storage';
import ReactQuill from 'react-quill-new';
import { useRouter } from 'next/navigation';
import { Blog } from '../types/blog';

// Dynamically import QuillEditor
const QuillEditor = dynamic(() => import('./QuillEditor'), {
    ssr: false, // Disable server-side rendering for this component
});

interface BlogEditorProps {
    id: string;
    canPublish: boolean;
    blog: Blog | null;
}

const BlogEditor: React.FC<BlogEditorProps> = ({ id, canPublish, blog }) => {
    const [title, setTitle] = useState<string>('');
    const [subTitle, setSubTitle] = useState<string>('');
    const [content, setContent] = useState<string>('');
    const [coverImage, setCoverImage] = useState<File | null>(null);
    const [coverImageUrl, setCoverImageUrl] = useState<string>("");
    const [insertingBlog, setInsertingBlog] = useState<boolean>(false);
    const editorRef = useRef<ReactQuill | null>(null);
    const router = useRouter()

    const modules = {
        toolbar: [
            [{ 'header': '1' }, { 'header': '2' }, { 'header': '3' }, { 'header': '4' }, { 'header': '5' }, { 'font': [] }],
            [{ size: [] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote', 'code-block'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
            ['link'],
            ['clean']
        ],
    };

    useEffect(() => {
        if (blog) {
            setTitle(blog.title)
            setSubTitle(blog.sub_title || "")
            setContent(blog.content)
            setCoverImageUrl(blog.cover_image || "")
        }
    }, [blog])

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files ? event.target.files[0] : null;
        if (file) {
            setCoverImage(file);
        }
    };

    const handleSubmit = async (state: string) => {
        setInsertingBlog(true);
        try {
            if (!title || !content) {
                toast.error('Title and Content are required');
                return;
            }
            let avatarUrl = ""
            if (coverImage) {
                const { publicUrl, error } = await uploadCoverImage(coverImage, id);
                if (error) {
                    toast.error("Failed to upload image");
                    return;
                }
                if (publicUrl) {
                    avatarUrl = publicUrl;
                    setCoverImageUrl(publicUrl);
                }
            }

            const contentText = editorRef.current?.getEditor().getText() || ""; // Get plain text content

            const words = contentText.trim().split(/\s+/).length; // Calculate word count
            const wordsPerMinute = 200;
            const readingTime = Math.ceil(words / wordsPerMinute);
            const { blog: BlogData, error } = await insertBlog(
                title,
                content,
                subTitle,
                avatarUrl,
                state,
                words,
                readingTime,
                id
            );

            if (error) {
                toast.error("Error submitting blog");
                return;
            }
            if (BlogData) {
                toast.success("Upload blog successfully");
                setTitle("")
                setContent("")
                setSubTitle("")
                setCoverImage(null)
                setCoverImageUrl("")
                router.push(`/blog/${BlogData.id}`);
            }
        } catch (error) {
            console.error(error);
            toast.error("Error submitting blog");
        } finally {
            setInsertingBlog(false);
        }
    };

    // const handleUpdate = async () => {
    //     setInsertingBlog(true); // Show loading state
    //     try {
    //         if (!title || !content) {
    //             toast.error('Title and Content are required');
    //             return;
    //         }

    //         let avatarUrl = coverImageUrl; // Use existing cover image URL
    //         if (coverImage) {
    //             const { publicUrl, error } = await uploadCoverImage(coverImage, id);
    //             if (error) {
    //                 toast.error("Failed to upload image");
    //                 return;
    //             }
    //             if (publicUrl) {
    //                 avatarUrl = publicUrl;
    //             }
    //         }

    //         const contentText = editorRef.current?.getEditor().getText() || ""; // Get plain text content
    //         const words = contentText.trim().split(/\s+/).length; // Calculate word count
    //         const wordsPerMinute = 200;
    //         const readingTime = Math.ceil(words / wordsPerMinute);

    //         const { blog: updatedBlog, error } = await updateBlog(
    //             id,
    //             title,
    //             content,
    //             subTitle,
    //             avatarUrl,
    //             'published', // or any state you need
    //             words,
    //             readingTime
    //         );

    //         if (!updatedBlog) {
    //             toast.error("Error updating blog");
    //             return;
    //         }
    //         toast.success("Blog updated successfully");
    //         // Optionally redirect or do something after updating
    //         router.push(`/blog/${updatedBlog.id}`);
    //     } catch (error) {
    //         console.error(error);
    //         toast.error("Error updating blog");
    //     } finally {
    //         setInsertingBlog(false); // Hide loading state
    //     }
    // };


    if (insertingBlog) {
        return <SkeletonCard />;
    }


    return (
        <div className="p-5 h-full bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-md">
            <div className="mb-4 flex flex-col items-center">
                <div className="flex flex-col items-center w-full p-5">
                    {coverImage || coverImageUrl ? (
                        <div className="flex flex-col items-center">
                            <img
                                src={coverImage ? URL.createObjectURL(coverImage) : coverImageUrl}
                                alt="Cover Image"
                                width={500}
                                height={200}
                                className="rounded-md mb-2"
                            />
                            <button
                                onClick={() => document.getElementById('imageUpload')?.click()}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-md transition duration-200 hover:bg-blue-500 mb-2"
                            >
                                Change Image
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center">
                            <input
                                id="imageUpload"
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden" // Hide the input
                            />
                            <label
                                htmlFor="imageUpload"
                                className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md shadow-md transition duration-200 hover:bg-blue-500 cursor-pointer mb-4"
                            >
                                Upload Cover Image
                            </label>
                        </div>
                    )}
                </div>

            </div>

            <h2 className="text-xl font-semibold text-gray-700 mb-4">Create Your Blog Post</h2>

            {/* Title Input */}
            <input
                required
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter blog title..."
                className="w-full p-3 mb-4 border rounded-md"
            />

            {/* Subtitle Input */}
            <input
                type="text"
                value={subTitle}
                onChange={(e) => setSubTitle(e.target.value)}
                placeholder="Enter blog subtitle..."
                className="w-full p-2 mb-4 border rounded-md"
            />

            {/* QuillEditor Component */}
            <div className="bg-white p-4 rounded-md shadow-inner mb-4">
                <QuillEditor
                    ref={editorRef} // Attach ref to the new QuillEditor
                    modules={modules}
                    theme="snow"
                    value={content}
                    onChange={setContent}
                    placeholder="Start typing your blog here..."
                    className="text-gray-800 quill-container quill-toolbar ql-container"
                />
            </div>
            <div className="flex justify-end items-center gap-4 pb-5">
                {blog ? (
                    // If the blog is present, show the Update button
                    <button
                        onClick={() => handleSubmit("update")} // Use a state like 'update' or similar for updating
                        className="px-5 py-2 bg-blue-600 text-white rounded-md transition duration-200 hover:bg-blue-500"
                    >
                        Update
                    </button>
                ) : (
                    // If the blog is not present, show the Save as Draft and Publish buttons
                    <>
                        <button
                            onClick={() => handleSubmit("draft")}
                            className="px-5 py-2 bg-gradient-to-r from-slate-200 to-slate-300 text-slate-800 font-semibold rounded-md border border-slate-300 shadow-md transition duration-300 ease-in-out transform hover:bg-slate-500 hover:shadow-lg hover:scale-105"
                        >
                            Save as Draft
                        </button>

                        {canPublish ? (
                            <button
                                onClick={() => handleSubmit("published")}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md transition duration-200 hover:bg-blue-500"
                            >
                                Publish
                            </button>
                        ) : (
                            <button
                                disabled
                                className="px-4 py-2 bg-gray-300 text-gray-500 rounded-md cursor-not-allowed"
                            >
                                Publish
                            </button>
                        )}
                    </>
                )}
            </div>


            <Toaster />
        </div>
    );
};

export default BlogEditor;
