import { supabase } from './supabase';
import { User, Session } from '@supabase/supabase-js';

export const signUp = async (email: string, password: string): Promise<{ user: User | null; error: string | null }> => {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
    });

    if (error) {
        console.error('Error signing up:', error.message);
        return { user: null, error: error.message };
    }

    return { user: data.user, error: null }; // Return null if signup is successful
};


export const signIn = async (email: string, password: string): Promise<{ user: User | null; session: Session | null; error: string | null }> => {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        console.error('Error signing in:', error);
        return { user: null, session: null, error: error.message }; // Return error message
    }

    return { user: data.user, session: data.session, error: null }; // Return user and session
};

export const signOut = async (): Promise<{ error: string | null }> => {
    const { error } = await supabase.auth.signOut();

    if (error) {
        console.error('Error signing out:', error.message);
        return { error: error.message }; // Return error message if there's an error
    }

    return { error: null }; // Return null for error if sign out is successful
};

export const verifyOtp = async (email: string, token: string): Promise<{ user: User | null; error: string | null }> => {
    const { data, error } = await supabase.auth.verifyOtp({ email, token, type: 'email' });
    if (error) {
        console.error('Error verifying OTP:', error.message);
        return { user: null, error: error.message };
    }
    return { user: data.user, error: null }; // Return null if verification is successful
};
