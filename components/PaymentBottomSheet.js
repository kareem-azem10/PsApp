import React, { useCallback, useMemo, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  useColorScheme,
} from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import { useTheme } from '@react-navigation/native';

const PaymentBottomSheet = ({ visible, onClose, onSubmit, total, isProcessing, paymentType }) => {
  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ['90%'], []);
  const isDarkMode = useColorScheme() === 'dark';
  const { colors } = useTheme();

  const handleSheetChanges = useCallback((index) => {
    if (index === -1) {
      onClose();
    }
  }, [onClose]);

  const handleSubmit = () => {
    onSubmit();
  };

  React.useEffect(() => {
    if (visible) {
      bottomSheetRef.current?.expand();
    } else {
      bottomSheetRef.current?.close();
    }
  }, [visible]);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={visible ? 0 : -1}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      enablePanDownToClose
      backgroundStyle={{
        backgroundColor: isDarkMode ? colors.card : '#fff',
      }}
    >
      <View style={styles.contentContainer}>
        <Text style={[styles.title, { color: colors.text }]}>
          {paymentType === 'visa' ? 'Credit Card Payment' : 'PayPal Payment'}
        </Text>
        <View style={styles.totalContainer}>
          <Text style={[styles.totalText, { color: colors.text }]}>Total Amount:</Text>
          <Text style={[styles.amount, { color: colors.text }]}>${total.toFixed(2)}</Text>
        </View>

        {paymentType === 'visa' ? (
          <>
            <TextInput
              style={[styles.input, { backgroundColor: isDarkMode ? colors.border : '#f5f5f5', color: colors.text }]}
              placeholder="Card Number"
              placeholderTextColor={colors.text}
            />
            <View style={styles.row}>
              <TextInput
                style={[styles.input, styles.halfInput, { backgroundColor: isDarkMode ? colors.border : '#f5f5f5', color: colors.text }]}
                placeholder="MM/YY"
                placeholderTextColor={colors.text}
              />
              <TextInput
                style={[styles.input, styles.halfInput, { backgroundColor: isDarkMode ? colors.border : '#f5f5f5', color: colors.text }]}
                placeholder="CVV"
                placeholderTextColor={colors.text}
              />
            </View>
          </>
        ) : (
          <Text style={[styles.paypalText, { color: colors.text }]}>
            You will be redirected to PayPal to complete your payment.
          </Text>
        )}

        <TouchableOpacity
          style={[styles.submitButton, { opacity: isProcessing ? 0.7 : 1 }]}
          onPress={handleSubmit}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>
              {paymentType === 'visa' ? 'Pay Now' : 'Continue to PayPal'}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  totalText: {
    fontSize: 18,
  },
  amount: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    height: 50,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  paypalText: {
    textAlign: 'center',
    marginVertical: 20,
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default PaymentBottomSheet;
