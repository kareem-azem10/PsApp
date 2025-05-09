import { useRouter } from 'expo-router';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Animated, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getAllProducts } from '../api/api';
import Product from '../components/product';
import { useTheme } from '../context/ThemeContext';
import AppContext from '../store/AppContext';

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

const HomePage = () => {
  const router = useRouter();
  const [cate, setCate] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const { setProducts } = useContext(AppContext);
  const { isDarkMode, toggleTheme, colors } = useTheme();
  const [loading, setLoading] = useState(false);

  const getApiData = useMemo(() => {
    return async () => {
      setLoading(true);
      try {
        const response = await getAllProducts();
        if (response && response.products) {
          const normalizedProducts = response.products.map(product => ({
            ...product,
            category: (product?.category || '').toLowerCase() === 'console' ? 'Consoles' :
              (product?.category || '').toLowerCase() === 'consoles' ? 'Consoles' :
                (product?.category || '').toLowerCase() === 'accessory' ? 'Accessories' :
                  (product?.category || '').toLowerCase() === 'accessories' ? 'Accessories' :
                    product?.category || 'Other'
          }));

          const productCategories = [...new Set(normalizedProducts.map(p => p.category))];
          const categories = ['Consoles', 'Accessories', ...productCategories.filter(c =>
            c !== 'Consoles' && c !== 'Accessories'
          )];

          setAllProducts(normalizedProducts);
          setProducts(normalizedProducts);
          setCate(categories);
          setSelectedCategory('Consoles');
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        setCate(['Consoles', 'Accessories', 'Other']);
        setSelectedCategory('Consoles');
      } finally {
        setLoading(false);
      }
    };
  }, [setProducts]);

  useEffect(() => {
    getApiData();
  }, [getApiData]);

  const filteredProducts = useMemo(() => {
    if (!selectedCategory || !allProducts) return [];
    return allProducts.filter(product => {
      const productCategory = (product?.category || '').toLowerCase();
      const selectedCategoryLower = selectedCategory.toLowerCase();
      return productCategory === selectedCategoryLower;
    });
  }, [selectedCategory, allProducts]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      paddingTop: 10
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingBottom: 10,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.text,
    },
    categoryContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      paddingHorizontal: 10,
      paddingVertical: 5,
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
      gap: 8
    },
    categoryButton: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
    },
    selectedCategory: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    categoryText: {
      fontSize: 14,
      color: colors.text,
      fontWeight: '500',
    },
    selectedCategoryText: {
      color: isDarkMode ? '#000' : '#fff',
      fontWeight: '600',
    },
    productsGrid: {
      flex: 1,
      flexDirection: 'row',
      flexWrap: 'wrap',
      paddingHorizontal: 8,
      justifyContent: 'space-between',
      marginTop: 10
    },
    productWrapper: {
      width: '48%',
      marginBottom: 16
    },
    noProductsText: {
      fontSize: 16,
      color: colors.textSecondary,
      textAlign: 'center',
      padding: 20
    },
    loaderContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(255,255,255,0.5)',
      zIndex: 999,
    },
  });

  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      )}
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>PlayStation Store</Text>
      </View>

      <View style={styles.categoryContainer}>
        {cate.map((category, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.categoryButton,
              selectedCategory === category && styles.selectedCategory
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text style={[
              styles.categoryText,
              selectedCategory === category && styles.selectedCategoryText
            ]}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <AnimatedScrollView
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.productsGrid}>
          {filteredProducts.length > 0 ? (
            filteredProducts.map((item, index) => (
              <View key={`product-${item.id || index}`} style={styles.productWrapper}>
                <Product
                  id={item.id}
                  name={item.Name}
                  price={item.price}
                  description={item.description}
                  image={item.color?.[0]?.images?.[0]}
                  color={item.color}
                  category={item.category}
                />
              </View>
            ))
          ) : (
            <Text style={styles.noProductsText}>No products available in this category</Text>
          )}
        </View>
      </AnimatedScrollView>
    </View>
  );
};

export default HomePage;