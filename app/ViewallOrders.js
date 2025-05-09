import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useContext, useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import AppContext from '../store/AppContext';

const ViewAllOrders = () => {
  const router = useRouter();
  const { orders, setOrders } = useContext(AppContext);
  const { colors, isDarkMode } = useTheme();
  const [selectedStatus, setSelectedStatus] = useState('all');

  const handleCancelOrder = (orderId) => {
    Alert.alert(
      "Cancel Order",
      "Are you sure you want to cancel this order?",
      [
        {
          text: "No",
          style: "cancel"
        },
        {
          text: "Yes",
          onPress: () => {
            setOrders(prevOrders => 
              prevOrders.map(order => 
                order.id === orderId 
                  ? { ...order, status: 'Cancelled' }
                  : order
              )
            );
          },
          style: "destructive"
        }
      ]
    );
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

  const FilterButton = ({ status, label }) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        { backgroundColor: isDarkMode ? colors.card : '#fff' },
        selectedStatus === status && { 
          backgroundColor: colors.primary,
          borderColor: colors.primary 
        }
      ]}
      onPress={() => setSelectedStatus(status)}
    >
      <Text style={[
        styles.filterButtonText,
        { color: selectedStatus === status ? '#fff' : colors.text }
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const filteredOrders = orders.filter(order => {
    if (selectedStatus === 'all') return true;
    return order.status.toLowerCase() === selectedStatus;
  });

  const renderOrder = ({ item: order }) => {
    if (!order) return null;
    return (
      <View style={[styles.orderCard, { backgroundColor: isDarkMode ? colors.card : '#fff' }]}>
        <View style={styles.orderHeader}>
          <View style={styles.orderInfo}>
            <MaterialIcons name="receipt" size={24} color={colors.primary} />
            <View style={styles.orderTexts}>
              <Text style={[styles.orderId, { color: colors.text }]}>Order #{order.id.slice(-4)}</Text>
              <Text style={[styles.orderDate, { color: colors.textSecondary }]}>{order.date}</Text>
            </View>
          </View>
          <View style={[
            styles.statusBadge, 
            { backgroundColor: order.status === 'Delivered' ? '#4CAF50' : order.status === 'Cancelled' ? '#FF9800' : '#FFC107' }
          ]}>
            <MaterialIcons 
              name={order.status === 'Delivered' ? 'check-circle' : order.status === 'Cancelled' ? 'cancel' : 'schedule'} 
              size={16} 
              color="#fff" 
              style={styles.statusIcon}
            />
            <Text style={styles.statusText}>{order.status}</Text>
          </View>
        </View>

        <FlatList
          horizontal
          data={order.items}
          keyExtractor={(item, index) => `${order.id}-${index}`}
          showsHorizontalScrollIndicator={false}
          style={styles.productsScroll}
          renderItem={({ item }) => (
            <View style={styles.productCard}>
              <Image source={{ uri: item.image }} style={styles.productImage} />
              <View style={styles.productInfo}>
                <Text style={[styles.productName, { color: colors.text }]} numberOfLines={2}>
                  {item.name}
                </Text>
                <Text style={[styles.productQuantity, { color: colors.textSecondary }]}>
                  Qty: {item.quantity}
                </Text>
                <Text style={[styles.productPrice, { color: colors.primary }]}>
                  ₪{formatPrice(item.price * item.quantity)}
                </Text>
              </View>
            </View>
          )}
        />

        <View style={styles.orderFooter}>
          <View style={styles.totalContainer}>
            <Text style={[styles.totalLabel, { color: colors.textSecondary }]}>Total:</Text>
            <Text style={[styles.totalAmount, { color: colors.text }]}>
              ₪{formatPrice(order.totalAmount)}
            </Text>
          </View>
          {order.status === 'Pending' && (
            <TouchableOpacity 
              style={[styles.cancelButton, { backgroundColor: colors.error }]}
              onPress={() => handleCancelOrder(order.id)}
            >
              <MaterialIcons name="cancel" size={16} color="#fff" />
              <Text style={styles.cancelButtonText}>Cancel Order</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? colors.background : '#f8f9fa' }]}>
      <View style={[styles.header, { backgroundColor: isDarkMode ? colors.card : '#fff' }]}>
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <MaterialIcons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>All Orders</Text>
        </View>

        <View style={styles.filtersContainer}>
          <FilterButton status="all" label="All" />
          <FilterButton status="pending" label="Pending" />
          <FilterButton status="delivered" label="Delivered" />
          <FilterButton status="cancelled" label="Cancelled" />
        </View>
      </View>

      <FlatList
        data={filteredOrders}
        renderItem={renderOrder}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialIcons name="receipt-long" size={64} color={colors.textSecondary} />
            <Text style={[styles.emptyText, { color: colors.text }]}>No Orders Found</Text>
            <Text style={[styles.emptySubText, { color: colors.textSecondary }]}>
              {selectedStatus === 'all' 
                ? 'You haven\'t placed any orders yet'
                : `No ${selectedStatus} orders found`}
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButton: {
    marginRight: 16,
    padding: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
  },
  filtersContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    padding: 16,
  },
  orderCard: {
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  orderTexts: {
    gap: 4,
  },
  orderId: {
    fontSize: 16,
    fontWeight: '600',
  },
  orderDate: {
    fontSize: 12,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statusIcon: {
    marginRight: 4,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  productsScroll: {
    marginVertical: 12,
  },
  productCard: {
    width: 140,
    marginRight: 12,
    borderRadius: 8,
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: 100,
    resizeMode: 'cover',
  },
  productInfo: {
    padding: 8,
  },
  productName: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 4,
  },
  productQuantity: {
    fontSize: 11,
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: '600',
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  totalContainer: {
    gap: 4,
  },
  totalLabel: {
    fontSize: 12,
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: '700',
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    textAlign: 'center',
  },
});

export default ViewAllOrders;