import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';

export default function ServiceOrder({ navigation }) {
  // Giả sử đây là một danh sách các thông báo đã đặt lịch thành công
  const notifications = [
    {
      id: 1,
      serviceName: "Cắt tóc",
      serviceDate: "10:00 AM, 15/02/2025",
      location: "Tiệm tóc ABC",
      status: "Đặt lịch thành công"
    },
    {
      id: 2,
      serviceName: "Massage",
      serviceDate: "2:00 PM, 16/02/2025",
      location: "Spa XYZ",
      status: "Đặt lịch thành công"
    },
    {
      id: 3,
      serviceName: "Chăm sóc da",
      serviceDate: "9:30 AM, 17/02/2025",
      location: "Beauty Center",
      status: "Đặt lịch thành công"
    },
    {
        id: 4,
        serviceName: "Chăm sóc da",
        serviceDate: "9:30 AM, 17/02/2025",
        location: "Beauty Center",
        status: "Đặt lịch thành công"
      },
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Thông báo Đặt lịch</Text>

      {notifications.map((notification) => (
        <View key={notification.id} style={styles.notificationCard}>
          <Text style={styles.serviceName}>{notification.serviceName}</Text>
          <Text style={styles.serviceDetails}>Thời gian: {notification.serviceDate}</Text>
          <Text style={styles.serviceDetails}>Địa điểm: {notification.location}</Text>
          <Text style={styles.status}>{notification.status}</Text>

          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              // Bạn có thể dẫn đến chi tiết dịch vụ hoặc thông báo
              navigation.navigate('ServiceDetail', { serviceId: notification.id });
            }}
          >
            <Text style={styles.buttonText}>Xem chi tiết</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  title: {
    textAlign: 'center',
    marginTop: 30,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  notificationCard: {
    backgroundColor: '#F6C7F5',
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    elevation: 5, // Tạo hiệu ứng bóng
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  serviceDetails: {
    fontSize: 16,
    color: '#555',
    marginTop: 5,
  },
  status: {
    fontSize: 14,
    color: 'green',
    marginTop: 10,
    fontWeight: 'bold',
  },
  button: {
    marginTop: 15,
    backgroundColor: '#000000',
    paddingVertical: 10,
    borderRadius: 30,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
