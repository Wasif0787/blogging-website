export interface User {
    id: string;
    auth_id: string;
    name: string;
    email: string;
    bio: string | null;
    created_at: string;
    profile_pic: string | null;
    status: string;
    type: string;
    posts: string[]
}