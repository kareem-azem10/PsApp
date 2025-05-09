import React, { useState, useEffect } from 'react'
import AppContext from './AppContext';
import { loadOrders, saveOrders, loadProducts, saveProducts, loadUser, saveUser, removeUser } from '../assets/functions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { router } from 'expo-router';

const AppProvider = props => {
    const [user, setUser] = useState(null);
    const [cart, setCart] = useState({});
    const [products, setProducts] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isOrder, setIsOrder] = useState(true);
    const [orders, setOrders] = useState([]);

    // Load user, orders, and products from AsyncStorage when app starts
    useEffect(() => {
        const loadSavedData = async () => {
            try {
                // Load user
                const savedUser = await loadUser();
                if (savedUser) {
                    setUser(savedUser);
                    setIsLoggedIn(true);
                }

                // Load orders
                const savedOrders = await loadOrders();
                if (savedOrders && Array.isArray(savedOrders)) {
                    setOrders(savedOrders);
                }

                // Load products
                const savedProducts = await loadProducts();
                if (savedProducts && Array.isArray(savedProducts)) {
                    setProducts(savedProducts);
                }

                // Load cart
                const savedCart = await AsyncStorage.getItem('cart');
                if (savedCart) {
                    setCart(JSON.parse(savedCart));
                }
            } catch (error) {
                console.error('Error loading saved data:', error);
            }
        };
        loadSavedData();
    }, []);

    // Save orders to AsyncStorage whenever they change
    useEffect(() => {
        if (orders && Array.isArray(orders) && orders.length > 0) {
            saveOrders(orders).catch(error => 
                console.error('Error saving orders:', error)
            );
        }
    }, [orders]);

    // Save products to AsyncStorage whenever they change
    useEffect(() => {
        if (products && Array.isArray(products) && products.length > 0) {
            saveProducts(products).catch(error => 
                console.error('Error saving products:', error)
            );
        }
    }, [products]);

    // Save cart to AsyncStorage whenever it changes
    useEffect(() => {
        const saveCart = async () => {
            try {
                await AsyncStorage.setItem('cart', JSON.stringify(cart));
            } catch (error) {
                console.error('Error saving cart:', error);
            }
        };
        saveCart();
    }, [cart]);

    // Handle user login
    const handleLogin = async (userData) => {
        try {
            await saveUser(userData);
            setUser(userData);
            setIsLoggedIn(true);
        } catch (error) {
            console.error('Error during login:', error);
            throw error;
        }
    };

    // Handle user logout
    const handleLogout = async () => {
        try {
            await removeUser();
            setUser(null);
            setIsLoggedIn(false);
            setCart({});
        } catch (error) {
            console.error('Error during logout:', error);
            throw error;
        }
    };

    // Add item to cart
    const addToCart = (product, quantity = 1) => {
        if (!user || !isLoggedIn) {
            Alert.alert(
                'Login Required',
                'Please login to add items to your cart',
                [
                    {
                        text: 'Cancel',
                        style: 'cancel'
                    },
                    {
                        text: 'Login',
                        onPress: () => router.push('/(app)/Login')
                    }
                ]
            );
            return;
        }

        setCart(currentCart => {
            const existingQuantity = currentCart[product.id]?.quantity || 0;
            const updatedCart = {
                ...currentCart,
                [product.id]: {
                    ...product,
                    quantity: existingQuantity + quantity
                }
            };
            return updatedCart;
        });
    };

    // Remove item from cart
    const removeFromCart = (productId) => {
        setCart(currentCart => {
            const updatedCart = { ...currentCart };
            delete updatedCart[productId];
            return updatedCart;
        });
    };

    // Update cart item quantity
    const updateCartItemQuantity = (productId, quantity) => {
        setCart(currentCart => {
            if (!currentCart[productId]) return currentCart;
            
            return {
                ...currentCart,
                [productId]: {
                    ...currentCart[productId],
                    quantity: quantity
                }
            };
        });
    };

    const contextValue = {
        user,
        setUser: handleLogin,
        isLoggedIn,
        setIsLoggedIn,
        cart,
        setCart,
        addToCart,
        removeFromCart,
        updateCartItemQuantity,
        products,
        setProducts,
        isOrder,
        setIsOrder,
        orders,
        setOrders,
        handleLogout
    };

    return (
        <AppContext.Provider value={contextValue}>
            {props.children}
        </AppContext.Provider>
    );
};

export default AppProvider;