import { Blog } from "../types/blog"
import { supabase } from "./supabase"

export const insertBlog = async (title: string, content: string, sub_title: string, cover_image: string, state: string, words: number, reading_time: number, author_id: string): Promise<{ blog: Blog | null; error: string | null }> => {
    const { data, error } = await supabase.from("blogs")
        .insert({
            title,
            content,
            sub_title,
            cover_image,
            state,
            words,
            reading_time,
            author_id
        })
        .select();

    if (error) {
        console.error("Error occurred while inserting blog:", error.message);
        return { blog: null, error: error.message };
    }

    return { blog: data[0] as Blog, error: null };
};

export const getBlogById = async (params: { id: string }): Promise<{ blog: Blog | null; error: string | null }> => {
    const { id } = params;

    // Execute the query
    const { data, error } = await supabase
        .from("blogs")
        .select()
        .eq("id", id)
        .single(); // Use .single() to fetch one record

    if (error) {
        console.error("Error occurred while fetching blog:", error.message);
        return { blog: null, error: error.message }; // Return error message if fetching fails
    }

    // Return the first blog found or null if none exist
    return { blog: data ? (data as Blog) : null, error: null };
};

export const getUserBlogs = async (author_id: string): Promise<{ blog: Blog[] | null; error: string | null }> => {

    const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('author_id', author_id);

    if (error) {
        console.error("Error occurred while getting blog:", error.message);
        return { blog: null, error: error.message };
    }

    return { blog: data as Blog[], error: null };
};

export const getAllBlogs = async (): Promise<{ blog: Blog[] | null; error: string | null }> => {

    const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('state', "published");

    if (error) {
        console.error("Error occurred while getting blog:", error.message);
        return { blog: null, error: error.message };
    }

    return { blog: data as Blog[], error: null };
};

export const updateBlog = async (
    id: string,
    title: string,
    content: string,
    sub_title: string,
    cover_image: string,
    state: string,
    words: number,
    reading_time: number
): Promise<{ blog: Blog | null; error: string | null }> => {
    const { data, error } = await supabase
        .from("blogs")
        .update({
            title,
            content,
            sub_title,
            cover_image,
            state,
            words,
            reading_time
        })
        .eq("id", id) // Specify the blog ID to update
        .select();

    if (error) {
        console.error("Error occurred while updating blog:", error.message);
        return { blog: null, error: error.message };
    }

    return { blog: data[0] as Blog, error: null };
};
