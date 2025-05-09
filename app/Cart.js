import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import BottomSheet from '@gorhom/bottom-sheet';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Image, Linking, Platform, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import PaymentBottomSheet from '../components/PaymentBottomSheet';
import PaymentMethodBottomSheet from '../components/PaymentMethodBottomSheet';
import { useTheme } from '../context/ThemeContext';
import { usePayment } from '../services/PaymentService';
import { processPaypalPayment } from '../services/PaypalService';
import AppContext from '../store/AppContext';

const Cart = () => {
  const router = useRouter();
  const { cart, setCart, orders, setOrders } = useContext(AppContext);
  const { colors, isDarkMode } = useTheme();
  const { processPayment } = usePayment();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showPaymentMethodModal, setShowPaymentMethodModal] = useState(false);
  const [showVisaModal, setShowVisaModal] = useState(false);
  const [showPaypalModal, setShowPaypalModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [total, setTotal] = useState(0);
  const lottieRef = useRef(null);
  const successBottomSheetRef = useRef(null);

  // Load cart from AsyncStorage
  const loadCart = async () => {
    try {
      const savedCart = await AsyncStorage.getItem('cart');
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error('Failed to load cart:', error);
    }
  };

  // Save cart to AsyncStorage
  const saveCart = async (cart) => {
    try {
      await AsyncStorage.setItem('cart', JSON.stringify(cart));
      console.log('Cart saved:', cart); // Debugging log
    } catch (error) {
      console.error('Failed to save cart:', error);
    }
  };

  // Update the cart and save to AsyncStorage
  const updateCart = (newCart) => {
    console.log('Updating cart:', newCart); // Debugging log
    setCart(newCart);
    saveCart(newCart);
  };

  const removeFromCart = (productId) => {
    updateCart(prevCart => {
      const updatedCart = { ...prevCart };
      delete updatedCart[productId];
      return updatedCart;
    });
  };

  const handleIncreaseQuantity = (productId) => {
    updateCart(prevCart => {
      const updatedCart = {
        ...prevCart,
        [productId]: {
          ...prevCart[productId],
          quantity: (prevCart[productId]?.quantity || 1) + 1
        }
      };
      console.log('Increased quantity, new cart:', updatedCart); // Debugging log
      return updatedCart;
    });
  };

  const handleDecreaseQuantity = (productId) => {
    updateCart(prevCart => {
      const currentQuantity = prevCart[productId]?.quantity || 1;
      if (currentQuantity <= 1) return prevCart;

      const updatedCart = {
        ...prevCart,
        [productId]: {
          ...prevCart[productId],
          quantity: currentQuantity - 1
        }
      };
      console.log('Decreased quantity, new cart:', updatedCart); // Debugging log
      return updatedCart;
    });
  };

  const calculateTotal = () => {
    try {
      if (!cart || Object.keys(cart).length === 0) return 0;

      const total = Object.values(cart).reduce((total, item) => {
        if (!item) return total;
        const price = item.price ? parseFloat(item.price) : 0;
        const quantity = item.quantity ? parseInt(item.quantity) : 1;
        return total + (price * quantity);
      }, 0);

      return total || 0;
    } catch (error) {
      console.error('Error calculating total:', error);
      return 0;
    }
  };

  const formatPrice = (price) => {
    try {
      const number = parseFloat(price);
      return number ? number.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }) : '0.00';
    } catch (error) {
      console.error('Error formatting price:', error);
      return '0.00';
    }
  };

  const handleRemoveFromCart = (productId) => {
    Alert.alert('Delete Confirmation', 'Are you sure you want to delete this item?', [
      {
        text: 'No',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'Yes',
        onPress: () => {
          updateCart(prevCart => {
            const updatedCart = { ...prevCart };
            delete updatedCart[productId];
            return updatedCart;
          });
        }
      },
    ]);
  };

  const handleCheckout = async () => {
    if (Object.keys(cart).length === 0) {
      Alert.alert("Error", "Your cart is empty");
      return;
    }
    const total = calculateTotal();
    setTotal(total);
    setShowPaymentMethodModal(true);
  };

  const handleVisaPayment = () => {
    setShowPaymentMethodModal(false);
    setShowVisaModal(true);
  };

  const handlePaypalPayment = () => {
    const url = "https://www.paypal.com/paypalme/karemazem";

       Linking.openURL(url);

  };


  const handlePaymentSubmit = async (paymentDetails) => {
    setIsProcessing(true);
    try {
      let result;
      if (paymentDetails.type === 'visa') {
        // Add total amount to payment details
        const paymentWithAmount = {
          ...paymentDetails,
          amount: total
        };
        result = await processPayment(paymentWithAmount);
      } else if (paymentDetails.type === 'paypal') {
        result = await processPaypalPayment(paymentDetails.email, total);
      }

      if (!result || !result.success) {
        throw new Error('Payment processing failed');
      }

      // Create new order
      const newOrder = {
        id: result.transactionId,
        date: new Date().toLocaleDateString(),
        status: 'Pending',
        items: Object.values(cart).map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          selectedColor: item.selectedColor
        })),
        totalAmount: total,
        paymentMethod: paymentDetails.type,
        paymentId: result.transactionId
      };

      // Add order to orders list
      setOrders(prevOrders => [...prevOrders, newOrder]);

      // Clear cart after successful payment
      await AsyncStorage.removeItem('cart');
      setCart({});

      // Reset all modals
      setShowVisaModal(false);
      setShowPaypalModal(false);
      setShowPaymentMethodModal(false);
      setIsProcessing(false);

      // Show success message and navigate to Orders
      Alert.alert(
        'Order Placed Successfully',
        `Your order has been placed.\nOrder ID: ${result.transactionId}`,
        [{
          text: 'View Order',
          onPress: () => router.push('/Orders')
        }]
      );
    } catch (error) {
      console.error('Payment error:', error);
      setIsProcessing(false);
      setShowVisaModal(false);
      setShowPaypalModal(false);
      setShowPaymentMethodModal(false);
      Alert.alert('Payment Failed', 'There was an error processing your payment. Please try again.');
    }
  };

  const updateCartItemQuantity = (productId, quantity) => {
    updateCart(prevCart => {
      const updatedCart = {
        ...prevCart,
        [productId]: {
          ...prevCart[productId],
          quantity: quantity
        }
      };
      return updatedCart;
    });
  };

  // Call loadCart when the component mounts
  useEffect(() => {
    loadCart();
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? colors.background : '#fff' }]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Cart
          <Text style={styles.itemCount}>
            {' '}({Object.keys(cart).length} items)
          </Text>
        </Text>
      </View>

      {Object.keys(cart).length === 0 ? (
        <View style={[styles.emptyContainer, { backgroundColor: isDarkMode ? colors.background : '#fff' }]}>
          <Text style={[styles.emptyText, { color: colors.text }]}>Your cart is empty</Text>
          <TouchableOpacity
            style={[styles.shopNowButton, { backgroundColor: colors.primary }]}
            onPress={() => router.push('/(tabs)')}
          >
            <Text style={styles.shopNowText}>Shop Now</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView style={styles.cartList}>
          {Object.values(cart).map((item) => (
            <View key={item.id} style={[styles.cartItem, { backgroundColor: isDarkMode ? colors.surface : '#fff' }]}>
              <Image source={{ uri: item.image }} style={styles.productImage} />
              <View style={styles.productInfo}>
                <Text style={[styles.productName, { color: colors.text }]} numberOfLines={2}>
                  {item.name}
                </Text>
                <Text style={[styles.productPrice, { color: colors.primary }]}>
                  ₪{(item.price * item.quantity).toFixed(2)}
                </Text>
                <View style={styles.quantityContainer}>
                  <Text style={[styles.quantity, { color: colors.text }]}>Quantity: {item.quantity}</Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => handleRemoveFromCart(item.id)}
              >
                <MaterialIcons name="delete" size={24} color={colors.error} />
              </TouchableOpacity>

            </View>
          ))}
        </ScrollView>
      )}

      {Object.keys(cart).length > 0 && (
        <View style={[styles.checkoutContainer, { backgroundColor: isDarkMode ? colors.card : '#fff' }]}>
          <View style={styles.totalContainer}>
            <Text style={[styles.totalText, { color: colors.textSecondary }]}>Total:</Text>
            <Text style={[styles.totalAmount, { color: colors.text }]}>
              ₪{formatPrice(calculateTotal())}
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.checkoutButton, { backgroundColor: colors.primary }]}
            onPress={handleCheckout}
          >
            <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
          </TouchableOpacity>
        </View>
      )}

      <PaymentMethodBottomSheet
        visible={showPaymentMethodModal}
        onClose={() => setShowPaymentMethodModal(false)}
        onSelectVisa={handleVisaPayment}
        onSelectPaypal={handlePaypalPayment}
      />

      <PaymentBottomSheet
        visible={showVisaModal}
        total={total}
        onClose={() => setShowVisaModal(false)}
        onSubmit={() => handlePaymentSubmit('visa')}
        isProcessing={isProcessing}
        paymentType="visa"
      />

      <PaymentBottomSheet
        visible={showPaypalModal}
        total={total}
        onClose={() => setShowPaypalModal(false)}
        onSubmit={() => handlePaymentSubmit('paypal')}
        isProcessing={isProcessing}
        paymentType="paypal"
      />

      <BottomSheet
        ref={successBottomSheetRef}
        index={showSuccessModal ? 0 : -1}
        snapPoints={['50%']}
        onChange={(index) => {
          if (index === -1) setShowSuccessModal(false);
        }}
        enablePanDownToClose
        backgroundStyle={{
          backgroundColor: isDarkMode ? colors.card : '#fff',
        }}
      >
        <View style={styles.successContainer}>
          <Text style={[styles.successTitle, { color: colors.text }]}>Payment Successful!</Text>
          <Text style={[styles.successMessage, { color: colors.text }]}>
            Your order has been placed successfully.
          </Text>
          <TouchableOpacity
            style={styles.continueButton}
            onPress={() => {
              setShowSuccessModal(false);
              navigation.navigate('Home');
            }}
          >
            <Text style={styles.continueButtonText}>Continue Shopping</Text>
          </TouchableOpacity>
        </View>
      </BottomSheet>

      {isProcessing && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 60 : StatusBar.currentHeight + 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
  },
  itemCount: {
    fontSize: 16,
    fontWeight: '400',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyImage: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 20,
  },
  emptySubText: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  shopNowButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 25,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  shopNowText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cartList: {
    flex: 1,
    padding: 16,
  },
  cartItem: {
    flexDirection: 'row',
    padding: 16,
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  productInfo: {
    flex: 1,
    marginLeft: 16,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantity: {
    marginHorizontal: 16,
    fontSize: 16,
    fontWeight: '600',
  },
  removeButton: {
    padding: 8,
  },
  checkoutContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  totalText: {
    fontSize: 16,
    fontWeight: '600',
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: '700',
  },
  checkoutButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    minHeight: 200,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  paymentOptionText: {
    flex: 1,
    marginLeft: 16,
    fontSize: 16,
    fontWeight: '500',
  },
  paymentIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  lottieAnimation: {
    width: 150,
    height: 150,
  },
  successText: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Cart;