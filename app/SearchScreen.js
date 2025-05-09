import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useContext, useRef, useState } from 'react';
import { Animated, FlatList, Image, Platform, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import AppContext from '../store/AppContext';

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const SearchScreen = () => {
  const router = useRouter();
  const { products } = useContext(AppContext);
  const { colors, isDarkMode } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const scrollY = useRef(new Animated.Value(0)).current;

  const searchBarHeight = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [0, -50],
    extrapolate: 'clamp',
  });

  const opacity = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const handleSearch = useCallback((text) => {
    setSearchQuery(text);
    if (text.trim() === '') {
      setFilteredProducts([]);
      return;
    }

    const searchResults = products.filter(product => {
      const searchTerms = text.toLowerCase();
      const productName = product.Name?.toLowerCase() || '';
      const productDescription = product.description?.toLowerCase() || '';
      const productCategory = product.category?.toLowerCase() || '';
      
      return (
        productName.includes(searchTerms) ||
        productDescription.includes(searchTerms) ||
        productCategory.includes(searchTerms)
      );
    }).map(product => ({
      ...product,
      image: product.color?.[0]?.images?.[0] || product.image || null
    }));

    setFilteredProducts(searchResults);
  }, [products]);

  const handleProductPress = useCallback((item) => {
    const productImage = item.color?.[0]?.images?.[0] || item.image;
    
    router.push({
      pathname: "/ProductInfo",
      params: {
        id: item.id,
        Name: item.Name,
        image: productImage,
        description: item.description,
        price: item.price,
        category: item.category,
        color: JSON.stringify(item.color || []),
        defaultImage: productImage
      }
    });
  }, [router]);

  const renderProduct = useCallback(({ item }) => {
    const productImage = item.color?.[0]?.images?.[0] || item.image;
    
    return (
      <TouchableOpacity 
        style={[styles.productCard, { backgroundColor: isDarkMode ? colors.card : '#fff' }]}
        onPress={() => handleProductPress(item)}
      >
        <Image source={{ uri: productImage }} style={styles.productImage} />
        <View style={styles.productInfo}>
          <Text style={[styles.productName, { color: colors.text }]} numberOfLines={2}>
            {item.Name}
          </Text>
          <Text style={[styles.productPrice, { color: colors.primary }]}>
            ₪{(parseFloat(item.price) || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }, [colors, handleProductPress]);

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: true }
  );

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? colors.background : '#fff' }]}>
      <Animated.View 
        style={[
          styles.header,
          { 
            backgroundColor: isDarkMode ? colors.background : '#fff',
            borderBottomColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
          },
          { transform: [{ translateY: searchBarHeight }], opacity }
        ]}
      >
        <View style={[styles.searchContainer, { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }]}>
          <MaterialIcons name="search" size={24} color={isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.5)'} />
          <TextInput
            style={[
              styles.searchInput,
              { 
                color: colors.text,
                placeholderTextColor: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)'
              }
            ]}
            placeholder="Search for games..."
            value={searchQuery}
            onChangeText={handleSearch}
            placeholderTextColor={isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)'}
          />
        </View>
      </Animated.View>

      <AnimatedFlatList
        data={filteredProducts}
        renderItem={renderProduct}
        keyExtractor={item => item.id?.toString() || Math.random().toString()}
        contentContainerStyle={styles.productList}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: colors.text }]}>
              {searchQuery.trim() ? 'No products found' : 'Start typing to search products'}
            </Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 60 : StatusBar.currentHeight,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingBottom: 10,
    zIndex: 1,
    borderBottomWidth: 1,
  },
  searchContainer: {
    flex: 1,
    elevation: 0,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  searchInput: {
    fontSize: 16,
    flex: 1,
    marginLeft: 10,
  },
  productList: {
    padding: 15,
  },
  productCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 15,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  productInfo: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'center',
  },
  productName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2c3e50',
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#95a5a6',
    textAlign: 'center',
  },
});

export default SearchScreen;
