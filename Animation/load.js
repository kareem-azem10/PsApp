import { useNavigation } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { getAllProducts, Login } from '../api/api';
import AppContext from '../store/AppContext';
// import { getDataJSON } from '../assets/Functions'; // Import utility functions

const StartLoading = props => {
  const { setProducts, setCart, setUser, user } = useContext(AppContext);
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const initialize = async () => {
      await getAllProductsFromApi();
      await getCart();
      await restoreUser();
      setIsLoading(false);
    };

    initialize();
  }, []);

  const restoreUser = async () => {
    const userData = await getDataJSON("user");
    if (userData !== null) {
      const body = {
        Email: userData.Email,
        Password: userData.Password,
      };
      const user = await Login(body);
      if (userData && user) {
        setUser(user);
        navigation.replace('Home');
      }
    } else {
      console.log("2");
      navigation.replace('Home');
    }
  };

  const getCart = async () => {
    const cart = await getDataJSON("cart");
    if (cart && Array.isArray(cart)) {
      setCart([...cart]);
    }
  };

  const getAllProductsFromApi = async () => {
    const products = await getAllProducts();
    if (products.message === 'product is found') {
      setProducts(products.products);
    }
  };

  console.log("data ", user);

  if (isLoading) {
    return (
      <View style={styles.Screen}>
        <Text>Loading...</Text>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  Screen: {
    flex: 1,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center'
  },
});

export default StartLoading;