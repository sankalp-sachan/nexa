import { createContext, useState, useEffect, useContext } from 'react';
import { toast } from 'react-hot-toast';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        const savedCart = localStorage.getItem('cartItems');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);

    const [shippingInfo, setShippingInfo] = useState(() => {
        const saved = localStorage.getItem('shippingInfo');
        return saved ? JSON.parse(saved) : {};
    });

    useEffect(() => {
        localStorage.setItem('shippingInfo', JSON.stringify(shippingInfo));
    }, [shippingInfo]);

    const saveShippingInfo = (data) => {
        setShippingInfo(data);
    };

    const addToCart = (product, quantity = 1) => {
        const existItem = cartItems.find((item) => item.product === product._id);

        if (existItem) {
            setCartItems(
                cartItems.map((item) =>
                    item.product === existItem.product ? { ...item, quantity: item.quantity + quantity } : item
                )
            );
        } else {
            // Normalize product structure for cart
            const newItem = {
                product: product._id,
                name: product.name,
                price: product.price,
                image: product.images[0]?.url,
                stock: product.stock,
                quantity
            };
            setCartItems([...cartItems, newItem]);
        }
        toast.success('Item added to cart');
    };

    const removeFromCart = (id) => {
        setCartItems(cartItems.filter((item) => item.product !== id));
        toast.success('Item removed from cart');
    };

    const updateQuantity = (id, quantity) => {
        setCartItems(
            cartItems.map((item) =>
                item.product === id ? { ...item, quantity } : item
            )
        );
    };

    const clearCart = () => {
        setCartItems([]);
        localStorage.removeItem('cartItems');
    };

    return (
        <CartContext.Provider value={{
            cartItems,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            saveShippingInfo,
            shippingInfo
        }}>
            {children}
        </CartContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => useContext(CartContext);
