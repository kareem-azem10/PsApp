import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const usePayment = () => {
  const processPayment = async (paymentDetails) => {
    try {
      // Validate payment details
      if (!paymentDetails || !paymentDetails.cardNumber || !paymentDetails.expiryDate || !paymentDetails.cvv) {
        throw new Error('Invalid payment details');
      }

      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Create a payment record
      const payment = {
        id: Date.now().toString(),
        transactionId: 'VISA-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
        amount: paymentDetails.amount,
        cardNumber: paymentDetails.cardNumber.slice(-4), // Store only last 4 digits
        status: 'success',
        date: new Date().toISOString(),
      };

      // Store payment in AsyncStorage
      const payments = await AsyncStorage.getItem('payments');
      const existingPayments = payments ? JSON.parse(payments) : [];
      existingPayments.push(payment);
      await AsyncStorage.setItem('payments', JSON.stringify(existingPayments));

      return {
        success: true,
        transactionId: payment.transactionId
      };
    } catch (error) {
      console.error('Payment processing error:', error);
      Alert.alert('Error', 'Failed to process payment');
      return false;
    }
  };

  return {
    processPayment,
  };
};
