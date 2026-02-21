import { createContext, useContext, useState, useEffect } from "react";
import {
    subscribeToAuthState,
    loginUser,
    registerUser,
    logoutUser,
    getCurrentUser,
} from "../config/firebaseConfig";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Subscribe to auth state changes
    useEffect(() => {
        const unsubscribe = subscribeToAuthState((authUser) => {
            if (authUser) {
                setUser({
                    uid: authUser.uid,
                    email: authUser.email,
                    displayName: authUser.displayName,
                });
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    // Login function
    const login = async (email, password) => {
        setLoading(true);
        setError(null);
        const result = await loginUser(email, password);
        if (result.success && result.user) {
            setUser({
                uid: result.user.uid,
                email: result.user.email,
                displayName: result.user.displayName,
            });
        } else {
            setError(result.error);
        }
        setLoading(false);
        return result;
    };

    // Register function
    const register = async (email, password) => {
        setLoading(true);
        setError(null);
        const result = await registerUser(email, password);
        if (result.success && result.user) {
            setUser({
                uid: result.user.uid,
                email: result.user.email,
                displayName: result.user.displayName,
            });
        } else {
            setError(result.error);
        }
        setLoading(false);
        return result;
    };

    // Logout function
    const logout = async () => {
        setLoading(true);
        setError(null);
        const result = await logoutUser();
        if (result.success) {
            setUser(null);
        } else {
            setError(result.error);
        }
        setLoading(false);
        return result;
    };

    // Check if user is authenticated
    const isAuthenticated = () => {
        return user !== null;
    };

    // Get current user
    const getCurrentAuthUser = () => {
        return getCurrentUser();
    };

    const value = {
        user,
        loading,
        error,
        login,
        register,
        logout,
        isAuthenticated,
        getCurrentAuthUser,
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
