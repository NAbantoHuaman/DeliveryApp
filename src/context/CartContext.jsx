import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);

    // Load cart from localStorage on mount
    useEffect(() => {
        const storedCart = localStorage.getItem('chaskys_cart');
        if (storedCart) {
            setCart(JSON.parse(storedCart));
        }
    }, []);

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('chaskys_cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product, quantity = 1, options = {}) => {
        setCart(prevCart => {
            const newItem = { ...product, quantity, options, cartId: Date.now() };
            return [...prevCart, newItem];
        });
        setIsCartOpen(true);
    };

    const removeFromCart = (cartId) => {
        setCart(prevCart => prevCart.filter(item => item.cartId !== cartId));
    };

    const updateQuantity = (cartId, newQuantity) => {
        setCart(prevCart => {
            if (newQuantity <= 0) {
                return prevCart.filter(item => item.cartId !== cartId);
            }
            return prevCart.map(item => {
                if (item.cartId === cartId) {
                    return { ...item, quantity: newQuantity };
                }
                return item;
            });
        });
    };

    const clearCart = () => {
        setCart([]);
    };

    const getCartTotal = () => {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const getCartCount = () => {
        return cart.reduce((count, item) => count + item.quantity, 0);
    };

    const value = {
        cart,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};
