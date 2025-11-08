import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { COLORS, FONTS, SPACING, MESSAGES, ROUTER } from '../utils/constant';
import { useCart } from '../utils/hooks';
import { formatPrice } from '../utils/helpers';

export default function Cart({ navigation }) {
  const { 
    cartItems, 
    loading, 
    error, 
    removeFromCart, 
    getTotalPrice, 
    getTotalItems,
    refreshCart
  } = useCart();

  const handleRemoveItem = (itemId) => {
    Alert.alert(
      'Xác nhận',
      'Bạn có chắc chắn muốn xóa sản phẩm này?',
      [
        { text: 'Hủy', style: 'cancel' },
        { 
          text: 'Xóa', 
          style: 'destructive',
          onPress: () => removeFromCart(itemId)
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.loadingText}>{MESSAGES.LOADING}</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={refreshCart}
        >
          <Text style={styles.retryButtonText}>Thử lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Giỏ hàng của tôi</Text>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Quay lại</Text>
        </TouchableOpacity>
      </View>

      {cartItems.length === 0 ? (
        <View style={styles.emptyCart}>
          <Text style={styles.emptyCartText}>Giỏ hàng trống</Text>
          <TouchableOpacity 
            style={styles.shopButton}
            onPress={() => navigation.navigate(ROUTER.HOME)}
          >
            <Text style={styles.shopButtonText}>Tiếp tục mua sắm</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {cartItems.map((item) => (
            <View key={item.id} style={styles.item}>
              <Image
                source={item.image || require('../../assets/massage.png')}
                style={styles.itemImage}
              />
              <View style={styles.itemDetails}>
                <Text style={styles.itemName}>{item.name || 'Dịch vụ'}</Text>
                <Text style={styles.itemPrice}>Giá: {formatPrice(item.price || 0)}</Text>
                {item.time && (
                  <Text style={styles.itemTime}>Thời gian: {item.time}</Text>
                )}
                {item.storeName && (
                  <Text style={styles.itemStore}>Cửa hàng: {item.storeName}</Text>
                )}
                <TouchableOpacity 
                  style={styles.orderButton}
                  onPress={() => navigation.navigate(ROUTER.SERVICE_ORDER, { serviceId: item.id })}
                >
                  <Text style={styles.orderButtonText}>+ Đặt lịch</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity 
                style={styles.removeButton}
                onPress={() => handleRemoveItem(item.id)}
              >
                <Text style={styles.removeButtonText}>Xóa</Text>
              </TouchableOpacity>
            </View>
          ))}

          <View style={styles.totalSection}>
            <View style={styles.totalInfo}>
              <Text style={styles.totalItems}>
                Tổng số sản phẩm: {getTotalItems()}
              </Text>
              <Text style={styles.totalText}>
                Tổng cộng: {formatPrice(getTotalPrice())}
              </Text>
            </View>
            <TouchableOpacity 
              style={styles.checkoutButton}
              onPress={() => navigation.navigate(ROUTER.CREATE_ORDER, { cartItems, totalPrice: getTotalPrice() })}
            >
              <Text style={styles.checkoutButtonText}>Thanh toán</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
    padding: SPACING.MEDIUM,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.LARGE,
    paddingVertical: SPACING.MEDIUM,
  },
  title: {
    fontSize: FONTS.LARGE,
    fontWeight: 'bold',
    color: COLORS.TEXT,
  },
  backButton: {
    padding: SPACING.SMALL,
  },
  backButtonText: {
    fontSize: FONTS.REGULAR,
    color: COLORS.SECONDARY,
  },
  item: {
    flexDirection: 'row',
    backgroundColor: COLORS.WHITE,
    marginBottom: SPACING.MEDIUM,
    borderRadius: SPACING.SMALL,
    padding: SPACING.MEDIUM,
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  itemImage: {
    width: 100,
    height: 100,
    borderRadius: SPACING.SMALL,
    marginRight: SPACING.MEDIUM,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: FONTS.REGULAR,
    fontWeight: 'bold',
    color: COLORS.TEXT,
    marginBottom: SPACING.TINY,
  },
  itemPrice: {
    fontSize: FONTS.SMALL,
    color: COLORS.SECONDARY,
    marginBottom: SPACING.TINY,
  },
  itemTime: {
    fontSize: FONTS.SMALL,
    color: COLORS.GRAY,
    marginBottom: SPACING.TINY,
  },
  itemStore: {
    fontSize: FONTS.SMALL,
    color: COLORS.GRAY,
    marginBottom: SPACING.SMALL,
  },
  orderButton: {
    backgroundColor: COLORS.PRIMARY,
    padding: SPACING.SMALL,
    borderRadius: SPACING.TINY,
    alignSelf: 'flex-start',
  },
  orderButtonText: {
    fontSize: FONTS.SMALL,
    color: COLORS.TEXT,
    fontWeight: 'bold',
  },
  removeButton: {
    backgroundColor: COLORS.ERROR,
    paddingHorizontal: SPACING.MEDIUM,
    paddingVertical: SPACING.SMALL,
    borderRadius: SPACING.TINY,
    alignSelf: 'center',
  },
  removeButtonText: {
    color: COLORS.WHITE,
    fontSize: FONTS.SMALL,
    fontWeight: 'bold',
  },
  emptyCart: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.XLARGE * 2,
  },
  emptyCartText: {
    fontSize: FONTS.MEDIUM,
    color: COLORS.GRAY,
    marginBottom: SPACING.LARGE,
  },
  shopButton: {
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: SPACING.LARGE,
    paddingVertical: SPACING.MEDIUM,
    borderRadius: SPACING.SMALL,
  },
  shopButtonText: {
    fontSize: FONTS.REGULAR,
    color: COLORS.TEXT,
    fontWeight: 'bold',
  },
  totalSection: {
    backgroundColor: COLORS.WHITE,
    padding: SPACING.LARGE,
    borderRadius: SPACING.SMALL,
    marginTop: SPACING.MEDIUM,
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  totalInfo: {
    marginBottom: SPACING.MEDIUM,
  },
  totalItems: {
    fontSize: FONTS.SMALL,
    color: COLORS.GRAY,
    textAlign: 'center',
    marginBottom: SPACING.TINY,
  },
  totalText: {
    fontSize: FONTS.MEDIUM,
    fontWeight: 'bold',
    color: COLORS.TEXT,
    textAlign: 'center',
  },
  checkoutButton: {
    backgroundColor: COLORS.SECONDARY,
    padding: SPACING.MEDIUM,
    borderRadius: SPACING.SMALL,
    alignItems: 'center',
  },
  checkoutButtonText: {
    fontSize: FONTS.REGULAR,
    color: COLORS.WHITE,
    fontWeight: 'bold',
  },
  loadingText: {
    fontSize: FONTS.REGULAR,
    color: COLORS.GRAY,
  },
  errorText: {
    fontSize: FONTS.REGULAR,
    color: COLORS.ERROR,
    marginBottom: SPACING.MEDIUM,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: SPACING.LARGE,
    paddingVertical: SPACING.MEDIUM,
    borderRadius: SPACING.SMALL,
  },
  retryButtonText: {
    fontSize: FONTS.REGULAR,
    color: COLORS.WHITE,
    fontWeight: 'bold',
  },
});