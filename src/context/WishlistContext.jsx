import { createContext, useState, useEffect, useContext, useCallback } from 'react';
import axios from '../api/axios';
import { useAuth } from './AuthContext';
import { toast } from 'react-hot-toast';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
    const [wishlistItems, setWishlistItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const { isAuthenticated } = useAuth();

    const fetchWishlist = useCallback(async () => {
        if (!isAuthenticated) return;
        setLoading(true);
        try {
            const { data } = await axios.get('/wishlist/me');
            setWishlistItems(data.products || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated]);

    useEffect(() => {
        if (isAuthenticated) {
            fetchWishlist();
        } else {
            setWishlistItems([]);
        }
    }, [isAuthenticated, fetchWishlist]);

    const addToWishlist = async (productId) => {
        if (!isAuthenticated) {
            return toast.error("Please login to use wishlist");
        }
        try {
            await axios.post('/wishlist/add', { productId });
            fetchWishlist();
            toast.success("Added to wishlist");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to add to wishlist");
        }
    };

    const removeFromWishlist = async (productId) => {
        try {
            await axios.delete(`/wishlist/${productId}`);
            setWishlistItems(prev => prev.filter(item => item._id !== productId));
            toast.success("Removed from wishlist");
        } catch (error) {
            toast.error("Failed to remove from wishlist");
        }
    };

    const toggleWishlist = async (product) => {
        const isExist = wishlistItems.find(item => item._id === product._id);
        if (isExist) {
            await removeFromWishlist(product._id);
        } else {
            await addToWishlist(product._id);
        }
    };

    return (
        <WishlistContext.Provider value={{
            wishlistItems,
            loading,
            addToWishlist,
            removeFromWishlist,
            toggleWishlist,
            fetchWishlist
        }}>
            {children}
        </WishlistContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useWishlist = () => useContext(WishlistContext);
