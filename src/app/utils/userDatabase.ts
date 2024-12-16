import { supabase } from "./supabase";
import { User } from "../types/user"

// Update to include the complete User type if needed

// Function to insert a new user into the users table
export const insertUser = async (name: string, email: string, auth_id: string): Promise<{ user: User | null; error: string | null }> => {
    const { data, error } = await supabase.from("users")
        .insert({ name: name, email: email, auth_id: auth_id })
        .select();

    if (error) {
        console.error("Error occurred while inserting user:", error.message);
        return { user: null, error: error.message }; // Return error message if insertion fails
    }

    return { user: data[0] as User, error: null }; // Cast to User type
};

// Function to fetch a user based on auth_id
export const getUser = async (params: { auth_id?: string; id?: string }): Promise<{ user: User | null; error: string | null }> => {
    const { auth_id, id } = params;

    // Initialize the query to select from users table
    let query = supabase.from("users").select();

    // Add conditions based on provided parameters
    if (auth_id) {
        query = query.eq('auth_id', auth_id);
    } else if (id) {
        query = query.eq('id', id);
    } else {
        // If neither is provided, return early with an error
        return { user: null, error: "Either auth_id or id must be provided." };
    }

    // Execute the query
    const { data, error } = await query;

    if (error) {
        console.error("Error occurred while fetching user:", error.message);
        return { user: null, error: error.message }; // Return error message if fetching fails
    }

    // Return the first user found or null if none exist
    return { user: data ? (data[0] as User) : null, error: null };
};


export const updateUser = async (user: User): Promise<{ user: User | null; error: string | null }> => {
    const { auth_id, ...updates } = user; // Extract auth_id, and keep the rest as updateable fields

    const { data, error } = await supabase
        .from("users")
        .update(updates)
        .eq("auth_id", auth_id)
        .select();

    if (error) {
        console.error("Error updating user:", error.message);
        return { user: null, error: error.message }; // Return error message if the update fails
    }

    return { user: data[0] as User, error: null }; // Cast and return updated user
};

export const getAllUsers = async (): Promise<{ users: User[] | null; error: string | null }> => {
    const { data, error } = await supabase
        .from("users")
        .select()
        .in("type", ["reader", "author"])
        .order("name", { ascending: true });

    if (error) {
        console.error("Error fetching users:", error.message);
        return { users: null, error: error.message }; // Return error message if fetching fails
    }

    return { users: data as User[], error: null }; // Return array of users
}