import { createContext, useState, useEffect, useContext } from 'react';
import axios from '../api/axios';
import { toast } from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const loadUser = async () => {
        try {
            const { data } = await axios.get('/auth/me');
            setUser(data.user);
            setIsAuthenticated(true);
        } catch (error) {
            setUser(null);
            setIsAuthenticated(false);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUser();
    }, []);

    const login = async (email, password) => {
        try {
            const { data } = await axios.post('/auth/login', { email, password });
            setUser(data.user);
            setIsAuthenticated(true);
            toast.success('Logged in successfully');
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Login failed');
            return false;
        }
    };

    const register = async (userData) => {
        try {
            const { data } = await axios.post('/auth/register', userData);
            if (data.userId) { // If it returns userId, maybe we need verification
                toast.success(data.message);
                return { success: true, userId: data.userId };
            }
            return { success: true };
        } catch (error) {
            toast.error(error.response?.data?.message || 'Registration failed');
            return { success: false };
        }
    };

    const verifyEmail = async (email, otp) => {
        try {
            const { data } = await axios.post('/auth/verify', { email, otp });
            setUser(data.user);
            setIsAuthenticated(true);
            toast.success('Email verified successfully');
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Verification failed');
            return false;
        }
    };

    const logout = async () => {
        try {
            await axios.get('/auth/logout');
            setUser(null);
            setIsAuthenticated(false);
            toast.success('Logged out successfully');
        } catch (error) {
            toast.error('Logout failed');
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            isAuthenticated,
            login,
            register,
            verifyEmail,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
