import React, { useCallback, useMemo, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import { useTheme } from '@react-navigation/native';

const PaymentMethodBottomSheet = ({ visible, onClose, onSelectVisa, onSelectPaypal }) => {
  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ['50%'], []);
  const isDarkMode = useColorScheme() === 'dark';
  const { colors } = useTheme();

  const handleSheetChanges = useCallback((index) => {
    if (index === -1) {
      onClose();
    }
  }, [onClose]);

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
        <Text style={[styles.title, { color: colors.text }]}>Select Payment Method</Text>
        
        <TouchableOpacity
          style={[styles.paymentOption, { backgroundColor: isDarkMode ? colors.border : '#f5f5f5' }]}
          onPress={onSelectVisa}
        >
          <Text style={[styles.paymentOptionText, { color: colors.text }]}>Credit Card</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.paymentOption, { backgroundColor: isDarkMode ? colors.border : '#f5f5f5' }]}
          onPress={onSelectPaypal}
        >
          <Text style={[styles.paymentOptionText, { color: colors.text }]}>PayPal</Text>
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
  paymentOption: {
    width: '100%',
    height: 60,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  paymentOptionText: {
    fontSize: 18,
    fontWeight: '500',
  },
});

export default PaymentMethodBottomSheet;
