import { create } from "zustand";
import { User } from "../types/user";

interface UserStore {
    user: User | null;
    loading: boolean; // New loading state
    setUser: (user: User | null) => void;
    setLoading: (loading: boolean) => void; // New setter for loading state
}

const useUserStore = create<UserStore>((set) => ({
    user: null,
    loading: true, // Initialize loading as true
    setUser: (user) => {
        if (typeof window !== "undefined") {
            if (user) {
                localStorage.setItem("user", JSON.stringify(user));
            } else {
                localStorage.removeItem("user");
            }
        }
        set({ user, loading: false }); // Set loading to false when user is set
    },
    setLoading: (loading) => set({ loading }), // Set loading state
}));

// Hydrate the store with the user from localStorage on the client side
if (typeof window !== "undefined") {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
        useUserStore.setState({ user: JSON.parse(storedUser), loading: false }); // Set loading to false after hydration
    } else {
        useUserStore.setState({ loading: false }); // No user, set loading to false
    }
}

export default useUserStore;
