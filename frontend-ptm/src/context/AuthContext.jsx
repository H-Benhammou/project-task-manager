import React, { createContext, useContext, useState } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

// Custom hook must be used within AuthProvider
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    // Initialize state from localStorage to avoid cascading renders in useEffect
    const [user, setUser] = useState(() => authService.getCurrentUser());
    const [isAuthenticated, setIsAuthenticated] = useState(() => authService.isAuthenticated());
    const [loading, setLoading] = useState(false);

    const login = async (email, password) => {
        setLoading(true);
        try {
            const userData = await authService.login(email, password);
            setUser(userData);
            setIsAuthenticated(true);
            return userData;
        } finally {
            setLoading(false);
        }
    };

    const register = async (name, email, password) => {
        setLoading(true);
        try {
            const userData = await authService.register(name, email, password);
            setUser(userData);
            setIsAuthenticated(true);
            return userData;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        authService.logout();
        setUser(null);
        setIsAuthenticated(false);
    };

    const value = {
        user,
        isAuthenticated,
        loading,
        login,
        register,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};