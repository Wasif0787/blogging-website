"use client";
import { useRouter } from 'next/navigation';
import { Blog } from '../app/types/blog';

const BlogCard = (blog: Blog) => {
    const router = useRouter()
    return (
        <div onClick={() => router.push(`/blog/${blog.id}`)} className="w-full max-w-md bg-white rounded-lg shadow-lg overflow-hidden flex flex-col transition-transform transform hover:scale-105 border border-slate-300 cursor-pointer">
            {/* Cover Image */}
            <div className="relative w-full h-48 bg-gray-200">
                <img
                    src={blog.cover_image || "/no-image.png"}
                    alt={blog.title}
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Content */}
            <div className="p-4 flex-1 flex flex-col justify-between">
                <h2 className="text-xl font-semibold text-gray-800">{blog.title}</h2>
                <p dangerouslySetInnerHTML={{ __html: blog.content }} className="text-gray-600 mt-2 line-clamp-3" />

                <div className="mt-4">
                    <span className="text-sm text-gray-500 ml-2">{new Date(blog.created_at).toLocaleDateString()}</span>
                </div>
            </div>
        </div>
    );
}

export default BlogCard;
