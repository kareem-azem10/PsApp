import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useContext } from 'react';
import { Dimensions, Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AppContext from '../../store/AppContext';

const { width } = Dimensions.get('window');

const ProductDetails = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { cart, setCart } = useContext(AppContext);

  const addToCart = () => {
    const newItem = {
      id: params.id,
      Name: params.Name,
      price: parseFloat(params.price),
      description: params.description,
      color: {
          type: [
              {
                  colorName: params.colorName,
                  color: params.color,
                  images: Array.isArray(params.image) ? params.image : [params.image],
              }
          ],
          require: true
      },
      category: { type: String, required: false },
      amount: 1,
    };

    const existingItemIndex = cart.findIndex(item => item.id === newItem.id);
    
    if (existingItemIndex !== -1) {
      const updatedCart = [...cart];
      updatedCart[existingItemIndex].amount += 1;
      setCart(updatedCart);
    } else {
      setCart([...cart, newItem]);
    }
  };

  const imageSource = Array.isArray(params.image) ? params.image[0] : params.image;

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <MaterialIcons name="arrow-back" size={24} color="#2c3e50" />
          </TouchableOpacity>
        </View>

        <View style={styles.imageContainer}>
          <Image
            source={{ uri: imageSource }}
            style={styles.image}
            resizeMode="contain"
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.7)']}
            style={styles.gradient}
          />
        </View>

        <View style={styles.detailsContainer}>
          <Text style={styles.title}>{params.Name}</Text>
          <Text style={styles.price}>₪{params.price}</Text>
          <Text style={styles.category}>{params.category}</Text>
          <Text style={styles.description}>{params.description}</Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.addToCartButton}
          onPress={addToCart}
        >
          <MaterialIcons name="add-shopping-cart" size={24} color="#fff" />
          <Text style={styles.addToCartText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    padding: 16,
    paddingTop: Platform.OS === 'ios' ? 60 : 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    width: width,
    height: width,
    backgroundColor: '#f8f9fa',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '50%',
  },
  detailsContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  price: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
  },
  category: {
    fontSize: 16,
    color: '#7f8c8d',
    marginBottom: 16,
    textTransform: 'capitalize',
  },
  description: {
    fontSize: 16,
    color: '#34495e',
    lineHeight: 24,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  addToCartButton: {
    backgroundColor: '#2c3e50',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
  },
  addToCartText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default ProductDetails;
