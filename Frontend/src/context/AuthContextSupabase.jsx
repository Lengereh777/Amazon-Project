import { createContext, useContext, useState, useEffect } from "react";
import {
    supabase,
    signUp,
    signIn,
    signOut,
    getCurrentUser,
    onAuthStateChange,
    signInWithGoogle,
    signInWithGitHub,
    resetPassword,
    updatePassword,
} from "../config/supabaseClient";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Subscribe to auth state changes
    useEffect(() => {
        // Get initial session
        const getInitialSession = async () => {
            if (supabase) {
                const { data: { session: initialSession } } = await supabase.auth.getSession();
                setSession(initialSession);
                setUser(initialSession?.user ?? null);
            }
            setLoading(false);
        };

        getInitialSession();

        // Listen for auth changes
        const { data: { subscription } } = onAuthStateChange((event, newSession) => {
            setSession(newSession);
            setUser(newSession?.user ?? null);
            setLoading(false);
        });

        return () => {
            subscription?.unsubscribe();
        };
    }, []);

    // Login function
    const login = async (email, password) => {
        setLoading(true);
        setError(null);
        const { data, error: loginError } = await signIn(email, password);

        if (loginError) {
            setError(loginError.message);
            setLoading(false);
            return { success: false, error: loginError.message };
        }

        setUser(data.user);
        setSession(data.session);
        setLoading(false);
        return { success: true, user: data.user };
    };

    // Register function
    const register = async (email, password, fullName) => {
        setLoading(true);
        setError(null);
        const { data, error: registerError } = await signUp(email, password, fullName);

        if (registerError) {
            setError(registerError.message);
            setLoading(false);
            return { success: false, error: registerError.message };
        }

        // Note: User might need to verify email before being fully logged in
        setUser(data.user);
        setSession(data.session);
        setLoading(false);
        return { success: true, user: data.user };
    };

    // Logout function
    const logout = async () => {
        setLoading(true);
        setError(null);
        const { error: logoutError } = await signOut();

        if (logoutError) {
            setError(logoutError.message);
            setLoading(false);
            return { success: false, error: logoutError.message };
        }

        setUser(null);
        setSession(null);
        setLoading(false);
        return { success: true };
    };

    // Google OAuth login
    const loginWithGoogle = async () => {
        setError(null);
        const { error: googleError } = await signInWithGoogle();

        if (googleError) {
            setError(googleError.message);
            return { success: false, error: googleError.message };
        }

        // OAuth will redirect, so we don't set user here
        return { success: true };
    };

    // GitHub OAuth login
    const loginWithGitHub = async () => {
        setError(null);
        const { error: githubError } = await signInWithGitHub();

        if (githubError) {
            setError(githubError.message);
            return { success: false, error: githubError.message };
        }

        // OAuth will redirect, so we don't set user here
        return { success: true };
    };

    // Password reset
    const forgotPassword = async (email) => {
        setError(null);
        const { error: resetError } = await resetPassword(email);

        if (resetError) {
            setError(resetError.message);
            return { success: false, error: resetError.message };
        }

        return { success: true };
    };

    // Update password
    const changePassword = async (newPassword) => {
        setError(null);
        const { data, error: updateError } = await updatePassword(newPassword);

        if (updateError) {
            setError(updateError.message);
            return { success: false, error: updateError.message };
        }

        return { success: true, data };
    };

    // Check if user is authenticated
    const isAuthenticated = () => {
        return user !== null && session !== null;
    };

    // Get current user
    const getCurrentAuthUser = () => {
        return user;
    };

    // Get access token
    const getAccessToken = () => {
        return session?.access_token ?? null;
    };

    // Clear error
    const clearError = () => {
        setError(null);
    };

    const value = {
        user,
        session,
        loading,
        error,
        login,
        register,
        logout,
        loginWithGoogle,
        loginWithGitHub,
        forgotPassword,
        changePassword,
        isAuthenticated,
        getCurrentAuthUser,
        getAccessToken,
        clearError,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
};

export default AuthContext;
