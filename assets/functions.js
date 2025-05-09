import AsyncStorage from "@react-native-async-storage/async-storage";

const ORDERS_KEY = '@playstation_orders';
const USER_KEY = '@playstation_user';
const PRODUCTS_KEY = '@playstation_products';

// Product-related functions
export const saveProducts = async (products) => {
  if (!Array.isArray(products)) {
    console.error('Invalid products data type');
    return false;
  }

  try {
    const productsJson = JSON.stringify(products);
    await AsyncStorage.setItem(PRODUCTS_KEY, productsJson);
    return true;
  } catch (error) {
    console.error('Error saving products:', error);
    return false;
  }
};

export const loadProducts = async () => {
  try {
    const productsJson = await AsyncStorage.getItem(PRODUCTS_KEY);
    if (!productsJson) return [];
    
    const products = JSON.parse(productsJson);
    return Array.isArray(products) ? products : [];
  } catch (error) {
    console.error('Error loading products:', error);
    return [];
  }
};

// Orders-related functions
export const saveOrders = async (orders) => {
  if (!Array.isArray(orders)) {
    console.error('Invalid orders data type');
    return false;
  }

  try {
    const ordersJson = JSON.stringify(orders);
    await AsyncStorage.setItem(ORDERS_KEY, ordersJson);
    return true;
  } catch (error) {
    console.error('Error saving orders:', error);
    return false;
  }
};

export const loadOrders = async () => {
  try {
    const ordersJson = await AsyncStorage.getItem(ORDERS_KEY);
    console.log('Raw orders data:', ordersJson);
    
    if (!ordersJson) {
      console.log('No orders found in storage');
      return [];
    }
    
    try {
      const orders = JSON.parse(ordersJson);
      if (!Array.isArray(orders)) {
        console.error('Parsed orders is not an array:', orders);
        return [];
      }
      return orders;
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.error('Invalid JSON data:', ordersJson);
      // Clear invalid data
      await AsyncStorage.removeItem(ORDERS_KEY);
      return [];
    }
  } catch (error) {
    console.error('Error loading orders:', error);
    return [];
  }
};

export const addOrder = async (newOrder) => {
  if (!newOrder || typeof newOrder !== 'object') {
    console.error('Invalid order data');
    return false;
  }

  try {
    const currentOrders = await loadOrders();
    if (!Array.isArray(currentOrders)) {
      console.error('Current orders is not an array');
      return false;
    }

    const updatedOrders = [...currentOrders, newOrder];
    const success = await saveOrders(updatedOrders);
    
    if (!success) {
      console.error('Failed to save updated orders');
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error adding order:', error);
    return false;
  }
};

export const removeOrder = async (orderId) => {
  if (!orderId) {
    console.error('Invalid order ID');
    return false;
  }

  try {
    const currentOrders = await loadOrders();
    if (!Array.isArray(currentOrders)) {
      console.error('Current orders is not an array');
      return false;
    }

    const updatedOrders = currentOrders.filter(order => order.id !== orderId);
    const success = await saveOrders(updatedOrders);

    if (!success) {
      console.error('Failed to save updated orders');
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error removing order:', error);
    return false;
  }
};

// User-related functions
export const saveUser = async (userData) => {
  if (!userData || typeof userData !== 'object') {
    console.error('Invalid user data');
    return false;
  }

  try {
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(userData));
    return true;
  } catch (error) {
    console.error('Error saving user:', error);
    return false;
  }
};

export const loadUser = async () => {
  try {
    const userJson = await AsyncStorage.getItem(USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
  } catch (error) {
    console.error('Error loading user:', error);
    return null;
  }
};

export const removeUser = async () => {
  try {
    await AsyncStorage.removeItem(USER_KEY);
    return true;
  } catch (error) {
    console.error('Error removing user:', error);
    return false;
  }
};

// Helper functions for general storage operations
export const storeData = async (value, key) => {
  try {
    await AsyncStorage.setItem(key, value);
    return true;
  } catch (error) {
    console.error("Error saving data to storage:", error);
    return false;
  }
};

export const storeDataJSON = async (value, key) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
    return true;
  } catch (error) {
    console.error("Error saving JSON data to storage:", error);
    return false;
  }
};

export const getData = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value;
  } catch (error) {
    console.error("Error getting data from storage:", error);
    return null;
  }
};

export const getDataJSON = async (key) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error("Error getting JSON data from storage:", error);
    return null;
  }
};