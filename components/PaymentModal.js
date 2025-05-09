import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useTheme } from '../context/ThemeContext';

const PaymentModal = ({ visible, onClose, onSubmit, total, isProcessing, paymentType }) => {
  const { colors, isDarkMode } = useTheme();
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const formatPrice = (price) => {
    try {
      if (!price && price !== 0) return '0.00';
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

  const handleSubmit = () => {
    if (paymentType === 'visa') {
      if (!cardNumber || !expiryDate || !cvv || !name) {
        alert('Please fill in all fields');
        return;
      }
      onSubmit({
        type: 'visa',
        cardNumber,
        expiryDate,
        cvv,
        name
      });
    } else if (paymentType === 'paypal') {
      if (!email) {
        alert('Please enter your PayPal email');
        return;
      }
      if (!email.includes('@') || !email.includes('.')) {
        alert('Please enter a valid email address');
        return;
      }
      onSubmit({
        type: 'paypal',
        email
      });
    }
  };

  const formatCardNumber = (text) => {
    const cleaned = text.replace(/\s/g, '');
    const groups = cleaned.match(/.{1,4}/g);
    return groups ? groups.join(' ') : cleaned;
  };

  const formatExpiryDate = (text) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + (cleaned.length > 2 ? '/' + cleaned.slice(2, 4) : '');
    }
    return cleaned;
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={[styles.modalContainer, { backgroundColor: isDarkMode ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.2)' }]}>
          <View style={[styles.modalContent, { backgroundColor: isDarkMode ? colors.card : '#fff' }]}>
            <View style={styles.header}>
              <Text style={[styles.title, { color: colors.text }]}>
                {paymentType === 'visa' ? 'Card Payment' : 'PayPal Payment'}
              </Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <MaterialIcons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.scrollView}>
              <View style={styles.totalContainer}>
                <Text style={[styles.totalLabel, { color: colors.textSecondary }]}>Total Amount:</Text>
                <Text style={[styles.totalAmount, { color: colors.primary }]}>
                  ₪{formatPrice(total)}
                </Text>
              </View>

              {paymentType === 'visa' ? (
                <View style={styles.inputContainer}>
                  <Text style={[styles.label, { color: colors.text }]}>Card Number</Text>
                  <TextInput
                    style={[styles.input, { 
                      backgroundColor: isDarkMode ? colors.background : '#f5f5f5',
                      color: colors.text,
                      borderColor: isDarkMode ? colors.border : '#e1e1e1'
                    }]}
                    placeholder="1234 5678 9012 3456"
                    placeholderTextColor={colors.textSecondary}
                    value={cardNumber}
                    onChangeText={(text) => setCardNumber(formatCardNumber(text))}
                    keyboardType="numeric"
                    maxLength={19}
                  />

                  <View style={styles.row}>
                    <View style={styles.halfInput}>
                      <Text style={[styles.label, { color: colors.text }]}>Expiry Date</Text>
                      <TextInput
                        style={[styles.input, { 
                          backgroundColor: isDarkMode ? colors.background : '#f5f5f5',
                          color: colors.text,
                          borderColor: isDarkMode ? colors.border : '#e1e1e1'
                        }]}
                        placeholder="MM/YY"
                        placeholderTextColor={colors.textSecondary}
                        value={expiryDate}
                        onChangeText={(text) => setExpiryDate(formatExpiryDate(text))}
                        keyboardType="numeric"
                        maxLength={5}
                      />
                    </View>

                    <View style={styles.halfInput}>
                      <Text style={[styles.label, { color: colors.text }]}>CVV</Text>
                      <TextInput
                        style={[styles.input, { 
                          backgroundColor: isDarkMode ? colors.background : '#f5f5f5',
                          color: colors.text,
                          borderColor: isDarkMode ? colors.border : '#e1e1e1'
                        }]}
                        placeholder="123"
                        placeholderTextColor={colors.textSecondary}
                        value={cvv}
                        onChangeText={setCvv}
                        keyboardType="numeric"
                        maxLength={3}
                        secureTextEntry
                      />
                    </View>
                  </View>

                  <Text style={[styles.label, { color: colors.text }]}>Cardholder Name</Text>
                  <TextInput
                    style={[styles.input, { 
                      backgroundColor: isDarkMode ? colors.background : '#f5f5f5',
                      color: colors.text,
                      borderColor: isDarkMode ? colors.border : '#e1e1e1'
                    }]}
                    placeholder="John Doe"
                    placeholderTextColor={colors.textSecondary}
                    value={name}
                    onChangeText={setName}
                  />
                </View>
              ) : (
                <View style={styles.inputContainer}>
                  <View style={styles.paypalHeader}>
                    <MaterialIcons name="account-balance-wallet" size={30} color="#00457C" />
                    <Text style={styles.paypalTitle}>PayPal</Text>
                  </View>
                  <Text style={styles.paypalInfo}>
                    Pay securely using your PayPal account
                  </Text>
                  <Text style={[styles.label, { color: colors.text, marginTop: 20 }]}>PayPal Email</Text>
                  <TextInput
                    style={[styles.input, { 
                      backgroundColor: isDarkMode ? colors.background : '#f5f5f5',
                      color: colors.text,
                      borderColor: isDarkMode ? colors.border : '#e1e1e1'
                    }]}
                    placeholder="email@example.com"
                    placeholderTextColor={colors.textSecondary}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
              )}

              <TouchableOpacity
                style={[styles.payButton, { backgroundColor: paymentType === 'paypal' ? '#0070BA' : colors.primary }]}
                onPress={handleSubmit}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.payButtonText}>
                    {paymentType === 'visa' ? 'Pay with Card' : 'Pay with PayPal'}
                  </Text>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 8,
  },
  scrollView: {
    flexGrow: 0,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1',
  },
  totalLabel: {
    fontSize: 16,
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  halfInput: {
    width: '48%',
  },
  payButton: {
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  payButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  paypalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  paypalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00457C',
    marginLeft: 10,
  },
  paypalInfo: {
    textAlign: 'center',
    color: '#666',
    marginBottom: 20,
  },
});

export default PaymentModal;
