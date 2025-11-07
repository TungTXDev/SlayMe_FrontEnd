import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';


export default function Cart({ navigation }) {
  const DATA = [
    {
      id: '1',
      name: 'Nail xinh Tết',
      price: '200,000₫',
      time: '05/12/2025',
    },
    {
      id: '2',
      name: 'Mi xinh Tết',
      price: '250,000₫',
      time: '05/12/2025',
    },
    {
      id: '3',
      name: 'Gội đầu',
      price: '80,000₫',
      time: '05/12/2025',
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Trang chủ</Text>
        <View style={styles.searchBar}>
          <Text>Search for...</Text>
        </View>
        <View style={styles.cartAccount}>
          <Text>My Cart</Text>
          <Text>My Account</Text>
        </View>
      </View>

      {DATA.map((item) => (
        <View key={item.id} style={styles.item}>
          <Image
            source={require('../../assets/massage.png')}
            style={styles.itemImage}
          />
          <View style={styles.itemDetails}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemPrice}>Giá: {item.price}</Text>
            <Text style={styles.itemTime}>Thời Gian: {item.time}</Text>
            <TouchableOpacity style={styles.orderButton}>
              <Text style={styles.orderButtonText}>+ Đặt lịch</Text>
            </TouchableOpacity>
          </View>
          <View>
            <TouchableOpacity style={styles.removeItem}>
              <Text>Remove Item</Text>
            </TouchableOpacity>

          </View>
        </View>

      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
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
  searchBar: {
    backgroundColor: '#eee',
    padding: 5,
    borderRadius: 5,
  },
  cartAccount: {
    flexDirection: 'row',
  },
  item: {
    flexDirection: 'row',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 10,
  },
  itemImage: {
    width: 100,
    height: 100,
    marginRight: 10,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemPrice: {
    fontSize: 14,
    color: '#888',
  },
  itemTime: {
    fontSize: 14,
    color: '#888',
  },
  orderButton: {
    backgroundColor: '#f0f0f0',
    padding: 5,
    borderRadius: 5,
    marginTop: 10,
  },
  orderButtonText: {
    textAlign: 'center',
  },
  removeItem: {
    marginLeft: 10,
    padding: 15,
    backgroundColor: 'red',
  },
});