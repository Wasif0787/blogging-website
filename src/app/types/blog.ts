export interface Blog {
    id: string;
    title: string;
    content: string;
    cover_image: string | null;
    state: string;
    words: number;
    reading_time: number;
    author_id: string;
    sub_title: string;
    created_at: string;
}