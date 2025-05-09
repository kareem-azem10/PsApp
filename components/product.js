import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { memo, useContext } from 'react';
import { Dimensions, Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import AppContext from '../store/AppContext';

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2;

const Product = memo((props) => {
  const { colors, isDarkMode } = useTheme();
  const router = useRouter();
  const { setProducts } = useContext(AppContext);

  const handleProductPress = () => {
    router.push({
      pathname: "/ProductInfo",
      params: {
        id: props.id,
        Name: props.name,
        price: props.price,
        description: props.description,
        color: JSON.stringify(props.color || []),
        category: props.category,
        defaultImage: props.image || props.color?.[0]?.images?.[0],
      }
    });
  };

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.card,
      borderRadius: 20,
      padding: 12,
      margin: 8,
      ...Platform.select({
        ios: {
          shadowColor: colors.text,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.2,
          shadowRadius: 8,
        },
        android: {
          elevation: 6,
        },
      }),
      flex: 1,
      borderWidth: isDarkMode ? 1 : 0,
      borderColor: colors.border,
    },
    imageContainer: {
      height: 180,
      width: '100%',
      backgroundColor: colors.surface,
      borderRadius: 16,
      overflow: 'hidden',
      marginBottom: 12,
      ...Platform.select({
        ios: {
          shadowColor: colors.text,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        android: {
          elevation: 2,
        },
      }),
    },
    image: {
      width: '100%',
      height: '100%',
      resizeMode: 'contain',
      backgroundColor: colors.surface,
    },
    gradient: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      height: '60%',
      opacity: 0.8,
    },
    priceTag: {
      position: 'absolute',
      bottom: 12,
      right: 12,
      backgroundColor: colors.primary,
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 20,
      ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 4,
        },
        android: {
          elevation: 4,
        },
      }),
    },
    priceText: {
      color: isDarkMode ? '#000' : '#fff',
      fontWeight: '700',
      fontSize: 15,
    },
    textContainer: {
      padding: 6,
    },
    title: {
      fontSize: 17,
      fontWeight: '700',
      marginBottom: 6,
      color: colors.text,
    },
    category: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 10,
      fontWeight: '500',
    },
    viewDetailsButton: {
      backgroundColor: colors.primary,
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 8,
    },
    viewDetailsText: {
      color: isDarkMode ? '#000' : '#fff',
      fontWeight: '600',
      fontSize: 14,
    }
  });

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: props.image }}
          style={styles.image}
          resizeMode="contain"
        />
        <LinearGradient
          colors={['transparent', colors.card]}
          style={styles.gradient}
        />
        <View style={styles.priceTag}>
          <Text style={styles.priceText}>
            ₪{props.price}
          </Text>
        </View>
      </View>
      
      <View style={styles.textContainer}>
        <Text style={styles.title} numberOfLines={2}>
          {props.name}
        </Text>
        {props.category && (
          <Text style={styles.category} numberOfLines={1}>
            {props.category}
          </Text>
        )}
        <TouchableOpacity 
          style={styles.viewDetailsButton}
          onPress={handleProductPress}
          activeOpacity={0.7}
        >
          <Text style={styles.viewDetailsText}>View Details</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
});

Product.displayName = 'Product';

export default Product;